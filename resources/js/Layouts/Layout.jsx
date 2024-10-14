import React, { useEffect } from 'react';
import Footer from "@/Layouts/Footer";
import Navbar from "@/Layouts/Navbar";
import { Head, usePage } from "@inertiajs/react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Layout({ children }) {
    const { flash } = usePage().props.flash;

    useEffect(() => {
        if (flash && flash.message) {
            if (flash.type === "success") {
                toast.success(flash.message);
            } else if (flash.type === "error") {
                toast.error(flash.message);
            }
        }
    }, [flash]);

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
