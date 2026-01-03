"use client";

// import dynamic from "next/dynamic";
// import { useEffect, useState } from "react";
// import Loader from "@/components/Loader";
import Image from "next/image";
import { useTheme } from "@/contexts/ThemeContext";
import Link from "next/link";
import { motion } from "framer-motion";

// Dynamically import components to avoid heavy loading on wrong devices
// const HomePC = dynamic(() => import("@/components/Home/HomePC"), {
//     loading: () => <Loader />,
// });
// const HomePhone = dynamic(() => import("@/components/Home/HomePhone"), {
//     loading: () => <Loader />,
// });

export default function Home() {
    // const [isMobile, setIsMobile] = useState<boolean | null>(null);

    // useEffect(() => {
    //     const checkMobile = () => {
    //         setIsMobile(window.innerWidth <= 768);
    //     };

    //     checkMobile();
    //     window.addEventListener("resize", checkMobile);
    //     return () => window.removeEventListener("resize", checkMobile);
    // }, []);

    // if (isMobile === null) {
    //     return <Loader />;
    // }

    // return isMobile ? <HomePhone /> : <HomePC />;

    const { theme } = useTheme();
    const isDystopia = theme === "dystopia";

    return (
        <div className="h-screen overflow-y-scroll snap-y snap-mandatory" style={{ scrollBehavior: 'smooth' }}>
            <div className="snap-start" style={{
                backgroundImage: "url(/home_long.png)",
                backgroundSize: "cover",
                backgroundPosition: "center top",
                backgroundRepeat: "no-repeat",
                width: "100vw",
                height: "200vh",
                backgroundColor: "black",
                filter: isDystopia ? "hue-rotate(180deg)" : "",
            }}>
                <div className="relative flex flex-col items-center justify-center gap-6 h-screen">
                    <Image src="/text-main-dys.png" alt="Home" width={500} height={500} className="object-contain w-[90vw] md:w-1/2 md:mb-0 mb-32" style={{
                        filter: "hue-rotate(180deg)"
                    }}/>

                    {/* Mobile-only CA and Sponsor buttons - Positioned below image */}
                    <div className="absolute flex flex-col md:hidden gap-3 w-[60%] max-w-[250px] md:mt-0 mt-20" style={{
                        top: '62%',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        filter: isDystopia ? 'hue-rotate(-180deg)' : 'none'
                    }}>
                        <Link
                            href="https://sponsor.ojass.org"
                            target="_blank"
                            className={`layout-panel layout-text font-bold text-center px-4 py-2.5 text-xs hover:scale-105 active:scale-95 transition-all duration-300 ${isDystopia ? "is-dystopia" : ""}`}
                            style={{
                                clipPath:
                                    "polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)",
                            }}
                        >
                            SPONSOR US
                        </Link>
                        <Link
                            href="https://ca.ojass.org"
                            target="_blank"
                            className={`layout-panel layout-text font-bold text-center px-4 py-2.5 text-xs hover:scale-105 active:scale-95 transition-all duration-300 ${isDystopia ? "is-dystopia" : ""}`}
                            style={{
                                clipPath:
                                    "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))",
                            }}
                        >
                            CA PROGRAM
                        </Link>
                    </div>
                </div>
                {/* Second Section - About OJASS with YouTube Embed */}
                <div className="h-screen w-full relative overflow-hidden py-6 md:py-12 px-4 md:px-8 flex items-center snap-start" style={{
                    filter: isDystopia ? 'hue-rotate(-180deg)' : 'none'
                }}>
                    {/* Background Gradient from transparent to black */}
                    <div className="absolute inset-0" style={{
                        background: 'linear-gradient(to bottom, transparent 0%, black 100%)'
                    }}></div>

                    {/* Background Grid Effect */}
                    <div className="absolute inset-0 hud-grid opacity-20" style={{
                        filter: isDystopia ? 'hue-rotate(180deg)' : 'none'
                    }}></div>

                    <div className="max-w-5xl mx-auto relative z-10 flex flex-col lg:flex-row gap-4 md:gap-6 lg:gap-10 items-center justify-center w-[80%] md:w-full">
                        {/* Text Content */}
                        <motion.div
                            className="flex-1 space-y-2 md:space-y-4 w-full"
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                        >
                            <motion.h2
                                className={`layout-text text-xl md:text-3xl lg:text-4xl font-bold mb-2 md:mb-4 ${isDystopia ? "is-dystopia" : ""} md:pl-5 lg:pl-6`}
                                style={{
                                    textShadow: isDystopia
                                        ? "0 0 20px rgba(255, 100, 0, 0.8)"
                                        : "0 0 20px rgba(0, 255, 255, 0.8)"
                                }}
                                initial={{ opacity: 0, y: -30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                            >
                                ABOUT OJASS
                            </motion.h2>

                            <motion.div
                                className={`${isDystopia ? "is-dystopia" : ""} p-3 md:p-5 lg:p-6`}
                                style={{
                                    clipPath: "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))"
                                }}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.7, delay: 0.4 }}
                            >
                                <p className={`text-white text-xs md:text-sm lg:text-base leading-relaxed ${isDystopia ? "is-dystopia" : ""}`}>
                                    <span className="text-sm md:text-lg lg:text-xl">OJASS 2026</span> - The Annual Techno-Management Fest of NIT Jamshedpur, presented by ConfirmTkt, is back with its 22nd edition!
                                    <br /><br />
                                    Scheduled for <span className="font-semibold">19-22 February 2026</span>, OJASS brings together the brightest minds from across the nation for an electrifying celebration of innovation, technology, and management.
                                    <br className="hidden md:block" /><br className="hidden md:block" />
                                    <span className="hidden md:inline">Experience cutting-edge competitions, inspiring workshops, thrilling events, and networking opportunities that will shape the future. Join us in this journey to the <span className="">&ldquo;NOVUS ORBIS&rdquo;</span> - A New World of possibilities!</span>
                                </p>
                            </motion.div>
                        </motion.div>

                        {/* YouTube Embed */}
                        <motion.div
                            className="flex-1 w-full max-w-lg lg:max-w-xl"
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
                        >
                            <motion.div
                                className={`${isDystopia ? "is-dystopia" : ""} p-2 md:p-3`}
                                style={{
                                    // clipPath: "polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)"
                                }}
                                whileHover={{ scale: 1.02 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                                    <iframe
                                        className="absolute top-0 left-0 w-full h-full rounded-lg"
                                        src="https://www.youtube.com/embed/lzJDI164T-k"
                                        title="OJASS 2026 Promo"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                        style={{
                                            border: 'none',
                                            boxShadow: isDystopia
                                                ? "0 0 30px rgba(255, 100, 0, 0.6)"
                                                : "0 0 30px rgba(0, 255, 255, 0.6)"
                                        }}
                                    ></iframe>
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}
