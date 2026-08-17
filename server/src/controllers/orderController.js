import Order from '../models/Order.js';
import Product from '../models/Product.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

const COUPONS = { SLEK10: 0.1, WELCOME5: 0.05 };
const FREE_SHIPPING_ABOVE = 999;
const SHIPPING_FEE = 49;

/** POST /api/orders — prices are recalculated server-side, never trusted from the client. */
export const createOrder = asyncHandler(async (req, res) => {
  const { items = [], customer, shippingAddress, paymentMethod = 'cod', couponCode = '' } = req.body;

  if (!items.length) {
    res.status(400);
    throw new Error('Your cart is empty.');
  }

  const ids = items.map((i) => i.product);
  const products = await Product.find({ _id: { $in: ids } });
  const byId = Object.fromEntries(products.map((p) => [String(p._id), p]));

  const lineItems = items.map((i) => {
    const p = byId[String(i.product)];
    if (!p) {
      res.status(400);
      throw new Error('One of the items in your cart is no longer available.');
    }
    const quantity = Math.max(1, Number(i.quantity) || 1);
    if (p.stock < quantity) {
      res.status(400);
      throw new Error(`Only ${p.stock} left of ${p.name}. Reduce the quantity to continue.`);
    }
    return {
      product: p._id,
      name: p.name,
      brand: p.brand,
      image: p.images[0],
      price: p.price,
      quantity,
    };
  });

  const itemsTotal = lineItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const rate = COUPONS[couponCode.toUpperCase()] || 0;
  const discount = Math.round(itemsTotal * rate);
  const shipping = itemsTotal - discount >= FREE_SHIPPING_ABOVE ? 0 : SHIPPING_FEE;

  const order = await Order.create({
    user: req.user?._id,
    customer,
    items: lineItems,
    shippingAddress,
    paymentMethod,
    couponCode: rate ? couponCode.toUpperCase() : '',
    itemsTotal,
    discount,
    shipping,
    total: itemsTotal - discount + shipping,
  });

  await Promise.all(
    lineItems.map((i) =>
      Product.updateOne({ _id: i.product }, { $inc: { stock: -i.quantity, sold: i.quantity } })
    )
  );

  res.status(201).json({ success: true, item: order });
});

/** GET /api/orders/:orderNumber */
export const getOrder = asyncHandler(async (req, res) => {
  const order = await Order.findOne({ orderNumber: req.params.orderNumber });
  if (!order) {
    res.status(404);
    throw new Error('We could not find that order.');
  }
  res.json({ success: true, item: order });
});

/** GET /api/orders/mine */
export const getMyOrders = asyncHandler(async (req, res) => {
  const items = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json({ success: true, items });
});

/** GET /api/orders (admin) — every order, newest first. */
export const getAllOrders = asyncHandler(async (req, res) => {
  const { status, q, page = 1, limit = 20 } = req.query;
  const filter = {};
  if (status && status !== 'all') filter.status = status;
  if (q) {
    const rx = new RegExp(q.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    filter.$or = [{ orderNumber: rx }, { 'customer.name': rx }, { 'customer.email': rx }];
  }

  const perPage = Math.min(Number(limit) || 20, 100);
  const current = Math.max(Number(page) || 1, 1);

  const [items, total] = await Promise.all([
    Order.find(filter).sort({ createdAt: -1 }).skip((current - 1) * perPage).limit(perPage),
    Order.countDocuments(filter),
  ]);

  res.json({ success: true, items, page: current, pages: Math.ceil(total / perPage), total });
});

/** PATCH /api/orders/:id/status (admin) */
export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error('We could not find that order.');
  }
  order.status = status;
  if (status === 'delivered' && !order.isPaid) {
    order.isPaid = true;
    order.paidAt = new Date();
  }
  await order.save();
  res.json({ success: true, item: order });
});
