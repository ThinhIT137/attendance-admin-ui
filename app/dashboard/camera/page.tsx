"use client";

import { useState } from "react";

const CAMERA_LIST = [
    {
        id: "cam_01",
        name: "Camera Cửa Chính",
        url: "http://127.0.0.1:5150/video_feed",
    },
    {
        id: "cam_02",
        name: "Camera Hành Lang",
        url: "http://127.0.0.1:5150/video_feed",
    },
    {
        id: "cam_03",
        name: "Camera Căn Tin",
        url: "http://127.0.0.1:5150/video_feed",
    },
    {
        id: "cam_04",
        name: "Camera Nhà Xe",
        url: "http://127.0.0.1:5150/video_feed",
    },
    { id: "cam_05", name: "Camera Kho Hàng", url: "" },
    { id: "cam_06", name: "Camera Sảnh Chờ", url: "" },
];

const Camera = () => {
    const [activeCams, setActiveCams] = useState([
        CAMERA_LIST[0],
        CAMERA_LIST[1],
        CAMERA_LIST[2],
        CAMERA_LIST[3],
    ]);

    // Hàm đổi camera cho 1 slot cụ thể trong Grid (slotIndex từ 0 -> 3)
    const handleSelectCamera = (slotIndex: number, camId: string) => {
        const selectedCam = CAMERA_LIST.find((c) => c.id === camId);
        if (selectedCam) {
            const newActiveCams = [...activeCams];
            newActiveCams[slotIndex] = selectedCam;
            setActiveCams(newActiveCams);
        }
    };

    return (
        <div className="min-h-screen bg-[#0f0f14] text-white p-4 sm:p-8 font-sans flex flex-col gap-6">
            {/* Header */}
            <div className="flex justify-between items-center bg-white/5 p-5 rounded-2xl border border-white/10">
                <div>
                    <h1 className="text-2xl font-black tracking-wide text-white">
                        HỆ THỐNG GIÁM SÁT KÉP
                    </h1>
                    <p className="text-white/50 text-sm mt-1">
                        Theo dõi song song Camera Góc Rộng & Kiosk
                    </p>
                </div>
                <div className="flex gap-3">
                    <span className="px-4 py-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl text-sm font-bold flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        Hệ thống ổn định
                    </span>
                </div>
            </div>

            {/* Grid 4 Camera (2x2) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1">
                {activeCams.map((cam, index) => (
                    <div
                        key={`${index}-${cam.id}`}
                        className="flex flex-col bg-black rounded-[1.5rem] border border-white/10 overflow-hidden shadow-2xl relative"
                    >
                        {/* Overlay Controls của từng slot Camera */}
                        <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/80 to-transparent z-10 flex justify-between items-center">
                            <select
                                className="bg-white/10 backdrop-blur-md text-white/90 border border-white/20 rounded-lg px-3 py-1.5 text-sm font-bold outline-none cursor-pointer hover:bg-white/20 transition-all appearance-none"
                                value={cam.id}
                                onChange={(e) =>
                                    handleSelectCamera(index, e.target.value)
                                }
                            >
                                {CAMERA_LIST.map((c) => (
                                    <option
                                        key={c.id}
                                        value={c.id}
                                        className="bg-[#1a1a24]"
                                    >
                                        {c.name}
                                    </option>
                                ))}
                            </select>

                            {cam.url && (
                                <span className="flex items-center gap-2 text-xs font-bold text-red-400 bg-red-500/10 px-2.5 py-1 rounded-md border border-red-500/20">
                                    <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                                    LIVE
                                </span>
                            )}
                        </div>

                        {/* Video Player (Dùng thẻ img cho MJPEG) */}
                        <div className="flex-1 min-h-[300px] w-full bg-[#0a0a0f] flex items-center justify-center">
                            {cam.url ? (
                                // Đây chính là "bí thuật" hiển thị MJPEG
                                <img
                                    src={cam.url}
                                    alt={cam.name}
                                    className="w-full h-full object-cover"
                                    // Thêm cache-busting nếu cần: src={`${cam.url}?t=${Date.now()}`}
                                />
                            ) : (
                                <div className="flex flex-col items-center justify-center text-white/20">
                                    <svg
                                        className="w-12 h-12 mb-3 opacity-50"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3"
                                        />
                                    </svg>
                                    <span className="font-medium">
                                        Mất tín hiệu hoặc Chưa cấu hình
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Camera;
