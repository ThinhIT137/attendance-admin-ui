import { registerApi } from "@/app/api/registerApi";
import { RegisterStep } from "@/libs/Registration";
import { stopStream, captureFrame, openCamera } from "@/libs/Webcam";
import { useCallback, useEffect, useRef, useState } from "react";

const FRAME_INTERVAL_MS = 200;

const INSTRUCTIONS = [
    "Vui lòng nhìn thẳng vào camera",
    "Từ từ quay mặt sang TRÁI",
    "Từ từ quay mặt sang PHẢI",
    "Ngẩng mặt LÊN một chút",
    "Cúi mặt XUỐNG một chút",
    "Đã xong, đang xử lý dữ liệu!",
];

// ── State shape expose ra ngoài ───────────────────────────────────────────────
export type RegisterSessionState = {
    step: RegisterStep;
    currentName: string; // tên đang register (raw, có thể có underscore)
    shots: number;
    maxShots: number;
    progress: number; // 0–1, stability progress
    statusText: string;
    statusReason: string;
    doneMessage: string;
    error: string;
    instruction: string;
    isPaused: boolean;
};

export type RegisterSessionActions = {
    videoRef: React.RefObject<HTMLVideoElement | null>;
    canvasRef: React.RefObject<HTMLCanvasElement | null>;
    startRegistration: (name: string) => Promise<void>;
    cancelRegistration: () => void;
    resetForm: () => void;
};
// ─────────────────────────────────────────────────────────────────────────────

export function useRegisterSession(): RegisterSessionState &
    RegisterSessionActions {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const sessionIdRef = useRef<string | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const shotsRef = useRef(0);
    const isPausedRef = useRef(false);

    const [step, setStep] = useState<RegisterStep>("name");
    const [currentName, setCurrentName] = useState("");
    const [shots, setShots] = useState(0);
    const [maxShots, setMaxShots] = useState(5);
    const [progress, setProgress] = useState(0);
    const [statusText, setStatusText] = useState("Initializing...");
    const [statusReason, setStatusReason] = useState("—");
    const [doneMessage, setDoneMessage] = useState("");
    const [error, setError] = useState("");
    const [instruction, setInstruction] = useState(INSTRUCTIONS[0]);
    const [isPaused, setIsPaused] = useState(false);

    const speakInstruction = useCallback((text: string) => {
        if ("speechSynthesis" in window) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = "vi-VN";
            utterance.rate = 0.95; // Tốc độ vừa phải
            utterance.pitch = 1;

            const voices = window.speechSynthesis.getVoices();
            const viVoice = voices.find((v) => v.lang === "vi-VN");
            if (viVoice) utterance.voice = viVoice;

            window.speechSynthesis.speak(utterance);
        }
    }, []);

    useEffect(() => {
        if (step === "camera") {
            speakInstruction(instruction);
        }
    }, [instruction, step, speakInstruction]);

    // Dùng một plain function, bọc trong useEffect riêng để cleanup
    function stopCapture() {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
        stopStream(streamRef.current);
        streamRef.current = null;
    }

    useEffect(() => {
        // trả về cleanup function — chạy khi unmount
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
            stopStream(streamRef.current);
            window.speechSynthesis?.cancel();
        };
    }, []);

    // ── finish registration ─────────────────────────────────────────────────────

    async function finishRegistration(sid: string) {
        stopCapture();
        setStep("processing");

        try {
            const data = await registerApi.finish(sid);
            setDoneMessage(
                `${data.name.replace(/_/g, " ")} registered with ${data.embeddings_saved} embedding(s).`,
            );
            setStep("done");
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : "Unknown error";
            setError(`Registration failed: ${msg}`);
            setStep("name");
        }
    }

    // ── Send 1 frame ────────────────────────────────────────────────────────────

    async function sendFrame(sid: string) {
        if (isPausedRef.current) return;

        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (!video || !canvas || video.readyState < 2) return;

        let data;
        try {
            const image = captureFrame(video, canvas);
            data = await registerApi.sendFrame(sid, image);
        } catch {
            return;
        }

        if (data.shots > shotsRef.current) {
            setShots(data.shots);
            setProgress(data.progress);
            if (data.shots < maxShots) {
                // Đổi câu hướng dẫn tiếp theo
                setInstruction(INSTRUCTIONS[data.shots]);

                // BẬT HÃM PHANH (2.5 giây để user nghe và xoay mặt)
                setIsPaused(true);
                isPausedRef.current = true;

                setTimeout(() => {
                    setIsPaused(false);
                    isPausedRef.current = false;
                }, 2500);
            } else {
                setInstruction(INSTRUCTIONS[5]);
            }
        } else {
            // Chỉ cập nhật state nếu chưa chụp xong tấm mới
            setShots(data.shots);
        }

        switch (data.status) {
            case "NO_FACE":
                setStatusText("No face detected");
                setStatusReason("Move closer to the camera");
                break;
            case "INVALID":
                setStatusText("Adjust your position");
                setStatusReason(data.reasons?.join(", ") ?? "—");
                break;
            case "STABILIZING":
                setStatusText("Hold still…");
                setStatusReason(
                    `Stability: ${Math.round(data.progress * 100)}%`,
                );
                break;
            case "BURST_CAPTURE":
                setStatusText("Capturing…");
                setStatusReason(`${data.shots} / ${data.max_shots} shots`);
                break;
            case "COMPLETE":
                setStatusText("Done!");
                setStatusReason("Processing…");
                clearInterval(intervalRef.current!);
                intervalRef.current = null;
                finishRegistration(sid);
                break;
        }
    }

    // ── Public actions ──────────────────────────────────────────────────────────

    async function startRegistration(name: string) {
        setError("");

        let sid: string;
        let max: number;
        try {
            const data = await registerApi.start(name);
            sid = data.session_id;
            max = data.max_shots;
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : "Unknown error";
            setError(`Failed to start session: ${msg}`);
            return;
        }

        sessionIdRef.current = sid;
        setCurrentName(name);
        setMaxShots(max);

        try {
            const stream = await openCamera();
            streamRef.current = stream;
            if (videoRef.current) videoRef.current.srcObject = stream;
        } catch {
            setError("Camera access denied. Please allow camera permission.");
            return;
        }

        setStep("camera");
        setShots(0);
        setProgress(0);
        setStatusText("Look at the camera…");
        setStatusReason("—");
        setInstruction(INSTRUCTIONS[0]);
        setIsPaused(false);
        isPausedRef.current = false;

        intervalRef.current = setInterval(
            () => sendFrame(sid),
            FRAME_INTERVAL_MS,
        );
    }

    function cancelRegistration() {
        stopCapture();
        sessionIdRef.current = null;
        setShots(0);
        setProgress(0);
        setStep("name");
    }

    function resetForm() {
        setShots(0);
        setProgress(0);
        setDoneMessage("");
        setError("");
        setStep("name");
    }

    return {
        step,
        currentName,
        shots,
        maxShots,
        progress,
        statusText,
        statusReason,
        doneMessage,
        error,
        instruction,
        isPaused,
        videoRef,
        canvasRef,
        startRegistration,
        cancelRegistration,
        resetForm,
    };
}
