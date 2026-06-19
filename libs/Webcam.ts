/**
 * Dữ liệu đường dẫn WebRTC camera
 */
export type CameraData = {
    id: string;
    name: string;
    url: string;
    ws_port: number; // Next.js nhận được port chuẩn xác từ Server trả về!
};

/**
 * Chụp 1 frame từ <video> element, trả về base64 JPEG string.
 * Canvas được reuse để tránh GC pressure khi gọi liên tục.
 */
export const captureFrame = (
    video: HTMLVideoElement,
    canvas: HTMLCanvasElement,
    quality = 0.85,
) => {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Cannot get canvas 2D context");
    ctx.drawImage(video, 0, 0);
    return canvas.toDataURL("image/jpeg", quality);
};

/**
 * Mở webcam, trả về MediaStream.
 * Throws nếu user từ chối permission.
 */
// export const openCamera = async (
//     constraints: MediaStreamConstraints = {
//         video: { width: 640, height: 480, facingMode: "user" },
//     },
// ): Promise<MediaStream> => {
//     return navigator.mediaDevices.getUserMedia(constraints);
// };

export const openCamera = async (
    constraints: MediaStreamConstraints = {
        video: { width: 640, height: 480, facingMode: "user" },
    },
): Promise<MediaStream> => {
    return navigator.mediaDevices.getUserMedia(constraints);
};

/** Dừng tất cả tracks của 1 stream */
export const stopStream = (stream: MediaStream | null) => {
    stream?.getTracks().forEach((t) => t.stop());
};
