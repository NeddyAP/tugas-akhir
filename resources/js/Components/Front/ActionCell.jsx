import React from "react";
import { Edit, Trash2 } from "lucide-react";

const ActionCell = React.memo(({ row, onEdit, onDelete }) => (
    <div className="flex space-x-2">
        <button
            onClick={() => onEdit(row.original)}
            className="p-2 text-white transition-colors bg-blue-500 rounded hover:bg-blue-600"
        >
            <Edit className="w-4 h-4" />
        </button>
        <button
            onClick={() => onDelete(row.original)}
            className="p-2 text-white transition-colors bg-red-500 rounded hover:bg-red-600"
        >
            <Trash2 className="w-4 h-4" />
        </button>
    </div>
));

export default ActionCell;
