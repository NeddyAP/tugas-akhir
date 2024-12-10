import React, { useState, useCallback, useMemo, useEffect } from "react";
import { Head, useForm, usePage, router } from "@inertiajs/react";
import FrontLayout from "@/Layouts/FrontLayout";
import DataTable from "@/Components/ui/DataTable";
import GenericModal from "@/Components/ui/GenericModal";
import { copyToClipboard, downloadFile } from "@/utils/exportService";
import TableHeader from "@/Components/ui/TableHeader";
import { getTableConfigs } from "@/utils/constants";
import { formatDate2 } from "@/utils/helpers";
import { Tab } from "@headlessui/react";

export default function LogbookPage({ logbooks, bimbingans, initialType }) {
    const user = usePage().props.auth.user.role;
    const form = useForm({
        tanggal: "",
        catatan: "",
        keterangan: "",
    });

    const [activeTab, setActiveTab] = useState("Logbook");
    const [activeType, setActiveType] = useState(initialType || "ALL");
    const [modalState, setModalState] = useState({
        isOpen: false,
        type: null,
        editingData: null,
    });

    const tableConfigs = useMemo(
        () => getTableConfigs(logbooks, bimbingans, formatDate2),
        [logbooks, bimbingans],
    );

    const currentTableConfig = useMemo(() => {
        const config = tableConfigs[activeTab];
        return {
            columns: [...config.columns],
            data: config.data,
            pagination: config.pagination,
        };
    }, [activeTab, tableConfigs, user]);

    const handleAdd = useCallback(() => {
        form.reset();
        form.setData({
            tanggal: "",
            catatan: "",
            keterangan: "",
        });
        setModalState({ isOpen: true, type: activeTab, editingData: null });
    }, [activeTab, form]);

    const handleEdit = useCallback(
        (row) => {
            setModalState({
                isOpen: true,
                type: activeTab,
                editingData: row,
            });
        },
        [activeTab],
    );

    const handleSubmit = useCallback(
        (e) => {
            e.preventDefault();
            const isEditing = modalState.editingData;
            const type = modalState.type.toLowerCase();
            const baseRoute = type === "logbook" ? "logbook" : "bimbingan";

            form[isEditing ? "put" : "post"](
                route(
                    `${baseRoute}.${isEditing ? "update" : "store"}`,
                    isEditing?.id,
                ),
                {
                    onSuccess: () => {
                        setModalState({
                            isOpen: false,
                            type: null,
                            editingData: null,
                        });
                    },
                },
            );
        },
        [modalState, form],
    );

    const handleDelete = useCallback(
        (row) => {
            if (!window.confirm("Yakin ingin menghapus data ini?")) return;

            const isLogbook = activeTab === "Logbook";
            const baseRoute = isLogbook ? "logbook" : "bimbingan";

            form.delete(route(`${baseRoute}.destroy`, row.id));
        },
        [activeTab, form],
    );

    const handleDownload = useCallback(
        async (format) => {
            const type = activeTab.toLowerCase();
            const currentConfig = tableConfigs[activeTab];
            const data = currentConfig.data;

            try {
                if (format === "copy") {
                    const headers = currentConfig.columns.map(
                        (col) => col.Header,
                    );
                    const tableData = data.map((row) =>
                        currentConfig.columns.reduce(
                            (acc, col) => ({
                                ...acc,
                                [col.Header]:
                                    col.accessor === "tanggal"
                                        ? formatDate2(row[col.accessor])
                                        : row[col.accessor],
                            }),
                            {},
                        ),
                    );

                    const result = await copyToClipboard(headers, tableData);
                    if (!result.success) throw result.error;
                    alert("Data berhasil disalin ke clipboard!");
                    return;
                }

                const exportRoute =
                    type === "logbook" ? "logbook.export" : "bimbingan.export";
                const url = route(exportRoute, {
                    format,
                    search: new URLSearchParams(window.location.search).get(
                        "search",
                    ),
                });

                const result = await downloadFile(url);
                if (!result.success) throw result.error;
            } catch (error) {
                alert("Gagal mengekspor data. Silakan coba lagi.");
            }
        },
        [activeTab, tableConfigs],
    );

    const tableActions = useMemo(
        () => ({
            handleAdd,
            handleEdit,
            handleDelete,
            handleDownload,
        }),
        [handleAdd, handleEdit, handleDelete, handleDownload],
    );

    // Effect to handle form data when modal state changes
    useEffect(() => {
        if (modalState.editingData) {
            form.setData({
                tanggal: modalState.editingData.tanggal || "",
                catatan: modalState.editingData.catatan || "",
                keterangan: modalState.editingData.keterangan || "",
            });
        } else {
            form.reset();
        }
    }, [modalState.editingData]);

    const handleTypeChange = useCallback((type) => {
        setActiveType(type);
        router.get(
            route(route().current()),
            { type: type === "ALL" ? "" : type },
            { preserveState: true },
        );
    }, []);

    const renderTypeFilter = () => {
        if (user !== "dosen") return null;

        const types = ["ALL", "KKL", "KKN"];

        return (
            <div className="flex justify-center mb-6">
                <Tab.Group>
                    <Tab.List className="flex p-1.5 space-x-1.5 bg-gray-100/80 dark:bg-gray-800/60 rounded-xl shadow-sm">
                        {types.map((type) => (
                            <Tab
                                key={type}
                                className={({ selected }) =>
                                    `px-4 py-2 rounded-lg transition-all duration-200 font-medium text-sm ${
                                        selected
                                            ? "bg-white dark:bg-gray-700 text-teal-600 dark:text-teal-400 shadow-sm"
                                            : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800/80"
                                    }`
                                }
                                onClick={() => handleTypeChange(type)}
                            >
                                {type}
                            </Tab>
                        ))}
                    </Tab.List>
                </Tab.Group>
            </div>
        );
    };

    const renderContent = () => {
        return (
            <div className="space-y-6">
                {renderTypeFilter()}

                <div className="p-6 bg-white shadow-sm dark:bg-gray-800/40 rounded-xl">
                    <TableHeader
                        title={`${activeTab} ${
                            user === "dosen"
                                ? "Mahasiswa Bimbingan"
                                : "Mahasiswa"
                        } ${activeType !== "ALL" ? activeType : ""}`}
                        onDownload={handleDownload}
                        onAdd={user !== "dosen" ? handleAdd : undefined}
                    />

                    <div className="mt-4">
                        <DataTable
                            columns={currentTableConfig.columns}
                            data={currentTableConfig.data}
                            pagination={currentTableConfig.pagination}
                            actions={{
                                ...tableActions,
                                ...(user === "dosen" && {
                                    handleAdd: undefined,
                                    handleEdit: undefined,
                                    handleDelete: undefined,
                                }),
                            }}
                        />
                    </div>

                    {user !== "dosen" && (
                        <GenericModal
                            isOpen={modalState.isOpen}
                            onClose={() =>
                                setModalState({
                                    isOpen: false,
                                    type: null,
                                    editingData: null,
                                })
                            }
                            title={`${modalState.editingData ? "Edit" : "Tambah"} ${
                                modalState.type
                            }`}
                            data={form.data}
                            setData={form.setData}
                            errors={form.errors}
                            processing={form.processing}
                            handleSubmit={handleSubmit}
                            clearErrors={form.clearErrors}
                            fields={
                                tableConfigs[modalState.type]?.modalFields || []
                            }
                        />
                    )}
                </div>
            </div>
        );
    };

    return (
        <FrontLayout>
            <Head title="Logbook" />
            <div className="max-w-6xl p-6 mx-auto my-20">
                <div className="space-y-8">
                    <Tab.Group>
                        <Tab.List className="flex justify-center">
                            <div className="flex items-center p-1.5 space-x-2 bg-gray-100/80 dark:bg-gray-800/60 rounded-xl shadow-sm">
                                {["Logbook", "Bimbingan"].map((tab) => (
                                    <Tab
                                        key={tab}
                                        className={({ selected }) =>
                                            `flex whitespace-nowrap items-center h-8 px-5 font-medium rounded-lg outline-none focus:ring-2 focus:ring-teal-600 focus:ring-inset ${
                                                selected
                                                    ? "text-teal-600 shadow bg-white dark:text-white dark:bg-teal-600"
                                                    : "hover:text-gray-800 focus:text-teal-600 dark:text-gray-400 dark:hover:text-gray-300 dark:focus:text-gray-400"
                                            }`
                                        }
                                        onClick={() => setActiveTab(tab)}
                                    >
                                        {tab}
                                    </Tab>
                                ))}
                            </div>
                        </Tab.List>
                    </Tab.Group>

                    {renderContent()}
                </div>
            </div>
        </FrontLayout>
    );
}
