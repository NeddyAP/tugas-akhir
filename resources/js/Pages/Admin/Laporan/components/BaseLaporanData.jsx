import React, { useCallback, useMemo, useState, useEffect } from "react";
import { useForm } from "@inertiajs/react";
import DataTable from "@/Components/ui/DataTable";
import TableHeader from "@/Components/ui/TableHeader";
import GenericModal from "@/Components/ui/GenericModal";
import { formatDate, getStatusColor } from "@/utils/helpers";
import PropTypes from 'prop-types';
import { format } from 'date-fns'; // Add this import if not already present

export default function BaseLaporanData({
    type,
    title,
    description,
    laporans,
    mahasiswas,
    dosens
}) {
    const { delete: destroy } = useForm();
    const [modalState, setModalState] = useState({ isOpen: false, editingData: null });
    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        type: type,
        user_id: "",
        dosen_id: "",
        tanggal_mulai: "",
        tanggal_selesai: "",
        status: "pending",
        file: null,
        keterangan: "",
    });

    const handleModalClose = useCallback(() => {
        setModalState({ isOpen: false, editingData: null });
        reset();
        clearErrors();
    }, [reset, clearErrors]);

    const handleFileChange = useCallback((e) => {
        const file = e.target.files[0];
        if (file) {
            setData('file', file);
        }
    }, [setData]);

    const handleSubmit = useCallback((e) => {
        e.preventDefault();
        const formData = new FormData();

        Object.keys(data).forEach(key => {
            if (data[key] !== null && data[key] !== undefined) {
                if (key === 'file' && data[key] instanceof File) {
                    formData.append(key, data[key]);
                } else {
                    formData.append(key, data[key].toString());
                }
            }
        });

        if (modalState.editingData) {
            put(route('admin.laporans.update', modalState.editingData.id), formData, {
                forceFormData: true,
                onSuccess: () => {
                    handleModalClose();
                },
                preserveScroll: true,
            });
        } else {
            post(route('admin.laporans.store'), formData, {
                forceFormData: true,
                onSuccess: () => {
                    handleModalClose();
                },
                preserveScroll: true,
            });
        }
    }, [modalState.editingData, data, post, put, handleModalClose]);

    const formatDateForInput = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return format(date, 'yyyy-MM-dd');
    };

    const tableActions = useMemo(() => ({
        handleEdit: (row) => {
            setModalState({ isOpen: true, editingData: row });
            setData({
                type: type,
                user_id: row.user_id,
                dosen_id: row.dosen_id,
                tanggal_mulai: formatDateForInput(row.tanggal_mulai),
                tanggal_selesai: formatDateForInput(row.tanggal_selesai),
                status: row.status,
                keterangan: row.laporan?.keterangan || "",
            });
        },
        handleDelete: (row) => {
            if (window.confirm('Apakah Anda yakin ingin menghapus data ini?')) {
                // Change how we send the delete request
                destroy(route('admin.laporans.destroy', [row.id, { type }]));
            }
        },
        handleAdd: () => {
            setModalState({ isOpen: true, editingData: null });
            reset(); // Reset form when adding new data
        },
    }), [destroy, type, setData, reset]);

    const columns = useMemo(() => [
        { Header: "Mahasiswa", accessor: "mahasiswa.name", sortable: true },
        { Header: "Pembimbing", accessor: "pembimbing.name", sortable: true },
        {
            Header: "Status",
            accessor: "status",
            Cell: ({ value }) => (
                <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(value)}`}>
                    {value || 'pending'}
                </span>
            )
        },
        {
            Header: "Tanggal Mulai",
            accessor: "tanggal_mulai",
            Cell: ({ value }) => formatDate(value),
            sortable: true
        },
        {
            Header: "Tanggal Selesai",
            accessor: "tanggal_selesai",
            Cell: ({ value }) => formatDate(value),
            sortable: true
        },
        {
            Header: "File Laporan",
            accessor: "laporan.file",
            Cell: ({ row }) => {
                const laporan = row.original.laporan;
                return laporan?.file ? (
                    <a href={route('files.laporan', laporan.file.split('/').pop())}  // Update this line
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800"
                    >
                        Lihat Laporan
                    </a>
                ) : (
                    <span className="text-gray-400">Belum ada laporan</span>
                );
            }
        },
        {
            Header: "Keterangan",
            accessor: "laporan.keterangan",
            Cell: ({ row }) => row.original.laporan?.keterangan || 'Belum ada keterangan'
        }
    ], []);

    const modalFields = useMemo(() => [
        {
            name: "type",
            label: "Jenis Laporan",
            type: "select",
            options: [
                { value: "kkl", label: "KKL" },
                { value: "kkn", label: "KKN" }
            ],
            value: type
        },
        {
            name: "user_id",
            label: "Mahasiswa",
            type: "searchableSelect",
            options: mahasiswas,
            required: true
        },
        {
            name: "dosen_id",
            label: "Pembimbing",
            type: "searchableSelect",
            options: dosens,
            required: true
        },
        { name: "tanggal_mulai", label: "Tanggal Mulai", type: "date", required: true },
        { name: "tanggal_selesai", label: "Tanggal Selesai", type: "date", required: true },
        {
            name: "status",
            label: "Status",
            type: "select",
            options: [
                { value: "pending", label: "Pending" },
                { value: "completed", label: "Completed" },
                { value: "rejected", label: "Rejected" }
            ],
            required: true
        },
        {
            name: "file",
            label: "File Laporan (PDF)",
            type: "file",
            accept: ".pdf,.doc,.docx"
        },
        {
            name: "keterangan",
            label: "Keterangan Laporan",
            type: "textarea",
            rows: 3
        }
    ], [mahasiswas, dosens, type]);

    const pagination = useMemo(() => ({
        pageIndex: laporans.current_page - 1,
        pageCount: laporans.last_page,
        pageSize: laporans.per_page,
        total: laporans.total,
        from: laporans.from,
        to: laporans.to
    }), [laporans]);

    return (
        <div className="grid grid-cols-1 mb-8">
            <div className="flex flex-col gap-8">
                <TableHeader
                    title={title}
                    description={description}
                    onDownload={format => window.open(route(`admin.${type}.export`, { format }), '_blank')}
                    onAdd={tableActions.handleAdd}
                />

                <DataTable
                    columns={columns}
                    data={laporans.data || []}
                    actions={tableActions}
                    pagination={pagination}
                />

                <GenericModal
                    isOpen={modalState.isOpen}
                    onClose={handleModalClose}
                    title={`${modalState.editingData ? 'Edit' : 'Tambah'} ${title}`}
                    data={data}
                    setData={setData}
                    errors={errors}
                    processing={processing}
                    handleSubmit={handleSubmit}
                    clearErrors={clearErrors}
                    fields={modalFields}
                    onFileChange={handleFileChange}
                />
            </div>
        </div>
    );
}

BaseLaporanData.propTypes = {
    type: PropTypes.oneOf(['kkl', 'kkn']).isRequired,
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
    mahasiswas: PropTypes.arrayOf(PropTypes.shape({
        value: PropTypes.number.isRequired,
        label: PropTypes.string.isRequired,
    })).isRequired,
    dosens: PropTypes.arrayOf(PropTypes.shape({
        value: PropTypes.number.isRequired,
        label: PropTypes.string.isRequired,
    })).isRequired,
};
