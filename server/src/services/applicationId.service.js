import { Application } from '../models/application.model.js';

export async function generateApplicationId(admissionYear = new Date().getFullYear()) {
  const year = Number(admissionYear) || new Date().getFullYear();
  const prefix = `ADM-${year}-`;
  const latest = await Application.findOne({ applicationId: new RegExp(`^${prefix}`) }).sort({ applicationId: -1 });
  const nextNumber = latest ? Number(latest.applicationId.replace(prefix, '')) + 1 : 1;
  return `${prefix}${String(nextNumber).padStart(5, '0')}`;
}
