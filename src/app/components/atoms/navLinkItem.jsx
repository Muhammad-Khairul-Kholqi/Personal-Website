import Link from "next/link";

export default function NavLinkItem({ link, content, className = "" }) {
    return (
        <Link
            href={link}
            className={`hover:text-blue-600 transition-colors ${className}`}
        >
            {content}
        </Link>
    )
}