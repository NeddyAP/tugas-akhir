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
        label: "Filter by Supervisor",
        emptyOption: "All Supervisors",
    },
    status: {
        label: "Filter by Submission",
        options: [
            { value: "", label: "All Status" },
            { value: "submitted", label: "Submitted" },
            { value: "null", label: "Not Submitted" },
        ],
    },
    angkatan: {
        label: "Filter by Batch",
        options: Array.from({ length: 4 }, (_, i) => {
            const year = 2021 + i;
            return { value: year.toString(), label: `Angkatan ${year}` };
        }),
    },
};

// Remove selectStyles constant and replace with Tailwind classes
const customSelectStyles = {
    control: (base) => ({
        ...base,
        '@media (prefers-color-scheme: dark)': {
            backgroundColor: '#1f2937',
            borderColor: '#374151',
        },
    }),
    menu: (base) => ({
        ...base,
        '@media (prefers-color-scheme: dark)': {
            backgroundColor: '#1f2937',
            borderColor: '#374151',
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
        router.post(
            route("admin.laporan.bulk-update"),
            {
                type,
                ids: selectedIds,
                data,
            },
            {
                preserveScroll: true,
                onSuccess: () => setSelectedIds([]),
            }
        );
    };

    const handleTabClick = (newType) => {
        router.get(
            route(route().current(), { type: newType }),
            {},
            { preserveState: true, preserveScroll: true }
        );
    };

    const handleFilterChange = (filterType, value) => {
        router.get(
            route(route().current()),
            {
                ...filters,
                type,
                [filterType]: value || undefined, // Remove empty filters
            },
            { preserveState: true }
        );
    };

    const renderGroupedStats = () => {
        if (!groupedStats) return null;

        return (
            <div className="grid grid-cols-1 gap-4 mb-4 md:grid-cols-2 lg:grid-cols-3">
                {Object.entries(groupedStats).map(([key, stats]) => (
                    <div
                        key={key}
                        className="p-4 bg-white rounded-lg shadow dark:bg-gray-800"
                    >
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {key}
                        </h3>
                        <div className="mt-2 space-y-1 text-gray-600 dark:text-gray-300">
                            <p>Total: {stats.count}</p>
                            <p>Submitted: {stats.submitted}</p>
                            <p>Not Submitted: {stats.not_submitted}</p>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    // Sort dosens by name
    const sortedDosens = useMemo(() => {
        return [...dosens].sort((a, b) => a.label.localeCompare(b.label));
    }, [dosens]);

    const renderFilters = () => (
        <div className="flex flex-wrap gap-4 mb-4">
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
                Filters:
            </h1>
            {/* Supervisor Filter */}
            <div className="w-64">
                <Select
                    value={sortedDosens.find(d => d.value.toString() === filters.pembimbing?.toString())}
                    onChange={(option) => handleFilterChange('pembimbing', option?.value)}
                    options={sortedDosens}
                    isClearable
                    placeholder={FILTERS.pembimbing.emptyOption}
                    className="react-select-container"
                    classNamePrefix="react-select"
                    styles={customSelectStyles}
                    theme={(theme) => ({
                        ...theme,
                        colors: {
                            ...theme.colors,
                            primary: '#2563eb',
                            primary25: '#e2e8f0',
                            primary50: '#e2e8f0',
                            neutral0: 'var(--tw-bg-opacity)',
                            neutral80: 'var(--tw-text-opacity)',
                        },
                    })}
                    classNames={{
                        control: ({ isFocused }) =>
                            `!bg-white dark:!bg-gray-800 !border-gray-300 dark:!border-gray-700 ${
                                isFocused 
                                    ? '!border-blue-500 !shadow-outline-blue dark:!border-blue-500' 
                                    : ''
                            }`,
                        option: ({ isFocused, isSelected }) =>
                            `${isSelected 
                                ? '!bg-blue-500 !text-white'
                                : isFocused 
                                    ? '!bg-gray-100 dark:!bg-gray-700' 
                                    : '!text-gray-900 dark:!text-gray-100'
                            }`,
                        menu: () => '!bg-white dark:!bg-gray-800 !border dark:!border-gray-700',
                        singleValue: () => '!text-gray-900 dark:!text-gray-100',
                    }}
                />
            </div>

            {/* Status Filter */}
            <div className="w-64">
                <Select
                    value={FILTERS.status.options.find(s => s.value === filters.status)}
                    onChange={(option) => handleFilterChange('status', option?.value)}
                    options={FILTERS.status.options}
                    isClearable
                    placeholder="Select Status"
                    className="react-select-container"
                    classNamePrefix="react-select"
                    styles={customSelectStyles}
                    classNames={{
                        control: ({ isFocused }) =>
                            `!bg-white dark:!bg-gray-800 !border-gray-300 dark:!border-gray-700 ${
                                isFocused 
                                    ? '!border-blue-500 !shadow-outline-blue dark:!border-blue-500' 
                                    : ''
                            }`,
                        option: ({ isFocused, isSelected }) =>
                            `${isSelected 
                                ? '!bg-blue-500 !text-white'
                                : isFocused 
                                    ? '!bg-gray-100 dark:!bg-gray-700' 
                                    : '!text-gray-900 dark:!text-gray-100'
                            }`,
                        menu: () => '!bg-white dark:!bg-gray-800 !border dark:!border-gray-700',
                        singleValue: () => '!text-gray-900 dark:!text-gray-100',
                    }}
                />
            </div>

            {/* Batch Year Filter */}
            <div className="w-64">
                <Select
                    value={FILTERS.angkatan.options.find(a => a.value === filters.angkatan)}
                    onChange={(option) => handleFilterChange('angkatan', option?.value)}
                    options={FILTERS.angkatan.options}
                    isClearable
                    placeholder="Select Batch"
                    className="react-select-container"
                    classNamePrefix="react-select"
                    styles={customSelectStyles}
                    classNames={{
                        control: ({ isFocused }) =>
                            `!bg-white dark:!bg-gray-800 !border-gray-300 dark:!border-gray-700 ${
                                isFocused 
                                    ? '!border-blue-500 !shadow-outline-blue dark:!border-blue-500' 
                                    : ''
                            }`,
                        option: ({ isFocused, isSelected }) =>
                            `${isSelected 
                                ? '!bg-blue-500 !text-white'
                                : isFocused 
                                    ? '!bg-gray-100 dark:!bg-gray-700' 
                                    : '!text-gray-900 dark:!text-gray-100'
                            }`,
                        menu: () => '!bg-white dark:!bg-gray-800 !border dark:!border-gray-700',
                        singleValue: () => '!text-gray-900 dark:!text-gray-100',
                    }}
                />
            </div>

            {/* Clear filters button */}
            {Object.keys(filters).some((key) => filters[key]) && (
                <button
                    onClick={() =>
                        router.get(
                            route(route().current()),
                            { type },
                            { preserveState: true }
                        )
                    }
                    className="px-3 py-1 text-sm text-red-600 border border-red-600 rounded dark:text-red-400 dark:border-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                    Clear Filters
                </button>
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
                    />
                );
            default:
                return null;
        }
    };

    return (
        <AdminLayout title="Laporan Management" currentPage="Laporan">
            <div className="flex gap-4 mb-4 border-b border-gray-200">
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
            {renderFilters()}
            <div className="flex flex-wrap gap-4 mb-4">
                {selectedIds.length > 0 && (
                    <div className="flex gap-2 mb-4">
                        <div className="w-64">
                            <Select
                                onChange={(option) =>
                                    handleBulkUpdate({ status: option?.value })
                                }
                                options={[
                                    { value: "pending", label: "Pending" },
                                    { value: "approved", label: "Approved" },
                                    { value: "rejected", label: "Rejected" },
                                ]}
                                isClearable
                                placeholder="Update Status"
                                className="react-select-container"
                                classNamePrefix="react-select"
                                styles={customSelectStyles}
                                classNames={{
                                    control: ({ isFocused }) =>
                                        `!bg-white dark:!bg-gray-800 !border-gray-300 dark:!border-gray-700 ${
                                            isFocused 
                                                ? '!border-blue-500 !shadow-outline-blue dark:!border-blue-500' 
                                                : ''
                                        }`,
                                    option: ({ isFocused, isSelected }) =>
                                        `${isSelected 
                                            ? '!bg-blue-500 !text-white'
                                            : isFocused 
                                                ? '!bg-gray-100 dark:!bg-gray-700' 
                                                : '!text-gray-900 dark:!text-gray-100'
                                        }`,
                                    menu: () => '!bg-white dark:!bg-gray-800 !border dark:!border-gray-700',
                                    singleValue: () => '!text-gray-900 dark:!text-gray-100',
                                }}
                            />
                        </div>
                    </div>
                )}
            </div>

            {renderGroupedStats()}

            <Suspense fallback={<LoadingFallback />}>
                {renderContent()}
            </Suspense>
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
        })
    ).isRequired,
    type: PropTypes.oneOf(["kkl", "kkn"]),
    mahasiswas: PropTypes.arrayOf(
        PropTypes.shape({
            value: PropTypes.number.isRequired,
            label: PropTypes.string.isRequired,
        })
    ).isRequired,
    dosens: PropTypes.arrayOf(
        PropTypes.shape({
            value: PropTypes.number.isRequired,
            label: PropTypes.string.isRequired,
        })
    ).isRequired,
    groupedStats: PropTypes.objectOf(
        PropTypes.shape({
            count: PropTypes.number.isRequired,
            submitted: PropTypes.number.isRequired,
            not_submitted: PropTypes.number.isRequired,
        })
    ),
};
