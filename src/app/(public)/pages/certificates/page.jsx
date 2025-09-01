'use client'

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { GetCertificates } from "@/app/api/certificateApi";
import LoadingSkeleton from "@/app/components/global/loadingSkeleton";

export default function CertificatesPage() {
    const router = useRouter();
    const [currentPage, setCurrentPage] = useState(1);
    const [isClient, setIsClient] = useState(false);
    const [certificates, setCertificates] = useState([]);
    const [loading, setLoading] = useState(true);
    const certificatesPerPage = 6;

    const indexOfLast = currentPage * certificatesPerPage;
    const indexOfFirst = indexOfLast - certificatesPerPage;
    const totalPages = Math.ceil(certificates.length / certificatesPerPage);

    const [displayedCertificates, setDisplayedCertificates] = useState([]);

    useEffect(() => {
        setIsClient(true);

        const urlParams = new URLSearchParams(window.location.search);
        const page = urlParams.get('page');
        if (page) {
            setCurrentPage(parseInt(page));
        }
    }, []);

    useEffect(() => {
        async function fetchCertificates() {
            setLoading(true);
            try {
                const data = await GetCertificates();

                const sortedCertificates = data.sort((a, b) =>
                    new Date(b.time) - new Date(a.time)
                );

                setCertificates(sortedCertificates);
            } catch (error) {
                console.error("Error fetching certificates:", error);
            }
            setLoading(false);
        }
        fetchCertificates();
    }, []);

    useEffect(() => {
        const sliced = certificates.slice(indexOfFirst, indexOfLast);
        setDisplayedCertificates(sliced);
    }, [certificates, indexOfFirst, indexOfLast]);

    const changePage = (pageNum) => {
        setCurrentPage(pageNum);
        router.push(`/pages/certificates?page=${pageNum}`);
    };

    if (!isClient || loading) {
        return (
            <div>
                <h1 className="text-2xl">Certification</h1>
                <p className="text-[#525252] text-sm">Certificates I earned through training and seminars.</p>
                <hr className="border-t border-dashed border-gray-500 my-5" />

                <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5">
                    {Array.from({ length: certificatesPerPage }).map((_, idx) => (
                        <LoadingSkeleton key={idx} width="100%" height="300px" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div>
            <h1 className="text-2xl">Certification</h1>
            <p className="text-[#525252] text-sm">Certificates I earned through training and seminars.</p>
            <hr className="border-t border-dashed border-gray-500 my-5" />

            <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5">
                {displayedCertificates.map((certificate, idx) => (
                    <div
                        key={certificate.id}
                        className="border border-gray-200 p-5 rounded-xl group flex flex-col h-full min-h-[410px]"
                    >
                        <div className="relative overflow-hidden rounded-lg">
                            <img
                                src={certificate.image}
                                alt={certificate.title}
                                className="border w-full h-[250px] border-gray-200 rounded-lg object-cover group-hover:scale-110 duration-300"
                            />
                        </div>

                        <h1 className="mt-3 text-xl">{certificate.title}</h1>

                        <div className="flex items-center gap-5 mt-auto">
                            <div className="flex items-center gap-2">
                                <div className="bg-black p-0.5 rounded-full" />
                                <h2>{certificate.company}</h2>
                            </div>

                            <div className="flex items-center gap-2">
                                <div className="bg-black p-0.5 rounded-full" />
                                <h2>
                                    {new Date(certificate.time).toLocaleDateString("en-GB", {
                                        day: "numeric",
                                        month: "long",
                                        year: "numeric",
                                    })}
                                </h2>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {certificates.length > certificatesPerPage && (
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