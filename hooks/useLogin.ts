import { LoginResponse } from "@/libs/login";
import { cookies } from "next/headers";

export const saveAccessToken = (res: LoginResponse) => {
    localStorage.setItem("accesstoken", res.accesstoken);
    localStorage.setItem("name", res.user.name);
    localStorage.setItem("avt", res.user.avt);
};

export async function saveTokenToCookie(token: string) {
    const cookieStore = await cookies();

    cookieStore.set({
        name: "accesstoken",
        value: token,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // Chỉ chạy HTTPS trên production
        sameSite: "lax", // Chống tấn công CSRF
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // Token sống 7 ngày
    });
}
