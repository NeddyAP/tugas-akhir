import React, { useState, useCallback, memo } from "react";
import DataTable from "@/Components/ui/DataTable";
import AdminLayout from "@/Layouts/AdminLayout";
import { useForm } from "@inertiajs/react";
import GenericModal from "@/Components/ui/GenericModal";

const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};

const Header = memo(({ onAdd }) => (
    <header className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-200">
            Logbook Mahasiswa
        </h2>
        <div className="flex gap-2">
            <button
                type="button"
                onClick={onAdd}
                className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-teal-600 border border-transparent rounded-md shadow-sm hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
            >
                Tambah Baru
            </button>
        </div>
    </header>
));

const LogbookPage = ({ logbooks }) => {
    const [modalState, setModalState] = useState({
        isOpen: false,
        editingData: null,
    });
    const form = useForm({
        tanggal: "",
        catatan: "",
        keterangan: "",
    });

    const handleSubmit = useCallback(
        (e) => {
            e.preventDefault();
            const isEditing = modalState.editingData;

            form[isEditing ? "put" : "post"](
                route(
                    `admin.logbooks.${isEditing ? "update" : "store"}`,
                    isEditing?.id
                ),
                {
                    onSuccess: () => {
                        setModalState({ isOpen: false, editingData: null });
                    },
                }
            );
        },
        [modalState.editingData, form]
    );

    const handleDelete = useCallback(
        (row) => {
            if (window.confirm("Yakin ingin menghapus logbook ini?")) {
                form.delete(route("admin.logbooks.destroy", row.id));
            }
        },
        [form]
    );

    const columns = [
        { Header: "Nama Mahasiswa", accessor: "user.name", sortable: true },
        { Header: "Tanggal", accessor: "tanggal", sortable: true },
        { Header: "Catatan", accessor: "catatan", sortable: true },
        { Header: "Keterangan", accessor: "keterangan", sortable: true },
        {
            Header: "Created at",
            accessor: "created_at",
            Cell: ({ value }) => formatDate(value),
        },
        {
            Header: "Updated at",
            accessor: "updated_at",
            Cell: ({ value }) => formatDate(value),
        },
    ];

    const modalFields = [
        { name: "tanggal", label: "Tanggal", type: "date", required: true },
        { name: "catatan", label: "Catatan", type: "textarea", required: true },
        {
            name: "keterangan",
            label: "Keterangan",
            type: "text",
            required: true,
        },
    ];

    React.useEffect(() => {
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
        <AdminLayout title="Logbook Management" currentPage="Logbook">
            <div className="grid grid-cols-1 mb-8">
                <div className="flex flex-col gap-8">
                    <Header
                        onAdd={() =>
                            setModalState({ isOpen: true, editingData: null })
                        }
                    />

                    <div className="pb-4 overflow-x-auto">
                        <div className="inline-block min-w-full align-middle">
                            <div className="overflow-hidden">
                                <DataTable
                                    columns={columns}
                                    data={logbooks.data}
                                    actions={{
                                        handleEdit: (row) =>
                                            setModalState({
                                                isOpen: true,
                                                editingData: row,
                                            }),
                                        handleDelete,
                                    }}
                                    pagination={{
                                        pageIndex: logbooks.current_page - 1,
                                        pageCount: logbooks.last_page,
                                        pageSize: logbooks.per_page,
                                        total: logbooks.total,
                                        from: logbooks.from,
                                        to: logbooks.to,
                                    }}
                                    className="w-full"
                                />
                            </div>
                        </div>
                    </div>

                    <GenericModal
                        isOpen={modalState.isOpen}
                        onClose={() =>
                            setModalState({ isOpen: false, editingData: null })
                        }
                        title={`${
                            modalState.editingData ? "Edit" : "Tambah"
                        } Data Logbook`}
                        data={form.data}
                        setData={form.setData}
                        errors={form.errors}
                        processing={form.processing}
                        handleSubmit={handleSubmit}
                        clearErrors={form.clearErrors}
                        fields={modalFields}
                        className="w-full max-w-lg p-4 mx-auto sm:p-6"
                    />
                </div>
            </div>
        </AdminLayout>
    );
};

export default memo(LogbookPage);
