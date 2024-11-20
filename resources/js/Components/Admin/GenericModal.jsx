import { useEffect } from "react";
import { Dialog } from "@headlessui/react";
import { X } from "lucide-react";

export default function GenericModal({
    isOpen,
    onClose,
    title,
    data,
    setData,
    errors,
    processing,
    handleSubmit,
    clearErrors,
    fields,
    onFileChange,
}) {
    useEffect(() => {
        if (!isOpen) {
            clearErrors();
        }
    }, [isOpen]);

    return (
        <Dialog open={isOpen} onClose={onClose} className="relative z-50">
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
            <div className="fixed inset-0 flex items-center justify-center p-4">
                <Dialog.Panel className="w-full max-w-md p-6 overflow-hidden transition-all transform bg-white shadow-xl dark:bg-gray-800 rounded-2xl">
                    <div className="flex items-center justify-between mb-4">
                        <Dialog.Title className="text-lg font-medium text-gray-900 dark:text-gray-100">
                            {title}
                        </Dialog.Title>
                        <button
                            type="button"
                            onClick={() => {
                                clearErrors();
                                onClose();
                            }}
                            className="text-gray-400 hover:text-gray-500 dark:text-gray-300 dark:hover:text-gray-400"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {fields.map((field) => (
                            <div key={field.name}>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                                    {field.label}
                                </label>
                                {field.type === "textarea" ? (
                                    <textarea
                                        value={data[field.name]}
                                        onChange={(e) => setData(field.name, e.target.value)}
                                        rows={field.rows || 3}
                                        className="block w-full mt-1 text-gray-900 bg-white border-gray-300 rounded-md shadow-sm dark:border-gray-600 focus:ring-teal-500 focus:border-teal-500 sm:text-sm dark:bg-gray-700 dark:text-gray-100"
                                    />
                                ) : field.type === "file" ? (
                                    <input
                                        type="file"
                                        onChange={onFileChange}
                                        accept={field.accept}
                                        className="block w-full mt-1 text-gray-900 bg-white border-gray-300 rounded-md shadow-sm dark:border-gray-600 focus:ring-teal-500 focus:border-teal-500 sm:text-sm dark:bg-gray-700 dark:text-gray-100"
                                        required={field.required}
                                    />
                                ) : field.type === "select" ? (
                                    <select
                                        value={data[field.name]}
                                        onChange={(e) => setData(field.name, e.target.value)}
                                        disabled={field.disabled || false}
                                        className="block w-full mt-1 text-gray-900 bg-white border-gray-300 rounded-md shadow-sm dark:border-gray-600 focus:ring-teal-500 focus:border-teal-500 sm:text-sm dark:bg-gray-700 dark:text-gray-100"
                                    >
                                        {field.options.map((option) => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                ) : (
                                    <input
                                        type={field.type}
                                        value={data[field.name]}
                                        onChange={(e) => setData(field.name, e.target.value)}
                                        className="block w-full mt-1 text-gray-900 bg-white border-gray-300 rounded-md shadow-sm dark:border-gray-600 focus:ring-teal-500 focus:border-teal-500 sm:text-sm dark:bg-gray-700 dark:text-gray-100"
                                        disabled={field.disabled || false}
                                    />
                                )}
                                {errors[field.name] && (
                                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors[field.name]}</p>
                                )}
                            </div>
                        ))}

                        <div className="flex justify-end mt-6 space-x-3">
                            <button
                                type="button"
                                onClick={() => {
                                    clearErrors();
                                    onClose();
                                }}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm dark:text-gray-200 dark:bg-gray-700 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
                            >
                                Batal
                            </button>
                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-teal-600 border border-transparent rounded-md shadow-sm dark:bg-teal-700 hover:bg-teal-700 dark:hover:bg-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:opacity-50"
                            >
                                {processing ? "Menyimpan..." : "Simpan"}
                            </button>
                        </div>
                    </form>
                </Dialog.Panel>
            </div>
        </Dialog>
    );
}
