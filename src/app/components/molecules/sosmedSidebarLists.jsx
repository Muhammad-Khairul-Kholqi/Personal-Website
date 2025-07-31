import SosmedSidebarItem from "@/app/components/atoms/sosmedSidebarItem"
import { Linkedin, Instagram, Github, Coffee } from "lucide-react"

export default function SosmedSidebarLists() {
    return (
        <div className="flex items-center justify-center gap-7 mt-5">
            <SosmedSidebarItem icon={Linkedin} label="Linkedin" url="https://www.linkedin.com/in/muhammad-khairul-kholqi-9b9413326/" />
            <SosmedSidebarItem icon={Instagram} label="Instagram" url="https://www.instagram.com/khairul.kh_/" />
            <SosmedSidebarItem icon={Github} label="Github" url="https://github.com/Muhammad-Khairul-Kholqi/" />
            <SosmedSidebarItem icon={Coffee} label="Saweria" url="/" />
        </div>
    )
}