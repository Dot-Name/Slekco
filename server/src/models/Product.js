import mongoose from 'mongoose';
import slugify from 'slugify';

const specSchema = new mongoose.Schema(
  { key: { type: String, required: true }, value: { type: String, required: true } },
  { _id: false }
);

const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: String,
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: String,
  },
  { timestamps: true }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Product name is required'], trim: true },
    slug: { type: String, unique: true, index: true },
    sku: { type: String, unique: true, sparse: true },
    brand: { type: String, required: [true, 'Brand is required'], index: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true, index: true },
    shortDescription: { type: String, default: '' },
    description: { type: String, default: '' },
    highlights: [{ type: String }],
    specs: [specSchema],
    images: {
      type: [String],
      validate: [(v) => v.length > 0, 'At least one product image is required'],
    },
    price: { type: Number, required: [true, 'Price is required'], min: 0 },
    mrp: { type: Number, min: 0 },
    currency: { type: String, default: 'INR' },
    stock: { type: Number, default: 0, min: 0 },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    numReviews: { type: Number, default: 0 },
    reviews: [reviewSchema],
    tags: [{ type: String }],
    badge: { type: String, default: '' },
    isFeatured: { type: Boolean, default: false },
    isTrending: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    sold: { type: Number, default: 0 },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

productSchema.index({ name: 'text', brand: 'text', tags: 'text', shortDescription: 'text' });

productSchema.pre('validate', function (next) {
  if (this.name && !this.slug) {
    this.slug = slugify(`${this.brand} ${this.name}`, { lower: true, strict: true });
  }
  next();
});

productSchema.virtual('discountPercent').get(function () {
  if (!this.mrp || this.mrp <= this.price) return 0;
  return Math.round(((this.mrp - this.price) / this.mrp) * 100);
});

productSchema.virtual('inStock').get(function () {
  return this.stock > 0;
});

export default mongoose.model('Product', productSchema);
