import { GetUsersResponse, UserAttendanceResponse } from "@/libs/Admin";
import { api, api_camera } from "./api";
import { CameraData } from "@/libs/Webcam";

export const admin = {
    user: () => {},

    // attendance_user: async (
    //     date: string,
    //     page: number = 1,
    //     limit: number = 10,
    // ) => {
    //     const res = await api.get<UserAttendanceResponse>(
    //         "/api/attendance/by_date",
    //         {
    //             params: {
    //                 date: date,
    //                 page: page,
    //                 limit: limit,
    //             },
    //         },
    //     );
    //     return res.data;
    // },
    attendance_user: async (
        date: string,
        name: string = "", // Thêm tham số name (mặc định rỗng)
        page: number = 1,
        limit: number = 10,
    ) => {
        const res = await api.get<UserAttendanceResponse>(
            "/api/attendance/search", // Đổi từ by_date thành search
            {
                params: {
                    date: date,
                    name: name, // Bắn thêm tên lên server
                    page: page,
                    limit: limit,
                },
            },
        );
        return res.data;
    },
    get_users: async (
        name: string = "",
        page: number = 1,
        limit: number = 10,
    ) => {
        const res = await api.get<GetUsersResponse>("/api/users", {
            params: { name, page, limit },
        });
        return res.data;
    },

    webRTC_camera: async (): Promise<CameraData[]> => {
        const res = await api_camera.get("/api/cameras");
        return res.data;
    },
};
