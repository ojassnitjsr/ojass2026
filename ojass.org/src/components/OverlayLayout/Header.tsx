"use client";

import { useTheme } from "@/contexts/ThemeContext";
import gsap from "gsap";
import { useEffect, useRef } from "react";
import Link from "next/link";

export default function Header() {
  const { theme } = useTheme();
  const isDystopia = theme === "dystopia";
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Inject clip-path styles
    let styleElement = document.getElementById('header-clip-styles') as HTMLStyleElement;

    if (!styleElement) {
      styleElement = document.createElement('style');
      styleElement.id = 'header-clip-styles';
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
        .clip-right {
          clip-path: polygon(
            0 0, 
            calc(100% - 20px) 0, 
            100% 20px, 
            100% 100%, 
            20px 100%, 
            0 calc(100% - 20px)
          );
        }
    `;

    if (!headerRef.current) return;
    gsap.fromTo(
      headerRef.current,
      { y: -20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power2.out", delay: 0.2 }
    );
  }, []);

  return (
    <div
      ref={headerRef}
      className="fixed top-0 left-0 w-full z-[100] px-2 sm:px-4 pointer-events-none"
    >
      <div className="flex justify-center w-full">
        <div
          className={`layout-panel layout-text font-bold relative px-4 sm:px-6 md:px-9 py-2 sm:py-3 ${isDystopia ? "is-dystopia" : ""
            }`}
          style={{
            clipPath:
              "polygon(0% 0%, 100% 0%, 97% 65%, 80% 100%, 63% 100%, 60% 95%, 40% 95%, 37% 100%, 20% 100%, 3% 65%)",
          }}
        >
          <div className="flex items-center justify-center gap-3 sm:gap-6 text-base sm:text-xl md:text-2xl whitespace-nowrap">
            <span>OJASS 2026</span>
          </div>
        </div>
      </div>

      {/* Extreme Left - Sponsors */}
      <div className="absolute top-6 left-6 h-full flex items-start overflow-hidden">
        <Link
          href="https://sponsors.ojass.org" target="_blank"
          className={`clip-left layout-panel layout-text !border-0 pointer-events-auto px-6 py-3 font-bold text-sm md:text-lg hover:scale-105 active:scale-95 transition-all duration-300 ${isDystopia ? "is-dystopia" : ""}`}
        >
          SPONSORS
        </Link>
      </div>

      {/* Extreme Right - Ambassadors */}
      <div className="absolute top-6 right-6 h-full flex items-start overflow-hidden">
        <Link
          href="https://ambassadors.ojass.org" target="_blank"
          className={`clip-right layout-panel layout-text !border-0 pointer-events-auto px-6 py-3 font-bold text-sm md:text-lg hover:scale-105 active:scale-95 transition-all duration-300 ${isDystopia ? "is-dystopia" : ""}`}
        >
          AMBASSADORS
        </Link>
      </div>
    </div>
  );
}
