import React from "react";
import { usePage } from "@inertiajs/react";
import filkomLogo from "@images/filkomlogo.png";
import * as LucideIcons from "lucide-react";

const SocialIcon = React.memo(({ name, href }) => {
    const getIcon = (name) => {
        const capitalizedName =
            name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();

        const iconMap = {
            LinkedIn: "Linkedin",
            YouTube: "Youtube",
        };

        const iconName = iconMap[capitalizedName] || capitalizedName;
        const Icon = LucideIcons[iconName];

        if (!Icon) {
            console.warn(`Icon not found for: ${name}`);
            return <LucideIcons.Link className="w-4 h-4" />;
        }

        return <Icon className="w-4 h-4" />;
    };

    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-8 h-8 text-gray-600 transition-colors bg-gray-100 rounded-full hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
        >
            {getIcon(name)}
        </a>
    );
});

const FooterSection = React.memo(({ title, links }) => (
    <div className="mb-6 text-center widget md:text-left">
        <h4 className="mb-3 text-sm font-bold md:text-base widget-title">
            {title}
        </h4>
        <ul className="p-0 list-none">
            {links.map((link, index) => (
                <li key={index} className="mb-2">
                    {typeof link === "string" ? (
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                            {link}
                        </span>
                    ) : (
                        <a
                            href={link.href || "#"}
                            className="text-sm text-blue-500 hover:underline"
                            target={
                                link.href?.startsWith("http")
                                    ? "_blank"
                                    : "_self"
                            }
                            rel="noopener noreferrer"
                        >
                            {link.text || link.name}
                        </a>
                    )}
                </li>
            ))}
        </ul>
    </div>
));

const FrontFooter = () => {
    const { settings_data: settings } = usePage().props;
    const currentYear = new Date().getFullYear();

    const sistemOnlineLinks = Object.entries(settings?.sistem_online || {}).map(
        ([name, href]) => ({
            text: name,
            href,
        }),
    );

    const relatedLinks = Object.entries(settings?.related_links || {}).map(
        ([name, href]) => ({
            text: name,
            href,
        }),
    );

    const socialLinks = Object.entries(settings?.social_links || {}).map(
        ([name, href]) => ({
            name,
            href,
        }),
    );

    return (
        <footer className="w-full py-6 mt-auto bg-white md:py-8 dark:bg-gray-900 dark:text-white">
            <div className="container max-w-6xl px-4 mx-auto sm:px-6 md:px-8 lg:px-12">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
                    {/* Logo and Social Section */}
                    <div className="md:col-span-4 lg:col-span-3">
                        <div className="flex flex-col items-center space-y-4 md:items-start">
                            <div className="flex items-center gap-3">
                                <img
                                    className="object-contain w-10 h-10 md:w-12 md:h-12"
                                    src={filkomLogo}
                                    alt="Logo FILKOM"
                                />
                                <div className="flex flex-col">
                                    <span className="font-sans text-xs">
                                        FAKULTAS ILMU KOMPUTER
                                    </span>
                                    <span className="text-sm font-bold">
                                        UNIDA BOGOR
                                    </span>
                                    <span className="font-sans text-xs">
                                        KAMPUS BERTAUHID
                                    </span>
                                </div>
                            </div>
                            <div className="flex flex-wrap items-center gap-2 md:gap-3">
                                {socialLinks.map((social, index) => (
                                    <SocialIcon
                                        key={index}
                                        name={social.name}
                                        href={social.href}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Links Sections */}
                    <div className="grid grid-cols-1 gap-6 place-items-center md:place-items-start xs:grid-cols-2 sm:gap-8 lg:grid-cols-3 md:col-span-8 lg:col-span-9">
                        <FooterSection
                            title="Sistem Online"
                            links={sistemOnlineLinks}
                        />
                        <FooterSection
                            title="Link Relasi"
                            links={relatedLinks}
                        />
                        <FooterSection
                            title="Kontak"
                            links={settings?.contact_info || []}
                        />
                    </div>
                </div>

                {/* Copyright */}
                <div className="pt-6 mt-6 border-t md:pt-8 md:mt-8 dark:border-gray-800">
                    <p className="text-xs text-center text-gray-600 md:text-sm dark:text-gray-400">
                        © {currentYear} made with ❤️ Djuanda University.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default React.memo(FrontFooter);
