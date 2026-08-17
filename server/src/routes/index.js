import { Router } from 'express';
import productRoutes from './productRoutes.js';
import categoryRoutes from './categoryRoutes.js';
import orderRoutes from './orderRoutes.js';
import userRoutes from './userRoutes.js';
import messageRoutes from './messageRoutes.js';
import adminRoutes from './adminRoutes.js';

const router = Router();

router.get('/', (req, res) =>
  res.json({
    success: true,
    name: 'Slekco API',
    version: '1.0.0',
    endpoints: [
      'GET  /api/products',
      'GET  /api/products/trending',
      'GET  /api/products/brands',
      'GET  /api/products/:idOrSlug',
      'GET  /api/products/:idOrSlug/related',
      'GET  /api/categories',
      'GET  /api/categories/:slug',
      'POST /api/orders',
      'GET  /api/orders/:orderNumber',
      'POST /api/users/register',
      'POST /api/users/login',
      'GET  /api/users/me',
      'POST /api/contact',
      '— admin (Bearer token) —',
      'GET  /api/admin/stats',
      'GET  /api/admin/products',
      'POST /api/admin/uploads',
      'POST/PUT/DELETE /api/products',
      'POST/PUT/DELETE /api/categories',
      'GET  /api/orders',
      'PATCH /api/orders/:id/status',
      'GET  /api/contact',
    ],
  })
);

router.use('/products', productRoutes);
router.use('/categories', categoryRoutes);
router.use('/orders', orderRoutes);
router.use('/users', userRoutes);
router.use('/contact', messageRoutes);
router.use('/admin', adminRoutes);

export default router;
