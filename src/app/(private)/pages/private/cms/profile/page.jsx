'use client'

import { useState, useEffect } from 'react';
import { GetDataUser, UpdateUserProfile, UpdateUserPassword } from '@/app/api/authApi';
import Swal from 'sweetalert2';
import MyData from '@/app/(private)/pages/private/cms/profile/components/myData';
import EditData from '@/app/(private)/pages/private/cms/profile/components/editData';
import EditPassword from '@/app/(private)/pages/private/cms/profile/components/editPassword';

export default function ProfilePage() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('my-data');
    const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
    const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true);
                setError(null);
                const data = await GetDataUser();
                setProfile(data);
            } catch (err) {
                console.error('Error fetching user data:', err);
                setError(err.message || 'Failed to load user data');
                setProfile(null);

                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: err.message || 'Failed to load user data'
                });
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    useEffect(() => {
        const url = new URL(window.location);
        url.searchParams.set('tab', activeTab);
        window.history.replaceState({}, '', url);
    }, [activeTab]);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const tab = urlParams.get('tab');
        if (tab && ['my-data', 'edit-data', 'edit-password'].includes(tab)) {
            setActiveTab(tab);
        }
    }, []);

    const handleTabClick = (tabName) => {
        setActiveTab(tabName);
    };

    const handleUpdateProfile = async (formData) => {
        try {
            setIsUpdatingProfile(true);
            const updatedData = await UpdateUserProfile(formData);
            setProfile(updatedData);

            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Profile updated successfully!',
                timer: 2000,
                showConfirmButton: false
            });

            setActiveTab('my-data');
        } catch (err) {
            console.error('Error updating profile:', err);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: err.message || 'Failed to update profile'
            });
            throw err;
        } finally {
            setIsUpdatingProfile(false);
        }
    };

    const handleUpdatePassword = async (passwordData) => {
        try {
            setIsUpdatingPassword(true);
            await UpdateUserPassword(passwordData);

            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Password changed successfully!',
                timer: 2000,
                showConfirmButton: false
            });

            setActiveTab('my-data');
        } catch (err) {
            console.error('Error changing password:', err);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: err.message || 'Failed to change password'
            });
            throw err;
        } finally {
            setIsUpdatingPassword(false);
        }
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case 'my-data':
                return (
                    <MyData
                        profile={profile}
                        loading={loading}
                        error={error}
                    />
                );

            case 'edit-data':
                return (
                    <EditData
                        profile={profile}
                        onUpdateProfile={handleUpdateProfile}
                        onCancel={() => setActiveTab('my-data')}
                        isUpdating={isUpdatingProfile}
                    />
                );

            case 'edit-password':
                return (
                    <EditPassword
                        onUpdatePassword={handleUpdatePassword}
                        onCancel={() => setActiveTab('my-data')}
                        isUpdating={isUpdatingPassword}
                    />
                );

            default:
                return <div>Tab tidak ditemukan</div>;
        }
    };

    return (
        <div className="">
            <div className="flex flex-col sm:flex-col md:flex-row items-center gap-5 mb-6">
                <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden">
                    <img
                        src={profile?.image}
                        className="rounded-full object-cover w-full h-full"
                    />
                </div>
                <div className="text-center sm:text-center md:text-left mt-3 md:mt-0">
                    <h2 className="text-2xl font-bold tracking-wide">
                        {!loading && profile ? profile.fullname : 'Full Name'}
                    </h2>
                    <p className="text-gray-700">
                        @{!loading && profile ? profile.username : 'Username'}
                    </p>
                </div>
            </div>

            <div>
                <nav className="flex space-x-2">
                    <button
                        onClick={() => handleTabClick('my-data')}
                        className={`font-medium text-sm transition-colors duration-200 cursor-pointer ${activeTab === 'my-data'
                            ? 'text-black border border-gray-200 font-medium rounded-md px-4 py-2'
                            : 'hover:bg-gray-100 text-black rounded-md px-4 py-2'
                            }`}
                    >
                        My Data
                    </button>
                    <button
                        onClick={() => handleTabClick('edit-data')}
                        className={`font-medium text-sm transition-colors duration-200 cursor-pointer ${activeTab === 'edit-data'
                            ? 'text-black border border-gray-200 font-medium rounded-md px-4 py-2'
                            : 'hover:bg-gray-100 text-black rounded-md px-4 py-2'
                            }`}
                    >
                        Edit Data
                    </button>
                    <button
                        onClick={() => handleTabClick('edit-password')}
                        className={`font-medium text-sm transition-colors duration-200 cursor-pointer ${activeTab === 'edit-password'
                            ? 'text-black border border-gray-200 font-medium rounded-md px-4 py-2'
                            : 'hover:bg-gray-100 text-black rounded-md px-4 py-2'
                            }`}
                    >
                        Edit Password
                    </button>
                </nav>
            </div>

            <div className="mt-5">
                {renderTabContent()}
            </div>
        </div>
    );
}