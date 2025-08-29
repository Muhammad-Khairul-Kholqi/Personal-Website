"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ResponsiveContainer,
} from "recharts"

import { GetCertificates } from "@/app/api/certificateApi"
import { GetCareers } from "@/app/api/careerApi"
import { GetProjects } from "@/app/api/projectApi"

const colors = {
    Certificates: "#22c55e",
    Careers: "#ef4444",
    Projects: "#3b82f6",
}

const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
]

export default function ChartSection() {
    const router = useRouter()
    const searchParams = useSearchParams()

    const initialTab = searchParams.get('tab') || 'Certificates'
    const initialYear = parseInt(searchParams.get('year')) || new Date().getFullYear()

    const [activeTab, setActiveTab] = useState(initialTab)
    const [selectedYear, setSelectedYear] = useState(initialYear)
    const [chartData, setChartData] = useState([])
    const [availableYears, setAvailableYears] = useState([])
    const [loading, setLoading] = useState(true)
    const [allData, setAllData] = useState({
        Certificates: [],
        Careers: [],
        Projects: [],
    })

    const updateURL = (tab, year) => {
        const params = new URLSearchParams()
        params.set('tab', tab)
        params.set('year', year.toString())
        router.push(`?${params.toString()}`, { scroll: false })
    }

    const processDataByMonth = (data, year) => {
        const monthlyData = months.map(month => ({ month, value: 0 }))

        if (!data || !Array.isArray(data)) return monthlyData

        data.forEach(item => {
            let itemDate
            if (item.date) {
                itemDate = new Date(item.date)
            } else if (item.created_at) {
                itemDate = new Date(item.created_at)
            } else if (item.createdAt) {
                itemDate = new Date(item.createdAt)
            } else {
                return
            }

            if (itemDate.getFullYear() === year) {
                const monthIndex = itemDate.getMonth()
                if (monthIndex >= 0 && monthIndex < 12) {
                    monthlyData[monthIndex].value += 1
                }
            }
        })

        return monthlyData
    }

    const getAvailableYears = (allData) => {
        const years = new Set()
        const currentYear = new Date().getFullYear()

        Object.values(allData).forEach(dataArray => {
            if (Array.isArray(dataArray)) {
                dataArray.forEach(item => {
                    let itemDate
                    if (item.date) {
                        itemDate = new Date(item.date)
                    } else if (item.created_at) {
                        itemDate = new Date(item.created_at)
                    } else if (item.createdAt) {
                        itemDate = new Date(item.createdAt)
                    }

                    if (itemDate && itemDate.getFullYear() <= currentYear) {
                        years.add(itemDate.getFullYear())
                    }
                })
            }
        })

        return Array.from(years).sort((a, b) => b - a) 
    }

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                setLoading(true)

                const [certificatesData, careersData, projectsData] = await Promise.all([
                    GetCertificates(),
                    GetCareers(),
                    GetProjects(),
                ])

                const newAllData = {
                    Certificates: certificatesData || [],
                    Careers: careersData || [],
                    Projects: projectsData || [],
                }

                setAllData(newAllData)

                const years = getAvailableYears(newAllData)
                setAvailableYears(years)

                const validYear = years.includes(selectedYear) ? selectedYear : (years[0] || new Date().getFullYear())
                setSelectedYear(validYear)

            } catch (error) {
                console.error("Failed to fetch chart data:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchAllData()
    }, [])

    useEffect(() => {
        if (!loading && allData[activeTab]) {
            const processedData = processDataByMonth(allData[activeTab], selectedYear)
            setChartData(processedData)
        }
    }, [activeTab, selectedYear, allData, loading])

    const handleTabChange = (tab) => {
        setActiveTab(tab)
        updateURL(tab, selectedYear)
    }

    const handleYearChange = (year) => {
        setSelectedYear(year)
        updateURL(activeTab, year)
    }

    if (loading) {
        return (
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm mt-5">
                <div className="animate-pulse">
                    <div className="h-6 bg-gray-200 rounded w-48 mb-5"></div>
                    <div className="flex gap-3 mb-6">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-10 bg-gray-200 rounded-lg w-24"></div>
                        ))}
                    </div>
                    <div className="h-72 bg-gray-200 rounded-lg"></div>
                </div>
            </div>
        )
    }

    return (
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm mt-5">
            <h2 className="text-lg font-semibold mb-5">Progress Overview</h2>

            <div className="flex gap-3 mb-6 overflow-x-auto whitespace-nowrap scrollbar-hide">
                {Object.keys(allData).map((tab) => (
                    <button
                        key={tab}
                        onClick={() => handleTabChange(tab)}
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
                        <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip
                                formatter={(value, name) => [value, `${activeTab} Count`]}
                                labelFormatter={(label) => `${label} ${selectedYear}`}
                            />
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

            {availableYears.length > 0 && (
                <div className="mt-6 flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-700">Year:</span>
                    <div className="flex gap-2 overflow-x-auto whitespace-nowrap scrollbar-hide">
                        {availableYears.map((year) => (
                            <button
                                key={year}
                                onClick={() => handleYearChange(year)}
                                className={`px-3 py-1 rounded-md text-sm font-medium transition cursor-pointer ${selectedYear === year
                                        ? "bg-gray-800 text-white"
                                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                    }`}
                            >
                                {year}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}