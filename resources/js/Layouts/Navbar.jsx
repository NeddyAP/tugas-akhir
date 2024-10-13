import React, { useEffect, useRef, useCallback, Fragment } from "react";
import { Link, usePage } from "@inertiajs/react";
import { UserCircle } from "lucide-react";
import { Menu, Transition } from '@headlessui/react';

export default function Navbar() {
    const user = usePage().props.auth.user;
    const navbarRef = useRef(null);

    const handleScroll = useCallback(() => {
        let lastScrollTop = 0;

        return () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            if (navbarRef.current) {
                navbarRef.current.style.transform = scrollTop > lastScrollTop ? 'translateY(-100%)' : 'translateY(0)';
            }
            lastScrollTop = scrollTop;
        };
    }, []);

    useEffect(() => {
        const debouncedHandleScroll = debounce(handleScroll(), 200);
        window.addEventListener('scroll', debouncedHandleScroll);

        return () => {
            window.removeEventListener('scroll', debouncedHandleScroll);
        };
    }, [handleScroll]);

    return (
        <nav
            ref={navbarRef}
            id="navbar"
            className="fixed top-0 left-0 z-50 w-full p-4 px-4 text-white transition-transform duration-300 bg-teal-600 shadow-md md:px-48"
        >
            <div className="container flex items-center justify-between mx-auto">
                <Link href={route('home')} className="text-2xl font-bold">FILKOM</Link>
                <div className="items-center hidden md:flex">
                    <Link href={route('pedoman.index')} className="mr-4 transition-all duration-300 ease-in-out hover:underline-offset-2 hover:underline">Buku Pedoman</Link>
                    <Link href={route('logbook.index')} className="mr-4 transition-all duration-300 ease-in-out hover:underline-offset-2 hover:underline">Logbook</Link>
                    <Link href={route('laporan.index')} className="mr-4 transition-all duration-300 ease-in-out hover:underline-offset-2 hover:underline">Laporan</Link>
                    {user ? (
                        <Link
                            method="post"
                            href={route('logout')}
                            as="button"
                            className="px-2 py-1 font-bold text-red-500 transition-colors rounded-md hover:text-red-600"
                        >
                            Logout
                        </Link>
                    ) : (
                        <Link href={route('login')} className="mr-4">
                            <button className="px-2 py-1 text-white transition-colors bg-teal-700 rounded-md hover:bg-teal-800">Login</button>
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
}

// Utility function to debounce a function
function debounce(func, wait) {
    let timeout;
    return function (...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}