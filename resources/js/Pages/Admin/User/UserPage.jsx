import { useCallback, useMemo, useState, useEffect } from "react";
import { useForm, usePage } from "@inertiajs/react";
import { toast } from 'react-toastify';
import AdminLayout from "@/Layouts/AdminLayout";
import DataTable from "@/Components/Admin/DataTable";
import GenericModal from "@/Components/Admin/GenericModal";

const TABS = {
    MAHASISWA: 'mahasiswa',
    DOSEN: 'dosen',
    ADMIN: 'admin',
};

export default function UserPage({ users, dosens, mahasiswas }) {
    const { delete: destroyData } = useForm();
    const { user, url, flash } = usePage().props;
    const currentUserRole = user.role;

    // Get tab from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const tabParam = urlParams.get('tab');

    // Set initial active tab based on URL parameter or default to ADMIN
    const [activeTab, setActiveTab] = useState(
        tabParam && Object.values(TABS).includes(tabParam)
            ? tabParam
            : TABS.ADMIN
    );

    // Update URL when tab changes
    const handleTabChange = (tab) => {
        setActiveTab(tab);
        const newUrl = new URL(window.location);
        newUrl.searchParams.set('tab', tab);
        window.history.pushState({}, '', newUrl);
    };

    const [modalState, setModalState] = useState({ isOpen: false, editingData: null });

    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        name: "",
        email: "",
        password: "",
        role: "",
        nim: "",
        nip: "",
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
                    nim: modalState.editingData.nim || "",
                    nip: modalState.editingData.nip || "",
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

    useEffect(() => {
        if (flash.message) {
            toast[flash.type](flash.message);
        }
    }, [flash]);

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
            return;
        }

        if (confirmDelete(`Kamu yakin ingin menghapus data ${activeTab}?`)) {
            destroyData(route("admin.users.destroy", row.id) + `?tab=${activeTab}`, {
                preserveState: true,
                preserveScroll: true
            });
        }
    }, [destroyData, confirmDelete, currentUserRole, activeTab]);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (currentUserRole !== 'superadmin') {
            return;
        }

        const routeName = modalState.editingData ? 'admin.users.update' : 'admin.users.store';
        const routeParams = modalState.editingData ? modalState.editingData.id : undefined;
        const action = modalState.editingData ? put : post;
        const url = modalState.editingData
            ? route(routeName, routeParams) + `?tab=${activeTab}`
            : route(routeName) + `?tab=${activeTab}`;

        action(url, {
            preserveState: true,
            onSuccess: () => {
                setModalState({ isOpen: false, editingData: null });
            }
        });
    };

    const tableActions = useMemo(() => ({
        handleEdit,
        handleDelete,
        handleAdd,
        handleDownload: () => {
            toast.info(`Mengunduh data ${activeTab}...`);
            // TODO: Implementasi download
        },
    }), [handleEdit, handleDelete, handleAdd, activeTab]);

    const columns = useMemo(() => {
        const commonColumns = [
            { Header: "Nama", accessor: "name", sortable: true },
            { Header: "Email", accessor: "email", sortable: true },
        ];

        const specificColumns = {
            [TABS.ADMIN]: [{ Header: "Role", accessor: "role", sortable: true }],
            [TABS.DOSEN]: [{ Header: "NIP", accessor: "nip", sortable: true }],
            [TABS.MAHASISWA]: [{ Header: "NIM", accessor: "nim", sortable: true }],
        };

        return [...commonColumns, ...specificColumns[activeTab]];
    }, [activeTab]);

    const currentData = useMemo(() => {
        const dataMap = {
            [TABS.ADMIN]: users,
            [TABS.DOSEN]: dosens,
            [TABS.MAHASISWA]: mahasiswas,
        };
        return dataMap[activeTab];
    }, [users, dosens, mahasiswas, activeTab]);

    const modalFields = useMemo(() => {
        const commonFields = [
            { name: "name", label: "Nama", type: "text" },
            { name: "email", label: "Email", type: "email" },
            { name: "phone", label: "Telepon", type: "tel" },
            { name: "address", label: "Alamat", type: "textarea", rows: 3 },
            { name: "password", label: "Password", type: "password" },
        ];

        const specificFields = {
            [TABS.ADMIN]: [{
                name: "role",
                label: "Role",
                type: "select",
                options: [
                    { value: "admin", label: "Admin" },
                    { value: "superadmin", label: "Superadmin" },
                ],
                disabled: currentUserRole === 'admin',
            }],
            [TABS.DOSEN]: [{ name: "nip", label: "NIP", type: "text" }],
            [TABS.MAHASISWA]: [{ name: "nim", label: "NIM", type: "text" }],
        };

        return [...commonFields, ...specificFields[activeTab]];
    }, [activeTab, currentUserRole]);

    return (
        <AdminLayout title="Users Management" currentPage="Users">
            <div className="grid grid-cols-1 mb-8">
                <div className="flex flex-col gap-8">
                    <div className="border-b border-gray-200">
                        <nav className="flex -mb-px">
                            {Object.values(TABS).map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => handleTabChange(tab)}
                                    className={`${activeTab === tab
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                                        } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm capitalize`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </nav>
                    </div>

                    <header className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-gray-900">Data {activeTab}</h2>
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
                        data={currentData.data}
                        actions={tableActions}
                        defaultSortBy="name"
                        pagination={{
                            pageIndex: currentData.current_page - 1,
                            pageCount: currentData.last_page,
                            pageSize: currentData.per_page,
                            total: currentData.total,
                            from: currentData.from,
                            to: currentData.to
                        }}
                    />

                    <GenericModal
                        isOpen={modalState.isOpen}
                        onClose={() => setModalState({ isOpen: false, editingData: null })}
                        title={`${modalState.editingData ? 'Edit' : 'Tambah'} Data ${activeTab}`}
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