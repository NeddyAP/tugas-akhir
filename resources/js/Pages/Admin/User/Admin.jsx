import { memo, useCallback, useState, useEffect } from 'react';
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
    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        name: "",
        email: "",
        password: "",
        role: "admin",
        phone: "",
        address: "",
    });
    const deleteForm = useForm();

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
            !window.confirm('Kamu yakin ingin menghapus data admin?')) return;

        deleteForm.delete(route("admin.users.destroy", row.id), {
            data: { tab: USER_TYPES.ADMIN },
            preserveState: true,
            preserveScroll: true
        });
    }, [currentUserRole, deleteForm]);

    const handleSubmit = useCallback((e) => {
        e.preventDefault();
        if (currentUserRole !== 'superadmin') return;

        const isEditing = modalState.editingData;
        const url = route(
            isEditing ? 'admin.users.update' : 'admin.users.store',
            {
                ...(isEditing ? { id: modalState.editingData.id } : {}),
                tab: USER_TYPES.ADMIN
            }
        );

        const formData = Object.fromEntries(
            Object.entries(data).filter(([key, value]) => {
                if (key === 'password' && isEditing && !value) return false;
                return value !== '';
            })
        );

        const action = isEditing ? put : post;
        action(url, {
            data: { ...formData },
            preserveState: true,
            onSuccess: () => {
                setModalState({ isOpen: false, editingData: null });
                reset();
            },
        });
    }, [currentUserRole, modalState, data, put, post, reset]);

    const handleDownload = useExport({
        routeName: 'admin.users.export',
        searchParams: { tab: USER_TYPES.ADMIN },
        columns: [...USER_COMMON_COLUMNS, ...USER_SPECIFIC_COLUMNS[USER_TYPES.ADMIN]]
    });

    useEffect(() => {
        if (!modalState.isOpen) {
            reset();
            clearErrors();
            return;
        }

        if (modalState.editingData) {
            const profile = modalState.editingData.profilable || {};
            setData({
                name: modalState.editingData.name || '',
                email: modalState.editingData.email || '',
                password: '',
                role: modalState.editingData.role || 'admin',
                phone: profile.phone || '',
                address: profile.address || '',
            });
        }
    }, [modalState.isOpen, modalState.editingData, setData, reset, clearErrors]);

    return (
        <div className="flex flex-col gap-8">
            <TableHeader
                title="Data Admin"
                onDownload={handleDownload}
                onAdd={currentUserRole === 'superadmin' ? handleAdd : undefined}
                className="flex-col gap-2 sm:flex-row sm:gap-4"
            />

            <div className="pb-4 overflow-x-auto"> {/* Added pb-4 for padding bottom */}
                <div className="inline-block min-w-full align-middle">
                    <div className="overflow-hidden"> {/* Added wrapper div */}
                        <DataTable
                            columns={[...USER_COMMON_COLUMNS, ...USER_SPECIFIC_COLUMNS[USER_TYPES.ADMIN]]}
                            data={users.data}
                            actions={{ handleEdit, handleDelete }}
                            defaultSortBy="name"
                            pagination={{
                                pageIndex: users.current_page - 1,
                                pageCount: users.last_page,
                                pageSize: users.per_page,
                                total: users.total,
                                from: users.from,
                                to: users.to
                            }}
                            className="w-full" // Add this if not already present
                        />
                    </div>
                </div>
            </div>

            <GenericModal
                isOpen={modalState.isOpen}
                onClose={() => setModalState({ isOpen: false, editingData: null })}
                title={`${modalState.editingData ? 'Edit' : 'Tambah'} Data Admin`}
                data={data}
                setData={setData}
                errors={errors}
                processing={processing}
                handleSubmit={handleSubmit}
                clearErrors={clearErrors}
                fields={[...USER_COMMON_FIELDS, ...USER_SPECIFIC_FIELDS[USER_TYPES.ADMIN]]}
                className="w-full max-w-lg p-4 mx-auto sm:p-6"
            />
        </div>
    );
};

export default memo(Admin);
