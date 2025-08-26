'use client'

import {
    Home,
    Users,
    FileText,
    Settings,
    LogOut,
    X,
    ChevronRight,
    Contact,
    SquarePen,
    GraduationCap,
    Clapperboard
} from "lucide-react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { useState } from "react"

export default function SidebarCms({ isOpen, onClose, onLogout }) {
    const pathname = usePathname()
    const [user, setUser] = useState(() => {
        if (typeof window !== 'undefined') {
            const userData = localStorage.getItem('user')
            return userData ? JSON.parse(userData) : null
        }
        return null
    })

    const menuItems = [
        {
            icon: Home,
            label: "Dashboard",
            href: "/pages/private/cms/dashboard",
        },
        {
            icon: Contact,
            label: "Contact",
            href: "/cms/users",
        },
        {
            icon: SquarePen,
            label: "Portfolio",
            submenu: [
                { label: "Careers", href: "/cms/content/pages" },
                { label: "Services", href: "/pages/private/cms/services" },
                { label: "Soft Skills", href: "/cms/content/pages" },
            ]
        },
        {
            icon: GraduationCap,
            label: "Education",
            submenu: [
                { label: "Educations", href: "/cms/content/pages" },
                { label: "Certificates", href: "/cms/content/pages" },
                { label: "Technologies", href: "/cms/content/articles" },
            ]
        },
        {
            icon: Clapperboard,
            label: "Content",
            submenu: [
                { label: "Blogs", href: "/cms/content/pages" },
                { label: "Projects", href: "/cms/content/pages" },
            ]
        },
    ]

    const [expandedItems, setExpandedItems] = useState({})

    const toggleExpanded = (index) => {
        setExpandedItems(prev => ({
            ...prev,
            [index]: !prev[index]
        }))
    }

    const isActive = (href) => {
        return pathname === href || pathname.startsWith(href + '/')
    }

    return (
        <>
            <div className={`
                fixed lg:static inset-y-0 left-0 z-50
                w-64 bg-white border-r border-gray-200
                transform transition-transform duration-300 ease-in-out
                ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                            {user?.fullname || 'User'}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                            {user?.email || 'user@example.com'}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="lg:hidden p-1 rounded-md hover:bg-gray-100"
                    >
                        <X size={20} />
                    </button>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    {menuItems.map((item, index) => {
                        const Icon = item.icon
                        const hasSubmenu = item.submenu && item.submenu.length > 0
                        const isExpanded = expandedItems[index]
                        const isItemActive = isActive(item.href)

                        return (
                            <div key={index}>
                                {hasSubmenu ? (
                                    <button
                                        onClick={() => toggleExpanded(index)}
                                        className={`
                                            w-full flex items-center justify-between px-3 py-3 text-sm font-medium rounded-lg
                                            transition-colors duration-200 cursor-pointer
                                            ${isItemActive
                                                ? 'bg-black text-white'
                                                : 'text-gray-700 hover:bg-gray-100'
                                            }
                                        `}
                                    >
                                        <div className="flex items-center space-x-3">
                                            <Icon size={20} />
                                            <span>{item.label}</span>
                                        </div>
                                        <ChevronRight
                                            size={16}
                                            className={`transform transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                                        />
                                    </button>
                                ) : (
                                    <Link
                                        href={item.href}
                                        onClick={() => onClose()}
                                        className={`
                                            flex items-center space-x-3 p-3 text-sm font-medium rounded-lg
                                            transition-colors duration-200
                                            ${isItemActive
                                                ? 'bg-black text-white'
                                                : 'text-gray-700 hover:bg-gray-100'
                                            }
                                        `}
                                    >
                                        <Icon size={20} />
                                        <span>{item.label}</span>
                                    </Link>
                                )}

                                {hasSubmenu && isExpanded && (
                                    <div className="ml-6 mt-1 space-y-1">
                                        {item.submenu.map((subItem, subIndex) => (
                                            <Link
                                                key={subIndex}
                                                href={subItem.href}
                                                onClick={() => onClose()}
                                                className={`
                                                    block px-3 py-2 text-sm rounded-lg
                                                    transition-colors duration-200
                                                    ${isActive(subItem.href)
                                                        ? 'bg-gray-200 text-gray-900 font-medium'
                                                        : 'text-gray-600 hover:bg-gray-100'
                                                    }
                                                `}
                                            >
                                                {subItem.label}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </nav>

                <div className="p-4 border-t border-gray-200">
                    <button
                        onClick={onLogout}
                        className="w-full flex items-center space-x-3 p-3 cursor-pointer text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors duration-200"
                    >
                        <LogOut size={20} />
                        <span>Logout</span>
                    </button>
                </div>
            </div>
        </>
    )
}