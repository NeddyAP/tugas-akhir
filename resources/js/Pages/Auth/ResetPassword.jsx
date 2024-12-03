import React from "react";
import { Mail, Lock } from "lucide-react";
import { useForm } from "@inertiajs/react";
import AuthLayout from "@/Layouts/AuthLayout";

const ResetPassword = ({ token, email }) => {
    const { data, setData, post, processing, errors, reset } = useForm({
        token: token,
        email: email,
        password: "",
        password_confirmation: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("password.store"), {
            onFinish: () => reset("password", "password_confirmation"),
        });
    };

    return (
        <AuthLayout title="Reset Password">
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
                <div className="mb-4 space-y-1">
                    <label
                        htmlFor="password"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-200"
                    >
                        New Password
                    </label>
                    <div className="relative">
                        <input
                            type="password"
                            id="password"
                            className="w-full px-3 py-2.5 pl-10 text-sm sm:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                            value={data.password}
                            onChange={(e) =>
                                setData("password", e.target.value)
                            }
                            required
                        />
                        <Lock
                            className="absolute text-gray-400 transform -translate-y-1/2 left-3 top-1/2"
                            size={16}
                        />
                        {errors.password && (
                            <p className="mt-1 text-xs text-red-500">
                                {errors.password}
                            </p>
                        )}
                    </div>
                </div>
                <div className="mb-6 space-y-1">
                    <label
                        htmlFor="password_confirmation"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-200"
                    >
                        Confirm New Password
                    </label>
                    <div className="relative">
                        <input
                            type="password"
                            id="password_confirmation"
                            className="w-full px-3 py-2.5 pl-10 text-sm sm:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                            value={data.password_confirmation}
                            onChange={(e) =>
                                setData("password_confirmation", e.target.value)
                            }
                            required
                        />
                        <Lock
                            className="absolute text-gray-400 transform -translate-y-1/2 left-3 top-1/2"
                            size={16}
                        />
                        {errors.password_confirmation && (
                            <p className="mt-1 text-xs text-red-500">
                                {errors.password_confirmation}
                            </p>
                        )}
                    </div>
                </div>
                <button
                    type="submit"
                    className="w-full px-4 py-2.5 text-sm sm:text-base font-medium text-white bg-teal-600 rounded-lg hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={processing}
                >
                    {processing ? "Resetting..." : "Reset Password"}
                </button>
            </form>
        </AuthLayout>
    );
};

export default ResetPassword;
