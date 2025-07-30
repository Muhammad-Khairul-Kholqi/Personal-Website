"use client";

import { Home, Leaf, PencilLine, Package, LayoutGrid, Send, ScrollText } from "lucide-react";
import LinkItem from "@/app/components/atoms/linkItem";

export default function LinkLists() {
    return (
        <div className="space-y-2 mt-5">
            <LinkItem icon={Home} label="Home" url="/" />
            <LinkItem icon={Leaf} label="About" url="/pages/about" />
            <LinkItem icon={PencilLine} label="Blogs" url="/pages/blogs" />
            <LinkItem icon={Package} label="Projects" url="/pages/projects" />
            <LinkItem icon={LayoutGrid} label="Dashboard" url="/profile" />
            <LinkItem icon={ScrollText} label="Certificates" url="/pages/about" />
            <LinkItem icon={Send} label="Contacts" url="/projects" />
        </div>
    );
}