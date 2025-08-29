"use client"
import React from "react"
import clsx from "clsx"

export default function LoadingSkeleton({
    width = "100%",
    height = "20px",
    className = "",
}) {
    return (
        <div
            className={clsx(
                "animate-pulse rounded-md bg-gray-200",
                className
            )}
            style={{ width, height }}
        />
    )
}
