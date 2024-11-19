import React from 'react';
import { useTable, useSortBy, useGlobalFilter, usePagination } from 'react-table';
import { Search, ChevronDown, ChevronUp, ChevronLeft, ChevronRight } from 'lucide-react';

const GlobalFilter = ({ globalFilter, setGlobalFilter }) => (
    <div className="relative">
        <input
            value={globalFilter || ''}
            onChange={e => setGlobalFilter(e.target.value || undefined)}
            placeholder="Cari..."
            className="w-full px-4 py-2 pl-10 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
        />
        <Search className="absolute top-2.5 left-3 h-5 w-5 text-gray-400 dark:text-gray-300" />
    </div>
);

const Table = ({ columns, data, onAdd, title = columns[0]?.Header }) => {
    const tableInstance = useTable(
        {
            columns,
            data,
            initialState: { pageIndex: 0, pageSize: 10 },
        },
        useGlobalFilter,
        useSortBy,
        usePagination
    );

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        page,
        prepareRow,
        state,
        setGlobalFilter,
        canPreviousPage,
        canNextPage,
        pageOptions,
        pageCount,
        gotoPage,
        nextPage,
        previousPage,
        setPageSize,
    } = tableInstance;

    const { pageIndex, pageSize, globalFilter } = state;

    const renderPaginationButtons = () => {
        const buttons = [];
        const currentPage = pageIndex + 1;
        const lastPage = pageOptions.length;

        buttons.push(
            <button
                key="first"
                onClick={() => gotoPage(0)}
                disabled={!canPreviousPage}
                className="px-3 py-1 text-sm border rounded-md disabled:opacity-50 hover:bg-gray-100 dark:text-gray-300 dark:border-gray-600"
            >
                First
            </button>,
            <button
                key="prev"
                onClick={() => previousPage()}
                disabled={!canPreviousPage}
                className="p-1 rounded-md disabled:opacity-50 hover:bg-gray-100 dark:text-gray-300"
            >
                <ChevronLeft className="w-5 h-5" />
            </button>
        );

        for (let i = Math.max(1, currentPage - 2); i <= Math.min(lastPage, currentPage + 2); i++) {
            buttons.push(
                <button
                    key={i}
                    onClick={() => gotoPage(i - 1)}
                    className={`px-3 py-1 text-sm border rounded-md ${currentPage === i
                        ? 'bg-blue-500 text-white'
                        : 'hover:bg-gray-100 dark:text-gray-300 dark:border-gray-600'
                        }`}
                >
                    {i}
                </button>
            );
        }

        buttons.push(
            <button
                key="next"
                onClick={() => nextPage()}
                disabled={!canNextPage}
                className="p-1 rounded-md disabled:opacity-50 hover:bg-gray-100 dark:text-gray-300"
            >
                <ChevronRight className="w-5 h-5" />
            </button>,
            <button
                key="last"
                onClick={() => gotoPage(pageCount - 1)}
                disabled={!canNextPage}
                className="px-3 py-1 text-sm border rounded-md disabled:opacity-50 hover:bg-gray-100 dark:text-gray-300 dark:border-gray-600"
            >
                Last
            </button>
        );

        return buttons;
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-semibold dark:text-white">{title}</h1>
                <div className="flex space-x-4">
                    <div className="w-64">
                        <GlobalFilter
                            globalFilter={globalFilter}
                            setGlobalFilter={setGlobalFilter}
                        />
                    </div>
                    {onAdd && (
                        <button
                            onClick={onAdd}
                            className="px-4 py-2 text-white bg-teal-600 rounded hover:bg-teal-700"
                        >
                            Tambah
                        </button>
                    )}
                </div>
            </div>
            <div className="overflow-x-auto bg-white rounded-lg shadow-md dark:bg-gray-800">
                <table {...getTableProps()} className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-900">
                        {headerGroups.map(headerGroup => (
                            <tr key={headerGroup.getHeaderGroupProps().key} {...headerGroup.getHeaderGroupProps()}>
                                {headerGroup.headers.map(column => (
                                    <th
                                        key={column.getHeaderProps(column.getSortByToggleProps()).key}
                                        {...column.getHeaderProps(column.getSortByToggleProps())}
                                        className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase cursor-pointer dark:text-gray-300"
                                    >
                                        <div className="flex items-center">
                                            {column.render('Header')}
                                            <span className="ml-2">
                                                {column.isSorted
                                                    ? column.isSortedDesc
                                                        ? <ChevronDown className="w-4 h-4" />
                                                        : <ChevronUp className="w-4 h-4" />
                                                    : null}
                                            </span>
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody {...getTableBodyProps()} className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700 dark:hover:divide-gray-600">
                        {page.length > 0 ? (
                            page.map(row => {
                                prepareRow(row);
                                return (
                                    <tr
                                        key={row.getRowProps().key}
                                        {...row.getRowProps()}
                                        className="hover:bg-gray-100 dark:hover:bg-gray-700"
                                    >
                                        {row.cells.map(cell => (
                                            <td
                                                key={cell.getCellProps().key}
                                                {...cell.getCellProps()}
                                                className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap dark:text-gray-300"
                                            >
                                                {cell.render('Cell')}
                                            </td>
                                        ))}
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan={columns.length} className="px-6 py-4 text-sm text-center text-gray-500">
                                    Data tidak ditemukan
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <div className="flex items-center justify-between mt-4">
                <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                        Page <span className="font-medium">{pageIndex + 1}</span> of <span className="font-medium">{pageOptions.length}</span>
                    </span>
                    <select
                        value={pageSize}
                        onChange={e => setPageSize(Number(e.target.value))}
                        className="ml-2 text-sm border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-gray-300"
                    >
                        {[10, 20, 30, 40, 50].map(size => (
                            <option key={size} value={size}>
                                Show {size}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="flex items-center space-x-2">
                    {renderPaginationButtons()}
                </div>
            </div>
        </div>
    );
};

export default Table;