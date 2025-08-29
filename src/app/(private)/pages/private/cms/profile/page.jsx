'use client'

import { useState, useEffect, useRef } from 'react';
import { GetDataUser, UpdateUserProfile, UpdateUserPassword } from '@/app/api/authApi';
import Swal from 'sweetalert2';

export default function ProfilePage() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('my-data');

    const [editFormData, setEditFormData] = useState({
        fullname: '',
        username: '',
        email: '',
        address: '',
        description: '',
        image: null
    });
    const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

    const [passwordFormData, setPasswordFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

    const fileInputRef = useRef(null);

    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true);
                setError(null);
                const data = await GetDataUser();

                setProfile(data);

                setEditFormData({
                    fullname: data.fullname || '',
                    username: data.username || '',
                    email: data.email || '',
                    address: data.address || '',
                    description: data.description || '',
                    image: null
                });

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

    const handleEditFormChange = (e) => {
        const { name, value } = e.target;
        setEditFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setEditFormData(prev => ({
            ...prev,
            image: file
        }));
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();

        try {
            setIsUpdatingProfile(true);

            const formData = new FormData();
            formData.append('fullname', editFormData.fullname);
            formData.append('username', editFormData.username);
            formData.append('address', editFormData.address);
            formData.append('description', editFormData.description);
            formData.append('email', editFormData.email);

            if (editFormData.image) {
                formData.append('image', editFormData.image);
            }

            const updatedData = await UpdateUserProfile(formData);

            setProfile(updatedData);

            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
            setEditFormData(prev => ({
                ...prev,
                image: null
            }));

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
        } finally {
            setIsUpdatingProfile(false);
        }
    };

    const handlePasswordFormChange = (e) => {
        const { name, value } = e.target;
        setPasswordFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleUpdatePassword = async (e) => {
        e.preventDefault();

        if (!passwordFormData.currentPassword) {
            Swal.fire({
                icon: 'warning',
                title: 'Warning',
                text: 'Current password is required'
            });
            return;
        }

        if (!passwordFormData.newPassword) {
            Swal.fire({
                icon: 'warning',
                title: 'Warning',
                text: 'New password is required'
            });
            return;
        }

        if (passwordFormData.newPassword.length < 6) {
            Swal.fire({
                icon: 'warning',
                title: 'Warning',
                text: 'New password must be at least 6 characters long'
            });
            return;
        }

        if (passwordFormData.newPassword !== passwordFormData.confirmPassword) {
            Swal.fire({
                icon: 'warning',
                title: 'Warning',
                text: 'New password and confirmation password do not match'
            });
            return;
        }

        try {
            setIsUpdatingPassword(true);

            await UpdateUserPassword({
                currentPassword: passwordFormData.currentPassword,
                newPassword: passwordFormData.newPassword
            });

            setPasswordFormData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });

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
        } finally {
            setIsUpdatingPassword(false);
        }
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case 'my-data':
                return (
                    <>
                        {loading && (
                            <div className="flex justify-center items-center py-8">
                                <div className="text-gray-600">Loading...</div>
                            </div>
                        )}

                        {error && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                                {error}
                            </div>
                        )}

                        {!loading && !error && !profile && (
                            <div className="text-center py-8 text-gray-600">
                                No profile data available
                            </div>
                        )}

                        {!loading && !error && profile && (
                            <div>
                                <h3 className="text-lg font-semibold mb-4">Personal Data</h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                                        <label className="text-sm text-gray-600">Full Name:</label>
                                        <p className="font-medium">{profile.fullname || 'N/A'}</p>
                                    </div>

                                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                                        <label className="text-sm text-gray-600">Username:</label>
                                        <p className="font-medium">@{profile.username || 'N/A'}</p>
                                    </div>

                                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                                        <label className="text-sm text-gray-600">Email:</label>
                                        <p className="font-medium">{profile.email || 'N/A'}</p>
                                    </div>

                                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                                        <label className="text-sm text-gray-600">Address:</label>
                                        <p className="font-medium">{profile.address || 'N/A'}</p>
                                    </div>
                                </div>

                                <div className="bg-white p-4 rounded-lg border border-gray-200 mt-4">
                                    <label className="text-sm text-gray-600">Description</label>
                                    <p className="font-medium">
                                        {profile.description || 'No description available'}
                                    </p>
                                </div>
                            </div>
                        )}
                    </>
                );

            case 'edit-data':
                return (
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Edit Profile Data</h3>

                        <form onSubmit={handleUpdateProfile}>
                            <div className="grid lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1 items-start gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        name="fullname"
                                        value={editFormData.fullname}
                                        onChange={handleEditFormChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
                                        placeholder="Enter your full name"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Username
                                    </label>
                                    <input
                                        type="text"
                                        name="username"
                                        value={editFormData.username}
                                        onChange={handleEditFormChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
                                        placeholder="Enter your username"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={editFormData.email}
                                        onChange={handleEditFormChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
                                        placeholder="Enter your email"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Address
                                    </label>
                                    <input
                                        type="text"
                                        name="address"
                                        value={editFormData.address}
                                        onChange={handleEditFormChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
                                        placeholder="Enter your address"
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Profile Image
                                    </label>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none cursor-pointer"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Max file size: 5MB</p>
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Description
                                    </label>
                                    <textarea
                                        name="description"
                                        value={editFormData.description}
                                        onChange={handleEditFormChange}
                                        rows="4"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
                                        placeholder="Tell us about yourself"
                                    />
                                </div>
                            </div>
                            
                            <div className="flex gap-3 mt-5">
                                <button
                                    type="submit"
                                    disabled={isUpdatingProfile}
                                    className="bg-black hover:bg-black/80 text-white px-6 py-2 rounded-md font-medium transition-colors disabled:bg-gray-400 cursor-pointer"
                                >
                                    {isUpdatingProfile ? 'Updating...' : 'Update Profile'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setActiveTab('my-data')}
                                    className="bg-white border border-gray-200 hover:bg-gray-100 text-black px-6 py-2 rounded-md font-medium transition-colors cursor-pointer"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                );

            case 'edit-password':
                return (
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Change Password</h3>

                        <form onSubmit={handleUpdatePassword}>

                            <div className="grid lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1 items-start gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Current Password
                                    </label>
                                    <input
                                        type="password"
                                        name="currentPassword"
                                        value={passwordFormData.currentPassword}
                                        onChange={handlePasswordFormChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
                                        placeholder="Enter your current password"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        New Password
                                    </label>
                                    <input
                                        type="password"
                                        name="newPassword"
                                        value={passwordFormData.newPassword}
                                        onChange={handlePasswordFormChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
                                        placeholder="Enter new password (min 6 characters)"
                                        required
                                        minLength="6"
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Confirm New Password
                                    </label>
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        value={passwordFormData.confirmPassword}
                                        onChange={handlePasswordFormChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
                                        placeholder="Confirm your new password"
                                        required
                                    />
                                </div>

                                {passwordFormData.newPassword && passwordFormData.confirmPassword && passwordFormData.newPassword !== passwordFormData.confirmPassword && (
                                    <p className="text-red-600 text-sm">Passwords do not match</p>
                                )}
                            </div>
                            

                            <div className="flex gap-3 mt-4">
                                <button
                                    type="submit"
                                    disabled={isUpdatingPassword || passwordFormData.newPassword !== passwordFormData.confirmPassword}
                                    className="bg-black hover:bg-black/80 text-white px-6 py-2 rounded-md font-medium transition-colors disabled:bg-gray-400 cursor-pointer"
                                >
                                    {isUpdatingPassword ? 'Changing...' : 'Change Password'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setPasswordFormData({
                                            currentPassword: '',
                                            newPassword: '',
                                            confirmPassword: ''
                                        });
                                        setActiveTab('my-data');
                                    }}
                                    className="bg-white border border-gray-200 hover:bg-gray-100 text-black px-6 py-2 rounded-md font-medium transition-colors cursor-pointer"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
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
                        alt="Profile"
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