import React, { useState, useCallback, useMemo, useEffect } from "react";
import { Head, useForm } from "@inertiajs/react";
import FrontLayout from "@/Layouts/FrontLayout";
import DataTable from "@/Components/ui/DataTable";
import GenericModal from "@/Components/ui/GenericModal";
import { copyToClipboard, downloadFile } from "@/utils/exportService";
import TableHeader from "@/Components/ui/TableHeader";
import { getTableConfigs } from "@/utils/constants";
import { formatDate } from "@/utils/utils";

export default function LogbookPage({ logbooks, bimbingans }) {
    const form = useForm({
        tanggal: "",
        catatan: "",
        keterangan: "",
    });

    const tableConfigs = useMemo(
        () => getTableConfigs(logbooks, bimbingans, formatDate),
        [logbooks?.data, bimbingans?.data],
    );
    const [activeTab, setActiveTab] = useState("Logbook");
    const [modalState, setModalState] = useState({
        isOpen: false,
        type: null,
        editingData: null,
    });

    const currentTableConfig = useMemo(
        () => ({
            columns: tableConfigs[activeTab].columns,
            data: tableConfigs[activeTab].data,
            pagination: {
                pageIndex: tableConfigs[activeTab].pagination.current_page - 1,
                pageCount: tableConfigs[activeTab].pagination.last_page,
                pageSize: tableConfigs[activeTab].pagination.per_page,
                total: tableConfigs[activeTab].pagination.total,
                from: tableConfigs[activeTab].pagination.from,
                to: tableConfigs[activeTab].pagination.to,
            },
        }),
        [activeTab, tableConfigs],
    );

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
                                        ? formatDate(row[col.accessor])
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

    return (
        <FrontLayout>
            <Head title="Logbook" />
            <div>
                <div className="max-w-6xl p-6 mx-auto my-20">
                    <div className="grid grid-cols-1 mb-8">
                        <div className="flex flex-col gap-8">
                            <div className="flex justify-center">
                                <nav className="flex items-center p-1 space-x-1 overflow-x-auto text-sm text-gray-600 bg-gray-200 rtl:space-x-reverse rounded-xl dark:bg-gray-500/20">
                                    {["Logbook", "Bimbingan"].map((tab) => (
                                        <button
                                            key={tab}
                                            role="tab"
                                            type="button"
                                            className={`flex whitespace-nowrap items-center h-8 px-5 font-medium rounded-lg outline-none focus:ring-2 focus:ring-teal-600 focus:ring-inset ${
                                                activeTab === tab
                                                    ? "text-teal-600 shadow bg-white dark:text-white dark:bg-teal-600"
                                                    : "hover:text-gray-800 focus:text-teal-600 dark:text-gray-400 dark:hover:text-gray-300 dark:focus:text-gray-400"
                                            }`}
                                            onClick={() => setActiveTab(tab)}
                                        >
                                            {tab}
                                        </button>
                                    ))}
                                </nav>
                            </div>

                            <TableHeader
                                title={`${activeTab} Mahasiswa`}
                                onDownload={(format) => handleDownload(format)}
                                onAdd={() => handleAdd(activeTab)}
                            />

                            <DataTable
                                columns={currentTableConfig.columns}
                                data={currentTableConfig.data}
                                pagination={currentTableConfig.pagination}
                                actions={tableActions}
                            />

                            <GenericModal
                                isOpen={modalState.isOpen}
                                onClose={() =>
                                    setModalState({
                                        isOpen: false,
                                        type: null,
                                        editingData: null,
                                    })
                                }
                                title={`${
                                    modalState.editingData ? "Edit" : "Tambah"
                                } ${modalState.type}`}
                                data={form.data}
                                setData={form.setData}
                                errors={form.errors}
                                processing={form.processing}
                                handleSubmit={handleSubmit}
                                clearErrors={form.clearErrors}
                                fields={
                                    tableConfigs[modalState.type]
                                        ?.modalFields || []
                                }
                            />
                        </div>
                    </div>
                </div>
            </div>
        </FrontLayout>
    );
}
