"use client";

import { useTheme } from "@/contexts/ThemeContext";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { useLayoutEffect, useRef, useState } from "react";

export default function Home() {
    const [imgDims, setImgDims] = useState({
        width: 0,
        height: 0,
        splitTop: 0,
        splitBottom: 0,
    });
    const containerRef = useRef<HTMLDivElement>(null);

    const bgRef = useRef(null);
    const layer2Ref = useRef(null);
    const layer3Ref = useRef(null);
    const titleRef = useRef(null);
    const caveInnerRef = useRef(null);
    const rocketRef = useRef(null);
    const title2Ref = useRef(null);

    const { theme } = useTheme();
    const isDystopia = theme === "dystopia";

    // --- SETUP LENIS & SCROLLTRIGGER ---
    useLayoutEffect(() => {
        if (typeof window === "undefined") return;

        gsap.registerPlugin(ScrollTrigger);

        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            touchMultiplier: 2,
            infinite: false,
        });

        lenis.on("scroll", ScrollTrigger.update);

        gsap.ticker.add((time) => {
            lenis.raf(time * 1000);
        });

        gsap.ticker.lagSmoothing(0);

        return () => {
            gsap.ticker.remove(lenis.raf);
            lenis.destroy();
        };
    }, []);

    useLayoutEffect(() => {
        const calculateDimensions = () => {
            const imgW = 2804;
            const imgH = 2330;
            const splitY = 855; // The pixel Y coordinate where the cut happens

            const winW = window.innerWidth;
            const winH = window.innerHeight;

            // 1. Calculate scale required to fill the WIDTH
            const scaleToCoverWidth = winW / imgW;

            // 2. Calculate scale required for the BOTTOM PART to fill the HEIGHT
            // We check against the bottom segment (Total Height - Split Point)
            const bottomSegmentHeight = imgH - splitY;
            const scaleToCoverBottomHeight = winH / bottomSegmentHeight;

            // 3. Choose the larger scale.
            // This guarantees the image is wide enough AND the bottom part is tall enough.
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

        calculateDimensions();
        window.addEventListener("resize", calculateDimensions);
        return () => window.removeEventListener("resize", calculateDimensions);
    }, []);

    // --- MOUSE & SCROLL ANIMATIONS ---
    useGSAP(() => {
        // We use xTo/yTo for "QuickTo" performance (instant retargeting without building new tweens)
        const mouseMove = (e: MouseEvent) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 2;
            const y = (e.clientY / window.innerHeight - 0.5) * 2;

            // Animate directly
            gsap.to(bgRef.current, {
                x: x * 10,
                y: y * 10,
                rotationX: y * 0.5,
                rotationY: x * 0.5,
                duration: 1,
                ease: "power2.out",
            });

            gsap.to(layer2Ref.current, {
                x: x * 30,
                y: y * 20,
                rotationX: y * 1,
                rotationY: x * 1,
                duration: 1,
                ease: "power2.out",
            });
            gsap.to(layer3Ref.current, {
                x: x * 40,
                y: y * 25,
                rotationX: y * 1.5,
                rotationY: x * 1.5,
                duration: 1,
                ease: "power2.out",
            });
            gsap.to(titleRef.current, {
                x: x * 80,
                y: y * 50,
                rotationY: x * 1.2,
                duration: 1,
                ease: "power2.out",
            });
            gsap.to(caveInnerRef.current, {
                x: x * 40,
                y: y * 40,
                duration: 1,
                ease: "power2.out",
            });
            gsap.to(rocketRef.current, {
                x: x * 80,
                duration: 1,
                overwrite: "auto",
                ease: "power2.out",
            });
            gsap.to(title2Ref.current, {
                x: x * 70,
                rotationY: x * 1.0,
                duration: 1,
                overwrite: "auto",
                ease: "power2.out",
            });
        };

        window.addEventListener("mousemove", mouseMove);

        // B. SCROLL LOGIC
        if (!containerRef.current) return;
        const firstSectionHeight = window.innerHeight;

        ScrollTrigger.create({
            trigger: containerRef.current,
            start: "top top",
            end: "bottom+=100% top",
            scrub: 1,
            onUpdate: (self) => {
                const scrollY = window.scrollY; // Note: For parallax accurate mapping, prefer self.progress
                const progress = self.progress;

                gsap.to(titleRef.current, {
                    y: scrollY,
                    scale: 1 + progress * 0.05,
                    overwrite: "auto",
                    duration: 0.1, // small duration prevents fighting with hover
                });

                gsap.to(layer3Ref.current, {
                    y: scrollY * 0.3,
                    scale: 1 + progress * 0.02,
                    overwrite: "auto",
                    duration: 0.1,
                });

                gsap.to(layer2Ref.current, {
                    y: scrollY * 0.6,
                    scale: 1 + progress * 0.04,
                    overwrite: "auto",
                    duration: 0.1,
                });

                gsap.to(bgRef.current, {
                    y: scrollY * 0.9,
                    scale: 1 + progress * 0.06,
                    rotationX: progress * 2,
                    overwrite: "auto",
                    duration: 0.1,
                });

                // Title 2 Logic
                const secondSectionStart = firstSectionHeight;
                if (scrollY >= secondSectionStart * 0.5) {
                    const title2Progress = Math.min(
                        1,
                        (scrollY - secondSectionStart * 0.5) /
                            (secondSectionStart * 0.5),
                    );
                    gsap.to(title2Ref.current, {
                        y: (title2Progress * 60 * window.innerHeight) / 100,
                        overwrite: "auto",
                        duration: 0.1,
                    });
                } else {
                    gsap.set(title2Ref.current, { y: 0 });
                }
            },
        });

        // Timeline for Rocket launch
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: "#second-section",
                start: "top 50%",
                end: "bottom bottom",
                scrub: 1, 
            },
        });

        tl.from(caveInnerRef.current, { y: "0vh", ease: "none" }, 0);
        tl.fromTo(
            rocketRef.current,
            { y: 0 },
            { y: "-125vh", ease: "none" },
            0,
        );

        return () => window.removeEventListener("mousemove", mouseMove);
    }, []);

    const bottomImage = isDystopia
        ? "url(/homelayer/bottom_dys.png)"
        : "url(/homelayer/bottom.png)";

    return (
        <>
            <div
                ref={containerRef}
                className="w-full h-screen bg-black relative overflow-hidden"
                style={{
                    perspective: "1000px",
                    transformStyle: "preserve-3d",
                }}>
                {/* Background Layers - ATTACHED REFS HERE */}
                <div
                    ref={bgRef}
                    className="fixed top-0 left-0"
                    id="bg"
                    style={{
                        width: "104vw",
                        height: "65vh",
                        marginLeft: "-2vw",
                        marginTop: "-2vh",
                        backgroundImage: isDystopia
                            ? "url(/homelayer/sky_dys.png)"
                            : "url(/homelayer/sky.png)",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                        transformStyle: "preserve-3d",
                        willChange: "transform",
                    }}></div>

                <div
                    ref={layer2Ref}
                    className="fixed top-[42vh] left-0"
                    id="layer2"
                    style={{
                        width: "110vw",
                        height: "80vh",
                        marginLeft: "-5vw",
                        backgroundImage: isDystopia
                            ? "url(/homelayer/behindmountain_dys.png)"
                            : "url(/homelayer/behindmountain.png)",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                        transformStyle: "preserve-3d",
                        willChange: "transform",
                    }}></div>

                <div
                    ref={layer3Ref}
                    className="fixed bottom-[5vh] -left-[5vw] w-full bg-contain bg-center bg-no-repeat"
                    id="layer3"
                    style={{
                        width: "110vw",
                        height: "72vh",
                        backgroundImage: isDystopia
                            ? "url(/homelayer/mainmountain_dys.png)"
                            : "url(/homelayer/mainmountain.png)",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                        transformStyle: "preserve-3d",
                        willChange: "transform",
                    }}></div>

                <div
                    ref={titleRef}
                    id="title"
                    className={`fixed top-[30%] font-bold text-[200px] text-center w-full bg-contain bg-center bg-no-repeat h-[35vh] ${
                        isDystopia
                            ? "bg-[url(/text-main-dys.png)]"
                            : "bg-[url(/text-main-eut.png)]"
                    }`}
                    style={{
                        willChange: "transform",
                        pointerEvents: "none",
                        filter: isDystopia
                            ? "hue-rotate(180deg)"
                            : "hue-rotate(0deg)",
                        zIndex: 10,
                    }}></div>

                <div
                    className="absolute bottom-0 left-0"
                    id="bottom-sec1"
                    style={{
                        width: "100vw",
                        height:
                            imgDims.splitTop > 0
                                ? `${imgDims.splitTop + 2}px`
                                : "0px",
                        backgroundImage: bottomImage,
                        backgroundPosition: "top center",
                        backgroundSize: `${imgDims.width}px ${imgDims.height}px`,
                        backgroundRepeat: "no-repeat",
                        zIndex: 20,
                        pointerEvents: "none",
                    }}></div>
            </div>

            <div
                id="second-section"
                className="w-full h-screen bg-black relative overflow-hidden">
                <div
                    ref={caveInnerRef}
                    className="absolute -bottom-[2vh] -left-[2vw]"
                    id="cave-inner"
                    style={{
                        width: "104vw",
                        height: "104vh",
                        backgroundImage: isDystopia
                            ? "url(/homelayer/caveinner_dys.png)"
                            : "url(/homelayer/caveinner.png)",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        willChange: "transform",
                        zIndex: 1,
                    }}></div>

                <div
                    ref={title2Ref}
                    id="title2"
                    className={`absolute -top-[30vh] font-bold text-[200px] text-center w-full bg-contain bg-center bg-no-repeat h-[35vh] ${
                        isDystopia
                            ? "bg-[url(/text-main-dys.png)]"
                            : "bg-[url(/text-main-eut.png)]"
                    }`}
                    style={{
                        willChange: "transform",
                        pointerEvents: "none",
                        filter: isDystopia
                            ? "hue-rotate(180deg)"
                            : "hue-rotate(0deg)",
                        zIndex: 2,
                    }}></div>

                <div
                    ref={rocketRef}
                    className="absolute top-[150vh] left-0"
                    id="rocket"
                    style={{
                        width: "100vw",
                        height: "70vh",
                        backgroundImage: isDystopia
                            ? "url(/homelayer/rocket_dys.png)"
                            : "url(/homelayer/rocket.png)",
                        backgroundSize: "contain",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                        willChange: "transform",
                        zIndex: 5,
                    }}></div>

                <div
                    className="absolute left-0"
                    id="cave-outer-sec2"
                    style={{
                        top: "-5px",
                        width: "100vw",
                        height:
                            imgDims.splitBottom > 0
                                ? `${imgDims.splitBottom}px`
                                : "0px",
                        backgroundImage: bottomImage,
                        backgroundPosition: "bottom center",
                        backgroundSize: `${imgDims.width}px ${imgDims.height}px`,
                        backgroundRepeat: "no-repeat",
                        zIndex: 30,
                        pointerEvents: "none",
                    }}></div>
            </div>
        </>
    );
}
