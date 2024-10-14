import React, { useCallback, useEffect, useState } from "react";
import { Link, usePage } from "@inertiajs/react";

const NavLink = React.memo(({ href, children }) => (
    <Link
        href={route(href)}
        className="mr-4 transition-all duration-300 ease-in-out hover:underline-offset-2 hover:underline"
    >
        {children}
    </Link>
));

const AuthButton = React.memo(({ user }) => (
    user ? (
        <Link
            method="post"
            href={route('logout')}
            as="button"
            className="px-2 py-1 font-bold text-red-400 transition-colors bg-teal-700 rounded-md hover:text-red-500"
        >
            Logout
        </Link>
    ) : (
        <Link href={route('login')} className="mr-4">
            <button className="px-2 py-1 text-white transition-colors bg-teal-700 rounded-md hover:bg-teal-800">Login</button>
        </Link>
    )
));

const Navbar = () => {
    const { auth } = usePage().props;
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    const controlNavbar = useCallback(() => {
        if (typeof window !== 'undefined') {
            setIsVisible(window.scrollY <= lastScrollY);
            setLastScrollY(window.scrollY);
        }
    }, [lastScrollY]);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            window.addEventListener('scroll', controlNavbar);
            return () => {
                window.removeEventListener('scroll', controlNavbar);
            };
        }
    }, [controlNavbar]);

    return (
        <nav
            className={`fixed top-0 left-0 z-50 w-full p-4 px-4 text-white transition-transform duration-300 bg-teal-600 shadow-md md:px-48 ${isVisible ? 'translate-y-0' : '-translate-y-full'
                }`}
        >
            <div className="container flex items-center justify-between mx-auto">
                <Link href={route('home')} className="text-2xl font-bold">FILKOM</Link>
                <div className="items-center hidden md:flex">
                    <NavLink href="pedomans.index">Buku Pedoman</NavLink>
                    <NavLink href="logbooks.index">Logbook</NavLink>
                    <NavLink href="laporans.index">Laporan</NavLink>
                    <AuthButton user={auth.user} />
                </div>
            </div>
        </nav>
    );
};

export default React.memo(Navbar);
