import React from "react";
import { usePage } from "@inertiajs/react";
import landingImage from "@images/Saly-10.png";
import PrimaryButton from "@/Components/Front/PrimaryButton";
import SecondaryButton from "@/Components/Front/SecondaryButton";

export default function LandingPage() {
    const { auth } = usePage().props;

    return (
        <section className="relative w-full mb-16 overflow-hidden">
            <div className="flex items-center min-h-screen transition-colors duration-200 bg-gradient-to-tr from-sky-100 via-sky-200 to-teal-600 dark:from-gray-800 dark:via-gray-900 dark:to-black">
                <div className="container relative max-w-6xl px-4 py-8 mx-auto sm:px-12 md:px-16 lg:px-24 xl:px-32 sm:py-12">
                    <div className="flex flex-col-reverse items-center w-full gap-8 lg:flex-row lg:justify-between lg:items-center">
                        <div className="w-full max-w-xl px-4 pt-12 text-center lg:px-0 lg:pr-32 lg:text-left lg:pt-20">
                            <h2 className="mb-2 text-base font-medium text-gray-800 dark:text-gray-200 sm:text-lg">
                                Hallo, Selamat Datang
                            </h2>
                            <h1 className="mb-4 text-2xl font-bold leading-tight text-gray-900 sm:text-3xl lg:text-4xl dark:text-white">
                                Semangat melaksanakan kuliah kerja lapangan &
                                kuliah kerja nyata.
                            </h1>
                            <p className="mb-6 text-base text-gray-600 dark:text-gray-300 sm:text-lg">
                                Terus semangat untuk mendapatkan hasil yang luar
                                biasa, Isi sekarang yu.
                            </p>
                            <div className="flex flex-col justify-center gap-4 sm:flex-row lg:justify-start">
                                <PrimaryButton
                                    href={route("laporan.index")}
                                    className="text-lg"
                                >
                                    {auth.user ? "Submit" : "Login"}
                                </PrimaryButton>
                                <SecondaryButton
                                    href="#tutorial"
                                    className="text-lg"
                                >
                                    Tutorial
                                </SecondaryButton>
                            </div>
                        </div>

                        <div className="w-full max-w-md pt-20 lg:pt-0 lg:w-1/2">
                            <div className="relative w-full max-w-md">
                                <div className="absolute inset-0 transform lg:scale-150 md:scale-90 sm:scale-75 rotate-6 rounded-3xl bg-gradient-to-tr from-teal-500/30 to-sky-300/30 dark:from-teal-900/30 dark:to-gray-800/30"></div>
                                <img
                                    src={landingImage}
                                    alt="Illustration"
                                    className="relative w-full h-auto transition-transform duration-300 transform hover:lg:scale-125 md:scale-75 sm:scale-50 rounded-2xl lg:scale-125 sm:hover:scale-100 md:hover:scale-110"
                                    loading="lazy"
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0">
                    <div className="h-16 bg-gradient-to-b from-transparent to-white/10 dark:to-gray-900/10"></div>
                    <div className="absolute hidden -translate-x-1/2 bottom-8 left-1/2 animate-bounce lg:block">
                        <svg
                            className="w-6 h-6 text-teal-7 00 dark:text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M19 14l-7 7m0 0l-7-7m7 7V3"
                            />
                        </svg>
                    </div>
                </div>
            </div>
        </section>
    );
}
