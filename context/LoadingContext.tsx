"use client";

import Loading from "@/components/layout/LoadingComponent";
import { createContext, useContext, useState } from "react";

const LoadingContext = createContext<any>(null);

export const LoadingProvider = ({ children }: any) => {
    const [isLoading, setIsLoading] = useState(false);

    return (
        <LoadingContext.Provider value={{ isLoading, setIsLoading }}>
            {isLoading && <Loading />}
            {children}
        </LoadingContext.Provider>
    );
};

export const useLoading = () => {
    return useContext(LoadingContext);
};
