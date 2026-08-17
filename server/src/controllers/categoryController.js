import Category from '../models/Category.js';
import Product from '../models/Product.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

/** GET /api/categories */
export const getCategories = asyncHandler(async (req, res) => {
  const items = await Category.find({ isActive: true }).sort({ sortOrder: 1, name: 1 }).lean();
  const counts = await Product.aggregate([
    { $match: { isActive: true } },
    { $group: { _id: '$category', count: { $sum: 1 } } },
  ]);
  const map = Object.fromEntries(counts.map((c) => [String(c._id), c.count]));
  res.json({
    success: true,
    items: items.map((c) => ({ ...c, productCount: map[String(c._id)] || 0 })),
  });
});

/** GET /api/categories/:slug */
export const getCategory = asyncHandler(async (req, res) => {
  const item = await Category.findOne({ slug: req.params.slug });
  if (!item) {
    res.status(404);
    throw new Error('We could not find that category.');
  }
  res.json({ success: true, item });
});

/** GET /api/categories/id/:id (admin) */
export const getCategoryById = asyncHandler(async (req, res) => {
  const item = await Category.findById(req.params.id);
  if (!item) {
    res.status(404);
    throw new Error('We could not find that category.');
  }
  res.json({ success: true, item });
});

/** POST /api/categories (admin) */
export const createCategory = asyncHandler(async (req, res) => {
  const item = await Category.create(req.body);
  res.status(201).json({ success: true, item });
});

/** PUT /api/categories/:id (admin) */
export const updateCategory = asyncHandler(async (req, res) => {
  const item = await Category.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!item) {
    res.status(404);
    throw new Error('We could not find that category.');
  }
  res.json({ success: true, item });
});

/** DELETE /api/categories/:id (admin) — refused while products still use it. */
export const deleteCategory = asyncHandler(async (req, res) => {
  const inUse = await Product.countDocuments({ category: req.params.id });
  if (inUse) {
    res.status(409);
    throw new Error(`${inUse} product(s) still use this category. Move them first.`);
  }
  const item = await Category.findByIdAndDelete(req.params.id);
  if (!item) {
    res.status(404);
    throw new Error('We could not find that category.');
  }
  res.json({ success: true, message: 'Category removed.' });
});
