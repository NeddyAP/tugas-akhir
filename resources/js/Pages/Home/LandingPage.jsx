import React from 'react';
import landingImage from '../../../images/Saly-10.png';
import Button from '@/Components/Button';
import { Link } from '@inertiajs/react';

const LandingPage = () => {
    return (
        <div className="flex flex-col md:flex-row items-center justify-between py-24 px-6 md:px-24 lg:px-48 min-h-screen bg-gradient-to-tr from-sky-100 via-sky-200 to-teal-600">
            <div className="max-w-md mb-8 md:mb-0">
                <h2 className="text-lg font-medium mb-2">Hallo, Selamat Datang</h2>
                <h1 className="text-3xl md:text-4xl font-bold mb-4">
                    Semangat melaksanakan kuliah kerja lapangan & kuliah kerja nyata.
                </h1>
                <p className="text-gray-600 mb-6">
                    Terus semangat untuk mendapatkan hasil yang luar biasa, Isi sekarang yu.
                </p>
                <div className="flex space-x-4">
                    <Button
                        src={route('login')}
                    >
                        Login
                    </Button>
                    <Link
                        href={route('informasi')}>
                            test
                        </Link>
                    <Button
                        style={"bg-gray-200 text-gray-800 hover:bg-gray-300"}
                    >
                        Tutorial
                    </Button>
                </div>
            </div>

            <div className="relative w-full md:w-1/2 max-w-lg">
                <img
                    src={landingImage}
                    alt="Illustration of person working"
                    className="w-full h-auto"
                />
            </div>
        </div>
    );
};

export default LandingPage;