import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const UserMenuDashboardComponent = () => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    // Tính năng tự động đóng menu khi click ra ngoài vùng menu
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={menuRef}>
            {/* --- Nút bấm kích hoạt Menu --- */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-3 px-2 py-1.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            >
                <div className="relative w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-sm font-bold text-white shadow-lg overflow-hidden border border-white/20">
                    {/* Dùng Next/Image nếu có link ảnh thật, nếu không sẽ hiển thị chữ AD */}
                    {/* <Image src="/path-to-avatar.jpg" alt="Avatar" fill className="object-cover" /> */}
                    AD
                </div>
                <span className="text-sm font-medium pr-1 hidden sm:block text-slate-200">
                    Admin
                </span>

                {/* Mũi tên chỉ xuống (xoay ngược khi mở) */}
                <svg
                    className={`w-4 h-4 text-slate-400 transition-transform duration-200 mr-2 ${
                        isOpen ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                    />
                </svg>
            </button>

            {/* --- Khối Dropdown Menu thả xuống --- */}
            {isOpen && (
                <div className="absolute right-0 mt-3 w-56 bg-[#161b22]/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl py-2 z-50 transform origin-top-right transition-all animate-in fade-in slide-in-from-top-2">
                    {/* Phần Header của Menu (Hiển thị thông tin user) */}
                    <div className="px-4 py-3 border-b border-white/10 mb-2">
                        <p className="text-sm font-medium text-white">
                            Quản trị viên
                        </p>
                        <p className="text-xs text-slate-400 truncate">
                            admin@facetrack.com
                        </p>
                    </div>

                    {/* Các mục chức năng */}
                    <ul className="px-2 space-y-1">
                        <li>
                            <Link
                                href="/dashboard/profile"
                                onClick={() => setIsOpen(false)}
                                className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
                            >
                                <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                    />
                                </svg>
                                Hồ sơ (Profile)
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/dashboard/settings"
                                onClick={() => setIsOpen(false)}
                                className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
                            >
                                <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                                    />
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                    />
                                </svg>
                                Cài đặt (Settings)
                            </Link>
                        </li>

                        {/* Đường kẻ ngang phân cách */}
                        <div className="h-px bg-white/10 my-2 mx-2"></div>

                        <li>
                            <button
                                onClick={() => {
                                    setIsOpen(false);
                                    // Chèn logic xóa token / đăng xuất tại đây
                                    console.log("User logged out");
                                }}
                                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                            >
                                <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                                    />
                                </svg>
                                Đăng xuất
                            </button>
                        </li>
                    </ul>
                </div>
            )}
        </div>
    );
};

export default UserMenuDashboardComponent;
