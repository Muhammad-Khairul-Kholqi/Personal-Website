import { Home, Leaf, PencilLine, Package, LayoutGrid, Send } from "lucide-react";
import LinkItem from "@/app/components/atoms/linkItem";

export default function LinkLists() {
    return (
        <div className="space-y-2 mt-5">
            <LinkItem icon={Home} label="Home" url="/" />
            <LinkItem icon={Leaf} label="About" url="/profile" />
            <LinkItem icon={PencilLine} label="Blogs" url="/projects" />
            <LinkItem icon={Package} label="Projects" url="/" />
            <LinkItem icon={LayoutGrid} label="Dashboard" url="/profile" />
            <LinkItem icon={Send} label="Contacts" url="/projects" />
        </div>
    );
}