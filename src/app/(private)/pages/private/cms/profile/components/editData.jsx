import React, { useState, useRef, useEffect } from 'react';
import { GetSkills } from '@/app/api/skillApi';


export default function EditData({
    profile,
    onUpdateProfile,
    onCancel,
    isUpdating
}) {
    const [editFormData, setEditFormData] = useState({
        fullname: '',
        username: '',
        email: '',
        address: '',
        description: '',
        image: null,
        resume: null
    });

    const [allSkills, setAllSkills] = useState([]);
    const [selectedSkills, setSelectedSkills] = useState([]);
    const [skillsDropdownOpen, setSkillsDropdownOpen] = useState(false);
    const [skillsLoading, setSkillsLoading] = useState(false);

    const fileInputRef = useRef(null);
    const resumeInputRef = useRef(null);
    const skillsDropdownRef = useRef(null);

    useEffect(() => {
        if (profile) {
            setEditFormData({
                fullname: profile.fullname || '',
                username: profile.username || '',
                email: profile.email || '',
                address: profile.address || '',
                description: profile.description || '',
                image: null,
                resume: null
            });
            setSelectedSkills(profile.skills || []);
        }
    }, [profile]);

    useEffect(() => {
        async function fetchData() {
            setSkillsLoading(true);
            const data = await GetSkills();
            setAllSkills(data);
            setSkillsLoading(false);
        }
        fetchData();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (skillsDropdownRef.current && !skillsDropdownRef.current.contains(event.target)) {
                setSkillsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

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

    const handleResumeChange = (e) => {
        const file = e.target.files[0];
        setEditFormData(prev => ({
            ...prev,
            resume: file
        }));
    };

    const handleSkillToggle = (skill) => {
        setSelectedSkills(prev => {
            const exists = prev.find(s => s.id === skill.id);
            if (exists) {
                return prev.filter(s => s.id !== skill.id);
            } else {
                return [...prev, skill];
            }
        });
    };

    const removeSkill = (skillId) => {
        setSelectedSkills(prev => prev.filter(s => s.id !== skillId));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('fullname', editFormData.fullname);
        formData.append('username', editFormData.username);
        formData.append('address', editFormData.address);
        formData.append('description', editFormData.description);
        formData.append('email', editFormData.email);

        const skillIds = selectedSkills.map(skill => skill.id);
        formData.append('skillIds', JSON.stringify(skillIds));

        if (editFormData.image) {
            formData.append('image', editFormData.image);
        }

        if (editFormData.resume) {
            formData.append('resume', editFormData.resume);
        }

        try {
            await onUpdateProfile(formData);

            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
            if (resumeInputRef.current) {
                resumeInputRef.current.value = '';
            }
            setEditFormData(prev => ({
                ...prev,
                image: null,
                resume: null
            }));
        } catch (error) {
            console.error('Error in EditData component:', error);
        }
    };

    return (
        <div>
            <h3 className="text-lg font-semibold mb-4">Edit Profile Data</h3>

            <form onSubmit={handleSubmit}>
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
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your address"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Profile Image
                        </label>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 file:cursor-pointer"
                        />
                        <p className="text-xs text-gray-500 mt-1">Max file size: 10MB (JPG, PNG, GIF, WEBP)</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Resume
                        </label>
                        <input
                            ref={resumeInputRef}
                            type="file"
                            accept=".pdf,.doc,.docx"
                            onChange={handleResumeChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100 file:cursor-pointer"
                        />
                        <p className="text-xs text-gray-500 mt-1">Max file size: 10MB (PDF, DOC, DOCX)</p>
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Skills
                        </label>

                        <div className="mb-3">
                            {selectedSkills.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                    {selectedSkills.map((skill) => (
                                        <span
                                            key={skill.id}
                                            className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                                        >
                                            {skill.name}
                                            <button
                                                type="button"
                                                onClick={() => removeSkill(skill.id)}
                                                className="ml-1 text-blue-600 hover:text-blue-800 cursor-pointer"
                                            >
                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-400 text-sm">No skills selected</p>
                            )}
                        </div>

                        <div className="relative" ref={skillsDropdownRef}>
                            <button
                                type="button"
                                onClick={() => setSkillsDropdownOpen(!skillsDropdownOpen)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-left flex items-center justify-between cursor-pointer"
                            >
                                <span className="text-gray-700">
                                    {skillsLoading ? 'Loading skills...' : 'Add Skills'}
                                </span>
                                <svg
                                    className={`w-5 h-5 text-gray-400 transition-transform ${skillsDropdownOpen ? 'rotate-180' : ''}`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            {skillsDropdownOpen && (
                                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                                    {skillsLoading ? (
                                        <div className="px-3 py-2 text-gray-500">Loading...</div>
                                    ) : allSkills.length === 0 ? (
                                        <div className="px-3 py-2 text-gray-500">No skills available</div>
                                    ) : (
                                        allSkills
                                            .filter(skill => !selectedSkills.some(s => s.id === skill.id))
                                            .map((skill) => (
                                                <button
                                                    key={skill.id}
                                                    type="button"
                                                    onClick={() => handleSkillToggle(skill)}
                                                    className="w-full px-3 py-2 text-left hover:bg-gray-100 text-gray-700 cursor-pointer"
                                                >
                                                    <span>{skill.name}</span>
                                                </button>
                                            ))
                                    )}
                                </div>
                            )}
                        </div>
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
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Tell us about yourself"
                        />
                    </div>
                </div>

                <div className="flex gap-3 mt-5">
                    <button
                        type="submit"
                        disabled={isUpdating}
                        className="bg-black hover:bg-black/80 text-white px-6 py-2 rounded-md font-medium transition-colors disabled:bg-gray-400 cursor-pointer"
                    >
                        {isUpdating ? 'Updating...' : 'Update Profile'}
                    </button>
                    <button
                        type="button"
                        onClick={onCancel}
                        className="bg-white border border-gray-200 hover:bg-gray-100 text-black px-6 py-2 rounded-md font-medium transition-colors cursor-pointer"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}