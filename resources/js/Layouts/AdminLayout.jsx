import React, { useEffect, useState, memo } from 'react';
import { Head, usePage } from '@inertiajs/react';
import { toast } from "react-toastify";
import AdminNavbar from '../Components/Admin/AdminNavbar';
import AdminSidebar from '../Components/Admin/AdminSidebar';
import { Toast } from "@/Components/ToastConfig";
import { DarkModeProvider } from '@/Contexts/DarkModeContext';

const AdminLayout = memo(({ children, title, currentPage }) => {
    const { flash } = usePage().props;
    const [isCollapsed, setIsCollapsed] = useState(false);

    useEffect(() => {
        if (flash?.type && flash?.message) {
            const validTypes = ['success', 'error', 'info', 'warning'];
            const toastType = validTypes.includes(flash.type) ? flash.type : 'info';

            toast[toastType](flash.message, {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        }
    }, [flash]);

    return (
        <DarkModeProvider>
            <div className="flex min-h-screen bg-white dark:bg-gray-900">
                <Head title={title} />
                <AdminSidebar currentLabel={title} onCollapse={setIsCollapsed} />

                <div className={`flex flex-col flex-1 transition-all duration-300 dark:text-white ${isCollapsed ? 'ml-20' : 'ml-64'}`}>
                    <AdminNavbar currentPage={currentPage} />
                    <main className="flex-1 p-8">
                        {children}
                        <Toast />
                    </main>
                </div>
            </div>
        </DarkModeProvider>
    );
});

AdminLayout.displayName = 'AdminLayout';
export default AdminLayout;