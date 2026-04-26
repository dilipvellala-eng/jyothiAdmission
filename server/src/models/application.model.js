import mongoose from 'mongoose';

const parentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, lowercase: true, trim: true },
    occupation: { type: String, trim: true },
    addressWithCellNo: { type: String, trim: true }
  },
  { _id: false }
);

const documentSchema = new mongoose.Schema(
  {
    photo: { type: String },
    birthCertificate: { type: String },
    transferCertificate: { type: String }
  },
  { _id: false }
);

const remarkSchema = new mongoose.Schema(
  {
    message: { type: String, required: true, trim: true },
    status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], required: true },
    addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    addedAt: { type: Date, default: Date.now }
  },
  { _id: false }
);

const applicationSchema = new mongoose.Schema(
  {
    applicationId: { type: String, required: true, unique: true, index: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    admissionNo: { type: String, trim: true },
    classAdmitted: { type: String, trim: true },
    dateOfAdmission: { type: Date },
    fullName: { type: String, required: true, trim: true },
    motherTongue: { type: String, trim: true },
    dateOfBirth: { type: Date, required: true },
    gender: { type: String, enum: ['Female', 'Male', 'Other', ''], default: '' },
    classApplyingFor: { type: String, required: true, trim: true },
    previousSchool: { type: String, trim: true },
    address: { type: String, trim: true },
    aadhaarNumber: { type: String, trim: true, sparse: true },
    penNumber: { type: String, trim: true },
    childId: { type: String, trim: true },
    nationalityState: { type: String, trim: true },
    religion: { type: String, trim: true },
    casteCategory: { type: String, trim: true },
    livingWith: { type: String, enum: ['Parent', 'Guardian', 'Other', ''], default: '' },
    parent: { type: parentSchema, required: true },
    motherName: { type: String, trim: true },
    lastClassStudied: { type: String, trim: true },
    lastSchoolAttended: { type: String, trim: true },
    qualifiedForPromotion: { type: String, enum: ['Yes', 'No', 'Not Applicable', ''], default: '' },
    tcRecordAttached: { type: String, enum: ['Yes', 'No', ''], default: '' },
    tcNumberDate: { type: String, trim: true },
    mediumOfInstruction: { type: String, trim: true },
    firstLanguage: { type: String, trim: true },
    secondLanguage: { type: String, trim: true },
    smallpoxProtection: { type: String, trim: true },
    identificationMark1: { type: String, trim: true },
    identificationMark2: { type: String, trim: true },
    previousSchoolHistory: { type: String, trim: true },
    documents: { type: documentSchema, default: {} },
    status: { type: String, enum: ['Draft', 'Pending', 'Approved', 'Rejected'], default: 'Draft', index: true },
    remarks: [remarkSchema],
    submittedAt: { type: Date },
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    reviewedAt: { type: Date },
    duplicateWarning: { type: Boolean, default: false },
    duplicateMatches: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Application' }]
  },
  { timestamps: true }
);

applicationSchema.index({ fullName: 'text', applicationId: 'text', 'parent.phone': 'text', 'parent.email': 'text' });

export const Application = mongoose.model('Application', applicationSchema);
