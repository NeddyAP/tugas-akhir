import React, { useState, useCallback, useMemo } from 'react';
import Layout from "@/Layouts/Layout";
import { Head, useForm } from "@inertiajs/react";
import TableSection from '@/Components/TableSection';
import LogbookModal from '@/Components/LogbookModal';
import BimbinganModal from '@/Components/BimbinganModal';
import createColumns from '@/utils/createColumns.jsx';

export default function Index({ logbooks, bimbingans }) {
    const [isLogbookModalOpen, setIsLogbookModalOpen] = useState(false);
    const [isBimbinganModalOpen, setIsBimbinganModalOpen] = useState(false);
    const [editingLogbook, setEditingLogbook] = useState(null);

    const { delete: destroyLogbook } = useForm();

    const createHandlers = (tableType) => ({
        handleEdit: useCallback((row) => {
            if (tableType === 'Logbook') {
                setEditingLogbook(row);
                setIsLogbookModalOpen(true);
            } else {
                console.log(`Edit ${tableType}:`, row);
            }
        }, [tableType]),
        handleDelete: useCallback((row) => {
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
        }, [tableType, destroyLogbook]),
        handleAdd: useCallback(() => {
            if (tableType === 'Logbook') {
                setEditingLogbook(null);
                setIsLogbookModalOpen(true);
            } else if (tableType === 'Bimbingan') {
                setIsBimbinganModalOpen(true);
            }
        }, [tableType]),
        handleDownload: useCallback(() => {
            console.log(`Download ${tableType} table as Word document`);
            // Implement the actual download logic here

        }, [tableType]),
    });

    const logbookHandlers = createHandlers('Logbook');
    const bimbinganHandlers = createHandlers('Bimbingan');

    const logbookColumns = useMemo(() => createColumns(
        'Logbook Kegiatan',
        [
            { header: 'Tanggal Pelaksanaan', accessor: 'tanggal' },
            { header: 'Catatan Kegiatan', accessor: 'catatan' },
            { header: 'Keterangan Kegiatan', accessor: 'keterangan' },
        ],
        logbookHandlers.handleEdit,
        logbookHandlers.handleDelete
    ), [logbookHandlers]);

    const bimbinganColumns = useMemo(() => createColumns(
        'Tabel Bimbingan KKL',
        [
            { header: 'Tanggal', accessor: 'tanggal' },
            { header: 'Keterangan Bimbingan', accessor: 'judul' },
            { header: 'Tanda Tangan Dosen Pembimbing', accessor: 'status' },
        ],
        bimbinganHandlers.handleEdit,
        bimbinganHandlers.handleDelete
    ), [bimbinganHandlers]);

    const handleGuidanceSubmit = (event) => {
        event.preventDefault();
        console.log('Guidance form submitted');
        setIsBimbinganModalOpen(false);
    };

    return (
        <Layout>
            <Head title="Logbook" />
            <div className="space-y-8 md:space-y-12">
                <TableSection
                    columns={logbookColumns}
                    data={logbooks}
                    onAdd={logbookHandlers.handleAdd}
                    onDownload={logbookHandlers.handleDownload}
                />
                <TableSection
                    columns={bimbinganColumns}
                    data={bimbingans}
                    onAdd={bimbinganHandlers.handleAdd}
                    onDownload={bimbinganHandlers.handleDownload}
                />
            </div>
            <LogbookModal
                isOpen={isLogbookModalOpen}
                onClose={() => {
                    setIsLogbookModalOpen(false);
                    setEditingLogbook(null);
                }}
                initialData={editingLogbook}
            />
            <BimbinganModal
                isOpen={isBimbinganModalOpen}
                onClose={() => setIsBimbinganModalOpen(false)}
                onSubmit={handleGuidanceSubmit}
            />
        </Layout>
    );
}