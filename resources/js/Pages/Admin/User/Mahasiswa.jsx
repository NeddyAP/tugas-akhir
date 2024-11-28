import { memo, useCallback, useState, useEffect, useMemo } from "react";
import { useForm, usePage } from "@inertiajs/react";

import DataTable from "@/Components/ui/DataTable";
import GenericModal from "@/Components/ui/GenericModal";
import TableHeader from "@/Components/ui/TableHeader";
import {
    USER_COMMON_COLUMNS,
    USER_SPECIFIC_COLUMNS,
    USER_COMMON_FIELDS,
    USER_SPECIFIC_FIELDS,
    USER_TYPES,
} from "@/utils/constants";
import { useExport } from "@/Hooks/useExport";

const Mahasiswa = ({ users }) => {
    const { user: currentUser } = usePage().props;
    const currentUserRole = currentUser.role;
    const [modalState, setModalState] = useState({
        isOpen: false,
        editingData: null,
    });
    const form = useForm({
        name: "",
        email: "",
        password: "",
        role: "mahasiswa",
        nim: "",
        phone: "",
        address: "",
    });

    const allowedRoles = ["admin", "superadmin"];

    const handleDownload = useExport({
        routeName: "admin.users.export",
        searchParams: { tab: USER_TYPES.MAHASISWA },
        columns: [
            ...USER_COMMON_COLUMNS,
            ...USER_SPECIFIC_COLUMNS[USER_TYPES.MAHASISWA],
        ],
    });

    const handleUnauthorizedAction = useCallback(() => {
        alert("Butuh role lebih tinggi");
    }, []);

    const handleSubmit = useCallback(
        (e) => {
            e.preventDefault();
            if (!allowedRoles.includes(currentUserRole)) {
                handleUnauthorizedAction();
                return;
            }

            const isEditing = modalState.editingData;

            form[isEditing ? "put" : "post"](
                route(isEditing ? "admin.users.update" : "admin.users.store", {
                    ...(isEditing ? { id: modalState.editingData.id } : {}),
                    tab: USER_TYPES.MAHASISWA,
                }),
                {
                    onSuccess: () => {
                        setModalState({ isOpen: false, editingData: null });
                        form.reset();
                    },
                }
            );
        },
        [
            currentUserRole,
            modalState.editingData,
            form,
            handleUnauthorizedAction,
        ]
    );

    const handleDelete = useCallback(
        (row) => {
            if (!allowedRoles.includes(currentUserRole)) {
                handleUnauthorizedAction();
                return;
            }
            if (!window.confirm("Kamu yakin ingin menghapus data mahasiswa?"))
                return;

            form.delete(route("admin.users.destroy", row.id), {
                data: { tab: USER_TYPES.MAHASISWA },
                preserveState: true,
                preserveScroll: true,
            });
        },
        [currentUserRole, form, handleUnauthorizedAction]
    );

    const tableActions = useMemo(
        () => ({
            handleEdit: (row) => {
                if (!allowedRoles.includes(currentUserRole)) {
                    handleUnauthorizedAction();
                    return;
                }
                setModalState({ isOpen: true, editingData: row });
            },
            handleDelete,
        }),
        [currentUserRole, handleDelete, handleUnauthorizedAction]
    );

    useEffect(() => {
        if (modalState.editingData) {
            const profile = modalState.editingData.profilable || {};
            form.setData({
                name: modalState.editingData.name || "",
                email: modalState.editingData.email || "",
                password: "",
                role: "mahasiswa",
                nim: profile.nim || "",
                phone: profile.phone || "",
                address: profile.address || "",
            });
        } else {
            form.reset();
            form.clearErrors();
        }
    }, [modalState.editingData]);

    const modalProps = useMemo(
        () => ({
            isOpen: modalState.isOpen,
            onClose: () => setModalState({ isOpen: false, editingData: null }),
            title: `${
                modalState.editingData ? "Edit" : "Tambah"
            } Data Mahasiswa`,
            data: form.data,
            setData: form.setData,
            errors: form.errors,
            processing: form.processing,
            handleSubmit,
            clearErrors: form.clearErrors,
            fields: [
                ...USER_COMMON_FIELDS,
                ...USER_SPECIFIC_FIELDS[USER_TYPES.MAHASISWA],
            ],
            className: "w-full max-w-lg p-4 mx-auto sm:p-6",
        }),
        [
            modalState.isOpen,
            modalState.editingData,
            form.data,
            form.setData,
            form.errors,
            form.processing,
            handleSubmit,
            form.clearErrors,
        ]
    );

    return (
        <div className="flex flex-col gap-8">
            <TableHeader
                title="Data Mahasiswa"
                onDownload={handleDownload}
                onAdd={() => {
                    if (!allowedRoles.includes(currentUserRole)) {
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
                            columns={[
                                ...USER_COMMON_COLUMNS,
                                ...USER_SPECIFIC_COLUMNS[USER_TYPES.MAHASISWA],
                            ]}
                            data={users.data}
                            actions={tableActions}
                            defaultSortBy="name"
                            pagination={{
                                pageIndex: users.current_page - 1,
                                pageCount: users.last_page,
                                pageSize: users.per_page,
                                total: users.total,
                                from: users.from,
                                to: users.to,
                            }}
                            className="w-full"
                        />
                    </div>
                </div>
            </div>

            <GenericModal {...modalProps} />
        </div>
    );
};

export default memo(Mahasiswa);
