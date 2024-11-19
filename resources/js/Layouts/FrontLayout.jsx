import React, { useEffect } from 'react';
import Footer from "@/Layouts/Footer";
import Navbar from "@/Layouts/Navbar";
import { Head, usePage } from "@inertiajs/react";
import { toast } from "react-toastify";
import { Toast } from "@/Components/ToastConfig";
import { DarkModeProvider } from '@/Contexts/DarkModeContext';

export default function FrontLayout({ children }) {
    const { flash } = usePage().props;

    useEffect(() => {
        if (flash?.type && flash?.message) {
            const validTypes = ['success', 'error', 'info', 'warning'];
            const toastType = validTypes.includes(flash.type) ? flash.type : 'info';

            toast[toastType](flash.message);
        }
    }, [flash]);

    return (
        <DarkModeProvider>
            <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900 dark:text-white">
                <Head>
                    <meta
                        head-key="description"
                        name="description"
                        content="This is the default description"
                    />
                </Head>

                <Navbar />
                <main className="flex-grow pt-16 sm:mb-20">
                    {children}
                </main>
                <Footer />
                <Toast />
            </div>
        </DarkModeProvider>
    );
}
