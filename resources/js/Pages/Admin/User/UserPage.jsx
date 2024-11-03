import { useCallback, useMemo, useState } from "react";
import { useForm, usePage } from "@inertiajs/react";
import { toast } from 'react-toastify';
import AdminLayout from "@/Layouts/AdminLayout";
import DataTable from "@/Components/Admin/DataTable";
import UserModal from "./UserModal";

export default function UserPage({ users }) {
    const { delete: destroyUser } = useForm();
    const { user } = usePage().props;
    const currentUserRole = user.role;
    const [modalState, setModalState] = useState({ isOpen: false, editingData: null });

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
            destroyUser(route("users.destroy", row.id), {
                preserveState: true,
                preserveScroll: true,
                onError: () => {
                    toast.error("Gagal menghapus user");
                },
            });
        }
    }, [destroyUser, confirmDelete, currentUserRole]);

    const tableActions = useMemo(() => ({
        handleEdit,
        handleDelete,
        handleAdd,
        handleDownload: () => {
            toast.info("Mengunduh data user...");
            // Implement download functionality
        },
    }), [handleEdit, handleDelete, handleAdd]);

    const columns = useMemo(() => [
        { Header: "Nama", accessor: "name", sortable: true },
        { Header: "Email", accessor: "email", sortable: true },
        { Header: "Role", accessor: "role", sortable: true },
    ], []);

    const processedData = useMemo(() => users.data, [users]);

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

                    <UserModal
                        isOpen={modalState.isOpen}
                        onClose={() => setModalState({ isOpen: false, editingData: null })}
                        editingData={modalState.editingData}
                        className="transition duration-300 ease-in-out transform"
                    />
                </div>
            </div>
        </AdminLayout>
    );
}