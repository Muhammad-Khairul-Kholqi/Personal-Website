"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Search } from "lucide-react";
import Swal from "sweetalert2";
import { GetEducations, CreateEducation, UpdateEducation, DeleteEducation } from "@/app/api/educationApi";
import Pagination from "@/app/components/molecules/pagination";
import DataModal from "@/app/components/modals/dataModal";

export default function EducationPage() {
    const [educations, setEducations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState("create");
    const [selectedEducations, setSelectedEducations] = useState(null);

    const router = useRouter();
    const pathname = usePathname();
    const perPage = 5;

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            const data = await GetEducations();
            setEducations(data);
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

    const filtered = educations.filter((education) =>
        education.school_name.toLowerCase().includes(search.toLowerCase())
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
        setSelectedEducations(null);
        setIsModalOpen(true);
    };

    const openEditModal = (education) => {
        setModalMode("edit");
        setSelectedEducations(education);
        setIsModalOpen(true);
    };

    const handleModalSubmit = async (formData) => {
        if (modalMode === "create") {
            const newEducation = await CreateEducation(formData);
            setEducations((prev) => [newEducation, ...prev]);
        } else if (modalMode === "edit") {
            const updatedEduacation = await UpdateEducation(selectedEducations.id, formData);
            setEducations((prev) =>
                prev.map((t) => (t.id === selectedEducations.id ? updatedEduacation : t))
            );
        }
    };

    const handleDelete = async (education) => {
        const confirm = await Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
        });
        if (confirm.isConfirmed) {
            await DeleteEducation(education.id);
            setEducations((prev) => prev.filter((t) => t.id !== education.id));
            Swal.fire("Deleted!", "Your education has been deleted.", "success");
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
                            placeholder="Search education..."
                            className="w-full outline-none"
                            value={search}
                            onChange={(e) => handleSearchChange(e.target.value)}
                        />
                    </div>
                    <button
                        className="bg-black hover:bg-black/80 text-white px-5 py-2 rounded-md cursor-pointer transition-colors w-full sm:max-w-[15%]"
                        onClick={openCreateModal}
                    >
                        Add Education
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
                                    <th className="px-6 py-3">School Name</th>
                                    <th className="px-6 py-3">School Logo</th>
                                    <th className="px-6 py-3">Location</th>
                                    <th className="px-6 py-3">Start Time</th>
                                    <th className="px-6 py-3">End Time</th>
                                    <th className="px-6 py-3">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginated.length > 0 ? (
                                    paginated.map((education, idx) => (
                                        <tr key={education.id} className="bg-white border-b border-gray-200">
                                            <td className="px-6 py-4">{(page - 1) * perPage + idx + 1}</td>
                                            <td className="px-6 py-4">{education.school_name}</td>
                                            <td className="px-6 py-4">
                                                {education.image ? (
                                                    <img
                                                        src={education.image}
                                                        alt={education.title}
                                                        className="w-12 h-12 object-cover rounded-md"
                                                    />
                                                ) : (
                                                    "-"
                                                )}
                                            </td>
                                            <td className="px-6 py-4">{education.location}</td>
                                            <td className="px-6 py-4">
                                                {new Date(education.start_time).toLocaleDateString("en-GB", {
                                                    day: "numeric",
                                                    month: "long",
                                                    year: "numeric",
                                                })}
                                            </td>
                                            <td className="px-6 py-4">
                                                {new Date(education.end_time).toLocaleDateString("en-GB", {
                                                    day: "numeric",
                                                    month: "long",
                                                    year: "numeric",
                                                })}
                                            </td>
                                            <td className="px-6 py-4 flex items-center gap-3">
                                                <button
                                                    className="text-blue-400 bg-blue-100 hover:bg-blue-200 hover:text-blue-500 px-3 py-1 rounded-md cursor-pointer"
                                                    onClick={() => openEditModal(education)}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    className="text-red-400 bg-red-100 hover:bg-red-200 hover:text-red-500 px-3 py-1 rounded-md cursor-pointer"
                                                    onClick={() => handleDelete(education)}
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="text-center py-5 text-gray-500">
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
                title={modalMode === "create" ? "Create Education" : "Edit Education"}
                fields={[
                    {
                        name: "school_name",
                        label: "School Name",
                        type: "text",
                        placeholder: "Enter school name",
                        required: true
                    },
                    {
                        name: "location",
                        label: "Location",
                        type: "text",
                        placeholder: "Enter location",
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
                        name: "image",
                        label: "School Logo",
                        type: "file",
                        accept: "image/*",
                        required: modalMode === "create"
                    },
                ]}
                onSubmit={handleModalSubmit}
                initialData={selectedEducations || {}}
            />
        </div>
    );
}