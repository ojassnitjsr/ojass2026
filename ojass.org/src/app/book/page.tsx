"use client";

import { Experience } from "@/components/book/Experience";
import { UI } from "@/components/book/UI";
import { Loader } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { IoExitOutline } from "react-icons/io5";
import { useTheme } from "@/contexts/ThemeContext";

function App() {
    const [cameraZ, setCameraZ] = useState(6);
    const { theme } = useTheme();
    const isDystopia = theme === "dystopia";

    useEffect(() => {
        let styleElement = document.getElementById(
            "policy-clip-styles",
        ) as HTMLStyleElement;

        if (!styleElement) {
            styleElement = document.createElement("style");
            styleElement.id = "policy-clip-styles";
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

        const handleResize = () => setCameraZ(window.innerWidth > 800 ? 4 : 9);
        handleResize();
        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
            styleElement?.remove();
        };
    }, []);

    return (
        <div className="relative h-screen w-screen overflow-hidden">
            <div className="absolute inset-0 bg-[url('/bg_main_eut.jpg')] z-1 bg-center bg-cover blur-xs" />
            <div className="absolute inset-0 bg-[url('/book/book_bg_eut_nobg.png')] z-2 bg-center bg-cover" />

            <Link
                href="/"
                className={`clip-left absolute top-6 left-6 z-50 flex items-center gap-2 px-6 py-3 backdrop-blur-sm transition-all duration-300 hover:scale-105 active:scale-95 ${
                    isDystopia
                        ? "bg-[#ee8f59]/20 hover:bg-[#ee8f59]/40 text-white"
                        : "bg-cyan-500/20 hover:bg-cyan-500/40 text-white"
                }`}>
                <IoExitOutline size={20} />
                <span className="font-semibold tracking-wider">EXIT</span>
            </Link>

            <div className="relative z-10 h-full w-full">
                <UI />
                <Loader />
                <Canvas
                    shadows
                    camera={{
                        position: [-0.5, 1, cameraZ],
                        fov: 45,
                    }}>
                    <group position-y={0}>
                        <Suspense fallback={null}>
                            <Experience />
                        </Suspense>
                    </group>
                </Canvas>
            </div>
        </div>
    );
}

export default App;
