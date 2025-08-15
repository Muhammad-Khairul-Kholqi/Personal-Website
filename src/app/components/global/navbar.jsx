import NavLinkLists from "@/app/components/molecules/navLinkLists"

export default function Navbar() {
    return (
        <nav className="bg-white fixed z-50 top-0 left-0 right-0 border-b border-gray-200">
            <div className="flex justify-center p-5">
                <div className="w-full max-w-[1300px] relative">
                    <NavLinkLists />
                </div>
            </div>
        </nav>
    )
}
