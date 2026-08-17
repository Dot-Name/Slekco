import User from '../models/User.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { signToken } from '../utils/token.js';

const shape = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  phone: user.phone,
});

/** POST /api/users/register */
export const register = asyncHandler(async (req, res) => {
  const { name, email, password, phone } = req.body;
  const exists = await User.findOne({ email });
  if (exists) {
    res.status(409);
    throw new Error('That email is already registered. Sign in instead.');
  }
  const user = await User.create({ name, email, password, phone });
  res.status(201).json({ success: true, user: shape(user), token: signToken(user._id) });
});

/** POST /api/users/login */
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error('That email and password combination did not match.');
  }
  res.json({ success: true, user: shape(user), token: signToken(user._id) });
});

/** GET /api/users/me */
export const getMe = asyncHandler(async (req, res) => {
  res.json({ success: true, user: shape(req.user) });
});
