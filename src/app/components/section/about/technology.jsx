import Image from "next/image";
import TechStack from "@/app/data/techStack";

export default function Technology() {
    const entries = Object.entries(TechStack);

    return (
        <div>
            <h1 className="text-2xl">Technology</h1>
            <p className="text-[#525252] text-sm">My coding skills</p>

            <div className="overflow-hidden bg-white mt-5">
                <div className="w-full max-w-[1200px] mx-auto">
                    <div className="whitespace-nowrap animate-slide-left flex items-center w-max gap-5">
                        {[...entries, ...entries].map(([tech, logo], i) => (
                            <div
                                key={`top-${i}`}
                                className="flex items-center gap-2 border border-gray-200 px-4 py-2 rounded-full flex-shrink-0"
                            >
                                <div className="w-8 h-8 relative">
                                    <Image
                                        src={logo}
                                        alt={tech}
                                        fill
                                        className="object-contain"
                                    />
                                </div>
                                <span className="text-sm text-gray-700 whitespace-nowrap">{tech}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="overflow-hidden py-5 bg-white">
                <div className="w-full max-w-[1200px] mx-auto">
                    <div className="whitespace-nowrap animate-slide-right flex items-center w-max gap-5">
                        {[...entries, ...entries].map(([tech, logo], i) => (
                            <div
                                key={`bottom-${i}`}
                                className="flex items-center gap-2 border border-gray-200 px-4 py-2 rounded-full flex-shrink-0"
                            >
                                <div className="w-8 h-8 relative">
                                    <Image
                                        src={logo}
                                        alt={tech}
                                        fill
                                        className="object-contain"
                                    />
                                </div>
                                <span className="text-sm text-gray-700 whitespace-nowrap">{tech}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
