"use client";

import { admin } from "@/app/api/adminApi";
import { CameraViewComponent } from "@/components/ui/CameraViewComponent";
import { CameraData } from "@/libs/Webcam";
import { useEffect, useState } from "react";

const Camera = () => {
    const [cameraList, setCameraList] = useState<CameraData[]>([]);
    const [activeCams, setActiveCams] = useState<CameraData[]>([]);
    const [loading, setLoading] = useState(true);
    const [slotCount, setSlotCount] = useState(4);

    // ĐÃ XÓA state aiMap và useEffect WebSocket ở đây vì nó làm giật cả web

    // Resize màn hình chia ô
    useEffect(() => {
        const handleResize = () => {
            const w = window.innerWidth;
            if (w >= 2560) setSlotCount(16);
            else if (w >= 1440) setSlotCount(6);
            else if (w >= 1024) setSlotCount(4);
            else if (w >= 768) setSlotCount(2);
            else setSlotCount(2);
        };

        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Load Camera
    useEffect(() => {
        const loadCameras = async () => {
            try {
                const data: CameraData[] = await admin.webRTC_camera();

                const modifiedData = data.map((cam) => cam);

                setCameraList(modifiedData);
                console.log(cameraList);

                const defaultActive = Array.from({ length: 25 }).map((_, i) => {
                    return (
                        modifiedData[i] || {
                            id: `empty_${i}`,
                            name: "Trống",
                            url: "",
                        }
                    );
                });

                setActiveCams(defaultActive);
                setLoading(false);
            } catch (error) {
                console.error("Lỗi lấy danh sách Camera từ FastAPI:", error);
                setLoading(false);
            }
        };

        loadCameras();
    }, []);

    const handleSelectCamera = (slotIndex: number, camId: string) => {
        const selectedCam = cameraList.find((c) => c.id === camId);
        if (selectedCam) {
            const newActiveCams = [...activeCams];
            newActiveCams[slotIndex] = selectedCam;
            setActiveCams(newActiveCams);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0f0f14] text-white flex items-center justify-center font-bold">
                Đang tải cấu hình Camera...
            </div>
        );
    }

    const getGridClass = () => {
        if (slotCount >= 16) return "grid-cols-4"; // Màn 2560px (16 camera): Chia làm 4 cột (thành 4 hàng)
        if (slotCount >= 6) return "grid-cols-3"; // Màn 1440px (6 camera): Chia làm 3 cột (thành 2 hàng)
        if (slotCount >= 4) return "grid-cols-2"; // Màn 1024px (4 camera): Chia làm 2 cột (thành 2 hàng)

        // Màn 768px trở xuống (2 camera): Xếp dọc 1 cột cho to và dễ nhìn trên mobile/tablet
        return "grid-cols-1";

        // 💡 Note nhỏ: Nếu ở màn 768px (Tablet) mà bro vẫn muốn 2 camera nằm ngang cạnh nhau thì sửa dòng return cuối thành:
        // return "grid-cols-2";
    };

    return (
        <div className="min-h-screen bg-[#0f0f14] text-white p-4 sm:p-6 font-sans flex flex-col gap-4">
            {/* Header */}
            <div className="flex justify-between items-center bg-white/5 p-4 rounded-xl border border-white/10 shrink-0">
                <div>
                    <h1 className="text-xl sm:text-2xl font-black tracking-wide text-white">
                        HỆ THỐNG GIÁM SÁT KÉP (WEBRTC)
                    </h1>
                    <p className="text-white/50 text-xs sm:text-sm mt-1">
                        Đang chiếu {slotCount} khung hình / Tổng{" "}
                        {cameraList.length} camera
                    </p>
                </div>
                <div className="flex gap-3">
                    <span className="hidden sm:flex px-4 py-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg text-sm font-bold items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        Bố cục: {getGridClass()}
                    </span>
                </div>
            </div>

            {/* Grid Camera */}
            <div
                className={`grid gap-3 flex-1 ${getGridClass()} items-start content-start`}
            >
                {activeCams.slice(0, slotCount).map((cam, index) => (
                    <div
                        key={`${index}-${cam.id}`}
                        className="flex flex-col bg-black rounded-xl border border-white/10 overflow-hidden shadow-2xl relative aspect-video"
                    >
                        {/* Overlay Controls */}
                        <div className="absolute top-0 left-0 right-0 p-2 sm:p-3 bg-gradient-to-b from-black/80 to-transparent z-30 flex justify-between items-center">
                            <select
                                className="bg-white/10 backdrop-blur-md text-white/90 border border-white/20 rounded-md px-2 py-1 text-[10px] sm:text-xs font-bold outline-none cursor-pointer hover:bg-white/20 transition-all appearance-none max-w-[120px] sm:max-w-[150px] truncate"
                                value={cam.id}
                                onChange={(e) =>
                                    handleSelectCamera(index, e.target.value)
                                }
                            >
                                {cameraList.map((c) => (
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
                                <span className="flex items-center gap-1.5 text-[9px] sm:text-[10px] font-bold text-red-400 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">
                                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                                    LIVE
                                </span>
                            )}
                        </div>

                        {/* Bỏ truyền prop aiData đi, component tự xử */}
                        <CameraViewComponent
                            url={cam.url}
                            id={cam.id}
                            name={cam.name}
                            ws_port={cam.ws_port}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Camera;
