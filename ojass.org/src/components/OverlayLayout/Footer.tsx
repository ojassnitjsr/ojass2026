"use client";

import { useTheme } from "@/contexts/ThemeContext";
import gsap from "gsap";
import { useEffect, useRef, useState } from "react";
import { Mail, Phone } from "lucide-react";
import Link from "next/link";

export default function Footer() {
    const { theme } = useTheme();
    const isDystopia = theme === "dystopia";
    const footerRef = useRef<HTMLDivElement>(null);

    const [isSmallScreen, setIsSmallScreen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            // Check for scroll containers (snap-scroll divs)
            const scrollContainer = document.querySelector('.snap-y');

            let scrollPosition, documentHeight, isNearBottom;

            if (scrollContainer) {
                // For scroll containers
                scrollPosition = scrollContainer.scrollTop + scrollContainer.clientHeight;
                documentHeight = scrollContainer.scrollHeight;
                isNearBottom = scrollPosition >= documentHeight - 100;
            } else {
                // Fallback to window scroll
                scrollPosition = window.innerHeight + window.scrollY;
                documentHeight = document.body.offsetHeight;
                isNearBottom = scrollPosition >= documentHeight - 10;
            }

            if (isNearBottom) {
                gsap.to(footerRef.current, {
                    y: 0,
                    opacity: 1,
                    pointerEvents: "auto",
                    duration: 0.9,
                    overwrite: "auto",
                });
            } else {
                gsap.to(footerRef.current, {
                    y: 200,
                    opacity: 0,
                    pointerEvents: "none",
                    duration: 1.5,
                    overwrite: "auto",
                });
            }
        };

        // Listen to both window scroll and scroll container
        const scrollContainer = document.querySelector('.snap-y');

        window.addEventListener("scroll", handleScroll, { passive: true });
        if (scrollContainer) {
            scrollContainer.addEventListener("scroll", handleScroll, { passive: true });
        }

        // Initial check
        handleScroll();

        return () => {
            window.removeEventListener("scroll", handleScroll);
            if (scrollContainer) {
                scrollContainer.removeEventListener("scroll", handleScroll);
            }
        };
    }, []);

    useEffect(() => {
        if (!window) return;
        setIsSmallScreen(window.matchMedia("(max-width: 640px)").matches);
    }, []);

    // Unified clipPath to maintain design consistency
    const clipPath = "polygon(0% 100%, 100% 100%, 95% 25%, 80% 0%, 63% 0%, 60% 10%, 40% 10%, 37% 0%, 20% 0%, 5% 25%)";

    return (
        <div
            ref={footerRef}
            className="fixed bottom-0 left-0 right-0 flex items-end justify-center z-40 sm:pb-0 font-kensmark"
            style={{ opacity: 0, pointerEvents: "none" }}>
            <div
                className={`relative layout-panel hud-grid px-6 py-3 pb-1 backdrop-blur-md transition-all duration-700 bg-black/60 ${
                    isDystopia ? "is-dystopia" : ""
                }`}
                style={{
                    width: "fit-content",
                    clipPath: clipPath,
                    transform: isSmallScreen ? "scale(0.85)" : "scale(1)",
                    transformOrigin: "bottom center",
                }}>
                <div className="relative z-10 flex flex-col items-center justify-center gap-1 text-xs tracking-wider text-center text-white font-bold">
                    {/* Navigation Links */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 place-items-center gap-x-6">
                        {[
                            { name: "TERMS", href: "/policy" },
                            { name: "PRIVACY", href: "/policy" },
                            { name: "SHIPPING", href: "/policy" },
                            { name: "REFUND", href: "/policy" },
                        ].map((link) => (
                            <a
                                key={link.name}
                                href={link.href}
                                className={`flex items-center gap-1 cursor-pointer hover:scale-105 hover:border-b-2 transition-transform hover:opacity-100 ${isDystopia ? "is-dystopia" : ""
                                } opacity-80`}>
                                {link.name}
                            </a>
                        ))}
                    </div>

                    <div className="flex items-center gap-1 text-[10px] lowercase">
                        <Link
                            href="mailto:ojass@nitjsr.ac.in"
                            className="flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            ojass@nitjsr.ac.in
                        </Link>{" "}
                        |
                        <Link
                            href="tel:+918340671871"
                            className="flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            +918340671871
                        </Link>
                    </div>

                    {/* Design Credit Line */}
                    <div
                        className={`text-[10px]  opacity-80 mt-1 ${isDystopia ? "is-dystopia" : ""
                            }`}>
                        &copy; 2026 OJASS | Designed & Developed by{" "}
                        <a
                            href="https://digicraft.one"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline hover:opacity-100 opacity-70">
                            Digicraft
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
