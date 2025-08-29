'use client'

import {
    Menu,
    User
} from "lucide-react"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"

export default function HeaderCms({ onToggleSidebar }) {
    const pathname = usePathname()
    const [user, setUser] = useState(null)
    const [showNotifications, setShowNotifications] = useState(false)
    const [showUserMenu, setShowUserMenu] = useState(false)

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const userData = localStorage.getItem('user')
            if (userData) {
                setUser(JSON.parse(userData))
            }
        }
    }, [])

    const getPageTitle = () => {
        const segments = pathname.split('/').filter(Boolean)
        if (segments.length === 0) return 'Dashboard'

        const lastSegment = segments[segments.length - 1]
        return lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1).replace('-', ' ')
    }

    return (
        <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6">
            <div className="flex items-center space-x-4">
                <button
                    onClick={onToggleSidebar}
                    className="lg:hidden p-2 rounded-md hover:bg-gray-100 transition-colors"
                >
                    <Menu size={20} />
                </button>

                <div>
                    <h1 className="text-lg font-semibold text-gray-900">
                        {getPageTitle()}
                    </h1>
                </div>
            </div>

            <Link href="pages/private/cms/profile" className="bg-gray-200 w-10 h-10 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-300 transition-colors">
                <User size={22} />
            </Link>

            {(showNotifications || showUserMenu) && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => {
                        setShowNotifications(false)
                        setShowUserMenu(false)
                    }}
                />
            )}
        </header>
    )
}