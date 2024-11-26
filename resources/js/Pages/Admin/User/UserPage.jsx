import { Suspense, useMemo } from 'react';
import { router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import TabButton from '@/Components/ui/TabButton';
import Admin from './Admin';
import Dosen from './Dosen';
import Mahasiswa from './Mahasiswa';
import AllData from './AllData';

const LoadingFallback = () => (
    <div className="flex items-center justify-center w-full h-32">
        <div className="w-8 h-8 border-4 border-teal-500 rounded-full animate-spin border-t-transparent"></div>
    </div>
);

const TABS = [
    { type: 'all', label: 'Semua Data' },
    { type: 'mahasiswa', label: 'Mahasiswa' },
    { type: 'dosen', label: 'Dosen' },
    { type: 'admin', label: 'Admin' },
];

const UserPage = ({ users, dosens, mahasiswas, allUsers, tab = 'admin' }) => {
    const handleTabClick = (newType) => {
        router.get(
            route(route().current(), { tab: newType }),
            {},
            { preserveState: true, preserveScroll: true }
        );
    };

    const content = useMemo(() => ({
        admin: <Admin users={users} />,
        dosen: <Dosen users={dosens} />,
        mahasiswa: <Mahasiswa users={mahasiswas} />,
        all: <AllData users={allUsers} />
    }), [users, dosens, mahasiswas, allUsers]);

    return (
        <AdminLayout title="Users Management" currentPage="Users">
            <div className="grid grid-cols-1 mb-8">
                <div className="flex flex-col gap-8">
                    <div className="overflow-x-auto">
                        <div className="flex flex-wrap gap-2 p-4 mb-4 border-b border-gray-200 sm:gap-4 min-w-max sm:p-0">
                            {TABS.map(({ type, label }) => (
                                <TabButton
                                    key={type}
                                    active={tab === type}
                                    onClick={() => handleTabClick(type)}
                                    variant="solid"
                                    className="px-3 py-2 text-sm transition-all duration-200 sm:text-base sm:px-4"
                                >
                                    {label}
                                </TabButton>
                            ))}
                        </div>
                    </div>

                    <Suspense fallback={<LoadingFallback />}>
                        {content[tab]}
                    </Suspense>
                </div>
            </div>
        </AdminLayout>
    );
};

export default UserPage;