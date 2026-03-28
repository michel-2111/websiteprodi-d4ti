"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, ExternalLink, Newspaper, Clock } from "lucide-react";
import Link from "next/link";

interface Article {
    id: number;
    title: string;
    description: string;
    cover_image: string | null;
    url: string;
    published_at: string;
    user: { name: string };
}

export default function TechNewsCarousel({ articles }: { articles: Article[] }) {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        if (!scrollContainerRef.current || isHovered) return;

        const interval = setInterval(() => {
            const container = scrollContainerRef.current;
            if (container) {
                if (container.scrollLeft + container.clientWidth >= container.scrollWidth - 10) {
                    container.scrollTo({ left: 0, behavior: "smooth" });
                } else {
                    container.scrollBy({ left: 350, behavior: "smooth" });
                }
            }
        }, 3500);

        return () => clearInterval(interval);
    }, [isHovered]);

    const scroll = (direction: "left" | "right") => {
        if (scrollContainerRef.current) {
            const scrollAmount = direction === "left" ? -350 : 350;
            scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
        }
    };

    if (!articles || articles.length === 0) return null;

    return (
        <div 
            className="relative w-full max-w-7xl mx-auto px-4 sm:px-12"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <button 
                onClick={() => scroll("left")}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-sm border border-zinc-200 text-zinc-600 hover:text-blue-600 hover:bg-white w-10 h-10 rounded-full flex items-center justify-center shadow-md transition-all sm:-ml-4 opacity-0 sm:opacity-100 focus:opacity-100 group-hover:opacity-100"
                aria-label="Scroll Kiri"
            >
                <ChevronLeft className="h-5 w-5" />
            </button>

            <div 
                ref={scrollContainerRef}
                className="flex gap-6 overflow-x-auto snap-x snap-mandatory hide-scrollbar pb-8 pt-4 px-2"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {articles.map((article) => (
                    <div 
                        key={article.id} 
                        className="snap-start shrink-0 w-[300px] sm:w-[340px] bg-white rounded-2xl border border-zinc-200 shadow-sm hover:shadow-xl hover:border-blue-200 transition-all group flex flex-col overflow-hidden h-full"
                    >
                        <div className="aspect-[16/9] bg-zinc-100 relative overflow-hidden">
                            {article.cover_image ? (
                                <img 
                                    src={article.cover_image} 
                                    alt={article.title} 
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                            ) : (
                                <div className="w-full h-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white/50">
                                    <Newspaper className="h-10 w-10" />
                                </div>
                            )}
                            <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center">
                                Tech News
                            </div>
                        </div>

                        <div className="p-5 flex flex-col flex-1">
                            <h3 className="font-bold text-zinc-900 mb-2 line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors" title={article.title}>
                                {article.title}
                            </h3>
                            <p className="text-zinc-500 text-sm line-clamp-2 flex-1 mb-4">
                                {article.description}
                            </p>
                            
                            <div className="flex items-center justify-between pt-4 border-t border-zinc-100 mt-auto">
                                <div className="flex items-center text-[11px] text-zinc-400 font-medium">
                                    <Clock className="h-3 w-3 mr-1" />
                                    {new Date(article.published_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                                </div>
                                <a 
                                    href={article.url} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center text-xs font-bold text-blue-600 hover:text-blue-800"
                                >
                                    Baca Artikel <ExternalLink className="ml-1 h-3 w-3" />
                                </a>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <button 
                onClick={() => scroll("right")}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-sm border border-zinc-200 text-zinc-600 hover:text-blue-600 hover:bg-white w-10 h-10 rounded-full flex items-center justify-center shadow-md transition-all sm:-mr-4 opacity-0 sm:opacity-100 focus:opacity-100 group-hover:opacity-100"
                aria-label="Scroll Kanan"
            >
                <ChevronRight className="h-5 w-5" />
            </button>
            
            <style jsx global>{`
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
        </div>
    );
}