import {
    FinishResponse,
    FrameResponse,
    StartSessionResponse,
} from "@/libs/Registration";
import { api } from "./api";

export const registerApi = {
    start: async (name: string) => {
        const res = await api.post<StartSessionResponse>(
            "/api/register/start",
            {
                name,
            },
        );

        return res.data;
    },

    sendFrame: async (sessionId: string, image: string) => {
        const res = await api.post<FrameResponse>("/api/register/frame", {
            session_id: sessionId,
            image,
        });
        return res.data;
    },

    finish: async (sessionId: string) => {
        const res = await api.post<FinishResponse>("/api/register/finish", {
            session_id: sessionId,
        });
        return res.data;
    },
};
