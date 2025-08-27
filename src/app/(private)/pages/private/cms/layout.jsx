'use client'

import HeaderCms from "@/app/components/global/headerCms"
import SidebarCms from "@/app/components/global/sidebarCms"
import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import Swal from "sweetalert2"

export default function CmsLayout({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const router = useRouter()
    const pathname = usePathname()

    useEffect(() => {
        checkAuth()
    }, [pathname])

    const checkAuth = async () => {
        try {
            const token = localStorage.getItem('token')

            if (!token) {
                handleUnauthenticated()
                return
            }

            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_LINK}/api/auth/verify`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            })

            if (response.ok) {
                setIsAuthenticated(true)
                setIsLoading(false)
            } else {
                localStorage.removeItem('token')
                localStorage.removeItem('user')
                handleUnauthenticated()
            }
        } catch (error) {
            console.error('Auth check error:', error)
            handleUnauthenticated()
        }
    }

    const handleUnauthenticated = async () => {
        setIsAuthenticated(false)
        setIsLoading(false)

        await Swal.fire({
            icon: 'warning',
            title: 'Access Denied!',
            text: 'You must login first to access this page.',
            confirmButtonColor: '#000000',
            confirmButtonText: 'OK'
        })

        router.push('/pages/private/login')
    }

    const handleLogout = async () => {
        const result = await Swal.fire({
            icon: 'question',
            title: 'Logout Confirmation',
            text: 'Are you sure you want to logout?',
            showCancelButton: true,
            confirmButtonColor: '#000000',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Yes, Logout',
            cancelButtonText: 'Cancel'
        })

        if (result.isConfirmed) {
            localStorage.removeItem('token')
            localStorage.removeItem('user')

            await Swal.fire({
                icon: 'success',
                title: 'Logout Successful!',
                text: 'You have successfully logged out.',
                confirmButtonColor: '#000000',
                timer: 2000,
                showConfirmButton: false
            })

            router.push('/pages/private/login')
        }
    }

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen)
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="flex flex-col items-center space-y-4">
                    <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
                </div>
            </div>
        )
    }

    if (!isAuthenticated) {
        return null
    }

    return (
        <div className="flex h-screen">
            <SidebarCms
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                onLogout={handleLogout}
            />

            <div className="flex-1 flex flex-col min-w-0">
                <HeaderCms onToggleSidebar={toggleSidebar} />

                <main className="flex-1 overflow-auto">
                    <div className="p-6">
                        <div className="mx-auto">
                            {children}
                        </div>
                    </div>
                </main>
            </div>

            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/30 z-40 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}
        </div>
    )
}