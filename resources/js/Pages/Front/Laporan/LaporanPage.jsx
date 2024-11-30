import { Suspense, useState, useCallback } from "react";
import { router, useForm } from "@inertiajs/react";
import FrontLayout from "@/Layouts/FrontLayout";
import { Head } from "@inertiajs/react";
import LaporanCard from "./LaporanCard";
import DataTable from "@/Components/ui/DataTable";
import GenericModal from "@/Components/ui/GenericModal";
import PropTypes from "prop-types";
import LaporanTable from "@/Components/Tables/LaporanTable";

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
    auth,
}) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingData, setEditingData] = useState(null);

    const { data, setData, post, put, processing, errors, reset, clearErrors } =
        useForm({
            type: type,
            keterangan: "",
            file: null,
            status: "",
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
        type === "kkl" ? kklData?.data ?? [] : kknData?.data ?? [];

    const isDosenRole = auth?.user?.role === "dosen";

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

                {isDosenRole ? (
                    <LaporanTable
                        data={currentData}
                        type={type}
                        pagination={{
                            pageIndex:
                                type === "kkl"
                                    ? (kklData?.meta?.current_page || 1) - 1
                                    : (kknData?.meta?.current_page || 1) - 1,
                            pageCount:
                                type === "kkl"
                                    ? kklData?.meta?.last_page || 1
                                    : kknData?.meta?.last_page || 1,
                            pageSize:
                                type === "kkl"
                                    ? kklData?.meta?.per_page || 10
                                    : kknData?.meta?.per_page || 10,
                            total:
                                type === "kkl"
                                    ? kklData?.meta?.total || 1
                                    : kknData?.meta?.total || 0,
                            from:
                                type === "kkl"
                                    ? kklData?.meta?.from || 1
                                    : kknData?.meta?.from || 0,
                            to:
                                type === "kkl"
                                    ? kklData?.meta?.to || 1
                                    : kknData?.meta?.to || 0,
                        }}
                    />
                ) : (
                    <LaporanCard
                        data={currentData?.[0] ?? null}
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
                )}

                {/* Change this condition to show upload modal for mahasiswa */}
                {!isDosenRole && (
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
                )}

                {/* Keep the dosen status update modal */}
                {isDosenRole && (
                    <GenericModal
                        isOpen={isModalOpen}
                        onClose={() => {
                            setIsModalOpen(false);
                            reset();
                            clearErrors();
                        }}
                        title={`Update ${type.toUpperCase()} Status`}
                        fields={[
                            {
                                name: "status",
                                label: "Status",
                                type: "select",
                                options: [
                                    { value: "pending", label: "Pending" },
                                    { value: "approved", label: "Approved" },
                                    { value: "rejected", label: "Rejected" },
                                ],
                            },
                            {
                                name: "keterangan",
                                label: "Keterangan",
                                type: "textarea",
                                rows: 3,
                            },
                        ]}
                        data={data}
                        setData={setData}
                        errors={errors}
                        processing={processing}
                        handleSubmit={(e) => {
                            e.preventDefault();
                            put(
                                route(`laporan.${type}.update`, {
                                    id: editingData.id,
                                }),
                                {
                                    onSuccess: () => {
                                        setIsModalOpen(false);
                                        reset();
                                    },
                                }
                            );
                        }}
                    />
                )}
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
    auth: PropTypes.shape({
        user: PropTypes.shape({
            role: PropTypes.string,
        }),
    }),
};
