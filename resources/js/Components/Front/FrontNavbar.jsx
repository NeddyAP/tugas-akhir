import React, { useCallback, useState, useEffect } from "react";
import { Link, usePage } from "@inertiajs/react";
import { Menu, X } from "lucide-react";
import avatarProfile from "@images/avatar-profile.jpg";
import DarkmodeToggle from "../ui/DarkmodeToggle";

const NavLink = ({ href, children }) => (
    <Link
        href={route(href)}
        className="text-white transition-all duration-300 ease-in-out hover:underline-offset-2 hover:underline"
    >
        {children}
    </Link>
);

const AuthButton = ({ user }) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = () => setIsOpen(!isOpen);

    useEffect(() => {
        const closeDropdown = (e) => {
            if (isOpen && !e.target.closest(".avatar-dropdown")) {
                setIsOpen(false);
            }
        };

        document.addEventListener("click", closeDropdown);
        return () => document.removeEventListener("click", closeDropdown);
    }, [isOpen]);

    return user ? (
        <div className="relative avatar-dropdown">
            <button
                onClick={toggleDropdown}
                className="relative z-10 block w-8 h-8 overflow-hidden rounded-full shadow focus:outline-none"
            >
                <img
                    className="object-cover w-full h-full"
                    src={avatarProfile}
                    alt="User Avatar"
                />
            </button>
            {isOpen && (
                <div className="absolute right-0 z-20 w-48 py-2 mt-2 text-black bg-white rounded-md shadow-xl dark:text-white dark:bg-gray-700">
                    <Link
                        href={route("profile.edit")}
                        as="button"
                        className="block w-full px-4 py-2 text-left transition-colors hover:bg-gray-100 dark:hover:bg-gray-600"
                    >
                        Profile
                    </Link>
                    {(user.role === "admin" || user.role === "superadmin") && (
                        <Link
                            href={route("admin.dashboard")}
                            as="button"
                            className="block w-full px-4 py-2 text-left transition-colors hover:bg-gray-100 dark:hover:bg-gray-600"
                        >
                            Dahsboard
                        </Link>
                    )}
                    <Link
                        method="post"
                        href={route("logout")}
                        as="button"
                        className="block w-full px-4 py-2 text-left text-red-500 transition-colors hover:bg-gray-100 dark:hover:bg-gray-600"
                    >
                        Logout
                    </Link>
                </div>
            )}
        </div>
    ) : (
        <Link href={route("login")} className="mr-4">
            <button className="px-2 py-1 text-white transition-colors bg-teal-700 rounded-md hover:bg-teal-800">
                Login
            </button>
        </Link>
    );
};

const MobileMenu = ({ isOpen, onClose, user }) => (
    <div
        className={`fixed inset-0 z-50 transform ${
            isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out lg:hidden`}
    >
        <div
            className="absolute inset-0 backdrop-blur-sm bg-black/50"
            onClick={onClose}
        ></div>
        <div className="absolute inset-y-0 left-0 px-6 py-4 bg-white shadow-lg w-72 dark:bg-gray-800">
            <div className="flex flex-col h-full">
                <div className="flex items-center justify-between mb-8">
                    <Link
                        href={route("home")}
                        className="text-2xl font-bold text-teal-600 dark:text-white"
                    >
                        FILKOM
                    </Link>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>
                <nav className="flex flex-col space-y-4">
                    <Link
                        href={route("pedoman")}
                        className="text-gray-800 dark:text-white hover:text-teal-600 dark:hover:text-teal-400"
                    >
                        Buku Pedoman
                    </Link>
                    <Link
                        href={route("logbook.index")}
                        className="text-gray-800 dark:text-white hover:text-teal-600 dark:hover:text-teal-400"
                    >
                        Logbook
                    </Link>
                    <Link
                        href={route("laporan.index")}
                        className="text-gray-800 dark:text-white hover:text-teal-600 dark:hover:text-teal-400"
                    >
                        Laporan
                    </Link>
                </nav>
            </div>
        </div>
    </div>
);

const FrontNavbar = () => {
    const { auth } = usePage().props;
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const controlNavbar = useCallback(() => {
        const currentScrollY = window.scrollY;
        setIsVisible(currentScrollY <= lastScrollY);
        setLastScrollY(currentScrollY);
    }, [lastScrollY]);

    useEffect(() => {
        window.addEventListener("scroll", controlNavbar);
        return () => window.removeEventListener("scroll", controlNavbar);
    }, [controlNavbar]);

    return (
        <>
            <nav
                className={`fixed top-0 left-0 z-40 w-full transition-transform duration-300 bg-teal-600 dark:bg-gray-800 shadow-md ${
                    isVisible ? "translate-y-0" : "-translate-y-full"
                }`}
            >
                <div className="container max-w-6xl px-8 py-3 mx-auto sm:px-12 md:px-16 lg:px-24 xl:px-32">
                    <div className="flex items-center justify-between">
                        <Link
                            href={route("home")}
                            className="text-xl font-bold text-white sm:text-2xl"
                        >
                            FILKOM
                        </Link>

                        <div className="flex items-center space-x-2 sm:space-x-4">
                            <div className="hidden lg:flex lg:items-center lg:space-x-4">
                                <NavLink href="pedoman">Buku Pedoman</NavLink>
                                <NavLink href="logbook.index">Logbook</NavLink>
                                <NavLink href="laporan.index">Laporan</NavLink>
                            </div>
                            <DarkmodeToggle />
                            <AuthButton user={auth.user} />
                            <button
                                className="p-2 text-white rounded-md lg:hidden hover:bg-teal-700 dark:hover:bg-gray-700"
                                onClick={() => setIsMobileMenuOpen(true)}
                            >
                                <Menu className="w-6 h-6" />
                            </button>
                        </div>
                    </div>
                </div>
            </nav>
            <MobileMenu
                isOpen={isMobileMenuOpen}
                onClose={() => setIsMobileMenuOpen(false)}
                user={auth.user}
            />
        </>
    );
};

export default FrontNavbar;
