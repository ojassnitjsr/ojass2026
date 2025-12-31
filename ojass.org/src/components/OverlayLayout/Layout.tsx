"use client";

import Bot from "@/components/Bot";
import Footer from "@/components/OverlayLayout/Footer";
import GlitchTransition from "@/components/OverlayLayout/GlitchTransition";
import Header from "@/components/OverlayLayout/Header";
import "@/components/OverlayLayout/layout.css";
import LeftPanel from "@/components/OverlayLayout/LeftPanel";
import RightPanel from "@/components/OverlayLayout/RightPanel";
import ThemeToggleButton from "@/components/OverlayLayout/ThemeToggle/ThemeToggleButton";
import { useTheme } from "@/contexts/ThemeContext";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function OverlayLayout() {
    const { toggleTheme, theme } = useTheme();
    const isDystopia = theme === "dystopia";
    const path = usePathname();

    const [showGlitch, setShowGlitch] = useState(false);
    const handleThemeChange = async () => {
        setShowGlitch(true);
        setTimeout(async () => {
            setShowGlitch(false);
            await toggleTheme("glitch");
        }, 2000);
    };

    const matched = path === "/" || path === "/login" || path === "/team";

    return (
        <>
            {matched ? (
                <>
                    <Header />
                    <RightPanel />
                    <LeftPanel />
                    <Footer />
                </>
            ) : null}

            {path !== "/bot" && <Bot />}
            <ThemeToggleButton onToggle={handleThemeChange} />

            {/* <div className={`fixed h-[100vh] w-[100vw] top-0 left-0 bg-[url('/glass-1.png')] bg-contain bg-center bg-no-repeat z-[10000] pointer-events-none ${isDystopia ? "visible" : "invisible"}`}> */}

            {/* </div> */}
            <GlitchTransition
                isVisible={showGlitch}
                src={"glitch-effect.mov"}
            />
            
        </>
    );
}
