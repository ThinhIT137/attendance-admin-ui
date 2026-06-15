import { KeyboardEvent, useState } from "react";

type Props = {
    error: string;
    onStart: (name: string) => void;
};

const NameStepComponent = ({ error, onStart }: Props) => {
    const [name, setName] = useState("");

    const handleSubmit = () => {
        const strimmed = name.trim();
        if (!strimmed) return;
        if ("speechSynthesis" in window) {
            const unlockAudio = new SpeechSynthesisUtterance("");
            window.speechSynthesis.speak(unlockAudio);
        }
        onStart(strimmed);
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") handleSubmit();
    };

    return (
        <div className="w-full max-w-md bg-white p-8 border border-slate-100 rounded-2xl">
            <h1 className="mb-2 text-center text-2xl font-semibold text-slate-900">
                Đăng ký khuôn mặt
            </h1>

            <p className="mb-8 text-center text-sm text-slate-500">
                Nhập tên nhân viên và bắt đầu quét khuôn mặt.
            </p>

            <div className="space-y-1.5">
                <label
                    htmlFor="person-name"
                    className="block text-xs font-medium text-slate-500 uppercase tracking-wider"
                >
                    Tên định danh
                </label>

                <input
                    id="person-name"
                    type="text"
                    placeholder="Ví dụ: Trần Đức Thịnh"
                    autoComplete="off"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-2.5 text-slate-900 placeholder:text-slate-300 outline-none transition-all focus:border-slate-500 focus:bg-white"
                />
            </div>

            {error && (
                <div className="mt-4 px-4 py-2 text-xs text-red-600 bg-red-50 rounded-lg">
                    {error}
                </div>
            )}

            <button
                onClick={handleSubmit}
                className="mt-8 w-full rounded-lg bg-slate-900 px-4 py-2.5 font-medium text-white transition-all hover:bg-slate-800 active:scale-[0.98]"
            >
                Mở camera
            </button>
        </div>
    );
};
export default NameStepComponent;
