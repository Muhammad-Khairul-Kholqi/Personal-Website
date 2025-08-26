'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import { VerifyToken } from '@/app/api/authApi';

const AuthWrapper = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('token');

            if (!token) {
                await Swal.fire({
                    icon: 'warning',
                    title: 'Access Denied!',
                    text: 'You must login first to access this page.',
                });
                router.push('/pages/private/login');
                setIsLoading(false);
                return;
            }

            const { ok } = await VerifyToken(token);

            if (ok) {
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

            setIsLoading(false);
        };

        checkAuth();
    }, [router]);

    if (isLoading) return (
        <div className="flex items-center justify-center h-screen">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
        </div>
    );

    if (!isAuthenticated) return null;

    return children;
};

export default AuthWrapper;
