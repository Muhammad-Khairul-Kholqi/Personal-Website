"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Search } from "lucide-react";
import Swal from "sweetalert2";
import { getTechnologies, CreateTechnology, UpdateTechnology, DeleteTechnology } from "@/app/api/technologyApi";
import Pagination from "@/app/components/molecules/pagination";

export default function TechnologyPage() {
    const [technologies, setTechnologies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState("create");
    const [selectedTechnology, setSelectedTechnology] = useState(null);

    const router = useRouter();
    const pathname = usePathname();
    const perPage = 5;

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            const data = await getTechnologies();
            setTechnologies(data);
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

    const filtered = technologies.filter((tech) =>
        tech.name.toLowerCase().includes(search.toLowerCase())
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
        setSelectedTechnology(null);
        setIsModalOpen(true);
    };

    const openEditModal = (technology) => {
        setModalMode("edit");
        setSelectedTechnology(technology);
        setIsModalOpen(true);
    };

    const handleModalSubmit = async (formData) => {
        if (modalMode === "create") {
            const newTechnology = await CreateTechnology(formData);
            setTechnologies((prev) => [newTechnology, ...prev]);
        } else if (modalMode === "edit") {
            const updatedTechnology = await UpdateTechnology(selectedTechnology.id, formData);
            setTechnologies((prev) =>
                prev.map((t) => (t.id === selectedTechnology.id ? updatedTechnology : t))
            );
        }
    };

    const handleDelete = async (technology) => {
        const confirm = await Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
        });
        if (confirm.isConfirmed) {
            await DeleteTechnology(technology.id);
            setTechnologies((prev) => prev.filter((t) => t.id !== technology.id));
            Swal.fire("Deleted!", "Your technology has been deleted.", "success");
        }
    };

    return (
        <div>
            <h1 className="text-xl font-semibold mb-5">Technology</h1>

            <div className="border border-gray-200 p-5 rounded-xl">
                <div className="w-full flex flex-col sm:flex-row items-center gap-3">
                    <div className="w-full flex items-center gap-3 border border-gray-200 rounded-md px-3 py-2">
                        <Search className="w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search technology..."
                            className="w-full outline-none"
                            value={search}
                            onChange={(e) => handleSearchChange(e.target.value)}
                        />
                    </div>
                    <button
                        className="bg-black hover:bg-black/80 text-white px-5 py-2 rounded-md cursor-pointer transition-colors w-full sm:max-w-[15%]"
                        onClick={openCreateModal}
                    >
                        Add Technology
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
                                    <th className="px-6 py-3">Technology Name</th>
                                    <th className="px-6 py-3">Image</th>
                                    <th className="px-6 py-3">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginated.length > 0 ? (
                                    paginated.map((tech, idx) => (
                                        <tr key={tech.id} className="bg-white border-b border-gray-200">
                                            <td className="px-6 py-4">{(page - 1) * perPage + idx + 1}</td>
                                            <td className="px-6 py-4">{tech.name}</td>
                                            <td className="px-6 py-4">
                                                {tech.image ? (
                                                    <img
                                                        src={tech.image}
                                                        alt={tech.name}
                                                        className="w-12 h-12 object-cover rounded-md"
                                                    />
                                                ) : (
                                                    "-"
                                                )}
                                            </td>
                                            <td className="px-6 py-4 flex items-center gap-3">
                                                <button
                                                    className="text-blue-400 bg-blue-100 hover:bg-blue-200 hover:text-blue-500 px-3 py-1 rounded-md cursor-pointer"
                                                    onClick={() => openEditModal(tech)}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    className="text-red-400 bg-red-100 hover:bg-red-200 hover:text-red-500 px-3 py-1 rounded-md cursor-pointer"
                                                    onClick={() => handleDelete(tech)}
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

            <TechnologyModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={modalMode === "create" ? "Create Technology" : "Edit Technology"}
                onSubmit={handleModalSubmit}
                initialData={selectedTechnology || {}}
                mode={modalMode}
            />
        </div>
    );
}

function TechnologyModal({ isOpen, onClose, title, onSubmit, initialData = {}, mode }) {
    const [formData, setFormData] = useState({
        name: "",
        image: null
    });
    const [imagePreview, setImagePreview] = useState(null);

    useEffect(() => {
        if (mode === "edit" && initialData) {
            setFormData({
                name: initialData.name || "",
                image: null
            });
            setImagePreview(initialData.image || null);
        } else {
            setFormData({ name: "", image: null });
            setImagePreview(null);
        }
    }, [initialData, mode]);

    const handleChange = (name, value) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData((prev) => ({ ...prev, image: file }));

            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const submitData = new FormData();
            submitData.append('name', formData.name);
            if (formData.image) {
                submitData.append('image', formData.image);
            }

            await onSubmit(submitData);
            Swal.fire("Success", `${title} success!`, "success");
            onClose();
        } catch (err) {
            Swal.fire("Error", err.response?.data?.error || err.message, "error");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50 px-5">
            <div className="bg-white rounded-xl p-6 w-full max-w-md">
                <h2 className="text-xl font-semibold mb-4">{title}</h2>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="flex flex-col">
                        <label className="text-sm mb-1">Technology Name</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => handleChange("name", e.target.value)}
                            className="border border-gray-300 rounded-md px-3 py-2 outline-none"
                            required
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="text-sm mb-1">Technology Image</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="border border-gray-300 rounded-md px-3 py-2 outline-none cursor-pointer"
                            required={mode === "create"}
                        />
                        {imagePreview && (
                            <div className="mt-2">
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    className="w-20 h-20 object-cover rounded-md border border-gray-200"
                                />
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end gap-2 mt-2">
                        <button
                            type="button"
                            className="px-4 py-2 rounded-md border border-gray-200 cursor-pointer"
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 rounded-md bg-black text-white hover:bg-black/80 cursor-pointer"
                        >
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}