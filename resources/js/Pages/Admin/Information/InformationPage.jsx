import React, { Suspense } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import Question from "./Question";

const LoadingFallback = () => <div>Loading...</div>;

export default function InformationPage({ informations }) {
    return (
        <AdminLayout title="Information Management" currentPage="Information">
            <Suspense fallback={<LoadingFallback />}>
                {/* TODO: Tutorial Link, Buku Pedoman */}
                <Question informations={informations} />
            </Suspense>
        </AdminLayout>
    );
}
