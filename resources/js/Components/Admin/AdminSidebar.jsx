import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import {
    Settings,
    Users,
    HelpCircle,
    LogOut,
    ChevronDown,
    LayoutDashboard,
    ChevronRight,
    Menu as MenuIcon,
    X,
    FileText,
    GraduationCap,
    File,
    UserCog,
    TargetIcon,
    LucideTable2,
} from 'lucide-react';
import { Link, usePage } from '@inertiajs/react';
import filkomLogo from '@images/filkomlogo.png';

const SidebarTooltip = React.memo(({ children, label, show }) =>
    show ? (
        <div className="relative group">
            {children}
            <div className="absolute hidden ml-2 transform -translate-y-1/2 left-full top-1/2 group-hover:block">
                <span className="px-2 py-1 text-sm text-white bg-gray-800 rounded">{label}</span>
            </div>
        </div>
    ) : (
        children
    )
);

const SidebarItem = ({ icon, label, href, isCollapsed }) => {
    const { url } = usePage();
    const isActive = url === new URL(href, window.location.origin).pathname;

    return (
        <SidebarTooltip label={label} show={isCollapsed}>
            <Link
                href={href}
                className={`flex items-center rounded-lg px-4 py-2 transition-colors duration-200
          ${isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'}
          ${isCollapsed ? 'justify-center' : ''}`}
            >
                {React.cloneElement(icon, {
                    className: `w-5 h-5 ${isActive ? 'text-blue-600' : 'text-gray-700'}`,
                })}
                {!isCollapsed && <span className="ml-2">{label}</span>}
            </Link>
        </SidebarTooltip>
    );
};

const SidebarDropdown = ({ icon, label, children, isCollapsed }) => {
    const { url } = usePage();
    const childHrefs = React.Children.map(children, (child) => new URL(child.props.href, window.location.origin).pathname);
    const isActive = childHrefs.includes(url);
    const [isOpen, setIsOpen] = useState(isActive);
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);
    const popoverRef = useRef();

    const toggleOpen = useCallback(() => setIsOpen((prev) => !prev), []);
    const togglePopover = useCallback(() => setIsPopoverOpen((prev) => !prev), []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (popoverRef.current && !popoverRef.current.contains(event.target)) {
                setIsPopoverOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="relative">
            <SidebarTooltip label={label} show={isCollapsed}>
                <button
                    onClick={isCollapsed ? togglePopover : toggleOpen}
                    className={`flex w-full items-center rounded-lg px-4 py-2 transition-colors duration-200 focus:outline-none
            ${isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'}
            ${isCollapsed ? 'justify-center' : 'justify-between'}`}
                >
                    <div className="flex items-center">
                        {React.cloneElement(icon, {
                            className: `w-5 h-5 ${isActive ? 'text-blue-600' : 'text-gray-700'}`,
                        })}
                        {!isCollapsed && <span className="ml-2">{label}</span>}
                    </div>
                    {!isCollapsed && (
                        <ChevronDown
                            size={16}
                            className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`}
                        />
                    )}
                </button>
            </SidebarTooltip>

            {isOpen && !isCollapsed && (
                <div className="pl-4 mt-1 space-y-1">
                    {React.Children.map(children, (child) =>
                        React.cloneElement(child)
                    )}
                </div>
            )}

            {isPopoverOpen && isCollapsed && (
                <div ref={popoverRef} className="absolute z-50 mt-2 ml-2 bg-white border border-gray-200 rounded-lg shadow-lg left-full">
                    <div className="p-2 space-y-1">
                        {React.Children.map(children, (child) =>
                            React.cloneElement(child)
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

const AdminSidebar = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    const toggleCollapsed = useCallback(() => setIsCollapsed((prev) => !prev), []);
    const toggleMobileMenu = useCallback(() => setIsMobileOpen((prev) => !prev), []);

    const sidebarClass = useMemo(
        () => `
            ${isCollapsed ? 'w-20' : 'w-64'}
            ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
            fixed md:static md:translate-x-0
            flex flex-col min-h-screen bg-white border-r border-gray-200 p-4
            transition-all duration-300 ease-in-out z-50
        `,
        [isCollapsed, isMobileOpen]
    );

    const navigationItems = [
        {
            type: 'item',
            icon: <LayoutDashboard />,
            label: 'Dashboard',
            href: route('dashboard'),
        },
        {
            type: 'dropdown',
            icon: <LucideTable2 />,
            label: 'Tabel',
            children: [
                { icon: <FileText />, label: 'Logbook', href: '' },
                { icon: <TargetIcon />, label: 'Bimbingan', href: '' },
                { icon: <File />, label: 'Laporan', href: '' },
            ],
        },
        {
            type: 'dropdown',
            icon: <Users />,
            label: 'Data',
            children: [
                {
                    icon: <GraduationCap />,
                    label: 'Mahasiswa',
                    href: route('mahasiswas.index'),
                },
                { icon: <UserCog />, label: 'Admin', href: '' },
            ],
        },
        {
            type: 'item',
            icon: <Settings />,
            label: 'Settings',
            href: '',
        },
    ];

    return (
        <>
            <button
                onClick={toggleMobileMenu}
                className="fixed p-2 bg-white rounded-lg shadow-lg top-4 left-4 md:hidden focus:outline-none"
            >
                {isMobileOpen ? <X size={24} /> : <MenuIcon size={24} />}
            </button>

            <div className={sidebarClass}>
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className={`flex items-center ${isCollapsed ? 'w-full justify-center' : ''}`}>
                        <img
                            src={filkomLogo}
                            alt="Filkom Logo"
                            className={`h-8 w-8 transition-all duration-200 ${isCollapsed ? 'hidden' : 'block'}`}
                        />
                        {!isCollapsed && <div className="ml-2 text-2xl font-bold">Dashboard</div>}
                    </div>
                    <button
                        onClick={toggleCollapsed}
                        className="hidden p-2 rounded-lg hover:bg-gray-100 md:block focus:outline-none"
                    >
                        {isCollapsed ? <ChevronRight size={20} /> : <X size={20} />}
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 space-y-1">
                    {navigationItems.map((item, index) =>
                        item.type === 'dropdown' ? (
                            <SidebarDropdown
                                key={index}
                                icon={item.icon}
                                label={item.label}
                                isCollapsed={isCollapsed}
                            >
                                {item.children.map((child, childIndex) => (
                                    <SidebarItem
                                        key={childIndex}
                                        icon={child.icon}
                                        label={child.label}
                                        href={child.href}
                                        isCollapsed={isCollapsed}
                                    />
                                ))}
                            </SidebarDropdown>
                        ) : (
                            <SidebarItem
                                key={index}
                                icon={item.icon}
                                label={item.label}
                                href={item.href}
                                isCollapsed={isCollapsed}
                            />
                        )
                    )}
                </nav>

                {/* Footer */}
                <div className="mt-auto space-y-4">
                    <div className="flex-1 space-y-1">
                        <SidebarItem
                            href=""
                            icon={<HelpCircle />}
                            label="Help & Information"
                            isCollapsed={isCollapsed}
                        />

                        <SidebarTooltip label="Log out" show={isCollapsed}>
                            <Link
                                method="post"
                                href={route('logout')}
                                as="button"
                                className={`flex w-full items-center rounded-lg px-4 py-2 text-red-700 hover:bg-gray-100 transition-colors duration-200
                                    ${isCollapsed ? 'justify-center' : ''}`}
                            >
                                <LogOut className="w-5 h-5" />
                                {!isCollapsed && <span className="ml-2 transition-all duration-200">Logout</span>}
                            </Link>
                        </SidebarTooltip>
                    </div>
                </div>
            </div>

            {/* Overlay for mobile */}
            {isMobileOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black opacity-50"
                    onClick={toggleMobileMenu}
                ></div>
            )}
        </>
    );
};

export default AdminSidebar;