"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Search } from "lucide-react";
import Swal from "sweetalert2";
import { GetSoftSkills, CreateSoftSkill, UpdateSoftSkill, DeleteSoftSkill } from "@/app/api/softSkillApi";
import Pagination from "@/app/components/molecules/pagination";
import DataModal from "@/app/components/modals/dataModal";

export default function SoftSkillPage() {    
    const [softSkills, setSoftSkill] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState("create"); 
    const [selectedSoftSkill, setSelectedSoftSkill] = useState(null);

    const router = useRouter();
    const pathname = usePathname();
    const perPage = 5;

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            const data = await GetSoftSkills();
            setSoftSkill(data);
            setLoading(false);
        }
        fetchData();
    }, []);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const params = new URLSearchParams(window.location.search);
            setPage(parseInt(params.get("page") || "1", 10));
            setSearch(params.get("search") || "");
        }
    }, []);

    const filtered = softSkills.filter((softSkill) =>
        softSkill.title.toLowerCase().includes(search.toLowerCase())
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
        setSelectedSoftSkill(null);
        setIsModalOpen(true);
    };

    const openEditModal = (softSkill) => {
        setModalMode("edit");
        setSelectedSoftSkill(softSkill);
        setIsModalOpen(true);
    };

    const handleModalSubmit = async (formData) => {
        if (modalMode === "create") {
            const newSoftSkill = await CreateSoftSkill(formData);
            setSoftSkill((prev) => [newSoftSkill, ...prev]);
        } else if (modalMode === "edit") {
            const updatedSoftSkill = await UpdateSoftSkill(selectedSoftSkill.id, formData);
            setSoftSkill((prev) =>
                prev.map((s) => (s.id === selectedSoftSkill.id ? updatedSoftSkill : s))
            );
        }
    };

    const handleDelete = async (softSkill) => {
        const confirm = await Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
        });
        if (confirm.isConfirmed) {
            await DeleteSoftSkill(softSkill.id);
            setSoftSkill((prev) => prev.filter((s) => s.id !== softSkill.id));
            Swal.fire("Deleted!", "Your soft skill has been deleted.", "success");
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
                            placeholder="Search soft skill..."
                            className="w-full outline-none"
                            value={search}
                            onChange={(e) => handleSearchChange(e.target.value)}
                        />
                    </div>
                    <button
                        className="bg-black hover:bg-black/80 text-white px-5 py-2 rounded-md cursor-pointer transition-colors w-full sm:max-w-[15%]"
                        onClick={openCreateModal}
                    >
                        Add Soft Skill
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
                                    <th className="px-6 py-3">Description</th>
                                    <th className="px-6 py-3">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginated.length > 0 ? (
                                    paginated.map((softSkill, idx) => (
                                        <tr key={softSkill.id} className="bg-white border-b border-gray-200">
                                            <td className="px-6 py-4 align-top">{(page - 1) * perPage + idx + 1}</td>
                                            <td className="px-6 py-4 align-top">{softSkill.title}</td>
                                            <td className="px-6 py-4 align-top max-w-[300px]">
                                                <div className="max-h-[120px] overflow-y-auto pr-2 scroll-thin">{softSkill.description}</div>
                                            </td>
                                            <td className="px-6 py-4 align-top flex items-center gap-3">
                                                <button
                                                    className="text-blue-400 bg-blue-100 hover:bg-blue-200 hover:text-blue-500 px-3 py-1 rounded-md cursor-pointer"
                                                    onClick={() => openEditModal(softSkill)}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    className="text-red-400 bg-red-100 hover:bg-red-200 hover:text-red-500 px-3 py-1 rounded-md cursor-pointer"
                                                    onClick={() => handleDelete(softSkill)}
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="text-center py-5 text-gray-500">
                                            No data found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>

                {!loading && (
                    <Pagination page={page} totalPages={totalPages} onPageChange={handlePageChange} />
                )}
            </div>

            <DataModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={modalMode === "create" ? "Create Soft Skill" : "Edit Soft Skill"}
                fields={[
                    { name: "title", label: "Title", required: true },
                    { name: "description", label: "Description", required: true },
                ]}
                onSubmit={handleModalSubmit}
                initialData={selectedSoftSkill || {}}
            />
        </div>
    );
}

