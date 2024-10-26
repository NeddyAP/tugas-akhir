import AdminNavbar from '../Components/AdminNavbar';
import AdminSidebar from '../Components/AdminSidebar';

export default function AdminLayout({ children, title }) {
    return (
        <div className="min-h-screen bg-gray-100">
            <AdminSidebar />
            <div className="flex flex-col flex-1 md:pl-64">
                <AdminNavbar title={title} />
                <main className="flex-1 pb-8">
                    <div className="px-4 mt-8 sm:px-6 lg:px-8">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}