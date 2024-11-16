import React, { useState } from 'react';
import DataTable from "@/Components/Admin/DataTable";
import AdminLayout from "@/Layouts/AdminLayout";
import { useForm } from '@inertiajs/react';
import GenericModal from '@/Components/Admin/GenericModal';

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

export default function BimbinganPage({ bimbingans }) {
    const [modalState, setModalState] = useState({ isOpen: false, editingData: null });

    const { data, setData, delete: destroy, post, put, processing, errors, clearErrors } = useForm({
        tanggal: '',
        keterangan: '',
        status: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (modalState.editingData) {
            put(route('admin.bimbingans.update', modalState.editingData.id), {
                preserveScroll: true,
                onSuccess: () => {
                    setModalState({ isOpen: false, editingData: null });
                    clearErrors();
                },
            });
        } else {
            post(route('admin.bimbingans.store'), {
                onSuccess: () => setModalState({ isOpen: false, editingData: null }),
            });
        }
    };

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
            setData({
                tanggal: modalState.editingData.tanggal || '',
                keterangan: modalState.editingData.keterangan || '',
                status: modalState.editingData.status || 'pending',
            });
        } else {
            setData({
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
        handleDelete: (row) => {
            if (window.confirm('Are you sure you want to delete this record?')) {
                destroy(route('admin.bimbingans.destroy', row.id));
            }
        },
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
            Cell: ({ value }) => {
                const status = value || 'pending';
                return (
                    <span className={`px-2 py-1 rounded-full text-sm ${status === 'approved' ? 'bg-green-100 text-green-800' :
                        status === 'rejected' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                        }`}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                    </span>
                );
            }
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
                    <header className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-gray-900">Bimbingan Mahasiswa</h2>
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={tableActions.handleDownload}
                                className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            >
                                Download
                            </button>
                            <button
                                type="button"
                                onClick={tableActions.handleAdd}
                                className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            >
                                Tambah Baru
                            </button>
                        </div>
                    </header>

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
                            clearErrors();
                        }}
                        title={`${modalState.editingData ? 'Edit' : 'Tambah'} Data Bimbingan`}
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
}
