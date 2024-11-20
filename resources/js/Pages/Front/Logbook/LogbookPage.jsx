import React, { useState, useCallback, useMemo, memo } from 'react';
import { Head, useForm } from "@inertiajs/react";
import FrontLayout from "@/Layouts/FrontLayout";
import DataTable from "@/Components/DataTable";
import GenericModal from "@/Components/GenericModal";

const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });
};

// Add Header component at the top level
const Header = memo(({ title, onDownload, onAdd }) => (
    <header className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-200">{title}</h2>
        <div className="flex gap-2">
            <button
                type="button"
                onClick={onDownload}
                className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
            >
                Download
            </button>
            <button
                type="button"
                onClick={onAdd}
                className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-teal-600 border border-transparent rounded-md shadow-sm hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
            >
                Tambah Baru
            </button>
        </div>
    </header>
));

export default function Index({ logbooks, bimbingans }) {
    const [activeTab, setActiveTab] = useState('Logbook');
    const [modalState, setModalState] = useState({
        isOpen: false,
        type: null,
        editingData: null
    });

    const logbookForm = useForm({
        tanggal: '',
        catatan: '',
        keterangan: '',
    });

    const bimbinganForm = useForm({
        tanggal: '',
        keterangan: '',
    });

    const handleSubmit = useCallback((e) => {
        e.preventDefault();
        const isLogbook = modalState.type === 'Logbook';
        const form = isLogbook ? logbookForm : bimbinganForm;
        const route = isLogbook ? 'logbooks.store' : 'bimbingans.store';

        form.post(route(route), {
            onSuccess: () => {
                setModalState({ isOpen: false, type: null, editingData: null });
            },
        });
    }, [modalState.type, logbookForm, bimbinganForm]);

    const tableConfigs = useMemo(() => ({
        Logbook: {
            columns: [
                { Header: 'Tanggal Pelaksanaan', accessor: 'tanggal', Cell: ({ value }) => formatDate(value) },
                { Header: 'Catatan Kegiatan', accessor: 'catatan' },
                { Header: 'Keterangan Kegiatan', accessor: 'keterangan' },
            ],
            modalFields: [
                { name: 'tanggal', label: 'Tanggal', type: 'date', required: true },
                { name: 'catatan', label: 'Catatan Kegiatan', type: 'textarea', required: true },
                { name: 'keterangan', label: 'Keterangan Kegiatan', type: 'textarea', required: true },
            ],
            data: logbooks.data || [], // Ensure we access the data property
            pagination: logbooks, // Add pagination object
        },
        Bimbingan: {
            columns: [
                { Header: 'Tanggal Bimbingan', accessor: 'tanggal', Cell: ({ value }) => formatDate(value) },
                { Header: 'Keterangan Bimbingan', accessor: 'keterangan' },
                { Header: 'Tanda Tangan Dosen Pembimbing', accessor: 'status' },
            ],
            modalFields: [
                { name: 'tanggal', label: 'Tanggal Bimbingan', type: 'date', required: true },
                { name: 'keterangan', label: 'Keterangan Bimbingan', type: 'textarea', required: true },
            ],
            data: bimbingans.data || [], // Ensure we access the data property
            pagination: bimbingans, // Add pagination object
        }
    }), [logbooks, bimbingans]);

    const handleAdd = useCallback((type) => {
        setModalState({ isOpen: true, type, editingData: null });
        const form = type === 'Logbook' ? logbookForm : bimbinganForm;
        form.reset();
    }, [logbookForm, bimbinganForm]);

    const handleDownload = useCallback((type) => {
        console.log(`Downloading ${type} as Word document`);
    }, []);

    return (
        <FrontLayout>
            <Head title="Logbook" />
            <div>
                <div className="px-32 mt-20">
                    <div className="grid grid-cols-1 mb-8">
                        <div className="flex flex-col gap-8">
                            {/* Add justify-center to center the nav element */}
                            <div className="flex justify-center">
                                <nav className="flex items-center p-1 space-x-1 overflow-x-auto text-sm text-gray-600 rtl:space-x-reverse bg-gray-500/5 rounded-xl dark:bg-gray-500/20">
                                    {['Logbook', 'Bimbingan'].map((tab) => (
                                        <button
                                            key={tab}
                                            role="tab"
                                            type="button"
                                            className={`flex whitespace-nowrap items-center h-8 px-5 font-medium rounded-lg outline-none focus:ring-2 focus:ring-teal-600 focus:ring-inset ${activeTab === tab
                                                ? 'text-teal-600 shadow bg-white dark:text-white dark:bg-teal-600'
                                                : 'hover:text-gray-800 focus:text-teal-600 dark:text-gray-400 dark:hover:text-gray-300 dark:focus:text-gray-400'
                                                }`}
                                            onClick={() => setActiveTab(tab)}
                                        >
                                            {tab}
                                        </button>
                                    ))}
                                </nav>
                            </div>

                            <Header
                                title={`${activeTab} Mahasiswa`}
                                onDownload={() => handleDownload(activeTab)}
                                onAdd={() => handleAdd(activeTab)}
                            />

                            <DataTable
                                columns={tableConfigs[activeTab].columns}
                                data={tableConfigs[activeTab].data}
                                pagination={{
                                    pageIndex: tableConfigs[activeTab].pagination.current_page - 1,
                                    pageCount: tableConfigs[activeTab].pagination.last_page,
                                    pageSize: tableConfigs[activeTab].pagination.per_page,
                                    total: tableConfigs[activeTab].pagination.total,
                                    from: tableConfigs[activeTab].pagination.from,
                                    to: tableConfigs[activeTab].pagination.to
                                }}
                                actions={{
                                    handleAdd: () => handleAdd(activeTab),
                                    handleDownload: () => handleDownload(activeTab),
                                }}
                            />

                            <GenericModal
                                isOpen={modalState.isOpen}
                                onClose={() => setModalState({ isOpen: false, type: null, editingData: null })}
                                title={`${modalState.editingData ? 'Edit' : 'Tambah'} ${modalState.type}`}
                                data={modalState.type === 'Logbook' ? logbookForm.data : bimbinganForm.data}
                                setData={modalState.type === 'Logbook' ? logbookForm.setData : bimbinganForm.setData}
                                errors={modalState.type === 'Logbook' ? logbookForm.errors : bimbinganForm.errors}
                                processing={modalState.type === 'Logbook' ? logbookForm.processing : bimbinganForm.processing}
                                handleSubmit={handleSubmit}
                                clearErrors={modalState.type === 'Logbook' ? logbookForm.clearErrors : bimbinganForm.clearErrors}
                                fields={modalState.type === 'Logbook' ? tableConfigs.Logbook.modalFields : tableConfigs.Bimbingan.modalFields}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </FrontLayout>
    );
}