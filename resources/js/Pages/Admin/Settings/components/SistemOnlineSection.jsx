import React, { useState } from "react";
import PropTypes from "prop-types";
import { X } from "lucide-react";
import ConfirmDialog from "./ConfirmDialog";

const SistemOnlineSection = React.memo(({ data, onChange }) => {
    const [confirmDelete, setConfirmDelete] = useState({
        show: false,
        key: null,
    });

    const handleKeyChange = (oldKey, newKey) => {
        const newData = { ...data };
        const value = newData[oldKey];
        delete newData[oldKey];
        newData[newKey] = value;
        onChange(newData);
    };

    const handleValueChange = (key, value) => {
        onChange({ ...data, [key]: value });
    };

    const handleRemove = (key) => {
        const newData = { ...data };
        delete newData[key];
        onChange(newData);
    };

    const handleAdd = () => {
        onChange({
            ...data,
            [`Judul Link ${Object.keys(data).length + 1}`]: "",
        });
    };

    const handleConfirmDelete = (key) => {
        setConfirmDelete({ show: true, key });
    };

    const handleDeleteConfirmed = () => {
        handleRemove(confirmDelete.key);
        setConfirmDelete({ show: false, key: null });
    };

    return (
        <div className="space-y-2">
            {Object.entries(data).map(([key, value], index) => (
                <div key={index} className="flex gap-2 mb-2">
                    <input
                        type="text"
                        className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-teal-500 focus:ring-teal-500 disabled:bg-gray-100 dark:disabled:bg-gray-600 dark:bg-gray-900 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-600"
                        value={key}
                        onChange={(e) => handleKeyChange(key, e.target.value)}
                        placeholder="Name"
                    />
                    <input
                        type="text"
                        className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-teal-500 focus:ring-teal-500 disabled:bg-gray-100 dark:disabled:bg-gray-600 dark:bg-gray-900 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-600"
                        value={value}
                        onChange={(e) => handleValueChange(key, e.target.value)}
                        placeholder="URL"
                    />
                    <button
                        type="button"
                        onClick={() => handleConfirmDelete(key)}
                        className="p-2 text-sm font-medium text-white bg-red-500 border-transparent rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 disabled:opacity-50"
                    >
                        <X size={16} />
                    </button>
                </div>
            ))}
            <button
                type="button"
                onClick={handleAdd}
                className="px-3 py-1 text-sm text-white bg-green-500 rounded hover:bg-green-600"
            >
                + Tambah
            </button>

            <ConfirmDialog
                isOpen={confirmDelete.show}
                onClose={() => setConfirmDelete({ show: false, key: null })}
                onConfirm={handleDeleteConfirmed}
                message="Are you sure you want to delete this item?"
            />
        </div>
    );
});

SistemOnlineSection.propTypes = {
    data: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
};

export default SistemOnlineSection;
