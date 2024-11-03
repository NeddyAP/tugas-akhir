import { useCallback, useMemo, useState, useEffect } from "react";
import { useForm, usePage } from "@inertiajs/react";
import { toast } from 'react-toastify';
import AdminLayout from "@/Layouts/AdminLayout";
import DataTable from "@/Components/Admin/DataTable";
import GenericModal from "@/Components/Admin/GenericModal";

export default function UserPage({ users }) {
    const { delete: destroyUser } = useForm();
    const { user } = usePage().props;
    const currentUserRole = user.role;
    const [modalState, setModalState] = useState({ isOpen: false, editingData: null });

    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        name: "",
        email: "",
        password: "",
        role: "",
        phone: "",
        address: "",
    });

    useEffect(() => {
        if (modalState.isOpen) {
            if (modalState.editingData) {
                setData({
                    name: modalState.editingData.name,
                    email: modalState.editingData.email,
                    role: modalState.editingData.role || "",
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

    const confirmDelete = useCallback((message) => window.confirm(message), []);

    const handleAdd = () => {
        if (currentUserRole !== 'superadmin') {
            toast.error("Role kurang tinggi untuk melakukan action");
            return;
        }
        setModalState({ isOpen: true, editingData: null });
    };

    const handleEdit = (row) => {
        if (currentUserRole !== 'superadmin') {
            toast.error("Role kurang tinggi untuk melakukan action");
            return;
        }
        setModalState({ isOpen: true, editingData: row });
    };

    const handleDelete = useCallback((row) => {
        if (currentUserRole !== 'superadmin') {
            toast.error("Role kurang tinggi untuk melakukan action");
            return;
        }
        if (confirmDelete("Kamu yakin ingin menghapus data user?")) {
            destroyUser(route("admin.users.destroy", row.id), {
                preserveState: true,
                preserveScroll: true,
                onError: () => {
                    toast.error("Gagal menghapus user");
                },
            });
        }
    }, [destroyUser, confirmDelete, currentUserRole]);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (currentUserRole !== 'superadmin') {
            toast.error("Role kurang tinggi untuk melakukan action");
            return;
        }

        if (modalState.editingData) {
            put(route('admin.users.update', modalState.editingData.id), {
                preserveState: true,
                onSuccess: () => {
                    setModalState({ isOpen: false, editingData: null });
                },
                onError: () => {
                    toast.error("Gagal memperbarui user");
                },
            });
        } else {
            post(route('admin.users.store'), {
                preserveState: true,
                onSuccess: () => {
                    setModalState({ isOpen: false, editingData: null });
                },
                onError: () => {
                    toast.error("Gagal menambahkan user");
                },
            });
        }
    };

    const tableActions = useMemo(() => ({
        handleEdit,
        handleDelete,
        handleAdd,
        handleDownload: () => {
            toast.info("Mengunduh data user...");
            // TODO: Implementasi download
        },
    }), [handleEdit, handleDelete, handleAdd]);

    const columns = useMemo(() => [
        { Header: "Nama", accessor: "name", sortable: true },
        { Header: "Email", accessor: "email", sortable: true },
        { Header: "Role", accessor: "role", sortable: true },
    ], []);

    const processedData = useMemo(() => users.data, [users]);

    const modalFields = [
        { name: "name", label: "Nama", type: "text" },
        { name: "email", label: "Email", type: "email" },
        {
            name: "role",
            label: "Role",
            type: "select",
            options: [
                { value: "admin", label: "Admin" },
                { value: "superadmin", label: "Superadmin" },
            ],
            disabled: currentUserRole === 'admin',
        },
        { name: "phone", label: "Telepon", type: "tel" },
        { name: "address", label: "Alamat", type: "textarea", rows: 3 },
        { name: "password", label: "Password", type: "password" },
    ];

    return (
        <AdminLayout title="User" currentPage="User > Table">
            <div className="grid grid-cols-1 mb-8">
                <div className="flex flex-col gap-8">
                    <header className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-gray-900">Data User</h2>
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
                            pageIndex: users.current_page - 1,
                            pageCount: users.last_page,
                            pageSize: users.per_page,
                            total: users.total,
                            from: users.from,
                            to: users.to
                        }}
                    />

                    <GenericModal
                        isOpen={modalState.isOpen}
                        onClose={() => setModalState({ isOpen: false, editingData: null })}
                        title={modalState.editingData ? "Edit Data User" : "Tambah Data User Baru"}
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