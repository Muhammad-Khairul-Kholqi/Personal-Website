'use client'

import { notFound } from "next/navigation"
import { Github, SquareArrowOutUpRight } from "lucide-react"
import { useState, useEffect } from "react"
import { GetProjects } from "@/app/api/projectApi"
import LoadingSkeleton from "@/app/components/global/loadingSkeleton";

export default function DetailProjectPage({ params }) {
    const { slug } = params
    const [project, setProject] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchProjectDetail() {
            setLoading(true)
            try {
                const data = await GetProjects()
                const decodedSlug = decodeURIComponent(slug)
                const foundProject = data.find(p => p.title === decodedSlug)

                if (!foundProject) {
                    setProject(null)
                } else {
                    setProject(foundProject)
                }
            } catch (error) {
                console.error("Error fetching project detail:", error)
                setProject(null)
            }
            setLoading(false)
        }
        fetchProjectDetail()
    }, [slug])

    if (loading) {
        return (
            <div>
                <LoadingSkeleton width="60%" height="36px" className="mb-4" />
                <LoadingSkeleton width="100%" height="20px" className="mb-6" />
                <hr className="border-t border-dashed border-gray-500 my-5" />
                <LoadingSkeleton width="30%" height="24px" className="mb-5" />
                <LoadingSkeleton width="100%" height="300px" className="mb-5" />
                <LoadingSkeleton width="100%" height="200px" />
            </div>
        )
    }

    if (!project) return notFound()

    return (
        <div>
            <h1 className="text-3xl">{project.title}</h1>

            <p className="text-gray-600 mt-3">{project.description}</p>

            <hr className="border-t border-dashed border-gray-500 my-5" />

            {(project.url_github || project.url_demo) && (
                <div className="flex items-center gap-3 flex-wrap">
                    {project.url_github && (
                        <a href={project.url_github} target="_blank" rel="noopener noreferrer">
                            <div className="flex items-center gap-2 hover:underline">
                                <Github className="w-5 h-5" />
                                <p>Source Code</p>
                            </div>
                        </a>
                    )}
                    {project.url_github && project.url_demo && <p>|</p>}
                    {project.url_demo && (
                        <a href={project.url_demo} target="_blank" rel="noopener noreferrer">
                            <div className="flex items-center gap-2 hover:underline">
                                <SquareArrowOutUpRight className="w-4 h-4" />
                                <p>Live Demo</p>
                            </div>
                        </a>
                    )}
                </div>
            )}

            {project.technologies && project.technologies.length > 0 && (
                <div className="flex items-center gap-3 mt-5 w-full">
                    <p className="whitespace-nowrap">Tech Stack:</p>
                    <div className="overflow-x-auto scrollbar-hide w-full">
                        <div className="flex gap-3 min-w-max">
                            {project.technologies.map((tech) => (
                                <div
                                    key={tech.id}
                                    className="flex items-center gap-2 border border-gray-200 rounded-full px-5 py-2 whitespace-nowrap"
                                >
                                    <img
                                        src={tech.image}
                                        alt={tech.name}
                                        className="w-5 h-5 object-contain"
                                    />
                                    <p>{tech.name}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            <img
                src={project.image}
                width={500}
                height={300}
                alt={project.title}
                className="w-full border border-gray-200 rounded-xl mt-5"
            />

            {project.list_job && (
                <div className="mt-5 rounded-xl">
                    <div
                        className="prose prose-sm max-w-none [&_p]:mb-2 [&_ul]:list-disc [&_ul]:list-inside [&_ol]:list-decimal [&_ol]:list-inside [&_li]:mb-1"
                        dangerouslySetInnerHTML={{ __html: project.list_job }}
                    />
                </div>
            )}
        </div>
    )
}