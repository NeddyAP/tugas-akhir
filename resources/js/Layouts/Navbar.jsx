import React, { useEffect, useRef, useState } from "react";
import { Link, usePage } from "@inertiajs/react";

export default function Navbar() {
    const user = usePage().props.auth.user;
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    useEffect(() => {
        const controlNavbar = () => {
            if (typeof window !== 'undefined') {
                if (window.scrollY > lastScrollY) { // if scroll down hide the navbar
                    setIsVisible(false);
                } else { // if scroll up show the navbar
                    setIsVisible(true);
                }

                // remember current page location to use in the next move
                setLastScrollY(window.scrollY);
            }
        };

        if (typeof window !== 'undefined') {
            window.addEventListener('scroll', controlNavbar);

            // cleanup function
            return () => {
                window.removeEventListener('scroll', controlNavbar);
            };
        }
    }, [lastScrollY]);

    return (
        <nav
            className={`fixed top-0 left-0 z-50 w-full p-4 px-4 text-white transition-transform duration-300 bg-teal-600 shadow-md md:px-48 ${isVisible ? 'translate-y-0' : '-translate-y-full'
                }`}
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