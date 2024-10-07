import React from 'react';
import { Link } from '@inertiajs/react';

const SocialIcon = ({ href, icon }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className="mr-2">
        <i className={`fab fa-${icon}`}></i>
    </a>
);

const FooterSection = ({ title, links }) => (
    <div className="widget mb-6">
        <h4 className="widget-title mb-3 font-bold">{title}</h4>
        <ul className="list-none p-0">
            {links.map((link, index) => (
                <li key={index} className="mb-2">
                    <a href={link.href} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{link.text}</a>
                </li>
            ))}
        </ul>
    </div>
);

const ContactInfo = () => (
    <div className="widget">
        <h4 className="widget-title mb-3 font-bold">Kontak</h4>
        <address className="mb-2">Jl. Tol Ciawi No. 1, Ciawi-Bogor, Jawa Barat, Indonesia.</address>
        <a href="mailto:filkom@unida.ac.id" className="text-blue-500 block mb-1">filkom@unida.ac.id</a>
        <span>02518240773</span>
    </div>
);

const SocialIcons = () => (
    <nav className="nav social flex justify-center md:justify-start space-x-4">
        {[
            { href: "https://twitter.com/PMBUnidaBogor", icon: "twitter" },
            { href: "https://facebook.com/PmbUnida", icon: "facebook" },
            { href: "https://www.linkedin.com/in/universitas-djuanda-bogor-a97702172/", icon: "linkedin" },
            { href: "https://www.instagram.com/faipgunida", icon: "instagram" },
            { href: "https://www.youtube.com/channel/UC9EKxYOSyg0QtOs8sAXTceQ?view_as=subscriber", icon: "youtube" }
        ].map((social, index) => (
            <SocialIcon key={index} href={social.href} icon={social.icon} />
        ))}
    </nav>
);

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="py-10 md:px-8 lg:px-48 bg-white border-t">
            <div className="container mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <div className="col-span-1 md:col-span-2 lg:col-span-1">
                        <div className="widget flex flex-col items-center md:items-start">
                            <img
                                className="mb-4 w-full max-w-[300px] h-auto object-contain"
                                src="https://filkom.unida.ac.id/storage/logo/1694631383.png"
                                alt="Fakultas Ilmu Komputer"
                            />
                            <SocialIcons />
                        </div>
                    </div>

                    <FooterSection
                        title="Sistem Online"
                        links={[
                            { href: "https://unida.ac.id/pmb", text: "Pendaftaran Online" },
                            { href: "https://cool.unida.ac.id", text: "E-Learning" },
                            { href: "https://ojs.unida.ac.id", text: "Jurnal" },
                            { href: "https://iojs.unida.ac.id", text: "Jurnal Internasional" },
                        ]}
                    />

                    <FooterSection title="Link Relasi" links={[]} />

                    <ContactInfo />
                </div>

                <div className="flex justify-center mt-8 pt-5 border-t">
                    <p className="text-sm text-gray-600">© {currentYear} made with ❤️ Djuanda University.</p>
                </div>
            </div>
        </footer>
    );
}