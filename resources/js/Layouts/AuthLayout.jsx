import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Head, Link } from '@inertiajs/react';
import salyImage from '../../images/Saly-10.png';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { DarkModeProvider } from '@/Contexts/DarkModeContext';

const AuthLayout = ({ title, children }) => {
    return (
        <DarkModeProvider>
            <Head title={title} />
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-tr from-sky-100 via-sky-200 to-teal-600 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700">
                <div className="relative flex w-full max-w-4xl overflow-hidden bg-white rounded-lg shadow-lg dark:bg-gray-800">
                    <div className="absolute top-4 left-4">
                        <Link href={route('home')} className="flex items-center text-teal-600 dark:text-teal-400 hover:underline">
                            <ArrowLeft className="w-4 h-4 mr-1" />
                            Home
                        </Link>
                    </div>
                    <div className="flex items-center justify-center w-1/2 p-8">
                        <div className="w-full">
                            <h2 className="mb-6 text-3xl font-bold text-gray-800 dark:text-white">{title}</h2>
                            {children}
                            <ToastContainer />
                        </div>
                    </div>
                    <div className="flex items-center justify-center w-1/2 p-8 bg-teal-100 dark:bg-gray-700">
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

