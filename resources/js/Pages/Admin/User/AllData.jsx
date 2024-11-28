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

const AllData = ({ users }) => {
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
        userType: USER_TYPES.ADMIN,
        role: "admin",
        nim: "",
        nip: "",
        phone: "",
        address: "",
    });

    const handleUnauthorizedAction = useCallback(() => {
        alert("Butuh role lebih tinggi");
    }, []);

    const canManageRole = useCallback((currentRole, targetRole) => {
        if (currentRole === "superadmin") {
            return true;
        }
        if (currentRole === "admin") {
            return !["admin", "superadmin"].includes(targetRole);
        }
        return false;
    }, []);

    const handleSubmit = useCallback(
        (e) => {
            e.preventDefault();
            const targetRole = modalState.editingData
                ? modalState.editingData.role
                : form.data.role || form.data.userType;

            if (!canManageRole(currentUserRole, targetRole)) {
                handleUnauthorizedAction();
                return;
            }

            const isEditing = modalState.editingData;

            form[isEditing ? "put" : "post"](
                route(isEditing ? "admin.users.update" : "admin.users.store", {
                    ...(isEditing ? { id: modalState.editingData.id } : {}),
                    tab: isEditing
                        ? modalState.editingData.role
                        : form.data.userType,
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
            canManageRole,
        ]
    );

    const handleDelete = useCallback(
        (row) => {
            if (!canManageRole(currentUserRole, row.role)) {
                handleUnauthorizedAction();
                return;
            }

            if (!window.confirm("Kamu yakin ingin menghapus data user?"))
                return;

            form.delete(route("admin.users.destroy", row.id), {
                data: { tab: row.role },
                preserveState: true,
                preserveScroll: true,
            });
        },
        [currentUserRole, form, handleUnauthorizedAction, canManageRole]
    );

    const handleDownload = useExport({
        routeName: "admin.users.export",
        searchParams: { tab: USER_TYPES.ALL },
        columns: [
            ...USER_COMMON_COLUMNS,
            ...USER_SPECIFIC_COLUMNS[USER_TYPES.ALL],
        ],
    });

    useEffect(() => {
        if (modalState.editingData) {
            const profile = modalState.editingData.profilable || {};
            const role =
                modalState.editingData.role === "superadmin"
                    ? "admin"
                    : modalState.editingData.role;
            form.setData({
                name: modalState.editingData.name || "",
                email: modalState.editingData.email || "",
                password: "",
                role: modalState.editingData.role,
                userType: role,
                nim: profile.nim || "",
                nip: profile.nip || "",
                phone: profile.phone || "",
                address: profile.address || "",
            });
        } else {
            form.reset();
            form.clearErrors();
        }
    }, [modalState.editingData]);

    const getFields = useCallback(() => {
        if (modalState.editingData) {
            const role =
                modalState.editingData.role === "superadmin"
                    ? "admin"
                    : modalState.editingData.role;
            return [...USER_COMMON_FIELDS, ...USER_SPECIFIC_FIELDS[role]];
        }

        const userTypeField = {
            name: "userType",
            label: "Tipe User",
            type: "select",
            options: [
                { value: USER_TYPES.ADMIN, label: "Admin" },
                { value: USER_TYPES.DOSEN, label: "Dosen" },
                { value: USER_TYPES.MAHASISWA, label: "Mahasiswa" },
            ],
            required: true,
            onChange: (e) => {
                const newUserType = e.target.value;
                form.setData((prev) => ({
                    ...prev,
                    userType: newUserType,
                    role:
                        newUserType === USER_TYPES.ADMIN
                            ? "admin"
                            : newUserType,
                    nim: "",
                    nip: "",
                }));
            },
        };

        return [
            userTypeField,
            ...USER_COMMON_FIELDS,
            ...USER_SPECIFIC_FIELDS[form.data.userType],
        ];
    }, [modalState.editingData, form.setData]);

    const tableActions = useMemo(
        () => ({
            handleEdit: (row) => {
                if (!canManageRole(currentUserRole, row.role)) {
                    handleUnauthorizedAction();
                    return;
                }
                setModalState({ isOpen: true, editingData: row });
            },
            handleDelete,
        }),
        [currentUserRole, handleDelete, handleUnauthorizedAction, canManageRole]
    );

    // Memoize the modal props
    const modalProps = useMemo(
        () => ({
            isOpen: modalState.isOpen,
            onClose: () => setModalState({ isOpen: false, editingData: null }),
            title: `${modalState.editingData ? "Edit" : "Tambah"} Data User`,
            data: form.data,
            setData: form.setData,
            errors: form.errors,
            processing: form.processing,
            handleSubmit,
            clearErrors: form.clearErrors,
            fields: getFields(),
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
            getFields,
        ]
    );

    return (
        <div className="flex flex-col gap-8">
            <TableHeader
                title="Semua Data User"
                onDownload={handleDownload}
                onAdd={() => {
                    const targetRole = form.data.userType || "user";
                    if (!canManageRole(currentUserRole, targetRole)) {
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
                                ...USER_SPECIFIC_COLUMNS[USER_TYPES.ALL],
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

export default memo(AllData, (prevProps, nextProps) => {
    return JSON.stringify(prevProps.users) === JSON.stringify(nextProps.users);
});
