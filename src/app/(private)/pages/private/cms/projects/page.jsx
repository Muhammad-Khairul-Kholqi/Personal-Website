"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Search } from "lucide-react";
import Swal from "sweetalert2";
import { GetProjects, CreateProject, UpdateProject, DeleteProject } from "@/app/api/projectApi";
import { GetTechnologies } from "@/app/api/technologyApi";
import Pagination from "@/app/components/molecules/pagination";
import DataModal from "@/app/components/modals/dataModal"

const PROJECT_STATUS = [    
    { value: "processed", label: "Processed" },
    { value: "finished", label: "Finished" },
];

export default function ProjectPage() {
    const [projects, setProjects] = useState([]);
    const [technologies, setTechnologies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState("create");
    const [selectedProject, setSelectedProject] = useState(null);

    const router = useRouter();
    const pathname = usePathname();
    const perPage = 5;

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            try {
                const [projectsData, technologiesData] = await Promise.all([
                    GetProjects(),
                    GetTechnologies()
                ]);
                setProjects(projectsData);
                setTechnologies(technologiesData);
            } catch (error) {
                console.error("Error fetching data:", error);
                Swal.fire("Error", "Failed to fetch data", "error");
            }
            setLoading(false);
        }
        fetchData();
    }, []);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const params = new URLSearchParams(window.location.search);
            const currentPage = parseInt(params.get("page") || "1", 10);
            const currentSearch = params.get("search") || "";
            setPage(currentPage);
            setSearch(currentSearch);
        }
    }, []);

    const filtered = projects.filter((project) =>
        project.title.toLowerCase().includes(search.toLowerCase())
    );

    const totalPages = Math.ceil(filtered.length / perPage);
    const paginated = filtered.slice((page - 1) * perPage, page * perPage);

    const updateQuery = (newPage, newSearch) => {
        const params = new URLSearchParams(window.location.search);
        if (newPage) params.set("page", newPage);
        if (newSearch !== undefined) {
            params.set("search", newSearch);
            params.set("page", "1");
        }
        router.push(`${pathname}?${params.toString()}`);
    };

    const handlePageChange = (newPage) => {
        setPage(newPage);
        updateQuery(newPage, undefined);
    };

    const handleSearchChange = (value) => {
        setSearch(value);
        updateQuery(undefined, value);
    };

    const openCreateModal = () => {
        setModalMode("create");
        setSelectedProject(null);
        setIsModalOpen(true);
    };

    const openEditModal = (project) => {
        setModalMode("edit");
        setSelectedProject(project);
        setIsModalOpen(true);
    };

    const openDetailModal = (project) => {
        setModalMode("detail");
        setSelectedProject(project);
        setIsModalOpen(true);
    };

    const handleModalSubmit = async (formData) => {
        if (modalMode === "create") {
            await CreateProject(formData);
        } else if (modalMode === "edit") {
            await UpdateProject(selectedProject.id, formData);
        }

        const projectsData = await GetProjects();
        setProjects(projectsData);
    };

    const handleDelete = async (project) => {
        const confirm = await Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
        });
        if (confirm.isConfirmed) {
            await DeleteProject(project.id);
            setProjects((prev) => prev.filter((t) => t.id !== project.id));
            Swal.fire("Deleted!", "Your education has been deleted.", "success");
        }
    };

    const getModalFields = () => {
        if (modalMode === "detail") {
            return [
                {
                    name: "title",
                    label: "Title",
                    type: "text",
                    readOnly: true
                },
                {
                    name: "url_github",
                    label: "URL GitHub",
                    type: "text",
                    readOnly: true
                },
                {
                    name: "url_demo",
                    label: "URL Demo",
                    type: "text",
                    readOnly: true
                },
                {
                    name: "status",
                    label: "Status",
                    type: "text",
                    readOnly: true
                },
                {
                    name: "description",
                    label: "Description",
                    type: "text",
                    readOnly: true
                },
                {
                    name: "list_job",
                    label: "Job List",
                    type: "wysiwyg",
                    readOnly: true
                },
                {
                    name: "technologies",
                    label: "Technologies",
                    type: "multiselect",
                    options: technologies,
                    readOnly: true
                },
                {
                    name: "image",
                    label: "Image",
                    type: "file",
                    accept: "image/*",
                    readOnly: true
                }
            ];
        } else {
            return [
                {
                    name: "title",
                    label: "Title",
                    type: "text",
                    placeholder: "Enter title",
                    required: true
                },
                {
                    name: "url_github",
                    label: "URL Github",
                    type: "text",
                    placeholder: "Enter url github",
                    required: false
                },
                {
                    name: "url_demo",
                    label: "URL Demo",
                    type: "text",
                    placeholder: "Enter url demo",
                    required: false
                },
                {
                    name: "status",
                    label: "Status",
                    type: "select",
                    options: PROJECT_STATUS,
                    required: true
                },
                {
                    name: "description",
                    label: "Description",
                    type: "textarea",
                    placeholder: "Enter description",
                    required: true
                },
                {
                    name: "list_job",
                    label: "Job List",
                    type: "wysiwyg",
                    placeholder: "Enter job list",
                    required: true
                },
                {
                    name: "technologies",
                    label: "Technologies",
                    type: "multiselect",
                    options: technologies,
                    required: false
                },
                {
                    name: "image",
                    label: "Project Image",
                    type: "file",
                    accept: "image/*",
                    required: modalMode === "create"
                }
            ];
        }
    };

    const getModalTitle = () => {
        switch (modalMode) {
            case "create":
                return "Create Project";
            case "edit":
                return "Edit Project";
            case "detail":
                return "Project Details";
            default:
                return "Project";
        }
    };

    return (
        <div>
            <div className="border border-gray-200 p-5 rounded-xl">
                <div className="w-full flex flex-col sm:flex-row items-center gap-3">
                    <div className="w-full flex items-center gap-3 border border-gray-200 rounded-md px-3 py-2">
                        <Search className="w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search project..."
                            className="w-full outline-none"
                            value={search}
                            onChange={(e) => handleSearchChange(e.target.value)}
                        />
                    </div>
                    <button
                        className="bg-black hover:bg-black/80 text-white px-5 py-2 rounded-md cursor-pointer transition-colors w-full sm:max-w-[15%]"
                        onClick={openCreateModal}
                    >
                        Add Project
                    </button>
                </div>

                <div className="relative overflow-x-auto mt-5">
                    {loading ? (
                        <p className="text-center py-5">Loading...</p>
                    ) : (
                        <table className="w-full text-sm text-left">
                            <thead className="text-sm uppercase bg-gray-100">
                                <tr>
                                    <th className="px-6 py-3">No</th>
                                    <th className="px-6 py-3">Title</th>
                                    <th className="px-6 py-3">URL Github</th>
                                    <th className="px-6 py-3">URL Demo</th>
                                    <th className="px-6 py-3">Status</th>
                                    <th className="px-6 py-3">Image</th>
                                    <th className="px-6 py-3">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginated.length > 0 ? (
                                    paginated.map((project, idx) => (
                                        <tr key={project.id} className="bg-white border-b border-gray-200">
                                            <td className="px-6 py-4 align-top">{(page - 1) * perPage + idx + 1}</td>
                                            <td className="px-6 py-4 align-top">{project.title}</td>
                                            <td className="px-6 py-4 align-top">
                                                {project.url_github ? (
                                                    <a href={project.url_github} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                                                        {project.url_github}
                                                    </a>
                                                ) : (
                                                    <span>No URL Github available</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 align-top">
                                                {project.url_demo ? (
                                                    <a href={project.url_demo} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                                                        {project.url_demo}
                                                    </a>
                                                ) : (
                                                    <span>No URL Demo available</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 align-top">
                                                {PROJECT_STATUS.find(status => status.value === project.status)?.label || project.status}
                                            </td>
                                            <td className="px-6 py-4 align-top">
                                                {project.image ? (
                                                    <img
                                                        src={project.image}
                                                        alt={project.title}
                                                        className="w-12 h-12 object-cover rounded-md"
                                                    />
                                                ) : (
                                                    "No image"
                                                )}
                                            </td>
                                            <td className="px-6 py-4 align-top flex items-center gap-3">
                                                <button
                                                    className="text-blue-400 bg-blue-100 hover:bg-blue-200 hover:text-blue-500 px-3 py-1 rounded-md cursor-pointer"
                                                    onClick={() => openEditModal(project)}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    className="text-green-400 bg-green-100 hover:bg-green-200 hover:text-green-500 px-3 py-1 rounded-md cursor-pointer"
                                                    onClick={() => openDetailModal(project)}
                                                >
                                                    Detail
                                                </button>
                                                <button
                                                    className="text-red-400 bg-red-100 hover:bg-red-200 hover:text-red-500 px-3 py-1 rounded-md cursor-pointer"
                                                    onClick={() => handleDelete(project)}
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="text-center py-5 text-gray-500">
                                            No data found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>

                {!loading && (
                    <Pagination
                        page={page}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                )}
            </div>

            <DataModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={getModalTitle()}
                fields={getModalFields()}
                onSubmit={modalMode === "detail" ? undefined : handleModalSubmit}
                initialData={selectedProject || {}}
                isReadOnly={modalMode === "detail"}
            />
        </div>
    );
}