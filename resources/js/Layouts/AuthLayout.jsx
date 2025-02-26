import React from "react";
import { ArrowLeft } from "lucide-react";
import { Head, Link } from "@inertiajs/react";
import salyImage from "../../images/Saly-10.png";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { DarkModeProvider } from "@/Contexts/DarkModeContext";
import DarkModeToggle from "@/Components/ui/DarkModeToggle";

const AuthLayout = ({ title, children }) => {
    return (
        <DarkModeProvider>
            <Head title={title} />
            <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-tr from-sky-100 via-sky-200 to-teal-600 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700">
                <div className="relative flex flex-col w-full max-w-4xl overflow-hidden bg-white rounded-lg shadow-lg md:flex-row dark:bg-gray-800">
                    <div className="flex items-center justify-center w-full p-4 md:w-1/2 md:p-8">
                        <div className="relative w-full max-w-md">
                            <div className="flex items-center justify-between mb-8">
                                <Link
                                    href={route("home")}
                                    className="flex items-center text-teal-600 dark:text-teal-400 hover:underline"
                                >
                                    <ArrowLeft className="w-4 h-4 mr-1" />
                                    Home
                                </Link>
                                <DarkModeToggle />
                            </div>
                            <h2 className="mb-6 text-2xl font-bold text-center text-gray-800 md:text-3xl dark:text-white">
                                {title}
                            </h2>
                            {children}
                            <ToastContainer />
                        </div>
                    </div>
                    <div className="items-center justify-center hidden w-full p-4 bg-teal-100 sm:flex md:w-1/2 md:p-8 dark:bg-gray-700">
                        <img
                            src={salyImage}
                            alt={`${title} illustration`}
                            className="h-auto max-w-full"
                        />
                    </div>
                </div>
            </div>
        </DarkModeProvider>
    );
};

export default AuthLayout;
