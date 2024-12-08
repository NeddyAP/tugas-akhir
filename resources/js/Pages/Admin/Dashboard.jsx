import React, { useState } from "react";
import { router } from "@inertiajs/react";
import {
    Layout,
    Users,
    FileText,
    BookOpen,
    Clock,
    ChevronLeft,
    ChevronRight,
    PlayCircle,
    HelpCircle,
    FileQuestion,
} from "lucide-react";
import StatCard from "@/Components/Admin/StatCard";
import AdminLayout from "@/Layouts/AdminLayout";

const ActivityStatusBadge = ({ status }) => {
    const getStatusColor = (status) => {
        switch (status) {
            case "Completed":
                return "bg-green-100 text-green-800";
            case "Pending":
                return "bg-yellow-100 text-yellow-800";
            case "Rejected":
                return "bg-red-100 text-red-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    return (
        <span
            className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(status)}`}
        >
            {status}
        </span>
    );
};

const ActivityItem = ({ title, time, status = "Pending", type }) => {
    const getStatusColor = (status) => {
        if (!status) return "bg-gray-100 text-gray-800";

        switch (String(status).toLowerCase()) {
            case "approved":
                return "bg-green-100 text-green-800";
            case "pending":
                return "bg-yellow-100 text-yellow-800";
            case "rejected":
                return "bg-red-100 text-red-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const getTypeIcon = (type) => {
        if (!type) return <Clock className="w-5 h-5" />;

        switch (String(type).toLowerCase()) {
            case "kkl":
                return <FileText className="w-5 h-5" />;
            case "kkn":
                return <BookOpen className="w-5 h-5" />;
            case "laporan":
                return <FileText className="w-5 h-5" />;
            default:
                return <Clock className="w-5 h-5" />;
        }
    };

    return (
        <div className="flex items-start gap-4 p-4">
            <div className="p-2 bg-gray-100 rounded-lg dark:bg-gray-700">
                {getTypeIcon(type)}
            </div>
            <div className="flex-1">
                <h4 className="font-medium text-gray-900 dark:text-gray-100">
                    {title}
                </h4>
                <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                        {time}
                    </span>
                    <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(status)}`}
                    >
                        {status || "Pending"}
                    </span>
                </div>
            </div>
        </div>
    );
};

const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-8 text-center">
        <FileText className="w-12 h-12 mb-3 text-gray-400" />
        <h3 className="mb-1 text-sm font-medium text-gray-900 dark:text-gray-100">
            Tidak ada aktivitas
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
            Tidak ada aktivitas yang ditemukan berdasarkan filter yang dipilih.
        </p>
    </div>
);

const ICONS = {
    "Total Logbooks": <FileText className="w-8 h-8 text-teal-600" />,
    "User Aktif": <Users className="w-8 h-8 text-teal-600" />,
    Bimbingans: <BookOpen className="w-8 h-8 text-teal-600" />,
    "Penyelesaian Laporan": <Layout className="w-8 h-8 text-teal-600" />,
};

const PaginationButton = ({ onClick, disabled, children }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        className={`
            px-3 py-1.5 text-sm font-medium rounded-md transition-colors
            ${
                disabled
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            }
        `}
    >
        {children}
    </button>
);

const YouTubePreview = React.memo(({ link }) => {
    if (!link) return null;

    const getYouTubeId = (url) => {
        if (!url) return false;
        const match = url.match(
            /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/,
        );
        return match && match[7].length === 11 ? match[7] : url;
    };

    const videoId = getYouTubeId(link);
    if (!videoId) return null;

    return (
        <div className="relative w-full pt-[56.25%]">
            <iframe
                className="absolute inset-0 w-full h-full rounded-lg"
                src={`https://www.youtube.com/embed/${videoId}`}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
            />
        </div>
    );
});

const Dashboard = ({
    stats,
    recentActivities,
    filters,
    latestTutorial,
    latestFaqs,
    latestPanduan,
}) => {
    const [selectedActivityFilter, setSelectedActivityFilter] = useState(
        filters?.activity || "all",
    );
    const [selectedStatusFilter, setSelectedStatusFilter] = useState(
        filters?.status || "all",
    );

    const handleFilterChange = (type, value) => {
        const newFilters = {
            activity_filter:
                type === "activity" ? value : selectedActivityFilter,
            status_filter: type === "status" ? value : selectedStatusFilter,
            page: 1,
        };

        router.get(route("admin.dashboard.index"), newFilters, {
            preserveState: true,
            preserveScroll: true,
        });

        if (type === "activity") setSelectedActivityFilter(value);
        if (type === "status") setSelectedStatusFilter(value);
    };

    const handlePageChange = (page) => {
        router.get(
            route("admin.dashboard.index"),
            {
                activity_filter: selectedActivityFilter,
                status_filter: selectedStatusFilter,
                page,
            },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    return (
        <AdminLayout title="Dashboard" currentPage="Dashboard">
            <div className="flex-1 p-4 space-y-6 md:p-6 lg:p-8">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 md:gap-6">
                    {stats.map((stat, index) => (
                        <StatCard
                            key={index}
                            {...stat}
                            icon={ICONS[stat.title]}
                        />
                    ))}
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    <div className="space-y-6 lg:col-span-2">
                        <div className="p-4 bg-white border border-gray-200 rounded-lg dark:bg-gray-800 dark:border-gray-700">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-semibold dark:text-white">
                                    <PlayCircle className="inline-block w-5 h-5 mr-2 text-teal-600" />
                                    Tutorial Terbaru
                                </h2>
                                <button
                                    onClick={() =>
                                        router.visit(
                                            route("admin.informations.index", {
                                                type: "tutorial",
                                            }),
                                        )
                                    }
                                    className="text-sm text-teal-600 hover:text-teal-700"
                                >
                                    Lihat Semua
                                </button>
                            </div>
                            {latestTutorial ? (
                                <div className="space-y-3">
                                    <YouTubePreview
                                        link={latestTutorial.link}
                                    />
                                    <h3 className="font-medium">
                                        {latestTutorial.title}
                                    </h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        {latestTutorial.description}
                                    </p>
                                </div>
                            ) : (
                                <p className="text-gray-500">
                                    Belum ada tutorial
                                </p>
                            )}
                        </div>

                        <div className="p-4 bg-white border border-gray-200 rounded-lg dark:bg-gray-800 dark:border-gray-700">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-semibold dark:text-white">
                                    <HelpCircle className="inline-block w-5 h-5 mr-2 text-teal-600" />
                                    FAQ Terbaru
                                </h2>
                                <button
                                    onClick={() =>
                                        router.visit(
                                            route("admin.informations.index", {
                                                type: "question",
                                            }),
                                        )
                                    }
                                    className="text-sm text-teal-600 hover:text-teal-700"
                                >
                                    Lihat Semua
                                </button>
                            </div>
                            {latestFaqs?.length > 0 ? (
                                <div className="grid gap-4 sm:grid-cols-2">
                                    {latestFaqs
                                        .slice(0, 3)
                                        .map((faq, index) => (
                                            <div
                                                key={index}
                                                className={`pb-3 border-b last:border-0 last:pb-0 ${
                                                    index ===
                                                        latestFaqs.length - 1 &&
                                                    index % 2 === 0
                                                        ? "sm:col-span-2"
                                                        : ""
                                                }`}
                                            >
                                                <h3 className="font-medium">
                                                    {faq.question}
                                                </h3>
                                                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                                    {faq.answer}
                                                </p>
                                            </div>
                                        ))}
                                </div>
                            ) : (
                                <p className="text-gray-500">Belum ada FAQ</p>
                            )}
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="p-4 bg-white border border-gray-200 rounded-lg dark:bg-gray-800 dark:border-gray-700">
                            <div className="flex flex-col gap-3">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-lg font-semibold dark:text-white">
                                        Aktivitas Terbaru
                                    </h2>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    <select
                                        value={selectedActivityFilter}
                                        onChange={(e) =>
                                            handleFilterChange(
                                                "activity",
                                                e.target.value,
                                            )
                                        }
                                        className="px-2 py-1 text-sm bg-gray-100 border rounded-lg dark:bg-gray-700 min-w-[100px]"
                                    >
                                        <option value="all">All Types</option>
                                        <option value="kkl">KKL</option>
                                        <option value="kkn">KKN</option>
                                    </select>
                                    <select
                                        value={selectedStatusFilter}
                                        onChange={(e) =>
                                            handleFilterChange(
                                                "status",
                                                e.target.value,
                                            )
                                        }
                                        className="px-2 py-1 text-sm bg-gray-100 border rounded-lg dark:bg-gray-700 min-w-[100px]"
                                    >
                                        <option value="all">All Status</option>
                                        <option value="pending">Pending</option>
                                        <option value="approved">
                                            Completed
                                        </option>
                                        <option value="rejected">
                                            Rejected
                                        </option>
                                    </select>
                                </div>

                                <div className="space-y-3">
                                    {recentActivities.data.length > 0 ? (
                                        recentActivities.data.map(
                                            (activity, index) => (
                                                <ActivityItem
                                                    key={index}
                                                    {...activity}
                                                    statusBadge={
                                                        <ActivityStatusBadge
                                                            status={
                                                                activity.status
                                                            }
                                                        />
                                                    }
                                                />
                                            ),
                                        )
                                    ) : (
                                        <EmptyState />
                                    )}
                                </div>

                                {recentActivities.data.length > 0 &&
                                    recentActivities.last_page > 1 && (
                                        <div className="flex items-center justify-between pt-3 mt-4 border-t">
                                            <PaginationButton
                                                onClick={() =>
                                                    handlePageChange(
                                                        recentActivities.current_page -
                                                            1,
                                                    )
                                                }
                                                disabled={
                                                    recentActivities.current_page ===
                                                    1
                                                }
                                            >
                                                <ChevronLeft className="w-4 h-4" />
                                            </PaginationButton>

                                            <span className="text-sm text-gray-600 dark:text-gray-400">
                                                {recentActivities.current_page}{" "}
                                                / {recentActivities.last_page}
                                            </span>

                                            <PaginationButton
                                                onClick={() =>
                                                    handlePageChange(
                                                        recentActivities.current_page +
                                                            1,
                                                    )
                                                }
                                                disabled={
                                                    recentActivities.current_page ===
                                                    recentActivities.last_page
                                                }
                                            >
                                                <ChevronRight className="w-4 h-4" />
                                            </PaginationButton>
                                        </div>
                                    )}
                            </div>
                        </div>

                        <div className="p-4 bg-white border border-gray-200 rounded-lg dark:bg-gray-800 dark:border-gray-700">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-semibold dark:text-white">
                                    <FileQuestion className="inline-block w-5 h-5 mr-2 text-teal-600" />
                                    Panduan Terbaru
                                </h2>
                                <button
                                    onClick={() =>
                                        router.visit(
                                            route("admin.informations.index", {
                                                type: "panduan",
                                            }),
                                        )
                                    }
                                    className="text-sm text-teal-600 hover:text-teal-700"
                                >
                                    Lihat Semua
                                </button>
                            </div>
                            {latestPanduan ? (
                                <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                                    <div>
                                        <h3 className="font-medium">
                                            {latestPanduan.title}
                                        </h3>
                                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                            {latestPanduan.description}
                                        </p>
                                    </div>
                                    <a
                                        href={`/storage/${latestPanduan.file}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-3 py-1 text-sm text-white bg-teal-600 rounded-md hover:bg-teal-700"
                                    >
                                        Lihat PDF
                                    </a>
                                </div>
                            ) : (
                                <p className="text-gray-500">
                                    Belum ada panduan
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default Dashboard;
