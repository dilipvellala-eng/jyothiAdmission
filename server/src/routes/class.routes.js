import express from 'express';
import { body } from 'express-validator';
import { deleteClass, listClasses, upsertClass } from '../controllers/class.controller.js';
import { authorize, protect } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';

const router = express.Router();

router.get('/', listClasses);
router.post('/', protect, authorize('admin'), [
  body('name').notEmpty().withMessage('Class name is required'),
  body('totalSeats').isInt({ min: 0 }).withMessage('Total seats must be zero or more')
], validate, upsertClass);
router.delete('/:id', protect, authorize('admin'), deleteClass);

export default router;
