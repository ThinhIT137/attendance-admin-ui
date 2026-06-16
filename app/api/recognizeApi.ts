import { RecognizeFrameResponse } from "@/libs/Recognition";
import { api } from "./api";

export const recognizeApi = {
    sendFrame: async (image: string) => {
        const res = await api.post<RecognizeFrameResponse>(
            "/api/recognize/frame",
            {
                image,
            },
        );
        return res.data;
    },
};
