"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Image from "next/image";

// --- Components ---

function SnowfallBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const handleResize = () => {
      setSize({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const snowImage = new window.Image();
    snowImage.src = "/snow.png";

    const particles: {
      x: number;
      y: number;
      vy: number;
      size: number;
      swing: number;
      swingSpeed: number;
      rotation: number;
      baseRotationSpeed: number;
    }[] = [];

    // Create particles - Reduced intensity (approx half of previous)
    const particleCount = Math.min(75, Math.floor((canvas.width * canvas.height) / 12000));

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vy: Math.random() * 0.8 + 0.2, // Slower fall speed (0.2 - 1.0)
        size: Math.random() * 15 + 8,  // Slightly larger variance
        swing: Math.random() * Math.PI * 2,
        swingSpeed: Math.random() * 0.03 + 0.005, // Slower swing
        rotation: Math.random() * 360,
        baseRotationSpeed: (Math.random() - 0.5) * 0.6, // Rotation speed
      });
    }

    let animationFrameId: number;
    let imageLoaded = false;

    snowImage.onload = () => {
      imageLoaded = true;
    };

    // If image is already cached/loaded
    if (snowImage.complete) {
      imageLoaded = true;
    }

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (imageLoaded) {
        ctx.shadowColor = "rgba(255, 255, 255, 0.8)";
        ctx.shadowBlur = 5;

        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];

          p.y += p.vy;
          p.x += Math.sin(p.swing) * 0.3; // Reduced sway amplitude
          p.swing += p.swingSpeed;
          p.rotation += p.baseRotationSpeed;

          // Loop
          if (p.y > canvas.height + p.size) {
            p.y = -p.size;
            p.x = Math.random() * canvas.width;
          }
          if (p.x > canvas.width + p.size) p.x = -p.size;
          if (p.x < -p.size) p.x = canvas.width + p.size;

          ctx.globalAlpha = Math.min(0.8, p.size / 25);

          // Rotation logic
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation * Math.PI / 180);
          ctx.drawImage(snowImage, -p.size / 2, -p.size / 2, p.size, p.size);
          ctx.restore();

          ctx.globalAlpha = 1.0;
        }
        ctx.shadowBlur = 0;
      } else {
        // Fallback if image not ready (simple white circles)
        ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          p.y += p.vy;
          p.x += Math.sin(p.swing) * 0.3;
          p.swing += p.swingSpeed;
          if (p.y > canvas.height) { p.y = -p.size; p.x = Math.random() * canvas.width; }

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size / 4, 0, Math.PI * 2); // Smaller circle than image
          ctx.fill();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animationFrameId);
  }, [size]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-10"
    />
  );
}

// --- Flip Clock Components ---

function FlipCard({ value, label }: { value: number; label: string }) {
  const [currentValue, setCurrentValue] = useState(value);
  const [previousValue, setPreviousValue] = useState(value);
  const [isFlipping, setIsFlipping] = useState(false);

  // Sync prop changes to state
  if (value !== currentValue && !isFlipping) {
    setPreviousValue(currentValue);
    setCurrentValue(value);
    setIsFlipping(true);
  }

  useEffect(() => {
    if (isFlipping) {
      const timer = setTimeout(() => {
        setIsFlipping(false);
      }, 600); // match animation duration
      return () => clearTimeout(timer);
    }
  }, [isFlipping]);

  const currentFormatted = currentValue.toString().padStart(2, "0");
  const previousFormatted = previousValue.toString().padStart(2, "0");

  return (
    <div className="flex flex-col items-center mx-1 md:mx-3 z-40">
      <div className="relative w-14 h-20 md:w-20 md:h-28 bg-[#1e1e24] rounded-lg shadow-xl font-mono text-4xl md:text-5xl flip-clock-container group">

        {/*
            FLIP LOGIC (4 LAYERS):
            1. Static Top: Show CURRENT (Next Value)
            2. Static Bottom: Show PREVIOUS (Old Value)
            3. Anim Top (Front): Show PREVIOUS... Flips down to become...
            4. Anim Bottom (Back): Show CURRENT... Flips down on top of Static Bottom
        */}

        {/* STATIC LAYER TOP: CURRENT */}
        <div className="flip-half flip-top z-0">
          <div className="flip-text">{currentFormatted}</div>
        </div>
        {/* STATIC LAYER BOTTOM: PREVIOUS (Only visible when Anim Top flips down?) 
            Actually: 
            If we are flipping 10 -> 09.
            Static Top: 09.
            Static Bottom: 10 (Wait, eventually Static Bottom must be 09).
            
            Let's stick to the "Falling Leaf" model:
            - Background Top: CURRENT (09)
            - Background Bottom: PREVIOUS (10) -> Covered by Anim Bottom (09)
            - Anim Top: PREVIOUS (10) -> Covers Background Top (09), flips down.
            - Anim Bottom: CURRENT (09) -> Backface of Anim Top? Or separate element?
              In our CSS, we use separate elements.
         */}
        <div className="flip-half flip-bottom z-0">
          <div className="flip-text">{isFlipping ? previousFormatted : currentFormatted}</div>
        </div>


        {/* DYNAMIC LAYERS */}
        {isFlipping && (
          <>
            {/* TOP LEAF (Old Value): Starts at 0, flips to -180 */}
            <div className="flip-half flip-top anim-flip-top">
              <div className="flip-text">{previousFormatted}</div>
              <div className="absolute inset-0 bg-black/10"></div>
            </div>

            {/* BOTTOM LEAF (New Value): Starts at 180, flips to 0 */}
            <div className="flip-half flip-bottom anim-flip-bottom">
              <div className="flip-text">{currentFormatted}</div>
              {/* Shadow */}
              <div className="absolute inset-0 bg-black/10"></div>
            </div>
          </>
        )}

        {/* Middle Line */}
        <div className="absolute top-1/2 left-0 w-full h-px bg-black/80 z-50 shadow-[0_1px_0_rgba(255,255,255,0.05)]" />
      </div>

      <span className="mt-3 text-[10px] md:text-xs font-bold tracking-[0.2em] text-cyan-200/60 uppercase">
        {label}
      </span>
    </div>
  );
}

function CountdownTimer({ targetDate }: { targetDate: string }) {
  const calculateTimeLeft = useCallback(() => {
    const difference = +new Date(targetDate) - +new Date();
    if (difference > 0) {
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }, [targetDate]);

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, [calculateTimeLeft]);

  if (!timeLeft) return null;

  return (
    <div className="flex justify-center flex-wrap mt-8 md:mt-12 scale-90 md:scale-100">
      <FlipCard value={timeLeft.days} label="Days" />
      <FlipCard value={timeLeft.hours} label="Hours" />
      <FlipCard value={timeLeft.minutes} label="Minutes" />
      <FlipCard value={timeLeft.seconds} label="Seconds" />
    </div>
  );
}

function LogoVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 2.0;
    }
  }, []);

  return (
    <video
      ref={videoRef}
      src="/ojass.mkv"
      autoPlay
      loop
      muted
      playsInline
      className="w-10 h-10 md:w-14 md:h-14 scale-160"
    />
  );
}

export default function Home() {

  return (
    <div className="relative h-screen overflow-hidden text-white selection:bg-cyan-300/30 font-sans bg-[#050a14]">
      {/* Background Layer with Winter Overlay */}
      <div className="fixed inset-0 z-0">
        <Image
          src="/background.jpg"
          alt="Ojass Winter Background"
          fill
          className="object-cover blur-xs scale-105 opacity-60"
          priority
        />
        {/* Icy Overlay */}
        <div className="absolute inset-0 bg-linear-to-b from-slate-900/60 via-blue-950/40 to-black/80 pointer-events-none mix-blend-multiply" />
        <div className="absolute inset-0 bg-cyan-900/10 pointer-events-none mix-blend-overlay" />
      </div>

      <SnowfallBackground />

      <div className="relative z-20 h-full flex flex-col items-center w-full max-w-[1920px] mx-auto">
        {/* Navbar */}
        <header className="w-full px-4 py-3 md:py-4 md:px-6 flex justify-between items-center z-30 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 md:w-14 md:h-14 overflow-hidden rounded-lg object-contain shadow-blue-500/30 shadow-lg border border-cyan-500/20 bg-black">
              <LogoVideo />
            </div>
            <span className="text-lg md:text-xl font-bold tracking-wider text-cyan-50">OJASS</span>
          </div>
          <nav className="flex gap-4 md:gap-6 text-xs md:text-sm font-medium text-cyan-100/80">
            <a
              href="https://sponsor.ojass.org"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors flex items-center gap-1.5 group bg-white/5 px-3 py-1.5 rounded-full border border-white/10 hover:border-cyan-300/50 hover:bg-white/10"
            >
              <span>Sponsors</span>
              <svg className="w-3.5 h-3.5 text-cyan-400 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </nav>
        </header>

        {/* Main Content */}
        <main className="grow flex flex-col items-center justify-center text-center px-4 pb-16 w-full">

          {/* Website Launch Pill */}
          <div className="mb-4 md:mb-6 animate-fade-in opacity-0 [animation-delay:0.5s]">
            <span className="px-3 py-1 md:py-1.5 rounded-full bg-blue-500/10 border border-cyan-400/30 text-cyan-200 font-bold tracking-widest text-[10px] md:text-xs uppercase shadow-[0_0_15px_-3px_rgba(34,211,238,0.2)]">
              ❄️ Website Launching: 15<sup className="lowercase">th</sup> Dec, 2025
            </span>
          </div>

          <div className="inline-block mb-3 px-3 py-1 md:py-1.5 rounded-full border border-cyan-400/20 bg-cyan-500/5 backdrop-blur-md">
            <span className="text-[10px] md:text-sm font-semibold text-cyan-300 tracking-wide uppercase">
              The Annual Techno-Management Fest
            </span>
          </div>

          <h1 className="leading-none mb-2 md:mb-4 relative select-none">
            <span className="block text-5xl md:text-8xl lg:text-9xl font-black tracking-tighter bg-clip-text text-transparent bg-linear-to-b from-white via-cyan-100 to-cyan-300 drop-shadow-[0_0_25px_rgba(34,211,238,0.2)]">
              OJASS
            </span>
            <span className="block text-3xl md:text-5xl lg:text-6xl font-bold text-transparent bg-clip-text bg-linear-to-r from-cyan-300 via-blue-400 to-indigo-400 md:mt-[-0.1em] tracking-[0.2em] md:tracking-[0.4em]">
              2026
            </span>
          </h1>

          <p className="text-sm md:text-xl text-cyan-100/80 mt-2 md:mt-4 max-w-xl font-light">
            Igniting Innovation at <span className="font-semibold text-white">NIT Jamshedpur</span>
          </p>

          <div className="mt-3 md:mt-5 flex items-center justify-center gap-2 md:gap-3 text-cyan-200/90 font-mono text-xs md:text-sm border border-cyan-500/20 bg-cyan-950/30 px-4 py-1.5 rounded-lg backdrop-blur-md">
            <svg
              className="w-4 h-4 text-cyan-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span>Feb 19 – Feb 22, 2026</span>
          </div>

          <CountdownTimer targetDate="2026-02-19T09:00:00" />

          <p className="mt-4 md:mt-6 text-[10px] md:text-xs text-cyan-200/50 font-mono tracking-widest">
            LEFT FOR EVENT
          </p>
        </main>

        <footer className="absolute bottom-2 text-cyan-200/40 text-[10px] md:text-xs text-center w-full px-2 flex justify-between">
         <div>
           &copy; 2026 Ojass Team, NIT Jamshedpur.
         </div>
         <div>
          powered by <a href="https://www.digicraft.one" className="underline" target="_blank">DigiCraft</a>
         </div>
        </footer>
      </div>
    </div>
  );
}
