"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { X, ChevronDown, ChevronUp } from "lucide-react";
import Swal from "sweetalert2";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";

export default function DataModal({
    isOpen,
    onClose,
    title,
    fields = [],
    onSubmit,
    initialData = {},
    isReadOnly = false
}) {
    const [formData, setFormData] = useState({});
    const [fileData, setFileData] = useState({});
    const [filePreviews, setFilePreviews] = useState({});
    const [selectedTechnologies, setSelectedTechnologies] = useState([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const modules = {
        toolbar: isReadOnly ? false : [
            [{ 'header': [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            [{ 'indent': '-1' }, { 'indent': '+1' }],
            ['link'],
            [{ 'align': [] }],
            ['clean']
        ],
    };

    const formats = [
        'header',
        'bold', 'italic', 'underline', 'strike',
        'list', 'bullet', 'indent',
        'link', 'align'
    ];

    // Function to convert date to input format (YYYY-MM-DD)
    const formatDateForInput = (dateStr) => {
        if (!dateStr) return "";
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return "";
        return date.toISOString().split('T')[0];
    };

    useEffect(() => {
        if (isOpen) {
            // Process initial data and convert dates for input fields
            const processedData = { ...initialData };

            // Convert date fields to proper input format
            fields.forEach(field => {
                if (field.type === "date" && initialData[field.name]) {
                    processedData[field.name] = formatDateForInput(initialData[field.name]);
                }
            });

            setFormData(processedData);
            setFileData({});

            const newPreviews = {};
            fields.forEach(field => {
                if (field.type === "file" && initialData[field.name]) {
                    newPreviews[field.name] = initialData[field.name];
                }
            });
            setFilePreviews(newPreviews);

            if (initialData.technologies && Array.isArray(initialData.technologies)) {
                setSelectedTechnologies(initialData.technologies);
            } else {
                setSelectedTechnologies([]);
            }
        }
    }, [initialData, isOpen, fields]);

    const handleChange = (name, value) => {
        if (!isReadOnly) {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleFileChange = (name, file) => {
        if (!isReadOnly) {
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
        }
    };

    const handleTechnologySelect = (technology) => {
        if (!isReadOnly) {
            const isAlreadySelected = selectedTechnologies.some(tech => tech.id === technology.id);

            if (!isAlreadySelected) {
                const updatedTechnologies = [...selectedTechnologies, technology];
                setSelectedTechnologies(updatedTechnologies);
                handleChange('technology_ids', updatedTechnologies.map(tech => tech.id));
            }

            setIsDropdownOpen(false);
        }
    };

    const handleTechnologyRemove = (technologyId) => {
        if (!isReadOnly) {
            const updatedTechnologies = selectedTechnologies.filter(tech => tech.id !== technologyId);
            setSelectedTechnologies(updatedTechnologies);
            handleChange('technology_ids', updatedTechnologies.map(tech => tech.id));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isReadOnly || !onSubmit) return;

        try {
            const hasFileFields = fields.some(field => field.type === "file");

            let submitData;
            if (hasFileFields) {
                submitData = new FormData();

                Object.entries(formData).forEach(([key, value]) => {
                    if (key !== 'technology_ids') {
                        submitData.append(key, value || "");
                    }
                });

                selectedTechnologies.forEach((tech) => {
                    submitData.append("technology_ids[]", tech.id);
                });

                Object.entries(fileData).forEach(([key, file]) => {
                    if (file) {
                        submitData.append(key, file);
                    }
                });
            } else {
                submitData = {
                    ...formData,
                    technology_ids: selectedTechnologies.map((tech) => tech.id),
                };
            }

            await onSubmit(submitData);
            Swal.fire("Success", `${title} success!`, "success");
            onClose();

            setSelectedTechnologies([]);
            setFormData({});
            setFileData({});
            setFilePreviews({});
        } catch (err) {
            Swal.fire("Error", err.response?.data?.error || err.message, "error");
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

    const renderField = (field) => {
        const fieldValue = formData[field.name] || "";
        const isFieldReadOnly = isReadOnly || field.readOnly;

        if (field.type === "wysiwyg") {
            return (
                <div key={field.name} className="flex flex-col">
                    <label className="text-sm mb-1 font-medium">{field.label}</label>
                    {isFieldReadOnly ? (
                        <div className="border border-gray-200 rounded-md p-3 bg-gray-50 min-h-[120px]">
                            <div
                                className="prose prose-sm max-w-none"
                                dangerouslySetInnerHTML={{ __html: fieldValue }}
                            />
                        </div>
                    ) : (
                        <div className="border border-gray-300 rounded-md">
                            <ReactQuill
                                value={fieldValue}
                                onChange={(value) => handleChange(field.name, value)}
                                modules={modules}
                                formats={formats}
                                placeholder={field.placeholder || ""}
                                readOnly={isFieldReadOnly}
                            />
                        </div>
                    )}
                </div>
            );
        }

        if (field.type === "multiselect") {
            const availableOptions = field.options?.filter(option =>
                !selectedTechnologies.some(selected => selected.id === option.id)
            ) || [];

            return (
                <div key={field.name} className="flex flex-col">
                    <label className="text-sm mb-1 font-medium">{field.label}</label>

                    {selectedTechnologies.length > 0 ? (
                        <div className={`flex flex-wrap gap-2 p-3 border rounded-md ${isFieldReadOnly ? 'bg-gray-50 border-gray-200' : 'bg-gray-50 border-gray-200'}`}>
                            {selectedTechnologies.map((tech) => (
                                <div
                                    key={tech.id}
                                    className="flex items-center gap-2 bg-white px-2 py-1 rounded-md border border-gray-300 text-sm"
                                >
                                    {tech.image && (
                                        <img
                                            src={tech.image}
                                            alt={tech.name}
                                            className="w-5 h-5 object-cover rounded-full"
                                        />
                                    )}
                                    <span>{tech.name}</span>
                                    {!isFieldReadOnly && (
                                        <button
                                            type="button"
                                            onClick={() => handleTechnologyRemove(tech.id)}
                                            className="text-gray-500 hover:text-gray-700 ml-1 cursor-pointer"
                                        >
                                            <X size={14} />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-3 border border-gray-200 rounded-md bg-gray-50 text-gray-500">
                            No technologies selected
                        </div>
                    )}

                    {!isFieldReadOnly && (
                        <div className="relative mt-2">
                            <button
                                type="button"
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 text-left flex items-center justify-between outline-none hover:border-gray-400 cursor-pointer"
                            >
                                <span className="text-gray-500">
                                    {availableOptions.length > 0
                                        ? "Select technologies..."
                                        : "No more technologies available"
                                    }
                                </span>
                                {isDropdownOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                            </button>

                            {isDropdownOpen && availableOptions.length > 0 && (
                                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg p-5">
                                    <div className="max-h-35 overflow-y-auto">
                                        {availableOptions.map((option) => (
                                            <button
                                                key={option.id}
                                                type="button"
                                                onClick={() => handleTechnologySelect(option)}
                                                className="w-full px-3 py-2 text-left hover:bg-gray-100 flex items-center gap-2 border-b border-gray-100 last:border-b-0 cursor-pointer"
                                            >
                                                {option.image && (
                                                    <img
                                                        src={option.image}
                                                        alt={option.name}
                                                        className="w-6 h-6 object-cover rounded-full"
                                                    />
                                                )}
                                                <span>{option.name}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            );
        }

        if (field.type === "file") {
            return (
                <div key={field.name} className="flex flex-col">
                    <label className="text-sm mb-1 font-medium">{field.label}</label>
                    {!isFieldReadOnly && (
                        <input
                            type="file"
                            accept={field.accept || "*/*"}
                            onChange={(e) => handleFileChange(field.name, e.target.files[0])}
                            className="border border-gray-300 rounded-md px-3 py-2 outline-none cursor-pointer"
                            required={field.required && !initialData[field.name]}
                        />
                    )}
                    {filePreviews[field.name] && (
                        <div className="mt-2">
                            <img
                                src={filePreviews[field.name]}
                                alt="Preview"
                                className="w-32 h-32 object-cover rounded-md border border-gray-200"
                            />
                        </div>
                    )}
                    {isFieldReadOnly && !filePreviews[field.name] && (
                        <div className="mt-2 p-3 border border-gray-200 rounded-md bg-gray-50 text-gray-500">
                            No image available
                        </div>
                    )}
                </div>
            );
        }

        if (field.type === "textarea") {
            return (
                <div key={field.name} className="flex flex-col">
                    <label className="text-sm mb-1 font-medium">{field.label}</label>
                    <textarea
                        value={fieldValue}
                        onChange={(e) => handleChange(field.name, e.target.value)}
                        placeholder={field.placeholder || ""}
                        className={`border rounded-md px-3 py-2 outline-none min-h-[100px] ${isFieldReadOnly ? 'bg-gray-50 border-gray-200 text-gray-700' : 'border-gray-300'
                            }`}
                        required={field.required || false}
                        readOnly={isFieldReadOnly}
                    />
                </div>
            );
        }

        if (field.type === "date") {
            return (
                <div key={field.name} className="flex flex-col">
                    <label className="text-sm mb-1 font-medium">{field.label}</label>
                    {isFieldReadOnly ? (
                        <div className="border border-gray-200 rounded-md px-3 py-2 bg-gray-50 text-gray-700">
                            {formatDate(fieldValue)}
                        </div>
                    ) : (
                        <input
                            type="date"
                            value={fieldValue}
                            onChange={(e) => handleChange(field.name, e.target.value)}
                            placeholder={field.placeholder || ""}
                            className="border border-gray-300 rounded-md px-3 py-2 outline-none"
                            required={field.required || false}
                        />
                    )}
                </div>
            );
        }

        return (
            <div key={field.name} className="flex flex-col">
                <label className="text-sm mb-1 font-medium">{field.label}</label>
                <input
                    type={field.type || "text"}
                    value={fieldValue}
                    onChange={(e) => handleChange(field.name, e.target.value)}
                    placeholder={field.placeholder || ""}
                    className={`border rounded-md px-3 py-2 outline-none ${isFieldReadOnly ? 'bg-gray-50 border-gray-200 text-gray-700' : 'border-gray-300'
                        }`}
                    required={field.required || false}
                    readOnly={isFieldReadOnly}
                />
            </div>
        );
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50 px-5">
            <div className="bg-white rounded-xl p-5 w-full max-w-4xl max-h-[90vh] overflow-hidden">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">{title}</h2>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 cursor-pointer"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-2">
                        {fields.map(renderField)}
                        <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-gray-200">
                            <button
                                type="button"
                                className="px-4 py-2 rounded-md border border-gray-200 cursor-pointer hover:bg-gray-50"
                                onClick={onClose}
                            >
                                {isReadOnly ? "Close" : "Cancel"}
                            </button>
                            {!isReadOnly && onSubmit && (
                                <button
                                    type="submit"
                                    className="px-4 py-2 rounded-md bg-black text-white hover:bg-black/80 cursor-pointer"
                                >
                                    Submit
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}