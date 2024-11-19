import React, { useState, useCallback, memo } from 'react';
import DataTable from "@/Components/Admin/DataTable";
import AdminLayout from "@/Layouts/AdminLayout";
import { useForm } from '@inertiajs/react';
import GenericModal from '@/Components/Admin/GenericModal';
import { toast } from 'react-toastify';

const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

// Memoized Header Component (same as LogbookPage)
const Header = memo(({ onDownload, onAdd }) => (
    <header className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Bimbingan Mahasiswa</h2>
        <div className="flex gap-2">
            <button
                type="button"
                onClick={onDownload}
                className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
                Download
            </button>
            <button
                type="button"
                onClick={onAdd}
                className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
                Tambah Baru
            </button>
        </div>
    </header>
));

// Memoized Status Badge Component
const StatusBadge = memo(({ status = 'pending' }) => {
    const styles = {
        approved: 'bg-green-100 text-green-800',
        rejected: 'bg-red-100 text-red-800',
        pending: 'bg-yellow-100 text-yellow-800'
    };

    const statusText = String(status || 'pending');
    const formattedStatus = statusText.charAt(0).toUpperCase() + statusText.slice(1);

    return (
        <span className={`px-2 py-1 rounded-full text-sm ${styles[statusText]}`}>
            {formattedStatus}
        </span>
    );
});

StatusBadge.displayName = 'StatusBadge';

const BimbinganPage = ({ bimbingans }) => {
    const [modalState, setModalState] = useState({ isOpen: false, editingData: null });
    const form = useForm({
        tanggal: '',
        keterangan: '',
        status: 'pending',
    });

    const handleSubmit = useCallback((e) => {
        e.preventDefault();
        const isEditing = modalState.editingData;

        form[isEditing ? 'put' : 'post'](
            route(`admin.bimbingans.${isEditing ? 'update' : 'store'}`, isEditing?.id), {
            onSuccess: () => {
                setModalState({ isOpen: false, editingData: null });
                toast.success(`Bimbingan berhasil ${isEditing ? 'diperbarui' : 'ditambahkan'}`);
            },
            onError: () => {
                toast.error(`Gagal ${isEditing ? 'memperbarui' : 'menambahkan'} bimbingan`);
            }
        }
        );
    }, [modalState.editingData, form]);

    const handleDelete = useCallback((row) => {
        if (window.confirm('Yakin ingin menghapus data bimbingan ini?')) {
            form.delete(route('admin.bimbingans.destroy', row.id), {
                onSuccess: () => toast.success('Bimbingan berhasil dihapus'),
                onError: () => toast.error('Gagal menghapus bimbingan')
            });
        }
    }, [form]);

    const modalFields = [
        {
            name: 'tanggal',
            label: 'Tanggal',
            type: 'date',
            required: true,
        },
        {
            name: 'keterangan',
            label: 'Keterangan',
            type: 'textarea',
            required: true,
        },
        {
            name: 'status',
            label: 'Status',
            type: 'select',
            required: true,
            options: [
                { value: 'pending', label: 'Pending' },
                { value: 'approved', label: 'Approved' },
                { value: 'rejected', label: 'Rejected' },
            ]
        },
    ];

    React.useEffect(() => {
        if (modalState.editingData) {
            form.setData({
                tanggal: modalState.editingData.tanggal || '',
                keterangan: modalState.editingData.keterangan || '',
                status: modalState.editingData.status || 'pending',
            });
        } else {
            form.setData({
                tanggal: '',
                keterangan: '',
                status: 'pending',
            });
        }
    }, [modalState.editingData]);

    const tableActions = {
        handleEdit: (row) => {
            setModalState({ isOpen: true, editingData: row });
        },
        handleDelete,
        handleAdd: () => {
            setModalState({ isOpen: true, editingData: null });
        },
        handleDownload: () => {
            // Implement download functionality
        }
    };

    const columns = [
        { Header: 'Nama Mahasiswa', accessor: 'user.name', sortable: true },
        { Header: 'Tanggal', accessor: 'tanggal', sortable: true },
        { Header: 'Keterangan', accessor: 'keterangan', sortable: true },
        {
            Header: 'Status',
            accessor: 'status',
            sortable: true,
            Cell: ({ value }) => <StatusBadge status={value} />
        },
        {
            Header: 'Created at',
            accessor: 'created_at',
            sortable: true,
            Cell: ({ value }) => formatDate(value)
        },
        {
            Header: 'Updated at',
            accessor: 'updated_at',
            sortable: true,
            Cell: ({ value }) => formatDate(value)
        },
    ];

    return (
        <AdminLayout title="Bimbingan Management" currentPage="Bimbingan">
            <div className="grid grid-cols-1 mb-8">
                <div className="flex flex-col gap-8">
                    <Header onDownload={tableActions.handleDownload} onAdd={tableActions.handleAdd} />

                    <DataTable
                        columns={columns}
                        data={bimbingans.data}
                        actions={tableActions}
                        defaultSortBy="tanggal"
                        pagination={{
                            pageIndex: bimbingans.current_page - 1,
                            pageCount: bimbingans.last_page,
                            pageSize: bimbingans.per_page,
                            total: bimbingans.total,
                            from: bimbingans.from,
                            to: bimbingans.to
                        }}
                    />

                    <GenericModal
                        isOpen={modalState.isOpen}
                        onClose={() => {
                            setModalState({ isOpen: false, editingData: null });
                            form.clearErrors();
                        }}
                        title={`${modalState.editingData ? 'Edit' : 'Tambah'} Data Bimbingan`}
                        data={form.data}
                        setData={form.setData}
                        errors={form.errors}
                        processing={form.processing}
                        handleSubmit={handleSubmit}
                        clearErrors={form.clearErrors}
                        fields={modalFields}
                    />
                </div>
            </div>
        </AdminLayout>
    );
};

export default memo(BimbinganPage);
