import { Suspense, useState, useCallback } from 'react';
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

export default function LaporanPage({
    kklData = null,
    kknData = null,
    type = 'kkl'
}) {
    const [modalState, setModalState] = useState({
        isOpen: false,
        type: type,
        editingData: null
    });

    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        type: type,
        keterangan: '',
    });

    const handleTabClick = (tab) => {
        const newType = tab.toLowerCase();
        setModalState(prev => ({ ...prev, type: newType }));
        router.get(
            route(route().current(), { type: newType }),
            {},
            { preserveState: true }
        );
    };

    const handleSubmit = useCallback((e) => {
        e.preventDefault();

        const options = {
            preserveScroll: true,
            onSuccess: () => {
                setModalState(prev => ({ ...prev, isOpen: false, editingData: null }));
                reset();
            }
        };

        if (modalState.editingData) {
            put(route('laporan.update', modalState.editingData.id), data, options);
        } else {
            post(route('laporan.store'), { ...data, type: modalState.type }, options);
        }
    }, [modalState, data, post, put, reset]);

    const handleModal = useCallback((editingData = null) => {
        setModalState(prev => ({
            isOpen: true,
            type: prev.type,
            editingData
        }));

        if (editingData?.laporan) {
            setData({
                type: modalState.type,
                keterangan: editingData.laporan.keterangan || '',
            });
        } else {
            reset();
            setData('type', modalState.type);
        }
    }, [modalState.type, setData, reset]);

    const currentData = type === 'kkl' ?
        (kklData?.data?.[0] ?? null) :
        (kknData?.data?.[0] ?? null);

    return (
        <FrontLayout>
            <Head title={`Laporan ${type.toUpperCase()}`} />
            <div className="max-w-6xl p-6 mx-auto my-20">
                <div className="mb-6">
                    <nav className="flex p-1.5 bg-gray-100 rounded-lg dark:bg-gray-800/50 w-fit">
                        {TABS.map((tab) => (
                            <button
                                key={tab}
                                type="button"
                                className={`flex whitespace-nowrap items-center h-8 px-5 font-medium rounded-lg outline-none focus:ring-2 focus:ring-teal-600 focus:ring-inset ${type === tab.toLowerCase()
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

                <LaporanCard
                    data={currentData}
                    type={type}
                    onEdit={handleModal}
                    processing={processing}
                />

                <GenericModal
                    isOpen={modalState.isOpen}
                    onClose={() => {
                        setModalState(prev => ({ ...prev, isOpen: false, editingData: null }));
                        reset();
                        clearErrors();
                    }}
                    title={`${modalState.editingData ? 'Update' : 'Tambah'} Keterangan ${modalState.type.toUpperCase()}`}
                    fields={[
                        {
                            name: 'keterangan',
                            label: 'Keterangan',
                            type: 'textarea',
                            rows: 3
                        }
                    ]}
                    data={data}
                    setData={setData}
                    errors={errors}
                    processing={processing}
                    handleSubmit={handleSubmit}
                />
            </div>
        </FrontLayout>
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