import { registerApi } from "@/app/api/registerApi";
import { RegisterStep } from "@/libs/Registration";
import { stopStream, captureFrame, openCamera } from "@/libs/Webcam";
import { useCallback, useEffect, useRef, useState } from "react";

const FRAME_INTERVAL_MS = 200;
const PAUSE_MS = 5000;

const INSTRUCTIONS = [
    "Vui lòng nhìn thẳng vào camera",
    "Vui lòng nhìn thẳng vào camera",
    "Vui lòng nhìn thẳng vào camera",
    "Vui lòng nhìn thẳng vào camera",
    "Vui lòng nhìn thẳng vào camera",

    // "Từ từ quay mặt sang TRÁI",
    // "Từ từ quay mặt sang PHẢI",
    // "Ngẩng mặt LÊN một chút",
    // "Cúi mặt XUỐNG một chút",
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
    const pendingStreamRef = useRef<MediaStream | null>(null);
    const shotsRef = useRef(0);
    const isFinishingRef = useRef(false);
    const isSendingRef = useRef(false);

    const [step, setStep] = useState<RegisterStep>("name");
    const [currentName, setCurrentName] = useState("");
    const [shots, setShots] = useState(0);
    const [maxShots, setMaxShots] = useState(5);
    const [progress, setProgress] = useState(0);
    const [statusText, setStatusText] = useState("");
    const [statusReason, setStatusReason] = useState("—");
    const [doneMessage, setDoneMessage] = useState("");
    const [error, setError] = useState("");
    const [instruction, setInstruction] = useState(INSTRUCTIONS[0]);
    const [isPaused, setIsPaused] = useState(false);

    // Gán stream sau khi CameraStep mount
    useEffect(() => {
        if (step === "camera" && pendingStreamRef.current && videoRef.current) {
            videoRef.current.srcObject = pendingStreamRef.current;
            streamRef.current = pendingStreamRef.current;
            pendingStreamRef.current = null;
        }
    }, [step]);

    // Cleanup khi unmount
    useEffect(() => {
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
            stopStream(streamRef.current);
            window.speechSynthesis?.cancel();
        };
    }, []);

    // Text-to-speech
    const speakInstruction = useCallback((text: string) => {
        if (!("speechSynthesis" in window)) return;
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = "vi-VN";
        utterance.rate = 0.95;
        const viVoice = window.speechSynthesis
            .getVoices()
            .find((v) => v.lang === "vi-VN");
        if (viVoice) utterance.voice = viVoice;
        window.speechSynthesis.speak(utterance);
    }, []);

    useEffect(() => {
        if (step === "camera") speakInstruction(instruction);
    }, [instruction, step, speakInstruction]);

    // ── Helpers ───────────────────────────────────────────────────────────────

    function stopInterval() {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    }

    function startInterval(sid: string) {
        intervalRef.current = setInterval(
            () => sendFrame(sid),
            FRAME_INTERVAL_MS,
        );
    }

    function stopCapture() {
        stopInterval();
        stopStream(streamRef.current);
        streamRef.current = null;
    }

    // ── Finish registration ───────────────────────────────────────────────────

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
            isFinishingRef.current = false;
            const msg = err instanceof Error ? err.message : "Unknown error";
            setError(`Registration failed: ${msg}`);
            setStep("name");
        }
    }

    // ── Send 1 frame ──────────────────────────────────────────────────────────

    async function sendFrame(sid: string) {
        if (isFinishingRef.current) return;
        if (isSendingRef.current) return;
        isSendingRef.current = true;

        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (!video || !canvas || video.readyState < 2) return;

        let data;
        try {
            const image = captureFrame(video, canvas);
            data = await registerApi.sendFrame(sid, image);
        } catch {
            isSendingRef.current = false;
            return;
        }

        setProgress(data.progress ?? 0);

        // Tấm mới được chụp → dừng interval, pause 5s, restart
        if (data.shots > shotsRef.current) {
            shotsRef.current = data.shots;
            setShots(data.shots);
            stopInterval();
            setIsPaused(true);
            setInstruction(
                data.shots < maxShots
                    ? INSTRUCTIONS[data.shots]
                    : INSTRUCTIONS[5],
            );

            setTimeout(() => {
                setIsPaused(false);
                if (sessionIdRef.current && !isFinishingRef.current) {
                    startInterval(sessionIdRef.current);
                }
            }, PAUSE_MS);
        }

        switch (data.status) {
            case "NO_FACE":
                setStatusText("No face detected");
                setStatusReason("Move closer to the camera");
                setProgress(0);
                break;
            case "INVALID":
                setStatusText("Adjust your position");
                setStatusReason(data.reasons?.join(", ") ?? "—");
                setProgress(0);
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
                isFinishingRef.current = true;
                stopInterval();
                finishRegistration(sid);
                break;
        }
        isSendingRef.current = false;
    }

    // ── Public actions ────────────────────────────────────────────────────────

    async function startRegistration(name: string) {
        setError("");
        isFinishingRef.current = false;

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

        let stream: MediaStream;
        try {
            stream = await openCamera();
        } catch {
            setError("Camera access denied. Please allow camera permission.");
            return;
        }

        sessionIdRef.current = sid;
        pendingStreamRef.current = stream;
        shotsRef.current = 0;

        setCurrentName(name);
        setMaxShots(max);
        setShots(0);
        setProgress(0);
        setStatusText("Look at the camera…");
        setStatusReason("—");
        setInstruction(INSTRUCTIONS[0]);
        setIsPaused(false);
        setStep("camera");

        startInterval(sid);
    }

    function cancelRegistration() {
        stopCapture();
        sessionIdRef.current = null;
        isFinishingRef.current = false;
        shotsRef.current = 0;
        setShots(0);
        setProgress(0);
        setStep("name");
    }

    function resetForm() {
        shotsRef.current = 0;
        isFinishingRef.current = false;
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
