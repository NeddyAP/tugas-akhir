import React, { Suspense } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import Question from "./Question";
import Tutorial from "./Tutorial";
import Panduan from "./Panduan";
import { router } from '@inertiajs/react';

const LoadingFallback = () => <div>Loading...</div>;

const TabButton = ({ active, type, children }) => (
    <button
        className={`px-4 py-2 font-medium rounded-t-lg ${active ? "text-teal-600 bg-white border-t border-x border-gray-200"
            : "text-gray-500 hover:text-gray-700 dark:text-white"
            }`}
        onClick={() => router.get(route(route().current(), { type }), {}, {
            preserveState: true,
            preserveScroll: true
        })}
    >
        {children}
    </button>
);

export default function InformationPage({ questions, tutorials, panduans, type = 'question' }) {
    return (
        <AdminLayout title="Information Management" currentPage="Information">
            <div className="flex gap-4 mb-4 border-b border-gray-200">
                <TabButton active={type === 'tutorial'} type="tutorial">Tutorial</TabButton>
                <TabButton active={type === 'question'} type="question">FAQ</TabButton>
                <TabButton active={type === 'panduan'} type="panduan">Panduan</TabButton>
            </div>
            <Suspense fallback={<LoadingFallback />}>
                {type === 'question' ? <Question informations={questions} /> :
                    type === 'tutorial' ? <Tutorial informations={tutorials} /> :
                        <Panduan informations={panduans} />}
            </Suspense>
        </AdminLayout>
    );
}
