"use client";

import type { RefObject } from "react";

interface Props {
    videoRef: RefObject<HTMLVideoElement | null>;
    canvasRef: RefObject<HTMLCanvasElement | null>;
    name: string;
    shots: number;
    maxShots: number;
    progress: number;
    statusText: string;
    statusReason: string;
    instruction: string;
    isPaused: boolean;
    onCancel: () => void;
}

export default function CameraStep({
    videoRef,
    canvasRef,
    name,
    shots,
    maxShots,
    progress,
    statusText,
    statusReason,
    onCancel,
    instruction,
    isPaused,
}: Props) {
    const displayName = name.replace(/_/g, " ");
    const progressPct = Math.round(progress * 100);

    return (
        <div className="flex gap-6 items-start flex-wrap justify-center w-full max-w-4xl">
            {/* ── Video feed ───────────────────────────────────────────── */}
            <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-black flex-shrink-0">
                <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="block w-[480px] max-w-full h-auto -scale-x-100"
                />
                <canvas ref={canvasRef} className="hidden" />

                {/* Face guide oval */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[52%] w-[200px] h-[240px] border-2 border-sky-400/55 rounded-full pointer-events-none" />

                {/* Lệnh hướng dẫn (Nổi lên trên Camera) */}
                <div className="absolute bottom-10 w-full flex justify-center z-10">
                    <div
                        className={`px-6 py-2.5 rounded-full font-semibold text-sm transition-all duration-300 shadow-2xl border ${
                            isPaused
                                ? "bg-blue-600 text-white scale-105 border-blue-400"
                                : "bg-black/60 text-white/90 backdrop-blur-md border-white/20"
                        }`}
                    >
                        {instruction}
                    </div>
                </div>

                {/* Shot badge */}
                <div className="absolute bottom-3 right-3.5 bg-black/65 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                    {shots} / {maxShots}
                </div>
            </div>

            {/* ── Status panel ─────────────────────────────────────────── */}
            <div className="flex-1 min-w-[280px] flex flex-col gap-4 bg-white/[0.04] border border-white/[0.08] rounded-2xl p-6 backdrop-blur-xl">
                <h2 className="text-sm font-semibold text-white/85">
                    Registering:{" "}
                    <span className="text-sky-400">{displayName}</span>
                </h2>

                {/* Status */}
                <div className="flex justify-between items-center gap-2">
                    <span className="text-[0.7rem] text-white/40 uppercase tracking-widest">
                        Status
                    </span>
                    <span className="text-xs font-semibold text-emerald-300 bg-emerald-300/10 px-2.5 py-0.5 rounded-full">
                        {statusText}
                    </span>
                </div>

                {/* Hint */}
                <div className="flex justify-between items-center gap-2">
                    <span className="text-[0.7rem] text-white/40 uppercase tracking-widest">
                        Hint
                    </span>
                    <span className="text-xs text-white/55 text-right">
                        {statusReason}
                    </span>
                </div>

                {/* Progress bar */}
                <div>
                    <div className="h-1.5 bg-white/8 rounded-full overflow-hidden">
                        <div
                            className={`h-full rounded-full transition-[width] duration-200 ${
                                isPaused
                                    ? "bg-slate-500"
                                    : "bg-linear-to-r from-blue-500 to-sky-400"
                            }`}
                            style={{ width: `${progressPct}%` }}
                        />
                    </div>
                    <p className="text-[0.7rem] text-white/35 mt-1">
                        Độ ổn định: {progressPct}%
                    </p>
                </div>

                {/* Shot dots */}
                <div className="flex gap-2">
                    {Array.from({ length: maxShots }).map((_, i) => (
                        <div
                            key={i}
                            className={`w-3 h-3 rounded-full border transition-all duration-300 ${
                                i < shots
                                    ? "bg-sky-400 border-sky-400 shadow-[0_0_6px_rgba(56,189,248,0.5)]"
                                    : "bg-white/10 border-white/20"
                            }`}
                        />
                    ))}
                </div>

                <button
                    onClick={onCancel}
                    className="mt-auto w-full py-2.5 rounded-xl bg-red-500/15 hover:bg-red-500/25 text-red-400 border border-red-500/25 font-semibold text-sm transition-colors"
                >
                    Cancel
                </button>
            </div>
        </div>
    );
}
