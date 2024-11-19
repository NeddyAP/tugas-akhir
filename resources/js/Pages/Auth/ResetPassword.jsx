import React from 'react';
import { Mail, Lock } from 'lucide-react';
import { useForm } from '@inertiajs/react';
import AuthLayout from '@/Layouts/AuthLayout';

const ResetPassword = ({ token, email }) => {
    const { data, setData, post, processing, errors, reset } = useForm({
        token: token,
        email: email,
        password: '',
        password_confirmation: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('password.store'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <AuthLayout title="Reset Password">
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="email" className="block mb-1 text-sm font-medium text-gray-700">Email</label>
                    <div className="relative">
                        <input
                            type="email"
                            id="email"
                            className="w-full px-3 py-2 pl-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            required
                        />
                        <Mail className="absolute text-gray-400 transform -translate-y-1/2 left-3 top-1/2" size={18} />
                        {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
                    </div>
                </div>
                <div className="mb-4">
                    <label htmlFor="password" className="block mb-1 text-sm font-medium text-gray-700">New Password</label>
                    <div className="relative">
                        <input
                            type="password"
                            id="password"
                            className="w-full px-3 py-2 pl-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            required
                        />
                        <Lock className="absolute text-gray-400 transform -translate-y-1/2 left-3 top-1/2" size={18} />
                        {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
                    </div>
                </div>
                <div className="mb-6">
                    <label htmlFor="password_confirmation" className="block mb-1 text-sm font-medium text-gray-700">Confirm New Password</label>
                    <div className="relative">
                        <input
                            type="password"
                            id="password_confirmation"
                            className="w-full px-3 py-2 pl-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            required
                        />
                        <Lock className="absolute text-gray-400 transform -translate-y-1/2 left-3 top-1/2" size={18} />
                        {errors.password_confirmation && <p className="mt-1 text-xs text-red-500">{errors.password_confirmation}</p>}
                    </div>
                </div>
                <button
                    type="submit"
                    className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-blue-500 dark:hover:bg-blue-600"
                    disabled={processing}
                >
                    Reset Password
                </button>
            </form>
        </AuthLayout>
    );
};

export default ResetPassword;

