export type RecognizeStatus =
    | "no_face"
    | "low_quality"
    | "recognized"
    | "unknown";

export type RecognizeFrameResponse = {
    status: RecognizeStatus;
    name: string | null;
    confidence: number;
    logged: boolean;
    consecutive: number;
    required: number;
    reasons?: string[];
};
