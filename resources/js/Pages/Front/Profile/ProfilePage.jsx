import React, { useState } from 'react';
import { Head, useForm, usePage } from "@inertiajs/react";
import { User } from 'lucide-react';
import Select from 'react-select';
import FrontLayout from "@/Layouts/FrontLayout";
import SecondaryButton from "@/Components/Front/SecondaryButton";
import PrimaryButton from "@/Components/Front/PrimaryButton";
import avatarProfile from '@images/avatar-profile.jpg';

export default function ProfilePage({ mustVerifyEmail, status }) {
    const user = usePage().props.auth.user;
    const [profileImage, setProfileImage] = useState(avatarProfile);


    const { data, setData, post, processing, errors } = useForm({
        name: user.name || '',
        email: user.email || '',
        phone: user.profilable?.phone || '',
        address: user.profilable?.address || '',
        ...(user.role === 'mahasiswa' && {
            nim: user.profilable?.nim || '',
            angkatan: user.profilable?.angkatan || '',
            prodi: user.profilable?.prodi || '',
            fakultas: user.profilable?.fakultas || '',
        }),
        ...(user.role === 'dosen' && {
            nip: user.profilable?.nip || '',
        }),
    });


    const {
        data: passwordData,
        setData: setPasswordData,
        put: putPassword,
        processing: passwordProcessing,
        errors: passwordErrors,
        reset: resetPassword,
    } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setData(name, value);
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData(name, value);
    };


    const commonFields = ['name', 'email', 'phone', 'address'];


    const roleSpecificFields = {
        mahasiswa: ['nim', 'angkatan', 'prodi', 'fakultas'],
        dosen: ['nip'],
        admin: [],
    };

    const getYearOptions = () => {
        const currentYear = new Date().getFullYear();
        const startYear = 2021;
        const years = [];

        for (let year = currentYear; year >= startYear; year--) {
            years.push({ value: year.toString(), label: year.toString() });
        }

        return years;
    };

    const SearchableSelect = ({ value, onChange, options, placeholder }) => (
        <Select
            value={options.find(option => option.value === value)}
            onChange={(selected) => onChange(selected ? selected.value : '')}
            options={options}
            classNamePrefix="select"
            isClearable
            isSearchable
            placeholder={placeholder}
            className="block w-full mt-1"
            classNames={{
                control: () => "border rounded-md shadow-sm bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 hover:border-teal-500 dark:hover:border-teal-500",
                input: () => "text-gray-900 dark:text-gray-100",
                placeholder: () => "text-gray-500 dark:text-gray-400",
                singleValue: () => "text-gray-900 dark:text-gray-100",
                menu: () => "mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg dark:text-gray-100",
                option: ({ isFocused, isSelected }) => [
                    "px-3 py-2 cursor-pointer",
                    isFocused && "bg-teal-50 dark:bg-teal-900/50",
                    isSelected && "bg-teal-100 dark:bg-teal-900",
                    !isFocused && !isSelected && "hover:bg-gray-100 dark:hover:bg-gray-600"
                ].filter(Boolean).join(" "),
                noOptionsMessage: () => "text-gray-500 dark:text-gray-400 p-3"
            }}
            components={{
                IndicatorSeparator: () => null
            }}
        />
    );

    const renderFormFields = () => {
        const fieldsToRender = [...commonFields, ...(roleSpecificFields[user.role] || [])];

        return fieldsToRender.map((field) => (
            <div key={field}>
                <label htmlFor={field} className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                    {field.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')} *
                </label>
                {field === 'angkatan' ? (
                    <SearchableSelect
                        value={data[field]}
                        onChange={(value) => setData(field, value)}
                        options={getYearOptions()}
                        placeholder="Pilih Angkatan"
                    />
                ) : (
                    <input
                        type="text"
                        id={field}
                        name={field}
                        value={data[field]}
                        onChange={handleChange}
                        className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        required
                    />
                )}
                {errors[field] && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors[field]}</p>}
            </div>
        ));
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

    const handlePasswordSubmit = (e) => {
        e.preventDefault();
        putPassword(route('password.update'), {
            onSuccess: () => {
                resetPassword();
            },
            preserveScroll: true,
        });
    };

    return (
        <FrontLayout>
            <Head title="Profile" />
            <div className="max-w-6xl p-6 mx-auto my-20 space-y-8">
                <div className="p-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
                    <div className="flex items-center mb-6">
                        <User className="w-6 h-6 mr-2 text-gray-500 dark:text-gray-400" />
                        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200">Profil Anda</h2>
                    </div>

                    <div className="flex flex-col items-center mb-6">
                        <img
                            src={profileImage}
                            alt="Profile"
                            className="object-cover w-32 h-32 mb-4 rounded-full ring-2 ring-gray-200 dark:ring-gray-700"
                        />
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {renderFormFields()}

                        <div className="flex justify-end space-x-4">
                            <PrimaryButton type="submit" disabled={processing}>
                                {processing ? 'Menyimpan...' : 'Simpan'}
                            </PrimaryButton>
                            <SecondaryButton type="reset" disabled={processing} preserveScroll>Batal</SecondaryButton>
                        </div>
                    </form>
                </div>

                <div className="p-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
                    <div className="flex items-center mb-6">
                        <User className="w-6 h-6 mr-2 text-gray-500 dark:text-gray-400" />
                        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200">Ubah Password</h2>
                    </div>

                    <form onSubmit={handlePasswordSubmit} className="space-y-4">
                        {['current_password', 'password', 'password_confirmation'].map((field) => (
                            <div key={field}>
                                <label htmlFor={field} className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                                    {field === 'current_password' ? 'Password Saat Ini' :
                                        field === 'password' ? 'Password Baru' :
                                            'Konfirmasi Password Baru'} *
                                </label>
                                <input
                                    type="password"
                                    id={field}
                                    name={field}
                                    value={passwordData[field]}
                                    onChange={handlePasswordChange}
                                    className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    required
                                />
                                {passwordErrors[field] && (
                                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{passwordErrors[field]}</p>
                                )}
                            </div>
                        ))}

                        <div className="flex justify-end space-x-4">
                            <PrimaryButton type="submit" disabled={passwordProcessing}>
                                {passwordProcessing ? 'Menyimpan...' : 'Ubah Password'}
                            </PrimaryButton>
                            <SecondaryButton
                                type="button"
                                disabled={passwordProcessing}
                                onClick={() => resetPassword()}
                            >
                                Batal
                            </SecondaryButton>
                        </div>
                    </form>
                </div>
            </div>
        </FrontLayout>
    );
}