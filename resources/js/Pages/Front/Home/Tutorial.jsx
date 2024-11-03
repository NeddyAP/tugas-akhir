import React from 'react';
import PrimaryButton from '@/Components/Front/PrimaryButton';

const Tutorial = () => (
    <div className="container px-4 py-12 mx-auto md:px-8 lg:px-16 md:py-20">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-12">
            <div className="md:col-span-2">
                <div className="mb-6 aspect-w-16 h-96 md:mb-0">
                    <iframe
                        src="https://www.youtube.com/embed/ptY6CH4A1xc"
                        title="Tutorial Video"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full rounded-xl"
                    />
                </div>
            </div>
            <div className="flex flex-col items-center text-center md:col-span-1">
                <h2 className="mb-4 text-2xl font-bold">Tutorial</h2>
                <div className="mb-6 space-y-4">
                    <p className="text-gray-700">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ac
                        efficitur sapien. Nullam nec erat nec ex ultricies tincidunt. Donec
                        pharetra, nunc id dictum aliquam, nunc sapien feugiat nunc, vel
                        scelerisque nunc eros nec ipsum.
                    </p>
                    <p className="text-gray-700">
                        Sed ac efficitur sapien. Nullam nec erat nec ex ultricies
                        tincidunt. Donec pharetra, nunc id dictum aliquam, nunc sapien
                        feugiat nunc, vel scelerisque nunc eros nec ipsum.
                    </p>
                </div>
                <PrimaryButton href={route('login')}>
                    Login
                </PrimaryButton>
            </div>
        </div>
    </div>
);

export default React.memo(Tutorial);