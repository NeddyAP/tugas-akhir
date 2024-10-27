import React, { Suspense } from "react";
import { Head } from "@inertiajs/react";
import Layout from "@/Layouts/Layout";

const LandingPage = React.lazy(() => import("./LandingPage"));
const Tutorial = React.lazy(() => import("./Tutorial"));
const Faq = React.lazy(() => import("./Faq"));

const LoadingFallback = () => <div>Loading...</div>;

const MemoizedLandingPage = React.memo(LandingPage);
const MemoizedTutorial = React.memo(Tutorial);
const MemoizedFaq = React.memo(Faq);

export default function Index() {
    return (
        <Layout>
            <Head title="Home" />
            <main>
                <Suspense fallback={<LoadingFallback />}>
                    <MemoizedLandingPage />
                    <MemoizedTutorial />
                    <MemoizedFaq />
                </Suspense>
            </main>
        </Layout>
    );
}
