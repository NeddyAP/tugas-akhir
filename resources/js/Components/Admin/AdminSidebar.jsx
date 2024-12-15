import React, {
    useState,
    useCallback,
    memo,
    useMemo,
    useRef,
    useEffect,
} from "react";
import { Link, usePage } from "@inertiajs/react";
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
    UserPen,
    Home,
    User,
} from "lucide-react";
import filkomLogo from "@images/filkomlogo.png";

const NAVIGATION_ITEMS = [
    {
        type: "item",
        icon: <LayoutDashboard />,
        label: "Dashboard",
        href: route("admin.dashboard.index"),
    },
    {
        type: "dropdown",
        icon: <LucideTable2 />,
        label: "Tabel",
        children: [
            {
                icon: <FileText />,
                label: "Logbook",
                href: route("admin.logbooks.index"),
            },
            {
                icon: <TargetIcon />,
                label: "Bimbingan",
                href: route("admin.bimbingans.index"),
            },
            {
                icon: <File />,
                label: "Laporan",
                href: route("admin.laporans.index"),
            },
        ],
    },
    {
        type: "dropdown",
        icon: <User />,
        label: "Data",
        children: [
            {
                icon: <Users />,
                label: "Semua Data",
                href: route("admin.users.index", { tab: "all" }),
            },
            {
                icon: <GraduationCap />,
                label: "Mahasiswa",
                href: route("admin.users.index", { tab: "mahasiswa" }),
            },
            {
                icon: <UserPen />,
                label: "Dosen",
                href: route("admin.users.index", { tab: "dosen" }),
            },
            {
                icon: <UserCog />,
                label: "Admin",
                href: route("admin.users.index", { tab: "admin" }),
            },
        ],
    },
    {
        type: "item",
        icon: <Settings />,
        label: "Settings",
        href: route("admin.settings.create"),
    },
];

const SidebarTooltip = memo(({ children, label, show }) =>
    show ? (
        <div className="relative group">
            {children}
            <div className="absolute hidden ml-2 transform -translate-y-1/2 left-full top-1/2 group-hover:block">
                <span className="px-2 py-1 text-sm text-white bg-gray-800 rounded">
                    {label}
                </span>
            </div>
        </div>
    ) : (
        children
    ),
);

const isUrlMatch = (href, currentUrl, currentTab) => {
    if (!href) return false;
    const targetUrl = new URL(href, window.location.origin);
    return (
        currentUrl === targetUrl.pathname &&
        (!targetUrl.searchParams.get("tab") ||
            currentTab === targetUrl.searchParams.get("tab"))
    );
};

const SidebarItem = memo(({ icon, label, href, isCollapsed }) => {
    const { url } = usePage();
    const isActive = isUrlMatch(
        href,
        url.split("?")[0],
        new URLSearchParams(window.location.search).get("tab"),
    );

    return (
        <SidebarTooltip label={label} show={isCollapsed}>
            <Link
                href={href}
                className={`flex items-center rounded-lg px-4 py-2 transition-colors duration-200
                    ${
                        isActive
                            ? "bg-teal-50 dark:bg-teal-950 text-teal-600 dark:text-teal-300"
                            : "text-gray-700 dark:text-gray-300 hover:bg-teal-100 dark:hover:bg-teal-950"
                    }
                    ${isCollapsed ? "justify-center" : ""}`}
            >
                {React.cloneElement(icon, {
                    className: `w-5 h-5 ${
                        isActive
                            ? "text-teal-600 dark:text-teal-300"
                            : "text-gray-700 dark:text-gray-300"
                    }`,
                })}
                {!isCollapsed && <span className="ml-2">{label}</span>}
            </Link>
        </SidebarTooltip>
    );
});

const SidebarDropdown = memo(({ icon, label, children, isCollapsed }) => {
    const { url } = usePage();
    const urlWithoutParams = url.split("?")[0];
    const urlParams = new URLSearchParams(window.location.search);
    const currentTab = urlParams.get("tab");

    const isActive = React.Children.toArray(children).some((child) =>
        isUrlMatch(child.props.href, urlWithoutParams, currentTab),
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
            if (
                popoverRef.current &&
                !popoverRef.current.contains(event.target)
            ) {
                setIsPopoverOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, [isPopoverOpen]);

    const handleClick = useCallback(() => {
        if (isCollapsed) {
            setIsPopoverOpen((prev) => !prev);
        } else {
            setIsOpen((prev) => !prev);
        }
    }, [isCollapsed]);

    const buttonClasses = `
        flex w-full items-center rounded-lg px-4 py-2 transition-colors duration-200 focus:outline-none
        ${
            isActive
                ? "bg-teal-50 dark:bg-teal-950 text-teal-600 dark:text-teal-300"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
        }
        ${isCollapsed ? "justify-center" : "justify-between"}
    `;

    return (
        <div className="relative">
            <SidebarTooltip label={label} show={isCollapsed}>
                <button onClick={handleClick} className={buttonClasses}>
                    <div className="flex items-center">
                        {React.cloneElement(icon, {
                            className: `w-5 h-5 ${
                                isActive
                                    ? "text-teal-600 dark:text-teal-300"
                                    : "text-gray-700 dark:text-gray-300"
                            }`,
                        })}
                        {!isCollapsed && <span className="ml-2">{label}</span>}
                    </div>
                    {!isCollapsed && (
                        <ChevronDown
                            size={16}
                            className={`transform transition-transform ${
                                isOpen ? "rotate-180" : ""
                            }`}
                        />
                    )}
                </button>
            </SidebarTooltip>

            {isOpen && !isCollapsed && (
                <div className="pl-4 mt-1 space-y-1">{children}</div>
            )}

            {isPopoverOpen && isCollapsed && (
                <div
                    ref={popoverRef}
                    className="absolute z-50 mt-2 ml-2 bg-white border border-gray-200 rounded-lg shadow-lg dark:bg-gray-900 dark:border-gray-700 left-full"
                >
                    <div className="p-2 space-y-1">{children}</div>
                </div>
            )}
        </div>
    );
});

const AdminSidebar = memo(
    ({ onCollapse = () => {}, isMobileMenuOpen, onMobileMenuToggle }) => {
        const [isCollapsed, setIsCollapsed] = useState(false);

        const toggleCollapsed = useCallback(() => {
            setIsCollapsed((prev) => {
                const newState = !prev;
                onCollapse(newState);
                return newState;
            });
        }, [onCollapse]);

        const sidebarClass = useMemo(
            () => `
        ${isCollapsed ? "md:w-20" : "md:w-64"}
        fixed top-0 left-0 
        flex flex-col bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 p-4
        transition-all duration-300 ease-in-out z-50 h-screen
        w-[280px] transform ${
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }
        md:translate-x-0
    `,
            [isCollapsed, isMobileMenuOpen],
        );

        return (
            <>
                <div className={sidebarClass}>
                    <div className="flex items-center justify-between mb-8">
                        <div
                            className={`flex items-center ${
                                isCollapsed ? "md:w-full md:justify-center" : ""
                            }`}
                        >
                            <img
                                src={filkomLogo}
                                alt="Filkom Logo"
                                className={`h-8 w-8 transition-all duration-200 ${
                                    isCollapsed ? "md:hidden" : ""
                                }`}
                            />
                            {!isCollapsed && (
                                <div className="ml-2 text-xl font-bold text-gray-900 dark:text-white">
                                    Dashboard
                                </div>
                            )}
                        </div>
                        <button
                            onClick={toggleCollapsed}
                            className="hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 md:block focus:outline-none"
                        >
                            {isCollapsed ? (
                                <ChevronRight
                                    size={20}
                                    className="dark:text-white"
                                />
                            ) : (
                                <X size={20} className="dark:text-white" />
                            )}
                        </button>
                        <button
                            onClick={onMobileMenuToggle}
                            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 md:hidden focus:outline-none"
                        >
                            <X size={20} className="dark:text-white" />
                        </button>
                    </div>

                    <div className="flex flex-col flex-1">
                        <nav className="flex-1 space-y-1">
                            {NAVIGATION_ITEMS.map((item, index) =>
                                item.type === "dropdown" ? (
                                    <SidebarDropdown
                                        key={index}
                                        icon={item.icon}
                                        label={item.label}
                                        isCollapsed={isCollapsed}
                                    >
                                        {item.children.map(
                                            (child, childIndex) => (
                                                <SidebarItem
                                                    key={childIndex}
                                                    {...child}
                                                    isCollapsed={isCollapsed}
                                                />
                                            ),
                                        )}
                                    </SidebarDropdown>
                                ) : (
                                    <SidebarItem
                                        key={index}
                                        {...item}
                                        isCollapsed={isCollapsed}
                                    />
                                ),
                            )}
                        </nav>

                        <div className="mt-auto space-y-4">
                            <div className="flex-1 space-y-1">
                                <SidebarItem
                                    href={route("home")}
                                    icon={<Home />}
                                    label="Home"
                                    isCollapsed={isCollapsed}
                                />
                                <SidebarItem
                                    href={route("admin.informations.index")}
                                    icon={<HelpCircle />}
                                    label="Help & Information"
                                    isCollapsed={isCollapsed}
                                />
                                <SidebarTooltip
                                    label="Log out"
                                    show={isCollapsed}
                                >
                                    <Link
                                        method="post"
                                        href={route("logout")}
                                        as="button"
                                        className={`flex w-full items-center rounded-lg px-4 py-2 text-red-700 dark:text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 ${
                                            isCollapsed ? "justify-center" : ""
                                        }`}
                                    >
                                        <LogOut className="w-5 h-5" />
                                        {!isCollapsed && (
                                            <span className="ml-2">Logout</span>
                                        )}
                                    </Link>
                                </SidebarTooltip>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Overlay for mobile */}
                {isMobileMenuOpen && (
                    <div
                        className="fixed inset-0 z-40 bg-black/50 md:hidden"
                        onClick={onMobileMenuToggle}
                    />
                )}
            </>
        );
    },
);

AdminSidebar.displayName = "AdminSidebar";
export default AdminSidebar;
