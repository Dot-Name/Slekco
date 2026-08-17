import { Router } from 'express';
import {
  createOrder, getOrder, getMyOrders, getAllOrders, updateOrderStatus,
} from '../controllers/orderController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = Router();

router.route('/').post(createOrder).get(protect, adminOnly, getAllOrders);
router.get('/mine', protect, getMyOrders);
router.patch('/:id/status', protect, adminOnly, updateOrderStatus);
router.get('/:orderNumber', getOrder);

export default router;
