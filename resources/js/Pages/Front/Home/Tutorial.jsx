import React, { useState } from 'react';
import PrimaryButton from '@/Components/Front/PrimaryButton';

const Tutorial = ({ tutorial }) => {
    const [videoError, setVideoError] = useState(false);

    const placeholderData = {
        link: '',
        title: 'Tutorial Video',
        description: 'login.'
    };

    const data = tutorial || placeholderData;

    return (
        <div className="container px-4 py-12 mx-auto md:px-8 lg:px-16 md:py-20">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-12">
                <div className="md:col-span-2">
                    <div className="mb-6 aspect-w-16 h-96 md:mb-0">
                        {data.link && !videoError ? (
                            <iframe
                                src={`https://www.youtube.com/embed/${data.link}`}
                                title="Tutorial Video"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                className="w-full h-full rounded-xl"
                                onError={() => setVideoError(true)}
                            />
                        ) : (
                            <div className="flex items-center justify-center w-full h-full bg-gray-100 dark:bg-gray-800 rounded-xl">
                                <div className="text-center">
                                    <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                    </svg>
                                    <p className="text-gray-500 dark:text-gray-400">
                                        Video tidak tersedia
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                <div className="flex items-center justify-center md:col-span-1">
                    <div className="text-center">
                        <h2 className="mb-4 text-2xl font-bold">{data.title}</h2>
                        <div className="mb-6">
                            <p className="text-gray-700 dark:text-gray-200">
                                {data.description}
                            </p>
                        </div>
                        <PrimaryButton href={route('login')}>
                            Login
                        </PrimaryButton>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default React.memo(Tutorial);
