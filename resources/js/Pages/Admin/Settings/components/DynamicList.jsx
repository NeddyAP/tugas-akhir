import React, { useState } from "react";
import PropTypes from "prop-types";
import { X } from "lucide-react";
import ConfirmDialog from "./ConfirmDialog";

const DynamicList = React.memo(({ items, onAdd, onRemove, onUpdate }) => {
    const [confirmDelete, setConfirmDelete] = useState({
        show: false,
        index: null,
    });

    const handleConfirmDelete = (index) => {
        setConfirmDelete({ show: true, index });
    };

    const handleDelete = () => {
        onRemove(confirmDelete.index);
        setConfirmDelete({ show: false, index: null });
    };

    return (
        <div className="space-y-2">
            {items.map((item, index) => (
                <div key={index} className="flex gap-2">
                    <input
                        type="text"
                        className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-teal-500 focus:ring-teal-500 disabled:bg-gray-100 dark:disabled:bg-gray-600 dark:bg-gray-900 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-600"
                        value={item}
                        onChange={(e) => onUpdate(index, e.target.value)}
                    />
                    <button
                        type="button"
                        onClick={() => handleConfirmDelete(index)}
                        className="p-2 text-sm font-medium text-white bg-red-500 border-transparent rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 disabled:opacity-50"
                    >
                        <X size={16} />
                    </button>
                </div>
            ))}
            <button
                type="button"
                onClick={onAdd}
                className="px-3 py-1 text-sm text-white bg-green-500 rounded hover:bg-green-600"
            >
                + Tambah
            </button>

            <ConfirmDialog
                isOpen={confirmDelete.show}
                onClose={() => setConfirmDelete({ show: false, index: null })}
                onConfirm={handleDelete}
                message="Are you sure you want to delete this item?"
            />
        </div>
    );
});

DynamicList.propTypes = {
    items: PropTypes.arrayOf(PropTypes.string).isRequired,
    onAdd: PropTypes.func.isRequired,
    onRemove: PropTypes.func.isRequired,
    onUpdate: PropTypes.func.isRequired,
};

export default DynamicList;
