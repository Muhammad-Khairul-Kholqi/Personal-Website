"use client";

import { useEffect, useState } from "react";
import { GetCareers } from "@/app/api/careerApi";
import LoadingSkeleton from "@/app/components/global/loadingSkeleton";
import { GetTechnologies } from "@/app/api/technologyApi";

const CAREER_TYPES = [
    { value: "full_time", label: "Full Time" },
    { value: "part_time", label: "Part Time" },
    { value: "contract", label: "Contract" },
    { value: "internship", label: "Internship" },
    { value: "temporary", label: "Temporary" },
    { value: "freelance", label: "Freelance" },
    { value: "probation", label: "Probation" },
    { value: "apprenticeship", label: "Apprenticeship" },
    { value: "consultant", label: "Consultant" },
    { value: "volunteer", label: "Volunteer" },
    { value: "outsourcing", label: "Outsourcing" }
];

export default function Career() {
    const [careers, setCareers] = useState([]);
    const [technologies, setTechnologies] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            try {
                const [careersData, technologiesData] = await Promise.all([
                    GetCareers(),
                    GetTechnologies()
                ]);

                const sortedCareers = careersData.sort((a, b) =>
                    new Date(b.start_time) - new Date(a.start_time)
                );

                setCareers(sortedCareers);
                setTechnologies(technologiesData);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
            setLoading(false);
        }
        fetchData();
    }, []);

    return (
        <div>
            <h1 className="text-2xl">Career</h1>
            <p className="text-[#525252] text-sm">My professional career journey</p>

            {loading ? (
                <div className="space-y-5 mt-5">
                    <LoadingSkeleton width="100%" height="300px" />
                    <LoadingSkeleton width="100%" height="300px" />
                </div>
            ) : (
                <div className="space-y-5 mt-5">
                    {careers.map((career) => (
                        <div key={career.id} className="w-full border border-gray-200 p-3 md:p-5 rounded-xl flex flex-col md:flex-row items-start gap-3 md:gap-5">
                            <div className="w-full md:w-[150px] flex-shrink-0 border border-gray-200 rounded-lg overflow-hidden">
                                <img
                                    src={career.image}
                                    alt={career.position}
                                    className="rounded-lg w-full h-full object-cover"
                                />
                            </div>

                            <div className="w-full">
                                <h1 className="text-lg md:text-xl font-medium">{career.agency_name}</h1>

                                <div className="flex flex-wrap items-center gap-3 mt-2 text-gray-700 text-sm md:text-base">
                                    <h2>{career.address}</h2>
                                    <div className="flex items-center gap-2">
                                        <div className="p-0.5 bg-gray-600 rounded-full" />
                                        <p>{CAREER_TYPES.find(type => type.value === career.type)?.label || career.type}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="p-0.5 bg-gray-600 rounded-full" />
                                        <h2>
                                            {new Date(career.start_time).toLocaleDateString("en-GB", {
                                                day: "numeric",
                                                month: "long",
                                                year: "numeric",
                                            })} -
                                            {new Date(career.end_time).toLocaleDateString("en-GB", {
                                                day: "numeric",
                                                month: "long",
                                                year: "numeric",
                                            })}
                                        </h2>
                                    </div>
                                </div>

                                <h2 className="text-base md:text-lg mt-3 text-gray-700 font-semibold">
                                    {career.position}
                                </h2>

                                <div
                                    className="mt-3 prose prose-sm max-w-none [&_ul]:list-disc [&_ul]:list-inside [&_ol]:list-decimal [&_ol]:list-inside [&_li]:mb-1"
                                    dangerouslySetInnerHTML={{ __html: career.job_list }}
                                />

                                {career.technologies && career.technologies.length > 0 && (
                                    <div className="mt-4">
                                        <h3 className="font-medium mb-2">Technologies Used:</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {career.technologies.map((tech) => (
                                                <div key={tech.id} className="flex items-center gap-2 border border-gray-200 rounded-full px-4 py-2 bg-gray-50">
                                                    <img
                                                        src={tech.image}
                                                        alt={tech.name}
                                                        className="w-5 h-5 object-contain"
                                                    />
                                                    <span className="text-sm text-gray-700">{tech.name}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}