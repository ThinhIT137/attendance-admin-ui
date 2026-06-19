"use client";

import { useEffect, useRef, useState } from "react";

// Sửa lại interface theo format mới từ Backend
interface BBox {
    id: number;
    name: string;
    x: number;
    y: number;
    w: number;
    h: number;
    orig_w: number;
    orig_h: number;
}

export const CameraViewComponent = ({
    id,
    url,
    name,
    ws_port = "8000",
}: {
    id: string;
    url?: string;
    name?: string;
    ws_port?: string;
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const videoContainerRef = useRef<HTMLDivElement>(null);

    const [boxes, setBoxes] = useState<BBox[]>([]);

    // [GIỮ NGUYÊN useEffect KẾT NỐI WEBSOCKET NHƯ CŨ]
    useEffect(() => {
        console.log("id.................................: " + id);
        if (!id) return;

        const wsUrl = `ws://localhost:${ws_port}/ws/tracking/${id}`;
        const ws = new WebSocket(wsUrl);

        ws.onopen = () => {
            console.log(`✅ Đã kết nối WebSocket cho camera ${id}`);
        };

        ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);

                // 🔥 Log rình xem Web có bắt được tọa độ AI gửi không
                if (data.boxes && data.boxes.length > 0) {
                    console.log(`📦 Tọa độ từ AI gửi về ${id}:`, data.boxes);
                }

                setBoxes(data.boxes || []);
            } catch (e) {
                console.error("❌ Lỗi parse JSON từ Backend:", e);
            }
        };

        ws.onclose = () => {
            console.log(`❌ Mất kết nối WebSocket camera ${id}`);
        };

        // Hàm dọn dẹp khi Component bị hủy
        return () => {
            if (ws.readyState === 1) {
                // 1 = OPEN
                ws.close();
            }
        };
    }, [id, ws_port]);

    // SỬA LẠI LOGIC VẼ CANVAS Ở ĐÂY
    // SỬA LẠI LOGIC VẼ CANVAS Ở ĐÂY
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const { clientWidth, clientHeight } = canvas;
        if (canvas.width !== clientWidth || canvas.height !== clientHeight) {
            canvas.width = clientWidth;
            canvas.height = clientHeight;
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        boxes.forEach((box) => {
            // THUẬT TOÁN BÙ TRỪ VIỀN ĐEN TÀNG HÌNH (OBJECT-FIT: CONTAIN)
            const canvasRatio = canvas.width / canvas.height;
            const videoRatio = box.orig_w / box.orig_h;

            let renderWidth,
                renderHeight,
                offsetX = 0,
                offsetY = 0;

            if (canvasRatio > videoRatio) {
                // Vùng chứa rộng hơn video -> Video bị kẹp giữa, có viền đen ở 2 bên trái/phải
                renderHeight = canvas.height;
                renderWidth = renderHeight * videoRatio;
                offsetX = (canvas.width - renderWidth) / 2;
            } else {
                // Vùng chứa cao hơn video -> Video bị kẹp giữa, có viền đen ở trên/dưới
                renderWidth = canvas.width;
                renderHeight = renderWidth / videoRatio;
                offsetY = (canvas.height - renderHeight) / 2;
            }

            // Tỷ lệ scale MỚI dựa trên kích thước video THỰC TẾ đang hiển thị trên web
            const scaleX = renderWidth / box.orig_w;
            const scaleY = renderHeight / box.orig_h;

            // Tọa độ thực: Áp scale và phải CỘNG THÊM phần viền đen (offsetX, offsetY)
            const realX = box.x * scaleX + offsetX;
            const realY = box.y * scaleY + offsetY;
            const realW = box.w * scaleX;
            const realH = box.h * scaleY;

            // Vẽ Box
            ctx.strokeStyle = "#00FF00";
            ctx.lineWidth = 3;
            ctx.strokeRect(realX, realY, realW, realH);

            // Vẽ Label Background
            ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
            ctx.fillRect(realX, realY - 25, Math.max(120, realW), 25);

            // Vẽ Text
            ctx.fillStyle = "#FFFFFF";
            ctx.font = "14px sans-serif";
            ctx.fillText(box.name || `ID: ${box.id}`, realX + 5, realY - 8);
        });
    }, [boxes]);

    return (
        <div
            ref={videoContainerRef}
            className="relative w-full h-full bg-black overflow-hidden"
        >
            {/* LƯU Ý Ở IFRAME: Nên bỏ className object-cover đi vì iframe không hoạt động giống thẻ <video> */}
            <iframe
                src={`http://localhost:8889/${id}`}
                className="absolute inset-0 w-full h-full border-none"
                allow="autoplay"
                scrolling="no"
            ></iframe>

            <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full pointer-events-none"
            />
        </div>
    );
};
