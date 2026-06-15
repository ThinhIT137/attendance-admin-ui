# 🎯 Hệ thống Quản trị Điểm danh AI (Sync Attend Dashboard)

Đây là giao diện Frontend (Client-side) được xây dựng bằng [Next.js](https://nextjs.org/) (App Router) để quản trị và giám sát hệ thống điểm danh tự động bằng Camera AI (ArcFace & YuNet).

## ✨ Các tính năng cốt lõi (Core Features)

Hệ thống được chia thành các phân hệ quản lý chính:

- **🔒 Đăng nhập (Login):** Phân quyền truy cập an toàn cho Admin và Nhân sự vận hành.
- **📊 Tổng quan (Dashboard):** Xem nhanh các chỉ số KPI, thống kê số lượng người có mặt, biểu đồ lưu lượng theo thời gian thực.
- **🎥 Giám sát Camera (Camera Monitor):** Xem luồng video trực tiếp (Livestream) từ các máy trạm (Booth) và trạng thái nhận diện khuôn mặt Real-time.
- **⚠️ Log Cảnh báo (Alert Logs):** Theo dõi các sự kiện bất thường (ví dụ: phát hiện người lạ, lỗi mất kết nối máy trạm, v.v.).
- **📝 Nhật ký Điểm danh (Attendance Logs):** Tra cứu, lọc và xuất dữ liệu điểm danh hàng ngày của nhân sự.
- **👥 Quản lý Nhân sự (Personnel Management):** Thêm, sửa, xóa thông tin nhân viên/sinh viên và quản lý hình ảnh khuôn mặt (Face ID) để đồng bộ xuống các trạm biên.

## 🚀 Hướng dẫn cài đặt & Chạy dự án (Getting Started)

Đầu tiên, hãy cài đặt các thư viện (nếu chưa cài):

```bash
npm install
# hoặc yarn install / pnpm install

npm run dev
# hoặc
yarn dev
# hoặc
pnpm dev
# hoặc
bun dev
```

## 📂 Cấu trúc thư mục dự kiến (Routing)

Dự án sử dụng cơ chế App Router của Next.js. Cấu trúc các trang sẽ tương ứng với các thư mục trong app/:

- app/login/page.tsx -> Trang đăng nhập

- app/dashboard/page.tsx -> Trang Tổng quan

- app/dashboard/camera/page.tsx -> Trang Giám sát Camera

- app/dashboard/alerts/page.tsx -> Trang Log Cảnh báo

- app/dashboard/attendance/page.tsx -> Trang Nhật ký Điểm danh

- app/dashboard/users/page.tsx -> Trang Quản lý Nhân sự
