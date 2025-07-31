'use client'

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import CertificateData from "@/app/data/certificateData";

export default function CertificatesPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const page = searchParams.get('page');
    const currentPage = page ? parseInt(page) : 1;
    const certificatesPerPage = 6;

    const indexOfLast = currentPage * certificatesPerPage;
    const indexOfFirst = indexOfLast - certificatesPerPage;
    const totalPages = Math.ceil(CertificateData.length / certificatesPerPage);

    const [displayedCertificates, setDisplayedCertificates] = useState([]);

    useEffect(() => {
        const sliced = CertificateData.slice(indexOfFirst, indexOfLast);
        setDisplayedCertificates(sliced);
    }, [indexOfFirst, indexOfLast]); 

    const changePage = (pageNum) => {
        router.push(`/pages/certificates?page=${pageNum}`);
    };

    return (
        <div>
            <h1 className="text-2xl">Certification</h1>
            <p className="text-[#525252] text-sm">Certificates I earned through training and seminars.</p>
            <hr className="border-t border-dashed border-gray-500 my-5" />

            <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5">
                {displayedCertificates.map((certificate, idx) => (
                    <div
                        key={idx}
                        className="border border-gray-200 p-5 rounded-xl group flex flex-col h-full min-h-[410px]"
                    >
                        <div className="relative overflow-hidden rounded-lg">
                            <Image
                                src={certificate.image}
                                width={500}
                                height={200}
                                alt={certificate.name}
                                className="border w-full h-[250px] border-gray-200 rounded-lg object-cover group-hover:scale-110 duration-300"
                            />
                        </div>

                        <h1 className="mt-3 text-xl">{certificate.name}</h1>

                        <div className="flex items-center gap-5 mt-auto">
                            <div className="flex items-center gap-2">
                                <div className="bg-black p-0.5 rounded-full" />
                                <h2>{certificate.institution}</h2>
                            </div>

                            <div className="flex items-center gap-2">
                                <div className="bg-black p-0.5 rounded-full" />
                                <h2>{certificate.year}</h2>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {CertificateData.length > certificatesPerPage && (
                <div className="flex justify-center items-center gap-2 mt-8">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
                        <button
                            key={pg}
                            onClick={() => changePage(pg)}
                            className={`px-4 py-2 border border-gray-200 rounded cursor-pointer ${currentPage === pg
                                ? "bg-gray-800 text-white"
                                : "bg-white text-gray-800 hover:bg-gray-100"
                                }`}
                        >
                            {pg}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}