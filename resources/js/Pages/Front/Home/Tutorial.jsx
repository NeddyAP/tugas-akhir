import React, { useState } from "react";
import PrimaryButton from "@/Components/Front/PrimaryButton";

const Tutorial = ({ tutorial }) => {
    const [videoError, setVideoError] = useState(false);

    const placeholderData = {
        link: "",
        title: "Judul Tutorial",
        description: "isi deskripsi video disini.",
    };

    const data = tutorial || placeholderData;

    return (
        <section
            id="tutorial"
            className="w-full py-12 sm:py-16 lg:py-20 scroll-mt-20"
        >
            <div className="container max-w-6xl px-8 mx-auto sm:px-12 md:px-16 lg:px-24 xl:px-32">
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-12">
                    <div className="lg:col-span-2">
                        <div
                            className="relative w-full overflow-hidden transition-colors duration-200 bg-gray-100 shadow-lg rounded-2xl dark:bg-gray-800"
                            style={{ paddingTop: "56.25%" }}
                        >
                            {" "}
                            {/* 16:9 Aspect Ratio */}
                            {data.link && !videoError ? (
                                <iframe
                                    src={`https://www.youtube.com/embed/${data.link}`}
                                    title="Tutorial Video"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    className="absolute inset-0 w-full h-full"
                                    onError={() => setVideoError(true)}
                                />
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="text-center">
                                        <svg
                                            className="w-12 h-12 mx-auto mb-4 text-gray-400"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                                            />
                                        </svg>
                                        <p className="text-gray-500 dark:text-gray-400">
                                            Video tidak tersedia
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="flex flex-col justify-center">
                        <div className="space-y-6 text-center">
                            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl dark:text-white">
                                {data.title}
                            </h2>
                            <p className="text-gray-600 dark:text-gray-300">
                                {data.description}
                            </p>
                            <div className="flex justify-center">
                                <PrimaryButton
                                    href={route("laporan.index")}
                                    className="text-lg"
                                >
                                    Submit
                                </PrimaryButton>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default React.memo(Tutorial);
