import React, { useState } from 'react';
import salyImage from '../../../images/Saly-10.png';
import { Mail, Lock, ArrowLeft } from 'lucide-react';
import { Head, Link, useForm } from '@inertiajs/react';

const Login = () => {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <>
            <Head title="Login" />
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-tr from-sky-100 via-sky-200 to-teal-600 dark:bg-gray-800">
                <div className="relative flex w-full max-w-4xl overflow-hidden bg-white rounded-lg shadow-lg">
                    <div className="absolute top-4 left-4">
                        <Link href={route('home')} className="flex items-center text-blue-600 hover:underline">
                            <ArrowLeft className="w-4 h-4 mr-1" />
                            Kembali
                        </Link>
                    </div>
                    <div className="flex items-center justify-center w-1/2 p-8">
                        <div className="w-full">
                            <h2 className="mb-6 text-3xl font-bold text-gray-800">Login to your account</h2>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-4">
                                    <label htmlFor="email" className="block mb-1 text-sm font-medium text-gray-700">Email</label>
                                    <div className="relative">
                                        <input
                                            type="email"
                                            id="email"
                                            className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="NIM@unida.ac.id"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            required
                                        />
                                        <Mail className="absolute text-gray-400 transform -translate-y-1/2 left-3 top-1/2" size={18} />
                                        {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="password" className="block mb-1 text-sm font-medium text-gray-700">Password</label>
                                    <div className="relative">
                                        <input
                                            type="password"
                                            id="password"
                                            className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Password"
                                            value={data.password}
                                            onChange={(e) => setData('password', e.target.value)}
                                            required
                                        />
                                        <Lock className="absolute text-gray-400 transform -translate-y-1/2 left-3 top-1/2" size={18} />
                                        {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
                                    </div>
                                </div>
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id="remember"
                                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                            checked={data.remember}
                                            onChange={(e) =>
                                                setData('remember', e.target.checked)
                                            }
                                        />
                                        <label htmlFor="remember" className="block ml-2 text-sm text-gray-700">
                                            Ingat username
                                        </label>
                                    </div>
                                    <Link href={route('password.request')} className="text-sm text-blue-600 hover:underline">Lupa Password?</Link>
                                </div>
                                <button
                                    type="submit"
                                    className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                >
                                    Login
                                </button>
                            </form>
                        </div>
                    </div>
                    <div className="flex items-center justify-center w-1/2 p-8 bg-blue-100">
                        <img
                            src={salyImage}
                            alt="Login illustration"
                            className="h-auto max-w-full"
                        />
                    </div>
                </div>
            </div>
        </>
    );
};

export default Login;