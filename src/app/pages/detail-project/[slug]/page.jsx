import { notFound } from "next/navigation"
import Image from "next/image"
import { Github, SquareArrowOutUpRight } from "lucide-react"
import { ProjectsData } from "@/app/data/projectsData"
import TechStack from "@/app/data/techStack"

export default function DetailProjectPage({ params }) {
    const { slug } = params

    const project = ProjectsData.find(p => p.detail === slug)

    if (!project) return notFound()

    return (
        <div>
            <h1 className="text-3xl">{project.name}</h1>

            <p className="text-gray-600 mt-3">{project.description}</p>

            <hr className="border-t border-dashed border-gray-500 my-5" />

            {(project.repository || project.demo) && (
                <div className="flex items-center gap-3 flex-wrap">
                    {project.repository && (
                        <a href={project.repository} target="_blank" rel="noopener noreferrer">
                            <div className="flex items-center gap-2 hover:underline">
                                <Github className="w-5 h-5" />
                                <p>Source Code</p>
                            </div>
                        </a>
                    )}
                    {project.repository && project.demo && <p>|</p>}
                    {project.demo && (
                        <a href={project.demo} target="_blank" rel="noopener noreferrer">
                            <div className="flex items-center gap-2 hover:underline">
                                <SquareArrowOutUpRight className="w-4 h-4" />
                                <p>Live Demo</p>
                            </div>
                        </a>
                    )}
                </div>
            )}

            <div className="flex items-center gap-3 mt-5 w-full">
                <p className="whitespace-nowrap">Tech Stack:</p>
                <div className="overflow-x-auto scrollbar-hide w-full">
                    <div className="flex gap-3 min-w-max">
                        {project.techs.map((tech, i) => (
                            <div
                                key={i}
                                className="flex items-center gap-2 border border-gray-200 rounded-full px-5 py-2 whitespace-nowrap"
                            >
                                <Image
                                    src={TechStack[tech] || "/fallback.png"}
                                    width={20}
                                    height={20}
                                    alt={tech}
                                    className="w-full max-w-[20px]"
                                />
                                <p>{tech}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <Image
                src={project.image}
                width={500}
                height={300}
                alt={project.name}
                className="w-full border border-gray-200 rounded-xl mt-5"
            />

            <div className="mt-5 rounded-xl space-y-2">
                {project.tasks.map((task, i) => (
                    <div key={i} className="flex items-start gap-3">
                        <div className="bg-black p-1 rounded-full mt-1" />
                        <p className="text-gray-600">{task}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}
