import React, { useState } from 'react';
import Swal from 'sweetalert2';

export default function EditPassword({ onUpdatePassword, onCancel, isUpdating }) {
    const [passwordFormData, setPasswordFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const handlePasswordFormChange = (e) => {
        const { name, value } = e.target;
        setPasswordFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
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
            await onUpdatePassword({
                currentPassword: passwordFormData.currentPassword,
                newPassword: passwordFormData.newPassword
            });

            setPasswordFormData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
        } catch (error) {
            console.error('Error in EditPassword component:', error);
        }
    };

    const handleCancel = () => {
        setPasswordFormData({
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
        });
        onCancel();
    };

    return (
        <div>
            <h3 className="text-lg font-semibold mb-4">Change Password</h3>

            <form onSubmit={handleSubmit}>
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
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Confirm your new password"
                            required
                        />
                    </div>

                    {passwordFormData.newPassword && passwordFormData.confirmPassword && passwordFormData.newPassword !== passwordFormData.confirmPassword && (
                        <p className="text-red-600 text-sm md:col-span-2">Passwords do not match</p>
                    )}
                </div>

                <div className="flex gap-3 mt-4">
                    <button
                        type="submit"
                        disabled={isUpdating || passwordFormData.newPassword !== passwordFormData.confirmPassword}
                        className="bg-black hover:bg-black/80 text-white px-6 py-2 rounded-md font-medium transition-colors disabled:bg-gray-400 cursor-pointer"
                    >
                        {isUpdating ? 'Changing...' : 'Change Password'}
                    </button>
                    <button
                        type="button"
                        onClick={handleCancel}
                        className="bg-white border border-gray-200 hover:bg-gray-100 text-black px-6 py-2 rounded-md font-medium transition-colors cursor-pointer"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}