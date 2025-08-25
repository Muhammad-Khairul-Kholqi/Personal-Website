"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

export default function NavLinkItem({ link, content, className = "" }) {
    const pathname = usePathname()

    const isActive = pathname === link

    return (
        <Link
            href={link}
            className={`transition-colors ${isActive ? "text-blue-600 font-semibold" : "hover:text-blue-600"
                } ${className}`}
        >
            {content}
        </Link>
    )
}
