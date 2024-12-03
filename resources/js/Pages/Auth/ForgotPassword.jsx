import React from "react";
import { Mail } from "lucide-react";
import { Link, useForm } from "@inertiajs/react";
import AuthLayout from "@/Layouts/AuthLayout";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ForgotPassword = () => {
    const { data, setData, post, processing, errors } = useForm({
        email: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("password.email"), {
            onSuccess: () => {
                toast.success(
                    "Reset link berhasil dikirim, periksa email anda"
                );
                setData("email", "");
            },
            onError: () => toast.error("Terjadi kesalahan"),
        });
    };

    return (
        <AuthLayout title="Lupa Password">
            <form onSubmit={handleSubmit} className="w-full">
                <div className="mb-4 space-y-1">
                    <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-200"
                    >
                        Email
                    </label>
                    <div className="relative">
                        <input
                            type="email"
                            id="email"
                            className="w-full px-3 py-2.5 pl-10 text-sm sm:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                            placeholder="nim@unida.ac.id"
                            value={data.email}
                            onChange={(e) => setData("email", e.target.value)}
                            required
                        />
                        <Mail
                            className="absolute text-gray-400 transform -translate-y-1/2 left-3 top-1/2"
                            size={16}
                        />
                        {errors.email && (
                            <p className="mt-1 text-xs text-red-500">
                                {errors.email}
                            </p>
                        )}
                    </div>
                </div>
                <div className="flex justify-end mb-6">
                    <Link
                        href={route("login")}
                        className="text-sm text-teal-600 hover:underline dark:text-teal-400"
                    >
                        Kembali ke Login
                    </Link>
                </div>
                <button
                    type="submit"
                    className="w-full px-4 py-2.5 text-sm sm:text-base font-medium text-white bg-teal-600 rounded-lg hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={processing}
                >
                    {processing ? "Sending..." : "Kirim Reset Link"}
                </button>
            </form>
            <ToastContainer position="top-right" autoClose={5000} />
        </AuthLayout>
    );
};

export default ForgotPassword;
