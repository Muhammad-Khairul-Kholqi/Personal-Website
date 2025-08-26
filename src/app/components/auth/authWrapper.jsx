'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_API_LINK;

const AuthWrapper = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const token = localStorage.getItem('token');

                if (!token) {
                    await Swal.fire({
                        icon: 'warning',
                        title: 'Access Denied!',
                        text: 'You must login first to access this page.',
                    });
                    router.push('/pages/private/login');
                    return;
                }

                const response = await fetch(`${BASE_URL}/api/auth/verify`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (response.ok) {
                    setIsAuthenticated(true);
                } else {
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');

                    await Swal.fire({
                        icon: 'error',
                        title: 'Session Expired!',
                        text: 'Your session has expired. Please login again.',
                    });
                    router.push('/pages/private/login');
                }
            } catch (error) {
                console.error('Auth check error:', error);
                const token = localStorage.getItem('token');
                if (token) {
                    setIsAuthenticated(true);
                } else {
                    await Swal.fire({
                        icon: 'warning',
                        title: 'Access Denied!',
                        text: 'You must login first to access this page.',
                    });
                    router.push('/pages/private/login');
                }
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, [router]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return null;
    }

    return children;
};

export default AuthWrapper;
