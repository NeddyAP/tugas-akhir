import React, { useCallback, useMemo } from 'react';
import Layout from "@/Layouts/Layout";
import { Head } from "@inertiajs/react";
import { Edit, Trash2 } from 'lucide-react';
import Table from '@/Components/Table';

const ActionCell = React.memo(({ row, onEdit, onDelete }) => (
    <div className="flex space-x-2">
        <button
            onClick={() => onEdit(row.original)}
            className="p-2 text-white bg-blue-500 rounded hover:bg-blue-600"
        >
            <Edit className="w-4 h-4" />
        </button>
        <button
            onClick={() => onDelete(row.original)}
            className="p-2 text-white bg-red-500 rounded hover:bg-red-600"
        >
            <Trash2 className="w-4 h-4" />
        </button>
    </div>
));

export default function Index() {
    const handleEdit = useCallback((row) => {
        console.log('Edit:', row);
    }, []);

    const handleDelete = useCallback((row) => {
        if (window.confirm('Are you sure you want to delete this logbook entry?')) {
            console.log('Delete:', row);
        }
    }, []);

    const handleAdd = useCallback(() => {
        console.log('Add new logbook entry');
    }, []);

    const data = useMemo(() => [
        { no: 1, tanggal: '2023-10-01', catatan: 'Task 1', keterangan: 'Completed' },
        { no: 2, tanggal: '2023-10-02', catatan: 'Task 2', keterangan: 'Pending' },
    ], []);

    const columns = useMemo(() => [
        {
            Header: 'Logbook',
            columns: [
                { Header: 'No', accessor: 'no' },
                { Header: 'Tanggal Pelaksanaan', accessor: 'tanggal' },
                { Header: 'Catatan Kegiatan', accessor: 'catatan' },
                { Header: 'Keterangan Kegiatan', accessor: 'keterangan' },
                {
                    Header: 'Action',
                    accessor: 'action',
                    Cell: ({ row }) => (
                        <ActionCell row={row} onEdit={handleEdit} onDelete={handleDelete} />
                    ),
                },
            ],
        },
    ], [handleEdit, handleDelete]);

    return (
        <Layout>
            <Head title="Logbook" />
            <div className="container px-4 py-8 mx-auto my-5">
                <Table
                    columns={columns}
                    data={data}
                    onAdd={handleAdd}
                />
            </div>
        </Layout>
    );
}
