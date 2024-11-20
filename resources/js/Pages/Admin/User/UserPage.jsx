import { useCallback, useMemo, useState, useEffect, memo, Fragment } from "react";
import { useForm, usePage } from "@inertiajs/react";
import { Menu, Transition } from "@headlessui/react";
import AdminLayout from "@/Layouts/AdminLayout";
import DataTable from "@/Components/ui/DataTable";
import GenericModal from "@/Components/ui/GenericModal";
import { ChevronDownIcon } from "lucide-react";
import { copyToClipboard, downloadFile } from '@/utils/exportService';

const TABS = {
    MAHASISWA: 'mahasiswa',
    DOSEN: 'dosen',
    ADMIN: 'admin',
    ALL: 'semua',
};

const DOWNLOAD_OPTIONS = [
    { label: 'Excel (.xlsx)', format: 'excel' },
    { label: 'PDF (.pdf)', format: 'pdf' },
    { label: 'Word (.docx)', format: 'word' },
    { label: 'Salin ke Clipboard', format: 'copy' },
];

const COMMON_COLUMNS = [
    { Header: "Nama", accessor: "name", sortable: true },
    { Header: "Email", accessor: "email", sortable: true },
];

const SPECIFIC_COLUMNS = {
    [TABS.ADMIN]: [{ Header: "Role", accessor: "role", sortable: true }],
    [TABS.DOSEN]: [{ Header: "NIP", accessor: "nip", sortable: true }],
    [TABS.MAHASISWA]: [{ Header: "NIM", accessor: "nim", sortable: true }],
    [TABS.ALL]: [
        { Header: "Role", accessor: "role", sortable: true },
        { Header: "NIM/NIP", accessor: "identifier", sortable: true },
    ],
};

const COMMON_FIELDS = [
    { name: "name", label: "Nama", type: "text" },
    { name: "email", label: "Email", type: "email" },
    { name: "phone", label: "Telepon", type: "tel" },
    { name: "address", label: "Alamat", type: "textarea", rows: 3 },
    { name: "password", label: "Password", type: "password" },
];

const SPECIFIC_FIELDS = {
    [TABS.ADMIN]: [{
        name: "role",
        label: "Role",
        type: "select",
        options: [
            { value: "admin", label: "Admin" },
            { value: "superadmin", label: "Superadmin" },
        ],
    }],
    [TABS.DOSEN]: [{ name: "nip", label: "NIP", type: "text" }],
    [TABS.MAHASISWA]: [{ name: "nim", label: "NIM", type: "text" }],
};



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


const Header = memo(({ activeTab, onDownload, onAdd }) => (
    <header className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-200">Data {activeTab}</h2>
        <div className="flex gap-2">
            <Menu as="div" className="relative inline-block text-left">
                <Menu.Button className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2">
                    Download
                    <ChevronDownIcon className="w-5 h-5 ml-2 -mr-1" aria-hidden="true" />
                </Menu.Button>
                <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                >
                    <Menu.Items className="absolute right-0 z-10 w-40 mt-2 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <div className="py-1">
                            {DOWNLOAD_OPTIONS.map((item) => (
                                <Menu.Item key={item.format}>
                                    {({ active }) => (
                                        <button
                                            onClick={() => onDownload(item.format)}
                                            className={`${active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                                                } block px-4 py-2 text-sm w-full text-left`}
                                        >
                                            {item.label}
                                        </button>
                                    )}
                                </Menu.Item>
                            ))}
                        </div>
                    </Menu.Items>
                </Transition>
            </Menu>
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

const UserPage = ({ users, dosens, mahasiswas, allUsers }) => {
    const { user: currentUser } = usePage().props;
    const currentUserRole = currentUser.role;


    const urlParams = new URLSearchParams(window.location.search);
    const [activeTab, setActiveTab] = useState(
        urlParams.get('tab') && Object.values(TABS).includes(urlParams.get('tab'))
            ? urlParams.get('tab')
            : TABS.ADMIN
    );


    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        name: "", email: "", password: "", role: "",
        nim: "", nip: "", phone: "", address: "",
    });

    const [modalState, setModalState] = useState({ isOpen: false, editingData: null });
    const deleteForm = useForm();


    const columns = useMemo(() => [
        ...COMMON_COLUMNS,
        ...SPECIFIC_COLUMNS[activeTab]
    ], [activeTab]);

    const currentData = useMemo(() => ({
        [TABS.ADMIN]: users,
        [TABS.DOSEN]: dosens,
        [TABS.MAHASISWA]: mahasiswas,
        [TABS.ALL]: allUsers,
    })[activeTab], [users, dosens, mahasiswas, allUsers, activeTab]);

    const modalFields = useMemo(() => [
        ...COMMON_FIELDS,
        ...(SPECIFIC_FIELDS[activeTab] || []).map(field =>
            activeTab === TABS.ADMIN
                ? { ...field, disabled: currentUserRole === 'admin' }
                : field
        )
    ], [activeTab, currentUserRole]);


    const handleTabChange = useCallback((tab) => {
        setActiveTab(tab);
        const newUrl = new URL(window.location);
        newUrl.searchParams.set('tab', tab);
        window.history.pushState({}, '', newUrl);
    }, []);

    const handleAdd = useCallback(() => {
        if (currentUserRole !== 'superadmin') return;
        setModalState({ isOpen: true, editingData: null });
    }, [currentUserRole]);

    const handleEdit = useCallback((row) => {
        if (currentUserRole !== 'superadmin') return;
        setModalState({ isOpen: true, editingData: row });
    }, [currentUserRole]);

    const handleDelete = useCallback((row) => {
        if (currentUserRole !== 'superadmin' ||
            !window.confirm(`Kamu yakin ingin menghapus data ${activeTab}?`)) return;

        deleteForm.delete(route("admin.users.destroy", row.id) + `?tab=${activeTab}`, {
            preserveState: true,
            preserveScroll: true
        });
    }, [currentUserRole, activeTab, deleteForm]);

    const handleSubmit = useCallback((e) => {
        e.preventDefault();
        if (currentUserRole !== 'superadmin') return;

        const isEditing = modalState.editingData;
        const url = route(
            isEditing ? 'admin.users.update' : 'admin.users.store',
            isEditing ? modalState.editingData.id : undefined
        );

        const action = isEditing ? put : post;
        action(url + `?tab=${activeTab}`, {
            preserveState: true,
            onSuccess: () => setModalState({ isOpen: false, editingData: null })
        });
    }, [currentUserRole, modalState, activeTab, post, put]);

    const handleDownload = useCallback(async (format) => {
        try {
            if (format === 'copy') {

                const response = await fetch(route('admin.users.export', {
                    format: 'all',
                    tab: activeTab,
                    search: new URLSearchParams(window.location.search).get('search'),
                }));

                if (!response.ok) throw new Error('Failed to fetch data');
                const { data } = await response.json();

                const headers = columns.map(col => col.Header);
                const tableData = data.map(row =>
                    columns.reduce((acc, col) => ({
                        ...acc,
                        [col.Header]: row[col.accessor]
                    }), {})
                );

                const result = await copyToClipboard(headers, tableData);
                if (!result.success) throw result.error;
                alert('Data berhasil disalin ke clipboard!');
                return;
            }

            const url = route('admin.users.export', {
                format,
                tab: activeTab,
                search: new URLSearchParams(window.location.search).get('search'),
            });

            const result = await downloadFile(url);
            if (!result.success) throw result.error;
        } catch (error) {
            console.error('Export failed:', error);
            alert('Gagal mengekspor data. Silakan coba lagi.');
        }
    }, [columns, activeTab]);


    useEffect(() => {
        if (!modalState.isOpen) {
            reset();
            clearErrors();
            return;
        }

        if (modalState.editingData) {
            setData({ ...modalState.editingData, password: "" });
        } else {
            reset();
        }
    }, [modalState.isOpen, modalState.editingData, setData, reset, clearErrors]);


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
                        onDownload={handleDownload}
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