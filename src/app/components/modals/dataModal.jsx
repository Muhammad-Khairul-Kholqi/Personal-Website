"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { X, ChevronDown, ChevronUp, Star, Upload, Trash2 } from "lucide-react";
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

    const [projectImages, setProjectImages] = useState([]);
    const [primaryImageIndex, setPrimaryImageIndex] = useState(0);

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

    const formatDateForInput = (dateStr) => {
        if (!dateStr) return "";
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return "";
        return date.toISOString().split('T')[0];
    };

    useEffect(() => {
        if (isOpen) {
            const processedData = { ...initialData };

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

            if (initialData.images && Array.isArray(initialData.images)) {
                setProjectImages(initialData.images);
                const primaryIndex = initialData.images.findIndex(img => img.is_primary);
                setPrimaryImageIndex(primaryIndex >= 0 ? primaryIndex : 0);
            } else {
                setProjectImages([]);
                setPrimaryImageIndex(0);
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

    const handleMultipleImageUpload = (files) => {
        if (!isReadOnly && files.length > 0) {
            const fileArray = Array.from(files);
            const maxFiles = fields.find(f => f.type === "multiple_image_upload")?.maxFiles || 5;

            if (projectImages.length + fileArray.length > maxFiles) {
                Swal.fire("Error", `Maximum ${maxFiles} images allowed`, "error");
                return;
            }

            fileArray.forEach((file) => {
                if (file.type.startsWith('image/')) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        setProjectImages(prev => [...prev, {
                            file: file,
                            preview: reader.result,
                            is_new: true,
                            is_primary: prev.length === 0 
                        }]);
                    };
                    reader.readAsDataURL(file);
                }
            });
        }
    };

    const handleRemoveImage = (index) => {
        if (!isReadOnly) {
            setProjectImages(prev => {
                const newImages = prev.filter((_, i) => i !== index);
                if (primaryImageIndex === index && newImages.length > 0) {
                    setPrimaryImageIndex(0);
                    newImages[0].is_primary = true;
                } else if (primaryImageIndex > index) {
                    setPrimaryImageIndex(prev => prev - 1);
                }
                return newImages;
            });
        }
    };

    const handleSetPrimaryImage = (index) => {
        if (!isReadOnly) {
            setPrimaryImageIndex(index);
            setProjectImages(prev =>
                prev.map((img, i) => ({
                    ...img,
                    is_primary: i === index
                }))
            );
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
            const multipleImageField = fields.find(f => f.type === "multiple_image_upload");
            if (multipleImageField?.required && projectImages.length === 0) {
                Swal.fire("Error", "At least one image is required", "error");
                return;
            }

            const hasFileFields = fields.some(field =>
                field.type === "file" || field.type === "multiple_image_upload"
            );

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

                if (projectImages.length > 0) {
                    const imagesData = projectImages.map((img, index) => ({
                        image_url: img.file ? null : img.image_url,
                        image_order: index + 1,
                        is_primary: img.is_primary || index === primaryImageIndex
                    }));

                    submitData.append('images_metadata', JSON.stringify(imagesData));

                    projectImages.forEach((img, index) => {
                        if (img.file) {
                            submitData.append('images', img.file);
                        }
                    });
                }
            } else {
                const imagesData = projectImages.map((img, index) => ({
                    image_url: img.image_url,
                    image_order: index + 1,
                    is_primary: img.is_primary || index === primaryImageIndex
                }));

                submitData = {
                    ...formData,
                    technology_ids: selectedTechnologies.map((tech) => tech.id),
                    images: imagesData
                };
            }

            await onSubmit(submitData);
            Swal.fire("Success", `${title} success!`, "success");
            onClose();

            setSelectedTechnologies([]);
            setFormData({});
            setFileData({});
            setFilePreviews({});
            setProjectImages([]);
            setPrimaryImageIndex(0);
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

        if (field.type === "multiple_image_upload") {
            return (
                <div key={field.name} className="flex flex-col">
                    <label className="text-sm mb-1 font-medium">{field.label}</label>

                    {!isFieldReadOnly && (
                        <div className="mb-4">
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-gray-400 transition-colors">
                                <input
                                    type="file"
                                    accept={field.accept || "image/*"}
                                    multiple
                                    onChange={(e) => handleMultipleImageUpload(e.target.files)}
                                    className="hidden"
                                    id="multiple-image-upload"
                                />
                                <label htmlFor="multiple-image-upload" className="flex flex-col items-center cursor-pointer">
                                    <Upload className="w-8 h-8 text-gray-400 mb-2" />
                                    <span className="text-sm text-gray-600">
                                        Click to upload images (max {field.maxFiles || 5})
                                    </span>
                                    <span className="text-xs text-gray-400 mt-1">
                                        PNG, JPG, JPEG up to 10MB each
                                    </span>
                                </label>
                            </div>
                        </div>
                    )}

                    {projectImages.length > 0 && (
                        <div className="space-y-4">
                            <h4 className="text-sm font-medium text-gray-700">
                                Uploaded Images ({projectImages.length})
                            </h4>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {projectImages.map((img, index) => (
                                    <div key={index} className="relative group">
                                        <div className={`relative border-2 rounded-lg overflow-hidden ${img.is_primary || index === primaryImageIndex
                                                ? 'border-blue-500'
                                                : 'border-gray-200'
                                            }`}>
                                            <img
                                                src={img.preview || img.image_url}
                                                alt={`Image ${index + 1}`}
                                                className="w-full h-32 object-cover"
                                            />

                                            {(img.is_primary || index === primaryImageIndex) && (
                                                <div className="absolute top-2 left-2 bg-blue-500 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
                                                    <Star className="w-3 h-3 fill-current" />
                                                    Primary
                                                </div>
                                            )}

                                            {!isFieldReadOnly && (
                                                <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                                                    {!(img.is_primary || index === primaryImageIndex) && (
                                                        <button
                                                            type="button"
                                                            onClick={() => handleSetPrimaryImage(index)}
                                                            className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition-colors"
                                                            title="Set as primary"
                                                        >
                                                            <Star className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveImage(index)}
                                                        className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                                                        title="Remove image"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            )}
                                        </div>

                                        <div className="mt-2 text-xs text-gray-500 text-center">
                                            Image {index + 1}
                                            {(img.is_primary || index === primaryImageIndex) && " (Primary)"}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {isFieldReadOnly && projectImages.length === 0 && (
                        <div className="p-4 border border-gray-200 rounded-md bg-gray-50 text-gray-500 text-center">
                            No images available
                        </div>
                    )}
                </div>
            );
        }

        if (field.type === "multiple_image_display") {
            return (
                <div key={field.name} className="flex flex-col">
                    <label className="text-sm mb-1 font-medium">{field.label}</label>
                    {projectImages.length > 0 ? (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {projectImages.map((img, index) => (
                                    <div key={index} className={`relative border-2 rounded-lg overflow-hidden ${img.is_primary ? 'border-blue-500' : 'border-gray-200'
                                        }`}>
                                        <img
                                            src={img.image_url}
                                            alt={`Image ${index + 1}`}
                                            className="w-full h-32 object-cover"
                                        />

                                        {img.is_primary && (
                                            <div className="absolute top-2 left-2 bg-blue-500 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
                                                <Star className="w-3 h-3 fill-current" />
                                                Primary
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="p-4 border border-gray-200 rounded-md bg-gray-50 text-gray-500 text-center">
                            No images available
                        </div>
                    )}
                </div>
            );
        }

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

        if (field.type === "select") {
            const selectedOption = field.options.find(opt => opt.value === formData[field.name]);

            return (
                <div key={field.name} className="flex flex-col">
                    <label className="text-sm mb-1 font-medium">{field.label}</label>

                    {isFieldReadOnly ? (
                        <div className="border border-gray-200 rounded-md px-3 py-2 bg-gray-50 text-gray-700">
                            {selectedOption?.label || "-"}
                        </div>
                    ) : (
                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => setIsDropdownOpen(field.name)}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 text-left flex items-center justify-between outline-none hover:border-gray-400 cursor-pointer"
                            >
                                <span className={selectedOption ? "text-gray-700" : "text-gray-500"}>
                                    {selectedOption ? selectedOption.label : `Select ${field.label}`}
                                </span>
                                {isDropdownOpen === field.name ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                            </button>

                            {isDropdownOpen === field.name && (
                                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg p-3">
                                    <div className="max-h-40 overflow-y-auto">
                                        {field.options.map((opt) => (
                                            <button
                                                key={opt.value}
                                                type="button"
                                                onClick={() => {
                                                    handleChange(field.name, opt.value);
                                                    setIsDropdownOpen(null);
                                                }}
                                                className="w-full px-3 py-2 text-left hover:bg-gray-100 flex items-center gap-2 border-b border-gray-100 last:border-b-0 cursor-pointer"
                                            >
                                                {opt.image && (
                                                    <img
                                                        src={opt.image}
                                                        alt={opt.label}
                                                        className="w-5 h-5 object-cover rounded-full"
                                                    />
                                                )}
                                                <span>{opt.label}</span>
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