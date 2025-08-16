import Navbar from "@/app/components/global/navbar"

export default function CmsLayout({ children }) {
    return (
        <div>
            <Navbar />
            <div className="flex justify-center mt-[65px] p-5">
                <div className="w-full max-w-[1300px]">
                    {children}
                </div>
            </div>
        </div>
    )
}