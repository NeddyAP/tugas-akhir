import { useCallback, useMemo, useState, useEffect } from "react";
import { useForm } from "@inertiajs/react";
import DataTable from "@/Components/ui/DataTable";
import GenericModal from "@/Components/ui/GenericModal";
import PropTypes from 'prop-types';
import 'react-toastify/dist/ReactToastify.css';

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

export default function Question({ informations }) {
    const { delete: destroy } = useForm();
    const [modalState, setModalState] = useState({ isOpen: false, editingData: null });
    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        question: "",
        answer: "",
        type: "question",
    });

    const TABLE_CONFIG = useMemo(() => ({
        columns: [
            { Header: "Pertanyaan", accessor: "question", sortable: true },
            { Header: "Jawaban", accessor: "answer", sortable: true },
            {
                Header: "Tanggal Dibuat", accessor: "created_at", sortable: true,
                Cell: ({ value }) => formatDate(value)
            },
        ],
        modalFields: [
            { name: "question", label: "Pertanyaan", type: "text" },
            { name: "answer", label: "Jawaban", type: "textarea", rows: 5 },
        ],
        defaultSort: "created_at"
    }), []);

    useEffect(() => {
        if (modalState.isOpen) {
            if (modalState.editingData) {
                setData({
                    question: modalState.editingData.question,
                    answer: modalState.editingData.answer,
                    type: 'question'
                });
            } else {
                reset();
                setData({ type: 'question' });
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
            if (window.confirm('Kamu yakin ingin menghapus FAQ ini?')) {
                destroy(route("admin.informations.destroy", row.id) + `?type=question`, {
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
            put(route('admin.informations.update', modalState.editingData.id), {
                ...data,
                preserveScroll: true,
                onSuccess: () => {
                    setModalState({ isOpen: false, editingData: null });
                    clearErrors();
                },
            });
        } else {
            post(route('admin.informations.store'), {
                ...data,
                onSuccess: () => {
                    setModalState({ isOpen: false, editingData: null });
                    clearErrors();
                },
            });
        }
    }, [modalState.editingData, data, put, post, clearErrors]);

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
                            Frequently Asked Questions
                        </h2>
                        <i className="text-sm text-gray-400">
                            Pertanyaan yang sering ditanyakan
                        </i>
                    </div>
                    <button
                        type="button"
                        onClick={tableActions.handleAdd}
                        className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-teal-600 border border-transparent rounded-md shadow-sm hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
                    >
                        Tambah FAQ
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
                    title={`${modalState.editingData ? 'Edit' : 'Tambah'} FAQ`}
                    data={data}
                    setData={setData}
                    errors={errors}
                    processing={processing}
                    handleSubmit={handleSubmit}
                    clearErrors={clearErrors}
                    fields={TABLE_CONFIG.modalFields}
                />
            </div>
        </div>
    );
}

Question.propTypes = {
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
