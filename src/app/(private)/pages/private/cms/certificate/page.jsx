"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Search } from "lucide-react";
import Swal from "sweetalert2";
import { GetCertificates, CreateCertificate, UpdateCertificate, DeleteCertificate } from "@/app/api/certificateApi";
import Pagination from "@/app/components/molecules/pagination";
import DataModal from "@/app/components/modals/dataModal";

export default function CertificatePage() {
    const [certificates, setCertificates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState("create");
    const [selectedCertificates, setSelectedCertificates] = useState(null);

    const router = useRouter();
    const pathname = usePathname();
    const perPage = 5;

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            const data = await GetCertificates();
            setCertificates(data);
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

    const filtered = certificates.filter((certificate) =>
        certificate.title.toLowerCase().includes(search.toLowerCase())
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
        setSelectedCertificates(null);
        setIsModalOpen(true);
    };

    const openEditModal = (certificate) => {
        setModalMode("edit");
        setSelectedCertificates(certificate);
        setIsModalOpen(true);
    };

    const handleModalSubmit = async (formData) => {
        if (modalMode === "create") {
            const newCertificate = await CreateCertificate(formData);
            setCertificates((prev) => [newCertificate, ...prev]);
        } else if (modalMode === "edit") {
            const updatedCertificate = await UpdateCertificate(selectedCertificates.id, formData);
            setCertificates((prev) =>
                prev.map((t) => (t.id === selectedCertificates.id ? updatedCertificate : t))
            );
        }
    };

    const handleDelete = async (certificate) => {
        const confirm = await Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
        });
        if (confirm.isConfirmed) {
            await DeleteCertificate(certificate.id);
            setCertificates((prev) => prev.filter((t) => t.id !== certificate.id));
            Swal.fire("Deleted!", "Your certificate has been deleted.", "success");
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
                            placeholder="Search certificate..."
                            className="w-full outline-none"
                            value={search}
                            onChange={(e) => handleSearchChange(e.target.value)}
                        />
                    </div>
                    <button
                        className="bg-black hover:bg-black/80 text-white px-5 py-2 rounded-md cursor-pointer transition-colors w-full sm:max-w-[15%]"
                        onClick={openCreateModal}
                    >
                        Add Certificate
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
                                    <th className="px-6 py-3">Certificate Name</th>
                                    <th className="px-6 py-3">Company Name</th>
                                    <th className="px-6 py-3">Receipt Date</th>
                                    <th className="px-6 py-3">Image</th>
                                    <th className="px-6 py-3">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginated.length > 0 ? (
                                    paginated.map((certificate, idx) => (
                                        <tr key={certificate.id} className="bg-white border-b border-gray-200">
                                            <td className="px-6 py-4">{(page - 1) * perPage + idx + 1}</td>
                                            <td className="px-6 py-4">{certificate.title}</td>
                                            <td className="px-6 py-4">{certificate.company}</td>
                                            <td className="px-6 py-4">{certificate.time}</td>
                                            <td className="px-6 py-4">
                                                {certificate.image ? (
                                                    <img
                                                        src={certificate.image}
                                                        alt={certificate.title}
                                                        className="w-12 h-12 object-cover rounded-md"
                                                    />
                                                ) : (
                                                    "-"
                                                )}
                                            </td>
                                            <td className="px-6 py-4 flex items-center gap-3">
                                                <button
                                                    className="text-blue-400 bg-blue-100 hover:bg-blue-200 hover:text-blue-500 px-3 py-1 rounded-md cursor-pointer"
                                                    onClick={() => openEditModal(certificate)}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    className="text-red-400 bg-red-100 hover:bg-red-200 hover:text-red-500 px-3 py-1 rounded-md cursor-pointer"
                                                    onClick={() => handleDelete(certificate)}
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
                title={modalMode === "create" ? "Create Certificate" : "Edit Certificate"}
                fields={[
                    {
                        name: "title",
                        label: "Certificate Name",
                        type: "text",
                        placeholder: "Enter certificate name",
                        required: true
                    },
                    {
                        name: "company",
                        label: "Company Name",
                        type: "text",
                        placeholder: "Enter company name",
                        required: true
                    },
                    {
                        name: "time",
                        label: "Receipt Date",
                        type: "date",
                        placeholder: "Enter receipt date",
                        required: true
                    },
                    {
                        name: "image",
                        label: "Certificate Image",
                        type: "file",
                        accept: "image/*",
                        required: modalMode === "create"
                    }
                ]}
                onSubmit={handleModalSubmit}
                initialData={selectedCertificates || {}}
            />
        </div>
    );
}