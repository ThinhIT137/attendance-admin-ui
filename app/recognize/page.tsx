"use client";

import { useRecognizeSession } from "@/hooks/useRecognizeSession";

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

    return (
        <div className="min-h-screen flex items-center justify-center p-4 sm:p-8 bg-[#0f0f14] font-sans">
            <div className="flex flex-col gap-6 w-full max-w-[640px]">
                {/* ── Video feed ───────────────────────── */}
                <div className="relative w-full rounded-[2rem] overflow-hidden border border-white/10 bg-black shadow-2xl">
                    <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="block w-full h-[600px] sm:h-[720px] object-cover -scale-x-100"
                    />
                    <canvas ref={canvasRef} className="hidden" />

                    {/* Name overlay */}
                    {recognizedName && (
                        <div className="absolute bottom-8 w-full flex justify-center z-10">
                            <div className="px-6 py-3 rounded-full font-bold text-lg bg-emerald-500/80 text-white backdrop-blur-md border border-emerald-400/50 shadow-lg">
                                {recognizedName} —{" "}
                                {(confidence * 100).toFixed(1)}%
                            </div>
                        </div>
                    )}

                    {/* Consensus bar */}
                    <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-white/10">
                        <div
                            className="h-full bg-emerald-400 transition-[width] duration-200"
                            style={{ width: `${progressPct}%` }}
                        />
                    </div>
                </div>

                {/* ── Control panel ────────────────── */}
                <div className="w-full flex flex-col gap-5 bg-white/[0.04] border border-white/[0.08] rounded-[2rem] p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
                    <h1 className="text-xl sm:text-2xl font-bold text-white/90 text-center tracking-wide">
                        LIVE RECOGNITION
                    </h1>

                    <div className="flex justify-between items-center gap-4">
                        <span className="text-sm sm:text-base text-white/40 uppercase tracking-widest font-semibold">
                            Status
                        </span>
                        <span
                            className={`text-sm font-bold px-4 py-1.5 rounded-full ${
                                statusType === "success"
                                    ? "text-emerald-300 bg-emerald-300/10 border border-emerald-500/30"
                                    : statusType === "warning"
                                      ? "text-yellow-300 bg-yellow-300/10 border border-yellow-500/30"
                                      : statusType === "error"
                                        ? "text-red-400 bg-red-400/10 border border-red-500/30"
                                        : "text-white/50 bg-white/5 border border-white/10"
                            }`}
                        >
                            {statusText}
                        </span>
                    </div>

                    <div className="flex justify-between items-center gap-4">
                        <span className="text-sm sm:text-base text-white/40 uppercase tracking-widest font-semibold">
                            Last Logged
                        </span>
                        <span className="text-base sm:text-lg text-emerald-400 text-right font-bold">
                            {lastLogged ?? "—"}
                        </span>
                    </div>

                    {/* Consensus progress */}
                    <div className="mt-2">
                        <div className="h-2.5 bg-white/10 rounded-full overflow-hidden shadow-inner">
                            <div
                                className="h-full rounded-full bg-emerald-400 transition-[width] duration-200"
                                style={{ width: `${progressPct}%` }}
                            />
                        </div>
                        <p className="text-sm text-white/40 mt-3 text-center font-medium">
                            Consensus:{" "}
                            <span className="text-white/80">
                                {consecutive} / {required}
                            </span>
                        </p>
                    </div>

                    <div className="flex flex-row gap-4 mt-2">
                        <button
                            onClick={toggle}
                            className={`flex-1 py-4 rounded-2xl font-bold text-lg transition-all ${
                                isRunning
                                    ? "bg-red-500/15 hover:bg-red-500/25 text-red-400 border border-red-500/30"
                                    : "bg-blue-600 hover:bg-blue-500 text-white shadow-[0_5px_20px_rgba(37,99,235,0.4)]"
                            }`}
                        >
                            {isRunning ? "Stop" : "Start"}
                        </button>
                        <a
                            href="/"
                            className="flex-1 py-4 rounded-2xl bg-white/[0.05] hover:bg-white/[0.1] text-white/80 border border-white/[0.1] font-bold text-lg text-center transition-all flex items-center justify-center"
                        >
                            Dashboard
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Recognize;
