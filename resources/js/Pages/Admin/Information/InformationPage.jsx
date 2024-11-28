import { Suspense } from "react";
import { router } from "@inertiajs/react";

import AdminLayout from "@/Layouts/AdminLayout";
import TabButton from "@/Components/ui/TabButton";
import Question from "./Question";
import Tutorial from "./Tutorial";
import Panduan from "./Panduan";

const LoadingFallback = () => <div>Loading...</div>;

const TABS = [
    { type: "tutorial", label: "Tutorial" },
    { type: "question", label: "FAQ" },
    { type: "panduan", label: "Panduan" },
];

const emptyPaginatedData = {
    data: [],
    current_page: 1,
    last_page: 1,
    per_page: 10,
    total: 0,
    from: null,
    to: null,
};

export default function InformationPage({
    questions,
    tutorials,
    panduans,
    type = "question",
}) {
    const handleTabClick = (newType) => {
        router.get(
            route(route().current(), { type: newType }),
            {},
            { preserveState: true, preserveScroll: true }
        );
    };

    const renderContent = () => {
        const contents = {
            question: (
                <Question informations={questions || emptyPaginatedData} />
            ),
            tutorial: (
                <Tutorial informations={tutorials || emptyPaginatedData} />
            ),
            panduan: <Panduan informations={panduans || emptyPaginatedData} />,
        };
        return contents[type];
    };

    return (
        <AdminLayout title="Information Management" currentPage="Information">
            <div className="flex gap-4 mb-4 border-b border-gray-200">
                {TABS.map(({ type: tabType, label }) => (
                    <TabButton
                        key={tabType}
                        active={type === tabType}
                        onClick={() => handleTabClick(tabType)}
                        variant="solid"
                    >
                        {label}
                    </TabButton>
                ))}
            </div>
            <Suspense fallback={<LoadingFallback />}>
                {renderContent()}
            </Suspense>
        </AdminLayout>
    );
}
