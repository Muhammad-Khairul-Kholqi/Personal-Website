"use client"

import { useState } from "react"
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ResponsiveContainer,
} from "recharts"

const dataSets = {
    Certificates: [
        { month: "Jan", value: 5 },
        { month: "Feb", value: 8 },
        { month: "Mar", value: 12 },
        { month: "Apr", value: 18 },
        { month: "May", value: 25 },
    ],
    Careers: [
        { month: "Jan", value: 2 },
        { month: "Feb", value: 4 },
        { month: "Mar", value: 6 },
        { month: "Apr", value: 9 },
        { month: "May", value: 12 },
    ],
    Projects: [
        { month: "Jan", value: 1 },
        { month: "Feb", value: 2 },
        { month: "Mar", value: 4 },
        { month: "Apr", value: 6 },
        { month: "May", value: 8 },
    ],
    Technology: [
        { month: "Jan", value: 3 },
        { month: "Feb", value: 5 },
        { month: "Mar", value: 7 },
        { month: "Apr", value: 10 },
        { month: "May", value: 15 },
    ],
}

const colors = {
    Certificates: "#22c55e", 
    Careers: "#ef4444",     
    Projects: "#3b82f6",     
    Technology: "#eab308",   
}

export default function ChartSection() {
    const [activeTab, setActiveTab] = useState("Certificates")

    return (
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm mt-5">
            <h2 className="text-lg font-semibold mb-5">Progress Overview</h2>

            <div className="flex gap-3 mb-6 overflow-x-auto whitespace-nowrap scrollbar-hide">
                {Object.keys(dataSets).map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition cursor-pointer ${activeTab === tab
                                ? "bg-black text-white"
                                : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <div className="h-72 overflow-x-auto scrollbar-hide">
                <div className="min-w-[700px] h-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={dataSets[activeTab]}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Line
                                type="monotone"
                                dataKey="value"
                                stroke={colors[activeTab]}
                                strokeWidth={3}
                                dot={{ r: 5 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

        </div>
    )
}
