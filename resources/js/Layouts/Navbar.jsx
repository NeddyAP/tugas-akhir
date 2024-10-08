import { useRoute } from "@vendor/tightenco/ziggy";
import { useEffect, useRef, useState, useCallback } from "react";
import { Link } from "@inertiajs/react";

export default function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const route = useRoute();
    const navbarRef = useRef(null);

    const handleScroll = useCallback(() => {
        let lastScrollTop = 0;

        return () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            if (scrollTop > lastScrollTop) {
                navbarRef.current.style.transform = 'translateY(-100%)';
            } else {
                navbarRef.current.style.transform = 'translateY(0)';
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
            className="px-4 md:px-48 bg-teal-600 text-white p-4 shadow-md fixed top-0 left-0 w-full transition-transform duration-300 z-10"
        >
            <div className="container mx-auto flex justify-between items-center">
                <Link href={route('home')} className="text-2xl font-bold">FILKOM</Link>
                <div className="hidden md:flex items-center">
                    <Link href='' className="mr-4 hover:underline-offset-2 hover:underline transition-all duration-300 ease-in-out">Informasi</Link>
                    <Link href='' className="mr-4 hover:underline-offset-2 hover:underline transition-all duration-300 ease-in-out">Buku Pedoman</Link>
                    <Link href='' className="mr-4 hover:underline-offset-2 hover:underline transition-all duration-300 ease-in-out">Logbook</Link>
                    <Link href='' className="mr-4">
                        <button className="px-2 py-1 bg-teal-700 text-white rounded-md hover:bg-teal-800 transition-colors">Submit</button>
                    </Link>
                </div>
                <button className="md:hidden text-2xl" onClick={() => setMenuOpen(!menuOpen)}>
                    &#9776;
                </button>
            </div>
            {menuOpen && (
                <div className="md:hidden flex flex-col items-center mt-4">
                    <Link href='' className="mb-2 text-center">Informasi</Link>
                    <Link href='' className="mb-2 text-center">Buku Pedoman</Link>
                    <Link href='' className="mb-2 text-center">Logbook</Link>
                    <Link href='' className="mb-2 text-center">
                        <button className="px-2 py-1 bg-teal-700 text-white rounded-md hover:bg-teal-800 transition-colors">Submit</button>
                    </Link>
                </div>
            )}
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