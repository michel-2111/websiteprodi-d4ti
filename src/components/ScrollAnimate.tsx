"use client";

import { useEffect, useRef, ReactNode } from "react";

interface ScrollAnimateProps {
    children: ReactNode;
    className?: string;
    delay?: number;
}

export default function ScrollAnimate({ children, className = "", delay = 0 }: ScrollAnimateProps) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.classList.add("is-visible");
                    }, delay);
                    observer.unobserve(entry.target);
                }
            },
            { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => observer.disconnect();
    }, [delay]);

    return (
        <div ref={ref} className={`scroll-animate ${className}`}>
            {children}
        </div>
    );
}
