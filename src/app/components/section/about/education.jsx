import Image from "next/image"
import EducationData from "@/app/data/educationData"

export default function Education() {
    return (
        <div>
            <h1 className="text-2xl">Education</h1>
            <p className="text-[#525252] text-sm">My school trip until now</p>

            <div className="mt-5 grid lg:grid-cols-2 md:grid-cols-2 grid-cols-1 gap-5">
                {EducationData.map((edu, index) => (
                    <div
                        key={index}
                        className="p-5 border border-gray-200 rounded-lg flex flex-col sm:flex-row items-center gap-4"
                    >
                        <div className="w-full sm:w-[100px] flex-shrink-0 flex justify-center">
                            <Image
                                src={edu.logo}
                                width={100}
                                height={100}
                                alt={`${edu.school} logo`}
                                className="object-contain w-full max-w-[100px]"
                            />
                        </div>

                        <div className="text-center sm:text-left w-full">
                            <h2 className="text-xl">{edu.school}</h2>
                            <div className="flex flex-wrap justify-center sm:justify-start items-center gap-3 mt-2 text-gray-700 text-sm">
                                <div className="flex items-center gap-2">
                                    <div className="p-0.5 bg-gray-600 rounded-full" />
                                    <h2>{edu.year}</h2>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="p-0.5 bg-gray-600 rounded-full" />
                                    <h2>{edu.location}</h2>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
