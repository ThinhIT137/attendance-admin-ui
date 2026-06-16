"use client";

import Loading from "@/components/layout/LoadingComponent";
import { useState } from "react";
import { login } from "../api/login";

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showFail, setShowFail] = useState(false);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = () => {
        try {
            setLoading(true);
            if (!email || !password) {
                setShowFail(true);
                return;
            }

            const res = login.login({ email, password });
            
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white w-screen h-screen">
            <form onSubmit={handleSubmit}>
                {showFail && (
                    <div>
                        <span>Đăng nhập thất bại</span>
                    </div>
                )}

                <div>
                    <label htmlFor="">Email</label>
                    <input type="text" />
                </div>
                <div>
                    <label htmlFor="">Password</label>
                    <input type={showPassword ? "text" : "Password"} />
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            setShowPassword(!showPassword);
                        }}
                    >
                        show password
                    </button>
                </div>

                <button type="submit">Login</button>
            </form>
            {loading && <Loading />}
        </div>
    );
};

export default Login;
