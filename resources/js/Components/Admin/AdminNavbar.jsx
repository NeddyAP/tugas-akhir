import React, { useState, useRef, useEffect } from 'react';
import { ChevronRight, Settings, LogOut, User, LucideCalendar } from 'lucide-react';
import { Link, usePage } from '@inertiajs/react';

const AdminNavbar = ({ currentPage = 'Dashboard' }) => {

    const user = usePage().props.auth.user;
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const profileRef = useRef();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setIsProfileOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="flex items-center justify-between h-16 px-8 bg-white border-b border-gray-200">
            <div className="flex items-center space-x-8">
                <div className="flex items-center text-gray-500">
                    <Link href={route('dashboard')} className="hover:text-gray-700">Admin</Link>
                    <ChevronRight className="w-4 h-4 mx-2" />
                    <span className="text-gray-900">{currentPage}</span>
                </div>
            </div>

            <div className="flex items-center space-x-4">
                <span className="text-gray-600">{new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })} </span>
                <LucideCalendar className='w-4 h-4' />
                <div className="relative" ref={profileRef}>
                    <button
                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                        className="flex items-center space-x-3 focus:outline-none"
                    >
                        <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full">
                            <span className="font-medium text-blue-700">
                                {user.name.charAt(0).toUpperCase()}
                            </span>
                        </div>
                    </button>

                    {isProfileOpen && (
                        <div className="absolute right-0 w-48 py-1 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg">
                            <div className="px-4 py-2 border-b border-gray-200">
                                <p className="font-medium">{user.name}</p>
                                <p className="text-sm text-gray-600">{user.email}</p>
                            </div>

                            <Link className="flex items-center w-full px-4 py-2 space-x-2 text-left text-gray-700 hover:bg-gray-100">
                                <User className="w-4 h-4" />
                                <span>Profile</span>
                            </Link>

                            <Link className="flex items-center w-full px-4 py-2 space-x-2 text-left text-gray-700 hover:bg-gray-100">
                                <Settings className="w-4 h-4" />
                                <span>Settings</span>
                            </Link>
                            <Link
                                method="post"
                                href={route('logout')}
                                as="button"
                                className="flex items-center w-full px-4 py-2 space-x-2 text-left text-red-700 hover:bg-gray-100">
                                <LogOut className="w-4 h-4" />
                                <span>Logout</span>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminNavbar;