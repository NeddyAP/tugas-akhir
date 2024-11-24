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

const Dosen = ({ users }) => {
    const { user: currentUser } = usePage().props;
    const currentUserRole = currentUser.role;
    const [modalState, setModalState] = useState({ isOpen: false, editingData: null });
    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        name: "",
        email: "",
        password: "",
        role: "dosen",
        nip: "",
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
            !window.confirm('Kamu yakin ingin menghapus data dosen?')) return;

        deleteForm.delete(route("admin.users.destroy", row.id), {
            data: { tab: USER_TYPES.DOSEN },
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
                tab: USER_TYPES.DOSEN
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
        searchParams: { tab: USER_TYPES.DOSEN },
        columns: [...USER_COMMON_COLUMNS, ...USER_SPECIFIC_COLUMNS[USER_TYPES.DOSEN]]
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
                role: "dosen",
                nip: profile.nip || '',
                phone: profile.phone || '',
                address: profile.address || '',
            });
        }
    }, [modalState.isOpen, modalState.editingData, setData, reset, clearErrors]);

    return (
        <div className="flex flex-col gap-8">
            <TableHeader
                title="Data Dosen"
                onDownload={handleDownload}
                onAdd={currentUserRole === 'superadmin' ? handleAdd : undefined}
            />

            <DataTable
                columns={[...USER_COMMON_COLUMNS, ...USER_SPECIFIC_COLUMNS[USER_TYPES.DOSEN]]}
                data={users.data}
                actions={{ handleEdit, handleDelete, handleAdd }}
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
                title={`${modalState.editingData ? 'Edit' : 'Tambah'} Data Dosen`}
                data={data}
                setData={setData}
                errors={errors}
                processing={processing}
                handleSubmit={handleSubmit}
                clearErrors={clearErrors}
                fields={[...USER_COMMON_FIELDS, ...USER_SPECIFIC_FIELDS[USER_TYPES.DOSEN]]}
            />
        </div>
    );
};

export default memo(Dosen);
