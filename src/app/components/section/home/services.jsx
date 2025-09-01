"use client";

import { useState, useEffect } from "react";
import { Settings } from "lucide-react";
import { GetServices } from "@/app/api/servicesApi";
import LoadingSkeleton from "@/app/components/global/loadingSkeleton";
import * as Icons from "lucide-react"

console.log(Object.keys(Icons))

export default function Services() {
    const [services, setServices] = useState([]);
    const [laoadingServices, setLoadingServices] = useState(true);

    useEffect(() => {
        async function fetchService() {
            setLoadingServices(true);
            const data = await GetServices();
            setServices(data);
            setLoadingServices(false);
        }
        fetchService();
    }, []);
    return (
        <div>
            <div className="flex items-center gap-3">
                <Settings className="shake-animation" />
                <span className="text-lg">Services</span>
            </div>
            <p className="text-[#525252] mt-2">I can deliver the following services</p>

            {laoadingServices ? (
                <div className="grid lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1 items-start gap-5 mt-3">
                    <LoadingSkeleton width="100%" height="150px" className="mb-4" />
                    <LoadingSkeleton width="100%" height="150px" className="mb-4" />
                </div>
            ) : (
                services.length > 0 ? (
                    <div className="grid lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1 items-start gap-5 mt-3">
                        {services.map((service, index) => {
                            return (
                                <div key={index} className="border border-gray-200 p-5 rounded-lg">
                                    <div className="flex items-center gap-2" style={{ color: service.color }}>
                                        {service.icon && Icons[service.icon] ? (
                                            (() => {
                                                const IconComponent = Icons[service.icon];
                                                return (
                                                    <IconComponent style={{ color: `#${service.color}` }} size={18} />
                                                );
                                            })()
                                        ) : [null]
                                        }
                                        <span className="text-lg" style={{ color: `#${service.color}` }}>{service.title}</span>
                                    </div>
                                    <p className="text-xs mt-2">#{service.hashtag}</p>
                                    <p className="text-md mt-2">{service.description}</p>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <p className="text-center py-8 text-gray-600">No services available</p>
                )
            )}
        </div>
    );
}
