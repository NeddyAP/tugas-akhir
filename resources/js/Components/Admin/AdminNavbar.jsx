import React, { useState, useRef, useEffect, memo } from 'react';
import { ChevronRight, Settings, LogOut, User, LucideCalendar, Sun, Moon } from 'lucide-react';
import { Link, usePage } from '@inertiajs/react';
import { useDarkMode } from '@/Contexts/DarkModeContext';

const ProfileDropdown = memo(({ user, isOpen, onClose }) => (
    <div className="absolute right-0 w-48 py-1 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-700">
        <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
            <p className="font-medium text-gray-900 dark:text-white">{user.name}</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">{user.email}</p>
        </div>
        <Link className="flex items-center w-full px-4 py-2 space-x-2 text-left text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700">
            <User className="w-4 h-4" />
            <span>Profile</span>
        </Link>
        <Link className="flex items-center w-full px-4 py-2 space-x-2 text-left text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700">
            <Settings className="w-4 h-4" />
            <span>Settings</span>
        </Link>
        <Link
            method="post"
            href={route('logout')}
            as="button"
            className="flex items-center w-full px-4 py-2 space-x-2 text-left text-red-700 hover:bg-gray-100 dark:text-red-500 dark:hover:bg-gray-700"
        >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
        </Link>
    </div>
));

const DarkModeToggle = () => {
    const { darkMode, toggleDarkMode } = useDarkMode();

    return (
        <button
            onClick={toggleDarkMode}
            className="p-2 mr-4 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
        >
            {darkMode ? (
                <Sun className="w-5 h-5" />
            ) : (
                <Moon className="w-5 h-5" />
            )}
        </button>
    );
};

const AdminNavbar = memo(({ currentPage = 'Dashboard' }) => {
    const { auth: { user } } = usePage().props;
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const profileRef = useRef();

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (profileRef.current && !profileRef.current.contains(e.target)) {
                setIsProfileOpen(false);
            }
        };

        if (isProfileOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isProfileOpen]);

    return (
        <nav className="flex items-center justify-between h-16 px-8 bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
            <div className="flex items-center space-x-8">
                <div className="flex items-center text-gray-500 dark:text-gray-300">
                    <Link href={route('admin.dashboard')} className="hover:text-gray-700 dark:hover:text-gray-200">Admin</Link>
                    <ChevronRight className="w-4 h-4 mx-2 text-gray-500 dark:text-gray-300" />
                    <span className="text-gray-900 dark:text-white">{currentPage}</span>
                </div>
            </div>

            <div className="flex items-center space-x-4">
                <span className="text-gray-600 dark:text-gray-300">
                    {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
                <LucideCalendar className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                <DarkModeToggle />
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

                    {isProfileOpen && <ProfileDropdown user={user} isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />}
                </div>
            </div>
        </nav>
    );
});

AdminNavbar.displayName = 'AdminNavbar';
export default AdminNavbar;