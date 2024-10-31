import React from 'react';
import { Layout } from 'lucide-react';
import StatCard from '@/Components/Admin/StatCard';
import AdminLayout from '@/Layouts/AdminLayout';
const Dashboard = () => {
    return (
        <AdminLayout title="Dashboard" currentPage="Dashboard">
            <div className="flex flex-col flex-1">
                <main className="flex-1 p-8">
                    <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-3">
                        <StatCard
                            icon={<Layout className="w-8 h-8 text-gray-400" />}
                            title="Finished"
                            value="18"
                            change="+8 tasks"
                            changeType="increase"
                        />
                        <StatCard
                            icon={<Layout className="w-8 h-8 text-gray-400" />}
                            title="Tracked"
                            value="31h"
                            change="-6 hours"
                            changeType="decrease"
                        />
                        <StatCard
                            icon={<Layout className="w-8 h-8 text-gray-400" />}
                            title="Efficiency"
                            value="93%"
                            change="+12%"
                            changeType="increase"
                        />
                    </div>

                    {/* Table here */}
                </main>
            </div>
        </AdminLayout>
    );
};

export default Dashboard;