import { Router } from 'express';
import { createMessage, getMessages, markMessageRead } from '../controllers/messageController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = Router();

router.route('/').post(createMessage).get(protect, adminOnly, getMessages);
router.patch('/:id/read', protect, adminOnly, markMessageRead);

export default router;
