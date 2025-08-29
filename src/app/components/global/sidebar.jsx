"use client";
import { useEffect, useState } from "react";
import Image from "next/image"
import LinkLists from "@/app/components/molecules/linkLists"
import SosmedSidebarLists from "@/app/components/molecules/sosmedSidebarLists"
import { BadgeCheck } from "lucide-react"
import { GetDataUser } from "@/app/api/authApi"
import LoadingSkeleton from "@/app/components/global/loadingSkeleton";

export default function Sidebar() {
    const [users, setUsers] = useState(null);
    const [loading, setLoading] = useState(true);
    const [forceLoading, setForceLoading] = useState(true);
    const showLoading = forceLoading || loading;

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            const data = await GetDataUser();
            setUsers(data);
            setLoading(false);
        }
        fetchData();
    }, []);

    return (
        <aside className="hidden lg:block w-full max-w-[25%] bg-white rounded-lg px-5 h-fit sticky top-5 max-h-[calc(100vh-20px)] overflow-auto scrollbar-hide">

            <div className="relative">
                <Image
                    src="https://drive.google.com/uc?export=view&id=1Fb8V5T46mVAlWwTAuFYvxZvHtD7HM2t4"
                    width={300}
                    height={100}
                    alt=""
                    className="w-full bg-cover h-[130px] rounded-lg"
                />

                <div className="absolute left-1/2 -translate-x-1/2 -bottom-12 w-24 h-24 rounded-full bg-white p-1 shadow-xl">
                    <img
                        src={users?.image}
                        width={96}
                        height={96}
                        className="rounded-full object-cover w-full h-full"
                    />
                </div>
            </div>

            <div className="mt-14">
                <div className="flex items-center gap-1 justify-center">
                    {showLoading ? (
                        <LoadingSkeleton width="170px" height="30px" />
                    ) : (
                        <h2 className="text-xl font-bold tracking-wide text-center">
                            {users?.fullname}
                        </h2>
                    )}
                    {!showLoading && (
                        <BadgeCheck className="h-5 w-5 mt-1 text-white" fill="#60A5FA" />
                    )}
                </div>
                <span className="text-center flex justify-center text-gray-600">
                    {showLoading ? (
                        <LoadingSkeleton width="100px" height="16px" className="mt-2" />
                    ) : (
                        `@${users?.username}`
                    )}
                </span>
                <SosmedSidebarLists />
                <LinkLists />
            </div>
        </aside>
    )
}