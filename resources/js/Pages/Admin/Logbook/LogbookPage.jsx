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

export default function LogbookPage({ logbooks }) {
    const [modalState, setModalState] = useState({ isOpen: false, editingData: null });

    const { data, setData, delete: destroy, post, put, processing, errors, clearErrors } = useForm({
        tanggal: '',
        catatan: '',
        keterangan: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (modalState.editingData) {
            put(route('admin.logbooks.update', modalState.editingData.id), {
                onSuccess: () => setModalState({ isOpen: false, editingData: null }),
            });
        } else {
            post(route('admin.logbooks.store'), {
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
            name: 'catatan',
            label: 'Catatan',
            type: 'textarea',
            required: true,
        },
        {
            name: 'keterangan',
            label: 'Keterangan',
            type: 'text',
            required: true,
        },
    ];

    // Update form data when editing
    React.useEffect(() => {
        if (modalState.editingData) {
            setData({
                tanggal: modalState.editingData.tanggal,
                catatan: modalState.editingData.catatan,
                keterangan: modalState.editingData.keterangan,
            });
        } else {
            setData({
                tanggal: '',
                catatan: '',
                keterangan: '',
            });
        }
    }, [modalState.editingData]);

    const tableActions = {
        handleEdit: (row) => {
            setModalState({ isOpen: true, editingData: row });
        },
        handleDelete: (row) => {
            if (window.confirm('Are you sure you want to delete this record?')) {
                destroy(route('admin.logbooks.destroy', row.id));
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
        { Header: 'Catatan', accessor: 'catatan', sortable: true },
        { Header: 'Keterangan', accessor: 'keterangan', sortable: true },
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
        <AdminLayout title="Logbook Management" currentPage="Logbook">
            <div className="grid grid-cols-1 mb-8">
                <div className="flex flex-col gap-8">
                    <header className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-gray-900">Daftar Logbook Mahasiswa</h2>
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
                        data={logbooks.data}
                        actions={tableActions}
                        defaultSortBy="tanggal"
                        pagination={{
                            pageIndex: logbooks.current_page - 1,
                            pageCount: logbooks.last_page,
                            pageSize: logbooks.per_page,
                            total: logbooks.total,
                            from: logbooks.from,
                            to: logbooks.to
                        }}
                    />

                    <GenericModal
                        isOpen={modalState.isOpen}
                        onClose={() => {
                            setModalState({ isOpen: false, editingData: null });
                            clearErrors();
                        }}
                        title={`${modalState.editingData ? 'Edit' : 'Tambah'} Data Logbook`}
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