import React from 'react';

export default function MyData({ profile, loading, error }) {
    if (loading) {
        return (
            <div className="flex justify-center items-center py-8">
                <div className="text-gray-600">Loading...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="text-center py-8 text-gray-600">
                No profile data available
            </div>
        );
    }

    return (
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

                <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <label className="text-sm text-gray-600">Resume:</label>
                    {profile.resume ? (
                        <a
                            href={profile.resume}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline font-medium"
                        >
                            <p>View Resume</p>
                        </a>
                    ) : (
                        <p className="text-gray-400 text-sm">No resume uploaded</p>
                    )}
                </div>

                <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <label className="text-sm text-gray-600">Skills:</label>
                    <div className="mt-2">
                        {profile.skills && profile.skills.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                                {profile.skills.map((skill) => (
                                    <span
                                        key={skill.id}
                                        className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                                    >
                                        {skill.name}
                                    </span>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-400 text-sm">No skills added</p>
                        )}
                    </div>
                </div>

                <div className="bg-white p-4 rounded-lg border border-gray-200 md:col-span-2">
                    <label className="text-sm text-gray-600">Short Description:</label>
                    <p className="font-medium mt-1">
                        {profile.short_description || 'No short description available'}
                    </p>
                </div>

                <div className="bg-white p-4 rounded-lg border border-gray-200 md:col-span-2">
                    <label className="text-sm text-gray-600">Long Description:</label>
                    <p className="font-medium mt-1">
                        {profile.long_description || 'No long description available'}
                    </p>
                </div>
            </div>
        </div>
    );
}