import { Suspense, useState } from 'react';
import { router } from '@inertiajs/react';
import FrontLayout from "@/Layouts/FrontLayout";
import { Head } from "@inertiajs/react";
import LaporanCard from './LaporanCard';
import GenericModal from '@/Components/ui/GenericModal';
import { useForm } from '@inertiajs/react';
import PropTypes from 'prop-types';

const LoadingFallback = () => (
    <div className="animate-pulse">
        <div className="h-48 mb-4 bg-gray-200 rounded-lg dark:bg-gray-700"></div>
    </div>
);

const TABS = ['KKL', 'KKN'];

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

export default function LaporanPage({
    kklData = null,
    kknData = null,
    type = 'kkl'
}) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        type: type,
        file: null,
        keterangan: '',
    });

    const handleTabClick = (tab) => {
        const newType = tab.toLowerCase();
        router.get(
            route(route().current(), { type: newType }),
            {},
            { preserveState: true }
        );
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('laporan.store'), {
            preserveScroll: true,
            onSuccess: () => {
                setIsModalOpen(false);
                reset();
            },
        });
    };

    const currentData = type === 'kkl' ?
        (kklData?.data?.[0] ?? null) :
        (kknData?.data?.[0] ?? null);

    const renderContent = () => {
        if (!currentData) {
            return (
                <div className="py-8 text-center">
                    <div className="max-w-sm p-6 mx-auto bg-white border rounded-xl dark:bg-gray-800/50 dark:border-gray-700">
                        <p className="mb-4 text-gray-600 dark:text-gray-400">
                            Anda belum memiliki laporan {type.toUpperCase()}
                        </p>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white transition-colors bg-teal-500 rounded-lg hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                        >
                            Upload Laporan
                        </button>
                    </div>
                </div>
            );
        }

        return <LaporanCard data={currentData} type={type} />;
    };

    return (
        <>
            <Head title={`Laporan ${type.toUpperCase()}`} />
            <FrontLayout>
                <div className="max-w-4xl px-4 py-6 mx-auto">
                    <div className="flex items-center justify-between mb-6">
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                            Laporan
                        </h1>
                    </div>

                    <div className="flex justify-center mb-6">
                        <nav className="flex items-center p-1 space-x-1 overflow-x-auto text-sm text-gray-600 bg-gray-200 rtl:space-x-reverse rounded-xl dark:bg-gray-500/20">
                            {TABS.map((tab) => (
                                <button
                                    key={tab}
                                    role="tab"
                                    type="button"
                                    className={`flex whitespace-nowrap items-center h-8 px-5 font-medium rounded-lg outline-none focus:ring-2 focus:ring-teal-600 focus:ring-inset ${
                                        type === tab.toLowerCase()
                                            ? 'text-teal-600 shadow bg-white dark:text-white dark:bg-teal-600'
                                            : 'hover:text-gray-800 focus:text-teal-600 dark:text-gray-400 dark:hover:text-gray-300 dark:focus:text-gray-400'
                                    }`}
                                    onClick={() => handleTabClick(tab)}
                                >
                                    {tab}
                                </button>
                            ))}
                        </nav>
                    </div>

                    <Suspense fallback={<LoadingFallback />}>
                        {renderContent()}
                    </Suspense>

                    <GenericModal
                        isOpen={isModalOpen}
                        onClose={() => {
                            setIsModalOpen(false);
                            reset();
                        }}
                        title={`Upload Laporan ${type.toUpperCase()}`}
                        type="create"
                        fields={MODAL_FIELDS}
                        data={{ ...data, type }}
                        setData={setData}
                        errors={errors}
                        processing={processing}
                        handleSubmit={handleSubmit}
                    />
                </div>
            </FrontLayout>
        </>
    );
}

LaporanPage.propTypes = {
    kklData: PropTypes.shape({
        data: PropTypes.array,
    }),
    kknData: PropTypes.shape({
        data: PropTypes.array,
    }),
    type: PropTypes.oneOf(['kkl', 'kkn']),
};