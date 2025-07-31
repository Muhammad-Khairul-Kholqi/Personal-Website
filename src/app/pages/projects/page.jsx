'use client'

import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Github, SquareArrowOutUpRight, ScanLine, Search } from "lucide-react"
import { ProjectsData } from "@/app/data/projectsData"
import { useState, useMemo, useEffect } from "react"

export default function ProjectsPage() {
    const router = useRouter()
    const [currentPage, setCurrentPage] = useState(1)
    const [isClient, setIsClient] = useState(false)
    const projectsPerPage = 6

    const [filterStatus, setFilterStatus] = useState(null)
    const [searchKeyword, setSearchKeyword] = useState("")

    useEffect(() => {
        setIsClient(true)

        const urlParams = new URLSearchParams(window.location.search)
        const pageParam = urlParams.get("page")
        if (pageParam) {
            setCurrentPage(parseInt(pageParam))
        }
    }, [])

    const filteredProjects = useMemo(() => {
        return ProjectsData.filter((project) => {
            const matchesStatus = filterStatus ? project.status === filterStatus : true
            const matchesSearch = project.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
                project.description.toLowerCase().includes(searchKeyword.toLowerCase())
            return matchesStatus && matchesSearch
        })
    }, [filterStatus, searchKeyword])

    const totalPages = Math.ceil(filteredProjects.length / projectsPerPage)
    const startIndex = (currentPage - 1) * projectsPerPage
    const paginatedProjects = filteredProjects.slice(startIndex, startIndex + projectsPerPage)

    const shortText = (desc) => desc.split(" ").slice(0, 5).join(" ") + "..."

    const statusColor = (status) =>
        status === "finished"
            ? { bg: "bg-green-50", text: "text-green-600" }
            : { bg: "bg-orange-50", text: "text-orange-600" }

    const changePage = (page) => {
        setCurrentPage(page)
        router.push(`?page=${page}`)
    }

    useEffect(() => {
        setCurrentPage(1)
    }, [filterStatus, searchKeyword])

    if (!isClient) {
        return (
            <>
                <h1 className="text-2xl">Projects</h1>
                <p className="text-[#525252] text-sm">Showcasing my passion for technology, design, and problem-solving through code.</p>
                <hr className="border-t border-dashed border-gray-500 my-5" />

                <div className="flex flex-col md:flex-row items-center gap-5 w-full">
                    <div className="grid lg:grid-cols-3 md:grid-cols-3 sm:grid-cols-1 grid-cols-1 gap-3 w-full md:max-w-[50%]">
                        {Array.from({ length: 3 }).map((_, idx) => (
                            <div key={idx} className="bg-gray-200 h-12 rounded-lg animate-pulse"></div>
                        ))}
                    </div>
                    <div className="w-full md:max-w-[50%] bg-gray-200 h-12 rounded-lg animate-pulse"></div>
                </div>

                <div className="grid lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1 items-center gap-5 mt-5">
                    {Array.from({ length: projectsPerPage }).map((_, idx) => (
                        <div key={idx} className="border border-gray-200 p-5 rounded-lg animate-pulse">
                            <div className="bg-gray-200 h-48 rounded-lg mb-3"></div>
                            <div className="flex items-center justify-between gap-3 mb-3">
                                <div className="bg-gray-200 h-6 w-32 rounded"></div>
                                <div className="bg-gray-200 h-8 w-20 rounded-full"></div>
                            </div>
                            <div className="bg-gray-200 h-4 w-full rounded mb-3"></div>
                            <div className="grid grid-cols-3 gap-2">
                                <div className="bg-gray-200 h-10 rounded"></div>
                                <div className="bg-gray-200 h-10 rounded"></div>
                                <div className="bg-gray-200 h-10 rounded"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </>
        )
    }

    return (
        <>
            <h1 className="text-2xl">Projects</h1>
            <p className="text-[#525252] text-sm">Showcasing my passion for technology, design, and problem-solving through code.</p>
            <hr className="border-t border-dashed border-gray-500 my-5" />

            <div className="flex flex-col md:flex-row items-center gap-5 w-full">
                <div className="grid lg:grid-cols-3 md:grid-cols-3 sm:grid-cols-1 grid-cols-1 gap-3 w-full md:max-w-[50%]">
                    <button
                        onClick={() => setFilterStatus(null)}
                        className={`border border-gray-200 px-5 py-3 rounded-lg cursor-pointer hover:bg-gray-50 ${filterStatus === null ? "bg-gray-50" : ""}`}>
                        Show All
                    </button>
                    <button
                        onClick={() => setFilterStatus("finished")}
                        className={`border border-gray-200 px-5 py-3 rounded-lg cursor-pointer hover:bg-gray-50 ${filterStatus === "finished" ? "bg-gray-50" : ""}`}>
                        Finished
                    </button>
                    <button
                        onClick={() => setFilterStatus("processed")}
                        className={`border border-gray-200 px-5 py-3 rounded-lg cursor-pointer hover:bg-gray-50 ${filterStatus === "processed" ? "bg-gray-50" : ""}`}>
                        Processed
                    </button>
                </div>

                <div className="w-full md:max-w-[50%] border border-gray-200 py-3 px-5 flex items-center gap-3 rounded-lg">
                    <Search className="text-gray-600" />
                    <input
                        type="text"
                        className="outline-none w-full"
                        placeholder="Search project"
                        value={searchKeyword}
                        onChange={(e) => setSearchKeyword(e.target.value)}
                    />
                </div>
            </div>

            {paginatedProjects.length > 0 ? (
                <div className="grid lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1 items-center gap-5 mt-5">
                    {paginatedProjects.map((project, idx) => {
                        const linkCount = [project.repository, project.demo, project.detail].filter(Boolean).length
                        const gridCols = linkCount === 1 ? "grid-cols-1" : linkCount === 2 ? "grid-cols-2" : "grid-cols-3"

                        return (
                            <div key={idx} className="border border-gray-200 p-5 rounded-lg group">
                                <div className="relative overflow-hidden rounded-lg">
                                    <Image
                                        src={project.image}
                                        width={500}
                                        height={200}
                                        alt={project.name}
                                        className="border w-full h-[200px] border-gray-200 rounded-lg object-cover group-hover:scale-110 duration-300"
                                    />
                                </div>
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
                                    <div className={`mt-3 grid ${gridCols} items-center gap-2`}>
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
                        )
                    })}
                </div>
            ) : (
                <div className="text-center text-gray-600 mt-10">
                    No projects match your criteria.
                </div>
            )}

            {filteredProjects.length > projectsPerPage && (
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
            )}
        </>
    )
}