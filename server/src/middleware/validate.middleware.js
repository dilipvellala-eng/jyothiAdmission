import { validationResult } from 'express-validator';
import { ApiError } from '../utils/apiError.js';

export function validate(req, _res, next) {
  const result = validationResult(req);
  if (result.isEmpty()) return next();

  const message = result.array().map((item) => item.msg).join(', ');
  next(new ApiError(422, message));
}
