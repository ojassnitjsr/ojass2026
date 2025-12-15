"use client";

import Galaxy from "@/components/Gallery/Galaxy";
import "@/components/Gallery/gallery.css";
import { InfiniteGrid } from "@/components/Gallery/InfiniteGallery";
import { useTheme } from "@/contexts/ThemeContext";
import { galleryImages, galleryLayout } from "@/lib/constants";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { IoExitOutline } from "react-icons/io5";

const Gallery = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { theme } = useTheme();
    const isDystopia = theme === "dystopia";

    useEffect(() => {
        let styleElement = document.getElementById('gallery-clip-styles') as HTMLStyleElement;

        if (!styleElement) {
            styleElement = document.createElement('style');
            styleElement.id = 'gallery-clip-styles';
            document.head.appendChild(styleElement);
        }

        styleElement.textContent = `
        .clip-left {
          clip-path: polygon(
            20px 0, 
            100% 0, 
            100% calc(100% - 20px), 
            calc(100% - 20px) 100%, 
            0 100%, 
            0 20px
          );
        }
      `;

        return () => {
            styleElement?.remove();
        };
    }, []);

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
            <Link
                href="/"
                className={`clip-left absolute top-6 left-6 z-50 flex items-center gap-2 px-6 py-3 backdrop-blur-sm transition-all duration-300 hover:scale-105 active:scale-95 ${isDystopia
                    ? 'bg-[#ee8f59]/20 hover:bg-[#ee8f59]/40 text-white'
                    : 'bg-cyan-500/20 hover:bg-cyan-500/40 text-white'
                    }`}
            >
                <IoExitOutline size={20} />
                <span className="font-semibold tracking-wider">EXIT</span>
            </Link>
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
