import React, { Suspense } from "react";
import { Head } from "@inertiajs/react";
import Layout from "@/Layouts/Layout";

const LandingPage = React.lazy(() => import("./LandingPage"));
const Tutorial = React.lazy(() => import("./Tutorial"));
const Faq = React.lazy(() => import("./Faq"));

const LoadingFallback = () => <div>Loading...</div>;

export default function Index({ faqs }) {
    return (
        <Layout>
            <Head title="Home" />
            <main className="px-24">
                <Suspense fallback={<LoadingFallback />}>
                    <LandingPage />
                    <Tutorial />
                    <Faq faqs={faqs} />
                </Suspense>
            </main>
        </Layout>
    );
}
