import { Application, hashIdentifier } from '../models/application.model.js';

export async function findDuplicateApplications(payload, currentId) {
  const filters = [];
  if (payload.aadhaarNumber) {
    const digits = String(payload.aadhaarNumber).replace(/\D/g, '');
    if (digits.length === 12) {
      filters.push({ aadhaarHash: hashIdentifier(digits) });
      filters.push({ aadhaarNumber: payload.aadhaarNumber });
    } else {
      filters.push({ aadhaarNumber: payload.aadhaarNumber });
    }
  }
  if (payload.fullName && payload.dateOfBirth && payload.parent?.phone) {
    filters.push({
      fullName: new RegExp(`^${escapeRegex(payload.fullName)}$`, 'i'),
      dateOfBirth: new Date(payload.dateOfBirth),
      'parent.phone': payload.parent.phone
    });
  }

  if (!filters.length) return [];
  const query = { $or: filters };
  if (currentId) query._id = { $ne: currentId };
  return Application.find(query).select('_id applicationId fullName status');
}

function escapeRegex(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
