import { useCallback, useMemo, useState, useEffect } from "react";
import { useForm, usePage } from "@inertiajs/react";
import { toast } from 'react-toastify';
import AdminLayout from "@/Layouts/AdminLayout";
import DataTable from "@/Components/Admin/DataTable";
import GenericModal from "@/Components/Admin/GenericModal";
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

const TABLE_CONFIG = {
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
};

const INITIAL_FORM_STATE = {
    question: "",
    answer: "",
};

export default function InformationPage({ informations }) {
    const { delete: destroyData } = useForm();
    const { flash } = usePage().props;
    const [modalState, setModalState] = useState({ isOpen: false, editingData: null });

    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm(INITIAL_FORM_STATE);

    useEffect(() => {
        if (modalState.isOpen) {
            if (modalState.editingData) {
                setData({
                    question: modalState.editingData.question,
                    answer: modalState.editingData.answer,
                });
            } else {
                reset();
            }
        } else {
            reset();
            clearErrors();
        }
    }, [modalState.isOpen, modalState.editingData]);

    useEffect(() => {
        if (flash.message) {
            toast[flash.type](flash.message);
        }
    }, [flash]);

    const handleModalClose = useCallback(() => {
        setModalState({ isOpen: false, editingData: null });
    }, []);

    const tableActions = useMemo(() => ({
        handleEdit: (row) => setModalState({ isOpen: true, editingData: row }),
        handleDelete: (row) => {
            if (window.confirm('Kamu yakin ingin menghapus informasi ini?')) {
                destroyData(route("admin.informations.destroy", row.id), {
                    preserveState: true,
                    preserveScroll: true
                });
            }
        },
        handleAdd: () => setModalState({ isOpen: true, editingData: null }),
    }), [destroyData]);

    const handleSubmit = useCallback((e) => {
        e.preventDefault();

        const isEditing = !!modalState.editingData;
        const routeName = isEditing ? 'admin.informations.update' : 'admin.informations.store';
        const routeParams = isEditing ? modalState.editingData.id : undefined;
        const action = isEditing ? put : post;

        action(route(routeName, routeParams), {
            preserveState: true,
            onSuccess: handleModalClose,
        });
    }, [modalState.editingData, post, put]);

    const pagination = useMemo(() => ({
        pageIndex: informations.current_page - 1,
        pageCount: informations.last_page,
        pageSize: informations.per_page,
        total: informations.total,
        from: informations.from,
        to: informations.to
    }), [informations]);

    return (
        <AdminLayout title="FAQ Management" currentPage="FAQ > Table">
            <div className="grid grid-cols-1 mb-8">
                <div className="flex flex-col gap-8">
                    <header className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-gray-900">Data FAQ</h2>
                        <button
                            type="button"
                            onClick={tableActions.handleAdd}
                            className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
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
        </AdminLayout>
    );
}

InformationPage.propTypes = {
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
