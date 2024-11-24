import React from 'react';
import { Link } from '@inertiajs/react';
import filkomLogo from '@images/filkom.png';

const SocialIcon = React.memo(({ href, icon }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className="mr-2">
        <i className={`fab fa-${icon}`}></i>
    </a>
));

const FooterSection = React.memo(({ title, links }) => (
    <div className="mb-6 widget">
        <h4 className="mb-3 font-bold widget-title">{title}</h4>
        <ul className="p-0 list-none">
            {links.map((link, index) => (
                <li key={index} className="mb-2">
                    <Link href={link.href} className="text-blue-500 hover:underline">{link.text}</Link>
                </li>
            ))}
        </ul>
    </div>
));

const ContactInfo = React.memo(() => (
    <div className="widget">
        <h4 className="mb-3 font-bold widget-title">Kontak</h4>
        <address className="mb-2">Jl. Tol Ciawi No. 1, Ciawi-Bogor, Jawa Barat, Indonesia.</address>
        <a href="mailto:filkom@unida.ac.id" className="block mb-1 text-blue-500">filkom@unida.ac.id</a>
        <span>02518240773</span>
    </div>
));

const socialLinks = [
    { href: "https://twitter.com/PMBUnidaBogor", icon: "twitter" },
    { href: "https://facebook.com/PmbUnida", icon: "facebook" },
    { href: "https://www.linkedin.com/in/universitas-djuanda-bogor-a97702172/", icon: "linkedin" },
    { href: "https://www.instagram.com/faipgunida", icon: "instagram" },
    { href: "https://www.youtube.com/channel/UC9EKxYOSyg0QtOs8sAXTceQ?view_as=subscriber", icon: "youtube" }
];

const SocialIcons = React.memo(() => (
    <nav className="flex justify-center space-x-4 nav social md:justify-start">
        {socialLinks.map((social, index) => (
            <SocialIcon key={index} href={social.href} icon={social.icon} />
        ))}
    </nav>
));

const FrontFooter = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="w-full py-8 mt-auto bg-white dark:bg-gray-900 dark:text-white">
            <div className="container mx-auto max-w-6xl px-8 sm:px-12 md:px-16 lg:px-24 xl:px-32">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
                    {/* Logo and Social Section */}
                    <div className="md:col-span-4 lg:col-span-3">
                        <div className="flex flex-col items-center md:items-start space-y-4">
                            <img
                                className="h-16 w-auto object-contain"
                                src={filkomLogo}
                                alt="Fakultas Ilmu Komputer"
                            />
                            <SocialIcons />
                        </div>
                    </div>

                    {/* Links Sections */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:col-span-8 lg:col-span-9">
                        <FooterSection
                            title="Sistem Online"
                            links={[
                                { href: "", text: "Pendaftaran Online" },
                                { href: "", text: "E-Learning" },
                                { href: "", text: "Jurnal" },
                                { href: "", text: "Jurnal Internasional" },
                            ]}
                        />
                        <FooterSection title="Link Relasi" links={[]} />
                        <ContactInfo />
                    </div>
                </div>

                {/* Copyright */}
                <div className="pt-8 mt-8 border-t dark:border-gray-800">
                    <p className="text-sm text-center text-gray-600 dark:text-gray-400">
                        © {currentYear} made with ❤️ Djuanda University.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default React.memo(FrontFooter);
