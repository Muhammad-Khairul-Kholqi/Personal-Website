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
    const [selectedImageIndex, setSelectedImageIndex] = useState(0)

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
                    if (foundProject.images && foundProject.images.length > 0) {
                        const primaryIndex = foundProject.images.findIndex(img => img.is_primary)
                        setSelectedImageIndex(primaryIndex >= 0 ? primaryIndex : 0)
                    }
                }
            } catch (error) {
                console.error("Error fetching project detail:", error)
                setProject(null)
            }
            setLoading(false)
        }
        fetchProjectDetail()
    }, [slug])

    const handleImageClick = (index) => {
        setSelectedImageIndex(index)
    }

    const getMainImage = () => {
        if (project.images && project.images.length > 0) {
            return project.images[selectedImageIndex]?.image_url
        }
        return project.primary_image || project.image
    }

    const getThumbnailImages = () => {
        if (!project.images || project.images.length <= 1) return []
        return project.images.filter((_, index) => index !== selectedImageIndex)
    }

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

            <div className="mt-5">
                {getMainImage() ? (
                    <div className="space-y-4">
                        <div className="relative group">
                            <img
                                src={getMainImage()}
                                alt={project.title}
                                className="w-full h-[400px] md:h-[500px] object-cover border border-gray-200 rounded-xl transition-all duration-300"
                            />
                            {project.images && project.images.length > 1 && (
                                <div className="absolute top-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
                                    {selectedImageIndex + 1} / {project.images.length}
                                </div>
                            )}
                        </div>

                        {getThumbnailImages().length > 0 && (
                            <div className="space-y-3">
                                <p className="text-sm font-medium text-gray-700">Other Images:</p>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                    {project.images.map((image, index) => (
                                        index !== selectedImageIndex && (
                                            <div
                                                key={index}
                                                className="relative cursor-pointer group"
                                                onClick={() => handleImageClick(index)}
                                            >
                                                <img
                                                    src={image.image_url}
                                                    alt={`${project.title} - Image ${index + 1}`}
                                                    className="w-full h-24 sm:h-28 object-cover border border-gray-200 rounded-lg transition-all duration-300"
                                                />
                                                {image.is_primary && (
                                                    <div className="absolute top-1 left-1 bg-black text-white px-1 py-0.5 rounded text-xs">
                                                        Primary
                                                    </div>
                                                )}
                                                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-center justify-center">
                                                    <p className="text-white text-xs font-medium">Click to view</p>
                                                </div>
                                            </div>
                                        )
                                    ))}
                                </div>
                            </div>
                        )}

                        {project.images && project.images.length > 5 && (
                            <div className="text-center">
                                <button className="text-blue-500 hover:text-blue-600 text-sm font-medium hover:underline">
                                    View All {project.images.length} Images
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="w-full h-[400px] bg-gray-100 border border-gray-200 rounded-xl flex items-center justify-center">
                        <p className="text-gray-500">No image available</p>
                    </div>
                )}
            </div>

            {project.images && project.images.length > 1 && (
                <div className="flex justify-center mt-4 space-x-2">
                    {project.images.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => handleImageClick(index)}
                            className={`w-2 h-2 rounded-full transition-all duration-300 ${index === selectedImageIndex
                                    ? 'bg-black w-6'
                                    : 'bg-gray-300 hover:bg-gray-400'
                                }`}
                        />
                    ))}
                </div>
            )}

            {project.list_job && (
                <div className="mt-8 rounded-xl">
                    <h3 className="text-lg font-semibold mb-3">Project Details:</h3>
                    <div
                        className="prose prose-sm max-w-none [&_p]:mb-2 [&_ul]:list-disc [&_ul]:list-inside [&_ol]:list-decimal [&_ol]:list-inside [&_li]:mb-1 bg-gray-50 p-4 rounded-lg"
                        dangerouslySetInnerHTML={{ __html: project.list_job }}
                    />
                </div>
            )}
        </div>
    )
}