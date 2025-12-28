
"use client";
import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTheme } from "@/contexts/ThemeContext";

gsap.registerPlugin(ScrollTrigger);

// Interface (Aapka code sahi tha, JSON se match karta hai)
interface EventCardProps {
    id: string;
    name: string;
    description: string;
    img: string;
}

// Props (Aapka code sahi tha)
export default function EventCard({ name, img }: EventCardProps) {
    const { theme } = useTheme();
    const svgContainerRef = useRef<SVGSVGElement | null>(null);
    const textContainerRef = useRef<HTMLDivElement | null>(null); // Text ke liye ref

    // SVG animation ke liye useEffect
    useEffect(() => {
        const svgEl = svgContainerRef.current;
        if (!svgEl) return;

        // Kill any existing animations
        gsap.killTweensOf(svgEl);

        // Animate visible SVG paths (stroke-based)
        const allPaths = svgEl.querySelectorAll("path");

        // Fade in and scale animation on scroll
        gsap.fromTo(
            allPaths,
            { opacity: 0, scale: 0.95 },
            {
                opacity: 1,
                scale: 1,
                duration: 1.2,
                ease: "power3.out",
                stagger: 0.05,
                scrollTrigger: {
                    trigger: svgEl,
                    start: "top 85%",
                    toggleActions: "play none none reverse",
                },
            }
        );

        // Subtle pulse animation
        gsap.to(allPaths, {
            scale: 1.02,
            duration: 1.5,
            repeat: 0,
            yoyo: false,
            ease: "sine.inOut",
            stagger: 0.1,
        });
    }, [theme]);


    // Text animation ke liye alag useEffect (Aapka code - NO CHANGES)
    useEffect(() => {
        const textEl = textContainerRef.current; // Text div ka ref
        const svgEl = svgContainerRef.current; // SVG ka ref (trigger ke liye)

        if (!textEl || !svgEl) return;

        if (theme == "utopia") {
            gsap.fromTo(textEl, { opacity: 0, y: -20 }, { color: "#00ffff", opacity: 1, y: 0, duration: 1.5, ease: "power3.out", scrollTrigger: { trigger: svgEl, start: "top 80%", toggleActions: "play none none reverse" } });
        } else if (theme == "dystopia") {
            gsap.fromTo(textEl, { opacity: 0, y: -20 }, { color: "#cc7722", opacity: 1, y: 0, duration: 1.5, ease: "power3.out", scrollTrigger: { trigger: svgEl, start: "top 80%", toggleActions: "play none none reverse" } });
        }
    }, [theme]);

    return (
        <div className="relative w-68 h-[32rem] mt-[50px] overflow-hidden rounded-lg mx-auto">
            {/* Event Name - Top Section */}
            <div
                ref={textContainerRef}
                className="absolute top-4 z-20 px-[20px] h-[75px] w-full flex items-end justify-center overflow-hidden text-center"
                style={{
                    textShadow: theme === "utopia"
                        ? "0 0 20px rgba(0, 255, 255, 0.8)"
                        : "0 0 20px rgba(204, 119, 34, 0.8)"
                }}
            >
                <h3 className="text-md sm:text-lg font-bold uppercase tracking-wider leading-tight text-white w-[200px] text-center">
                    {name}
                </h3>
            </div>


            {/* Image with clipPath - positioned to match SVG frame */}
            <svg viewBox="0 0 300 400" xmlns="http://www.w3.org/2000/svg" className="w-full h-full absolute -top-[5px] left-0 z-0">
                <image
                    href={img}
                    x="0"
                    y="0"
                    width="300"
                    height="400"
                    preserveAspectRatio="xMidYMid slice"
                    clipPath="url(#card-clip)"
                />
            </svg>


            {/* Layer 2: Aapka SVG (z-10) */}
            {/* <svg
                version="1.0"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 3500 4500"
                preserveAspectRatio="xMidYMid meet"
                className="w-full h-full transform scale-y-[-1] absolute top-0 left-0 z-10" // z-10 = Beech mein
                ref={svgContainerRef}
            ></svg> */}
            <svg viewBox="0 0 300 400" xmlns="http://www.w3.org/2000/svg" className="w-full h-full transform scale-y-[-1] absolute top-0 left-0 z-10" ref={svgContainerRef}>
                <defs>
                    <filter id="neon-glow">
                        <feGaussianBlur stdDeviation="8" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>

                    <filter id="outer-glow">
                        <feGaussianBlur stdDeviation="15" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>

                    {/* ClipPath for image - follows the inner white path exactly */}
                    <clipPath id="card-clip">
                        <path d="M 97 37 
                           L 203 37 
                           Q 221 37 229 45
                           L 253 69
                           Q 263 79 263 97
                           L 263 303
                           Q 263 321 253 331
                           L 229 355
                           Q 221 363 203 363
                           L 97 363
                           Q 79 363 71 355
                           L 47 331
                           Q 37 321 37 303
                           L 37 97
                           Q 37 79 47 69
                           L 71 45
                           Q 79 37 97 37
                           Z" />
                    </clipPath>
                </defs>

                {/* Outer glow path - theme dependent */}
                <path d="M 95 30 
           L 205 30 
           Q 225 30 235 40
           L 260 65
           Q 270 75 270 95
           L 270 305
           Q 270 325 260 335
           L 235 360
           Q 225 370 205 370
           L 95 370
           Q 75 370 65 360
           L 40 335
           Q 30 325 30 305
           L 30 95
           Q 30 75 40 65
           L 65 40
           Q 75 30 95 30
           Z"
                    fill="none"
                    stroke={theme === "utopia" ? "#5AA5FF" : "#cc7722"}
                    strokeWidth="2"
                    opacity="0.4"
                    filter="url(#outer-glow)"
                    strokeLinejoin="round" />

                {/* Middle neon glow path - theme dependent */}
                <path d="M 95 30 
           L 205 30 
           Q 225 30 235 40
           L 260 65
           Q 270 75 270 95
           L 270 305
           Q 270 325 260 335
           L 235 360
           Q 225 370 205 370
           L 95 370
           Q 75 370 65 360
           L 40 335
           Q 30 325 30 305
           L 30 95
           Q 30 75 40 65
           L 65 40
           Q 75 30 95 30
           Z"
                    fill="none"
                    stroke={theme === "utopia" ? "#4A9EFF" : "#cc7722"}
                    strokeWidth="1.5"
                    filter="url(#neon-glow)"
                    strokeLinejoin="round" />

                {/* Inner border path - theme dependent */}
                <path d="M 97 37 
           L 203 37 
           Q 221 37 229 45
           L 253 69
           Q 263 79 263 97
           L 263 303
           Q 263 321 253 331
           L 229 355
           Q 221 363 203 363
           L 97 363
           Q 79 363 71 355
           L 47 331
           Q 37 321 37 303
           L 37 97
           Q 37 79 47 69
           L 71 45
           Q 79 37 97 37
           Z"
                    fill="none"
                    stroke={theme === "utopia" ? "#E6F2FF" : "#cc7722"}
                    strokeWidth="1"
                    strokeLinejoin="round" />
            </svg>

            {/* --- FIX 2 & 3: TEXT (z-20) aur REF --- */}


        </div>
    );
}