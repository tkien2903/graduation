import mongoose from 'mongoose'

const settingsSchema = new mongoose.Schema({
  key: { type: String, default: 'main', unique: true },
  ceremonyDate: { type: String, default: '30.06.2027' },
  ceremonyTime: { type: String, default: '08:00' },
  location: { type: String, default: 'Cơ sở 2, 18A Cộng Hòa, Quận Tân Bình, TP. Hồ Chí Minh' },
  gallery: { type: [String], default: [] },
}, { timestamps: true })

export default mongoose.model('SiteSettings', settingsSchema)
