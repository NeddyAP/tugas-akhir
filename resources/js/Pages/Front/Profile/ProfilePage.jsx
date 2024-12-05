import React, { useState } from "react";
import { Head, useForm, usePage } from "@inertiajs/react";
import {
    User,
    Mail,
    Phone,
    MapPin,
    Clipboard,
    Calendar,
    GraduationCap,
    Building2,
} from "lucide-react";
import Select from "react-select";
import FrontLayout from "@/Layouts/FrontLayout";
import SecondaryButton from "@/Components/Front/SecondaryButton";
import PrimaryButton from "@/Components/Front/PrimaryButton";
import avatarProfile from "@images/avatar-profile.jpg";

const prodiOptions = [
    { value: "Ilmu Komputer", label: "Ilmu Komputer" },
    // prodi lainnya
];

const fakultasOptions = [
    { value: "Fakultas Ilmu Komputer", label: "Fakultas Ilmu Komputer" },
    // fakultas lainnya
    
];

export default function ProfilePage({ mustVerifyEmail, status, profileData }) {
    const user = usePage().props.auth.user;
    const [profileImage, setProfileImage] = useState(avatarProfile);

    const { data, setData, patch, processing, errors } = useForm({
        name: user?.name || "",
        email: user?.email || "",
        phone: user?.profilable?.phone || "",
        address: user?.profilable?.address || "",
        ...(user?.role === "mahasiswa" && {
            nim: user?.profilable?.nim || "",
            angkatan: user?.profilable?.angkatan || "",
            prodi: user?.profilable?.prodi || "",
            fakultas: user?.profilable?.fakultas || "",
        }),
        ...(user?.role === "dosen" && {
            nip: user?.profilable?.nip || "",
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
        current_password: "",
        password: "",
        password_confirmation: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setData(name, value);
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData(name, value);
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
            value={options.find((option) => option.value === value)}
            onChange={(selected) => onChange(selected ? selected.value : "")}
            options={options}
            className="block mt-1 w-full"
            classNames={{
                control: () =>
                    "pl-10 h-[42px] bg-white/5 dark:bg-gray-700 border border-gray-200 dark:border-0 rounded-md shadow-sm hover:border-teal-500 dark:hover:border-0 focus:ring-1 focus:ring-teal-500 dark:focus:ring-0 relative",
                input: () => "text-gray-900 dark:text-white",
                placeholder: () => "text-gray-500 dark:text-gray-400",
                singleValue: () => "text-gray-900 dark:text-white",
                menu: () =>
                    "mt-1 bg-white dark:bg-gray-700 border dark:border-0 rounded-md shadow-lg absolute w-full z-[60]",
                option: ({ isFocused, isSelected }) =>
                    `px-4 py-2 cursor-pointer ${
                        isSelected
                            ? "bg-teal-600 text-white"
                            : isFocused
                            ? "bg-teal-50 dark:bg-gray-600 text-gray-900 dark:text-white"
                            : "text-gray-900 dark:text-white hover:bg-teal-50 dark:hover:bg-gray-600"
                    }`,
                noOptionsMessage: () => "p-3 text-gray-500 dark:text-gray-400",
                valueContainer: () => "",
                dropdownIndicator: () =>
                    "text-gray-400 hover:text-teal-500 dark:hover:text-teal-400 px-2",
                clearIndicator: () =>
                    "text-gray-400 hover:text-teal-500 dark:hover:text-teal-400 px-2",
            }}
            components={{
                IndicatorSeparator: () => null,
            }}
            isClearable
            isSearchable
            unstyled
            placeholder={` ${
                placeholder.charAt(0).toUpperCase() + placeholder.slice(1)
            }`}
        />
    );

    const renderFormFields = () => {
        const commonFields = ["name", "email", "phone", "address"];

        const roleSpecificFields = {
            mahasiswa: ["nim", "angkatan", "prodi", "fakultas"],
            dosen: ["nip"],
            admin: [],
        };

        const userRoleFields = roleSpecificFields[user.role] || [];

        const fieldPairs = [
            ["name", "nim"],
            ["email", "angkatan"],
            ["phone", "prodi"],
            ["address", "fakultas"],
        ];

        const fieldIcons = {
            name: User,
            email: Mail,
            phone: Phone,
            address: MapPin,
            nim: Clipboard,
            angkatan: Calendar,
            prodi: GraduationCap,
            fakultas: Building2,
            nip: Clipboard,
        };

        const renderRightField = (rightField) => {
            if (!rightField || !userRoleFields.includes(rightField))
                return null;

            const isDropdown = ["angkatan", "prodi", "fakultas"].includes(
                rightField
            );
            const Icon = fieldIcons[rightField];

            return (
                <div className="relative">
                    <label
                        htmlFor={rightField}
                        className="block text-sm font-medium text-gray-700 dark:text-gray-200"
                    >
                        {rightField.charAt(0).toUpperCase() +
                            rightField.slice(1)}{" "}
                        {!["prodi", "fakultas"].includes(rightField) && "*"}
                    </label>
                    <div className="relative">
                        {isDropdown ? (
                            <div className="relative">
                                {React.createElement(Icon, {
                                    className:
                                        "absolute left-3 top-[13px] text-gray-400 w-5 h-5 pointer-events-none z-[1]",
                                })}
                                <div className="relative">
                                    <SearchableSelect
                                        value={data[rightField]}
                                        onChange={(value) =>
                                            setData(rightField, value)
                                        }
                                        options={
                                            rightField === "angkatan"
                                                ? getYearOptions()
                                                : rightField === "prodi"
                                                ? prodiOptions
                                                : rightField === "fakultas"
                                                ? fakultasOptions
                                                : []
                                        }
                                        placeholder={` ${
                                            rightField.charAt(0).toUpperCase() +
                                            rightField.slice(1)
                                        }`}
                                    />
                                </div>
                            </div>
                        ) : (
                            <React.Fragment>
                                {React.createElement(Icon, {
                                    className:
                                        "absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5",
                                })}
                                <input
                                    type="text"
                                    id={rightField}
                                    name={rightField}
                                    value={data[rightField]}
                                    onChange={handleChange}
                                    className="block pl-10 mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    required={
                                        !["prodi", "fakultas"].includes(
                                            rightField
                                        )
                                    }
                                />
                            </React.Fragment>
                        )}
                    </div>
                    {errors[rightField] && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                            {errors[rightField]}
                        </p>
                    )}
                </div>
            );
        };

        return (
            <div className="grid grid-cols-2 gap-4">
                {fieldPairs.map(([leftField, rightField]) => (
                    <React.Fragment key={`${leftField}-${rightField}`}>
                        {leftField && (
                            <div className="relative">
                                <label
                                    htmlFor={leftField}
                                    className="block text-sm font-medium text-gray-700 dark:text-gray-200"
                                >
                                    {leftField.charAt(0).toUpperCase() +
                                        leftField.slice(1)}{" "}
                                    *
                                </label>
                                <div className="relative">
                                    {React.createElement(
                                        fieldIcons[leftField],
                                        {
                                            className:
                                                "absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5",
                                        }
                                    )}
                                    <input
                                        type="text"
                                        id={leftField}
                                        name={leftField}
                                        value={data[leftField]}
                                        onChange={handleChange}
                                        className="block pl-10 mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        required
                                    />
                                </div>
                                {errors[leftField] && (
                                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                        {errors[leftField]}
                                    </p>
                                )}
                            </div>
                        )}

                        {renderRightField(rightField)}
                    </React.Fragment>
                ))}
            </div>
        );
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
        patch(route("profile.update"), {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {},
            onError: (errors) => {},
        });
    };

    const handlePasswordSubmit = (e) => {
        e.preventDefault();
        putPassword(route("password.update"), {
            onSuccess: () => {
                resetPassword();
            },
            preserveScroll: true,
        });
    };

    return (
        <FrontLayout>
            <Head title="Profile" />
            <div className="p-6 mx-auto my-20 space-y-8 max-w-6xl">
                <div className="p-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
                    <div className="flex items-center mb-6">
                        <User className="mr-2 w-6 h-6 text-gray-500 dark:text-gray-400" />
                        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200">
                            Profil Anda
                        </h2>
                    </div>

                    <div className="flex flex-col items-center mb-6">
                        <img
                            src={profileImage}
                            alt="Profile"
                            className="object-cover mb-4 w-32 h-32 rounded-full ring-2 ring-gray-200 dark:ring-gray-700"
                        />
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {renderFormFields()}

                        <div className="flex justify-end space-x-4">
                            <PrimaryButton type="submit" disabled={processing}>
                                {processing ? "Menyimpan..." : "Simpan"}
                            </PrimaryButton>
                        </div>
                    </form>
                </div>

                <div className="p-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
                    <div className="flex items-center mb-6">
                        <User className="mr-2 w-6 h-6 text-gray-500 dark:text-gray-400" />
                        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200">
                            Ubah Password
                        </h2>
                    </div>

                    <form onSubmit={handlePasswordSubmit} className="space-y-4">
                        {[
                            "current_password",
                            "password",
                            "password_confirmation",
                        ].map((field) => (
                            <div key={field}>
                                <label
                                    htmlFor={field}
                                    className="block text-sm font-medium text-gray-700 dark:text-gray-200"
                                >
                                    {field === "current_password"
                                        ? "Password Saat Ini"
                                        : field === "password"
                                        ? "Password Baru"
                                        : "Konfirmasi Password Baru"}{" "}
                                    *
                                </label>
                                <input
                                    type="password"
                                    id={field}
                                    name={field}
                                    value={passwordData[field]}
                                    onChange={handlePasswordChange}
                                    className="block mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    required
                                />
                                {passwordErrors[field] && (
                                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                        {passwordErrors[field]}
                                    </p>
                                )}
                            </div>
                        ))}

                        <div className="flex justify-end space-x-4">
                            <PrimaryButton
                                type="submit"
                                disabled={passwordProcessing}
                            >
                                {passwordProcessing
                                    ? "Menyimpan..."
                                    : "Ubah Password"}
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </div>
        </FrontLayout>
    );
}
