import { memo, useCallback, useState, useEffect, useMemo } from 'react';
import { useForm, usePage } from '@inertiajs/react';

import DataTable from '@/Components/ui/DataTable';
import GenericModal from '@/Components/ui/GenericModal';
import TableHeader from '@/Components/ui/TableHeader';
import {
    USER_COMMON_COLUMNS,
    USER_SPECIFIC_COLUMNS,
    USER_COMMON_FIELDS,
    USER_SPECIFIC_FIELDS,
    USER_TYPES
} from '@/utils/constants';
import { useExport } from '@/Hooks/useExport';

const Admin = ({ users }) => {
    const { user: currentUser } = usePage().props;
    const currentUserRole = currentUser.role;
    const [modalState, setModalState] = useState({ isOpen: false, editingData: null });
    const form = useForm({
        name: "",
        email: "",
        password: "",
        role: "admin",
        phone: "",
        address: "",
    });

    const handleDownload = useExport({
        routeName: 'admin.users.export',
        searchParams: { tab: USER_TYPES.ADMIN },
        columns: [...USER_COMMON_COLUMNS, ...USER_SPECIFIC_COLUMNS[USER_TYPES.ADMIN]]
    });

    const handleUnauthorizedAction = useCallback(() => {
        alert('Butuh role lebih tinggi');
    }, []);

    const handleSubmit = useCallback((e) => {
        e.preventDefault();
        if (currentUserRole !== 'superadmin') {
            handleUnauthorizedAction();
            return;
        }

        const isEditing = modalState.editingData;

        form[isEditing ? 'put' : 'post'](
            route(isEditing ? 'admin.users.update' : 'admin.users.store',
                {
                    ...(isEditing ? { id: modalState.editingData.id } : {}),
                    tab: USER_TYPES.ADMIN
                }
            ), {
            onSuccess: () => {
                setModalState({ isOpen: false, editingData: null });
                form.reset();
            }
        }
        );
    }, [currentUserRole, modalState.editingData, form, handleUnauthorizedAction]);

    const handleDelete = useCallback((row) => {
        if (currentUserRole !== 'superadmin') {
            handleUnauthorizedAction();
            return;
        }

        if (!window.confirm('Kamu yakin ingin menghapus data admin?')) return;

        form.delete(route("admin.users.destroy", row.id), {
            data: { tab: USER_TYPES.ADMIN },
            preserveState: true,
            preserveScroll: true
        });
    }, [currentUserRole, form, handleUnauthorizedAction]);

    const tableActions = useMemo(() => ({
        handleEdit: (row) => {
            if (currentUserRole !== 'superadmin') {
                handleUnauthorizedAction();
                return;
            }
            setModalState({ isOpen: true, editingData: row });
        },
        handleDelete
    }), [currentUserRole, handleDelete, handleUnauthorizedAction]);

    const emptyStateMessage = useMemo(() => 
        currentUserRole !== 'superadmin' 
            ? "Anda tidak memiliki akses untuk melihat detail data admin"
            : "Tidak ada data admin", 
        [currentUserRole]
    );

    useEffect(() => {
        if (modalState.editingData) {
            const profile = modalState.editingData.profilable || {};
            form.setData({
                name: modalState.editingData.name || '',
                email: modalState.editingData.email || '',
                password: '',
                role: modalState.editingData.role || 'admin',
                phone: profile.phone || '',
                address: profile.address || '',
            });
        } else {
            form.reset();
            form.clearErrors();
        }
    }, [modalState.editingData]);

    const modalProps = useMemo(() => ({
        isOpen: modalState.isOpen,
        onClose: () => setModalState({ isOpen: false, editingData: null }),
        title: `${modalState.editingData ? 'Edit' : 'Tambah'} Data Admin`,
        data: form.data,
        setData: form.setData,
        errors: form.errors,
        processing: form.processing,
        handleSubmit,
        clearErrors: form.clearErrors,
        fields: [...USER_COMMON_FIELDS, ...USER_SPECIFIC_FIELDS[USER_TYPES.ADMIN]],
        className: "w-full max-w-lg p-4 mx-auto sm:p-6"
    }), [
        modalState.isOpen,
        modalState.editingData,
        form.data,
        form.setData,
        form.errors,
        form.processing,
        handleSubmit,
        form.clearErrors
    ]);

    return (
        <div className="flex flex-col gap-8">
            <TableHeader
                title="Data Admin"
                onDownload={handleDownload}
                onAdd={() => {
                    if (currentUserRole !== 'superadmin') {
                        handleUnauthorizedAction();
                        return;
                    }
                    setModalState({ isOpen: true, editingData: null });
                }}
                className="flex-col gap-2 sm:flex-row sm:gap-4"
            />

            <div className="pb-4 overflow-x-auto">
                <div className="inline-block min-w-full align-middle">
                    <div className="overflow-hidden">
                        <DataTable
                            columns={[...USER_COMMON_COLUMNS, ...USER_SPECIFIC_COLUMNS[USER_TYPES.ADMIN]]}
                            data={users.data}
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
                            className="w-full"
                            emptyMessage="Tidak ada data admin"
                        />
                    </div>
                </div>
            </div>

            <GenericModal {...modalProps} />
        </div>
    );
};

export default memo(Admin, (prevProps, nextProps) => {
    return JSON.stringify(prevProps.users) === JSON.stringify(nextProps.users);
});
