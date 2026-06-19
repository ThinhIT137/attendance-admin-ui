import { recognizeApi } from "@/app/api/recognizeApi";
import { captureFrame, openCamera, stopStream } from "@/libs/Webcam";
import { time } from "console";
import { useEffect, useRef, useState } from "react";

const FRAME_INTERVAL_MS = 400;

export type RecognizeSessionState = {
    isRunning: boolean;
    statusText: string;
    statusType: "success" | "warning" | "error" | "";
    recognizedName: string | null;
    confidence: number;
    consecutive: number;
    required: number;
    lastLogged: string | null;
};

export type RecognizeSessionActions = {
    videoRef: React.RefObject<HTMLVideoElement | null>;
    canvasRef: React.RefObject<HTMLCanvasElement | null>;
    toggle: () => void;
};

export function useRecognizeSession(): RecognizeSessionState &
    RecognizeSessionActions {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const isSendingRef = useRef(false);

    const lastSpeakTimeRef = useRef<number>(0);

    const [isRunning, setIsRunning] = useState(false);
    const [statusText, setStatusText] = useState("Stopped");
    const [statusType, setStatusType] = useState<
        "success" | "warning" | "error" | ""
    >("");
    const [recognizedName, setRecognizedName] = useState<string | null>(null);
    const [confidence, setConfidence] = useState(0);
    const [consecutive, setConsecutive] = useState(0);
    const [required, setRequired] = useState(3);
    const [lastLogged, setLastLogged] = useState<string | null>(null);

    useEffect(() => {
        return () => {
            stopLoop();
            stopStream(streamRef.current);
        };
    }, []);

    // ===== HÀM ĐỌC GIỌNG NÓI =====
    function speak(text: string, force = false) {
        if (!("speechSynthesis" in window)) return; // Bỏ qua nếu thiết bị không hỗ trợ

        const now = Date.now();
        // Delay 3 giây giữa mỗi lần đọc để không bị spam lặp chữ (trừ khi ép buộc đọc ngay)
        if (!force && now - lastSpeakTimeRef.current < 3000) return;

        window.speechSynthesis.cancel(); // Ngắt câu cũ đang đọc dở (nếu có)
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = "vi-VN"; // Set giọng tiếng Việt
        utterance.rate = 1.0; // Tốc độ đọc bình thường

        window.speechSynthesis.speak(utterance);
        lastSpeakTimeRef.current = now;
    }

    function stopLoop() {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    }

    async function start() {
        try {
            const stream = await openCamera();
            streamRef.current = stream;
            if (videoRef.current) videoRef.current.srcObject = stream;
        } catch {
            setStatusText("Camera access denied");
            setStatusType("error");
            return;
        }

        setIsRunning(true);
        setStatusText("Scanning...");
        setStatusType("");
        intervalRef.current = setInterval(sendFrame, FRAME_INTERVAL_MS);
    }

    function stop() {
        stopLoop();
        stopStream(streamRef.current);
        streamRef.current = null;
        if (videoRef.current) videoRef.current.srcObject = null;
        setIsRunning(false);
        setStatusText("Stopped");
        setStatusType("");
        setRecognizedName(null);
        setConfidence(0);
        setConsecutive(0);
    }

    async function toggle() {
        if (isRunning) stop();
        else await start();
    }

    async function sendFrame() {
        if (isSendingRef.current) return;
        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (!video || !canvas || !video.videoWidth) return;

        isSendingRef.current = true;
        try {
            const image = captureFrame(video, canvas, 0.7);
            const data = await recognizeApi.sendFrame(image);

            setConsecutive(data.consecutive ?? 0);
            setRequired(data.required ?? 3);

            if (data) console.log(data);

            if (data.status === "no_face") {
                setRecognizedName(null);
                setConfidence(0);
                setStatusText("Looking for face...");
                setStatusType("");
                return;
            }

            if (data.status === "low_quality") {
                setRecognizedName(null);
                setConfidence(0);
                setStatusText(data.reasons?.[0] ?? "Low quality");
                setStatusType("warning");
                return;
            }

            setConfidence(data.confidence);

            if (data.status === "recognized" && data.name) {
                const display = data.name.replace(/_/g, " ");
                setRecognizedName(display);
                setStatusText(`Recognized: ${display}`);
                setStatusType("success");

                if (data.logged) {
                    setLastLogged(`✅ ${display} — just now`);

                    speak(`${display} điểm danh thành công`, true);
                }
            } else {
                setRecognizedName(null);
                setStatusText("Unknown face");
                setStatusType("warning");

                // setTimeout(() => {
                //     speak("điểm danh không thành công");
                // }, 2000);
            }
        } catch {
            // silent
        } finally {
            isSendingRef.current = false;
        }
    }

    return {
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
    };
}
