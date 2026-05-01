import express from 'express';
import { body } from 'express-validator';
import {
  createApplication,
  downloadApplicationPdf,
  exportApplications,
  getApplication,
  listApplications,
  reviewApplication,
  submitApplication,
  updateApplication
} from '../controllers/application.controller.js';
import { authorize, protect } from '../middleware/auth.middleware.js';
import { upload } from '../middleware/upload.middleware.js';
import { validate } from '../middleware/validate.middleware.js';

const router = express.Router();
const uploadFields = upload.fields([
  { name: 'photo', maxCount: 1 },
  { name: 'birthCertificate', maxCount: 1 },
  { name: 'transferCertificate', maxCount: 1 }
]);

const applicationValidation = [
  body('admissionYear').optional().isInt({ min: 1900, max: new Date().getFullYear() + 1 }).withMessage('Admission year must be valid'),
  body('fullName').notEmpty().withMessage('Student full name is required'),
  body('dateOfBirth').isISO8601().withMessage('Valid date of birth is required'),
  body('classApplyingFor').notEmpty().withMessage('Class into which admission is sought is required')
];

router.use(protect);
router.get('/', listApplications);
router.get('/export.csv', authorize('admin', 'staff'), exportApplications);
router.post('/', uploadFields, applicationValidation, validate, createApplication);
router.get('/:id', getApplication);
router.put('/:id', uploadFields, applicationValidation, validate, updateApplication);
router.post('/:id/submit', submitApplication);
router.patch('/:id/review', authorize('admin', 'staff'), reviewApplication);
router.get('/:id/pdf', downloadApplicationPdf);

export default router;
