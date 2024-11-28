import { Suspense, useState, useCallback } from "react";
import { router } from "@inertiajs/react";
import FrontLayout from "@/Layouts/FrontLayout";
import { Head } from "@inertiajs/react";
import LaporanCard from "./LaporanCard";
import GenericModal from "@/Components/ui/GenericModal";
import { useForm } from "@inertiajs/react";
import PropTypes from "prop-types";

const LoadingFallback = () => (
    <div className="animate-pulse">
        <div className="h-48 mb-4 bg-gray-200 rounded-lg dark:bg-gray-700"></div>
    </div>
);

const TABS = ["KKL", "KKN"];

export default function LaporanPage({
    kklData = null,
    kknData = null,
    type = "kkl",
}) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { data, setData, post, processing, errors, reset, clearErrors } =
        useForm({
            type: type,
            keterangan: "",
            file: null,
        });

    const handleTabClick = (tab) => {
        const newType = tab.toLowerCase();
        setData("type", newType);
        router.get(
            route(route().current(), { type: newType }),
            {},
            { preserveState: true }
        );
    };

    const handleSubmit = useCallback(
        (e) => {
            e.preventDefault();
            const formData = new FormData();
            formData.append("type", data.type);
            formData.append("keterangan", data.keterangan);

            if (data.file instanceof File) {
                formData.append("file", data.file);
            }

            post(route("laporan.store"), formData, {
                preserveScroll: true,
                forceFormData: true,
                onSuccess: () => {
                    setIsModalOpen(false);
                    reset();
                },
                onError: (errors) => {
                    console.error("Submission errors:", errors);
                },
            });
        },
        [data, post, reset]
    );

    const handleModal = () => {
        setIsModalOpen(true);
        setData("type", type);
    };

    const currentData =
        type === "kkl"
            ? kklData?.data?.[0] ?? null
            : kknData?.data?.[0] ?? null;

    return (
        <FrontLayout>
            <Head title={`Laporan ${type.toUpperCase()}`} />
            <div className="max-w-6xl p-6 mx-auto my-20">
                <div className="flex items-center justify-center mb-6">
                    <nav className="flex items-center p-1 space-x-1 overflow-x-auto text-sm text-gray-600 bg-gray-200 rtl:space-x-reverse rounded-xl dark:bg-gray-500/20">
                        {TABS.map((tab) => (
                            <button
                                key={tab}
                                type="button"
                                className={`flex whitespace-nowrap items-center h-8 px-5 font-medium rounded-lg outline-none focus:ring-2 focus:ring-teal-600 focus:ring-inset ${
                                    type === tab.toLowerCase()
                                        ? "text-teal-600 shadow bg-white dark:text-white dark:bg-teal-600"
                                        : "hover:text-gray-800 focus:text-teal-600 dark:text-gray-400 dark:hover:text-gray-300 dark:focus:text-gray-400"
                                }`}
                                onClick={() => handleTabClick(tab)}
                            >
                                {tab}
                            </button>
                        ))}
                    </nav>
                </div>

                <LaporanCard
                    data={currentData}
                    type={type}
                    processing={processing}
                    onUpload={handleModal}
                    isModalOpen={isModalOpen}
                    onCloseModal={() => {
                        setIsModalOpen(false);
                        reset();
                        clearErrors();
                    }}
                />

                <GenericModal
                    isOpen={isModalOpen}
                    onClose={() => {
                        setIsModalOpen(false);
                        reset();
                        clearErrors();
                    }}
                    title={`Tambah Laporan ${type.toUpperCase()}`}
                    fields={[
                        {
                            name: "keterangan",
                            label: "Keterangan",
                            type: "textarea",
                            rows: 3,
                        },
                        {
                            name: "file",
                            label: "File Laporan",
                            type: "file",
                            accept: ".pdf,.doc,.docx",
                        },
                    ]}
                    data={data}
                    setData={setData}
                    errors={errors}
                    processing={processing}
                    handleSubmit={handleSubmit}
                />
            </div>
        </FrontLayout>
    );
}

LaporanPage.propTypes = {
    kklData: PropTypes.shape({
        data: PropTypes.array,
    }),
    kknData: PropTypes.shape({
        data: PropTypes.array,
    }),
    type: PropTypes.oneOf(["kkl", "kkn"]),
};
