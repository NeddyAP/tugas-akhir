import { Link } from "@inertiajs/react";
import { AlertCircle, Home, ArrowLeft, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import { router } from "@inertiajs/react";

const Error = ({
    status: initialStatus,
    message: initialMessage,
    debug = null,
}) => {
    const [countdown, setCountdown] = useState(10);

    const params =
        typeof window !== "undefined"
            ? new URLSearchParams(window.location.search)
            : new URLSearchParams("");
    const status = initialStatus || parseInt(params.get("status")) || 500;
    const message =
        initialMessage ||
        params.get("message") ||
        "Terjadi kesalahan yang tidak terduga";

    const title = {
        503: "Layanan Tidak Tersedia",
        500: "Kesalahan Server",
        404: "Halaman Tidak Ditemukan",
        403: "Akses Dilarang",
        401: "Tidak Terotentikasi",
        419: "Halaman Kedaluwarsa",
    }[status];

    const descriptions = {
        503: "Layanan kami sedang tidak tersedia. Silakan coba lagi nanti.",
        500: "Ups! Terjadi kesalahan pada server kami.",
        404: "Halaman yang Anda cari tidak ada atau telah dipindahkan.",
        403: "Anda tidak memiliki izin untuk mengakses sumber daya ini.",
        401: "Silakan masuk untuk mengakses halaman ini.",
        419: "Sesi Anda telah berakhir. Silakan muat ulang dan coba lagi.",
    }[status];

    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        } else if (countdown === 0) {
            router.visit("/");
        }
    }, [countdown]);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="max-w-3xl px-4 py-16 mx-auto sm:px-6 sm:py-24">
                <div className="flex flex-col items-center">
                    <div className="flex items-center justify-center w-20 h-20 bg-red-100 rounded-full dark:bg-red-900/20">
                        <AlertCircle className="w-10 h-10 text-red-600 dark:text-red-400" />
                    </div>

                    <div className="mt-6 text-center">
                        <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-5xl">
                            {status} | {title}
                        </h1>
                        <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
                            {message || descriptions[status]}
                        </p>
                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-500">
                            Mengalihkan ke beranda dalam {countdown} detik...
                        </p>
                    </div>

                    <div className="flex flex-wrap justify-center gap-4 mt-10">
                        <Link
                            href="/"
                            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white transition-colors bg-teal-600 border border-transparent rounded-md shadow-sm hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 dark:hover:bg-teal-500"
                        >
                            <Home className="w-4 h-4 mr-2" />
                            Kembali ke Beranda
                        </Link>
                        <button
                            onClick={() => window.history.back()}
                            className="inline-flex items-center px-4 py-2 text-sm font-medium text-teal-700 transition-colors bg-teal-100 border border-transparent rounded-md hover:bg-teal-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 dark:bg-teal-900/20 dark:text-teal-400 dark:hover:bg-teal-900/40"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Kembali
                        </button>
                        <button
                            onClick={() => window.location.reload()}
                            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 transition-colors bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
                        >
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Muat Ulang Halaman
                        </button>
                    </div>

                    {/* Debug information in development */}
                    {debug && process.env.NODE_ENV !== "production" && (
                        <div className="w-full p-4 mt-8 bg-gray-100 rounded-lg dark:bg-gray-800">
                            <details className="text-sm text-gray-700 dark:text-gray-300">
                                <summary className="font-medium cursor-pointer">
                                    Informasi Debug
                                </summary>
                                <pre className="mt-2 overflow-auto whitespace-pre-wrap">
                                    {JSON.stringify(debug, null, 2)}
                                </pre>
                            </details>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Error;
