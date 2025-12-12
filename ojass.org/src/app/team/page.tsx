"use client";

import BrokenGlass from '@/components/BrokenGlass';
import { useTheme } from '@/contexts/ThemeContext';

export default function ImageGalleryPage() {
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
                height: '100vh',
                background: 'linear-gradient(135deg, #0d1021 0%, #1a1f3a 50%, #0d1021 100%)',
                padding: '4rem 2rem',
                backgroundImage: 'url("/bg_main_eut.jpg")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                overflow: 'scroll',
            }}
        >
            {/* Image Grid */}
            <div style={{
                // backgroundColor: "red",
                height: "80vh",
                overflow: "scroll",
                width: "90vw",
                margin: "0 auto",
            }}>
                <div
                    style={{
                        width: '90vw',
                        margin: '0 auto',
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                        gap: '1rem',
                    }}
                >
                    {images.map((imageSrc, index) => (
                        <div
                            key={index}
                            style={{
                                aspectRatio: '3 / 4',
                                overflow: 'hidden',
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
        </div>
    );
}