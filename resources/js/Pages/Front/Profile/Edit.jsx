import React, { useState } from 'react';
import { Head, useForm, usePage } from "@inertiajs/react";
import { User } from 'lucide-react';
import Layout from "@/Layouts/Layout";
import SecondaryButton from "@/Components/Front/SecondaryButton";
import PrimaryButton from "@/Components/Front/PrimaryButton";
import avatarProfile from '@images/avatar-profile.jpg';

export default function Edit({ mustVerifyEmail, status }) {
    const user = usePage().props.auth.user;
    const [profileImage, setProfileImage] = useState(avatarProfile);
    const { data, setData, post, processing, errors } = useForm({
        name: user.name || '',
        nim: user.nim || '',
        email: user.email || '',
        dosen_pembimbing: user.dosen_pembimbing || '',
        tanggal_mulai_kkl: user.tanggal_mulai_kkl || '',
        kelas_angkatan: user.kelas_angkatan || '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setData(name, value);
    };

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => setProfileImage(e.target.result);
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('profile.update'), {
            preserveState: true,
            preserveScroll: true,
        });
    };

    return (
        <Layout>
            <Head title="Profile" />
            <div className="max-w-6xl p-6 mx-auto mt-8 bg-white rounded-lg shadow-md">
                <div className="flex items-center mb-6">
                    <User className="w-6 h-6 mr-2 text-gray-500" />
                    <h2 className="text-xl font-semibold text-gray-700">Profil Anda</h2>
                </div>

                <div className="flex flex-col items-center mb-6">
                    <img
                        src={profileImage}
                        alt="Profile"
                        className="object-cover w-32 h-32 mb-4 rounded-full"
                    />
                    {/* <label className="px-4 py-2 text-white transition duration-300 bg-blue-500 rounded cursor-pointer hover:bg-blue-600">
                        Select Image
                        <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
                    </label> */}
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {['name', 'nim', 'email', 'dosen_pembimbing', 'tanggal_mulai_kkl', 'kelas_angkatan'].map((field) => (
                        <div key={field}>
                            <label htmlFor={field} className="block text-sm font-medium text-gray-700">
                                {field.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')} *
                            </label>
                            <input
                                type={field === 'tanggal_mulai_kkl' ? 'date' : 'text'}
                                id={field}
                                name={field}
                                value={data[field]}
                                onChange={handleChange}
                                className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                required
                            />
                            {errors[field] && <p className="mt-1 text-sm text-red-600">{errors[field]}</p>}
                        </div>
                    ))}

                    <div className="flex justify-end space-x-4">
                        <PrimaryButton type="submit" disabled={processing}>
                            {processing ? 'Menyimpan...' : 'Simpan'}
                        </PrimaryButton>
                        <SecondaryButton type="reset" disabled={processing} preserveScroll>Batal</SecondaryButton>
                    </div>
                </form>
            </div>
        </Layout>
    );
}