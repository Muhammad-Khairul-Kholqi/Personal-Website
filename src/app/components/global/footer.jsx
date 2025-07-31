'use client'

import { useEffect, useState } from "react";
import Link from "next/link"
import { Linkedin, Instagram, Github, Coffee } from "lucide-react"

export default function Footer() {
    const [year, setYear] = useState(null);

    useEffect(() => {
        setYear(new Date().getFullYear());
    }, []);
    return (
        <div className="mt-10">
            <div className="flex items-center flex-wrap justify-center gap-5">
                <Link href="/pages/about" className="text-lg hover:text-blue-500">
                    About
                </Link>

                <Link href="/pages/blogs" className="text-lg hover:text-blue-500">
                    Blogs
                </Link>

                <Link href="/pages/projects" className="text-lg hover:text-blue-500">
                    Projects
                </Link>

                <Link href="/pages/contacts" className="text-lg hover:text-blue-500">
                    Contacts
                </Link>
            </div>

            <div className="flex items-center flex-wrap justify-center gap-5 mt-5">
                <a href="https://www.linkedin.com/in/muhammad-khairul-kholqi-9b9413326/" className="relative group hover:text-blue-600">
                    <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-100 text-black text-sm px-3 py-2 rounded opacity-0 group-hover:opacity-100 transition duration-200 pointer-events-none whitespace-nowrap z-20">
                        Linkedin
                    </span>

                    <Linkedin className="w-5 h-5" />
                </a>

                <a href="https://www.instagram.com/khairul.kh_/" className="relative group hover:text-blue-600">
                    <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-100 text-black text-sm px-3 py-2 rounded opacity-0 group-hover:opacity-100 transition duration-200 pointer-events-none whitespace-nowrap z-20">
                        Instagram
                    </span>

                    <Instagram className="w-5 h-5" />
                </a>

                <a href="https://github.com/Muhammad-Khairul-Kholqi/" className="relative group hover:text-blue-600">
                    <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-100 text-black text-sm px-3 py-2 rounded opacity-0 group-hover:opacity-100 transition duration-200 pointer-events-none whitespace-nowrap z-20">
                        Github
                    </span>

                    <Github className="w-5 h-5" />
                </a>

                <a href="" className="relative group hover:text-blue-600">
                    <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-100 text-black text-sm px-3 py-2 rounded opacity-0 group-hover:opacity-100 transition duration-200 pointer-events-none whitespace-nowrap z-20">
                        Saweria
                    </span>

                    <Coffee className="w-5 h-5" />
                </a>
            </div>

            {year && (
                <h5 className="text-center mt-5">
                    © Copyright Khairul Kholqi - {year}
                </h5>
            )}
        </div>
    )
}