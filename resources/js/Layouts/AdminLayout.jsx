import { Head, usePage } from '@inertiajs/react';
import AdminNavbar from '../Components/Admin/AdminNavbar';
import AdminSidebar from '../Components/Admin/AdminSidebar';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import React, { useEffect, useState } from 'react';

export default function AdminLayout({ children, title, currentPage }) {
    const { flash } = usePage().props.flash;
    const [isCollapsed, setIsCollapsed] = useState(false);

    useEffect(() => {
        if (flash && flash.message) {
            if (flash.type === "success") {
                toast.success(flash.message, {
                    className: 'foo-bar'
                });
            } else if (flash.type === "error") {
                toast.error(flash.message, {
                    className: 'foo-bar'
                });
            }
        }
    }, [flash]);

    return (
        <div className="flex">
            <Head title={title} />
            <AdminSidebar currentLabel={title} onCollapse={setIsCollapsed} />

            <div className={`flex flex-col flex-1 ${isCollapsed ? 'ml-20' : 'ml-64'}`}>
                <AdminNavbar currentPage={currentPage} />

                <main className="flex-1 p-8">
                    {children}
                    <ToastContainer position="top-right" autoClose={3000} />
                </main>
            </div>
        </div>
    );
}