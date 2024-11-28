import React from 'react';
import { Dialog } from '@headlessui/react';
import { X } from 'lucide-react';
import Select from 'react-select';

const FieldLabel = ({ label }) => (
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-100">
        {label}
    </label>
);

const ErrorMessage = ({ message }) => (
    message ? <p className="mt-1 text-sm text-red-600 dark:text-red-400">{message}</p> : null
);

const InputField = ({ field, value, onChange, disabled = false }) => (
    <input
        type={field.type}
        value={value || ''}
        onChange={onChange}
        disabled={disabled}
        className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-teal-500 focus:ring-teal-500 disabled:bg-gray-100 dark:disabled:bg-gray-600 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400"
    />
);

// Update the SelectField component to handle custom onChange
const SelectField = ({ field, value, onChange }) => (
    <select
        value={value || ''}
        onChange={(e) => {
            if (field.onChange) {
                field.onChange(e.target.value);
            } else {
                onChange(e);
            }
        }}
        disabled={field.disabled}
        className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-teal-500 focus:ring-teal-500 disabled:bg-gray-100 dark:disabled:bg-gray-600 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
    >
        <option value="">Select {field.label}</option>
        {field.options.map((option) => (
            <option
                key={option.value}
                value={option.value}
                className="dark:bg-gray-700"
            >
                {option.label}
            </option>
        ))}
    </select>
);

const SearchableSelect = ({ field, value, onChange, options }) => (
    <Select
        value={options.find(option => option.value === value)}
        onChange={(selected) => onChange(selected ? selected.value : '')}
        options={options}
        classNamePrefix="select"
        isClearable
        isSearchable
        isDisabled={field.disabled}
        placeholder={`Select ${field.label}`}
        className="block w-full mt-1"
        classNames={{
            control: () => "border rounded-md shadow-sm bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 hover:border-teal-500 dark:hover:border-teal-500",
            input: () => "text-gray-900 dark:text-gray-100",
            placeholder: () => "text-gray-500 dark:text-gray-400",
            singleValue: () => "text-gray-900 dark:text-gray-100",
            menu: () => "mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg dark:text-gray-100",
            option: ({ isFocused, isSelected }) => [
                "px-3 py-2 cursor-pointer",
                isFocused && "bg-teal-50 dark:bg-teal-900/50",
                isSelected && "bg-teal-100 dark:bg-teal-900",
                !isFocused && !isSelected && "hover:bg-gray-100 dark:hover:bg-gray-600"
            ].filter(Boolean).join(" "),
            noOptionsMessage: () => "text-gray-500 dark:text-gray-400 p-3"
        }}
        components={{
            IndicatorSeparator: () => null
        }}
    />
);

const TextArea = ({ field, value, onChange }) => (
    <textarea
        value={value || ''}
        onChange={onChange}
        rows={field.rows || 3}
        className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-teal-500 focus:ring-teal-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400"
        required={field.required}
    />
);

const FileInput = ({ field, onChange }) => (
    <input
        type="file"
        onChange={onChange}
        accept={field.accept}
        className="block w-full mt-1 text-sm text-gray-900 border border-gray-300 rounded-md cursor-pointer bg-gray-50 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100 dark:text-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:file:bg-teal-900 dark:file:text-teal-100"
    />
);

const Button = ({ onClick, disabled, variant = 'primary', children }) => {
    const baseClasses = "px-4 py-2 text-sm font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2";
    const variants = {
        primary: "text-white bg-teal-600 border-transparent hover:bg-teal-700 dark:bg-teal-700 dark:hover:bg-teal-800 disabled:opacity-50",
        secondary: "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 dark:text-gray-200 dark:bg-gray-700 dark:border-gray-600 dark:hover:bg-gray-600"
    };

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`${baseClasses} ${variants[variant]}`}
        >
            {children}
        </button>
    );
};

const GenericModal = ({
    isOpen,
    onClose,
    title,
    type,
    editingData,
    fields = [],
    data,
    setData,
    errors,
    processing,
    handleSubmit
}) => {

    const handleClose = () => {
        onClose();
    };

    const renderField = (field) => {
        const handleChange = (e) => setData(field.name, e.target.value);
        const handleFileChange = (e) => setData(field.name, e.target.files[0]);

        switch (field.type) {
            case 'hidden':
                return <input type="hidden" value={field.value} name={field.name} />;
            case 'searchableSelect':
                return (
                    <SearchableSelect
                        field={field}
                        value={data[field.name]}
                        onChange={(value) => setData(field.name, value)}
                        options={field.options}
                    />
                );
            case 'textarea':
                return (
                    <TextArea
                        field={field}
                        value={data[field.name]}
                        onChange={handleChange}
                    />
                );
            case 'file':
                return <FileInput field={field} onChange={handleFileChange} />;
            case 'select':
                return (
                    <SelectField
                        field={field}
                        value={data[field.name]}
                        onChange={handleChange}
                    />
                );
            default:
                return (
                    <InputField
                        field={field}
                        value={data[field.name]}
                        onChange={handleChange}
                        disabled={field.disabled}
                    />
                );
        }
    };

    return (
        <Dialog open={isOpen} onClose={handleClose} className="relative z-50">
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
            <div className="fixed inset-0 flex items-center justify-center p-4">
                <Dialog.Panel className="w-full max-w-md max-h-[90vh] flex flex-col bg-white shadow-xl rounded-2xl dark:bg-gray-800">
                    <div className="flex items-center justify-between p-6 border-b dark:border-gray-700">
                        <Dialog.Title className="text-lg font-medium text-gray-900 dark:text-gray-100">
                            {title}
                        </Dialog.Title>
                        <button
                            onClick={handleClose}
                            className="text-gray-400 hover:text-gray-500 dark:text-gray-300 dark:hover:text-gray-400"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="flex-1 p-6 overflow-y-auto">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {fields.map((field) => (
                                <div key={field.name}>
                                    <FieldLabel label={field.label} />
                                    {renderField(field)}
                                    <ErrorMessage message={errors[field.name]} />
                                </div>
                            ))}
                        </form>
                    </div>

                    <div className="flex justify-end p-6 space-x-3 border-t dark:border-gray-700">
                        <Button onClick={handleClose} variant="secondary">
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            disabled={processing}
                            variant="primary"
                        >
                            {processing ? "Saving..." : "Save"}
                        </Button>
                    </div>
                </Dialog.Panel>
            </div>
        </Dialog>
    );
};

export default GenericModal;