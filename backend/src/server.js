import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import bcrypt from 'bcryptjs'
import mongoose from 'mongoose'
import publicRoutes from './routes/public.js'
import adminRoutes from './routes/admin.js'
import Admin from './models/Admin.js'

const required = ['MONGODB_URI', 'JWT_SECRET', 'ADMIN_USERNAME', 'ADMIN_PASSWORD']
const missing = required.filter((key) => !process.env[key])
if (missing.length) throw new Error(`Thiếu biến môi trường bắt buộc: ${missing.join(', ')}`)
if (process.env.JWT_SECRET.length < 32) throw new Error('JWT_SECRET cần dài ít nhất 32 ký tự.')
if (process.env.ADMIN_PASSWORD.length < 12) throw new Error('ADMIN_PASSWORD cần dài ít nhất 12 ký tự.')

const app = express()
const port = Number(process.env.PORT || 3001)
app.disable('x-powered-by')
app.use(helmet())
app.use(cors({ origin: process.env.CLIENT_ORIGIN?.split(',').map((value) => value.trim()).filter(Boolean) || false }))
app.use(express.json({ limit: '10kb' }))

app.use('/api', publicRoutes)
app.use('/api/admin', adminRoutes)
app.use((request, response) => response.status(404).json({ error: 'Không tìm thấy API.' }))
app.use((error, _request, response, _next) => {
  console.error(error)
  if (error.type === 'entity.parse.failed') return response.status(400).json({ error: 'Dữ liệu JSON không hợp lệ.' })
  return response.status(500).json({ error: 'Máy chủ gặp lỗi. Vui lòng thử lại sau.' })
})

async function start() {
  await mongoose.connect(process.env.MONGODB_URI)
  const username = process.env.ADMIN_USERNAME.trim()
  const existingAdmin = await Admin.findOne({ username })
  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash(process.env.ADMIN_PASSWORD, 12)
    await Admin.create({ username, passwordHash })
    console.log(`Đã tạo tài khoản quản trị ban đầu: ${username}`)
  }
  app.listen(port, '0.0.0.0', () => console.log(`Graduation API đang chạy tại cổng ${port}`))
}

start().catch((error) => {
  console.error('Không thể khởi động API:', error.message)
  process.exit(1)
})
