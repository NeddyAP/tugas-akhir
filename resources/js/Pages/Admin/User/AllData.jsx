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

const AllData = ({ users }) => {
    const { user: currentUser } = usePage().props;
    const currentUserRole = currentUser.role;
    const [modalState, setModalState] = useState({ isOpen: false, editingData: null });
    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        name: "",
        email: "",
        password: "",
        userType: USER_TYPES.ADMIN,
        role: "admin",
        nim: "",
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
            !window.confirm('Kamu yakin ingin menghapus data user?')) return;

        deleteForm.delete(route("admin.users.destroy", row.id), {
            data: { tab: row.role },
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
                tab: isEditing ? modalState.editingData.role : data.userType
            }
        );

        const formData = Object.fromEntries(
            Object.entries(data).filter(([key, value]) => {
                if (key === 'password' && isEditing && !value) return false;
                if (key === 'nim' && data.userType !== USER_TYPES.MAHASISWA) return false;
                if (key === 'nip' && data.userType !== USER_TYPES.DOSEN) return false;
                if (key === 'userType') return false;
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
        searchParams: { tab: USER_TYPES.ALL },
        columns: [...USER_COMMON_COLUMNS, ...USER_SPECIFIC_COLUMNS[USER_TYPES.ALL]]
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
                userType: modalState.editingData.role,
                role: modalState.editingData.role,
                nim: profile.nim || '',
                nip: profile.nip || '',
                phone: profile.phone || '',
                address: profile.address || '',
            });
        }
    }, [modalState.isOpen, modalState.editingData, setData, reset, clearErrors]);

    const getFields = () => {
        if (modalState.editingData) {

            return [
                ...USER_COMMON_FIELDS,
                ...USER_SPECIFIC_FIELDS[modalState.editingData.role]
            ];
        }


        const userTypeField = {
            name: "userType",
            label: "Tipe User",
            type: "select",
            options: [
                { value: USER_TYPES.ADMIN, label: "Admin" },
                { value: USER_TYPES.DOSEN, label: "Dosen" },
                { value: USER_TYPES.MAHASISWA, label: "Mahasiswa" }
            ],
            required: true,
            onChange: (e) => {
                const newUserType = e.target.value;
                setData(prev => ({
                    ...prev,
                    userType: newUserType,
                    role: newUserType === USER_TYPES.ADMIN ? 'admin' : newUserType,

                    nim: '',
                    nip: ''
                }));
            }
        };


        const specificFields = data.userType === USER_TYPES.ADMIN
            ? USER_SPECIFIC_FIELDS[USER_TYPES.ADMIN]
            : USER_SPECIFIC_FIELDS[data.userType] || [];

        return [
            userTypeField,
            ...USER_COMMON_FIELDS,
            ...specificFields
        ];
    };

    return (
        <div className="flex flex-col gap-8">
            <TableHeader
                title="Semua Data User"
                onDownload={handleDownload}
                onAdd={currentUserRole === 'superadmin' ? handleAdd : undefined}
                className="flex-col gap-2 sm:flex-row sm:gap-4"
            />

            <div className="pb-4 overflow-x-auto">
                <div className="inline-block min-w-full align-middle">
                    <div className="overflow-hidden">
                        <DataTable
                            columns={[...USER_COMMON_COLUMNS, ...USER_SPECIFIC_COLUMNS[USER_TYPES.ALL]]}
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
                            className="w-full"
                        />
                    </div>
                </div>
            </div>

            <GenericModal
                isOpen={modalState.isOpen}
                onClose={() => setModalState({ isOpen: false, editingData: null })}
                title={`${modalState.editingData ? 'Edit' : 'Tambah'} Data User`}
                data={data}
                setData={setData}
                errors={errors}
                processing={processing}
                handleSubmit={handleSubmit}
                clearErrors={clearErrors}
                fields={getFields()}
                className="w-full max-w-lg p-4 mx-auto sm:p-6"
            />
        </div>
    );
};

export default memo(AllData);
