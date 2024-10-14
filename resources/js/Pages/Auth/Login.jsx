import React from 'react';
import { Link, useForm } from '@inertiajs/react';
import { Mail, Lock, AlertCircle } from 'lucide-react';
import AuthLayout from '@/Layouts/AuthLayout';

const Login = () => {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('login'));
    };

    return (
        <AuthLayout title="Login">
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="email" className="block mb-1 text-sm font-medium text-gray-700">Email</label>
                    <div className="relative">
                        <input
                            type="email"
                            id="email"
                            className={`w-full px-3 py-2 pl-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                            placeholder="nim@unida.ac.id"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            required
                        />
                        <Mail className="absolute text-gray-400 transform -translate-y-1/2 left-3 top-1/2" size={18} />
                    </div>
                    {errors.email && (
                        <div className="flex items-center mt-1 text-red-500">
                            <AlertCircle size={16} className="mr-1" />
                            <p className="text-xs">{errors.email}</p>
                        </div>
                    )}
                </div>
                <div className="mb-4">
                    <label htmlFor="password" className="block mb-1 text-sm font-medium text-gray-700">Password</label>
                    <div className="relative">
                        <input
                            type="password"
                            id="password"
                            className={`w-full px-3 py-2 pl-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                            placeholder="Password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            required
                        />
                        <Lock className="absolute text-gray-400 transform -translate-y-1/2 left-3 top-1/2" size={18} />
                    </div>
                    {errors.password && (
                        <div className="flex items-center mt-1 text-red-500">
                            <AlertCircle size={16} className="mr-1" />
                            <p className="text-xs">{errors.password}</p>
                        </div>
                    )}
                </div>
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="remember"
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            checked={data.remember}
                            onChange={(e) => setData('remember', e.target.checked)}
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
                    disabled={processing}
                >
                    Login
                </button>
            </form>
        </AuthLayout>
    );
};

export default Login;
