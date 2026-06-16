import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

// ===== CẤU HÌNH SEO CHUẨN =====
export const metadata: Metadata = {
    // Dùng template để các trang con tự động thêm đuôi tên hệ thống (VD: "Đăng nhập | Attendance Tracking System")
    title: {
        default: "Attendance Tracking System",
        template: "%s | Attendance Tracking System",
    },
    description:
        "Hệ thống theo dõi điểm danh. Chọn một chức năng bên dưới để bắt đầu.",
    keywords: [
        "chấm công",
        "điểm danh",
        "nhận diện khuôn mặt",
        "attendance tracking",
        "face recognition",
        "admin",
    ],

    // Open Graph: Dùng để hiển thị đẹp khi share link qua Zalo, Facebook, Telegram...
    openGraph: {
        title: "Attendance Tracking System",
        description:
            "Hệ thống theo dõi điểm danh. Chọn một chức năng bên dưới để bắt đầu.",
        url: "/", // Bạn có thể thay bằng domain thật sau này (VD: https://chamcong.com)
        siteName: "Attendance Tracking",
        locale: "vi_VN",
        type: "website",
    },

    // Báo cho bot Google biết là trang này có được phép lập chỉ mục không
    // Lưu ý: Nếu đây là trang Admin nội bộ bảo mật, bạn nên đổi index: false, follow: false
    robots: {
        index: true,
        follow: true,
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html
            lang="en"
            className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
        >
            <body className="min-h-full flex flex-col">{children}</body>
        </html>
    );
}
