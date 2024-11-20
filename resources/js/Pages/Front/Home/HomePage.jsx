import React, { Suspense } from "react";
import { Head } from "@inertiajs/react";
import FrontLayout from "@/Layouts/FrontLayout";

const LandingPage = React.lazy(() => import("./LandingPage"));
const Tutorial = React.lazy(() => import("./Tutorial"));
const Faq = React.lazy(() => import("./Faq"));

const LoadingFallback = () => <div>Loading...</div>;

export default function HomePage({ faqs, tutorial }) {
    return (
        <FrontLayout>
            <Head title="Home" />
            <main className="px-24">
                <Suspense fallback={<LoadingFallback />}>
                    <LandingPage />
                    <Tutorial tutorial={tutorial} />
                    <Faq faqs={faqs} />
                </Suspense>
            </main>
        </FrontLayout>
    );
}
