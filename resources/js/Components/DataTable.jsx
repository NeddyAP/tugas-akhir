import { useState, useMemo } from 'react';
import { useTable, useSortBy, useGlobalFilter, usePagination } from 'react-table';
import { ChevronUp, ChevronDown, Search, ChevronLeft, ChevronRight } from 'lucide-react';

export default function DataTable({ columns: userColumns, data, actions }) {
    const [globalFilter, setGlobalFilter] = useState('');

    // Add action column if actions are provided
    const columns = useMemo(() => {
        const cols = [...userColumns];
        if (actions) {
            cols.push({
                Header: 'Actions',
                id: 'actions',
                Cell: ({ row }) => (
                    <div className="flex gap-2">
                        <button
                            onClick={() => actions.handleEdit(row.original)}
                            className="p-1 text-blue-600 hover:text-blue-800"
                        >
                            Edit
                        </button>
                        <button
                            onClick={() => actions.handleDelete(row.original)}
                            className="p-1 text-red-600 hover:text-red-800"
                        >
                            Delete
                        </button>
                    </div>
                ),
            });
        }
        return cols;
    }, [userColumns, actions]);

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        page,
        prepareRow,
        state,
        setPageSize,
        gotoPage,
        nextPage,
        previousPage,
        canPreviousPage,
        canNextPage,
        pageCount,
        pageOptions,
    } = useTable(
        {
            columns,
            data,
            initialState: { pageSize: 10 }
        },
        useGlobalFilter,
        useSortBy,
        usePagination
    );

    const { pageIndex, pageSize } = state;

    return (
        <div className="flex flex-col gap-4">

            <div className="flex items-center justify-end gap-2 px-4">
                <Search className="w-5 h-5 text-gray-400" />
                <input
                    type="text"
                    value={globalFilter || ''}
                    onChange={e => setGlobalFilter(e.target.value)}
                    placeholder="Search..."
                    className="px-3 py-2 border border-gray-300 rounded-md w-52 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
            </div>

            <div className="overflow-x-auto">
                <div className="inline-block min-w-full align-middle">
                    <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                        <table {...getTableProps()} className="min-w-full divide-y divide-gray-300">
                            <thead className="bg-gray-50">
                                {headerGroups.map(headerGroup => (
                                    <tr {...headerGroup.getHeaderGroupProps()}>
                                        {headerGroup.headers.map(column => (
                                            <th
                                                {...column.getHeaderProps(column.getSortByToggleProps())}
                                                className="px-6 py-3 text-sm font-semibold text-left text-gray-900"
                                            >
                                                <div className="flex items-center gap-2">
                                                    {column.render('Header')}
                                                    {column.isSorted && (
                                                        column.isSortedDesc ? (
                                                            <ChevronDown className="w-4 h-4" />
                                                        ) : (
                                                            <ChevronUp className="w-4 h-4" />
                                                        )
                                                    )}
                                                </div>
                                            </th>
                                        ))}
                                    </tr>
                                ))}
                            </thead>
                            <tbody {...getTableBodyProps()} className="bg-white divide-y divide-gray-200">
                                {page.map(row => {
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
            </div>

            <div className="flex items-center justify-between px-4 py-3 bg-white border-t">
                <div className="flex items-center gap-4">
                    <select
                        value={pageSize}
                        onChange={e => setPageSize(Number(e.target.value))}
                        className="px-2 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        {[10, 20, 30, 40, 50].map(size => (
                            <option key={size} value={size}>
                                Show {size}
                            </option>
                        ))}
                    </select>
                    <span className="text-sm text-gray-700">
                        Page {pageIndex + 1} of {pageOptions.length}
                    </span>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => previousPage()}
                        disabled={!canPreviousPage}
                        className="p-1 rounded-md disabled:opacity-50 hover:bg-gray-100"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => nextPage()}
                        disabled={!canNextPage}
                        className="p-1 rounded-md disabled:opacity-50 hover:bg-gray-100"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
}