import Link from "next/link";
import { usePathname } from "next/navigation";

type NavSliderProps = {
    isOpen: boolean;
};

const NavSliderDashboardComponent = ({ isOpen }: NavSliderProps) => {
    const pathname = usePathname();

    const navItems = [
        { name: "Tổng quan", path: "/dashboard", icon: "📊" },
        { name: "Giám sát Camera", path: "/dashboard/camera", icon: "🎥" },
        { name: "Log Cảnh báo", path: "/dashboard/alerts", icon: "⚠️" },
        {
            name: "Nhật ký Điểm danh",
            path: "/dashboard/attendance",
            icon: "📝",
        },
        { name: "Quản lý Nhân sự", path: "/dashboard/users", icon: "👥" },
    ];

    return (
        <aside
            className={`fixed top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-[#161b22]/90 backdrop-blur-xl border-r border-white/10 z-40 transition-transform duration-300 ease-in-out ${
                isOpen ? "translate-x-0" : "-translate-x-full"
            }`}
        >
            <nav className="p-4">
                <ul className="space-y-2">
                    {navItems.map((item) => {
                        // Kiểm tra xem menu này có phải là trang hiện tại không
                        const isActive = pathname === item.path;

                        return (
                            <li key={item.path}>
                                <Link
                                    href={item.path}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                                        isActive
                                            ? "bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.15)]"
                                            : "text-slate-400 hover:bg-white/5 hover:text-white border border-transparent"
                                    }`}
                                >
                                    <span className="text-xl">{item.icon}</span>
                                    <span className="font-medium text-sm">
                                        {item.name}
                                    </span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>
        </aside>
    );
};

export default NavSliderDashboardComponent;
