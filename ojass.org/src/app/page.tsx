"use client";

import { useTheme } from "@/contexts/ThemeContext";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import Loader from "@/components/Loader";

export default function Home() {
    const [isLoading, setIsLoading] = useState(true);
    const loadedCountRef = useRef(0);
    const totalImages = 4;

    const handleImageLoad = () => {
        loadedCountRef.current += 1;
        if (loadedCountRef.current >= totalImages) {
            setTimeout(() => setIsLoading(false), 1000);
        }
    };

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
    const secondScreenRef = useRef(null);
    const title2Ref = useRef(null);

    const { theme } = useTheme();
    const isDystopia = theme === "dystopia";

    useEffect(() => setIsLoading(true), [theme]);

    // --- SETUP LENIS & SCROLLTRIGGER ---
    useLayoutEffect(() => {
        if (typeof window === "undefined") return;

        gsap.registerPlugin(ScrollTrigger);
        ScrollTrigger.config({ ignoreMobileResize: true });

        const isMobile = window.innerWidth <= 768;
        let lenis: Lenis | null = null;

        // Only enable Lenis on Desktop for performance
        if (!isMobile) {
            lenis = new Lenis({
                duration: 1.2,
                easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                touchMultiplier: 2,
                infinite: false,
            });

            lenis.on("scroll", ScrollTrigger.update);

            gsap.ticker.add((time) => {
                lenis?.raf(time * 1000);
            });

            gsap.ticker.lagSmoothing(0);
        } else ScrollTrigger.normalizeScroll(true);

        return () => {
            if (lenis) {
                gsap.ticker.remove(lenis.raf);
                lenis.destroy();
            }
            ScrollTrigger.normalizeScroll(false);
        };
    }, []);

    useLayoutEffect(() => {
        let prevWidth = window.innerWidth;

        const performCalculation = () => {
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

        const onResize = () => {
            const currentWidth = window.innerWidth;
            // Ignore mobile vertical resizes (URL bar)
            if (currentWidth <= 768 && currentWidth === prevWidth) return;

            prevWidth = currentWidth;
            performCalculation();
        };

        performCalculation();
        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
    }, []);

    // --- MOUSE & SCROLL ANIMATIONS ---
    useGSAP(() => {
        // Shared secondScreen Timeline (Runs everywhere)
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: "#second-section",
                start: "top 50%",
                end: "bottom bottom",
                scrub: 1,
            },
        });

        tl.from(caveInnerRef.current, { y: "0vh", ease: "none" }, 0);
        tl.fromTo(secondScreenRef.current, { y: 0 }, { y: "-125vh", ease: "none" }, 0);

        const mm = gsap.matchMedia();

        // 1. DESKTOP Logic ( > 768px )
        mm.add("(min-width: 769px)", () => {
            // Mouse Move
            const mouseMove = (e: MouseEvent) => {
                const x = (e.clientX / window.innerWidth - 0.5) * 2;
                const y = (e.clientY / window.innerHeight - 0.5) * 2;

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
                gsap.to(secondScreenRef.current, {
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

            // Desktop Scroll Trigger
            if (containerRef.current) {
                ScrollTrigger.create({
                    trigger: containerRef.current,
                    start: "top top",
                    end: "bottom+=100% top",
                    scrub: 1,
                    onUpdate: (self) => {
                        const scrollY = window.scrollY;
                        const progress = self.progress;

                        gsap.to(titleRef.current, {
                            y: scrollY,
                            scale: 1 + progress * 0.05,
                            overwrite: "auto",
                            duration: 0.1,
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
                        const limit = window.innerHeight * 0.5;
                        if (scrollY >= limit) {
                            const p = Math.min(1, (scrollY - limit) / limit);
                            gsap.to(title2Ref.current, {
                                y: (p * 60 * window.innerHeight) / 100,
                                overwrite: "auto",
                                duration: 0.1,
                            });
                        } else {
                            gsap.set(title2Ref.current, { y: 0 });
                        }
                    },
                });
            }

            return () => window.removeEventListener("mousemove", mouseMove);
        });

        // 2. MOBILE Logic ( <= 768px )
        mm.add("(max-width: 768px)", () => {
            if (containerRef.current) {
                // Declarative Timeline for Mobile - Native Scrubbing
                // Max scroll is 200vh (100% + 100vh).
                // We approximate the movement based on the same logic: layer speed * total height

                const totalScrollHeight = window.innerHeight * 2; // Rough estimate of the section scroll triggers

                const mobileTl = gsap.timeline({
                    defaults: { force3D: true }, // Hardware Acceleration
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: "top top",
                        end: "bottom+=100% top",
                        scrub: 0, // Direct Scrub for instant response (no lag)
                    },
                });

                // title moves at speed 1 (scrollY) -> moves 100% of scroll distance
                mobileTl.to(titleRef.current, { y: totalScrollHeight * 1, ease: "none" }, 0);

                // layer3 moves at 0.3
                mobileTl.to(layer3Ref.current, { y: totalScrollHeight * 0.3, ease: "none" }, 0);

                // layer2 moves at 0.6
                mobileTl.to(layer2Ref.current, { y: totalScrollHeight * 0.6, ease: "none" }, 0);

                // bg moves at 0.9
                mobileTl.to(bgRef.current, { y: totalScrollHeight * 0.9, ease: "none" }, 0);

                // Title 2 Logic
                // It starts appearing at 50% scroll.
                // We create a separate timeline pinned to the same trigger but with different start
                const title2Tl = gsap.timeline({
                    defaults: { force3D: true },
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: "top+=50% top", // Starts when 50% scrolled
                        end: "bottom top",    // Ends when section is fully scrolled (100vh)
                        scrub: 0.2,
                    }
                });

                // Moves to 60vh
                title2Tl.to(title2Ref.current, { y: window.innerHeight * 0.60, ease: "none" }, 0);
            }
        });
    }, []);


    return (
        <>
            {isLoading && <Loader />}
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
                        transformStyle: "preserve-3d",
                        willChange: "transform",
                    }}
                >
                    <Image
                        src={isDystopia ? "/homelayer/sky_dys.png" : "/homelayer/sky.png"}
                        alt="Sky Background"
                        fill
                        className="object-cover"
                        priority
                        onLoad={handleImageLoad}
                    />
                </div>

                <div
                    ref={layer2Ref}
                    className="fixed top-[42vh] left-0"
                    id="layer2"
                    style={{
                        width: "110vw",
                        height: "80vh",
                        marginLeft: "-5vw",
                        transformStyle: "preserve-3d",
                        willChange: "transform",
                    }}
                >
                    <Image
                        src={isDystopia ? "/homelayer/behindmountain_dys.png" : "/homelayer/behindmountain.png"}
                        alt="Behind Mountain"
                        fill
                        className="object-cover"
                        priority
                        onLoad={handleImageLoad}
                    />
                </div>

                <div
                    ref={layer3Ref}
                    className="fixed bottom-[5vh] -left-[5vw] w-full"
                    id="layer3"
                    style={{
                        width: "110vw",
                        height: "72vh",
                        transformStyle: "preserve-3d",
                        willChange: "transform",
                    }}
                >
                    <Image
                        src={isDystopia ? "/homelayer/mainmountain_dys.png" : "/homelayer/mainmountain.png"}
                        alt="Main Mountain"
                        fill
                        className="object-cover"
                        priority
                        onLoad={handleImageLoad}
                    />
                </div>

                <div
                    ref={titleRef}
                    id="title"
                    className="fixed top-[30%] w-full h-[35vh]"
                    style={{
                        willChange: "transform",
                        pointerEvents: "none",
                        filter: isDystopia
                            ? "hue-rotate(180deg)"
                            : "hue-rotate(0deg)",
                        zIndex: 10,
                    }}
                >
                    <Image
                        src={isDystopia ? "/text-main-dys-1.png" : "/text-main-eut-1.png"}
                        alt="Title"
                        fill
                        className="object-contain"
                        priority
                        onLoad={handleImageLoad}
                    />
                </div>

                <div
                    className="absolute bottom-0 left-0 overflow-hidden flex justify-center items-start"
                    id="bottom-sec1"
                    style={{
                        width: "100vw",
                        height:
                            imgDims.splitTop > 0
                                ? `${imgDims.splitTop + 2}px`
                                : "0px",
                        zIndex: 20,
                        pointerEvents: "none",
                    }}
                >
                    <Image
                        src={isDystopia ? "/homelayer/bottom_dys.png" : "/homelayer/bottom.png"}
                        alt="Bottom Segment 1"
                        width={imgDims.width || 1}
                        height={imgDims.height || 1}
                        className="max-w-none"
                    />
                </div>
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
                        willChange: "transform",
                        zIndex: 1,
                    }}
                >
                    <Image
                        src={isDystopia ? "/homelayer/caveinner_dys.png" : "/homelayer/caveinner.png"}
                        alt="Cave Inner"
                        fill
                        className="object-cover"
                    />
                </div>

                <div
                    ref={title2Ref}
                    id="title2"
                    className="absolute -top-[40vh] md:-top-[47vh] w-full h-[35vh]"
                    style={{
                        willChange: "transform",
                        pointerEvents: "none",
                        filter: isDystopia
                            ? "hue-rotate(180deg)"
                            : "hue-rotate(0deg)",
                        zIndex: 2,
                    }}
                >
                    <Image
                        src={isDystopia ? "/text-main-dys-1.png" : "/text-main-eut-1.png"}
                        alt="Title 2"
                        fill
                        className="object-contain"
                    />
                </div>

                <div
                    ref={secondScreenRef}
                    className="absolute top-[145vh] md:top-[152vh] left-1/2 -translate-x-1/2 flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 px-4 p-4 rounded-xl"
                    id="secondScreen"
                    style={{
                        width: "100vw",
                        minHeight: "70vh",
                        willChange: "transform",
                        zIndex: 5,
                    }}>
                    <iframe
                        src="https://www.youtube.com/embed/h1gpXrnNNMI"
                        title="OJASS 2026 Theme"
                        className="aspect-video h-40 sm:h-60 md:h-70 m-2 sm:m-4 rounded-2xl"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerPolicy="strict-origin-when-cross-origin"
                        allowFullScreen
                    />
                </div>

                <div
                    className="absolute left-0 overflow-hidden flex justify-center items-end"
                    id="cave-outer-sec2"
                    style={{
                        top: "-5px",
                        width: "100vw",
                        height:
                            imgDims.splitBottom > 0
                                ? `${imgDims.splitBottom}px`
                                : "0px",
                        zIndex: 30,
                        pointerEvents: "none",
                    }}
                >
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