import { Rocket } from "lucide-react"
import Link from "next/link"

export default function CardContact() {
    return (
        <div className="p-5 w-full border border-[#525252] border-dashed mt-5 rounded-lg">
            <div className="flex items-center gap-3">
                <Rocket />
                <span className="font-semibold text-xl">Lets Work Together!</span>
            </div>  
            <p className="mt-2">I'm open for freelance projects, feel free to email me to see how can we collaborate.</p>
            <Link href="/">
                <div className="flex">
                    <div className="bg-[#525252] hover:bg-[#525252]/80 text-white px-5 py-3 rounded-md text-center mt-4">
                        Contact Me
                    </div>
                </div>
            </Link>
        </div>
    )
}