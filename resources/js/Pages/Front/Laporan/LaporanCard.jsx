import PropTypes from 'prop-types';
import { format } from 'date-fns';
import { FileText, Calendar, User, Clock, Download, Edit, SquareUserRoundIcon, Goal, NotebookPen } from 'lucide-react';
import { useForm } from '@inertiajs/react';
import GenericModal from '@/Components/ui/GenericModal';
import { useState } from 'react';

const MODAL_FIELDS = [
    {
        name: 'file',
        label: 'File PDF',
        type: 'file',
        accept: '.pdf',
        required: true
    },
    {
        name: 'keterangan',
        label: 'Keterangan',
        type: 'textarea',
        rows: 3,
        required: false
    },
    {
        name: 'type',
        type: 'hidden',
    }
];

export default function LaporanCard({ data, type }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { data: formData, setData, post, put, processing, errors, reset } = useForm({
        type: type,
        file: null,
        keterangan: data?.laporan?.keterangan || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (data.laporan) {
            put(route('laporan.update', data.id), {
                preserveScroll: true,
                onSuccess: () => {
                    setIsModalOpen(false);
                    reset();
                },
            });
        } else {
            post(route('laporan.store'), {
                preserveScroll: true,
                onSuccess: () => {
                    setIsModalOpen(false);
                    reset();
                },
            });
        }
    };

    const getStatusBadge = (status) => {
        const baseClasses = "px-3 py-1 rounded-full text-sm font-medium inline-flex items-center gap-1.5";
        switch (status) {
            case 'completed':
                return `${baseClasses} bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-400 border border-green-200 dark:border-green-800`;
            case 'rejected':
                return `${baseClasses} bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-400 border border-red-200 dark:border-red-800`;
            default:
                return `${baseClasses} bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800`;
        }
    };

    return (
        <>
            <div className="overflow-hidden bg-white border rounded-xl dark:bg-gray-800/50 dark:border-gray-700 backdrop-blur-xl">
                <div className="px-6 py-4 border-b dark:border-gray-700">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Laporan {type.toUpperCase()}
                        </h3>
                        <span className={getStatusBadge(data.status)}>
                            {data.status}
                        </span>
                    </div>
                </div>

                <div className="p-6">
                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-6">
                            <div className="p-4 transition-colors border rounded-lg dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                <div className="flex items-start gap-3">
                                    <SquareUserRoundIcon className="w-5 h-5 text-teal-500 dark:text-teal-400" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">Nama Mahasiswa</p>
                                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                            {data.mahasiswa?.name || '-'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="p-4 transition-colors border rounded-lg dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                <div className="flex items-start gap-3">
                                    <Calendar className="w-5 h-5 text-teal-500 dark:text-teal-400" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">Periode Pelaksanaan</p>
                                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                            {format(new Date(data.tanggal_mulai), 'dd MMM yyyy')} - {format(new Date(data.tanggal_selesai), 'dd MMM yyyy')}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 transition-colors border rounded-lg dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                <div className="flex items-start gap-3">
                                    <User className="w-5 h-5 text-teal-500 dark:text-teal-400" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">Dosen Pembimbing</p>
                                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                            {data.pembimbing?.name || '-'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="p-4 transition-colors border rounded-lg dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                <div className="flex items-start gap-3">
                                    <Goal className="w-5 h-5 text-teal-500 dark:text-teal-400" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">Angkatan</p>
                                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                            {data.mahasiswa?.angkatan || '-'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="p-4 transition-colors border rounded-lg dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                <div className="flex items-start gap-3">
                                    <FileText className="w-5 h-5 text-teal-500 dark:text-teal-400" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">Keterangan Laporan</p>
                                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                            {data.laporan?.keterangan || 'Belum ada keterangan'}
                                        </p>
                                    </div>

                                </div>
                            </div>

                            <div className="p-4 transition-colors border rounded-lg dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                <div className="flex items-start gap-3">
                                    <Clock className="w-5 h-5 text-teal-500 dark:text-teal-400" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">Terakhir Diperbarui</p>
                                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                            {data.updated_at ? format(new Date(data.updated_at), 'dd MMM yyyy HH:mm') : '-'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {data.laporan ? (
                        <div className="flex gap-3 pt-6 mt-6 border-t dark:border-gray-700">
                            <a
                                href={route('files.laporan', data.laporan.file.split('/').pop())}
                                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white transition-colors bg-teal-500 rounded-lg hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                            >
                                <Download className="w-4 h-4" />
                                Download PDF
                            </a>
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 transition-colors bg-white border rounded-lg dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                            >
                                <Edit className="w-4 h-4" />
                                Edit Laporan
                            </button>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center pt-6 mt-6 text-center border-t dark:border-gray-700">
                            <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                                Anda belum mengupload laporan {type.toUpperCase()}
                            </p>
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white transition-colors bg-teal-500 rounded-lg hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                            >
                                Upload Laporan
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <GenericModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    reset();
                }}
                title={`${data.laporan ? 'Update' : 'Upload'} Laporan ${type.toUpperCase()}`}
                type={data.laporan ? 'edit' : 'create'}
                editingData={data.laporan ? data : null}
                fields={MODAL_FIELDS}
                data={{ ...formData, type }}
                setData={setData}
                errors={errors}
                processing={processing}
                handleSubmit={handleSubmit}
            />
        </>
    );
}

LaporanCard.propTypes = {
    data: PropTypes.shape({
        id: PropTypes.number,
        status: PropTypes.string,
        tanggal_mulai: PropTypes.string,
        tanggal_selesai: PropTypes.string,
        updated_at: PropTypes.string,
        pembimbing: PropTypes.shape({
            name: PropTypes.string,
        }),
        laporan: PropTypes.shape({
            id: PropTypes.number,
            keterangan: PropTypes.string,
        }),
    }).isRequired,
    type: PropTypes.oneOf(['kkl', 'kkn']).isRequired,
};