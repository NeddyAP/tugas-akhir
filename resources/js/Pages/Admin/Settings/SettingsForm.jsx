import React from "react";
import { useForm, usePage } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import DynamicList from "./components/DynamicList";
import SistemOnlineSection from "./components/SistemOnlineSection";
import SaveButton from "./components/SaveButton";

const SettingsForm = () => {
    const { settings_data: settings } = usePage().props;

    const { data, setData, post, processing } = useForm({
        related_links: settings?.related_links || {}, // Changed to object
        contact_info: settings?.contact_info || [],
        sistem_online: settings?.sistem_online || {},
        social_links: settings?.social_links || {},
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("admin.settings.store"));
    };

    const handleAdd = React.useCallback(
        (field) => setData(field, [...data[field], ""]),
        [data, setData],
    );

    const handleRemove = React.useCallback(
        (field, index) =>
            setData(
                field,
                data[field].filter((_, i) => i !== index),
            ),
        [data, setData],
    );

    const handleUpdate = React.useCallback(
        (field, index, value) => {
            const newData = [...data[field]];
            newData[index] = value;
            setData(field, newData);
        },
        [data, setData],
    );

    const labelClassName =
        "block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300";

    return (
        <AdminLayout title="Global Settings">
            <div className="container max-w-4xl px-4 mx-auto">
                <form
                    onSubmit={handleSubmit}
                    className="p-6 space-y-6 bg-white rounded-lg shadow-sm dark:bg-gray-900"
                >
                    <div className="pb-4 border-b border-gray-200 dark:border-gray-700">
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                            Global Settings
                        </h1>
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                            Manage your website's global settings and
                            configurations.
                        </p>
                    </div>

                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Footer Items
                    </h1>

                    <div className="pt-4 space-y-6">
                        <div className="form-group">
                            <label className={labelClassName}>
                                Sistem Online
                            </label>
                            <SistemOnlineSection
                                data={data.sistem_online}
                                onChange={(newValue) =>
                                    setData("sistem_online", newValue)
                                }
                            />
                        </div>

                        <div className="form-group">
                            <label className={labelClassName}>
                                Related Links
                            </label>
                            <SistemOnlineSection
                                data={data.related_links}
                                onChange={(newValue) =>
                                    setData("related_links", newValue)
                                }
                            />
                        </div>

                        <div className="form-group">
                            <label className={labelClassName}>
                                Social Media Links
                            </label>
                            <SistemOnlineSection
                                data={data.social_links}
                                onChange={(newValue) =>
                                    setData("social_links", newValue)
                                }
                            />
                        </div>

                        <div className="form-group">
                            <label className={labelClassName}>
                                Contact Info
                            </label>
                            <DynamicList
                                items={data.contact_info}
                                onAdd={() => handleAdd("contact_info")}
                                onRemove={(index) =>
                                    handleRemove("contact_info", index)
                                }
                                onUpdate={(index, value) =>
                                    handleUpdate("contact_info", index, value)
                                }
                            />
                        </div>
                    </div>

                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                        <SaveButton processing={processing} />
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
};

export default React.memo(SettingsForm);
