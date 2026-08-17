import mongoose from 'mongoose';
import slugify from 'slugify';

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Category name is required'], trim: true, unique: true },
    slug: { type: String, unique: true, index: true },
    description: { type: String, default: '' },
    image: { type: String, default: '' },
    // Each category owns an accent colour — the marketplace reads as polychrome.
    accent: { type: String, default: '#2F4BF0' },
    icon: { type: String, default: '' },
    isActive: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

categorySchema.pre('validate', function (next) {
  if (this.name && !this.slug) this.slug = slugify(this.name, { lower: true, strict: true });
  next();
});

categorySchema.virtual('productCount', {
  ref: 'Product',
  localField: '_id',
  foreignField: 'category',
  count: true,
});

export default mongoose.model('Category', categorySchema);
