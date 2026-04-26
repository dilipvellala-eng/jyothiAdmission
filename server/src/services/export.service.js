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
      aadhaarNumber: app.aadhaarNumber,
      penNumber: app.penNumber,
      childId: app.childId,
      nationalityState: app.nationalityState,
      religion: app.religion,
      casteCategory: app.casteCategory,
      livingWith: app.livingWith,
      parentName: app.parent?.name,
      parentOccupation: app.parent?.occupation,
      parentPhone: app.parent?.phone,
      parentEmail: app.parent?.email,
      parentAddressWithCellNo: app.parent?.addressWithCellNo,
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
      identificationMark1: app.identificationMark1,
      identificationMark2: app.identificationMark2,
      previousSchoolHistory: app.previousSchoolHistory,
      status: app.status,
      submittedAt: app.submittedAt?.toISOString() || ''
    })),
    { header: true }
  );
}
