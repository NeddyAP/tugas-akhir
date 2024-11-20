import { useCallback, useMemo, useState, useEffect, memo } from "react";
import { useForm, usePage } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import DataTable from "@/Components/DataTable";
import GenericModal from "@/Components/GenericModal";

const TABS = {
    MAHASISWA: 'mahasiswa',
    DOSEN: 'dosen',
    ADMIN: 'admin',
};

// Memoized Tab Button Component
const TabButton = memo(({ tab, activeTab, onClick }) => (
    <button
        onClick={() => onClick(tab)}
        className={`${activeTab === tab
            ? 'border-teal-500 text-teal-600'
            : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700  dark:text-white'
            } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm capitalize`}
    >
        {tab}
    </button>
));

TabButton.displayName = 'TabButton';

// Memoized Header Component
const Header = memo(({ activeTab, onDownload, onAdd }) => (
    <header className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-200">Data {activeTab}</h2>
        <div className="flex gap-2">
            <button
                type="button"
                onClick={onDownload}
                className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
            >
                Download
            </button>
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

Header.displayName = 'Header';

const UserPage = ({ users, dosens, mahasiswas }) => {
    const { user: currentUser, url, flash } = usePage().props;
    const currentUserRole = currentUser.role;

    // URL and tab management
    const urlParams = new URLSearchParams(window.location.search);
    const [activeTab, setActiveTab] = useState(
        urlParams.get('tab') && Object.values(TABS).includes(urlParams.get('tab'))
            ? urlParams.get('tab')
            : TABS.ADMIN
    );

    // Form management
    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        name: "", email: "", password: "", role: "",
        nim: "", nip: "", phone: "", address: "",
    });

    // Modal state management
    const [modalState, setModalState] = useState({ isOpen: false, editingData: null });

    // Create form instance for delete operation
    const deleteForm = useForm();

    // Tab change handler
    const handleTabChange = useCallback((tab) => {
        setActiveTab(tab);
        const newUrl = new URL(window.location);
        newUrl.searchParams.set('tab', tab);
        window.history.pushState({}, '', newUrl);
    }, []);

    // Action handlers
    const handleAdd = useCallback(() => {
        if (currentUserRole !== 'superadmin') {
            return; // Let the server handle the error message
        }
        setModalState({ isOpen: true, editingData: null });
    }, [currentUserRole]);

    const handleEdit = useCallback((row) => {
        if (currentUserRole !== 'superadmin') {
            return; // Let the server handle the error message
        }
        setModalState({ isOpen: true, editingData: row });
    }, [currentUserRole]);

    const handleDelete = useCallback((row) => {
        if (currentUserRole !== 'superadmin') {
            return; // Let the server handle the error message
        }

        if (window.confirm(`Kamu yakin ingin menghapus data ${activeTab}?`)) {
            deleteForm.delete(route("admin.users.destroy", row.id) + `?tab=${activeTab}`, {
                preserveState: true,
                preserveScroll: true
            });
        }
    }, [currentUserRole, activeTab, deleteForm]);

    const handleSubmit = useCallback((e) => {
        e.preventDefault();
        if (currentUserRole !== 'superadmin') {
            return; // Let the server handle the error message
        }

        const isEditing = modalState.editingData;
        const url = route(
            isEditing ? 'admin.users.update' : 'admin.users.store',
            isEditing ? modalState.editingData.id : undefined
        );

        const action = isEditing ? put : post;
        action(url + `?tab=${activeTab}`, {
            preserveState: true,
            onSuccess: () => {
                setModalState({ isOpen: false, editingData: null });
            }
        });
    }, [currentUserRole, modalState, activeTab, post, put]);

    // Memoized values
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

    const currentData = useMemo(() => ({
        [TABS.ADMIN]: users,
        [TABS.DOSEN]: dosens,
        [TABS.MAHASISWA]: mahasiswas,
    })[activeTab], [users, dosens, mahasiswas, activeTab]);

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

    // Effects
    useEffect(() => {
        if (modalState.isOpen) {
            if (modalState.editingData) {
                setData({ ...modalState.editingData, password: "" });
            } else {
                reset();
            }
        } else {
            reset();
            clearErrors();
        }
    }, [modalState.isOpen, modalState.editingData]);

    return (
        <AdminLayout title="Users Management" currentPage="Users">
            <div className="grid grid-cols-1 mb-8">
                <div className="flex flex-col gap-8">
                    <div className="border-b border-gray-200">
                        <nav className="flex -mb-px">
                            {Object.values(TABS).map((tab) => (
                                <TabButton
                                    key={tab}
                                    tab={tab}
                                    activeTab={activeTab}
                                    onClick={handleTabChange}
                                />
                            ))}
                        </nav>
                    </div>

                    <Header
                        activeTab={activeTab}
                        onDownload={() => { }}
                        onAdd={handleAdd}
                    />

                    <DataTable
                        columns={columns}
                        data={currentData.data}
                        actions={{ handleEdit, handleDelete, handleAdd }}
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
};

export default memo(UserPage);