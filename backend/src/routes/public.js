import { Router } from 'express'
import { rateLimit } from 'express-rate-limit'
import Guest from '../models/Guest.js'
import SiteSettings from '../models/SiteSettings.js'

const router = Router()
const rsvpLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 10, standardHeaders: 'draft-8', legacyHeaders: false })
const normalizeName = (name) => name.normalize('NFKC').trim().replace(/\s+/g, ' ').toLocaleLowerCase('vi')

router.get('/health', (_request, response) => response.json({ ok: true }))

router.post('/rsvp', rsvpLimiter, async (request, response, next) => {
  try {
    const name = typeof request.body?.name === 'string' ? request.body.name.trim().replace(/\s+/g, ' ') : ''
    const message = typeof request.body?.message === 'string' ? request.body.message.trim() : ''
    const { status } = request.body || {}
    if (!name || name.length > 100) return response.status(400).json({ error: 'Họ tên phải có từ 1 đến 100 ký tự.' })
    if (message.length > 500) return response.status(400).json({ error: 'Lời chúc không được vượt quá 500 ký tự.' })
    if (!['attending', 'declined'].includes(status)) return response.status(400).json({ error: 'Lựa chọn tham dự không hợp lệ.' })
    const normalizedName = normalizeName(name)
    const respondedAt = new Date()
    const invitedGuest = await Guest.findOneAndUpdate(
      { normalizedName, status: 'pending' },
      { $set: { status, respondedAt, message } },
      { new: true, runValidators: true },
    )
    const guest = invitedGuest || await Guest.create({ name, normalizedName, status, respondedAt, message })
    return response.status(201).json({ id: guest.id, name: guest.name, status: guest.status, respondedAt: guest.respondedAt, message: guest.message })
  } catch (error) {
    if (error.code === 11000) return response.status(409).json({ error: 'Tên này đã xác nhận trước đó. Vui lòng liên hệ chủ thiệp nếu cần cập nhật.' })
    return next(error)
  }
})

router.get('/site-settings', async (_request, response, next) => {
  try {
    const settings = await SiteSettings.findOneAndUpdate({ key: 'main' }, {}, { upsert: true, new: true, setDefaultsOnInsert: true })
    return response.json({ ceremonyDate: settings.ceremonyDate, ceremonyTime: settings.ceremonyTime, location: settings.location, gallery: settings.gallery })
  } catch (error) { return next(error) }
})

export default router
