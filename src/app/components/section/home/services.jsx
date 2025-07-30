import { Settings, SquareTerminal, PencilRuler } from "lucide-react";

const serviceList = [
    {
        icon: SquareTerminal,
        title: "Website Development",
        color: "#ED6262",
        tag: "#coding",
        desc: "Create stunning, easy-to-use frontend web applications using modern technologies.",
    },
    {
        icon: PencilRuler,
        title: "UI Designer",
        color: "#76D0EB",
        tag: "#design",
        desc: "Provides a modern and responsive design across a variety of devices.",
    },
];

export default function Services() {
    return (
        <div>
            <div className="flex items-center gap-3">
                <Settings className="shake-animation" />
                <span className="text-lg">Services</span>
            </div>
            <p className="text-[#525252] mt-2">I can deliver the following services</p>

            <div className="grid lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1 items-start gap-5 mt-3">
                {serviceList.map((service, index) => {
                    const Icon = service.icon;
                    return (
                        <div key={index} className="border border-gray-200 p-5 rounded-lg">
                            <div className="flex items-center gap-2" style={{ color: service.color }}>
                                <Icon />
                                <span className="text-lg">{service.title}</span>
                            </div>
                            <p className="text-xs mt-2">{service.tag}</p>
                            <p className="text-md mt-2">{service.desc}</p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
