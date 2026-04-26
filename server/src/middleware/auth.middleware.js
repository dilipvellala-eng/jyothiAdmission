import jwt from 'jsonwebtoken';
import { ApiError } from '../utils/apiError.js';
import { User } from '../models/user.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const protect = asyncHandler(async (req, _res, next) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) throw new ApiError(401, 'Authentication token is required');

  const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret');
  const user = await User.findById(decoded.id).select('-password');
  if (!user || !user.isActive) throw new ApiError(401, 'Invalid or inactive user');

  req.user = user;
  next();
});

export const authorize = (...roles) => (req, _res, next) => {
  if (!roles.includes(req.user.role)) {
    return next(new ApiError(403, 'You do not have permission to perform this action'));
  }
  next();
};
