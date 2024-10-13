import React, { useMemo } from 'react';
import Layout from "@/Layouts/Layout";
import { Head } from "@inertiajs/react";
import { Edit, Trash2 } from 'lucide-react';
import Table from '@/Components/Table';

// Action Handlers
const handleEdit = (row) => {
    // Handle edit action
    console.log('Edit:', row);
};

const handleDelete = (row) => {
    if (window.confirm('Are you sure you want to delete this logbook entry?')) {
        // Handle delete action
        console.log('Delete:', row);
    }
};

const handleAdd = () => {
    // Handle add action
    console.log('Add new logbook entry');
};

export default function Index() {
    // Sample data
    const data = useMemo(() => [
        { no: 1, tanggal: '2023-10-01', catatan: 'Task 1', keterangan: 'Completed' },
        { no: 2, tanggal: '2023-10-02', catatan: 'Task 2', keterangan: 'Pending' },
        // Add more data as needed
    ], []);

    // Define columns
    const columns = useMemo(() => [
        {
            Header: 'Logbook',
            columns: [
                {
                    Header: 'No',
                    accessor: 'no',
                },
                {
                    Header: 'Tanggal Pelaksanaan',
                    accessor: 'tanggal',
                },
                {
                    Header: 'Catatan Kegiatan',
                    accessor: 'catatan',
                },
                {
                    Header: 'Keterangan Kegiatan',
                    accessor: 'keterangan',
                },
                {
                    Header: 'Action',
                    accessor: 'action',
                    Cell: ({ row }) => (
                        <div className="flex space-x-2">
                            <button
                                onClick={() => handleEdit(row.original)}
                                className="p-2 text-white bg-blue-500 rounded hover:bg-blue-600"
                            >
                                <Edit className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => handleDelete(row.original)}
                                className="p-2 text-white bg-red-500 rounded hover:bg-red-600"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    ),
                },
            ],
        },
    ], []);

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