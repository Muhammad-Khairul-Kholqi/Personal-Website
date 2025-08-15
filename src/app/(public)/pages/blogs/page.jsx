'use client'

import { useEffect, useState } from "react";

const tiktokVideos = [
    {
        id: "7532862039035809030",
        url: "https://www.tiktok.com/@tiktok/video/7532862039035809030",
    },

    {
        id: "7532417364491619640",
        url: "https://www.tiktok.com/@tiktok/video/7532417364491619640",
    },

    {
        id: "7532061861152378168",
        url: "https://www.tiktok.com/@tiktok/video/7532061861152378168",
    },

    {
        id: "7531639067876904248",
        url: "https://www.tiktok.com/@tiktok/video/7531639067876904248",
    },

    {
        id: "7531386173822963000",
        url: "https://www.tiktok.com/@tiktok/video/7531386173822963000",
    },
];

export default function BlogsPage() {
    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://www.tiktok.com/embed.js";
        script.async = true;
        document.body.appendChild(script);
        return () => {
            document.body.removeChild(script);
        };
    }, []);

    return (
        <div>
            <h1 className="text-2xl font-semibold">Blogs</h1>
            <p className="text-[#525252] text-sm">
                Welcome to my blog! Your Source for Tips and Insights!
            </p>
            <hr className="border-t border-dashed border-gray-500 mt-5" />

            <div className="relative">
                <div className="flex gap-5 overflow-x-auto scrollbar-hide">
                    {tiktokVideos.map((video) => (
                        <div key={video.id} className="min-w-[325px] max-w-[325px]">
                            <blockquote
                                className="tiktok-embed"
                                cite={video.url}
                                data-video-id={video.id}
                                style={{ maxWidth: "325px", minWidth: "325px" }}
                            >
                                <div className="flex justify-center">
                                    <section className="py-10 gap-3">
                                        <div className="w-8 h-8 border-4 border-gray-100 border-t-gray-400 rounded-full animate-spin"></div>
                                    </section>
                                </div>
                            </blockquote>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}