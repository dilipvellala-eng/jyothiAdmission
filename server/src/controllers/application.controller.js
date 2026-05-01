import { Application } from '../models/application.model.js';
import { ClassSeat } from '../models/classSeat.model.js';
import { ApiError } from '../utils/apiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { applicationsToCsv } from '../services/export.service.js';
import { buildApplicationPdf } from '../services/pdf.service.js';
import { buildSignedDocumentUrl, stripTransientDocumentFields } from '../services/document.service.js';
import { findDuplicateApplications } from '../services/duplicate.service.js';
import { generateApplicationId } from '../services/applicationId.service.js';
import { notifyStatusChange, notifySubmission } from '../services/notification.service.js';

function parsePayload(req) {
  const body = { ...req.body };
  if (typeof body.parent === 'string') body.parent = JSON.parse(body.parent);
  body.admissionYear = normalizeAdmissionYear(body.admissionYear, body.dateOfAdmission);
  body.documents = typeof body.documents === 'object' && body.documents !== null ? body.documents : {};
  for (const field of ['photo', 'birthCertificate', 'transferCertificate']) {
    if (typeof body[field] === 'string' && body[field]) {
      body.documents[field] = parseDocumentPayload(body[field]);
    }
    delete body[field];
    if (body.documents[field]) body.documents[field] = stripTransientDocumentFields(body.documents[field]);
  }
  for (const field of ['dateOfAdmission']) {
    if (body[field] === '') delete body[field];
  }
  if (body.privacyConsentAccepted === 'true' || body.privacyConsentAccepted === true) {
    body.privacyConsentAccepted = true;
    body.privacyConsentAcceptedAt = new Date();
  }
  return body;
}

function attachFiles(payload, files = {}) {
  payload.documents = payload.documents || {};
  for (const [field, list] of Object.entries(files)) {
    if (list?.[0]?.filename) payload.documents[field] = `/uploads/${list[0].filename}`;
  }
  return payload;
}

function canAccessApplication(user, application) {
  return ['admin', 'staff'].includes(user.role) || String(application.user) === String(user._id);
}

export const createApplication = asyncHandler(async (req, res) => {
  const payload = attachFiles(parsePayload(req), req.files);
  const duplicateMatches = await findDuplicateApplications(payload);
  const application = await Application.create({
    ...payload,
    user: req.user._id,
    applicationId: await generateApplicationId(payload.admissionYear),
    duplicateWarning: duplicateMatches.length > 0,
    duplicateMatches: duplicateMatches.map((item) => item._id)
  });
  res.status(201).json(application);
});

export const listApplications = asyncHandler(async (req, res) => {
  const { search, status, classApplyingFor, admissionYear, page = 1, limit = 20 } = req.query;
  const query = {};
  if (req.user.role === 'parent') query.user = req.user._id;
  if (status) query.status = status;
  if (classApplyingFor) query.classApplyingFor = classApplyingFor;
  if (admissionYear) query.admissionYear = Number(admissionYear);
  if (search) query.$text = { $search: search };

  const skip = (Number(page) - 1) * Number(limit);
  const [items, total] = await Promise.all([
    Application.find(query).populate('user', 'name email').sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
    Application.countDocuments(query)
  ]);
  res.json({ items, total, page: Number(page), pages: Math.ceil(total / Number(limit)) || 1 });
});

export const getApplication = asyncHandler(async (req, res) => {
  const application = await Application.findById(req.params.id).populate('user', 'name email');
  if (!application) throw new ApiError(404, 'Application not found');
  if (!canAccessApplication(req.user, application)) throw new ApiError(403, 'Access denied');
  res.json(application);
});

export const updateApplication = asyncHandler(async (req, res) => {
  const application = await Application.findById(req.params.id);
  if (!application) throw new ApiError(404, 'Application not found');
  if (String(application.user) !== String(req.user._id) && !['admin', 'staff'].includes(req.user.role)) {
    throw new ApiError(403, 'Access denied');
  }
  if (application.status !== 'Draft' && req.user.role === 'parent') {
    throw new ApiError(400, 'Submitted applications cannot be edited by parent/student accounts');
  }

  const payload = attachFiles(parsePayload(req), req.files);
  Object.assign(application, payload);
  const duplicateMatches = await findDuplicateApplications(application, application._id);
  application.duplicateWarning = duplicateMatches.length > 0;
  application.duplicateMatches = duplicateMatches.map((item) => item._id);
  await application.save();
  res.json(application);
});

export const submitApplication = asyncHandler(async (req, res) => {
  const application = await Application.findById(req.params.id);
  if (!application) throw new ApiError(404, 'Application not found');
  if (String(application.user) !== String(req.user._id)) throw new ApiError(403, 'Access denied');
  if (application.status !== 'Draft') throw new ApiError(400, 'Only draft applications can be submitted');
  if (!application.privacyConsentAccepted) {
    throw new ApiError(400, 'Privacy consent is required before submitting the application');
  }

  application.status = 'Pending';
  application.submittedAt = new Date();
  application.remarks.push({ status: 'Pending', message: 'Application submitted for review', addedBy: req.user._id });
  await application.save();
  await notifySubmission(application);
  res.json(application);
});

export const reviewApplication = asyncHandler(async (req, res) => {
  const { status, remark } = req.body;
  if (!['Approved', 'Rejected'].includes(status)) throw new ApiError(422, 'Status must be Approved or Rejected');
  const application = await Application.findById(req.params.id);
  if (!application) throw new ApiError(404, 'Application not found');

  if (status === 'Approved' && application.status !== 'Approved' && application.admissionYear === new Date().getFullYear()) {
    const classSeat = await ClassSeat.findOne({ name: application.classApplyingFor });
    if (classSeat && classSeat.filledSeats >= classSeat.totalSeats) throw new ApiError(400, 'No seats available for this class');
    if (classSeat) {
      classSeat.filledSeats += 1;
      await classSeat.save();
    }
  }

  application.status = status;
  application.reviewedBy = req.user._id;
  application.reviewedAt = new Date();
  application.remarks.push({ status, message: remark || `Application ${status.toLowerCase()}`, addedBy: req.user._id });
  await application.save();
  await notifyStatusChange(application);
  res.json(application);
});

export const exportApplications = asyncHandler(async (req, res) => {
  const query = { status: { $ne: 'Draft' } };
  if (req.query.admissionYear) query.admissionYear = Number(req.query.admissionYear);
  const applications = await Application.find(query).sort({ admissionYear: -1, createdAt: -1 });
  res.header('Content-Type', 'text/csv');
  res.attachment('admission-applications-redacted.csv');
  res.send(applicationsToCsv(applications));
});

export const downloadApplicationPdf = asyncHandler(async (req, res) => {
  const application = await Application.findById(req.params.id);
  if (!application) throw new ApiError(404, 'Application not found');
  if (!canAccessApplication(req.user, application)) throw new ApiError(403, 'Access denied');

  res.header('Content-Type', 'application/pdf');
  res.attachment(`${application.applicationId}.pdf`);
  buildApplicationPdf(application, res);
});

export const getApplicationDocumentUrl = asyncHandler(async (req, res) => {
  const { field } = req.params;
  if (!['photo', 'birthCertificate', 'transferCertificate'].includes(field)) {
    throw new ApiError(404, 'Document not found');
  }

  const application = await Application.findById(req.params.id);
  if (!application) throw new ApiError(404, 'Application not found');
  if (!canAccessApplication(req.user, application)) throw new ApiError(403, 'Access denied');

  const url = buildSignedDocumentUrl(application.documents?.[field]);
  if (!url) throw new ApiError(404, 'Document not found');
  res.json({ url });
});

function normalizeAdmissionYear(rawYear, rawDate) {
  const currentYear = new Date().getFullYear();
  const fromDate = rawDate ? new Date(rawDate).getFullYear() : currentYear;
  const year = Number(rawYear || fromDate || currentYear);
  if (!Number.isInteger(year) || year < 1900 || year > currentYear + 1) {
    throw new ApiError(400, 'Admission year must be a valid year');
  }
  return year;
}

function parseDocumentPayload(value) {
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}
