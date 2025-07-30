import SosmedSidebarItem from "@/app/components/atoms/sosmedSidebarItem"
import { Linkedin, Instagram, Github, Coffee } from "lucide-react"

export default function SosmedSidebarLists() {
    return (
        <div className="flex items-center justify-center gap-7 mt-5">
            <SosmedSidebarItem icon={Linkedin} label="Linkedin" url="/" />
            <SosmedSidebarItem icon={Instagram} label="Instagram" url="/" />
            <SosmedSidebarItem icon={Github} label="Github" url="/" />
            <SosmedSidebarItem icon={Coffee} label="Saweria" url="/" />
        </div>
    )
}