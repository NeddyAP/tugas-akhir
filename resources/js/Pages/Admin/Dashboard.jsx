import React from "react";
import { Layout } from "lucide-react";
import StatCard from "@/Components/Admin/StatCard";
import AdminLayout from "@/Layouts/AdminLayout";

const STATS_DATA = [
    {
        title: "Finished",
        value: "18",
        change: "+8 tasks",
        changeType: "increase",
    },
    {
        title: "Tracked",
        value: "31h",
        change: "-6 hours",
        changeType: "decrease",
    },
    {
        title: "Efficiency",
        value: "93%",
        change: "+12%",
        changeType: "increase",
    },
];

const Dashboard = () => (
    <AdminLayout title="Dashboard" currentPage="Dashboard">
        <div className="flex-1 p-8">
            <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-3">
                {STATS_DATA.map((stat, index) => (
                    <StatCard
                        key={index}
                        icon={<Layout className="w-8 h-8 text-gray-400" />}
                        {...stat}
                    />
                ))}
            </div>
        </div>
    </AdminLayout>
);

export default Dashboard;
