import React, { useEffect, useState, memo } from 'react';
import { Head, usePage } from '@inertiajs/react';
import { ToastContainer, toast } from "react-toastify";
import AdminNavbar from '../Components/Admin/AdminNavbar';
import AdminSidebar from '../Components/Admin/AdminSidebar';
import "react-toastify/dist/ReactToastify.css";

const AdminLayout = memo(({ children, title, currentPage }) => {
    const { flash } = usePage().props;
    const [isCollapsed, setIsCollapsed] = useState(false);

    useEffect(() => {
        if (flash?.message) {
            toast[flash.type === "success" ? "success" : "error"](flash.message);
        }
    }, [flash]);

    return (
        <div className="flex min-h-screen">
            <Head title={title} />
            <AdminSidebar currentLabel={title} onCollapse={setIsCollapsed} />

            <div className={`flex flex-col flex-1 transition-all duration-300 ${isCollapsed ? 'ml-20' : 'ml-64'}`}>
                <AdminNavbar currentPage={currentPage} />
                <main className="flex-1 p-8">
                    {children}
                    <ToastContainer position="top-right" autoClose={3000} />
                </main>
            </div>
        </div>
    );
});

AdminLayout.displayName = 'AdminLayout';
export default AdminLayout;