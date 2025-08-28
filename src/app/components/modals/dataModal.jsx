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
    const [fileData, setFileData] = useState({}); 
    const [filePreviews, setFilePreviews] = useState({}); 

    useEffect(() => {
        setFormData(initialData);
        if (isOpen) {
            setFileData({});
            const newPreviews = {};
            fields.forEach(field => {
                if (field.type === "file" && initialData[field.name]) {
                    newPreviews[field.name] = initialData[field.name];
                }
            });
            setFilePreviews(newPreviews);
        }
    }, [initialData, isOpen, fields]);

    const handleChange = (name, value) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (name, file) => {
        setFileData((prev) => ({ ...prev, [name]: file }));

        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFilePreviews((prev) => ({ ...prev, [name]: reader.result }));
            };
            reader.readAsDataURL(file);
        } else {
            setFilePreviews((prev) => ({ ...prev, [name]: null }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const hasFileFields = fields.some(field => field.type === "file");

            let submitData;
            if (hasFileFields) {
                submitData = new FormData();

                Object.entries(formData).forEach(([key, value]) => {
                    submitData.append(key, value || "");
                });

                Object.entries(fileData).forEach(([key, file]) => {
                    if (file) {
                        submitData.append(key, file);
                    }
                });
            } else {
                submitData = formData;
            }

            await onSubmit(submitData);
            Swal.fire("Success", `${title} success!`, "success");
            onClose();
        } catch (err) {
            Swal.fire("Error", err.response?.data?.error || err.message, "error");
        }
    };

    const renderField = (field) => {
        if (field.type === "file") {
            return (
                <div key={field.name} className="flex flex-col">
                    <label className="text-sm mb-1">{field.label}</label>
                    <input
                        type="file"
                        accept={field.accept || "*/*"}
                        onChange={(e) => handleFileChange(field.name, e.target.files[0])}
                        className="border border-gray-300 rounded-md px-3 py-2 outline-none cursor-pointer"
                        required={field.required && !initialData[field.name]}
                    />
                    {filePreviews[field.name] && (
                        <div className="mt-2">
                            <img
                                src={filePreviews[field.name]}
                                alt="Preview"
                                className="w-20 h-20 object-cover rounded-md border border-gray-200"
                            />
                        </div>
                    )}
                </div>
            );
        }

        if (field.type === "textarea") {
            return (
                <div key={field.name} className="flex flex-col">
                    <label className="text-sm mb-1">{field.label}</label>
                    <textarea
                        value={formData[field.name] || ""}
                        onChange={(e) => handleChange(field.name, e.target.value)}
                        placeholder={field.placeholder || ""}
                        className="border border-gray-300 rounded-md px-3 py-2 outline-none min-h-[100px]"
                        required={field.required || false}
                    />
                </div>
            );
        }

        return (
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
        );
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50 px-5">
            <div className="bg-white rounded-xl p-6 w-full max-w-md">
                <h2 className="text-xl font-semibold mb-4">{title}</h2>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    {fields.map(renderField)}
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