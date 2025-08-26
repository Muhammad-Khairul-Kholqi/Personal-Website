'use client'

import {
    Menu,
} from "lucide-react"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"

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
                    <h1 className="text-xl font-semibold text-gray-900">
                        {getPageTitle()}
                    </h1>
                </div>
            </div>

            fsf

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