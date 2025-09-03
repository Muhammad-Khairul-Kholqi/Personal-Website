"use client";

import { Home, Leaf, PencilLine, Package, Send, ScrollText } from "lucide-react";
import LinkItem from "@/app/components/atoms/linkItem";

export default function LinkLists({ onLinkClick }) {
    return (
        <div className="space-y-2 mt-5">
            <LinkItem icon={Home} label="Home" url="/" onLinkClick={onLinkClick} />
            <LinkItem icon={Leaf} label="About" url="/pages/about" onLinkClick={onLinkClick} />
            <LinkItem icon={PencilLine} label="Blogs" url="/pages/blogs" onLinkClick={onLinkClick} />
            <LinkItem icon={Package} label="Projects" url="/pages/projects" onLinkClick={onLinkClick} />
            <LinkItem icon={ScrollText} label="Certificates" url="/pages/certificates" onLinkClick={onLinkClick} />
            <LinkItem icon={Send} label="Contacts" url="/pages/contacts" onLinkClick={onLinkClick} />
        </div>
    );
}