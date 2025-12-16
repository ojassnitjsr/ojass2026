"use client";

import { useTheme } from '@/contexts/ThemeContext';
import { useGSAP } from '@gsap/react';
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, useState } from 'react';
export default function Home() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const { theme } = useTheme();
  const isDystopia = theme === "dystopia";
  if (typeof window !== 'undefined' && (gsap as any).registeredPlugins?.includes?.(ScrollTrigger) !== true) {
    gsap.registerPlugin(ScrollTrigger);
  }

  // Detect if device is mobile/touch-based
  useEffect(() => {
    const checkMobile = () => {
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      const isSmallScreen = window.matchMedia('(max-width: 768px)').matches;
      setIsMobile(isTouchDevice || isSmallScreen);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // Throttled mouse tracking - ONLY on desktop
  useEffect(() => {
    // Skip mouse tracking on mobile devices
    if (isMobile) return;

    let rafId: number;
    let lastTime = 0;
    const throttleMs = 16; // ~60fps

    const handleMouseMove = (e: MouseEvent) => {
      const now = performance.now();

      if (now - lastTime < throttleMs) return;
      lastTime = now;

      // Cancel any pending animation frame
      if (rafId) cancelAnimationFrame(rafId);

      // Use requestAnimationFrame for smooth updates
      rafId = requestAnimationFrame(() => {
        // Normalize to -1 to 1 range, centered at 0 based on window size to support all sections
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;

        const normalizedX = (x - 0.5) * 2;
        const normalizedY = (y - 0.5) * 2;

        setMousePosition({ x: normalizedX, y: normalizedY });
      });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [isMobile]);


  // GSAP animations for parallax effect - moving the divs themselves
  useGSAP(() => {
    // Skip mouse-based parallax on mobile devices
    if (isMobile) return;

    // Animate layers based on mouse position
    const animateLayers = () => {
      const { x, y } = mousePosition;

      // --- SECTION 1 PARALLAX ---
      const bgSpeed = 0.1;
      const layer2Speed = 0.3;
      const layer3Speed = 0.5;
      const bottomSpeed = 0.7;
      const titleSpeed = 0.9;

      // Shared animation config for better performance
      const animConfig = {
        duration: 0.3,
        ease: 'power2.out',
        force3D: true, // GPU acceleration
      };

      // Move the actual divs instead of background position
      gsap.to('#bg', {
        x: x * bgSpeed * 40,
        y: y * bgSpeed * 30,
        rotationX: y * bgSpeed * 0.5,
        rotationY: x * bgSpeed * 0.5,
        transformOrigin: 'center center',
        ...animConfig,
      });

      gsap.to('#layer2', {
        x: x * layer2Speed * 60,
        y: y * layer2Speed * 40,
        rotationX: y * layer2Speed * 1,
        rotationY: x * layer2Speed * 1,
        transformOrigin: 'center center',
        ...animConfig,
      });

      gsap.to('#layer3', {
        x: x * layer3Speed * 80,
        y: y * layer3Speed * 50,
        rotationX: y * layer3Speed * 1.5,
        rotationY: x * layer3Speed * 1.5,
        transformOrigin: 'center center',
        ...animConfig,
      });

      gsap.to('#bottom', {
        x: x * bottomSpeed * 100,
        y: y * bottomSpeed * 60,
        ...animConfig,
      });

      gsap.to('#title', {
        x: x * titleSpeed * 80,
        y: y * titleSpeed * 50,
        rotationY: x * titleSpeed * 1.2,
        transformOrigin: 'center center',
        ...animConfig,
      });

      // --- SECTION 2 PARALLAX ---
      // Adding parallax for cave section elements using similar logic
      const caveInnerSpeed = 0.2;
      const rocketSpeed = 0.6;
      const title2Speed = 0.8;

      gsap.to('#cave-inner', {
        x: x * caveInnerSpeed * 40,
        y: y * caveInnerSpeed * 40,
        ...animConfig,
      });

      // Rocket: Only apply mouse parallax to X axis (horizontal)
      // Y axis is controlled by scroll animation
      gsap.to('#rocket', {
        x: x * rocketSpeed * 80,
        overwrite: 'auto', // Don't overwrite Y from scroll animation
        ...animConfig,
      });

      // Title2: Only apply mouse parallax to X axis (horizontal)
      // Y axis is controlled by scroll animation
      gsap.to('#title2', {
        x: x * title2Speed * 70,
        rotationY: x * title2Speed * 1.0,
        transformOrigin: 'center center',
        overwrite: 'auto', // Don't overwrite Y from scroll animation
        ...animConfig,
      });
      // Cave Outer is static as per previous request
    };

    animateLayers();
  }, [mousePosition, isMobile]);

  useGSAP(() => {
    if (!containerRef.current) return;

    const firstSectionHeight = window.innerHeight; // Height of first section

    ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top top',
      end: 'bottom+=100% top',
      scrub: 1, // Smooth scrubbing with 1 second delay
      invalidateOnRefresh: true,
      onUpdate: () => {
        const scrollY = window.scrollY;
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        const progress = maxScroll > 0 ? scrollY / maxScroll : 0;

        // Parallax speeds: 
        // We use negative Y to move elements UP as the user scrolls DOWN (Natural scroll direction).

        // Title (Floating text) - Moves down with scroll, will go behind bottom layer
        gsap.set('#title', {
          y: scrollY,
          scale: 1 + progress * 0.05,
          force3D: true,
        });

        // Bottom (Foreground) - Moves naturally with scroll (Speed ~1.0)
        // This "cancels" relative motion between the scroll and this element's position on page.
        gsap.set('#bottom', {
          y: 0,
          force3D: true,
        });

        // Layer3 (Behind bottom) - Moves slower (Speed ~0.6)
        gsap.set('#layer3', {
          y: scrollY * 0.3,
          scale: 1 + progress * 0.02,
          force3D: true,
        });

        // Layer2 (Behind layer3) - Moves slower (Speed ~0.3)
        gsap.set('#layer2', {
          y: scrollY * 0.6,
          scale: 1 + progress * 0.04,
          force3D: true,
        });

        // Background (Furthest) - Moves slowest (Speed ~0.1)
        gsap.set('#bg', {
          y: scrollY * 0.9,
          scale: 1 + progress * 0.06,
          rotationX: progress * 2,
          transformOrigin: 'center center',
          force3D: true,
        });

        // Title2 (Second section) - Synced with first title's movement
        // When scrollY reaches the second section, title2 should appear from behind cave
        const secondSectionStart = firstSectionHeight;

        if (scrollY >= secondSectionStart * 0.5) {
          // Start showing title2 after 50% scroll of first section
          const title2Progress = Math.min(1, (scrollY - secondSectionStart * 0.5) / (secondSectionStart * 0.5));
          // CSS position is -20vh, we need to move it to 40vh (40%)
          // Total movement: 40vh - (-20vh) = 60vh
          gsap.set('#title2', {
            y: title2Progress * 60 * window.innerHeight / 100, // From 0 to 60vh (CSS -20vh + 60vh = 40vh)
            force3D: true,
          });
        } else {
          gsap.set('#title2', {
            y: 0, // Keep at CSS position -20vh
            force3D: true,
          });
        }
      }
    });
  }, []);

  useGSAP(() => {
    // Parallax for the second section (Cave & Rocket)
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '#second-section',
        start: 'top 50%', // Start when the top of the section enters the middle of the viewport
        end: 'bottom bottom',   // End when the bottom of the section hits the bottom of viewport
        scrub: 1, // Smooth scrubbing
        invalidateOnRefresh: true,
      }
    });

    // Cave Inner moves slightly (Parallax)
    tl.from('#cave-inner', {
      y: '0vh',
      ease: 'none',
    }, 0);

    // Rocket comes up from down (Significant movement)
    // CSS position: top: 150vh (rocket is below the viewport, hidden)
    // Transform from y:0 to y:-120vh (moves UP by 120vh)
    tl.fromTo('#rocket', {
      y: 0,
    }, {
      y: '-125vh',
      ease: 'none',
    }, 0);

    // Title 2 Y-axis is controlled by the main ScrollTrigger above for sync with first title
    // Rocket Y-axis is controlled by timeline above
    // Mouse parallax controls X-axis for both (horizontal movement only)

    // Cave Outer is static (No animation applied, scrolls naturally with the container)

  }, []);

  return (
    <>
      <div
        ref={containerRef}
        className="w-full h-screen bg-black relative overflow-hidden"
        style={{
          perspective: '1000px',
          transformStyle: 'preserve-3d',
          overflowX: 'hidden',
        }}
      >
        <div
          className="fixed top-0 left-0 "
          id="bg"
          style={{
            width: '104vw',
            height: '65vh',
            marginLeft: '-2vw',
            marginTop: '-2vh',
            backgroundImage: isDystopia ? 'url(/homelayer/sky_dys.png)' : 'url(/homelayer/sky.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            transformStyle: 'preserve-3d',
            willChange: 'transform',
            backfaceVisibility: 'hidden',
          }}
        ></div>

        <div
          className="fixed top-[42vh] left-0"
          id="layer2"
          style={{
            width: '110vw',
            height: '80vh',
            marginLeft: '-5vw',
            backgroundImage: isDystopia ? 'url(/homelayer/behindmountain_dys.png)' : 'url(/homelayer/behindmountain.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            // filter: isDystopia ? 'brightness(1.2) hue-rotate(180deg)' : 'blur(0px) brightness(1.2) hue-rotate(0deg)',
            transformStyle: 'preserve-3d',
            willChange: 'transform',
            backfaceVisibility: 'hidden',
            // backgroundColor: 'red',
          }}
        ></div>

        <div
          className="fixed bottom-[5vh] -left-[5vw] flex flex-row justify-between"
          id="layer3"
          style={{
            width: '110vw',
            height: '72vh',
            marginLeft: '0vw',
            transformStyle: 'preserve-3d',
            willChange: 'transform',
            backgroundImage: isDystopia ? 'url(/homelayer/mainmountain_dys.png)' : 'url(/homelayer/mainmountain.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backfaceVisibility: 'hidden',
          }}
        >
        </div>

        <div
          id="title"
          className={`fixed top-[30%] font-bold text-[200px] text-center w-full bg-contain bg-center bg-no-repeat h-[35vh] ${isDystopia ? 'bg-[url(/text_main_dys_nobg.png)]' : 'bg-[url(/text_main_dys_nobg.png)]'}`}
          style={{ willChange: 'transform', pointerEvents: 'none', filter: isDystopia ? 'hue-rotate(180deg)' : 'hue-rotate(0deg)', backfaceVisibility: 'hidden' }}
        >
        </div>

        <div
          className="fixed bottom-[0vh] left-0"
          // id="bottom"
          style={{
            width: '100vw',
            height: '64vh',
            marginLeft: '0vw',
            backgroundImage: isDystopia ? 'url(/homelayer/bottom_dys.png)' : 'url(/homelayer/bottom.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'bottom center',
            backgroundRepeat: 'no-repeat',
            willChange: 'transform',
            backfaceVisibility: 'hidden',
            // filter: isDystopia ? 'hue-rotate(180deg)' : 'hue-rotate(0deg)',
          }}
        ></div>
      </div>
      <div id="second-section" className='w-full h-screen bg-white relative overflow-hidden'>
        <div
          className="absolute -bottom-[2vh] -left-[2vw]"
          id="cave-inner"
          style={{
            width: '104vw',
            height: '104vh',
            marginLeft: '0',
            backgroundImage: isDystopia ? 'url(/homelayer/caveinner_dys.png)' : 'url(/homelayer/caveinner.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center center',
            backgroundRepeat: 'no-repeat',
            willChange: 'transform',
            backfaceVisibility: 'hidden',
          }}
        ></div>
        <div
          id="title2"
          className={`absolute -top-[30vh] font-bold text-[200px] text-center w-full bg-contain bg-center bg-no-repeat h-[35vh] ${isDystopia ? 'bg-[url(/text_main_dys_nobg.png)]' : 'bg-[url(/text_main_dys_nobg.png)]'}`}
          style={{ willChange: 'transform', pointerEvents: 'none', filter: isDystopia ? 'hue-rotate(180deg)' : 'hue-rotate(0deg)', backfaceVisibility: 'hidden' }}
        >
        </div>
        <div
          className="absolute top-[150vh] left-0"
          id="rocket"
          style={{
            width: '100vw',
            height: '70vh',
            marginLeft: '0',
            backgroundImage: isDystopia ? 'url(/homelayer/rocket_dys.png)' : 'url(/homelayer/rocket.png)',
            backgroundSize: 'contain',
            backgroundPosition: 'center center',
            backgroundRepeat: 'no-repeat',
            willChange: 'transform',
            backfaceVisibility: 'hidden',
          }}
        ></div>
        <div
          className="absolute top-0 left-0"
          id="cave-outer"
          style={{
            width: '100vw',
            height: '100vh',
            marginLeft: '0',
            backgroundImage: isDystopia ? 'url(/homelayer/caveouter_dys.png)' : 'url(/homelayer/caveouter.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'top center',
            backgroundRepeat: 'no-repeat',
          }}
        ></div>
      </div>
    </>
  );
}