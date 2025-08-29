"use client";
import { useState, useEffect } from 'react';
import { Download } from 'lucide-react';
import { GetDataUser } from "@/app/api/authApi"
import LoadingSkeleton from "@/app/components/global/loadingSkeleton";

export default function Introduction() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentRoleIndex, setCurrentRoleIndex] = useState(0);
    const [isVisible, setIsVisible] = useState(true);
    const showLoading = loading;

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            const data = await GetDataUser();
            setUsers(data);
            setLoading(false);
        }
        fetchData();
    }, []);
    
    const roles = [
        'Fullstack Developer',
        'UI / UX Designer',
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setIsVisible(false);

            setTimeout(() => {
                setCurrentRoleIndex((prevIndex) =>
                    prevIndex === roles.length - 1 ? 0 : prevIndex + 1
                );
                setIsVisible(true);
            }, 300);
        }, 2500);

        return () => clearInterval(interval);
    }, [roles.length]);

    return (
        <div>
            <div className="flex gap-[5px] items-center mb-4">
                <h1 className="text-3xl font-sora">
                    {showLoading ? (
                        <LoadingSkeleton width="300px" height="30px" />
                    ) : (
                        <h3>Hi, I'm {users?.fullname}</h3>
                    )}
                </h1>
                <h1 className="shake-animation text-3xl">👋</h1>
            </div>

            <div className="mb-4 flex flex-wrap items-center gap-5">
                <div className="flex items-center gap-2">
                    <div className="p-0.5 bg-black rounded-full" />
                    {showLoading ? (
                         <LoadingSkeleton width="170px" height="24px" />
                    ) : (
                        <h3>{users?.address}</h3>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    <div className="p-0.5 bg-black rounded-full" />
                    <h3
                        className={`transition-all duration-300 ease-in-out ${isVisible
                            ? 'opacity-100 transform translate-y-0'
                            : 'opacity-0 transform -translate-y-2'
                            }`}
                    >
                        {roles[currentRoleIndex]}
                    </h3>
                </div>
            </div>

            <div className="leading-relaxed tracking-wide text-justify mb-5">
                <div className="leading-relaxed tracking-wide text-justify mb-5">
                    {showLoading ? (
                        <div className="flex flex-col gap-2 mb-5">
                            <LoadingSkeleton width="100%" height="20px" />
                            <LoadingSkeleton width="90%" height="20px" />
                            <LoadingSkeleton width="80%" height="20px" />
                        </div>
                    ) : (
                        <p>{users?.description}</p>
                    )}
                </div>
            </div>

            <div className="flex items-center gap-5">
                <a href="https://drive.google.com/uc?export=view&id=19omqGDfS5JJOuaDmn329nkZHFo4Ww6vg" download className='flex items-center gap-2'>
                    <Download className="w-5 h-5 -mt-1 animate-bounce" />
                    <span className="text-sm text-center">Download Resume</span>
                </a>

                <div className='flex items-center gap-2 px-5 py-2 border border-gray-200 rounded-full cursor-default'>
                    <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                    </span>
                    <span className="text-sm text-center">Hire Me</span>
                </div>
            </div>
        </div>
    )
}