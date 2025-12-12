"use client";

import BrokenGlass from '@/components/BrokenGlass';
import { useTheme } from '@/contexts/ThemeContext';

export default function TeamPage() {
    const { theme } = useTheme();
    const isDystopia = theme === "dystopia";

    // Image paths - replace with your actual images
    const images = [
        "/profile.png",
        "/profile.png",
        "/profile.png",
        "/profile.png",
        "/profile.png",
        "/profile.png",
        "/profile.png",
        "/profile.png",
    ];

    return (
        <div
            style={{
                position: 'relative',
                height: '100vh',
                width: '100vw',
                overflow: 'hidden',
            }}
        >
            {/* Layer 1: Background Image (Behind everything) */}
            <div
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundImage: !isDystopia ? 'url("/bg_main_eut.jpg")' : 'url("/bg_main_dys.png")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    zIndex: 1,
                }}
            />

            {/* Layer 2: Glass Screen Effect (Middle layer) */}
            <div
                style={{
                    position: 'absolute',
                    top: '12vh',
                    left: '5vw',
                    right: '5vw',
                    height: '83vh',
                    background: isDystopia
                        ? 'rgba(40, 20, 10, 0.15)'
                        : 'rgba(0, 20, 40, 0.15)',
                    backdropFilter: 'blur(20px) saturate(180%)',
                    WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                    border: isDystopia
                        ? '2px solid rgba(255, 100, 0, 0.6)'
                        : '2px solid rgba(0, 255, 255, 0.6)',
                    boxShadow: isDystopia
                        ? '0 0 40px rgba(255, 100, 0, 0.4), inset 0 0 40px rgba(255, 100, 0, 0.1)'
                        : '0 0 40px rgba(0, 255, 255, 0.4), inset 0 0 40px rgba(0, 255, 255, 0.1)',
                    zIndex: 2,
                    overflow: 'hidden',
                }}
            >
                {/* Animated scan line effect */}
                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: '-100%',
                        width: '100%',
                        height: '100%',
                        background: isDystopia
                            ? 'linear-gradient(90deg, transparent 0%, rgba(255, 100, 0, 0.1) 50%, transparent 100%)'
                            : 'linear-gradient(90deg, transparent 0%, rgba(0, 255, 255, 0.1) 50%, transparent 100%)',
                        animation: 'scan 3s linear infinite',
                        pointerEvents: 'none',
                    }}
                />
            </div>

            {/* Layer 3: Profile Grid (On top of glass screen) */}
            <div
                style={{
                    position: 'absolute',
                    top: '14vh',
                    left: '7.5vw',
                    right: '7.5vw',
                    height: '78vh',
                    overflowY: 'auto',
                    overflowX: 'hidden',
                    zIndex: 3,
                }}
                className="custom-scrollbar"
            >
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                        gap: '2rem',
                        padding: '1rem',
                        justifyContent: 'center',
                    }}
                >
                    {images.map((imageSrc, index) => (
                        <div
                            key={index}
                            style={{
                                aspectRatio: '3 / 4',
                                overflow: 'hidden',
                                position: 'relative',
                                // background: isDystopia
                                //     ? 'rgba(40, 20, 10, 0.3)'
                                //     : 'rgba(0, 20, 40, 0.3)',
                                // backdropFilter: 'blur(10px)',
                                // border: isDystopia
                                //     ? '1px solid rgba(255, 100, 0, 0.3)'
                                //     : '1px solid rgba(0, 255, 255, 0.3)',
                                // boxShadow: isDystopia
                                //     ? '0 0 20px rgba(255, 100, 0, 0.2)'
                                //     : '0 0 20px rgba(0, 255, 255, 0.2)',
                                transition: 'all 0.3s ease',
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-5px)';
                                // e.currentTarget.style.boxShadow = isDystopia
                                //     ? '0 0 30px rgba(255, 100, 0, 0.4)'
                                //     : '0 0 30px rgba(0, 255, 255, 0.4)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                // e.currentTarget.style.boxShadow = isDystopia
                                //     ? '0 0 20px rgba(255, 100, 0, 0.2)'
                                //     : '0 0 20px rgba(0, 255, 255, 0.2)';
                            }}
                        >
                            <BrokenGlass
                                imageSrc={imageSrc}
                                rows={isDystopia ? 6 : 5}
                                cols={isDystopia ? 6 : 5}
                                width={300}
                                height={400}
                                initialAssembled={!isDystopia}
                                showControls={false}
                                clickToToggle={false}
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* CSS for scan animation and custom scrollbar */}
            <style jsx>{`
                @keyframes scan {
                    0% {
                        left: -100%;
                    }
                    100% {
                        left: 100%;
                    }
                }

                .custom-scrollbar::-webkit-scrollbar {
                    width: 8px;
                }

                .custom-scrollbar::-webkit-scrollbar-track {
                    background: ${isDystopia ? 'rgba(40, 20, 10, 0.3)' : 'rgba(0, 20, 40, 0.3)'};
                    border-radius: 4px;
                }

                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: ${isDystopia ? 'rgba(255, 100, 0, 0.5)' : 'rgba(0, 255, 255, 0.5)'};
                    border-radius: 4px;
                }

                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: ${isDystopia ? 'rgba(255, 100, 0, 0.7)' : 'rgba(0, 255, 255, 0.7)'};
                }
            `}</style>
        </div>
    );
}