import { useCallback, useMemo, useState, useEffect } from "react";
import { useForm } from "@inertiajs/react";
import { toast } from 'react-toastify';
import AdminLayout from "@/Layouts/AdminLayout";
import DataTable from "@/Components/Admin/DataTable";
import GenericModal from "@/Components/Admin/GenericModal";

const useMahasiswaActions = (destroyMahasiswa, confirmDelete, setModalState) => {
    const handleDelete = useCallback((row) => {
        if (confirmDelete("Kamu yakin ingin menghapus data mahasiswa?")) {
            destroyMahasiswa(route("admin.mahasiswas.destroy", row.id), {
                preserveState: true,
                preserveScroll: true,
                onError: () => {
                    toast.error("Gagal menghapus mahasiswa");
                }
            });
        }
    }, [destroyMahasiswa, confirmDelete]);

    return useMemo(() => ({
        handleEdit: (row) => setModalState({ isOpen: true, editingData: row }),
        handleDelete,
        handleAdd: () => setModalState({ isOpen: true, editingData: null }),
        handleDownload: () => {
            toast.info("Mengunduh data mahasiswa...");
            // TODO: Implementasi download
        },
    }), [handleDelete, setModalState]);
};

export default function MahasiswaPage({ mahasiswas }) {
    const { delete: destroyMahasiswa } = useForm();
    const [modalState, setModalState] = useState({ isOpen: false, editingData: null });

    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        name: "",
        email: "",
        password: "",
        nim: "",
        phone: "",
        address: "",
    });

    useEffect(() => {
        if (modalState.isOpen) {
            if (modalState.editingData) {
                setData({
                    name: modalState.editingData.name,
                    email: modalState.editingData.email,
                    nim: modalState.editingData.nim || "",
                    phone: modalState.editingData.phone || "",
                    address: modalState.editingData.address || "",
                    password: "",
                });
            } else {
                reset();
            }
        } else {
            reset();
            clearErrors();
        }
    }, [modalState.isOpen, modalState.editingData]);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (modalState.editingData) {
            put(route('admin.mahasiswas.update', modalState.editingData.id), {
                preserveState: true,
                onSuccess: () => {
                    setModalState({ isOpen: false, editingData: null });
                },
                onError: () => {
                    toast.error("Gagal memperbarui mahasiswa");
                },
            });
        } else {
            post(route('admin.mahasiswas.store'), {
                preserveState: true,
                onSuccess: () => {
                    setModalState({ isOpen: false, editingData: null });
                },
                onError: () => {
                    toast.error("Gagal menambahkan mahasiswa");
                },
            });
        }
    };

    const confirmDelete = useCallback((message) => window.confirm(message), []);
    const tableActions = useMahasiswaActions(destroyMahasiswa, confirmDelete, setModalState);

    const columns = useMemo(() => [
        { Header: "Nama", accessor: "name", sortable: true },
        { Header: "NIM", accessor: "nim", sortable: true },
        { Header: "Email", accessor: "email", sortable: true }
    ], []);

    const processedData = useMemo(() => mahasiswas.data, [mahasiswas]);

    const modalFields = [
        { name: "name", label: "Nama", type: "text" },
        { name: "email", label: "Email", type: "email" },
        { name: "nim", label: "NIM", type: "text" },
        { name: "phone", label: "Telepon", type: "tel" },
        { name: "address", label: "Alamat", type: "textarea", rows: 3 },
        { name: "password", label: "Password", type: "password" },
    ];

    return (
        <AdminLayout title="Mahasiswa" currentPage="Mahasiswa > Table">
            <div className="grid grid-cols-1 mb-8">
                <div className="flex flex-col gap-8">
                    <header className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-gray-900">Data Mahasiswa</h2>
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
                        pagination={{
                            pageIndex: mahasiswas.current_page - 1,
                            pageCount: mahasiswas.last_page,
                            pageSize: mahasiswas.per_page,
                            total: mahasiswas.total,
                            from: mahasiswas.from,
                            to: mahasiswas.to
                        }}
                    />

                    <GenericModal
                        isOpen={modalState.isOpen}
                        onClose={() => setModalState({ isOpen: false, editingData: null })}
                        title={modalState.editingData ? "Edit Data Mahasiswa" : "Tambah Data Mahasiswa Baru"}
                        data={data}
                        setData={setData}
                        errors={errors}
                        processing={processing}
                        handleSubmit={handleSubmit}
                        clearErrors={clearErrors}
                        fields={modalFields}
                    />
                </div>
            </div>
        </AdminLayout>
    );
}