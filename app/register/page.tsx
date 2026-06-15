"use client";

import CameraStep from "@/components/register/CameraStepComponent";
import NameStepComponent from "@/components/register/NameStepComponent";
import {
    DoneStep,
    ProcessingStep,
} from "@/components/register/StatusStepsComponent";
import { useRegisterSession } from "@/hooks/useRegisterSession";

const RegisterPage = () => {
    const {
        step,
        currentName,
        shots,
        maxShots,
        progress,
        statusText,
        statusReason,
        doneMessage,
        error,
        videoRef,
        canvasRef,
        startRegistration,
        cancelRegistration,
        resetForm,
    } = useRegisterSession();

    return (
        <div className="min-h-screen flex items-center justify-center p-8 bg-[#0f0f14] font-sans">
            {step === "name" && (
                <NameStepComponent error={error} onStart={startRegistration} />
            )}
            {step === "camera" && (
                <CameraStep
                    videoRef={videoRef}
                    canvasRef={canvasRef}
                    name={currentName}
                    shots={shots}
                    maxShots={maxShots}
                    progress={progress}
                    statusText={statusText}
                    statusReason={statusReason}
                    onCancel={cancelRegistration}
                />
            )}
            {step === "processing" && <ProcessingStep />}
            {step === "done" && (
                <DoneStep message={doneMessage} onRegisterAnother={resetForm} />
            )}
        </div>
    );
};

export default RegisterPage;
