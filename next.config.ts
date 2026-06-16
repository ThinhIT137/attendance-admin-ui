import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    /* config options here */
    output: "export", // Thêm dòng này vào
    images: {
        unoptimized: true, // Vì chế độ export không dùng được bộ tối ưu ảnh mặc định
    },
};

export default nextConfig;
