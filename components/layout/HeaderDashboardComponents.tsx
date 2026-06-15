"use client";

import NavSliderDashboardComponent from "@/components/layout/NavSliderDashboardComponent";
import { useState } from "react";
import UserMenuDashboardComponent from "../ui/UserMenuDashboardComponent";

const HeaderDashboardComponent = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const [showNavSlider, setShowNavSlider] = useState(true);

    return (
        <div className="min-h-screen bg-[#0d1117] text-slate-200 font-sans">
            {/* --- HEADER --- */}
            <header className="fixed top-0 left-0 w-full h-16 bg-[#0a0e1a]/80 backdrop-blur-md border-b border-white/10 z-50 flex items-center justify-between px-6">
                {/* Logo & Toggle Button */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setShowNavSlider(!showNavSlider)}
                        className="p-2 rounded-lg hover:bg-white/10 transition-colors text-slate-300 focus:outline-none"
                    >
                        {/* Icon Hamburger SVG */}
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 6h16M4 12h16M4 18h16"
                            />
                        </svg>
                    </button>
                </div>

                {/* User Profile */}
                <div className="flex items-center">
                    <UserMenuDashboardComponent />
                </div>
            </header>

            {/* --- SIDEBAR --- */}
            <NavSliderDashboardComponent isOpen={showNavSlider} />

            {/* --- MAIN CONTENT --- */}
            {/* Khi showNavSlider = true, lùi nội dung sang phải 64 (256px) */}
            <main
                className={`pt-16 transition-all duration-300 ease-in-out ${
                    showNavSlider ? "ml-64" : "ml-0"
                }`}
            >
                <div className="p-6">
                    {/* Các trang page.tsx con sẽ được render ở đây */}
                    {children}
                </div>
            </main>
        </div>
    );
};

export default HeaderDashboardComponent;
