import React, { useEffect } from 'react';
import Footer from "@/Layouts/Footer";
import Navbar from "@/Layouts/Navbar";
import { Head, usePage } from "@inertiajs/react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Layout({ children }) {
    const { status } = usePage().props;

    useEffect(() => {
        if (status) {
            toast.success(status);
        }
    }, [status]);

    return (
        <>
            <Head>
                <meta
                    head-key="description"
                    name="description"
                    content="This is the default description"
                />
            </Head>

            <div className="flex flex-col min-h-screen">
                <Navbar />
                <main className="flex-grow pt-16 sm:mb-20">
                    {children}
                </main>
                <Footer />
            </div>
            <ToastContainer position="top-right" autoClose={3000} />
        </>
    );
}
