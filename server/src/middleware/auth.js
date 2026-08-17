import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { asyncHandler } from './asyncHandler.js';

export const protect = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.split(' ')[1] : null;

  if (!token) {
    res.status(401);
    throw new Error('Sign in to continue.');
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret');
  req.user = await User.findById(decoded.id);
  if (!req.user) {
    res.status(401);
    throw new Error('That session is no longer valid. Sign in again.');
  }
  next();
});

export const adminOnly = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    res.status(403);
    throw new Error('This action is limited to admin accounts.');
  }
  next();
};
