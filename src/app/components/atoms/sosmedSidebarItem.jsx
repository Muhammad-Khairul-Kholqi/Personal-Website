export default function SosmedSidebarItem({ url, icon: Icon, label }) {
    return (
        <a
            href={url}
            className="relative group hover:text-blue-600"
        >
            <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-100 text-black text-sm px-3 py-2 rounded opacity-0 group-hover:opacity-100 transition duration-200 pointer-events-none whitespace-nowrap z-20">
                {label}
            </span>

            <Icon className="w-5 h-5" />
        </a>
    );
}