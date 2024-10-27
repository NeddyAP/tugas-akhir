import { Head } from '@inertiajs/react';
import AdminNavbar from '../Components/Admin/AdminNavbar';
import AdminSidebar from '../Components/Admin/AdminSidebar';

export default function AdminLayout({ children, title, currentPage }) {
    return (
        <div className="flex min-h-screen bg-gray-50">
            <Head title={title} />
            <AdminSidebar currentLabel={title} />

            <div className="flex flex-col flex-1">
                <AdminNavbar currentPage={currentPage} />

                <main className="flex-1 p-8">
                    {children}
                </main >
            </div >
        </div >
    );
}