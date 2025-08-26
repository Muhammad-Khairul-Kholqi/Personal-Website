"use client";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";

export default function DataModal({
    isOpen,
    onClose,
    title,
    fields = [],
    onSubmit,
    initialData = {}
}) {
    const [formData, setFormData] = useState({});

    useEffect(() => {
        setFormData(initialData);
    }, [initialData]);

    const handleChange = (name, value) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await onSubmit(formData);
            Swal.fire("Success", `${title} success!`, "success");
            onClose();
        } catch (err) {
            Swal.fire("Error", err.response?.data?.error || err.message, "error");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md">
                <h2 className="text-xl font-semibold mb-4">{title}</h2>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    {fields.map((field) => (
                        <div key={field.name} className="flex flex-col">
                            <label className="text-sm mb-1">{field.label}</label>
                            <input
                                type={field.type || "text"}
                                value={formData[field.name] || ""}
                                onChange={(e) => handleChange(field.name, e.target.value)}
                                placeholder={field.placeholder || ""}
                                className="border border-gray-300 rounded-md px-3 py-2 outline-none"
                                required={field.required || false}
                            />
                        </div>
                    ))}
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
