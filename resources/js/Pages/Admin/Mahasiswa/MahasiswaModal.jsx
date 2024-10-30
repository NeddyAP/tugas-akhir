import { useEffect } from "react";
import { useForm } from "@inertiajs/react";
import { Dialog } from "@headlessui/react";
import { X } from "lucide-react";
import { toast } from "react-toastify";

export default function MahasiswaModal({ isOpen, onClose, editingData }) {
    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        name: "",
        email: "",
        password: "",
        nim: "",
        phone: "",
        address: "",
    });

    useEffect(() => {
        if (isOpen) {
            if (editingData) {
                setData({
                    name: editingData.name,
                    email: editingData.email,
                    role: "mahasiswa",
                    nim: editingData.nim || "",
                    nip: editingData.nip || "",
                    phone: editingData.phone || "",
                    address: editingData.address || "",
                    password: "",
                });
            } else {
                reset();
            }
        } else {
            reset();
            clearErrors();
        }
    }, [isOpen, editingData]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingData) {
            put(route('mahasiswas.update', editingData.id), {
                onSuccess: () => {
                    reset();
                    onClose();
                },
            });
        } else {
            post(route('mahasiswas.store'), {
                onSuccess: () => {
                    reset();
                    onClose();
                },
            });
        }
    };

    return (
        <Dialog open={isOpen} onClose={onClose} className="relative z-50">
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
            <div className="fixed inset-0 flex items-center justify-center p-4">
                <Dialog.Panel className="w-full max-w-md p-6 overflow-hidden transition-all transform bg-white shadow-xl rounded-2xl">
                    <div className="flex items-center justify-between mb-4">
                        <Dialog.Title className="text-lg font-medium text-gray-900">
                            {editingData ? "Edit Data Mahasiswa" : "Tambah Data Mahasiswa Baru"}
                        </Dialog.Title>
                        <button
                            type="button"
                            onClick={() => {
                                clearErrors();
                                onClose();
                            }}
                            className="text-gray-400 hover:text-gray-500"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Name Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Nama</label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={e => setData("name", e.target.value)}
                                className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                            {errors.name && (
                                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                            )}
                        </div>

                        {/* Email Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <input
                                type="email"
                                value={data.email}
                                onChange={e => setData("email", e.target.value)}
                                className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                            {errors.email && (
                                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                            )}
                        </div>

                        {/* NIM Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">NIM</label>
                            <input
                                type="text"
                                value={data.nim}
                                onChange={e => setData("nim", e.target.value)}
                                className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                            {errors.nim && (
                                <p className="mt-1 text-sm text-red-600">{errors.nim}</p>
                            )}
                        </div>

                        {/* Phone Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Telepon</label>
                            <input
                                type="tel"
                                value={data.phone}
                                onChange={e => setData("phone", e.target.value)}
                                className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                            {errors.phone && (
                                <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                            )}
                        </div>

                        {/* Address Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Alamat</label>
                            <textarea
                                value={data.address}
                                onChange={e => setData("address", e.target.value)}
                                rows={3}
                                className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                            {errors.address && (
                                <p className="mt-1 text-sm text-red-600">{errors.address}</p>
                            )}
                        </div>

                        {/* Password Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Password</label>
                            <input
                                type="password"
                                value={data.password}
                                onChange={e => setData("password", e.target.value)}
                                className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                            {errors.password && (
                                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                            )}
                        </div>

                        {/* Form Buttons */}
                        <div className="flex justify-end mt-6 space-x-3">
                            <button
                                type="button"
                                onClick={() => {
                                    clearErrors();
                                    onClose();
                                }}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            >
                                Batal
                            </button>
                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
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