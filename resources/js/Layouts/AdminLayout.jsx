import { Head, usePage } from '@inertiajs/react';
import AdminNavbar from '../Components/Admin/AdminNavbar';
import AdminSidebar from '../Components/Admin/AdminSidebar';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import React, { useEffect } from 'react';

export default function AdminLayout({ children, title, currentPage }) {
    const { flash } = usePage().props.flash;

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
        <div className="flex min-h-screen bg-gray-50">
            <Head title={title} />
            <AdminSidebar currentLabel={title} />

            <div className="flex flex-col flex-1">
                <AdminNavbar currentPage={currentPage} />

                <main className="flex-1 p-8">
                    {children}
                    <ToastContainer position="top-right" autoClose={3000} />
                </main >
            </div >
        </div >
    );
}