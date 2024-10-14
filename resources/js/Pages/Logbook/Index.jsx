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

    return (
        <Layout>
            <Head title="Logbook" />
            <div className="space-y-8 md:space-y-12">
                <TableSection
                    columns={logbookColumns}
                    data={logbooks}
                    onAdd={logbookHandlers.handleAdd}
                    onDownload={logbookHandlers.handleDownload}
                    title="Logbook Kegiatan"
                />
                <TableSection
                    columns={bimbinganColumns}
                    data={bimbingans}
                    onAdd={bimbinganHandlers.handleAdd}
                    onDownload={bimbinganHandlers.handleDownload}
                    title="Tabel Bimbingan KKL"
                />
            </div>
            <LogbookModal
                isOpen={modalState.logbook.isOpen}
                onClose={() => closeModal('logbook')}
                initialData={modalState.logbook.editingData}
            />
            <BimbinganModal
                isOpen={modalState.bimbingan.isOpen}
                onClose={() => closeModal('bimbingan')}
                onSubmit={handleGuidanceSubmit}
            />
        </Layout>
    );
}