import React from 'react';
import { useTable, useSortBy, useGlobalFilter, usePagination } from 'react-table';
import { Search, ChevronDown, ChevronUp } from 'lucide-react';

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

const Table = ({ columns, data, onAdd }) => {
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
    } = useTable(
        {
            columns,
            data,
            initialState: { pageIndex: 0, pageSize: 10 },
        },
        useGlobalFilter,
        useSortBy,
        usePagination
    );

    const { pageIndex, pageSize } = state;

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-semibold">{columns[0].Header}</h1>
                <div className="flex space-x-4">
                    <div className="w-64">
                        <GlobalFilter
                            globalFilter={state.globalFilter}
                            setGlobalFilter={setGlobalFilter}
                        />
                    </div>
                    {onAdd && (
                        <button
                            onClick={onAdd}
                            className="px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600"
                        >
                            Tambah
                        </button>
                    )}
                </div>
            </div>
            <div className="overflow-x-auto bg-white rounded-lg shadow-md">
                <table {...getTableProps()} className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        {headerGroups.map(headerGroup => {
                            const { key, ...headerGroupProps } = headerGroup.getHeaderGroupProps();
                            return (
                                <tr key={key} {...headerGroupProps}>
                                    {headerGroup.headers.map(column => {
                                        const { key, ...columnProps } = column.getHeaderProps(column.getSortByToggleProps());
                                        return (
                                            <th
                                                key={key}
                                                {...columnProps}
                                                className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase cursor-pointer"
                                            >
                                                <div className="flex items-center">
                                                    {column.render('Header')}
                                                    <span className="ml-2">
                                                        {column.isSorted
                                                            ? column.isSortedDesc
                                                                ? <ChevronDown className="w-4 h-4" />
                                                                : <ChevronUp className="w-4 h-4" />
                                                            : ''}
                                                    </span>
                                                </div>
                                            </th>
                                        );
                                    })}
                                </tr>
                            );
                        })}
                    </thead>
                    <tbody {...getTableBodyProps()} className="bg-white divide-y divide-gray-200">
                        {page.length > 0 ? (
                            page.map(row => {
                                prepareRow(row);
                                const { key, ...rowProps } = row.getRowProps();
                                return (
                                    <tr key={key} {...rowProps} className="hover:bg-gray-50">
                                        {row.cells.map(cell => {
                                            const { key, ...cellProps } = cell.getCellProps();
                                            return (
                                                <td
                                                    key={key}
                                                    {...cellProps}
                                                    className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap"
                                                >
                                                    {cell.render('Cell')}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan={columns.length} className="px-6 py-4 text-sm text-center text-gray-500">
                                    No data available
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <div className="flex items-center justify-between mt-4">
                <div>
                    <span className="text-sm text-gray-700">
                        Page <span className="font-medium">{pageIndex + 1}</span> of <span className="font-medium">{pageOptions.length}</span>
                    </span>
                    <select
                        value={pageSize}
                        onChange={e => setPageSize(Number(e.target.value))}
                        className="ml-2 text-sm border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    >
                        {[10, 20, 30, 40, 50].map(pageSize => (
                            <option key={pageSize} value={pageSize}>
                                Show {pageSize}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <nav className="relative z-0 inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                        <button
                            onClick={() => gotoPage(0)}
                            disabled={!canPreviousPage}
                            className="px-2 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-l-md hover:bg-gray-50"
                        >
                            {'<<'}
                        </button>
                        <button
                            onClick={() => previousPage()}
                            disabled={!canPreviousPage}
                            className="px-2 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 hover:bg-gray-50"
                        >
                            {'<'}
                        </button>
                        <button
                            onClick={() => nextPage()}
                            disabled={!canNextPage}
                            className="px-2 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 hover:bg-gray-50"
                        >
                            {'>'}
                        </button>
                        <button
                            onClick={() => gotoPage(pageCount - 1)}
                            disabled={!canNextPage}
                            className="px-2 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-r-md hover:bg-gray-50"
                        >
                            {'>>'}
                        </button>
                    </nav>
                </div>
            </div>
        </div>
    );
};

export default Table;
