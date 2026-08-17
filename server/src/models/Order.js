import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    name: { type: String, required: true },
    brand: String,
    image: String,
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderNumber: { type: String, unique: true, index: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    customer: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: String,
    },
    items: {
      type: [orderItemSchema],
      validate: [(v) => v.length > 0, 'An order needs at least one item'],
    },
    shippingAddress: {
      line1: String,
      city: String,
      state: String,
      postalCode: String,
      country: { type: String, default: 'India' },
    },
    paymentMethod: { type: String, enum: ['cod', 'card', 'upi'], default: 'cod' },
    itemsTotal: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    shipping: { type: Number, default: 0 },
    total: { type: Number, required: true },
    couponCode: { type: String, default: '' },
    status: {
      type: String,
      enum: ['placed', 'packed', 'shipped', 'delivered', 'cancelled'],
      default: 'placed',
    },
    isPaid: { type: Boolean, default: false },
    paidAt: Date,
  },
  { timestamps: true }
);

orderSchema.pre('validate', function (next) {
  if (!this.orderNumber) {
    const stamp = Date.now().toString(36).toUpperCase().slice(-6);
    const rand = Math.random().toString(36).toUpperCase().slice(2, 6);
    this.orderNumber = `SLK-${stamp}${rand}`;
  }
  next();
});

export default mongoose.model('Order', orderSchema);
