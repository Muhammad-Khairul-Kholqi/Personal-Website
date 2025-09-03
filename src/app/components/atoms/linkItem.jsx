"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function LinkItem({ icon: Icon, label, url, onLinkClick }) {
    const pathname = usePathname();
    const isActive = pathname === url;
    const handleClick = () => {
        if (onLinkClick) {
            onLinkClick();
        }
    };

    return (
        <Link
            href={url}
            className={`flex items-center gap-4 w-full px-4 py-2 rounded-md group duration-300
                ${isActive ? "bg-gray-100" : "hover:bg-gray-100"}
            `}
            onClick={handleClick}
        >
            <Icon className={`w-4 h-4 duration-300 ${isActive ? "" : "group-hover:rotate-12"}`} />
            <span className={`duration-300 ${isActive ? "" : "group-hover:translate-x-1"}`}>
                {label}
            </span>
        </Link>
    );
}
