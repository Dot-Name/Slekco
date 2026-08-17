import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Name is required'], trim: true },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Enter a valid email address'],
    },
    subject: { type: String, default: 'General' },
    message: { type: String, required: [true, 'Message is required'], minlength: 10 },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model('Message', messageSchema);
