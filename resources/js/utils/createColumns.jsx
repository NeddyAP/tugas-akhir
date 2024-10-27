import React from 'react';
import ActionCell from '@/Components/Front/ActionCell';

const createColumns = (title, fields, handleEdit, handleDelete) => [
    {
        Header: title,
        columns: [
            { Header: 'No', accessor: 'id' },
            ...fields.map(field => ({ Header: field.header, accessor: field.accessor })),
            {
                Header: 'Action',
                accessor: 'action',
                Cell: ({ row }) => (
                    <ActionCell row={row} onEdit={handleEdit} onDelete={handleDelete} />
                ),
            },
        ],
    },
];

export default createColumns;
