import mongoose from 'mongoose'

const guestSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 100 },
  normalizedName: { type: String, required: true, unique: true, index: true },
  status: { type: String, enum: ['attending', 'declined', 'pending'], default: 'pending', index: true },
  respondedAt: { type: Date, default: null },
  message: { type: String, trim: true, maxlength: 500, default: '' },
}, { timestamps: true })

export default mongoose.model('Guest', guestSchema)
