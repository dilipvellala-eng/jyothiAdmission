import { stringify } from 'csv-stringify/sync';

export function applicationsToCsv(applications) {
  return stringify(
    applications.map((app) => ({
      applicationId: app.applicationId,
      admissionNo: app.admissionNo,
      classAdmitted: app.classAdmitted,
      dateOfAdmission: app.dateOfAdmission?.toISOString().slice(0, 10) || '',
      fullName: app.fullName,
      motherTongue: app.motherTongue,
      dateOfBirth: app.dateOfBirth?.toISOString().slice(0, 10),
      aadhaarNumber: maskAadhaar(app.aadhaarNumber),
      penNumber: app.penNumber,
      childId: app.childId,
      nationalityState: app.nationalityState,
      religion: app.religion ? 'REDACTED' : '',
      casteCategory: app.casteCategory ? 'REDACTED' : '',
      livingWith: app.livingWith,
      parentName: app.parent?.name,
      parentOccupation: app.parent?.occupation,
      parentPhone: redactPhone(app.parent?.phone),
      parentEmail: redactEmail(app.parent?.email),
      parentAddressWithCellNo: app.parent?.addressWithCellNo ? 'REDACTED' : '',
      motherName: app.motherName,
      lastClassStudied: app.lastClassStudied,
      lastSchoolAttended: app.lastSchoolAttended,
      qualifiedForPromotion: app.qualifiedForPromotion,
      tcRecordAttached: app.tcRecordAttached,
      tcNumberDate: app.tcNumberDate,
      classApplyingFor: app.classApplyingFor,
      mediumOfInstruction: app.mediumOfInstruction,
      firstLanguage: app.firstLanguage,
      secondLanguage: app.secondLanguage,
      smallpoxProtection: app.smallpoxProtection,
      identificationMark1: app.identificationMark1 ? 'REDACTED' : '',
      identificationMark2: app.identificationMark2 ? 'REDACTED' : '',
      previousSchoolHistory: app.previousSchoolHistory ? 'REDACTED' : '',
      status: app.status,
      submittedAt: app.submittedAt?.toISOString() || ''
    })),
    { header: true }
  );
}

function redactPhone(phone) {
  if (!phone) return '';
  const digits = String(phone).replace(/\D/g, '');
  return digits.length > 4 ? `xxxxxx${digits.slice(-4)}` : 'REDACTED';
}

function redactEmail(email) {
  if (!email) return '';
  const [name, domain] = String(email).split('@');
  if (!name || !domain) return 'REDACTED';
  return `${name.slice(0, 2)}***@${domain}`;
}

function maskAadhaar(value) {
  if (!value) return '';
  const digits = String(value).replace(/\D/g, '');
  return digits.length === 12 ? `xxxx-xxxx-${digits.slice(-4)}` : value;
}
