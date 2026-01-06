"use client";

import React, { useEffect, useRef, useState } from "react";

interface RevealProps {
    children: React.ReactNode;
    className?: string;
    delay?: number;
    duration?: number;
    x?: number;
    y?: number;
    threshold?: number;
}

export const Reveal = ({
    children,
    className = "",
    delay = 0,
    duration = 0.5,
    x = 0,
    y = 20,
    threshold = 0.1,
}: RevealProps) => {
    const ref = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: threshold },
        );

        if (ref.current) observer.observe(ref.current);

        return () => observer.disconnect();
    }, [threshold]);

    return (
        <div
            ref={ref}
            className={`transition-all ease-out ${className}`}
            style={{
                transform: isVisible
                    ? "translate(0, 0)"
                    : `translate(${x}px, ${y}px)`,
                opacity: isVisible ? 1 : 0,
                transitionDuration: `${duration}s`,
                transitionDelay: `${delay}s`,
            }}>
            {children}
        </div>
    );
};
