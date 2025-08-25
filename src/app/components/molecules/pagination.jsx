"use client"
import React from "react"

export default function Pagination({ page, totalPages, onPageChange }) {
    if (totalPages <= 1) return null

    return (
        <div className="flex justify-start items-center gap-2 mt-5">
            <button
                onClick={() => onPageChange(page - 1)}
                disabled={page === 1}
                className="px-3 py-1 border border-gray-200 hover:shadow cursor-pointer rounded-md disabled:opacity-50"
            >
                Prev
            </button>

            {[...Array(totalPages)].map((_, i) => (
                <button
                    key={i}
                    onClick={() => onPageChange(i + 1)}
                    className={`px-3 py-1 border border-gray-200 hover:shadow cursor-pointer rounded-md ${page === i + 1 ? "bg-black text-white" : ""
                        }`}
                >
                    {i + 1}
                </button>
            ))}

            <button
                onClick={() => onPageChange(page + 1)}
                disabled={page === totalPages}
                className="px-3 py-1 border border-gray-200 hover:shadow cursor-pointer rounded-md disabled:opacity-50"
            >
                Next
            </button>
        </div>
    )
}
