import Image from "next/image"
import CareerData from "@/app/data/careerData"
import TechStack from "@/app/data/techStack"

export default function Career() {
    return (
        <div>
            <h1 className="text-2xl">Career</h1>
            <p className="text-[#525252] text-sm">My professional career journey</p>

            <div className="space-y-5 mt-5">
                {CareerData.map((job, index) => (
                    <div
                        key={index}
                        className="w-full border border-gray-200 p-3 md:p-5 rounded-xl flex flex-col md:flex-row items-start gap-3 md:gap-5"
                    >
                        <div className="w-full md:w-[150px] flex-shrink-0 border border-gray-200 rounded-lg overflow-hidden">
                            <Image
                                src={job.logo}
                                width={150}
                                height={150}
                                alt={`${job.company} logo`}
                                className="rounded-lg w-full h-auto object-cover"
                            />
                        </div>

                        <div className="w-full">
                            <h1 className="text-lg md:text-xl font-medium">{job.company}</h1>

                            <div className="flex flex-wrap items-center gap-3 mt-2 text-gray-700 text-sm md:text-base">
                                <p>{job.type}</p>
                                <div className="flex items-center gap-2">
                                    <div className="p-0.5 bg-gray-600 rounded-full" />
                                    <h2>{job.location}</h2>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="p-0.5 bg-gray-600 rounded-full" />
                                    <h2>{job.period}</h2>
                                </div>
                            </div>

                            <h2 className="text-base md:text-lg mt-3 text-gray-700 font-semibold">
                                {job.role}
                            </h2>

                            <div className="mt-3 space-y-2 text-gray-700 text-sm md:text-base">
                                {job.responsibilities.map((res, i) => (
                                    <div key={i} className="flex items-start gap-2">
                                        <div className="p-1 bg-gray-700 rounded-full mt-1" />
                                        <h2>{res}</h2>
                                    </div>
                                ))}
                            </div>

                            {job.techs && (
                                <>
                                    <h2 className="text-base font-semibold text-gray-700 mt-4">Technologies:</h2>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {job.techs.map((tech, i) => (
                                            <div
                                                key={i}
                                                className="flex items-center gap-2 border border-gray-200 bg-gray-50 px-3 py-1.5 rounded-full"
                                            >
                                                <div className="w-5 h-5 relative">
                                                    <Image
                                                        src={TechStack[tech]}
                                                        alt={tech}
                                                        fill
                                                        className="object-contain"
                                                    />
                                                </div>
                                                <span className="text-xs md:text-sm text-gray-700">{tech}</span>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
