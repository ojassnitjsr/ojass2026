"use client";

import { useTheme } from "@/contexts/ThemeContext";
import gsap from "gsap";
import { useEffect, useRef, useState } from "react";

export default function Footer() {
    const { theme } = useTheme();
    const isDystopia = theme === "dystopia";
    const footerRef = useRef<HTMLDivElement>(null);

    const [isSmallScreen, setIsSmallScreen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.innerHeight + window.scrollY;
            const documentHeight = document.body.offsetHeight;
            const isNearBottom =
                scrollPosition >= documentHeight - (isSmallScreen ? 10 : 80);

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

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        if (!window) return;
        setIsSmallScreen(window.matchMedia("(max-width: 640px)").matches);
    }, []);

    const clipPath = isSmallScreen
        ? "polygon(0% 100%, 100% 100%, 95% 25%, 80% 0%, 63% 0%, 60% 10%, 40% 10%, 37% 0%, 20% 0%, 5% 25%)"
        : "polygon(0% 100%, 100% 100%, 95% 25%, 80% 0%, 63% 0%, 60% 10%, 40% 10%, 37% 0%, 20% 0%, 5% 25%)";

    return (
        <div
            ref={footerRef}
            className="fixed bottom-0 left-0 right-0 flex items-end justify-center z-40"
            style={{ opacity: 0, pointerEvents: "none" }}>
            <div
                className={`relative layout-panel hud-grid px-6 py-3 backdrop-blur-md transition-all duration-700 bg-black/60 ${
                    isDystopia ? "is-dystopia" : ""
                }`}
                style={{
                    width: "fit-content",
                    clipPath: clipPath,
                }}>
                <div className="relative z-10 flex flex-col items-center justify-center gap-1 text-xs font-mono tracking-wider layout-text opacity-85 text-center">
                    {/* Navigation Links */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 place-items-center gap-x-6 gap-y-2">
                        {[
                            { name: "TERMS", href: "/policy" },
                            { name: "PRIVACY", href: "/policy" },
                            { name: "SHIPPING", href: "/policy" },
                            { name: "REFUND", href: "/policy" },
                        ].map((link) => (
                            <a
                                key={link.name}
                                href={link.href}
                                className={`flex items-center gap-1 cursor-pointer hover:scale-105 hover:border-b-2 transition-transform hover:opacity-100 ${
                                    isDystopia ? "is-dystopia" : ""
                                } opacity-80`}>
                                {link.name}
                            </a>
                        ))}
                    </div>

                    {/* Design Credit Line */}
                    <div
                        className={`text-[10px]  opacity-80 mt-1 ${
                            isDystopia ? "is-dystopia" : ""
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
