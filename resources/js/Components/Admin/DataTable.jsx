import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp, Edit, Search, Trash } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import { useGlobalFilter, usePagination, useSortBy, useTable } from 'react-table';

export default function DataTable({ columns: userColumns, data, actions }) {
    const [globalFilter, setGlobalFilter] = useState('');

    const columns = useMemo(() => {
        const cols = [
            {
                Header: '#',
                id: 'rowNumber',
                Cell: ({ row }) => row.index + 1,
            },
            ...userColumns
        ];
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
                            <Edit className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => actions.handleDelete(row.original)}
                            className="p-1 text-red-600 hover:text-red-800"
                        >
                            <Trash className="w-5 h-5" />
                        </button>
                    </div>
                ),
            });
        }
        return cols;
    }, [userColumns, actions]);

    // Memoize data and columns
    const memoizedColumns = useMemo(() => columns, [columns]);
    const memoizedData = useMemo(() => data, [data]);

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
        setGlobalFilter: setTableGlobalFilter,
    } = useTable(
        {
            columns: memoizedColumns,
            data: memoizedData,
            initialState: { pageSize: 10 },
            globalFilter: 'text',
        },
        useGlobalFilter,
        useSortBy,
        usePagination
    );

    const { pageIndex, pageSize } = state;

    const handleGlobalFilterChange = useCallback((e) => {
        setGlobalFilter(e.target.value);
        setTableGlobalFilter(e.target.value);
    }, [setGlobalFilter, setTableGlobalFilter]);

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-end gap-2 px-4">
                <Search className="w-5 h-5 text-gray-400" />
                <input
                    type="text"
                    value={globalFilter || ''}
                    onChange={handleGlobalFilterChange}
                    placeholder="Search..."
                    className="px-3 py-2 border border-gray-300 rounded-md w-52 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
            </div>

            <div className="overflow-x-auto">
                <div className="inline-block min-w-full align-middle">
                    <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                        <table {...getTableProps()} className="min-w-full divide-y divide-gray-300">
                            <thead className="bg-gray-50">
                                {headerGroups.map((headerGroup, headerGroupIndex) => (
                                    <tr {...headerGroup.getHeaderGroupProps()} key={headerGroupIndex}>
                                        {headerGroup.headers.map((column, columnIndex) => (
                                            <th
                                                {...column.getHeaderProps(column.getSortByToggleProps())}
                                                key={columnIndex}
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
                                {page.map((row, rowIndex) => {
                                    prepareRow(row);
                                    return (
                                        <tr {...row.getRowProps()} key={rowIndex} className="hover:bg-gray-50">
                                            {row.cells.map((cell, cellIndex) => (
                                                <td
                                                    {...cell.getCellProps()}
                                                    key={cellIndex}
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
                    <span>Show</span>
                    <select
                        value={pageSize}
                        onChange={e => setPageSize(Number(e.target.value))}
                        className="px-2 py-1 pr-8 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        {[10, 20, 30, 40, 50].map(size => (
                            <option key={size} value={size}>
                                {size}
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