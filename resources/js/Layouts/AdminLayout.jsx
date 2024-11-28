import React, { useEffect, useState, memo } from "react";
import { Head, usePage } from "@inertiajs/react";
import { toast } from "react-toastify";
import AdminNavbar from "../Components/Admin/AdminNavbar";
import AdminSidebar from "../Components/Admin/AdminSidebar";
import { Toast } from "@/Components/ui/ToastConfig";
import { DarkModeProvider } from "@/Contexts/DarkModeContext";

const AdminLayout = memo(({ children, title, currentPage }) => {
    const { flash } = usePage().props;
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        if (flash?.type && flash?.message) {
            toast[flash.type in toast ? flash.type : "info"](flash.message, {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        }
    }, [flash]);

    useEffect(() => {
        const handleRouteChange = () => setIsMobileMenuOpen(false);
        document.addEventListener("inertia:navigate", handleRouteChange);
        return () =>
            document.removeEventListener("inertia:navigate", handleRouteChange);
    }, []);

    const handleMobileMenuToggle = () => setIsMobileMenuOpen(!isMobileMenuOpen);

    return (
        <DarkModeProvider>
            <div className="flex min-h-screen max-w-[100vw] overflow-hidden bg-white dark:bg-gray-900">
                <Head title={title} />
                <AdminSidebar
                    currentLabel={title}
                    onCollapse={setIsCollapsed}
                    isMobileMenuOpen={isMobileMenuOpen}
                    onMobileMenuToggle={handleMobileMenuToggle}
                />

                <div
                    className={`
                    flex flex-col flex-1 w-full transition-all duration-300 dark:text-white
                    ${isCollapsed ? "md:ml-20" : "md:ml-64"}
                    ${isMobileMenuOpen ? "ml-0" : "ml-0"}
                `}
                >
                    <AdminNavbar
                        currentPage={currentPage}
                        onMobileMenuToggle={handleMobileMenuToggle}
                    />
                    <main className="flex-1 p-4 overflow-x-hidden md:p-8">
                        <div className="container mx-auto">{children}</div>
                        <Toast />
                    </main>
                </div>
            </div>
        </DarkModeProvider>
    );
});

AdminLayout.displayName = "AdminLayout";

export default AdminLayout;
