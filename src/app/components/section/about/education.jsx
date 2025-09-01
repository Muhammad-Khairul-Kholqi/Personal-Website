"use client";
import { useState, useEffect } from "react";
import { GetEducations } from "@/app/api/educationApi";
import LoadingSkeleton from "@/app/components/global/loadingSkeleton";

export default function Education() {
    const [educations, setEducations] = useState([]);
    const [loadingEducations, setLoadingEducations] = useState(true);

    useEffect(() => {
        async function fetchService() {
            setLoadingEducations(true);
            try {
                const data = await GetEducations();

                const sortedEducations = data.sort((a, b) =>
                    new Date(b.start_time) - new Date(a.start_time)
                );

                setEducations(sortedEducations);
            } catch (error) {
                console.error("Error fetching educations:", error);
            }
            setLoadingEducations(false);
        }
        fetchService();
    }, []);

    return (
        <div>
            <h1 className="text-2xl">Education</h1>
            <p className="text-[#525252] text-sm">My school trip until now</p>
            {loadingEducations ? (
                <div className="grid lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1 items-start gap-5 mt-3">
                    <LoadingSkeleton width="100%" height="150px" className="mb-4" />
                    <LoadingSkeleton width="100%" height="150px" className="mb-4" />
                </div>
            ) : (
                <div className="mt-5 grid lg:grid-cols-2 md:grid-cols-2 grid-cols-1 gap-5">
                    {educations.map((education) => (
                        <div key={education.id} className="p-5 border border-gray-200 rounded-lg flex flex-col sm:flex-row items-center gap-4">
                            <div className="w-full sm:w-[100px] flex-shrink-0 flex justify-center">
                                <img
                                    src={education.image}
                                    alt={education.agency_name}
                                    className="object-contain w-full max-w-[100px]"
                                />
                            </div>
                            <div className="text-center sm:text-left w-full">
                                <h2 className="text-xl">{education.school_name}</h2>
                                <div className="flex flex-wrap justify-center sm:justify-start items-center gap-3 mt-2 text-gray-700 text-sm">
                                    <div className="flex items-center gap-2">
                                        <div className="p-0.5 bg-gray-600 rounded-full" />
                                        <h2>
                                            {new Date(education.start_time).toLocaleDateString("en-GB", {
                                                day: "numeric",
                                                month: "long",
                                                year: "numeric",
                                            })} -
                                            {new Date(education.end_time).toLocaleDateString("en-GB", {
                                                day: "numeric",
                                                month: "long",
                                                year: "numeric",
                                            })}
                                        </h2>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="p-0.5 bg-gray-600 rounded-full" />
                                        <h2>{education.location}</h2>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}