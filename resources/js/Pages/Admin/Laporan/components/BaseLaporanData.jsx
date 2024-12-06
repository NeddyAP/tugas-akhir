import React, { useCallback, useMemo, useState, useEffect } from "react";
import { useForm } from "@inertiajs/react";
import DataTable from "@/Components/ui/DataTable";
import TableHeader from "@/Components/ui/TableHeader";
import GenericModal from "@/Components/ui/GenericModal";
import Select from "react-select";
import { formatDate, getStatusColor } from "@/utils/helpers";
import PropTypes from "prop-types";
import { format } from "date-fns";

export default function BaseLaporanData({
    type,
    title,
    description,
    laporans,
    allLaporans,
    mahasiswas,
    dosens,
    selectedIds,
    onSelectedIdsChange,
    onBulkUpdate,
}) {
    const { delete: destroy } = useForm();
    const [modalState, setModalState] = useState({
        isOpen: false,
        editingData: null,
    });
    const { data, setData, post, put, processing, errors, reset, clearErrors } =
        useForm({
            type: type,
            user_id: "",
            dosen_id: "",
            tanggal_mulai: "",
            tanggal_selesai: "",
            status: "pending",
        });

    const [filteredMahasiswas, setFilteredMahasiswas] = useState(mahasiswas);

    useEffect(() => {
        let existingUserIds = allLaporans
            .filter((laporan) => laporan.type === data.type)
            .map((laporan) => laporan.user_id);

        if (modalState.editingData) {
            existingUserIds = existingUserIds.filter(
                (id) => id !== modalState.editingData.user_id,
            );
        }

        const newFilteredMahasiswas = mahasiswas.filter(
            (m) => !existingUserIds.includes(m.value),
        );
        setFilteredMahasiswas(newFilteredMahasiswas);
    }, [data.type, mahasiswas, allLaporans, modalState.editingData]);

    const handleModalClose = useCallback(() => {
        setModalState({ isOpen: false, editingData: null });
        reset();
        clearErrors();
    }, [reset, clearErrors]);

    const handleSubmit = useCallback(
        (e) => {
            e.preventDefault();

            if (modalState.editingData) {
                put(route("admin.laporans.update", modalState.editingData.id), {
                    onSuccess: () => {
                        setModalState({ isOpen: false, editingData: null });
                        reset();
                    },
                    preserveScroll: true,
                });
            } else {
                post(route("admin.laporans.store"), {
                    onSuccess: () => {
                        setModalState({ isOpen: false, editingData: null });
                        reset();
                    },
                    preserveScroll: true,
                });
            }
        },
        [modalState.editingData, data, post, put, reset, setModalState],
    );

    const formatDateForInput = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return format(date, "yyyy-MM-dd");
    };

    const tableActions = useMemo(
        () => ({
            handleEdit: (row) => {
                setModalState({ isOpen: true, editingData: row });
                setData({
                    type: type,
                    user_id: row.user_id,
                    dosen_id: row.dosen_id,
                    tanggal_mulai: formatDateForInput(row.tanggal_mulai),
                    tanggal_selesai: formatDateForInput(row.tanggal_selesai),
                    status: row.status,
                });
            },
            handleDelete: (row) => {
                if (
                    window.confirm(
                        "Apakah Anda yakin ingin menghapus data ini?",
                    )
                ) {
                    destroy(
                        route("admin.laporans.destroy", [row.id, { type }]),
                    );
                }
            },
            handleAdd: () => {
                setModalState({ isOpen: true, editingData: null });
                reset();
            },
        }),
        [destroy, type, setData, reset],
    );

    const columns = useMemo(
        () => [
            { Header: "Mahasiswa", accessor: "mahasiswa.name", sortable: true },
            {
                Header: "Pembimbing",
                accessor: "pembimbing.name",
                sortable: true,
            },
            {
                Header: "Status",
                accessor: "status",
                Cell: ({ value }) => (
                    <span
                        className={`px-2 py-1 rounded-full text-xs ${getStatusColor(
                            value,
                        )}`}
                    >
                        {value || "pending"}
                    </span>
                ),
            },
            {
                Header: "Tanggal Mulai",
                accessor: "tanggal_mulai",
                Cell: ({ value }) => formatDate(value),
                sortable: true,
            },
            {
                Header: "Tanggal Selesai",
                accessor: "tanggal_selesai",
                Cell: ({ value }) => formatDate(value),
                sortable: true,
            },
            {
                Header: "File Laporan",
                accessor: "laporan.file",
                Cell: ({ row }) => {
                    const laporan = row.original.laporan;
                    return laporan?.file ? (
                        <a
                            href={route(
                                "files.laporan",
                                laporan.file.split("/").pop(),
                            )}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800"
                        >
                            Lihat Laporan
                        </a>
                    ) : (
                        <span className="text-gray-400">Belum ada laporan</span>
                    );
                },
            },
            {
                Header: "Keterangan",
                accessor: "laporan.keterangan",
                Cell: ({ row }) =>
                    row.original.laporan?.keterangan || "Belum ada keterangan",
            },
        ],
        [],
    );

    const modalFields = useMemo(
        () => [
            {
                name: "type",
                label: "Jenis Laporan",
                type: "select",
                options: [
                    { value: "kkl", label: "KKL" },
                    { value: "kkn", label: "KKN" },
                ],
                value: type,
                required: true,
                disabled: modalState.editingData !== null,
            },
            {
                name: "user_id",
                label: "Mahasiswa",
                type: "searchableSelect",
                options: filteredMahasiswas,
                required: true,
                disabled: modalState.editingData !== null,
            },
            {
                name: "dosen_id",
                label: "Pembimbing",
                type: "searchableSelect",
                options: dosens,
                required: true,
            },
            {
                name: "tanggal_mulai",
                label: "Tanggal Mulai",
                type: "date",
                required: true,
            },
            {
                name: "tanggal_selesai",
                label: "Tanggal Selesai",
                type: "date",
                required: true,
            },
            {
                name: "status",
                label: "Status",
                type: "select",
                options: [
                    { value: "pending", label: "Pending" },
                    { value: "approved", label: "Approved" },
                    { value: "rejected", label: "Rejected" },
                ],
                required: true,
            },
        ],
        [filteredMahasiswas, dosens, modalState.editingData],
    );

    const pagination = useMemo(
        () => ({
            pageIndex: laporans.current_page - 1,
            pageCount: laporans.last_page,
            pageSize: laporans.per_page,
            total: laporans.total,
            from: laporans.from,
            to: laporans.to,
        }),
        [laporans],
    );

    const customSelectStyles = {
        control: (base) => ({
            ...base,
            "@media (prefers-color-scheme: dark)": {
                backgroundColor: "#1f2937",
                borderColor: "#374151",
            },
        }),
        menu: (base) => ({
            ...base,
            "@media (prefers-color-scheme: dark)": {
                backgroundColor: "#1f2937",
                borderColor: "#374151",
            },
        }),
    };

    const [bulkUpdateData, setBulkUpdateData] = useState({});

    const handleBulkUpdateConfirm = () => {
        if (Object.keys(bulkUpdateData).length === 0) {
            return;
        }

        if (
            window.confirm(
                `Are you sure you want to update ${selectedIds.length} items?`,
            )
        ) {
            onBulkUpdate?.(bulkUpdateData);
            setBulkUpdateData({});
        }
    };

    return (
        <div className="grid grid-cols-1 mb-8">
            <div className="flex flex-col gap-8">
                <header className="flex items-center justify-between">
                    <div className="flex flex-col">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-200">
                            {title}
                        </h2>
                        <p className="text-sm text-gray-400">{description}</p>
                    </div>
                    <button
                        type="button"
                        onClick={tableActions.handleAdd}
                        className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-teal-600 border border-transparent rounded-md shadow-sm hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
                    >
                        Tambah {title}
                    </button>
                </header>

                {selectedIds?.length > 0 && (
                    <div className="flex gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                        <span className="text-sm text-gray-600 dark:text-gray-300">
                            {selectedIds.length} item(s) selected
                        </span>
                        <div className="flex items-center gap-2">
                            <Select
                                onChange={(option) =>
                                    setBulkUpdateData((prev) => ({
                                        ...prev,
                                        status: option?.value,
                                    }))
                                }
                                value={
                                    bulkUpdateData.status
                                        ? {
                                              value: bulkUpdateData.status,
                                              label:
                                                  bulkUpdateData.status
                                                      .charAt(0)
                                                      .toUpperCase() +
                                                  bulkUpdateData.status.slice(
                                                      1,
                                                  ),
                                          }
                                        : null
                                }
                                options={[
                                    {
                                        value: "pending",
                                        label: "Set as Pending",
                                    },
                                    {
                                        value: "approved",
                                        label: "Set as Approved",
                                    },
                                    {
                                        value: "rejected",
                                        label: "Set as Rejected",
                                    },
                                ]}
                                isClearable
                                placeholder="Update Status"
                                className="w-48"
                                styles={customSelectStyles}
                                classNames={{
                                    control: ({ isFocused }) =>
                                        `!bg-white dark:!bg-gray-800 !border-gray-300 dark:!border-gray-700 ${
                                            isFocused
                                                ? "!border-blue-500 !shadow-outline-blue dark:!border-blue-500"
                                                : ""
                                        }`,
                                    option: ({ isFocused, isSelected }) =>
                                        `${
                                            isSelected
                                                ? "!bg-blue-500 !text-white"
                                                : isFocused
                                                  ? "!bg-gray-100 dark:!bg-gray-700"
                                                  : "!text-gray-900 dark:!text-gray-100"
                                        }`,
                                    menu: () =>
                                        "!bg-white dark:!bg-gray-800 !border dark:!border-gray-700",
                                    singleValue: () =>
                                        "!text-gray-900 dark:!text-gray-100",
                                }}
                            />
                            <Select
                                onChange={(option) =>
                                    setBulkUpdateData((prev) => ({
                                        ...prev,
                                        dosen_id: option?.value,
                                    }))
                                }
                                value={
                                    bulkUpdateData.dosen_id
                                        ? dosens.find(
                                              (d) =>
                                                  d.value ===
                                                  bulkUpdateData.dosen_id,
                                          )
                                        : null
                                }
                                options={dosens}
                                isClearable
                                placeholder="Assign Supervisor"
                                className="w-64"
                                styles={customSelectStyles}
                                classNames={{
                                    control: ({ isFocused }) =>
                                        `!bg-white dark:!bg-gray-800 !border-gray-300 dark:!border-gray-700 ${
                                            isFocused
                                                ? "!border-blue-500 !shadow-outline-blue dark:!border-blue-500"
                                                : ""
                                        }`,
                                    option: ({ isFocused, isSelected }) =>
                                        `${
                                            isSelected
                                                ? "!bg-blue-500 !text-white"
                                                : isFocused
                                                  ? "!bg-gray-100 dark:!bg-gray-700"
                                                  : "!text-gray-900 dark:!text-gray-100"
                                        }`,
                                    menu: () =>
                                        "!bg-white dark:!bg-gray-800 !border dark:!border-gray-700",
                                    singleValue: () =>
                                        "!text-gray-900 dark:!text-gray-100",
                                }}
                            />
                            {Object.keys(bulkUpdateData).length > 0 && (
                                <div className="flex gap-2">
                                    <button
                                        onClick={handleBulkUpdateConfirm}
                                        className="px-4 py-2 text-sm text-white bg-teal-600 rounded hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
                                    >
                                        Update Selected
                                    </button>
                                    <button
                                        onClick={() => setBulkUpdateData({})}
                                        className="px-4 py-2 text-sm text-gray-600 bg-white border border-gray-300 rounded hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                <div className="pb-4 overflow-x-auto">
                    <div className="inline-block min-w-full align-middle">
                        <div className="overflow-hidden">
                            <DataTable
                                columns={columns}
                                data={laporans.data || []}
                                actions={tableActions}
                                pagination={pagination}
                                selectedIds={selectedIds}
                                onSelectedIdsChange={onSelectedIdsChange}
                            />
                        </div>
                    </div>
                </div>

                <GenericModal
                    isOpen={modalState.isOpen}
                    onClose={handleModalClose}
                    title={`${
                        modalState.editingData ? "Edit" : "Tambah"
                    } ${title}`}
                    type={type}
                    editingData={modalState.editingData}
                    fields={modalFields}
                    data={data}
                    setData={setData}
                    errors={errors}
                    processing={processing}
                    handleSubmit={handleSubmit}
                />
            </div>
        </div>
    );
}

BaseLaporanData.propTypes = {
    type: PropTypes.oneOf(["kkl", "kkn"]).isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    laporans: PropTypes.shape({
        data: PropTypes.array.isRequired,
        current_page: PropTypes.number.isRequired,
        last_page: PropTypes.number.isRequired,
        per_page: PropTypes.number.isRequired,
        total: PropTypes.number.isRequired,
        from: PropTypes.number,
        to: PropTypes.number,
    }).isRequired,

    allLaporans: PropTypes.arrayOf(
        PropTypes.shape({
            user_id: PropTypes.number.isRequired,
            type: PropTypes.string.isRequired,
        }),
    ).isRequired,
    mahasiswas: PropTypes.arrayOf(
        PropTypes.shape({
            value: PropTypes.number.isRequired,
            label: PropTypes.string.isRequired,
        }),
    ).isRequired,
    dosens: PropTypes.arrayOf(
        PropTypes.shape({
            value: PropTypes.number.isRequired,
            label: PropTypes.string.isRequired,
        }),
    ).isRequired,
    selectedIds: PropTypes.arrayOf(PropTypes.number),
    onSelectedIdsChange: PropTypes.func,
    onBulkUpdate: PropTypes.func,
};
