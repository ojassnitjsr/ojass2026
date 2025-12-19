"use client";

import { useTheme } from "@/contexts/ThemeContext";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function NotFound() {
    const { theme } = useTheme();
    const isDystopia = theme === "dystopia";
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [aspect, setAspect] = useState({ w: 0, h: 0 });

    // Configuration for the glitch effect
    const GLITCH_INTENSITY = 0.5; // 0 to 1
    const SCANLINE_SPEED = 2;

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let frameId: number;
        let time = 0;

        // Resize handler
        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            setAspect({ w: window.innerWidth, h: window.innerHeight });
        };
        window.addEventListener("resize", handleResize);
        handleResize();

        // Helper: Random integer
        const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

        // Helper: Draw Glitched Text
        const drawGlitchText = (text: string, x: number, y: number, fontSize: number, color: string) => {
            ctx.font = `900 ${fontSize}px "Courier New", monospace`;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";

            const channels = isDystopia
                ? ["#FF0000", "#00FF00", "#0000FF"]  // RGB split for Dystopia
                : ["#00FFFF", "#FF00FF", "#FFFF00"]; // CMY split for Myopia/Utopia

            // 1. Draw RGB/CMY Split (Chromatic Aberration)
            if (Math.random() > 0.8) {
                const offset = randomInt(2, 6);

                ctx.fillStyle = channels[0];
                ctx.fillText(text, x - offset, y);

                ctx.fillStyle = channels[1];
                ctx.fillText(text, x + offset, y);

                ctx.fillStyle = channels[2]; // Original/Mix
                ctx.globalCompositeOperation = "screen";
            }

            ctx.fillStyle = color;
            ctx.globalCompositeOperation = "source-over";

            // 2. Horizontal Slicing Glitch
            const numSlices = 20;
            const sliceHeight = fontSize / numSlices;

            for (let i = 0; i < numSlices; i++) {
                // Chance to offset this slice
                const isGlitch = Math.random() < (0.05 * (Math.sin(time * 0.1) + 1.5));
                const slide = isGlitch ? randomInt(-20, 20) : 0;

                const sy = y - fontSize / 2 + (i * sliceHeight);

                // Save context to clip
                ctx.save();
                ctx.beginPath();
                ctx.rect(0, sy, canvas.width, sliceHeight);
                ctx.clip();

                // Draw text with offset
                ctx.fillText(text, x + slide, y);
                ctx.restore();
            }
        };

        // RENDER LOOP
        const render = () => {
            time++;

            // 1. Clear & Background
            ctx.fillStyle = isDystopia ? "#050202" : "#0a0a0a";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // 2. Static Noise (Snow)
            // Optimization: Only update part of the noise or distinct blocks to save perf
            const w = canvas.width;
            const h = canvas.height;
            const idata = ctx.createImageData(w, h);
            const buffer32 = new Uint32Array(idata.data.buffer);
            const noiseIntensity = 10; // 0-255 alpha value

            // We'll just draw noise patches instead of full pixel manipulation every frame for 1080p+ performance
            // Drawing simple random rects is faster than putImageData for full screen in some browsers
            // Let's stick to a simpler scanline effect for background to ensure framerate

            // 3. Draw "404"
            const fontSize = Math.min(w, h) * 0.3;
            drawGlitchText("404", w / 2, h / 2 - 50, fontSize, isDystopia ? "#FF4500" : "#00FFFF");

            // 4. Draw "Signal Lost" Message
            const subSize = Math.max(16, fontSize * 0.1);
            ctx.font = `700 ${subSize}px "Courier New", monospace`;
            ctx.fillStyle = isDystopia ? "rgba(255, 69, 0, 0.8)" : "rgba(0, 255, 255, 0.8)";
            if (time % 60 < 40) { // Blink effect
                ctx.fillText("> SYSTEM FAILURE_DATA_CORRUPT", w / 2, h / 2 + fontSize / 2);
            }

            // 5. Scanlines
            const scanY = (time * SCANLINE_SPEED) % h;
            ctx.fillStyle = "rgba(255, 255, 255, 0.05)";
            ctx.fillRect(0, scanY, w, 20); // Moving bar

            // Fixed horizontal lines (interlacing)
            ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
            for (let i = 0; i < h; i += 4) {
                ctx.fillRect(0, i, w, 2);
            }

            // 6. VHS Distortion / Wave
            if (Math.random() < 0.05) {
                const stripH = randomInt(50, 200);
                const stripY = randomInt(0, h - stripH);
                try {
                    const strip = ctx.getImageData(0, stripY, w, stripH);
                    ctx.putImageData(strip, randomInt(-10, 10), stripY);
                } catch (e) { } // prevent cross-origin issues if any (not here, but good practice)
            }

            // 7. Full screen color tint Flash
            if (Math.random() < 0.01) {
                ctx.fillStyle = isDystopia ? "rgba(255,0,0,0.1)" : "rgba(0,255,255,0.1)";
                ctx.fillRect(0, 0, w, h);
            }

            frameId = requestAnimationFrame(render);
        };

        render();

        return () => {
            window.removeEventListener("resize", handleResize);
            cancelAnimationFrame(frameId);
        };
    }, [isDystopia]);

    // Button Style based on theme (Standard HTML/CSS for clickability)
    const btnClass = `
        px-8 py-3 
        border-2 
        uppercase font-bold tracking-widest 
        transition-all duration-300
        hover:scale-105 active:scale-95
        backdrop-blur-md
        ${isDystopia
            ? "border-[#FF4500] text-[#FF4500] hover:bg-[#FF4500] hover:text-black shadow-[0_0_15px_rgba(255,69,0,0.4)]"
            : "border-[#00FFFF] text-[#00FFFF] hover:bg-[#00FFFF] hover:text-black shadow-[0_0_15px_rgba(0,255,255,0.4)]"
        }
    `;

    return (
        <div className="relative w-full h-screen bg-black overflow-hidden">
            <canvas
                ref={canvasRef}
                className="absolute inset-0 z-0"
            />

            {/* HTML Overlay for interactions */}
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-end pb-32 pointer-events-none">
                <Link href="/" className="pointer-events-auto">
                    <button className={btnClass}>
                        Reboot System
                    </button>
                </Link>
            </div>

            {/* Vignette Overlay */}
            <div className="absolute inset-0 z-20 pointer-events-none bg-[radial-gradient(circle,transparent_40%,rgba(0,0,0,0.8)_100%)]"></div>
        </div>
    );
}
