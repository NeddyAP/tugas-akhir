import React from 'react';
import PrimaryButton from '@/Components/PrimaryButton';

const Tutorial = () => (
    <div className="container mx-auto px-4 md:px-8 lg:px-16 py-12 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            <div className="md:col-span-2">
                <div className="aspect-w-16 h-96 mb-6 md:mb-0">
                    <iframe
                        src="https://www.youtube.com/embed/ptY6CH4A1xc"
                        title="Tutorial Video"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full rounded-xl"
                    />
                </div>
            </div>
            <div className="md:col-span-1 flex flex-col items-center text-center">
                <h2 className="text-2xl font-bold mb-4">Tutorial</h2>
                <div className="space-y-4 mb-6">
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
