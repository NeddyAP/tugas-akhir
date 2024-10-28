import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Head, Link } from '@inertiajs/react';
import salyImage from '../../images/Saly-10.png';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AuthLayout = ({ title, children }) => {
    return (
        <>
            <Head title={title} />
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-tr from-sky-100 via-sky-200 to-teal-600 dark:bg-gray-800">
                <div className="relative flex w-full max-w-4xl overflow-hidden bg-white rounded-lg shadow-lg">
                    <div className="absolute top-4 left-4">
                        <Link href={route('home')} className="flex items-center text-blue-600 hover:underline">
                            <ArrowLeft className="w-4 h-4 mr-1" />
                            Home
                        </Link>
                    </div>
                    <div className="flex items-center justify-center w-1/2 p-8">
                        <div className="w-full">
                            <h2 className="mb-6 text-3xl font-bold text-gray-800">{title}</h2>
                            {children}
                            <ToastContainer
                                position="top-right"
                                autoClose={3000}
                                hideProgressBar={false}
                                newestOnTop
                                closeOnClick
                                rtl={false}
                                pauseOnFocusLoss
                                draggable
                                pauseOnHover
                                theme="light"
                            />
                        </div>
                    </div>
                    <div className="flex items-center justify-center w-1/2 p-8 bg-blue-100">
                        <img
                            src={salyImage}
                            alt={`${title} illustration`}
                            className="h-auto max-w-full"
                        />
                    </div>
                </div>
            </div >
        </>
    );
};

export default AuthLayout;

