'use client'
import { useState, useEffect } from "react";
import { GetSoftSkills } from "@/app/api/softSkillApi";
import LoadingSkeleton from "../../global/loadingSkeleton";
import Image from "next/image";

const SoftSkillCard = ({ skill, backgroundImage }) => (
    <div className="relative p-6 rounded-xl w-full max-w-[500px] shrink-0 min-h-[220px] overflow-hidden">
        <Image
            src={backgroundImage}
            fill
            alt={`${skill.title} background`}
            className="object-cover -z-10"
            sizes="(max-width: 500px) 100vw, 500px"
        />
        <div className="absolute inset-0 bg-black/40 -z-5"></div>
        <div className="relative z-10">
            <h2 className="text-xl font-bold text-white mb-3 drop-shadow-lg">
                {skill.title}
            </h2>
            <p className="text-md leading-relaxed text-gray-100 drop-shadow-sm">
                {skill.description}
            </p>
        </div>
    </div>
);

const SectionHeader = ({ title, subtitle }) => (
    <div className="mb-6">
        <h1 className="text-2xl">
            {title}
        </h1>
        <p className="text-gray-600">
            {subtitle}
        </p>
    </div>
);

export default function SoftSkillsSlider() {
    const [softSkills, setSoftSkills] = useState([]);
    const [loading, setLoading] = useState(true);
    const backgroundImage = "https://drive.google.com/uc?export=view&id=1ubUUhpcNIrn767qrrELJJrJYqnJ3u9jP";

    useEffect(() => {
        async function fetchSoftSkills() {
            try {
                setLoading(true);
                const data = await GetSoftSkills();
                setSoftSkills(data);
            } catch (error) {
                console.error('Error fetching soft skills:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchSoftSkills();
    }, []);

    return (
        <div className="">
            <SectionHeader
                title="Soft Skills"
                subtitle="Swipe or drag to see more"
            />
            <div className="w-full overflow-x-auto scrollbar-hide">
                <div className="flex gap-6 flex-nowrap pb-4">
                    {loading ? (
                        Array.from({ length: 5 }).map((_, index) => (
                            <div key={`skeleton-${index}`} className="w-full max-w-[500px] shrink-0 min-h-[220px]">
                                <LoadingSkeleton height="200px" />
                            </div>
                        ))
                    ) : (
                        softSkills.map((skill) => (
                            <SoftSkillCard
                                key={skill.id}
                                skill={skill}
                                backgroundImage={backgroundImage}
                            />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}