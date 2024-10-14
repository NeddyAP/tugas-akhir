import React from 'react';
import { Mail } from 'lucide-react';
import { Link, useForm } from '@inertiajs/react';
import AuthLayout from '@/Layouts/AuthLayout';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ForgotPassword = () => {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('password.email'), {
            onSuccess: () => {
                toast.success('Reset link berhasil dikirim, periksa email anda');
                setData('email', '');
            },
            onError: () => toast.error('Terjadi kesalahan'),
        });
    };

    return (
        <AuthLayout title="Lupa Password">
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="email" className="block mb-1 text-sm font-medium text-gray-700">Email</label>
                    <div className="relative">
                        <input
                            type="email"
                            id="email"
                            className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="nim@unida.ac.id"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            required
                        />
                        <Mail className="absolute text-gray-400 transform -translate-y-1/2 left-3 top-1/2" size={18} />
                        {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
                    </div>
                </div>
                <div className="flex justify-end mb-4">
                    <Link href={route('login')} className="text-sm text-blue-600 hover:underline">
                        Kembali ke Login
                    </Link>
                </div>
                <button
                    type="submit"
                    className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    disabled={processing}
                >
                    Send Reset Link
                </button>
            </form>
            <ToastContainer position="top-right" autoClose={5000} />
        </AuthLayout>
    );
};

export default ForgotPassword;
