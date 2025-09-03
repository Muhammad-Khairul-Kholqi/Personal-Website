"use client";

import { useState } from "react";
import Image from "next/image";
import { AlignRight, X, BadgeCheck } from "lucide-react";
import LinkLists from "@/app/components/molecules/linkLists";

export default function MobileHeader() {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const closeMenu = () => {
        setIsOpen(false);
    };

    return (
        <>
            <header className="lg:hidden fixed top-0 left-0 right-0 bg-white z-40 px-5 py-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-white shadow-md">
                            <Image
                                src="https://drive.google.com/uc?export=view&id=1tD2d4zcqjjlkuSkW7XDXZEd1yBoFmc-x"
                                alt="Foto Kamu"
                                width={40}
                                height={40}
                                className="rounded-full object-cover w-full h-full"
                            />
                        </div>
                        <div className="flex items-center gap-1">
                            <h2 className="text-lg font-bold tracking-wide">Khairul Kholqi</h2>
                            <BadgeCheck className="h-4 w-4 text-white" fill="#60A5FA" />
                        </div>
                    </div>

                    <button
                        onClick={toggleMenu}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                    >
                        {isOpen ? (
                            <X className="w-6 h-6" />
                        ) : (
                            <AlignRight className="w-6 h-6" />
                        )}
                    </button>
                </div>
            </header>

            <div className={`lg:hidden fixed top-12 left-0 right-0 bg-white shadow-lg z-30 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-y-0' : '-translate-y-full'
                }`}>
                <div className="px-5 py-4">
                    <LinkLists onLinkClick={closeMenu} />
                </div>
            </div>

            {isOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/40 bg-opacity-25 z-20"
                    onClick={toggleMenu}
                />
            )}
        </>
    );
}