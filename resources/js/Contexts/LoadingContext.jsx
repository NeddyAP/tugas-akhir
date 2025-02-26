import React, { createContext, useContext, useState } from "react";
import { router } from "@inertiajs/react";
import Loading from "@/Components/ui/Loading";

const LoadingContext = createContext();

const useLoading = () => useContext(LoadingContext);

export const LoadingProvider = ({ children }) => {
    const [isLoading, setIsLoading] = useState(false);

    // Automatic loading for Inertia page transitions
    router.on("start", () => setIsLoading(true));
    router.on("finish", () => setIsLoading(false));

    // Manual loading control methods
    const showLoading = () => setIsLoading(true);
    const hideLoading = () => setIsLoading(false);

    return (
        <LoadingContext.Provider
            value={{ isLoading, showLoading, hideLoading }}
        >
            {isLoading && (
                <div className="fixed inset-0 z-50 flex items-center justify-center lg:justify-end lg:mt-20 lg:mr-5 lg:items-start">
                    <Loading size="w-12 h-12" />
                </div>
            )}
            {children}
        </LoadingContext.Provider>
    );
};

export { useLoading };
