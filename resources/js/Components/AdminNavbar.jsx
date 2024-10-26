import { Search, UserCircle } from 'lucide-react';

export default function AdminNavbar({ title }) {
    return (
        <nav className="bg-white shadow">
            <div className="flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
                <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Cari..."
                            className="w-full py-2 pl-10 pr-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    </div>
                    <UserCircle className="w-8 h-8 text-gray-400 cursor-pointer" />
                </div>
            </div>
        </nav>
    );
}