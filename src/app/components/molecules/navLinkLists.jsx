'use client'

import { useState } from "react";
import { Menu, X, ChevronDown, ChevronUp } from "lucide-react";
import NavLinkItem from "@/app/components/atoms/navLinkItem";
import DropdownItem from "@/app/components/atoms/dropdownItem";

export default function NavLinkLists() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [openDropdown, setOpenDropdown] = useState(null); 

    const portfolioItems = [
        { link: "/pages/private/cms/profile", content: "Profile" },
        { link: "/pages/private/cms/services", content: "Services" },
        { link: "/pages/private/cms/soft-skills", content: "Soft Skills" },
        { link: "/pages/private/cms/careers", content: "Careers" },
    ];

    const educationItems = [
        { link: "/pages/private/cms/educations", content: "Educations" },
        { link: "/pages/private/cms/technology", content: "Technology" },
        { link: "/pages/private/cms/certificates", content: "Certificates" },
    ];

    const contentItems = [
        { link: "/pages/private/cms/blogs", content: "Blogs" },
        { link: "/pages/private/cms/projects", content: "Projects" },
    ];

    const toggleDropdown = (name) => {
        setOpenDropdown(openDropdown === name ? null : name);
    };

    return (
        <>
            <div className="hidden md:flex items-center gap-6">
                <NavLinkItem link="/pages/private/cms/dashboard" content="Dashboard" />
                <NavLinkItem link="/pages/private/cms/contact" content="Contact" />
                <DropdownItem title="Portfolio" items={portfolioItems} />
                <DropdownItem title="Education" items={educationItems} />
                <DropdownItem title="Content" items={contentItems} />
            </div>

            <div className="md:hidden flex items-center justify-between w-full">
                <span className="font-semibold">CMS Dashboard</span>
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="cursor-pointer"
                >
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {isMobileMenuOpen && (
                <div className="md:hidden absolute top-[43px] left-0 right-0 bg-white border-b border-gray-200 shadow-lg rounded-b-xl">
                    <div className="flex flex-col p-4 space-y-4">
                        <NavLinkItem
                            link="/pages/private/cms/dashboard"
                            content="Dashboard"
                            className="py-2"
                        />

                        <div className="border-t border-gray-200 pt-4">
                            <NavLinkItem
                                link="/pages/private/cms/contact"
                                content="Contact"
                                className="py-2"
                            />
                        </div>

                        <div className="border-t border-gray-200 pt-4">
                            <button
                                onClick={() => toggleDropdown("portfolio")}
                                className="flex items-center justify-between w-full font-medium"
                            >
                                Portfolio
                                {openDropdown === "portfolio" ? (
                                    <ChevronUp size={18} />
                                ) : (
                                    <ChevronDown size={18} />
                                )}
                            </button>
                            {openDropdown === "portfolio" && (
                                <div className="pl-4 mt-2 space-y-2">
                                    {portfolioItems.map((item, index) => (
                                        <NavLinkItem
                                            key={index}
                                            link={item.link}
                                            content={item.content}
                                            className="block py-1 text-sm"
                                        />
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="border-t border-gray-200 pt-4">
                            <button
                                onClick={() => toggleDropdown("education")}
                                className="flex items-center justify-between w-full font-medium"
                            >
                                Education
                                {openDropdown === "education" ? (
                                    <ChevronUp size={18} />
                                ) : (
                                    <ChevronDown size={18} />
                                )}
                            </button>
                            {openDropdown === "education" && (
                                <div className="pl-4 mt-2 space-y-2">
                                    {educationItems.map((item, index) => (
                                        <NavLinkItem
                                            key={index}
                                            link={item.link}
                                            content={item.content}
                                            className="block py-1 text-sm"
                                        />
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="border-t border-gray-200 pt-4">
                            <button
                                onClick={() => toggleDropdown("content")}
                                className="flex items-center justify-between w-full font-medium"
                            >
                                Content
                                {openDropdown === "content" ? (
                                    <ChevronUp size={18} />
                                ) : (
                                    <ChevronDown size={18} />
                                )}
                            </button>
                            {openDropdown === "content" && (
                                <div className="pl-4 mt-2 space-y-2">
                                    {contentItems.map((item, index) => (
                                        <NavLinkItem
                                            key={index}
                                            link={item.link}
                                            content={item.content}
                                            className="block py-1 text-sm"
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
