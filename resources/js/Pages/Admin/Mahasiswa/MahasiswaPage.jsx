import { useCallback, useMemo, useState } from "react";
import { Head, useForm } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import DataTable from "@/Components/Admin/DataTable";
import MahasiswaModal from "./MahasiswaModal";
import AdminSidebar from "@/Components/Admin/AdminSidebar";
import AdminNavbar from "@/Components/Admin/AdminNavbar";

export default function MahasiswaPage({ mahasiswas }) {
    const { delete: destroyMahasiswa } = useForm();
    const [modalState, setModalState] = useState({ isOpen: false, editingData: null });

    const confirmDelete = useCallback((message) => {
        return window.confirm(message);
    }, []);

    const handleDelete = useCallback((row) => {
        if (confirmDelete("Kamu yakin ingin menghapus data mahasiswa?")) {
            destroyMahasiswa(route("mahasiswas.destroy", row.id), {
                preserveState: true,
                preserveScroll: true,
            });
        }
    }, [destroyMahasiswa, confirmDelete]);

    const tableActions = useMemo(() => ({
        handleEdit: (row) => setModalState({ isOpen: true, editingData: row }),
        handleDelete,
        handleAdd: () => setModalState({ isOpen: true, editingData: null }),
        handleDownload: () => {
            console.log("Downloading mahasiswa data...");
        },
    }), [handleDelete]);

    const columns = useMemo(() => [
        {
            Header: "Nama",
            accessor: "name",
            sortable: true,
        },
        {
            Header: "NIM",
            accessor: "nim",
            sortable: true,
        },
        {
            Header: "Email",
            accessor: "email",
            sortable: true,
        }
    ], []);

    const processedData = useMemo(() =>
        mahasiswas.map(mahasiswa => ({
            ...mahasiswa,
        }))
        , [mahasiswas]);

    return (
        <AdminLayout title="Mahasiswa" currentPage="Mahasiswa > Table">
            <div className="grid grid-cols-1 mb-8">
                <div className="flex flex-col gap-8">
                    <header className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-gray-900">
                            Data Mahasiswa
                        </h2>
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={tableActions.handleDownload}
                                className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            >
                                Download
                            </button>
                            <button
                                type="button"
                                onClick={tableActions.handleAdd}
                                className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            >
                                Tambah Baru
                            </button>
                        </div>
                    </header>

                    <DataTable
                        columns={columns}
                        data={processedData}
                        actions={tableActions}
                        defaultSortBy="name"
                    />

                    <MahasiswaModal
                        isOpen={modalState.isOpen}
                        onClose={() => setModalState({ isOpen: false, editingData: null })}
                        editingData={modalState.editingData}
                    />
                </div>
            </div>
        </AdminLayout>
    );
}