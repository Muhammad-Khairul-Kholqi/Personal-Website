"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Search } from "lucide-react";
import Swal from "sweetalert2";
import { GetContact, CreateContact, UpdateContact, DeleteContact } from "@/app/api/contactApi";
import Pagination from "@/app/components/molecules/pagination";
import DataModal from "@/app/components/modals/dataModal";
import * as Icons from "lucide-react"

console.log(Object.keys(Icons))

export default function ContactsPage() {    
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState("create"); 
    const [selectedContact, setSelectedContact] = useState(null);

    const router = useRouter();
    const pathname = usePathname();
    const perPage = 5;

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            const data = await GetContact();
            setContacts(data);
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

    const filtered = contacts.filter((contact) =>
        contact.title.toLowerCase().includes(search.toLowerCase())
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
        setSelectedContact(null);
        setIsModalOpen(true);
    };

    const openEditModal = (contact) => {
        setModalMode("edit");
        setSelectedContact(contact);
        setIsModalOpen(true);
    };

    const handleModalSubmit = async (formData) => {
        if (modalMode === "create") {
            const newContact = await CreateContact(formData);
            setContacts((prev) => [newContact, ...prev]);
        } else if (modalMode === "edit") {
            const updatedContact = await UpdateContact(selectedContact.id, formData);
            setContacts((prev) =>
                prev.map((s) => (s.id === selectedContact.id ? updatedContact : s))
            );
        }
    };

    const handleDelete = async (contact) => {
        const confirm = await Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
        });
        if (confirm.isConfirmed) {
            await DeleteContact(contact.id);
            setContacts((prev) => prev.filter((s) => s.id !== contact.id));
            Swal.fire("Deleted!", "Your contact has been deleted.", "success");
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
                            placeholder="Search contact..."
                            className="w-full outline-none"
                            value={search}
                            onChange={(e) => handleSearchChange(e.target.value)}
                        />
                    </div>
                    <button
                        className="bg-black hover:bg-black/80 text-white px-5 py-2 rounded-md cursor-pointer transition-colors w-full sm:max-w-[15%]"
                        onClick={openCreateModal}
                    >
                        Add contact
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
                                    <th className="px-6 py-3">Icon</th>
                                    <th className="px-6 py-3">Title</th>
                                    <th className="px-6 py-3">Link</th>
                                    <th className="px-6 py-3">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginated.length > 0 ? (
                                    paginated.map((contact, idx) => (
                                        <tr key={contact.id} className="bg-white border-b border-gray-200">
                                            <td className="px-6 py-4 align-top">{(page - 1) * perPage + idx + 1}</td>
                                            <td className="px-6 py-4 align-top">
                                                {contact.icon && Icons[contact.icon] ? (
                                                    (() => {
                                                        const IconComponent = Icons[contact.icon];
                                                        return (
                                                            <span className="text-gray-600">
                                                                <IconComponent size={18} />
                                                            </span>
                                                        );
                                                    })()
                                                ) : null}
                                            </td>
                                            <td className="px-6 py-4 align-top">{contact.title}</td>
                                            <td className="px-6 py-4 align-top max-w-[300px]">
                                                <div className="max-h-[120px] overflow-y-auto pr-2 scroll-thin">{contact.link}</div>
                                            </td>
                                            <td className="px-6 py-4 align-top flex items-center gap-3">
                                                <button
                                                    className="text-blue-400 bg-blue-100 hover:bg-blue-200 hover:text-blue-500 px-3 py-1 rounded-md cursor-pointer"
                                                    onClick={() => openEditModal(contact)}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    className="text-red-400 bg-red-100 hover:bg-red-200 hover:text-red-500 px-3 py-1 rounded-md cursor-pointer"
                                                    onClick={() => handleDelete(contact)}
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
                title={modalMode === "create" ? "Create Contact" : "Edit Contact"}
                fields={[
                    { name: "title", label: "Title", required: true },
                    { name: "link", label: "Link", required: true },
                    { name: "icon", label: "Icon", required: true },
                ]}
                onSubmit={handleModalSubmit}
                initialData={selectedContact || {}}
            />
        </div>
    );
}
