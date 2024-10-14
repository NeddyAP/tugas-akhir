import React, { useState, useCallback, useMemo } from 'react';
import { Head, useForm } from "@inertiajs/react";
import Layout from "@/Layouts/Layout";
import TableSection from '@/Components/TableSection';
import LogbookModal from '@/Pages/Logbook/LogbookModal';
import BimbinganModal from '@/Pages/Logbook/BimbinganModal';
import createColumns from '@/utils/createColumns.jsx';

export default function Index({ logbooks, bimbingans }) {
    const [modalState, setModalState] = useState({
        logbook: { isOpen: false, editingData: null },
        bimbingan: { isOpen: false },
    });

    const { delete: destroyLogbook } = useForm();

    const createHandlers = useCallback((tableType) => ({
        handleEdit: (row) => {
            if (tableType === 'Logbook') {
                setModalState(prev => ({
                    ...prev,
                    logbook: { isOpen: true, editingData: row },
                }));
            } else {
                console.log(`Edit ${tableType}:`, row);
            }
        },
        handleDelete: (row) => {
            if (window.confirm(`Are you sure you want to delete this ${tableType.toLowerCase()} entry?`)) {
                if (tableType === 'Logbook') {
                    destroyLogbook(route('logbooks.destroy', row.id), {
                        preserveState: true,
                        preserveScroll: true,
                    });
                } else {
                    console.log(`Delete ${tableType}:`, row);
                }
            }
        },
        handleAdd: () => {
            setModalState(prev => ({
                ...prev,
                [tableType.toLowerCase()]: { isOpen: true, editingData: null },
            }));
        },
        handleDownload: () => {
            console.log(`Download ${tableType} table as Word document`);
            // Implement the actual download logic here
        },
    }), [destroyLogbook]);

    const logbookHandlers = useMemo(() => createHandlers('Logbook'), [createHandlers]);
    const bimbinganHandlers = useMemo(() => createHandlers('Bimbingan'), [createHandlers]);

    const createColumnsMemo = useMemo(() => createColumns, []);

    const logbookColumns = useMemo(() => createColumnsMemo(
        'Logbook Kegiatan',
        [
            { header: 'Tanggal Pelaksanaan', accessor: 'tanggal' },
            { header: 'Catatan Kegiatan', accessor: 'catatan' },
            { header: 'Keterangan Kegiatan', accessor: 'keterangan' },
        ],
        logbookHandlers.handleEdit,
        logbookHandlers.handleDelete
    ), [createColumnsMemo, logbookHandlers]);

    const bimbinganColumns = useMemo(() => createColumnsMemo(
        'Tabel Bimbingan KKL',
        [
            { header: 'Tanggal', accessor: 'tanggal' },
            { header: 'Keterangan Bimbingan', accessor: 'judul' },
            { header: 'Tanda Tangan Dosen Pembimbing', accessor: 'status' },
        ],
        bimbinganHandlers.handleEdit,
        bimbinganHandlers.handleDelete
    ), [createColumnsMemo, bimbinganHandlers]);

    const handleGuidanceSubmit = useCallback((event) => {
        event.preventDefault();
        console.log('Guidance form submitted');
        setModalState(prev => ({ ...prev, bimbingan: { isOpen: false } }));
    }, []);

    const closeModal = useCallback((modalType) => {
        setModalState(prev => ({
            ...prev,
            [modalType]: { isOpen: false, editingData: null },
        }));
    }, []);


    const [activeTab, setActiveTab] = useState('Logbook');

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    return (
        <Layout>
            <Head title="Logbook" />
            <div>
                <div className="flex justify-center mt-20">
                    <nav className="flex items-center p-1 space-x-1 overflow-x-auto text-sm text-gray-600 rtl:space-x-reverse bg-gray-500/5 rounded-xl dark:bg-gray-500/20">
                        <button
                            role="tab"
                            type="button"
                            className={`flex whitespace-nowrap items-center h-8 px-5 font-medium rounded-lg outline-none focus:ring-2 focus:ring-teal-600 focus:ring-inset ${activeTab === 'Logbook'
                                ? 'text-teal-600 shadow bg-white dark:text-white dark:bg-teal-600'
                                : 'hover:text-gray-800 focus:text-teal-600 dark:text-gray-400 dark:hover:text-gray-300 dark:focus:text-gray-400'
                                }`}
                            aria-selected={activeTab === 'Logbook'}
                            onClick={() => handleTabClick('Logbook')}
                        >
                            Logbook
                        </button>

                        <button
                            role="tab"
                            type="button"
                            className={`flex whitespace-nowrap items-center h-8 px-5 font-medium rounded-lg outline-none focus:ring-2 focus:ring-teal-600 focus:ring-inset ${activeTab === 'Bimbingan'
                                ? 'text-teal-600 shadow bg-white dark:text-white dark:bg-teal-600'
                                : 'hover:text-gray-800 focus:text-teal-600 dark:text-gray-400 dark:hover:text-gray-300 dark:focus:text-gray-400'
                                }`}
                            aria-selected={activeTab === 'Bimbingan'}
                            onClick={() => handleTabClick('Bimbingan')}
                        >
                            Bimbingan
                        </button>
                    </nav>
                </div>

                <div className="mt-4">
                    <div className="space-y-8 md:space-y-12">
                        {activeTab === 'Logbook' && (
                            <div>
                                <TableSection
                                    columns={logbookColumns}
                                    data={logbooks}
                                    onAdd={logbookHandlers.handleAdd}
                                    onDownload={logbookHandlers.handleDownload}
                                />
                                <LogbookModal
                                    isOpen={modalState.logbook.isOpen}
                                    onClose={() => closeModal('logbook')}
                                    initialData={modalState.logbook.editingData}
                                />
                            </div>
                        )}
                        {activeTab === 'Bimbingan' && (
                            <div>
                                <TableSection
                                    columns={bimbinganColumns}
                                    data={bimbingans}
                                    onAdd={bimbinganHandlers.handleAdd}
                                    onDownload={bimbinganHandlers.handleDownload}
                                />
                                <BimbinganModal
                                    isOpen={modalState.bimbingan.isOpen}
                                    onClose={() => closeModal('bimbingan')}
                                    onSubmit={handleGuidanceSubmit}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
}