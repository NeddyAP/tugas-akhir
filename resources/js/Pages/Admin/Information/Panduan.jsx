import React, { useCallback, useMemo, useState, useEffect } from "react";
import { useForm } from "@inertiajs/react";
import DataTable from "@/Components/ui/DataTable";
import GenericModal from "@/Components/ui/GenericModal";
import PropTypes from 'prop-types';

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

export default function Panduan({ informations }) {
    const { delete: destroy } = useForm();
    const [modalState, setModalState] = useState({ isOpen: false, editingData: null });
    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        title: "",
        description: "",
        file: null,
        type: "panduan",
    });

    const TABLE_CONFIG = useMemo(() => ({
        columns: [
            { Header: "Judul", accessor: "title", sortable: true },
            { Header: "Deskripsi", accessor: "description", sortable: true },
            {
                Header: "File",
                accessor: "file",
                Cell: ({ value }) => (
                    <a
                        href={`/storage/${value}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800"
                    >
                        Lihat PDF
                    </a>
                )
            },
            {
                Header: "Tanggal Dibuat",
                accessor: "created_at",
                sortable: true,
                Cell: ({ value }) => formatDate(value)
            },
        ],
        modalFields: [
            { name: "title", label: "Judul", type: "text" },
            { name: "description", label: "Deskripsi", type: "textarea", rows: 3 },
            {
                name: "file",
                label: "File PDF (maks. 5MB)",
                type: "file",
                accept: ".pdf",
                required: !modalState.editingData
            },
        ],
        defaultSort: "created_at"
    }), [modalState.editingData]);

    useEffect(() => {
        if (modalState.isOpen) {
            if (modalState.editingData) {
                setData({
                    title: modalState.editingData.title,
                    description: modalState.editingData.description,
                    type: "panduan"
                });
            } else {
                reset();
            }
        } else {
            reset();
            clearErrors();
        }
    }, [modalState.isOpen, modalState.editingData]);

    const handleModalClose = useCallback(() => {
        setModalState({ isOpen: false, editingData: null });
    }, []);

    const tableActions = useMemo(() => ({
        handleEdit: (row) => setModalState({ isOpen: true, editingData: row }),
        handleDelete: (row) => {
            if (window.confirm('Apakah Anda yakin ingin menghapus panduan ini?')) {
                destroy(route("admin.informations.destroy", row.id) + `?type=panduan`, {
                    preserveScroll: true,
                    preserveState: true
                });
            }
        },
        handleAdd: () => setModalState({ isOpen: true, editingData: null }),
    }), [destroy]);

    const handleSubmit = useCallback((e) => {
        e.preventDefault();

        if (modalState.editingData) {
            const formData = new FormData();
            formData.append('title', data.title);
            formData.append('description', data.description);
            formData.append('type', 'panduan');
            if (data.file) {
                formData.append('file', data.file);
            }

            put(route('admin.informations.update', modalState.editingData.id), formData, {
                forceFormData: true,
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => {
                    handleModalClose();
                    reset();
                },
            });
        } else {
            const formData = new FormData();
            formData.append('title', data.title);
            formData.append('description', data.description);
            formData.append('type', 'panduan');
            formData.append('file', data.file);

            post(route('admin.informations.store'), formData, {
                forceFormData: true,
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => {
                    handleModalClose();
                    reset();
                },
            });
        }
    }, [modalState.editingData, data, put, post, reset, handleModalClose]);

    const handleFileChange = useCallback((e) => {
        const file = e.target.files[0];
        if (file && file.type === 'application/pdf') {
            setData('file', file);
        } else {
            alert('Mohon upload file PDF');
            e.target.value = '';
        }
    }, [setData]);

    const pagination = useMemo(() => ({
        pageIndex: informations.current_page - 1,
        pageCount: informations.last_page,
        pageSize: informations.per_page,
        total: informations.total,
        from: informations.from,
        to: informations.to
    }), [informations]);

    return (
        <div className="grid grid-cols-1 mb-8">
            <div className="flex flex-col gap-8">
                <header className="flex items-center justify-between">
                    <div className="flex flex-col">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-200">
                            Panduan
                        </h2>
                        <p className="text-sm text-gray-500">
                            Kelola dokumen panduan dalam format PDF
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={tableActions.handleAdd}
                        className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-teal-600 border border-transparent rounded-md shadow-sm hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
                    >
                        Tambah Panduan
                    </button>
                </header>

                <DataTable
                    columns={TABLE_CONFIG.columns}
                    data={informations.data || []}
                    actions={tableActions}
                    defaultSortBy={TABLE_CONFIG.defaultSort}
                    pagination={pagination}
                />

                <GenericModal
                    isOpen={modalState.isOpen}
                    onClose={handleModalClose}
                    title={`${modalState.editingData ? 'Edit' : 'Tambah'} Panduan`}
                    data={data}
                    setData={setData}
                    errors={errors}
                    processing={processing}
                    handleSubmit={handleSubmit}
                    clearErrors={clearErrors}
                    fields={TABLE_CONFIG.modalFields}
                    onFileChange={handleFileChange}
                />
            </div>
        </div>
    );
}

Panduan.propTypes = {
    informations: PropTypes.shape({
        data: PropTypes.array.isRequired,
        current_page: PropTypes.number.isRequired,
        last_page: PropTypes.number.isRequired,
        per_page: PropTypes.number.isRequired,
        total: PropTypes.number.isRequired,
        from: PropTypes.number,
        to: PropTypes.number,
    }).isRequired,
};
