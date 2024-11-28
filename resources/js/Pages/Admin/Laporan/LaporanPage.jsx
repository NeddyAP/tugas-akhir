import { Suspense } from 'react';
import { router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import TabButton from '@/Components/ui/TabButton';
import DataKkl from './DataKkl';
import DataKkn from './DataKkn';
import PropTypes from 'prop-types';

const LoadingFallback = () => <div>Loading...</div>;

const TABS = [
    { type: 'kkl', label: 'KKL' },
    { type: 'kkn', label: 'KKN' }
];

export default function LaporanPage({
    kklData = null,
    kknData = null,
    type = 'kkl',
    mahasiswas = [],
    dosens = []
}) {
    const handleTabClick = (newType) => {
        router.get(
            route(route().current(), { type: newType }),
            {},
            { preserveState: true, preserveScroll: true }
        );
    };

    const renderContent = () => {
        const defaultData = { data: [], current_page: 1, last_page: 1, per_page: 10, total: 0 };
        const defaultMahasiswas = mahasiswas.map(m => ({
            value: m.id,
            label: m.name
        })) || [];

        const defaultDosens = dosens.map(d => ({
            value: d.id,
            label: d.name
        })) || [];

        switch (type) {
            case 'kkl':
                return <DataKkl
                    type="kkl"
                    title="Data KKL"
                    description="Kelola data KKL mahasiswa"
                    laporans={kklData || defaultData}
                    mahasiswas={defaultMahasiswas}
                    dosens={defaultDosens}
                />;
            case 'kkn':
                return <DataKkn
                    type="kkn"
                    title="Data KKN"
                    description="Kelola data KKN mahasiswa"
                    laporans={kknData || defaultData}
                    mahasiswas={defaultMahasiswas}
                    dosens={defaultDosens}
                />;
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
    type: PropTypes.oneOf(['kkl', 'kkn']),
    mahasiswas: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number,
        name: PropTypes.string,
    })),
    dosens: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number,
        name: PropTypes.string,
    })),
};
