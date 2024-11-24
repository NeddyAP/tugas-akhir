import { Suspense } from 'react';
import { router } from '@inertiajs/react';

import AdminLayout from '@/Layouts/AdminLayout';
import TabButton from '@/Components/ui/TabButton';
import Admin from './Admin';
import Dosen from './Dosen';
import Mahasiswa from './Mahasiswa';
import AllData from './AllData';

const LoadingFallback = () => <div>Loading...</div>;

const TABS = [
    { type: 'all', label: 'Semua Data' },
    { type: 'mahasiswa', label: 'Mahasiswa' },
    { type: 'dosen', label: 'Dosen' },
    { type: 'admin', label: 'Admin' },
];

export default function UserPage({ users, dosens, mahasiswas, allUsers, tab = 'admin' }) {
    const handleTabClick = (newType) => {
        router.get(
            route(route().current(), { tab: newType }),
            {},
            { preserveState: true, preserveScroll: true }
        );
    };

    const renderContent = () => {
        const contents = {
            admin: <Admin users={users} />,
            dosen: <Dosen users={dosens} />,
            mahasiswa: <Mahasiswa users={mahasiswas} />,
            all: <AllData users={allUsers} />
        };
        return contents[tab];
    };

    return (
        <AdminLayout title="Users Management" currentPage="Users">
            <div className="flex gap-4 mb-4 border-b border-gray-200">
                {TABS.map(({ type, label }) => (
                    <TabButton
                        key={type}
                        active={tab === type}
                        onClick={() => handleTabClick(type)}
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