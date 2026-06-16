"use client";

import { useRecognizeSession } from "@/hooks/useRecognizeSession";
import { useEffect, useRef } from "react";

const Recognize = () => {
    const {
        isRunning,
        statusText,
        statusType,
        recognizedName,
        confidence,
        consecutive,
        required,
        lastLogged,
        videoRef,
        canvasRef,
        toggle,
    } = useRecognizeSession();

    const progressPct = Math.min((consecutive / required) * 100, 100);
    const hasAutoStarted = useRef(false);

    useEffect(() => {
        if (!hasAutoStarted.current && !isRunning) {
            hasAutoStarted.current = true;
            toggle();
        }
    }, [toggle, isRunning]);

    return (
        <div className="min-h-screen flex items-center justify-center p-4 sm:p-8 bg-[#0f0f14] font-sans">
            <div className="flex flex-col gap-5 w-full max-w-[640px]">
                {/* ── KHU VỰC CAMERA & OVERLAY TỐI GIẢN ───────────────────────── */}
                <div className="relative w-full rounded-[2rem] overflow-hidden border border-white/10 bg-black shadow-2xl">
                    <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="block w-full h-[600px] sm:h-[720px] object-cover -scale-x-100 bg-white"
                    />
                    <canvas ref={canvasRef} className="hidden" />

                    {/* OVERLAY: CHỈ HIỆN CHỮ TRÊN ĐỈNH */}
                    <div className="absolute top-6 left-0 right-0 flex justify-center z-20 px-4 pointer-events-none">
                        {/* Khi thất bại */}
                        {statusType === "warning" && (
                            <div className="bg-red-500/80 backdrop-blur-md px-6 py-2.5 rounded-full text-white font-bold text-sm sm:text-base shadow-lg animate-in fade-in slide-in-from-top-4">
                                ⚠️ KHÔNG NHẬN DIỆN ĐƯỢC
                            </div>
                        )}

                        {/* Khi thành công */}
                        {statusType === "success" ||
                            (statusType === "" && recognizedName && (
                                <div className="bg-emerald-500/80 backdrop-blur-md px-6 py-2.5 rounded-full text-white font-bold text-sm sm:text-base shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-top-4">
                                    <span>✅ {recognizedName}</span>
                                    <span className="text-emerald-100 font-normal border-l border-emerald-400/50 pl-2 ml-1">
                                        {(confidence * 100).toFixed(0)}%
                                    </span>
                                    <span>Điểm danh thành công</span>
                                </div>
                            ))}

                        {/* Khi đang quét bình thường (Tùy chọn) */}
                        {/* {statusType === "" && isRunning && (
                            <div className="bg-black/40 backdrop-blur-md px-6 py-2 rounded-full text-white/70 font-medium text-sm shadow-lg">
                                Đang quét khuôn mặt...
                            </div>
                        )} */}
                    </div>

                    {/* THANH TIẾN ĐỘ QUÉT */}
                    <div className="absolute bottom-0 left-0 right-0 h-2 bg-black/50 z-30">
                        <div
                            className="h-full bg-blue-500 transition-[width] duration-200 shadow-[0_0_10px_rgba(59,130,246,0.8)]"
                            style={{ width: `${progressPct}%` }}
                        />
                    </div>
                </div>

                {/* ── BẢNG ĐIỀU KHIỂN ──────────────────
                <div className="w-full flex flex-col gap-4 bg-white/[0.04] border border-white/[0.08] rounded-[2rem] p-6 backdrop-blur-xl shadow-2xl">
                    <div className="flex justify-between items-center bg-white/5 rounded-2xl p-4 border border-white/5">
                        <span className="text-sm text-white/50 uppercase tracking-widest font-bold">
                            Lượt cuối
                        </span>
                        <span className="text-base sm:text-lg text-emerald-400 font-black tracking-wide">
                            {lastLogged ?? "Chưa có dữ liệu"}
                        </span>
                    </div>

                    <div className="flex flex-row gap-4">
                        <button
                            onClick={toggle}
                            className={`flex-1 py-3.5 rounded-2xl font-bold text-base transition-all ${
                                isRunning
                                    ? "bg-red-500/15 hover:bg-red-500/25 text-red-400 border border-red-500/30"
                                    : "bg-blue-600 hover:bg-blue-500 text-white shadow-[0_5px_20px_rgba(37,99,235,0.4)]"
                            }`}
                        >
                            {isRunning ? "Tạm Dừng" : "Bật Camera"}
                        </button>
                        <a
                            href="/"
                            className="flex-1 py-3.5 rounded-2xl bg-white/[0.05] hover:bg-white/[0.1] text-white/80 border border-white/[0.1] font-bold text-base text-center transition-all flex items-center justify-center"
                        >
                            Dashboard
                        </a>
                    </div>
                </div> */}
            </div>
        </div>
    );
};

export default Recognize;
