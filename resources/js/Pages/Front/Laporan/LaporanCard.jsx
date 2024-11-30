import PropTypes from "prop-types";
import { format } from "date-fns";
import {
    FileText,
    Calendar,
    User,
    Clock,
    Download,
    SquareUserRoundIcon,
    Goal,
    Trash2,
    Upload,
} from "lucide-react";
import { renderStatusBadge } from "@/utils/constants";
import { useForm, router } from "@inertiajs/react";

export default function LaporanCard({
    data = null,
    type,
    processing,
    onUpload,
}) {
    const handleDelete = (data) => {
        let confirmMessage = "Apakah Anda yakin ingin menghapus laporan ini?";

        if (data.status.toLowerCase() === "approved") {
            confirmMessage =
                "PERHATIAN! Laporan ini sudah disetujui. Menghapus laporan yang sudah disetujui mungkin memerlukan pengajuan ulang.\n\nApakah Anda tetap ingin menghapus laporan ini?";
        }

        if (window.confirm(confirmMessage)) {
            router.delete(route("laporan.destroy", data.laporan.id), {
                preserveScroll: true,
                preserveState: true,
            });
        }
    };
    if (!data) {
        return (
            <div className="p-6 text-center bg-white border rounded-xl dark:bg-gray-800/50 dark:border-gray-700">
                <p className="text-gray-600 dark:text-gray-400">
                    Tidak ada data{" "}
                    <span className="text-red-500"> {type.toUpperCase()}</span>{" "}
                    yang tersedia.
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                    Gunakan role <span className="text-red-500">Mahasiswa</span>{" "}
                    untuk membuat laporan.
                </p>
            </div>
        );
    }

    return (
        <div className="overflow-hidden bg-white border rounded-xl dark:bg-gray-800/50 dark:border-gray-700 backdrop-blur-xl">
            <div className="px-6 py-4 border-b dark:border-gray-700">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Laporan {type.toUpperCase()}
                    </h3>
                    <span
                        className={`px-3 py-1 rounded-full text-sm font-medium inline-flex items-center gap-1.5 ${renderStatusBadge(
                            data.status
                        )}`}
                    >
                        {data.status.toUpperCase()}
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
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                                        Nama Mahasiswa
                                    </p>
                                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                        {data.mahasiswa?.name || "-"}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="p-4 transition-colors border rounded-lg dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                            <div className="flex items-start gap-3">
                                <Calendar className="w-5 h-5 text-teal-500 dark:text-teal-400" />
                                <div>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                                        Periode Pelaksanaan
                                    </p>
                                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                        {format(
                                            new Date(data.tanggal_mulai),
                                            "dd MMM yyyy"
                                        )}{" "}
                                        -{" "}
                                        {format(
                                            new Date(data.tanggal_selesai),
                                            "dd MMM yyyy"
                                        )}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 transition-colors border rounded-lg dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                            <div className="flex items-start gap-3">
                                <User className="w-5 h-5 text-teal-500 dark:text-teal-400" />
                                <div>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                                        Dosen Pembimbing
                                    </p>
                                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                        {data.pembimbing?.name || "-"}
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
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                                        Angkatan
                                    </p>
                                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                        {data.mahasiswa?.angkatan || "-"}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="p-4 transition-colors border rounded-lg dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                            <div className="flex items-start gap-3">
                                <FileText className="w-5 h-5 text-teal-500 dark:text-teal-400" />
                                <div>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                                        Keterangan Laporan
                                    </p>
                                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                        {data.laporan?.keterangan ||
                                            "Belum ada keterangan"}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 transition-colors border rounded-lg dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                            <div className="flex items-start gap-3">
                                <Clock className="w-5 h-5 text-teal-500 dark:text-teal-400" />
                                <div>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                                        Terakhir Diperbarui
                                    </p>
                                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                        {data.updated_at
                                            ? format(
                                                  new Date(data.updated_at),
                                                  "dd MMM yyyy HH:mm"
                                              )
                                            : "-"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {data.laporan ? (
                    <div className="flex gap-3 pt-6 mt-6 border-t dark:border-gray-700">
                        {data.laporan.file && (
                            <a
                                href={route(
                                    "files.laporan",
                                    data.laporan.file.split("/").pop()
                                )}
                                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white transition-colors bg-teal-500 rounded-lg hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                                disabled={processing}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <Download
                                    className={`w-4 h-4 ${
                                        processing ? "animate-spin" : ""
                                    }`}
                                />
                                {processing ? "Memproses..." : "Download PDF"}
                            </a>
                        )}
                        <button
                            onClick={() => handleDelete(data)}
                            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-700 transition-colors bg-white border rounded-lg dark:bg-red-700 dark:text-red-200 dark:border-red-600 hover:bg-red-50 dark:hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                            disabled={processing}
                        >
                            <Trash2 className="w-4 h-4" />
                            {processing ? "Memproses..." : "Hapus"}
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col items-center pt-6 mt-6 text-center border-t dark:border-gray-700">
                        <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                            Anda belum mengupload laporan {type.toUpperCase()}
                        </p>
                        <button
                            onClick={onUpload}
                            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white transition-colors bg-teal-500 rounded-lg hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                            disabled={processing}
                        >
                            <Upload className="w-4 h-4" />
                            {processing ? "Memproses..." : "Upload Laporan"}
                        </button>
                    </div>
                )}
            </div>
        </div>
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
    }),
    type: PropTypes.oneOf(["kkl", "kkn"]).isRequired,
    processing: PropTypes.bool.isRequired,
    onUpload: PropTypes.func.isRequired,
};
