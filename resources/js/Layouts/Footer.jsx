import React from 'react';
import { Link } from '@inertiajs/react';
import filkomLogo from '../../images/filkom.png';

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

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="container px-4 py-8 mx-auto md:px-8 lg:px-16 md:py-20">
            <div className="container mx-auto">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
                    <div className="col-span-1 md:col-span-2 lg:col-span-1">
                        <div className="flex flex-col items-center widget md:items-start">
                            <img
                                className="mb-4 w-full max-w-[300px] h-auto object-contain"
                                src={filkomLogo}
                                alt="Fakultas Ilmu Komputer"
                            />
                            <SocialIcons />
                        </div>
                    </div>

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

                <div className="flex justify-center pt-5 mt-8 border-t">
                    <p className="text-sm text-gray-600">© {currentYear} made with ❤️ Djuanda University.</p>
                </div>
            </div>
        </footer>
    );
};

export default React.memo(Footer);
