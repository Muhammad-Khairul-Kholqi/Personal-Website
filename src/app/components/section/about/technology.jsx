"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import LoadingSkeleton from "@/app/components/global/loadingSkeleton";
import { GetTechnologies } from "@/app/api/technologyApi";

export default function Technology() {
    const [technologies, setTechnologies] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchTechnologies() {
            setLoading(true);
            try {
                const data = await GetTechnologies();
                setTechnologies(data);
            } catch (error) {
                console.error("Error fetching technologies:", error);
            }
            setLoading(false);
        }
        fetchTechnologies();
    }, []);

    return (
        <div>
            <h1 className="text-2xl">Technology</h1>
            <p className="text-[#525252] text-sm">My coding skills</p>

            {loading ? (
                <div className="space-y-5 mt-5">
                    <LoadingSkeleton width="100%" height="60px" />
                    <LoadingSkeleton width="100%" height="60px" />
                </div>
            ) : (
                <>
                    <div className="overflow-hidden bg-white mt-5">
                        <div className="w-full max-w-[1200px] mx-auto">
                            <div className="whitespace-nowrap animate-slide-left flex items-center w-max gap-5">
                                {[...technologies, ...technologies].map((tech, i) => (
                                    <div
                                        key={`top-${i}`}
                                        className="flex items-center gap-2 border border-gray-200 px-5 py-3 rounded-full"
                                    >
                                        <img
                                            src={tech.image}
                                            alt={tech.name}
                                            className="w-8 h-8 object-contain"
                                        />
                                        <span className="text-sm text-gray-700 whitespace-nowrap">{tech.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="overflow-hidden py-5 bg-white">
                        <div className="w-full max-w-[1200px] mx-auto">
                            <div className="whitespace-nowrap animate-slide-right flex items-center w-max gap-5">
                                {[...technologies, ...technologies].map((tech, i) => (
                                    <div
                                        key={`bottom-${i}`}
                                        className="flex items-center gap-2 border border-gray-200 px-5 py-3 rounded-full"
                                    >
                                        <img
                                            src={tech.image}
                                            alt={tech.name}
                                            className="w-8 h-8 object-contain"
                                        />
                                        <span className="text-sm text-gray-700 whitespace-nowrap">{tech.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}