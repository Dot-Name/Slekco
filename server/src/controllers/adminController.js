import Product from '../models/Product.js';
import Category from '../models/Category.js';
import Order from '../models/Order.js';
import User from '../models/User.js';
import Message from '../models/Message.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

/** GET /api/admin/stats — the numbers the dashboard opens with. */
export const getStats = asyncHandler(async (req, res) => {
  const [products, categories, users, orders, revenue, lowStock, recentOrders, unread] =
    await Promise.all([
      Product.countDocuments(),
      Category.countDocuments(),
      User.countDocuments(),
      Order.countDocuments(),
      Order.aggregate([
        { $match: { status: { $ne: 'cancelled' } } },
        { $group: { _id: null, total: { $sum: '$total' } } },
      ]),
      Product.find({ stock: { $lte: 15 } })
        .select('name brand stock slug images')
        .sort({ stock: 1 })
        .limit(6),
      Order.find().sort({ createdAt: -1 }).limit(6).select('orderNumber customer total status createdAt'),
      Message.countDocuments({ isRead: false }),
    ]);

  res.json({
    success: true,
    stats: {
      products,
      categories,
      users,
      orders,
      revenue: revenue[0]?.total || 0,
      unreadMessages: unread,
    },
    lowStock,
    recentOrders,
  });
});

/**
 * GET /api/admin/products
 * Same shape as the public list, but includes inactive products and
 * supports admin-only filters.
 */
export const getAdminProducts = asyncHandler(async (req, res) => {
  const { q, category, status, sort = 'newest', page = 1, limit = 20 } = req.query;

  const filter = {};
  if (q) {
    const rx = new RegExp(q.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    filter.$or = [{ name: rx }, { brand: rx }, { sku: rx }];
  }
  if (category && category !== 'all') filter.category = category;
  if (status === 'active') filter.isActive = true;
  if (status === 'hidden') filter.isActive = false;
  if (status === 'low') filter.stock = { $lte: 15 };

  const sorts = {
    newest: { createdAt: -1 },
    name: { name: 1 },
    'price-desc': { price: -1 },
    'stock-asc': { stock: 1 },
  };

  const perPage = Math.min(Number(limit) || 20, 100);
  const current = Math.max(Number(page) || 1, 1);

  const [items, total] = await Promise.all([
    Product.find(filter)
      .populate('category', 'name slug accent')
      .sort(sorts[sort] || sorts.newest)
      .skip((current - 1) * perPage)
      .limit(perPage),
    Product.countDocuments(filter),
  ]);

  res.json({ success: true, items, page: current, pages: Math.ceil(total / perPage), total });
});

/** POST /api/admin/uploads — multipart field name: images (up to 6). */
export const uploadImages = asyncHandler(async (req, res) => {
  if (!req.files?.length) {
    res.status(400);
    throw new Error('Choose at least one image to upload.');
  }
  const base = `${req.protocol}://${req.get('host')}`;
  res.status(201).json({
    success: true,
    urls: req.files.map((f) => `${base}/uploads/${f.filename}`),
  });
});
