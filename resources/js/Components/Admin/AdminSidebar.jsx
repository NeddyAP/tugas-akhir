import React, { useState, useCallback, useMemo } from 'react';
import {
    Settings,
    Users,
    HelpCircle,
    LogOut,
    ChevronDown,
    LayoutDashboard,
    ChevronRight,
    MenuIcon,
    X,
    FileText,
    GraduationCap,
    LucideTable2,
    Goal,
    File,
    UserCog2Icon
} from 'lucide-react';
import { Link, usePage } from '@inertiajs/react';

// Assuming you have a way to import images in your project
import filkomLogo from '@images/filkomlogo.png';

const SidebarTooltip = ({ children, label, show }) => {
    if (!show) return children;

    return (
        <div className="relative group">
            {children}
            <div className="absolute px-2 py-1 ml-2 text-sm text-white transition-opacity duration-200 -translate-y-1/2 bg-gray-800 rounded-md opacity-0 pointer-events-none left-full top-1/2 whitespace-nowrap group-hover:opacity-100">
                {label}
            </div>
        </div>
    );
};

const SidebarItem = ({ icon, label, href, isCollapsed }) => {
    const { url } = usePage();
    const isActive = url.startsWith(href);

    return (
        <SidebarTooltip label={label} show={isCollapsed}>
            <Link
                href={href}
                className={`flex items-center rounded-lg px-4 py-2 transition-colors duration-200
          ${isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'} 
          ${isCollapsed ? 'justify-center' : ''}`}
            >
                {React.cloneElement(icon, {
                    className: isActive ? 'text-blue-600' : 'text-gray-700'
                })}
                <span className={`ml-2 transition-all duration-200 ${isCollapsed ? 'hidden' : 'block'}`}>
                    {label}
                </span>
            </Link>
        </SidebarTooltip>
    );
};

const SidebarDropdown = ({ icon, label, children, isCollapsed }) => {
    const [isOpen, setIsOpen] = useState(false);
    const { url } = usePage();
    const childRoutes = React.Children.map(children, child => child.props.href);
    const isActive = childRoutes.some(route => url.startsWith(route));

    const toggleOpen = useCallback(() => setIsOpen(prev => !prev), []);

    useMemo(() => {
        if (isActive) setIsOpen(true);
    }, [isActive]);

    return (
        <div className="relative">
            <SidebarTooltip label={label} show={isCollapsed}>
                <button
                    onClick={toggleOpen}
                    className={`flex w-full items-center rounded-lg px-4 py-2 transition-colors duration-200
            ${isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'}
            ${isCollapsed ? 'justify-center' : 'justify-between'}`}
                >
                    <div className={`flex items-center ${isCollapsed ? 'justify-center' : ''}`}>
                        {React.cloneElement(icon, {
                            className: isActive ? 'text-blue-600' : 'text-gray-700'
                        })}
                        <span className={`ml-2 transition-all duration-200 ${isCollapsed ? 'hidden' : 'block'}`}>
                            {label}
                        </span>
                    </div>
                    {!isCollapsed && (
                        <ChevronDown
                            size={16}
                            className={`transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                        />
                    )}
                </button>
            </SidebarTooltip>

            {isOpen && !isCollapsed && (
                <div className="pl-4 mt-1 space-y-1">
                    {children}
                </div>
            )}
        </div>
    );
};

const AdminSidebar = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    const toggleCollapsed = useCallback(() => setIsCollapsed(prev => !prev), []);
    const toggleMobileMenu = useCallback(() => setIsMobileOpen(prev => !prev), []);

    const sidebarClass = `
    ${isCollapsed ? 'w-20' : 'w-64'} 
    ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
    fixed md:static md:translate-x-0
    flex flex-col min-h-screen bg-white border-r border-gray-200 p-4
    transition-all duration-300 ease-in-out z-50
  `;

    const navigationItems = useMemo(() => [
        {
            type: 'item',
            icon: <LayoutDashboard size={20} />,
            label: 'Dashboard',
            href: route('dashboard')
        },
        {
            type: 'dropdown',
            icon: <LucideTable2 size={20} />,
            label: 'Tabel',
            children: [
                { icon: <FileText size={18} />, label: 'Logbook', href: '/logbook' },
                { icon: <Goal size={18} />, label: 'Bimbingan', href: '/bimbingan' },
                { icon: <File size={18} />, label: 'Laporan', href: '/laporan' }
            ]
        },
        {
            type: 'dropdown',
            icon: <Users size={20} />,
            label: 'Data',
            children: [
                { icon: <GraduationCap size={20} />, label: 'Mahasiswa', href: route('mahasiswas.index') },
                { icon: <UserCog2Icon size={18} />, label: 'Admin', href: route('dashboard') }
            ]
        },
        {
            type: 'item',
            icon: <Settings size={20} />,
            label: 'Settings',
            href: '/settings'
        }
    ], []);

    return (
        <>
            <button
                onClick={toggleMobileMenu}
                className="fixed p-2 bg-white rounded-lg shadow-lg top-4 left-4 md:hidden"
            >
                <MenuIcon size={24} />
            </button>

            <div className={sidebarClass}>
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className={`flex items-center ${isCollapsed ? 'w-full justify-center' : ''}`}>
                        <img
                            src={filkomLogo}
                            alt="Filkom Logo"
                            className={`h-8 transition-all duration-200 ${isCollapsed ? 'hidden' : 'block'}`}
                        />
                        <div className={`font-bold ${isCollapsed ? 'text-xl' : 'text-2xl ml-2'}`}>
                            {isCollapsed ? '' : 'Dashboard'}
                        </div>
                    </div>
                    <button
                        onClick={toggleCollapsed}
                        className="hidden p-2 rounded-lg hover:bg-gray-100 md:block"
                    >
                        {isCollapsed ? <ChevronRight size={20} /> : <X size={20} />}
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 space-y-1">
                    {navigationItems.map((item, index) => (
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
                    ))}
                </nav>

                {/* Footer */}
                <div className="mt-auto space-y-4">
                    <div className="space-y-1">
                        <SidebarItem
                            href="/help"
                            icon={<HelpCircle size={20} />}
                            label="Help & Information"
                            isCollapsed={isCollapsed}
                        />

                        <SidebarTooltip label="Log out" show={isCollapsed}>
                            <Link
                                method="post"
                                href={route('logout')}
                                as="button"
                                className={`flex w-full items-center rounded-lg px-4 py-2 text-red-700 hover:bg-gray-100 
                  ${isCollapsed ? 'justify-center' : ''}`}
                            >
                                <LogOut size={20} />
                                <span className={`ml-2 transition-all duration-200 ${isCollapsed ? 'hidden' : 'block'}`}>
                                    Logout
                                </span>
                            </Link>
                        </SidebarTooltip>
                    </div>
                </div>
            </div>

            {isMobileOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 md:hidden"
                    onClick={toggleMobileMenu}
                />
            )}
        </>
    );
};

export default AdminSidebar;