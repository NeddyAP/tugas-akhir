import React, { Suspense } from "react";
import { Head } from "@inertiajs/react";
import FrontLayout from "@/Layouts/FrontLayout";

const LandingPage = React.lazy(() => import("./LandingPage"));
const Tutorial = React.lazy(() => import("./Tutorial"));
const Faq = React.lazy(() => import("./Faq"));

const LoadingFallback = () => (
    <div className="fixed inset-0 flex items-center justify-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
        <div className="w-16 h-16 border-4 border-teal-600 rounded-full border-t-transparent animate-spin dark:border-teal-400" />
    </div>
);

export default function HomePage({ faqs, tutorial }) {
    return (
        <FrontLayout>
            <Head title="Home" />
            <div className="flex flex-col">
                <Suspense fallback={<LoadingFallback />}>
                    <LandingPage />
                    <Tutorial tutorial={tutorial} />
                    <Faq faqs={faqs} />
                </Suspense>
            </div>
        </FrontLayout>
    );
}
