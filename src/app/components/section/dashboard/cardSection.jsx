import Link from "next/link"
import { ArrowRight } from "lucide-react"

export default function CardSection() {
    const cards = [
        {
            link: "#",
            title: "Certificates",
            color: "green",
            description: "Certificates I earned through training and seminars.",
            count: 25,
        },
        {
            link: "#",
            title: "Careers",
            color: "red",
            description: "Career opportunities and professional experiences.",
            count: 12,
        },
        {
            link: "#",
            title: "Projects",
            color: "blue",
            description: "Projects I’ve completed or contributed.",
            count: 8,
        },
        {
            link: "#",
            title: "Technology",
            color: "yellow",
            description: "Technologies and tools I’ve explored and mastered.",
            count: 15,
        },
    ]

    const colorClasses = {
        green: {
            bg: "bg-green-100",
            text: "text-green-600",
        },
        red: {
            bg: "bg-red-100",
            text: "text-red-600",
        },
        blue: {
            bg: "bg-blue-100",
            text: "text-blue-600",
        },
        yellow: {
            bg: "bg-yellow-100",
            text: "text-yellow-600",
        },
    }

    return (
        <div className="grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 grid-cols-1 items-center gap-5">
            {cards.map((card, index) => (
                <Link
                    key={index}
                    href={card.link}
                    className="border border-gray-200 p-5 rounded-xl space-y-3 duration-300 group"
                >
                    <div className="flex">
                        <div className={`${colorClasses[card.color].bg} px-4 py-2 rounded-lg`}>
                            <span className={`${colorClasses[card.color].text} text-sm`}>
                                {card.title}
                            </span>
                        </div>
                    </div>
                    <p className="text-gray-700">{card.description}</p>
                    <div className="flex items-center gap-3 justify-between">
                        <span className="text-2xl font-medium">{card.count}</span>
                        <div className="p-2 bg-black rounded-full">
                            <ArrowRight className="w-5 h-5 text-white group-hover:translate-x-2 duration-300" />
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    )
}
