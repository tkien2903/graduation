import jwt from 'jsonwebtoken'

export function requireAdmin(request, response, next) {
  const token = request.headers.authorization?.replace(/^Bearer\s+/i, '')
  if (!token) return response.status(401).json({ error: 'Vui lòng đăng nhập quản trị.' })
  try {
    request.admin = jwt.verify(token, process.env.JWT_SECRET)
    return next()
  } catch {
    return response.status(401).json({ error: 'Phiên đăng nhập không hợp lệ hoặc đã hết hạn.' })
  }
}
