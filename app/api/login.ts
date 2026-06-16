import { LoginResponse } from "@/libs/login";
import { api } from "./api";

type Login = {
    email: string;
    password: string;
};

export const login = {
    login: async ({ email, password }: Login) => {
        const res = await api.post<LoginResponse>("", {
            email: email,
            password: password,
        });

        return res;
    },
};
