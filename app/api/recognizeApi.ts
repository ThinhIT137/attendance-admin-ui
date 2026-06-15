import { RecognizeFrameResponse } from "@/libs/Recognition";
import { api } from "./api";

export const recognizeApi = {
    sendFrame: (image: string) => {
        api.post<RecognizeFrameResponse>("/api/recognize/frame", {
            image,
        }).then((r) => r.data);
    },
};
