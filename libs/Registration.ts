export type RegisterStep = "name" | "camera" | "processing" | "done";

export type FrameStatus =
    | "NO_FACE"
    | "INVALID"
    | "STABILIZING"
    | "BURST_CAPTURE"
    | "COMPLETE";

export type StartSessionResponse = {
    session_id: string;
    name: string;
    max_shots: number;
};

export type FrameResponse = {
    status: FrameStatus;
    shots: number;
    max_shots: number;
    progress: number; // 0–1
    reasons?: string[];
};

export type FinishResponse = {
    success: boolean;
    name: string;
    embeddings_saved: number;
};
