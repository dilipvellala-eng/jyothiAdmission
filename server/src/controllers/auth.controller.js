import jwt from 'jsonwebtoken';
import { User } from '../models/user.model.js';
import { ApiError } from '../utils/apiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

function signToken(user) {
  return jwt.sign({ id: user._id, role: user.role }, jwtSecret(), {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
}

function userPayload(user) {
  return { id: user._id, name: user.name, email: user.email, phone: user.phone, role: user.role };
}

function jwtSecret() {
  if (process.env.JWT_SECRET) return process.env.JWT_SECRET;
  if (process.env.NODE_ENV === 'production') {
    throw new Error('JWT_SECRET is required in production');
  }
  return 'dev-secret';
}

export const register = asyncHandler(async (req, res) => {
  const { name, email, phone, password } = req.body;

  const existing = await User.findOne({ email });
  if (existing) throw new ApiError(409, 'A user with this email already exists');

  const user = await User.create({
    name,
    email,
    phone,
    password,
    role: 'parent'
  });

  res.status(201).json({
    token: signToken(user),
    user: userPayload(user)
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await user.comparePassword(password))) throw new ApiError(401, 'Invalid email or password');
  res.json({ token: signToken(user), user: userPayload(user) });
});

export const me = asyncHandler(async (req, res) => {
  res.json({ user: userPayload(req.user) });
});
