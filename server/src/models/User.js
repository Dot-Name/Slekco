import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const addressSchema = new mongoose.Schema(
  {
    label: { type: String, default: 'Home' },
    line1: String,
    line2: String,
    city: String,
    state: String,
    postalCode: String,
    country: { type: String, default: 'India' },
    phone: String,
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Name is required'], trim: true },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Enter a valid email address'],
    },
    password: { type: String, required: [true, 'Password is required'], minlength: 6, select: false },
    phone: { type: String, default: '' },
    role: { type: String, enum: ['customer', 'admin'], default: 'customer' },
    addresses: [addressSchema],
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.matchPassword = function (entered) {
  return bcrypt.compare(entered, this.password);
};

export default mongoose.model('User', userSchema);
