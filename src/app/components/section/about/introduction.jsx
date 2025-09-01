"use client";
import { useState, useEffect } from 'react';
import { GetDataUser } from "@/app/api/authApi"
import LoadingSkeleton from "@/app/components/global/loadingSkeleton";

export default function Introduction() {
    const [users, setUsers] = useState([]);
    const [loadingUser, setLoadingUser] = useState(true);

    useEffect(() => {
        async function fetchUser() {
            setLoadingUser(true);
            const data = await GetDataUser();
            setUsers(data);
            setLoadingUser(false);
        }
        fetchUser();
    }, []);
    return (
        <div>
            <div>
                <h1 className="text-2xl">About</h1>
                <p className="text-[#525252]">A short story about me</p>
            </div>

            {loadingUser ? (
                <div className="flex flex-col gap-2 mt-5">
                    <LoadingSkeleton width="100%" height="20px" />
                    <LoadingSkeleton width="100%" height="20px" />
                    <LoadingSkeleton width="90%" height="20px" />
                    <LoadingSkeleton width="90%" height="20px" />
                    <LoadingSkeleton width="80%" height="20px" />
                    <LoadingSkeleton width="80%" height="20px" />
                </div>
            ) : (
                <p className='text-gray-800 text-md text-justify tracking-wide mt-5'>{users?.long_description}</p>
            )}
        </div>
    )
}