import { Suspense, useState, useEffect, useMemo } from "react";
import { router } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import TabButton from "@/Components/ui/TabButton";
import DataKkl from "./DataKkl";
import DataKkn from "./DataKkn";
import PropTypes from "prop-types";
import Select from "react-select";

const LoadingFallback = () => <div>Loading...</div>;

const TABS = [
    { type: "kkl", label: "KKL" },
    { type: "kkn", label: "KKN" },
];

const FILTERS = {
    pembimbing: {
        label: "Filter by Pembimbing",
        emptyOption: "Semua Dosen",
    },
    status: {
        label: "Filter by Status",
        options: [
            { value: "submitted", label: "Sudah Mengumpulkan" },
            { value: "null", label: "Belum Mengumpulkan" },
        ],
    },
    angkatan: {
        label: "Filter by Angkatan",
        options: (() => {
            const currentYear = new Date().getFullYear();
            const startYear = 2021;
            const years = [];
            for (let year = currentYear; year >= startYear; year--) {
                years.push({
                    value: year.toString(),
                    label: `Angkatan ${year}`,
                });
            }
            return years;
        })(),
    },
};

const customSelectStyles = {
    control: (base) => ({
        ...base,
        "@media (prefers-color-scheme: dark)": {
            backgroundColor: "#1f2937",
            borderColor: "#374151",
        },
    }),
    menu: (base) => ({
        ...base,
        "@media (prefers-color-scheme: dark)": {
            backgroundColor: "#1f2937",
            borderColor: "#374151",
        },
    }),
};

export default function LaporanPage({
    kklData = null,
    kknData = null,
    allLaporansData = [],
    type = "kkl",
    mahasiswas = [],
    dosens = [],
    filters = {},
    groupedStats = null,
}) {
    const [selectedIds, setSelectedIds] = useState([]);

    const handleBulkUpdate = async (data) => {
        if (!data || Object.keys(data).length === 0) {
            return;
        }

        router.post(
            route("admin.laporan.bulk-update"),
            {
                type,
                ids: selectedIds,
                data,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setSelectedIds([]);
                },
                onError: (errors) => {
                    console.error(errors);
                },
            },
        );
    };

    const handleTabClick = (newType) => {
        router.get(
            route(route().current(), { type: newType }),
            {},
            { preserveState: true, preserveScroll: true },
        );
    };

    const handleFilterChange = (filterType, value) => {
        router.get(
            route(route().current()),
            {
                ...filters,
                type,
                [filterType]: value || undefined,
            },
            { preserveState: true },
        );
    };

    const renderGroupedStats = () => {
        if (!groupedStats) return null;

        return (
            <div className="grid grid-cols-1 gap-4 mb-6">
                {Object.entries(groupedStats).map(([key, stats]) => (
                    <div
                        key={key}
                        className="p-4 bg-white rounded-lg shadow dark:bg-gray-800"
                    >
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                {key}
                            </h3>
                            <div className="flex gap-4">
                                <div className="text-sm">
                                    <span className="text-gray-500 dark:text-gray-400">
                                        Total:{" "}
                                    </span>
                                    <span className="font-medium text-gray-900 dark:text-white">
                                        {stats.count}
                                    </span>
                                </div>
                                <div className="text-sm">
                                    <span className="text-gray-500 dark:text-gray-400">
                                        Sudah Mengumpulkan:{" "}
                                    </span>
                                    <span className="font-medium text-green-600 dark:text-green-400">
                                        {stats.submitted}
                                    </span>
                                </div>
                                <div className="text-sm">
                                    <span className="text-gray-500 dark:text-gray-400">
                                        Belum Mengumpulkan:{" "}
                                    </span>
                                    <span className="font-medium text-red-600 dark:text-red-400">
                                        {stats.not_submitted}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    const sortedDosens = useMemo(() => {
        return [...dosens].sort((a, b) => a.label.localeCompare(b.label));
    }, [dosens]);

    const renderFilters = () => (
        <div className="mb-6">
            <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">
                Filters
            </h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {/* Pembimbinga Filter */}
                <div>
                    <Select
                        value={sortedDosens.find(
                            (d) =>
                                d.value.toString() ===
                                filters.pembimbing?.toString(),
                        )}
                        onChange={(option) =>
                            handleFilterChange("pembimbing", option?.value)
                        }
                        options={sortedDosens}
                        isClearable
                        placeholder="Pilih Dosen"
                        className="react-select-container"
                        classNamePrefix="react-select"
                        styles={customSelectStyles}
                        theme={(theme) => ({
                            ...theme,
                            colors: {
                                ...theme.colors,
                                primary: "#2563eb",
                                primary25: "#e2e8f0",
                                primary50: "#e2e8f0",
                                neutral0: "var(--tw-bg-opacity)",
                                neutral80: "var(--tw-text-opacity)",
                            },
                        })}
                        classNames={{
                            control: ({ isFocused }) =>
                                `!bg-white dark:!bg-gray-800 !border-gray-300 dark:!border-gray-700 ${
                                    isFocused
                                        ? "!border-blue-500 !shadow-outline-blue dark:!border-blue-500"
                                        : ""
                                }`,
                            option: ({ isFocused, isSelected }) =>
                                `${
                                    isSelected
                                        ? "!bg-blue-500 !text-white"
                                        : isFocused
                                          ? "!bg-gray-100 dark:!bg-gray-700"
                                          : "!text-gray-900 dark:!text-gray-100"
                                }`,
                            menu: () =>
                                "!bg-white dark:!bg-gray-800 !border dark:!border-gray-700",
                            singleValue: () =>
                                "!text-gray-900 dark:!text-gray-100",
                        }}
                    />
                </div>

                {/* Status Filter */}
                <div>
                    <Select
                        value={FILTERS.status.options.find(
                            (s) => s.value === filters.status,
                        )}
                        onChange={(option) =>
                            handleFilterChange("status", option?.value)
                        }
                        options={FILTERS.status.options}
                        isClearable
                        placeholder="Pilih Status"
                        className="react-select-container"
                        classNamePrefix="react-select"
                        styles={customSelectStyles}
                        classNames={{
                            control: ({ isFocused }) =>
                                `!bg-white dark:!bg-gray-800 !border-gray-300 dark:!border-gray-700 ${
                                    isFocused
                                        ? "!border-blue-500 !shadow-outline-blue dark:!border-blue-500"
                                        : ""
                                }`,
                            option: ({ isFocused, isSelected }) =>
                                `${
                                    isSelected
                                        ? "!bg-blue-500 !text-white"
                                        : isFocused
                                          ? "!bg-gray-100 dark:!bg-gray-700"
                                          : "!text-gray-900 dark:!text-gray-100"
                                }`,
                            menu: () =>
                                "!bg-white dark:!bg-gray-800 !border dark:!border-gray-700",
                            singleValue: () =>
                                "!text-gray-900 dark:!text-gray-100",
                        }}
                    />
                </div>

                {/* Angkatan Filter */}
                <div>
                    <Select
                        value={FILTERS.angkatan.options.find(
                            (a) => a.value === filters.angkatan,
                        )}
                        onChange={(option) =>
                            handleFilterChange("angkatan", option?.value)
                        }
                        options={FILTERS.angkatan.options}
                        isClearable
                        placeholder="Pilih Angkatan"
                        className="react-select-container"
                        classNamePrefix="react-select"
                        styles={customSelectStyles}
                        classNames={{
                            control: ({ isFocused }) =>
                                `!bg-white dark:!bg-gray-800 !border-gray-300 dark:!border-gray-700 ${
                                    isFocused
                                        ? "!border-blue-500 !shadow-outline-blue dark:!border-blue-500"
                                        : ""
                                }`,
                            option: ({ isFocused, isSelected }) =>
                                `${
                                    isSelected
                                        ? "!bg-blue-500 !text-white"
                                        : isFocused
                                          ? "!bg-gray-100 dark:!bg-gray-700"
                                          : "!text-gray-900 dark:!text-gray-100"
                                }`,
                            menu: () =>
                                "!bg-white dark:!bg-gray-800 !border dark:!border-gray-700",
                            singleValue: () =>
                                "!text-gray-900 dark:!text-gray-100",
                        }}
                    />
                </div>
            </div>

            {/* Clear filters button */}
            {Object.keys(filters).some((key) => filters[key]) && (
                <div className="mt-3">
                    <button
                        onClick={() =>
                            router.get(
                                route(route().current()),
                                { type },
                                { preserveState: true },
                            )
                        }
                        className="px-3 py-1 text-sm text-red-600 border border-red-600 rounded dark:text-red-400 dark:border-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                        Clear Filters
                    </button>
                </div>
            )}
        </div>
    );

    const renderContent = () => {
        const defaultData = {
            data: [],
            current_page: 1,
            last_page: 1,
            per_page: 10,
            total: 0,
        };
        const defaultMahasiswas = mahasiswas || [];
        const defaultDosens = dosens || [];

        switch (type) {
            case "kkl":
                return (
                    <DataKkl
                        type="kkl"
                        title="Data KKL"
                        description="Kelola data KKL mahasiswa"
                        laporans={kklData || defaultData}
                        allLaporans={allLaporansData}
                        mahasiswas={defaultMahasiswas}
                        dosens={defaultDosens}
                        selectedIds={selectedIds}
                        onSelectedIdsChange={setSelectedIds}
                        onBulkUpdate={handleBulkUpdate}
                    />
                );
            case "kkn":
                return (
                    <DataKkn
                        type="kkn"
                        title="Data KKN"
                        description="Kelola data KKN mahasiswa"
                        laporans={kknData || defaultData}
                        allLaporans={allLaporansData}
                        mahasiswas={defaultMahasiswas}
                        dosens={defaultDosens}
                        selectedIds={selectedIds}
                        onSelectedIdsChange={setSelectedIds}
                        onBulkUpdate={handleBulkUpdate}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <AdminLayout title="Laporan Management" currentPage="Laporan">
            <div className="space-y-6">
                {/* Tabs */}
                <div className="flex gap-4 border-b border-gray-200">
                    {TABS.map(({ type: tabType, label }) => (
                        <TabButton
                            key={tabType}
                            active={type === tabType}
                            onClick={() => handleTabClick(tabType)}
                            variant="solid"
                        >
                            {label}
                        </TabButton>
                    ))}
                </div>

                {/* Stats Panel */}
                {renderGroupedStats()}

                {/* Filters Panel */}
                {renderFilters()}

                {/* Bulk Actions Panel */}
                {selectedIds?.length > 0 && (
                    <div className="p-4 mb-6 rounded-lg bg-gray-50 dark:bg-gray-800">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600 dark:text-gray-300">
                                {selectedIds.length} item(s) selected
                            </span>
                            <div className="flex items-center gap-4">
                                {/* ... bulk action controls ... */}
                            </div>
                        </div>
                    </div>
                )}

                {/* Content */}
                <Suspense fallback={<LoadingFallback />}>
                    {renderContent()}
                </Suspense>
            </div>
        </AdminLayout>
    );
}

LaporanPage.propTypes = {
    kklData: PropTypes.shape({
        data: PropTypes.array,
        current_page: PropTypes.number,
        last_page: PropTypes.number,
        per_page: PropTypes.number,
        total: PropTypes.number,
        from: PropTypes.number,
        to: PropTypes.number,
    }),
    kknData: PropTypes.shape({
        data: PropTypes.array,
        current_page: PropTypes.number,
        last_page: PropTypes.number,
        per_page: PropTypes.number,
        total: PropTypes.number,
        from: PropTypes.number,
        to: PropTypes.number,
    }),
    allLaporansData: PropTypes.arrayOf(
        PropTypes.shape({
            user_id: PropTypes.number.isRequired,
            type: PropTypes.string.isRequired,
        }),
    ).isRequired,
    type: PropTypes.oneOf(["kkl", "kkn"]),
    mahasiswas: PropTypes.arrayOf(
        PropTypes.shape({
            value: PropTypes.number.isRequired,
            label: PropTypes.string.isRequired,
        }),
    ).isRequired,
    dosens: PropTypes.arrayOf(
        PropTypes.shape({
            value: PropTypes.number.isRequired,
            label: PropTypes.string.isRequired,
        }),
    ).isRequired,
    groupedStats: PropTypes.objectOf(
        PropTypes.shape({
            count: PropTypes.number.isRequired,
            submitted: PropTypes.number.isRequired,
            not_submitted: PropTypes.number.isRequired,
        }),
    ),
};
