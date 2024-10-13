import React from 'react';
import { useTable, useSortBy, useGlobalFilter } from 'react-table';
import { Search } from 'lucide-react';

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
        rows,
        prepareRow,
        state,
        setGlobalFilter,
    } = useTable(
        {
            columns,
            data,
        },
        useGlobalFilter,
        useSortBy
    );

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
                                            ? '▼'
                                            : '▲'
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
    {rows.map(row => {
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
    })}
</tbody>
                </table>
            </div>
        </div>
    );
};

export default Table;
