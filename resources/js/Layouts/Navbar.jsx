import React, { useCallback, useState, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { Moon, Sun } from 'lucide-react';
import avatarProfile from '@images/avatar-profile.jpg';
import { useDarkMode } from '@/Contexts/DarkModeContext';

const NavLink = ({ href, children }) => (
    <Link
        href={route(href)}
        className="mr-4 transition-all duration-300 ease-in-out hover:underline-offset-2 hover:underline"
    >
        {children}
    </Link>
);

const AuthButton = ({ user }) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = () => setIsOpen(!isOpen);

    useEffect(() => {
        const closeDropdown = (e) => {
            if (isOpen && !e.target.closest('.avatar-dropdown')) {
                setIsOpen(false);
            }
        };

        document.addEventListener('click', closeDropdown);
        return () => document.removeEventListener('click', closeDropdown);
    }, [isOpen]);

    return user ? (
        <div className="relative avatar-dropdown">
            <button
                onClick={toggleDropdown}
                className="relative z-10 block w-8 h-8 overflow-hidden rounded-full shadow focus:outline-none"
            >
                <img className="object-cover w-full h-full" src={avatarProfile} alt="User Avatar" />
            </button>
            {isOpen && (
                <div className="absolute right-0 z-20 w-48 py-2 mt-2 text-black bg-white rounded-md shadow-xl">
                    <Link
                        href={route('profile.edit')}
                        as="button"
                        className="block w-full px-4 py-2 text-left transition-colors hover:bg-gray-100"
                    >
                        Profile
                    </Link>
                    {(user.role === 'admin' || user.role === 'superadmin') && (
                        <Link
                            href={route('admin.dashboard')}
                            as="button"
                            className="block w-full px-4 py-2 text-left transition-colors hover:bg-gray-100"
                        >
                            Dahsboard
                        </Link>
                    )}
                    <Link
                        method="post"
                        href={route('logout')}
                        as="button"
                        className="block w-full px-4 py-2 text-left text-red-500 transition-colors hover:bg-gray-100"
                    >
                        Logout
                    </Link>
                </div>
            )}
        </div>
    ) : (
        <Link href={route('login')} className="mr-4">
            <button className="px-2 py-1 text-white transition-colors bg-teal-700 rounded-md hover:bg-teal-800">
                Login
            </button>
        </Link>
    );
};

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

const Navbar = () => {
    const { auth } = usePage().props;
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    const controlNavbar = useCallback(() => {
        const currentScrollY = window.scrollY;
        setIsVisible(currentScrollY <= lastScrollY);
        setLastScrollY(currentScrollY);
    }, [lastScrollY]);

    useEffect(() => {
        window.addEventListener('scroll', controlNavbar);
        return () => window.removeEventListener('scroll', controlNavbar);
    }, [controlNavbar]);

    return (
        <nav
            className={`fixed top-0 left-0 z-50 w-full p-4 px-24 text-white transition-transform duration-300 bg-teal-600 dark:bg-gray-800 shadow-md ${isVisible ? 'translate-y-0' : '-translate-y-full'
                }`}
        >
            <div className="container flex items-center justify-between px-4 mx-auto md:px-24">
                <Link href={route('home')} className="text-2xl font-bold">
                    FILKOM
                </Link>
                <div className="items-center hidden md:flex">
                    <NavLink href="pedomans.index">Buku Pedoman</NavLink>
                    <NavLink href="logbooks.index">Logbook</NavLink>
                    <NavLink href="laporans.index">Laporan</NavLink>
                    <DarkModeToggle />
                    <AuthButton user={auth.user} />
                </div>
            </div>
        </nav>
    );
};

export default Navbar;