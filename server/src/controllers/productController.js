import Product from '../models/Product.js';
import Category from '../models/Category.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

const SORTS = {
  newest: { createdAt: -1 },
  'price-asc': { price: 1 },
  'price-desc': { price: -1 },
  rating: { rating: -1, numReviews: -1 },
  popular: { sold: -1, rating: -1 },
};

/**
 * GET /api/products
 * Query: q, category (slug or id), brand (csv), minPrice, maxPrice, rating,
 *        sort, page, limit, featured, trending
 */
export const getProducts = asyncHandler(async (req, res) => {
  const {
    q,
    category,
    brand,
    minPrice,
    maxPrice,
    rating,
    sort = 'newest',
    page = 1,
    limit = 12,
    featured,
    trending,
  } = req.query;

  const filter = { isActive: true };

  if (q) {
    const rx = new RegExp(q.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    filter.$or = [{ name: rx }, { brand: rx }, { tags: rx }, { shortDescription: rx }];
  }

  if (category && category !== 'all') {
    const doc = category.match(/^[0-9a-fA-F]{24}$/)
      ? await Category.findById(category)
      : await Category.findOne({ slug: category });
    if (!doc) return res.json({ success: true, items: [], page: 1, pages: 0, total: 0, facets: { brands: [], priceRange: [0, 0] } });
    filter.category = doc._id;
  }

  if (brand) filter.brand = { $in: brand.split(',').map((b) => b.trim()).filter(Boolean) };
  if (rating) filter.rating = { $gte: Number(rating) };
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }
  if (featured === 'true') filter.isFeatured = true;
  if (trending === 'true') filter.isTrending = true;

  const perPage = Math.min(Number(limit) || 12, 48);
  const current = Math.max(Number(page) || 1, 1);

  const [items, total, brands, range] = await Promise.all([
    Product.find(filter)
      .populate('category', 'name slug accent')
      .sort(SORTS[sort] || SORTS.newest)
      .skip((current - 1) * perPage)
      .limit(perPage),
    Product.countDocuments(filter),
    Product.distinct('brand', { isActive: true, ...(filter.category && { category: filter.category }) }),
    Product.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: null, min: { $min: '$price' }, max: { $max: '$price' } } },
    ]),
  ]);

  res.json({
    success: true,
    items,
    page: current,
    pages: Math.ceil(total / perPage),
    total,
    facets: {
      brands: brands.sort(),
      priceRange: [range[0]?.min ?? 0, range[0]?.max ?? 0],
    },
  });
});

/** GET /api/products/trending */
export const getTrending = asyncHandler(async (req, res) => {
  const limit = Math.min(Number(req.query.limit) || 8, 24);
  const items = await Product.find({ isActive: true, isTrending: true })
    .populate('category', 'name slug accent')
    .sort({ sold: -1 })
    .limit(limit);
  res.json({ success: true, items });
});

/** GET /api/products/brands */
export const getBrands = asyncHandler(async (req, res) => {
  const brands = await Product.aggregate([
    { $match: { isActive: true } },
    { $group: { _id: '$brand', count: { $sum: 1 }, minPrice: { $min: '$price' } } },
    { $sort: { count: -1 } },
    { $project: { _id: 0, name: '$_id', count: 1, minPrice: 1 } },
  ]);
  res.json({ success: true, items: brands });
});

/** GET /api/products/:idOrSlug */
export const getProduct = asyncHandler(async (req, res) => {
  const { idOrSlug } = req.params;
  const query = idOrSlug.match(/^[0-9a-fA-F]{24}$/) ? { _id: idOrSlug } : { slug: idOrSlug };
  const product = await Product.findOne(query).populate('category', 'name slug accent');

  if (!product) {
    res.status(404);
    throw new Error('We could not find that product.');
  }
  res.json({ success: true, item: product });
});

/** GET /api/products/:idOrSlug/related */
export const getRelated = asyncHandler(async (req, res) => {
  const { idOrSlug } = req.params;
  const query = idOrSlug.match(/^[0-9a-fA-F]{24}$/) ? { _id: idOrSlug } : { slug: idOrSlug };
  const product = await Product.findOne(query);
  if (!product) {
    res.status(404);
    throw new Error('We could not find that product.');
  }
  const items = await Product.find({
    _id: { $ne: product._id },
    isActive: true,
    $or: [{ category: product.category }, { brand: product.brand }],
  })
    .populate('category', 'name slug accent')
    .sort({ rating: -1 })
    .limit(4);
  res.json({ success: true, items });
});

/** POST /api/products (admin) */
export const createProduct = asyncHandler(async (req, res) => {
  const product = await Product.create(req.body);
  res.status(201).json({ success: true, item: product });
});

/** PUT /api/products/:id (admin) */
export const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!product) {
    res.status(404);
    throw new Error('We could not find that product.');
  }
  res.json({ success: true, item: product });
});

/** DELETE /api/products/:id (admin) */
export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('We could not find that product.');
  }
  res.json({ success: true, message: 'Product removed.' });
});
