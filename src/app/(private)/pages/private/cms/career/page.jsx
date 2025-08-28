"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Search } from "lucide-react";
import Swal from "sweetalert2";
import { GetCareers, GetCareersById, CreateCareers, UpdateCareers, DeleteCareers } from "@/app/api/careerApi";
import { getTechnologies } from "@/app/api/technologyApi";
import Pagination from "@/app/components/molecules/pagination";
import DataModal from "@/app/components/modals/dataModal";

const CAREER_TYPES = [
    { value: "full_time", label: "Full Time" },
    { value: "part_time", label: "Part Time" },
    { value: "contract", label: "Contract" },
    { value: "internship", label: "Internship" },
    { value: "temporary", label: "Temporary" },
    { value: "freelance", label: "Freelance" },
    { value: "probation", label: "Probation" },
    { value: "apprenticeship", label: "Apprenticeship" },
    { value: "consultant", label: "Consultant" },
    { value: "volunteer", label: "Volunteer" },
    { value: "outsourcing", label: "Outsourcing" }
];


export default function CareerPage() {
    const [careers, setCareers] = useState([]);
    const [technologies, setTechnologies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState("create");
    const [selectedCareer, setSelectedCareer] = useState(null);

    const router = useRouter();
    const pathname = usePathname();
    const perPage = 5;

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            try {
                const [careersData, technologiesData] = await Promise.all([
                    GetCareers(),
                    getTechnologies()
                ]);
                setCareers(careersData);
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

    const filtered = careers.filter((career) =>
        career.agency_name.toLowerCase().includes(search.toLowerCase())
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
        setSelectedCareer(null);
        setIsModalOpen(true);
    };

    const openEditModal = (career) => {
        setModalMode("edit");
        setSelectedCareer(career);
        setIsModalOpen(true);
    };

    const openDetailModal = (career) => {
        setModalMode("detail");
        setSelectedCareer(career);
        setIsModalOpen(true);
    };

    const handleModalSubmit = async (formData) => {
        if (modalMode === "create") {
            await CreateCareers(formData);
        } else if (modalMode === "edit") {
            await UpdateCareers(selectedCareer.id, formData);
        }

        const careersData = await GetCareers();
        setCareers(careersData);
    };

    const handleDelete = async (career) => {
        const confirm = await Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
        });
        if (confirm.isConfirmed) {
            await DeleteCareers(career.id);
            setCareers((prev) => prev.filter((t) => t.id !== career.id));
            Swal.fire("Deleted!", "Your career has been deleted.", "success");
        }
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return "-";
        const date = new Date(dateStr);
        return date.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "long",
            year: "numeric",
        });
    };

    const getModalFields = () => {
        if (modalMode === "detail") {
            return [
                {
                    name: "agency_name",
                    label: "Agency Name",
                    type: "text",
                    readOnly: true
                },
                {
                    name: "type",
                    label: "Type",
                    type: "text",
                    readOnly: true
                },
                {
                    name: "position",
                    label: "Position",
                    type: "text",
                    readOnly: true
                },
                {
                    name: "address",
                    label: "Address",
                    type: "text",
                    readOnly: true
                },
                {
                    name: "job_list",
                    label: "Job List",
                    type: "wysiwyg",
                    readOnly: true
                },
                {
                    name: "start_time",
                    label: "Start Time",
                    type: "date",
                    readOnly: true
                },
                {
                    name: "end_time",
                    label: "End Time",
                    type: "date",
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
                    label: "Company Logo",
                    type: "file",
                    accept: "image/*",
                    readOnly: true
                }
            ];
        } else {
            return [
                {
                    name: "agency_name",
                    label: "Agency Name",
                    type: "text",
                    placeholder: "Enter agency name",
                    required: true
                },
                {
                    name: "type",
                    label: "Type",
                    type: "select",
                    options: CAREER_TYPES,
                    required: true
                },
                {
                    name: "position",
                    label: "Position",
                    type: "text",
                    placeholder: "Enter position",
                    required: true
                },
                {
                    name: "address",
                    label: "Address",
                    type: "text",
                    placeholder: "Enter address",
                    required: true
                },
                {
                    name: "job_list",
                    label: "Job List",
                    type: "wysiwyg",
                    placeholder: "Enter job list",
                    required: true
                },
                {
                    name: "start_time",
                    label: "Start Time",
                    type: "date",
                    placeholder: "Enter start time",
                    required: true
                },
                {
                    name: "end_time",
                    label: "End Time",
                    type: "date",
                    placeholder: "Enter end time",
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
                    label: "Company Logo",
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
                return "Create Career";
            case "edit":
                return "Edit Career";
            case "detail":
                return "Career Details";
            default:
                return "Career";
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
                            placeholder="Search agency name..."
                            className="w-full outline-none"
                            value={search}
                            onChange={(e) => handleSearchChange(e.target.value)}
                        />
                    </div>
                    <button
                        className="bg-black hover:bg-black/80 text-white px-5 py-2 rounded-md cursor-pointer transition-colors w-full sm:max-w-[15%]"
                        onClick={openCreateModal}
                    >
                        Add Career
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
                                    <th className="px-6 py-3">Agency name</th>
                                    <th className="px-6 py-3">Type</th>
                                    <th className="px-6 py-3">Position</th>
                                    <th className="px-6 py-3">Company Logo</th>
                                    <th className="px-6 py-3">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginated.length > 0 ? (
                                    paginated.map((career, idx) => (
                                        <tr key={career.id} className="bg-white border-b border-gray-200">
                                            <td className="px-6 py-4 align-top">{(page - 1) * perPage + idx + 1}</td>
                                            <td className="px-6 py-4 align-top">{career.agency_name}</td>
                                            <td className="px-6 py-4 align-top">
                                                {CAREER_TYPES.find(type => type.value === career.type)?.label || career.type}
                                            </td>
                                            <td className="px-6 py-4 align-top">{career.position}</td>
                                            <td className="px-6 py-4 align-top">
                                                {career.image ? (
                                                    <img
                                                        src={career.image}
                                                        alt={career.agency_name}
                                                        className="w-12 h-12 object-cover rounded-md"
                                                    />
                                                ) : (
                                                    "No image"
                                                )}
                                            </td>
                                            <td className="px-6 py-4 align-top flex items-center gap-3">
                                                <button
                                                    className="text-blue-400 bg-blue-100 hover:bg-blue-200 hover:text-blue-500 px-3 py-1 rounded-md cursor-pointer"
                                                    onClick={() => openEditModal(career)}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    className="text-green-400 bg-green-100 hover:bg-green-200 hover:text-green-500 px-3 py-1 rounded-md cursor-pointer"
                                                    onClick={() => openDetailModal(career)}
                                                >
                                                    Detail
                                                </button>
                                                <button
                                                    className="text-red-400 bg-red-100 hover:bg-red-200 hover:text-red-500 px-3 py-1 rounded-md cursor-pointer"
                                                    onClick={() => handleDelete(career)}
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
                initialData={selectedCareer || {}}
                isReadOnly={modalMode === "detail"}
            />
        </div>
    );
}