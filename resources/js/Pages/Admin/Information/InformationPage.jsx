import React, { Suspense } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import TabButton from "@/Components/ui/TabButton";
import Question from "./Question";
import Tutorial from "./Tutorial";
import Panduan from "./Panduan";
import { router } from '@inertiajs/react';

const LoadingFallback = () => <div>Loading...</div>;

export default function InformationPage({ questions, tutorials, panduans, type = 'question' }) {
    const handleTabClick = (newType) => {
        router.get(route(route().current(), { type: newType }), {}, {
            preserveState: true,
            preserveScroll: true
        });
    };

    return (
        <AdminLayout title="Information Management" currentPage="Information">
            <div className="flex gap-4 mb-4 border-b border-gray-200">
                <TabButton 
                    active={type === 'tutorial'} 
                    onClick={() => handleTabClick('tutorial')}
                    variant="solid"
                >
                    Tutorial
                </TabButton>
                <TabButton 
                    active={type === 'question'} 
                    onClick={() => handleTabClick('question')}
                    variant="solid"
                >
                    FAQ
                </TabButton>
                <TabButton 
                    active={type === 'panduan'} 
                    onClick={() => handleTabClick('panduan')}
                    variant="solid"
                >
                    Panduan
                </TabButton>
            </div>
            <Suspense fallback={<LoadingFallback />}>
                {type === 'question' ? <Question informations={questions} /> :
                    type === 'tutorial' ? <Tutorial informations={tutorials} /> :
                        <Panduan informations={panduans} />}
            </Suspense>
        </AdminLayout>
    );
}
