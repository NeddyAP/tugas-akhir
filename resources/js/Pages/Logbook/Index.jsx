import React, { useState, useMemo } from 'react';
import Layout from "@/Layouts/Layout";
import { Head } from "@inertiajs/react";
import { useTable, useSortBy, useGlobalFilter } from 'react-table';
import { Search, Edit, Trash2 } from 'lucide-react';

// Sample data
const data = [
    { no: 1, tanggal: '2023-10-01', catatan: 'Task 1', keterangan: 'Completed' },
    { no: 2, tanggal: '2023-10-02', catatan: 'Task 2', keterangan: 'Pending' },
    // Add more data as needed
];

// Define columns
const columns = [
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
];

// Global filter component
const GlobalFilter = ({ globalFilter, setGlobalFilter }) => (
    <div className="relative">
        <input
            value={globalFilter || ''}
            onChange={e => setGlobalFilter(e.target.value || undefined)}
            placeholder="Cari..."
            className="w-full px-4 py-2 pl-10 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <Search className="absolute top-2.5 left-3 h-5 w-5 text-gray-400" />
    </div>
);

export default function Index() {
    const tableInstance = useTable(
        {
            columns: useMemo(() => columns, []),
            data: useMemo(() => data, []),
        },
        useGlobalFilter,
        useSortBy
    );

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
        state,
        setGlobalFilter,
    } = tableInstance;

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

    return (
        <Layout>
            <Head title="Logbook" />
            <div className="container px-4 py-8 mx-auto my-5">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-semibold">Logbook</h1>
                    <div className="flex space-x-4">
                        <div className="w-64">
                            <GlobalFilter
                                globalFilter={state.globalFilter}
                                setGlobalFilter={setGlobalFilter}
                            />
                        </div>
                        <button className="px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600">
                            Tambah
                        </button>
                    </div>
                </div>
                <div className="overflow-x-auto bg-white rounded-lg shadow-md">
                    <table {...getTableProps()} className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            {headerGroups.map(headerGroup => (
                                <tr {...headerGroup.getHeaderGroupProps()}>
                                    {headerGroup.headers.map(column => (
                                        <th
                                            {...column.getHeaderProps(column.getSortByToggleProps())}
                                            className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase cursor-pointer"
                                        >
                                            <div className="flex items-center">
                                                {column.render('Header')}
                                                <span className="ml-2">
                                                    {column.isSorted
                                                        ? column.isSortedDesc
                                                            ? '▼'
                                                            : '▲'
                                                        : ''}
                                                </span>
                                            </div>
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody {...getTableBodyProps()} className="bg-white divide-y divide-gray-200">
                            {rows.map(row => {
                                prepareRow(row);
                                return (
                                    <tr {...row.getRowProps()} className="hover:bg-gray-50">
                                        {row.cells.map(cell => (
                                            <td
                                                {...cell.getCellProps()}
                                                className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap"
                                            >
                                                {cell.render('Cell')}
                                            </td>
                                        ))}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </Layout>
    );
}