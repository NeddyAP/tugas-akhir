import { useCallback, useMemo, useState, useEffect, memo } from 'react';
import { useForm, usePage } from '@inertiajs/react';

import AdminLayout from '@/Layouts/AdminLayout';
import DataTable from '@/Components/ui/DataTable';
import GenericModal from '@/Components/ui/GenericModal';
import TableHeader from '@/Components/ui/TableHeader';
import TabButton from '@/Components/ui/TabButton';

import { copyToClipboard, downloadFile } from '@/utils/exportService';
import {
    USER_TABS,
    USER_COMMON_COLUMNS,
    USER_SPECIFIC_COLUMNS,
    USER_COMMON_FIELDS,
    USER_SPECIFIC_FIELDS
} from '@/utils/constants';
import { useExport } from '@/Hooks/useExport';

const UserPage = ({ users, dosens, mahasiswas, allUsers }) => {
    const { user: currentUser } = usePage().props;
    const currentUserRole = currentUser.role;
    const urlParams = new URLSearchParams(window.location.search);
    const [activeTab, setActiveTab] = useState(
        urlParams.get('tab') && Object.values(USER_TABS).includes(urlParams.get('tab'))
            ? urlParams.get('tab')
            : USER_TABS.ADMIN
    );

    const [modalState, setModalState] = useState({ isOpen: false, editingData: null });
    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        name: "",
        email: "",
        password: "",
        role: "admin",
        nim: "",
        nip: "",
        phone: "",
        address: "",
    });
    const deleteForm = useForm();

    // Define handler functions first
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

    // Then define columns using the handlers
    const columns = useMemo(() => [
        ...USER_COMMON_COLUMNS,
        ...USER_SPECIFIC_COLUMNS[activeTab],
    ], [activeTab]);

    const currentData = useMemo(() => ({
        [USER_TABS.ADMIN]: users,
        [USER_TABS.DOSEN]: dosens,
        [USER_TABS.MAHASISWA]: mahasiswas,
        [USER_TABS.ALL]: allUsers,
    })[activeTab], [users, dosens, mahasiswas, allUsers, activeTab]);

    const modalFields = useMemo(() => [
        ...USER_COMMON_FIELDS,
        ...(USER_SPECIFIC_FIELDS[activeTab] || []).map(field =>
            activeTab === USER_TABS.ADMIN
                ? { ...field, disabled: currentUserRole === 'admin' }
                : field
        )
    ], [activeTab, currentUserRole]);

    const handleSubmit = useCallback((e) => {
        e.preventDefault();
        if (currentUserRole !== 'superadmin') return;

        const isEditing = modalState.editingData;
        const url = route(
            isEditing ? 'admin.users.update' : 'admin.users.store',
            isEditing ? modalState.editingData.id : undefined
        );

        // Filter out empty fields and password if not changed
        const formData = Object.fromEntries(
            Object.entries(data).filter(([key, value]) => {
                if (key === 'password' && isEditing && !value) return false;
                return value !== '';
            })
        );

        const action = isEditing ? put : post;
        action(url + `?tab=${activeTab}`, {
            data: formData,
            preserveState: true,
            onSuccess: () => {
                setModalState({ isOpen: false, editingData: null });
                reset();
            },
        });
    }, [currentUserRole, modalState, activeTab, data, post, put, reset]);

    const handleDownload = useExport({
        routeName: 'admin.users.export',
        searchParams: {
            tab: activeTab,
            search: new URLSearchParams(window.location.search).get('search')
        },
        columns
    });

    useEffect(() => {
        if (!modalState.isOpen) {
            reset();
            clearErrors();
            return;
        }

        if (modalState.editingData) {
            // Map the editing data to form fields with profilable data
            const profile = modalState.editingData.profilable || {};
            setData({
                name: modalState.editingData.name || '',
                email: modalState.editingData.email || '',
                password: '', // Clear password on edit
                role: modalState.editingData.role || 'admin',
                nim: profile.nim || '',
                nip: profile.nip || '',
                phone: profile.phone || '',
                address: profile.address || '',
            });
        } else {
            // Set default values for new user
            reset();
            setData(data => ({
                ...data,
                role: activeTab === USER_TABS.ADMIN ? 'admin' : '',
            }));
        }
    }, [modalState.isOpen, modalState.editingData, activeTab]);

    return (
        <AdminLayout title="Users Management" currentPage="Users">
            <div className="grid grid-cols-1 mb-8">
                <div className="flex flex-col gap-8">
                    <div className="border-b border-gray-200">
                        <nav className="flex -mb-px">
                            {Object.values(USER_TABS).map((tab) => (
                                <TabButton
                                    key={tab}
                                    active={activeTab === tab}
                                    onClick={() => handleTabChange(tab)}
                                    variant="underline"
                                >
                                    {tab}
                                </TabButton>
                            ))}
                        </nav>
                    </div>

                    <TableHeader
                        title={`Data ${activeTab}`}
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