import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import * as XLSX from 'xlsx'
import Admin from '../models/Admin.js'
import Guest from '../models/Guest.js'
import SiteSettings from '../models/SiteSettings.js'
import { requireAdmin } from '../middleware/auth.js'

const router = Router()
const normalizeName = (name) => name.normalize('NFKC').trim().replace(/\s+/g, ' ').toLocaleLowerCase('vi')
const validStatus = (status) => ['attending', 'declined', 'pending'].includes(status)

router.post('/login', async (request, response, next) => {
  try {
    const { username, password } = request.body || {}
    const admin = typeof username === 'string' ? await Admin.findOne({ username: username.trim() }) : null
    if (!admin || typeof password !== 'string' || !(await bcrypt.compare(password, admin.passwordHash))) {
      return response.status(401).json({ error: 'Tên đăng nhập hoặc mật khẩu không đúng.' })
    }
    const token = jwt.sign({ sub: admin.id, username: admin.username }, process.env.JWT_SECRET, { expiresIn: '8h' })
    return response.json({ token, username: admin.username, expiresIn: 28800 })
  } catch (error) { return next(error) }
})

router.use(requireAdmin)

router.get('/dashboard', async (_request, response, next) => {
  try {
    const [total, counts] = await Promise.all([
      Guest.countDocuments(),
      Guest.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
    ])
    const byStatus = Object.fromEntries(counts.map(({ _id, count }) => [_id, count]))
    return response.json({ total, attending: byStatus.attending || 0, declined: byStatus.declined || 0, pending: byStatus.pending || 0 })
  } catch (error) { return next(error) }
})

router.get('/guests/export', async (_request, response, next) => {
  try {
    const guests = await Guest.find().sort({ createdAt: -1 }).lean()
    const rows = guests.map((guest) => ({
      'Họ và tên': guest.name,
      'Trạng thái': guest.status === 'attending' ? 'Tham dự' : guest.status === 'declined' ? 'Không tham dự' : 'Chưa xác nhận',
      'Thời gian xác nhận': guest.respondedAt ? new Date(guest.respondedAt).toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' }) : '',
      'Lời chúc': guest.message || '',
      'Lời chúc': guest.message || '',
    }))
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(rows), 'Khach moi')
    const file = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' })
    response.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    response.setHeader('Content-Disposition', 'attachment; filename="danh-sach-khach-moi.xlsx"')
    return response.send(file)
  } catch (error) { return next(error) }
})

router.get('/guests', async (request, response, next) => {
  try {
    const page = Math.max(1, Number.parseInt(request.query.page, 10) || 1)
    const limit = Math.min(100, Math.max(1, Number.parseInt(request.query.limit, 10) || 20))
    const filter = {}
    if (request.query.status && validStatus(request.query.status)) filter.status = request.query.status
    if (typeof request.query.search === 'string' && request.query.search.trim()) filter.name = { $regex: request.query.search.trim().slice(0, 80).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), $options: 'i' }
    const [guests, total] = await Promise.all([
      Guest.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
      Guest.countDocuments(filter),
    ])
    return response.json({ guests, page, limit, total, pages: Math.ceil(total / limit) })
  } catch (error) { return next(error) }
})

router.post('/guests', async (request, response, next) => {
  try {
    const name = typeof request.body?.name === 'string' ? request.body.name.trim().replace(/\s+/g, ' ') : ''
    const status = request.body?.status || 'pending'
    if (!name || name.length > 100 || !validStatus(status)) return response.status(400).json({ error: 'Tên hoặc trạng thái không hợp lệ.' })
    const guest = await Guest.create({ name, normalizedName: normalizeName(name), status })
    return response.status(201).json(guest)
  } catch (error) {
    if (error.code === 11000) return response.status(409).json({ error: 'Khách mời có tên này đã tồn tại.' })
    return next(error)
  }
})

router.patch('/guests/:id', async (request, response, next) => {
  try {
    const updates = {}
    if (request.body?.name !== undefined) {
      if (typeof request.body.name !== 'string' || !request.body.name.trim() || request.body.name.trim().length > 100) return response.status(400).json({ error: 'Tên không hợp lệ.' })
      updates.name = request.body.name.trim().replace(/\s+/g, ' ')
      updates.normalizedName = normalizeName(updates.name)
    }
    if (request.body?.status !== undefined) {
      if (!validStatus(request.body.status)) return response.status(400).json({ error: 'Trạng thái không hợp lệ.' })
      updates.status = request.body.status
      updates.respondedAt = request.body.status === 'pending' ? null : new Date()
    }
    const guest = await Guest.findByIdAndUpdate(request.params.id, updates, { new: true, runValidators: true })
    if (!guest) return response.status(404).json({ error: 'Không tìm thấy khách mời.' })
    return response.json(guest)
  } catch (error) {
    if (error.code === 11000) return response.status(409).json({ error: 'Khách mời có tên này đã tồn tại.' })
    if (error.name === 'CastError') return response.status(400).json({ error: 'Mã khách mời không hợp lệ.' })
    return next(error)
  }
})

router.delete('/guests/:id', async (request, response, next) => {
  try {
    const guest = await Guest.findByIdAndDelete(request.params.id)
    if (!guest) return response.status(404).json({ error: 'Không tìm thấy khách mời.' })
    return response.status(204).end()
  } catch (error) {
    if (error.name === 'CastError') return response.status(400).json({ error: 'Mã khách mời không hợp lệ.' })
    return next(error)
  }
})

router.put('/site-settings', async (request, response, next) => {
  try {
    const { ceremonyDate, ceremonyTime, location, gallery } = request.body || {}
    if ((ceremonyDate !== undefined && typeof ceremonyDate !== 'string') || (ceremonyTime !== undefined && typeof ceremonyTime !== 'string') || (location !== undefined && typeof location !== 'string') || (gallery !== undefined && (!Array.isArray(gallery) || gallery.some((item) => typeof item !== 'string')))) {
      return response.status(400).json({ error: 'Thông tin buổi lễ hoặc thư viện ảnh không hợp lệ.' })
    }
    const settings = await SiteSettings.findOneAndUpdate({ key: 'main' }, { $set: { ceremonyDate, ceremonyTime, location, gallery } }, { new: true, upsert: true, runValidators: true })
    return response.json({ ceremonyDate: settings.ceremonyDate, ceremonyTime: settings.ceremonyTime, location: settings.location, gallery: settings.gallery })
  } catch (error) { return next(error) }
})

export default router
