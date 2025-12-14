"use client";

import Galaxy from "@/components/gallery/Galaxy";
import "@/components/Gallery/gallery.css";
import { InfiniteGrid } from "@/components/gallery/InfiniteGallery";
import { useTheme } from "@/contexts/ThemeContext";
import { galleryImages, galleryLayout } from "@/lib/constants";
import { useEffect, useRef } from "react";

const Gallery = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { theme } = useTheme();

    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;

        const grid = new InfiniteGrid({
            el,
            images: galleryImages,
            layout: galleryLayout,
            baseSize: { w: 1522, h: 1238 },
        });

        const updateViewportWidthVar = () => {
            document.documentElement.style.setProperty(
                "--rvw",
                `${document.documentElement.clientWidth / 100}px`,
            );
        };

        updateViewportWidthVar();
        window.addEventListener("resize", updateViewportWidthVar);

        return () => {
            grid.destroy();
            window.removeEventListener("resize", updateViewportWidthVar);
        };
    }, []);

    return (
        <div className="w-full h-dvh relative">
            <Galaxy
                mouseRepulsion={true}
                mouseInteraction={true}
                density={1.5}
                glowIntensity={0.5}
                saturation={0.8}
                hueShift={theme === "dystopia" ? 240 : 60}
                starSpeed={0.1}
                transparent={theme === "dystopia"}
                backgroundImage="/gallery/image.png"
                backgroundImage2="/gallery/image3.jpg">
                <section className="gallery-container">
                    <div className="gallery-hero">
                        <div
                            className="gallery-images"
                            ref={containerRef}></div>
                    </div>
                </section>
            </Galaxy>
        </div>
    );
};

export default Gallery;
