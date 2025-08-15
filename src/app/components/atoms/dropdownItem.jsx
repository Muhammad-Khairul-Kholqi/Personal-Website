'use client'

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import NavLinkItem from "@/app/components/atoms/navLinkItem";

export default function DropdownItem({ title, items }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-1 hover:text-blue-600 transition-colors cursor-pointer"
            >
                {title}
                {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-md shadow-lg min-w-[150px] z-10">
                    {items.map((item, index) => (
                        <NavLinkItem
                            key={index}
                            link={item.link}
                            content={item.content}
                            className="block px-4 py-2 hover:bg-gray-50"
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

