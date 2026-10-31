# Graduation Invite

Website thiệp mời tốt nghiệp gồm React/Vite frontend (`frontend`) và Express API (`backend`). Giao diện hiện có được giữ nguyên; form RSVP gửi qua Axios.

## Giai đoạn backend: chạy local

Yêu cầu Node.js 20+, MongoDB local hoặc MongoDB Atlas.

1. Tạo database MongoDB (Atlas hoặc cài MongoDB local). MongoDB Compass là ứng dụng xem/quản lý dữ liệu, không phải máy chủ database.
2. Trong `backend`, sao chép `.env.example` thành `.env`; điền `MONGODB_URI`, `JWT_SECRET` (ít nhất 32 ký tự) và mật khẩu admin (ít nhất 12 ký tự).
3. Chạy `npm install`, sau đó `npm run dev` trong thư mục `backend`.
4. Terminal khác: vào `frontend`, chạy `npm install` nếu cần rồi `npm run dev`. Mở địa chỉ Vite hiện ra.
5. API kiểm tra hoạt động tại `http://localhost:3001/api/health`.

API tạo tài khoản admin ban đầu từ `ADMIN_USERNAME` và `ADMIN_PASSWORD` khi khởi động lần đầu. Đổi mật khẩu admin trong MongoDB trước khi triển khai dùng thật; cập nhật tài khoản hiện có không tự đổi mật khẩu theo biến môi trường.

## API hiện có

- `POST /api/rsvp`: `{ "name": "Tên khách", "status": "attending", "message": "Lời chúc" }` hoặc `declined`. Lời chúc không bắt buộc, tối đa 500 ký tự. Trùng tên sau chuẩn hóa trả `409`; giới hạn 10 lần gửi mỗi IP trong 15 phút.
- `GET /api/site-settings`: lấy thông tin lễ và danh sách URL ảnh.
- `POST /api/admin/login`: đăng nhập, trả JWT (hiệu lực 8 giờ).
- Các API còn lại cần `Authorization: Bearer <token>`: `GET /api/admin/dashboard`, `GET/POST /api/admin/guests`, `PATCH/DELETE /api/admin/guests/:id`, `GET /api/admin/guests/export`, `PUT /api/admin/site-settings`.

Trang quản trị đăng nhập tại `http://localhost:5173/admin`. Tài khoản local nằm trong `backend/.env`.

## Thay ảnh cá nhân và ảnh kỷ niệm

Ảnh của Kiên dùng `frontend/public/images/ava.jpg`; thư viện hiện lấy các ảnh kỷ niệm đang có trong thư mục này. Nếu muốn thêm hoặc bớt ảnh, sửa danh sách `MEMORY_PHOTOS` trong `frontend/src/config/images.js`. Tên có dấu, khoảng trắng và đuôi `.jpg`/`.png`/`.webp` được hỗ trợ. Ảnh thư viện bị thiếu hoặc không đọc được sẽ tự bị bỏ khỏi lưới, không để lại ô trống; ảnh chân dung sẽ hiện khung nhắc thay thế.

`pending` là trạng thái khách được admin thêm trước khi xác nhận. Database lưu thời điểm tạo/cập nhật tự động; xuất Excel có thời điểm xác nhận theo giờ Việt Nam. Dữ liệu RSVP không được mở qua API công khai.

## Triển khai

Frontend dùng đường dẫn tương đối `/api`; khi deploy cần proxy `/api` tới backend hoặc cấu hình reverse proxy cùng domain. Trên backend đặt `MONGODB_URI`, `JWT_SECRET`, `ADMIN_USERNAME`, `ADMIN_PASSWORD`, `CLIENT_ORIGIN` và `PORT`. Không đưa `.env` lên GitHub. Deploy Vercel/Render và tải ảnh lên dịch vụ lưu trữ sẽ cấu hình ở giai đoạn tiếp theo.
