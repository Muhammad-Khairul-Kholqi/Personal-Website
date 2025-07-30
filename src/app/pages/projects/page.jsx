'use client'

import Image from "next/image"
import Link from "next/link"
import { useSearchParams, useRouter } from "next/navigation"
import { Github, SquareArrowOutUpRight, ScanLine } from "lucide-react"
import { ProjectsData } from "@/app/data/projectsData"

export default function ProjectsPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const pageParam = searchParams.get("page")
    const currentPage = parseInt(pageParam || "1")
    const projectsPerPage = 6
    const totalPages = Math.ceil(ProjectsData.length / projectsPerPage)

    const startIndex = (currentPage - 1) * projectsPerPage
    const paginatedProjects = ProjectsData.slice(startIndex, startIndex + projectsPerPage)

    const shortText = (desc) => desc.split(" ").slice(0, 8).join(" ") + "..."

    const statusColor = (status) =>
        status === "finished"
            ? { bg: "bg-green-50", text: "text-green-600" }
            : { bg: "bg-orange-50", text: "text-orange-600" }

    const changePage = (page) => {
        router.push(`?page=${page}`)
    }

    return (
        <>
            <div className="grid lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1 items-center gap-5">
                {paginatedProjects.map((project, idx) => (
                    <div key={idx} className="border border-gray-200 p-5 rounded-lg">
                        <Image
                            src={project.image}
                            width={500}
                            height={200}
                            alt={project.name}
                            className="border w-full border-gray-200 rounded-lg"
                        />
                        <div className="mt-3">
                            <div className="flex items-center justify-between gap-3">
                                <h1 className="text-xl">{project.name}</h1>
                                <div className={`${statusColor(project.status).bg} px-5 py-2 rounded-full`}>
                                    <span className={statusColor(project.status).text}>
                                        {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                                    </span>
                                </div>
                            </div>
                            <p className="text-gray-600 mt-3">{shortText(project.description)}</p>
                            <div className="mt-3 grid lg:grid-cols-3 md:grid-cols-1 grid-cols-1 items-center gap-2">
                                {project.repository && (
                                    <a href={project.repository} target="_blank" rel="noopener noreferrer">
                                        <div className="flex items-center gap-2 p-2 rounded-md justify-center border border-gray-200 text-gray-700 hover:bg-gray-50">
                                            <Github className="w-5 h-5" />
                                            <span>Repository</span>
                                        </div>
                                    </a>
                                )}
                                {project.demo && (
                                    <a href={project.demo} target="_blank" rel="noopener noreferrer">
                                        <div className="flex items-center gap-2 p-2 rounded-md justify-center border border-gray-200 text-gray-700 hover:bg-gray-50">
                                            <SquareArrowOutUpRight className="w-4 h-4" />
                                            <span>Demo</span>
                                        </div>
                                    </a>
                                )}
                                {project.detail && (
                                    <Link href={`/pages/detail-project/${project.detail}`}>
                                        <div className="flex items-center gap-2 p-2 rounded-md justify-center border border-gray-200 text-gray-700 hover:bg-gray-50">
                                            <ScanLine className="w-4 h-4" />
                                            <span>Detail</span>
                                        </div>
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex justify-center items-center gap-2 mt-6">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                        key={page}
                        onClick={() => changePage(page)}
                        className={`px-4 py-2 border border-gray-200 rounded cursor-pointer ${currentPage === page
                                ? "bg-gray-800 text-white"
                                : "bg-white text-gray-800 hover:bg-gray-100"
                            }`}
                    >
                        {page}
                    </button>
                ))}
            </div>
        </>
    )
}
