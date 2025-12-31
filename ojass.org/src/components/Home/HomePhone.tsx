"use client";

import { useTheme } from "@/contexts/ThemeContext";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export default function HomePhone() {
    const { theme } = useTheme();
    const isDystopia = theme === "dystopia";

    const [imgDims, setImgDims] = useState({
        width: 0,
        height: 0,
        splitTop: 0,
        splitBottom: 0,
    });

    const containerRef = useRef<HTMLDivElement>(null);
    const secondSectionRef = useRef<HTMLDivElement>(null);

    const { scrollY } = useScroll();

    // Calculate image dimensions for bottom.png (same logic as PC)
    useEffect(() => {
        const performCalculation = () => {
            const imgW = 2804;
            const imgH = 2330;
            const splitY = 855;

            const winW = window.innerWidth;
            const winH = window.innerHeight;

            const scaleToCoverWidth = winW / imgW;
            const bottomSegmentHeight = imgH - splitY;
            const scaleToCoverBottomHeight = winH / bottomSegmentHeight;
            const scale = Math.max(scaleToCoverWidth, scaleToCoverBottomHeight);

            const renderW = imgW * scale;
            const renderH = imgH * scale;
            const renderSplitTop = splitY * scale;
            const renderSplitBottom = bottomSegmentHeight * scale;

            setImgDims({
                width: renderW,
                height: renderH,
                splitTop: renderSplitTop,
                splitBottom: renderSplitBottom,
            });
        };

        performCalculation();
        window.addEventListener("resize", performCalculation);
        return () => window.removeEventListener("resize", performCalculation);
    }, []);

    // Parallax transforms (lightweight, optimized for mobile)
    // Screen 1 parallax
    const yLayer3 = useTransform(scrollY, [0, 500], [0, 50]); // Mountain moves slowest (0.1x speed)
    const yTitle = useTransform(scrollY, [0, 500], [0, 500]); // Title moves at scroll speed (1x)

    // Screen 2 parallax (cave section)
    const containerHeight = typeof window !== 'undefined' ? window.innerHeight : 800;
    const yTitle2 = useTransform(scrollY, [containerHeight * 0.5, containerHeight * 1.5], [0, containerHeight * 0.6]);

    return (
        <>
            {/* SCREEN 1 */}
            <div
                ref={containerRef}
                className="w-full bg-black relative overflow-hidden"
                style={{
                    minHeight: '100vh',
                    height: '100dvh' // Uses dynamic viewport height to account for mobile browser UI
                }}>

                {/* Sky Background - Truly Fixed (no parallax) */}
                <div
                    className="fixed top-0 left-0"
                    id="bg">
                    <div className="relative" style={{ width: "104vw", height: "65vh", marginLeft: "-2vw", marginTop: "-2vh" }}>
                        <Image
                            src={isDystopia ? "/homelayer/sky_dys.png" : "/homelayer/sky.png"}
                            alt="Sky Background"
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>
                </div>

                {/* Main Mountain (layer3) - Fixed but parallax */}
                <motion.div
                    style={{ y: yLayer3 }}
                    className="fixed bottom-[5vh] -left-[5vw] w-full"
                    id="layer3">
                    <div className="relative" style={{ width: "110vw", height: "72vh" }}>
                        <Image
                            src={isDystopia ? "/homelayer/mainmountain_dys.png" : "/homelayer/mainmountain.png"}
                            alt="Main Mountain"
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>
                </motion.div>

                {/* Title - Fixed but parallax */}
                <motion.div
                    style={{ filter: isDystopia ? "hue-rotate(180deg)" : "hue-rotate(0deg)", }}
                    id="title"
                    className="fixed top-[20%] w-full h-[35vh] z-10 pointer-events-none"
                >
                    <Image
                        src="/text-main-dys.png"
                        alt="Title"
                        fill
                        className="object-contain"
                        priority
                    />
                </motion.div>

                {/* Bottom Segment 1 - Absolute positioned */}
                <div
                    className="absolute bottom-0 left-0 overflow-hidden flex justify-center items-start"
                    id="bottom-sec1"
                    style={{
                        width: "100vw",
                        height: imgDims.splitTop > 0 ? `${imgDims.splitTop + 2}px` : "0px",
                        zIndex: 20,
                        pointerEvents: "none",
                    }}>
                    <Image
                        src={isDystopia ? "/homelayer/bottom_dys.png" : "/homelayer/bottom.png"}
                        alt="Bottom Segment 1"
                        width={imgDims.width || 1}
                        height={imgDims.height || 1}
                        className="max-w-none"
                        style={{
                            objectPosition: "center top",
                        }}
                    />
                </div>
            </div>

            {/* SCREEN 2 - Cave Section */}
            <div
                ref={secondSectionRef}
                id="second-section"
                className="w-full bg-black relative overflow-hidden"
                style={{
                    minHeight: '100vh',
                    height: '100dvh'
                }}>

                {/* Cave Inner - positioned to connect with bottom segment from Screen 1 */}
                <div
                    className="absolute -left-[2vw]"
                    id="cave-inner"
                    style={{
                        top: "0px",
                        width: "104vw",
                        height: "104vh",
                        zIndex: 1,
                    }}>
                    <Image
                        src={isDystopia ? "/homelayer/caveinner_dys.png" : "/homelayer/caveinner.png"}
                        alt="Cave Inner"
                        fill
                        className="object-cover object-top"
                        priority
                    />
                </div>

                {/* Title 2 - Parallax in cave */}
                <motion.div
                    // style={{ y: yTitle2 }}
                    id="title2"
                    className="absolute -top-[50vh] w-full h-[35vh] pointer-events-none"
                    style={{
                        filter: isDystopia ? "hue-rotate(180deg)" : "hue-rotate(0deg)",
                        zIndex: 2,
                    }}>
                    <Image
                        src="/text-main-dys.png"
                        alt="Title 2"
                        fill
                        className="object-contain"
                    />
                </motion.div>

                {/* Video Content */}
                <div
                    className="absolute top-[30vh] left-1/2 -translate-x-1/2 flex flex-col items-center justify-center px-4 p-4"
                    id="secondScreen"
                    style={{
                        width: "100vw",
                        minHeight: "70vh",
                        zIndex: 5,
                    }}>
                    <div className={`aspect-video w-[90%] max-w-sm rounded-2xl overflow-hidden border-2 shadow-2xl ${isDystopia ? "border-[#ee8f59]/50 shadow-[#ee8f59]/20" : "border-cyan-400/50 shadow-cyan-400/20"
                        }`}>
                        <iframe
                            src="https://www.youtube.com/embed/h1gpXrnNNMI"
                            title="OJASS 2026 Theme"
                            className="w-full h-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            referrerPolicy="strict-origin-when-cross-origin"
                            allowFullScreen
                        />
                    </div>
                </div>

                {/* Bottom Segment 2 (Cave Overlay) - Creates the rocky frame at top of cave */}
                <div
                    className="absolute left-0 overflow-hidden flex justify-center items-end"
                    id="cave-outer-sec2"
                    style={{
                        top: "-5px",
                        width: "100vw",
                        height: imgDims.splitBottom > 0 ? `${imgDims.splitBottom}px` : "0px",
                        zIndex: 30,
                        pointerEvents: "none",
                    }}>
                    <Image
                        src={isDystopia ? "/homelayer/bottom_dys.png" : "/homelayer/bottom.png"}
                        alt="Cave Outer"
                        width={imgDims.width || 1}
                        height={imgDims.height || 1}
                        className="max-w-none"
                    />
                </div>
            </div>
        </>
    );
}