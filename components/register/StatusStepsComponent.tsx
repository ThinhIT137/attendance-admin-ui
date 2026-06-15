"use client";

// ── ProcessingStep ────────────────────────────────────────────────────────────
export const ProcessingStep = () => {
    return (
        <div className="flex flex-col items-center gap-4 bg-white/[0.04] border border-white/[0.08] rounded-2xl p-10 backdrop-blur-xl max-w-sm w-full text-center">
            <div className="w-11 h-11 rounded-full border-[3px] border-white/10 border-t-sky-400 animate-spin" />
            <h2 className="text-xl font-bold text-white/90">
                Generating Embeddings…
            </h2>
            <p className="text-sm text-white/45 leading-relaxed">
                ArcFace is processing the captured faces. This takes a moment.
            </p>
        </div>
    );
};

// ── DoneStep ─────────────────────────────────────────────────────────────────
type DoneProps = {
    message: string;
    onRegisterAnother: () => void;
};

export const DoneStep = ({ message, onRegisterAnother }: DoneProps) => {
    return (
        <div className="flex flex-col items-center gap-4 bg-white/[0.04] border border-white/[0.08] rounded-2xl p-10 backdrop-blur-xl max-w-sm w-full text-center">
            <span className="text-5xl">✅</span>
            <h2 className="text-xl font-bold text-white/90">
                Registration Complete!
            </h2>
            <p className="text-sm text-white/45 leading-relaxed">{message}</p>

            <div className="flex flex-col gap-3 w-full mt-2">
                <button
                    onClick={onRegisterAnother}
                    className="w-full py-2.5 rounded-xl bg-blue-500 hover:opacity-85 active:scale-[0.97] text-white font-semibold text-sm transition-all"
                >
                    Register Another
                </button>
                <a
                    href="/"
                    className="w-full py-2.5 rounded-xl bg-white/[0.07] hover:opacity-80 text-white/75 border border-white/[0.12] font-semibold text-sm text-center transition-all"
                >
                    Back to Dashboard
                </a>
            </div>
        </div>
    );
};
