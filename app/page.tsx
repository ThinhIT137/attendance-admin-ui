import Image from "next/image";
import Link from "next/link";

const Page = () => {
    // Tui thêm mô tả (desc) và màu sắc riêng cho từng thẻ để giao diện sinh động hơn
    const Items = [
        {
            name: "Quản lý Hệ thống",
            desc: "Xem thống kê, người dùng & lịch sử",
            path: "/dashboard",
            icon: "📊",
            colorHover: "group-hover:border-blue-500/50",
            bgGlow: "group-hover:bg-blue-500/5",
        },
        {
            name: "Đăng ký Khuôn mặt",
            desc: "Thêm mặt nhân viên mới",
            path: "/register",
            icon: "👤",
            colorHover: "group-hover:border-purple-500/50",
            bgGlow: "group-hover:bg-purple-500/5",
        },
        {
            name: "Điểm danh Trực tiếp",
            desc: "Mở camera nhận diện Live",
            path: "/recognize",
            icon: "🎥",
            colorHover: "group-hover:border-emerald-500/50",
            bgGlow: "group-hover:bg-emerald-500/5",
        },
    ];

    return (
        <div className="min-h-screen bg-[#0f0f14] flex flex-col items-center justify-center p-6 md:p-12 font-sans relative overflow-hidden">
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />

            <div className="z-10 w-full max-w-5xl flex flex-col items-center">
                {/* ── Header Section ──────────────────────────────────────── */}
                <div className="flex flex-col items-center mb-12 md:mb-16 text-center">
                    <div className="relative w-32 h-32 md:w-40 md:h-40 mb-6 drop-shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-transform hover:scale-105 duration-300">
                        <Image
                            src="/logo.png" // Nhớ thêm dấu / đằng trước để Next.js lấy đúng file trong folder public
                            alt="Logo"
                            fill
                            className="object-contain"
                        />
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-400 via-teal-300 to-blue-500 bg-clip-text text-transparent mb-4">
                        Attendance Tracking System
                    </h1>
                    <p className="text-white/50 text-base md:text-lg max-w-xl">
                        Hệ thống theo dõi điểm danh. Chọn một chức năng bên dưới
                        để bắt đầu.
                    </p>
                </div>

                {/* ── Navigation Cards Section ────────────────────────────── */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                    {Items.map((item, index) => (
                        <Link
                            href={item.path}
                            key={index}
                            className="block group outline-none"
                        >
                            <div
                                className={`relative h-full flex flex-col items-center text-center p-8 rounded-3xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-md transition-all duration-300 transform group-hover:-translate-y-2 group-hover:shadow-2xl ${item.colorHover} ${item.bgGlow}`}
                            >
                                {/* Icon container */}
                                <div className="text-5xl md:text-6xl mb-6 transition-transform duration-300 group-hover:scale-110">
                                    {item.icon}
                                </div>

                                {/* Text container */}
                                <h2 className="text-xl md:text-2xl font-bold text-white/90 mb-2 transition-colors">
                                    {item.name}
                                </h2>
                                <p className="text-sm text-white/40 group-hover:text-white/60 transition-colors">
                                    {item.desc}
                                </p>

                                {/* Nút bấm ảo để trông giống Card tương tác */}
                                <div className="mt-8 px-6 py-2 rounded-full border border-white/10 text-white/30 text-xs font-semibold uppercase tracking-widest group-hover:bg-white/10 group-hover:text-white/90 transition-all">
                                    Truy cập ➔
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Footer */}
            <div className="absolute bottom-6 text-white/20 text-xs font-medium tracking-wider">
                © 2026 FACETRACK ADMIN PORTAL
            </div>
        </div>
    );
};

export default Page;
