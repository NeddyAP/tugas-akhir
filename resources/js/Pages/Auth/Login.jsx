import React from "react";
import { Link, useForm } from "@inertiajs/react";
import { Mail, Lock, AlertCircle } from "lucide-react";
import AuthLayout from "@/Layouts/AuthLayout";

const Login = () => {
    const { data, setData, post, processing, errors } = useForm({
        email: "",
        password: "",
        remember: false,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("login"));
    };

    return (
        <AuthLayout title="Login">
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
                            className={`w-full px-3 py-2.5 pl-10 text-sm sm:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                                errors.email
                                    ? "border-red-500"
                                    : "border-gray-300"
                            } dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white`}
                            placeholder="nim@unida.ac.id"
                            value={data.email}
                            onChange={(e) => setData("email", e.target.value)}
                            required
                        />
                        <Mail
                            className="absolute text-gray-400 transform -translate-y-1/2 left-3 top-1/2"
                            size={16}
                        />
                    </div>
                </div>
                <div className="mb-4 space-y-1">
                    <label
                        htmlFor="password"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-200"
                    >
                        Password
                    </label>
                    <div className="relative">
                        <input
                            type="password"
                            id="password"
                            className={`w-full px-3 py-2.5 pl-10 text-sm sm:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                                errors.password
                                    ? "border-red-500"
                                    : "border-gray-300"
                            } dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white`}
                            placeholder="Password"
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
                    </div>
                </div>
                <div className="flex flex-col mb-6 space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="remember"
                            className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                            checked={data.remember}
                            onChange={(e) =>
                                setData("remember", e.target.checked)
                            }
                        />
                        <label
                            htmlFor="remember"
                            className="ml-2 text-sm text-gray-700 dark:text-gray-200"
                        >
                            Remember me
                        </label>
                    </div>
                    <Link
                        href={route("password.request")}
                        className="text-sm text-teal-600 hover:underline dark:text-teal-400"
                    >
                        Forgot your password?
                    </Link>
                </div>
                <button
                    type="submit"
                    className="w-full px-4 py-2.5 text-sm sm:text-base font-medium text-white bg-teal-600 rounded-lg hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={processing}
                >
                    {processing ? "Logging in..." : "Login"}
                </button>

                {errors.email && (
                    <div className="flex items-center mt-3 text-red-500">
                        <AlertCircle size={14} className="mr-1" />
                        <p className="text-xs">{errors.email}</p>
                    </div>
                )}
            </form>
        </AuthLayout>
    );
};

export default Login;
