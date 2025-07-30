// components/atoms/LinkItem.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function LinkItem({ icon: Icon, label, url }) {
    const pathname = usePathname();
    const isActive = pathname === url;

    return (
        <Link
            href={url}
            className={`flex items-center gap-4 w-full px-4 py-2 rounded-md group duration-300
                ${isActive ? "bg-gray-100" : "hover:bg-gray-100"}
            `}
        >
            <Icon className={`w-4 h-4 duration-300 ${isActive ? "" : "group-hover:rotate-12"}`} />
            <span className={`duration-300 ${isActive ? "" : "group-hover:translate-x-1"}`}>
                {label}
            </span>
        </Link>
    );
}
