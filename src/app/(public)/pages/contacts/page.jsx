"use client";

import { useState, useEffect } from "react";
import LoadingSkeleton from "@/app/components/global/loadingSkeleton";
import { GetContact } from "@/app/api/contactApi";
import * as Icons from "lucide-react"

console.log(Object.keys(Icons))

export default function ContactPage() {
    const [contacts, setContacts] = useState([]);
    const [loadingContacts, setLoadingContacts] = useState(true);

    useEffect(() => {
        async function fetch() {
            try {
                setLoadingContacts(true);
                const data = await GetContact();
                setContacts(data);
            } catch (error) {
                console.error("Error fetching contacts:", error);
            } finally {
                setLoadingContacts(false);
            }
        }
        fetch();
    }, []);

    return (
        <div>
            <h1 className="text-2xl">Contact</h1>
            <p className="text-[#525252] text-sm">Let`s get in touch.</p>
            <hr className="border-t border-dashed border-gray-500 my-5" />

            {loadingContacts ? (
                <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 items-center gap-3">
                    <LoadingSkeleton width="100%" height="100px" />
                    <LoadingSkeleton width="100%" height="100px" />
                    <LoadingSkeleton width="100%" height="100px" />
                </div>
            ) : (
                <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 items-center gap-3">
                    {contacts.map((contact, index) => (
                        <a
                            href={contact.link}
                            key={index}
                            className="border border-gray-200 p-5 rounded-xl flex items-center gap-3 hover:shadow-lg duration-300"
                        >
                            <div>
                                {contact.icon && Icons[contact.icon] ? (
                                    (() => {
                                        const IconComponent = Icons[contact.icon];
                                        return (
                                            <IconComponent style={{ color: `#${contact.color}` }} size={30} />
                                        );
                                    })()
                                ) : null}
                            </div>
                            <div>
                                <h2 className="text-xl">{contact.title}</h2>
                                <p>{contact.username}</p>
                            </div>
                        </a>
                    ))}
                </div>
            )}

            <div className="mt-5">
                <div className="grid lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1 items-center gap-3">
                    <input
                        type="text"
                        className="border border-gray-200 py-3 px-5 outline-none rounded-lg"
                        placeholder="Name*"
                    />

                    <input
                        type="email"
                        className="border border-gray-200 py-3 px-5 outline-none rounded-lg"
                        placeholder="Email*"
                    />
                </div>

                <textarea
                    name=""
                    id=""
                    placeholder="Message*"
                    className="w-full h-[200px] py-3 px-5 border border-gray-200 mt-3 rounded-lg outline-none"
                />

                <button className="py-3 px-5 bg-black hover:bg-black/90 text-white text-center rounded-lg w-full mt-3 cursor-pointer">Send Message</button>
            </div>
        </div>
    )
}