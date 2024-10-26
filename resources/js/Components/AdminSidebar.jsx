import { Link } from '@inertiajs/react';
import { Home, Table, BookOpen, FileText } from 'lucide-react';
const navigation = [
    { name: 'HOME', icon: Home, href: '/' },
    { name: 'INFORMASI', icon: FileText, href: '/informasi' },
    { name: 'BUKU PEDOMAN', icon: BookOpen, href: '/pedoman' },
    { name: 'LOGBOOK', icon: Table, href: '/logbook' },
];

export default function AdminSidebar() {
    return (
        <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
            <div className="flex flex-col flex-grow pt-5 overflow-y-auto bg-white">
                <div className="flex items-center flex-shrink-0 px-4">
                    <img className="w-auto h-16" src="/logo.png" alt="UNIDA BOGOR" />
                </div>
                <div className="flex flex-col flex-grow mt-5">
                    <nav className="flex-1 px-2 pb-4 space-y-1">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                to={item.href}
                                className="flex items-center px-2 py-2 text-sm font-medium text-gray-600 rounded-md group hover:bg-gray-50 hover:text-gray-900"
                            >
                                <item.icon className="w-6 h-6 mr-3" />
                                {item.name}
                            </Link>
                        ))}
                    </nav>
                </div>
            </div>
        </aside>
    );
}