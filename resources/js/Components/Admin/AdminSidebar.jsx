import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import {
    Settings, Users, HelpCircle, LogOut, ChevronDown,
    LayoutDashboard, ChevronRight, Menu as MenuIcon,
    X, FileText, GraduationCap, File, UserCog,
    TargetIcon, LucideTable2, UserPen,
} from 'lucide-react';
import { Link, usePage } from '@inertiajs/react';
import filkomLogo from '@images/filkomlogo.png';

// Navigation configuration - moved outside component to prevent recreating on each render
const NAVIGATION_ITEMS = [
    {
        type: 'item',
        icon: <LayoutDashboard />,
        label: 'Dashboard',
        href: route('admin.dashboard'),
    },
    {
        type: 'dropdown',
        icon: <LucideTable2 />,
        label: 'Tabel',
        children: [
            { icon: <FileText />, label: 'Logbook', href: route('admin.logbooks.index') },
            { icon: <TargetIcon />, label: 'Bimbingan', href: route('admin.bimbingans.index') },
            { icon: <File />, label: 'Laporan', href: '' },
        ],
    },
    {
        type: 'dropdown',
        icon: <Users />,
        label: 'Data',
        children: [
            { icon: <GraduationCap />, label: 'Mahasiswa', href: route('admin.users.index', { tab: 'mahasiswa' }) },
            { icon: <UserPen />, label: 'Dosen', href: route('admin.users.index', { tab: 'dosen' }) },
            { icon: <UserCog />, label: 'Admin', href: route('admin.users.index', { tab: 'admin' }) },
        ],
    },
    {
        type: 'item',
        icon: <Settings />,
        label: 'Settings',
        href: '',
    },
];

// Tooltip component optimized with memo
const SidebarTooltip = React.memo(({ children, label, show }) => {
    if (!show) return children;

    return (
        <div className="relative group">
            {children}
            <div className="absolute hidden ml-2 transform -translate-y-1/2 left-full top-1/2 group-hover:block">
                <span className="px-2 py-1 text-sm text-white bg-gray-800 rounded">{label}</span>
            </div>
        </div>
    );
});

// Utility function for URL matching
const isUrlMatch = (href, currentUrl, currentTab) => {
    if (!href) return false;
    const targetUrl = new URL(href, window.location.origin);
    const targetPath = targetUrl.pathname;
    const targetParams = new URLSearchParams(targetUrl.search);
    const targetTab = targetParams.get('tab');

    return currentUrl === targetPath && (!targetTab || currentTab === targetTab);
};

// SidebarItem component optimized with memo
const SidebarItem = React.memo(({ icon, label, href, isCollapsed }) => {
    const { url } = usePage();
    const urlWithoutParams = url.split('?')[0];
    const urlParams = new URLSearchParams(window.location.search);
    const currentTab = urlParams.get('tab');

    const isActive = isUrlMatch(href, urlWithoutParams, currentTab);

    const itemClasses = `
        flex items-center rounded-lg px-4 py-2 transition-colors duration-200
        ${isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'}
        ${isCollapsed ? 'justify-center' : ''}
    `;

    return (
        <SidebarTooltip label={label} show={isCollapsed}>
            <Link href={href} className={itemClasses}>
                {React.cloneElement(icon, {
                    className: `w-5 h-5 ${isActive ? 'text-blue-600' : 'text-gray-700'}`,
                })}
                {!isCollapsed && <span className="ml-2">{label}</span>}
            </Link>
        </SidebarTooltip>
    );
});

// SidebarDropdown component optimized with memo
const SidebarDropdown = React.memo(({ icon, label, children, isCollapsed }) => {
    const { url } = usePage();
    const urlWithoutParams = url.split('?')[0];
    const urlParams = new URLSearchParams(window.location.search);
    const currentTab = urlParams.get('tab');

    const isActive = React.Children.toArray(children).some(child =>
        isUrlMatch(child.props.href, urlWithoutParams, currentTab)
    );

    const [isOpen, setIsOpen] = useState(isActive);
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);
    const popoverRef = useRef();

    useEffect(() => {
        setIsOpen(isActive);
    }, [isActive]);

    useEffect(() => {
        if (!isPopoverOpen) return;

        const handleClickOutside = (event) => {
            if (popoverRef.current && !popoverRef.current.contains(event.target)) {
                setIsPopoverOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isPopoverOpen]);

    const handleClick = useCallback(() => {
        if (isCollapsed) {
            setIsPopoverOpen(prev => !prev);
        } else {
            setIsOpen(prev => !prev);
        }
    }, [isCollapsed]);

    const buttonClasses = `
        flex w-full items-center rounded-lg px-4 py-2 transition-colors duration-200 focus:outline-none
        ${isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'}
        ${isCollapsed ? 'justify-center' : 'justify-between'}
    `;

    return (
        <div className="relative">
            <SidebarTooltip label={label} show={isCollapsed}>
                <button onClick={handleClick} className={buttonClasses}>
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
                    {children}
                </div>
            )}

            {isPopoverOpen && isCollapsed && (
                <div ref={popoverRef} className="absolute z-50 mt-2 ml-2 bg-white border border-gray-200 rounded-lg shadow-lg left-full">
                    <div className="p-2 space-y-1">
                        {children}
                    </div>
                </div>
            )}
        </div>
    );
});

const AdminSidebar = ({ onCollapse = () => { } }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    const toggleCollapsed = useCallback(() => {
        setIsCollapsed(prev => {
            const newState = !prev;
            onCollapse(newState);
            return newState;
        });
    }, [onCollapse]);

    const toggleMobileMenu = useCallback(() => {
        setIsMobileOpen(prev => !prev);
    }, []);

    const sidebarClass = useMemo(() => `
        ${isCollapsed ? 'w-34' : 'w-64'}
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
        fixed top-0 left-0 md:translate-x-0
        flex flex-col bg-white border-r border-gray-200 p-4
        transition-all duration-300 ease-in-out z-50 h-screen
    `, [isCollapsed, isMobileOpen]);

    return (
        <>
            <button
                onClick={toggleMobileMenu}
                className="fixed p-2 bg-white rounded-lg shadow-lg top-4 left-4 md:hidden focus:outline-none"
            >
                {isMobileOpen ? <X size={24} /> : <MenuIcon size={24} />}
            </button>

            <div className={sidebarClass}>
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

                <div className="flex flex-col flex-1">
                    <nav className="flex-1 space-y-1">
                        {NAVIGATION_ITEMS.map((item, index) => (
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
                                            {...child}
                                            isCollapsed={isCollapsed}
                                        />
                                    ))}
                                </SidebarDropdown>
                            ) : (
                                <SidebarItem
                                    key={index}
                                    {...item}
                                    isCollapsed={isCollapsed}
                                />
                            )
                        ))}
                    </nav>

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
                                    className={`flex w-full items-center rounded-lg px-4 py-2 text-red-700 hover:bg-gray-100 transition-colors duration-200 ${isCollapsed ? 'justify-center' : ''}`}
                                >
                                    <LogOut className="w-5 h-5" />
                                    {!isCollapsed && <span className="ml-2">Logout</span>}
                                </Link>
                            </SidebarTooltip>
                        </div>
                    </div>
                </div>
            </div>

            {isMobileOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black opacity-50"
                    onClick={toggleMobileMenu}
                />
            )}
        </>
    );
};

export default React.memo(AdminSidebar);