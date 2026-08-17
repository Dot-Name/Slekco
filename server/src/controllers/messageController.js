import Message from '../models/Message.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

/** POST /api/contact */
export const createMessage = asyncHandler(async (req, res) => {
  const message = await Message.create(req.body);
  res.status(201).json({
    success: true,
    message: 'Thanks — your message is with our support team. We reply within one business day.',
    item: { _id: message._id, createdAt: message.createdAt },
  });
});

/** GET /api/contact (admin) */
export const getMessages = asyncHandler(async (req, res) => {
  const items = await Message.find().sort({ createdAt: -1 }).limit(100);
  res.json({ success: true, items });
});

/** PATCH /api/contact/:id/read (admin) */
export const markMessageRead = asyncHandler(async (req, res) => {
  const item = await Message.findByIdAndUpdate(req.params.id, { isRead: true }, { new: true });
  if (!item) {
    res.status(404);
    throw new Error('We could not find that message.');
  }
  res.json({ success: true, item });
});
