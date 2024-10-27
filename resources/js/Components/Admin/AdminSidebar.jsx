// src/components/admin/AdminSidebar.jsx
import React, { useState } from 'react';
import {
    Settings,
    Layout,
    Users,
    HelpCircle,
    LogOut,
    ChevronDown,
    LayoutDashboard,
    ChevronRight,
    MenuIcon,
    X,
    FileText,
    Calendar,
    CheckSquare,
    Flag
} from 'lucide-react';
import { Link, usePage } from '@inertiajs/react';
import FilkomLogo from '../../../images/filkomlogo.png';

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

const SidebarItem = ({ icon, label, href, isActive, isCollapsed }) => {
    return (
        <SidebarTooltip label={label} show={isCollapsed}>
            <Link
                href={href}
                className={`flex items-center px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100 ${isActive ? 'text-blue-600' : ''} ${isCollapsed ? 'justify-center' : ''}`}
            >
                {icon}
                <span className={`ml-2 transition-all duration-200 ${isCollapsed ? 'hidden' : 'block'}`}>
                    {label}
                </span>
            </Link>
        </SidebarTooltip>
    );
};

const SidebarDropdown = ({ icon, label, children, isCollapsed }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative">
            <SidebarTooltip label={label} show={isCollapsed}>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className={`flex items-center w-full px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100
            ${isCollapsed ? 'justify-center' : 'justify-between'}`}
                >
                    <div className={`flex items-center ${isCollapsed ? 'justify-center' : ''}`}>
                        {icon}
                        <span className={`ml-2 transition-all duration-200 
              ${isCollapsed ? 'hidden' : 'block'}`}>
                            {label}
                        </span>
                    </div>
                    {!isCollapsed && (
                        <ChevronDown
                            size={16}
                            className={`transform transition-transform duration-200 
                ${isOpen ? 'rotate-180' : ''}`}
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
    const { url } = usePage();

    const sidebarClass = `
    ${isCollapsed ? 'w-20' : 'w-64'} 
    ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
    fixed md:static md:translate-x-0
    flex flex-col min-h-screen p-4 bg-white border-r border-gray-200
    transition-all duration-300 ease-in-out z-50
  `;

    return (
        <>
            {/* Mobile Menu Button */}
            <button
                onClick={() => setIsMobileOpen(!isMobileOpen)}
                className="fixed p-2 bg-white rounded-lg shadow-lg md:hidden top-4 left-4"
            >
                <MenuIcon size={24} />
            </button>

            <div className={sidebarClass}>
                {/* Sidebar Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className={`flex items-center ${isCollapsed ? 'justify-center w-full' : 'justify-center w-full'}`}>
                        <img
                            src={FilkomLogo}
                            alt="Filkom Logo"
                            className={`h-8 transition-all duration-200 ${isCollapsed ? 'hidden' : 'block'}`}
                        />
                        <div className={`font-bold ${isCollapsed ? 'text-xl' : 'text-2xl ml-2'}`}>
                            {isCollapsed ? '' : 'Dashboard'}
                        </div>
                    </div>
                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="hidden p-2 rounded-lg hover:bg-gray-100 md:block"
                    >
                        {isCollapsed ? <ChevronRight size={20} /> : <X size={20} />}
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 space-y-1">
                    <SidebarItem
                        href={route('dashboard')}
                        icon={<LayoutDashboard size={20} />}
                        label="Dashboard"
                        isActive={url === '/dashboard'}
                        isCollapsed={isCollapsed}
                    />

                    <SidebarDropdown
                        icon={<Layout size={20} />}
                        label="Projects"
                        isCollapsed={isCollapsed}
                    >
                        <SidebarItem
                            href=""
                            icon={<FileText size={18} />}
                            label="All Projects"
                            isActive=""
                            isCollapsed={isCollapsed}
                        />
                        <SidebarItem
                            href=""
                            icon={< Calendar size={18} />}
                            label="Project Calendar"
                            isActive=""
                            isCollapsed={isCollapsed}
                        />
                        <SidebarItem
                            href=""
                            icon={< Flag size={18} />}
                            label="Milestones"
                            isActive=""
                            isCollapsed={isCollapsed}
                        />
                    </SidebarDropdown>

                    <SidebarDropdown
                        icon={<CheckSquare size={20} />}
                        label="Tasks"
                        isCollapsed={isCollapsed}
                    >
                        <SidebarItem
                            href=""
                            icon={<FileText size={18} />}
                            label="All Tasks"
                            isActive=""
                            isCollapsed={isCollapsed}
                        />
                        <SidebarItem
                            href=""
                            icon={<Users size={18} />}
                            label="Assigned to Me"
                            isActive=""
                            isCollapsed={isCollapsed}
                        />
                        <SidebarItem
                            href=""
                            icon={<Calendar size={18} />}
                            label="Task Calendar"
                            isActive=""
                            isCollapsed={isCollapsed}
                        />
                    </SidebarDropdown>

                    <SidebarItem
                        href={route('mahasiswas.index')}
                        icon={<Users size={20} />}
                        label="Data Mahasiswa"
                        isActive={url === '/mahasiswas'}
                        isCollapsed={isCollapsed}
                    />

                    <SidebarItem
                        href=""
                        icon={<Settings size={20} />}
                        label="Settings"
                        isActive=""
                        isCollapsed={isCollapsed}
                    />
                </nav>

                {/* Footer */}
                <div className="mt-auto space-y-4">
                    <div className="space-y-1">
                        <SidebarItem
                            href=""
                            icon={<HelpCircle size={20} />}
                            label="Help & Information"
                            isActive=""
                            isCollapsed={isCollapsed}
                        />

                        <SidebarTooltip label="Log out" show={isCollapsed}>
                            <button className={`flex items-center w-full px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100
                ${isCollapsed ? 'justify-center' : ''}`}>
                                <LogOut size={20} />
                                <span className={`ml-2 transition-all duration-200 
                  ${isCollapsed ? 'hidden' : 'block'}`}>
                                    Log out
                                </span>
                            </button>
                        </SidebarTooltip>
                    </div>
                </div>
            </div>

            {/* Overlay for mobile */}
            {isMobileOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 md:hidden"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}
        </>
    );
};

export default AdminSidebar;