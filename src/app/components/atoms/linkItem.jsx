import Link from "next/link";

export default function LinkItem({ icon: Icon, label, url }) {
    return (
        <Link
            href={url}
            className="flex items-center gap-4 w-full hover:bg-gray-100 px-4 py-2 rounded-md group"
        >
            <Icon className="w-4 h-4 group-hover:rotate-12 duration-300" />
            <span className="group-hover:translate-x-1 duration-300">{label}</span>
        </Link>
    );
}