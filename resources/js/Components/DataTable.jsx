import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp, Edit, Search, Trash } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import { useGlobalFilter, usePagination, useSortBy, useTable } from 'react-table';
import { router } from '@inertiajs/react';

const TruncatedCell = ({ text, maxLength = 100 }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const shouldTruncate = text.length > maxLength;

    if (!shouldTruncate) return text;

    return (
        <div>
            {isExpanded ? text : `${text.slice(0, maxLength)}...`}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="ml-2 text-teal-600 hover:text-teal-800"
            >
                {isExpanded ? 'Show less' : 'Show more'}
            </button>
        </div>
    );
};

export default function DataTable({ columns: userColumns, data, actions, pagination }) {
    const [searchValue, setSearchValue] = useState('');

    const columns = useMemo(() => {
        const cols = [
            {
                Header: '#',
                id: 'rowNumber',
                Cell: ({ row }) => {
                    return pagination?.from + row.index;
                },
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
                            className="p-1 text-teal-600 hover:text-teal-800"
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
    }, [userColumns, actions, pagination?.from]);

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
        setGlobalFilter: setTableGlobalFilter,
    } = useTable(
        {
            columns: memoizedColumns,
            data: memoizedData,
            manualPagination: true,
            pageCount: pagination?.pageCount || 1,
            initialState: {
                pageIndex: pagination?.pageIndex || 0,
                pageSize: pagination?.pageSize || 10
            },
        },
        useGlobalFilter,
        useSortBy,
        usePagination
    );

    const { pageIndex, pageSize } = state;

    const handleSearch = useCallback((e) => {
        const value = e.target.value;
        setSearchValue(value);

        // Debounce the search request
        const timeoutId = setTimeout(() => {
            const currentQuery = new URLSearchParams(window.location.search);
            currentQuery.set('search', value);
            currentQuery.set('page', 1); // Reset to first page on search

            router.get(
                route(route().current()),
                Object.fromEntries(currentQuery.entries()),
                {
                    preserveState: true,
                    preserveScroll: true,
                }
            );
        }, 300);

        return () => clearTimeout(timeoutId);
    }, []);

    const handlePageChange = (newPage) => {
        const currentQuery = new URLSearchParams(window.location.search);
        currentQuery.set('page', newPage);

        router.get(
            route(route().current()),
            Object.fromEntries(currentQuery.entries()),
            { preserveState: true, preserveScroll: true }
        );
    };

    const handlePageSizeChange = (newSize) => {
        const currentQuery = new URLSearchParams(window.location.search);
        currentQuery.set('per_page', newSize);
        currentQuery.set('page', 1); // Reset to first page when changing page size

        router.get(
            route(route().current()),
            Object.fromEntries(currentQuery.entries()),
            { preserveState: true, preserveScroll: true }
        );
    };

    const renderPaginationButtons = () => {
        const buttons = [];
        const currentPage = pagination.pageIndex + 1;
        const lastPage = pagination.pageCount;

        // First and Previous buttons
        buttons.push(
            <button
                key="first"
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
                className="px-3 py-1 text-sm border rounded-md disabled:opacity-50 hover:bg-gray-100 dark:hover:bg-teal-500"
            >
                First
            </button>,
            <button
                key="prev"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-1 rounded-md disabled:opacity-50 hover:bg-gray-100 dark:hover:bg-teal-500"
            >
                <ChevronLeft className="w-5 h-5" />
            </button>
        );

        // Page numbers
        for (let i = Math.max(1, currentPage - 2); i <= Math.min(lastPage, currentPage + 2); i++) {
            buttons.push(
                <button
                    key={i}
                    onClick={() => handlePageChange(i)}
                    className={`px-3 py-1 text-sm border rounded-md ${currentPage === i ? 'bg-teal-500 text-white' : 'hover:bg-gray-100  dark:hover:bg-teal-500'
                        }`}
                >
                    {i}
                </button>
            );
        }

        // Next and Last buttons
        buttons.push(
            <button
                key="next"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === lastPage}
                className="p-1 rounded-md disabled:opacity-50 hover:bg-gray-100 dark:hover:bg-teal-500"
            >
                <ChevronRight className="w-5 h-5" />
            </button>,
            <button
                key="last"
                onClick={() => handlePageChange(lastPage)}
                disabled={currentPage === lastPage}
                className="px-3 py-1 text-sm border rounded-md disabled:opacity-50 hover:bg-gray-100 dark:hover:bg-teal-500"
            >
                Last
            </button>
        );

        return buttons;
    };

    return (
        <div className="overflow-hidden bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
            <div className="flex items-center justify-end gap-2 px-4 py-2">
                <Search className="w-5 h-5 text-gray-400 dark:text-gray-300" />
                <input
                    type="text"
                    value={searchValue}
                    onChange={handleSearch}
                    placeholder="Search..."
                    className="px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-md dark:border-gray-600 w-52 dark:bg-gray-700 dark:text-gray-100"
                />
            </div>

            <div className="overflow-x-auto">
                <div className="inline-block min-w-full align-middle">
                    <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                        <table {...getTableProps()} className="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-900">
                                {headerGroups.map((headerGroup, headerGroupIndex) => (
                                    <tr {...headerGroup.getHeaderGroupProps()} key={headerGroupIndex}>
                                        {headerGroup.headers.map((column, columnIndex) => (
                                            <th
                                                {...column.getHeaderProps(column.getSortByToggleProps())}
                                                key={columnIndex}
                                                className="px-6 py-3 text-sm font-semibold text-left text-gray-900 dark:text-gray-200"
                                            >
                                                <div className="flex items-center gap-2">
                                                    {column.render('Header')}
                                                    {column.isSorted && (
                                                        column.isSortedDesc ? (
                                                            <ChevronDown className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                                                        ) : (
                                                            <ChevronUp className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                                                        )
                                                    )}
                                                </div>
                                            </th>
                                        ))}
                                    </tr>
                                ))}
                            </thead>
                            <tbody {...getTableBodyProps()} className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                                {data && data.length > 0 ? (
                                    page.map((row, rowIndex) => {
                                        prepareRow(row);
                                        return (
                                            <tr {...row.getRowProps()} key={rowIndex} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                                {row.cells.map((cell, cellIndex) => (
                                                    <td
                                                        {...cell.getCellProps()}
                                                        key={cellIndex}
                                                        className="px-6 py-4 text-sm text-gray-500 whitespace-normal dark:text-gray-300" // Remove whitespace-nowrap
                                                    >
                                                        {cell.column.accessor === 'answer' ? (
                                                            <TruncatedCell text={cell.value} />
                                                        ) : (
                                                            cell.render('Cell')
                                                        )}
                                                    </td>
                                                ))}
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={columns.length + 1}
                                            className="px-6 py-8 text-center text-gray-500 dark:text-gray-300"
                                        >
                                            <div className="flex flex-col items-center justify-center">
                                                <svg
                                                    className="w-12 h-12 mb-4 text-gray-400"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                                    />
                                                </svg>
                                                <p className="text-lg font-medium">Data tidak ditemukan</p>
                                                <p className="mt-1 text-sm">Coba ubah kata kunci pencarian atau tambah data baru</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                <div className="flex items-center gap-4">
                    <span className="text-gray-700 dark:text-gray-300">Show</span>
                    <select
                        value={pagination?.pageSize}
                        onChange={e => handlePageSizeChange(Number(e.target.value))}
                        className="px-2 py-1 pr-8 text-gray-900 bg-white border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 dark:bg-gray-700 dark:text-gray-100"
                    >
                        {[10, 20, 30, 40, 50].map(size => (
                            <option key={size} value={size}>
                                {size}
                            </option>
                        ))}
                    </select>
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                        Page {pagination?.pageIndex + 1} of {pagination?.pageCount} ({pagination?.total} total records)
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    {renderPaginationButtons()}
                </div>
            </div>
        </div>
    );
}