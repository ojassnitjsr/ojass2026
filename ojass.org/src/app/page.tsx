"use client";

import { useTheme } from '@/contexts/ThemeContext';
import { useGSAP } from '@gsap/react';
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, useState, useLayoutEffect } from 'react';

export default function Home() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [imgDims, setImgDims] = useState({ width: 0, height: 0, splitTop: 0, splitBottom: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const { theme } = useTheme();
  const isDystopia = theme === "dystopia";

  if (typeof window !== 'undefined' && (gsap as any).registeredPlugins?.includes?.(ScrollTrigger) !== true) {
    gsap.registerPlugin(ScrollTrigger);
  }

  // --- RESPONSIVE IMAGE LOGIC ---
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
        splitBottom: renderSplitBottom
      });
    };

    calculateDimensions();
    window.addEventListener('resize', calculateDimensions);
    return () => window.removeEventListener('resize', calculateDimensions);
  }, []);
  
  // Smooth mouse tracking
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;
      const normalizedX = (x - 0.5) * 2;
      const normalizedY = (y - 0.5) * 2;
      setMousePosition({ x: normalizedX, y: normalizedY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // GSAP Mouse Parallax
  useGSAP(() => {
    const { x, y } = mousePosition;

    // Speeds
    const bgSpeed = 0.1;
    const layer2Speed = 0.3;
    const layer3Speed = 0.5;
    const titleSpeed = 0.9;
    
    // Section 1 Backgrounds
    gsap.to('#bg', {
      x: x * bgSpeed * 40,
      y: y * bgSpeed * 30,
      rotationX: y * bgSpeed * 0.5,
      rotationY: x * bgSpeed * 0.5,
      transformOrigin: 'center center',
      duration: 0.5,
    });

    gsap.to('#layer2', {
      x: x * layer2Speed * 60,
      y: y * layer2Speed * 40,
      rotationX: y * layer2Speed * 1,
      rotationY: x * layer2Speed * 1,
      transformOrigin: 'center center',
      duration: 0.5,
    });

    gsap.to('#layer3', {
      x: x * layer3Speed * 80,
      y: y * layer3Speed * 50,
      rotationX: y * layer3Speed * 1.5,
      rotationY: x * layer3Speed * 1.5,
      transformOrigin: 'center center',
      duration: 0.5,
    });

    gsap.to('#title', {
      x: x * titleSpeed * 80,
      y: y * titleSpeed * 50,
      rotationY: x * titleSpeed * 1.2,
      transformOrigin: 'center center',
      duration: 0.5,
    });

    // --- SECTION 2 ELEMENTS ---
    const caveInnerSpeed = 0.2;
    const rocketSpeed = 0.6;
    const title2Speed = 0.8;

    gsap.to('#cave-inner', {
      x: x * caveInnerSpeed * 40,
      y: y * caveInnerSpeed * 40,
      duration: 0.5,
    });

    gsap.to('#rocket', {
      x: x * rocketSpeed * 80,
      duration: 0.5,
      overwrite: 'auto',
    });

    gsap.to('#title2', {
      x: x * title2Speed * 70,
      rotationY: x * title2Speed * 1.0,
      transformOrigin: 'center center',
      duration: 0.5,
      overwrite: 'auto',
    });

  }, [mousePosition]);

  // ScrollTriggers
  useGSAP(() => {
    if (!containerRef.current) return;
    const firstSectionHeight = window.innerHeight;

    ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top top',
      end: 'bottom+=100% top',
      scrub: true,
      onUpdate: (self) => {
        const scrollY = window.scrollY;
        const progress = self.progress;

        // Title 1
        gsap.set('#title', {
          y: scrollY,
          scale: 1 + progress * 0.05,
        });

        // Layer 3 (Behind bottom)
        gsap.set('#layer3', {
          y: scrollY * 0.3,
          scale: 1 + progress * 0.02,
        });

        // Layer 2
        gsap.set('#layer2', {
          y: scrollY * 0.6,
          scale: 1 + progress * 0.04,
        });

        // BG
        gsap.set('#bg', {
          y: scrollY * 0.9,
          scale: 1 + progress * 0.06,
          rotationX: progress * 2,
        });
        
        // Title 2 Logic
        const secondSectionStart = firstSectionHeight;
        if (scrollY >= secondSectionStart * 0.5) {
          const title2Progress = Math.min(1, (scrollY - secondSectionStart * 0.5) / (secondSectionStart * 0.5));
          gsap.set('#title2', {
            y: title2Progress * 60 * window.innerHeight / 100, 
          });
        } else {
          gsap.set('#title2', { y: 0 });
        }
      }
    });

    // Timeline for Rocket launch
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '#second-section',
        start: 'top 50%',
        end: 'bottom bottom',
        scrub: true,
      }
    });

    tl.from('#cave-inner', { y: '0vh', ease: 'none' }, 0);
    tl.fromTo('#rocket', { y: 0 }, { y: '-125vh', ease: 'none' }, 0);

  }, []);

  const bottomImage = isDystopia ? 'url(/homelayer/bottom_dys.png)' : 'url(/homelayer/bottom.png)';

  return (
    <>
      <div
        ref={containerRef}
        className="w-full h-screen bg-black relative overflow-hidden"
        style={{
          perspective: '1000px',
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Background Layers */}
        <div
          className="fixed top-0 left-0"
          id="bg"
          style={{
            width: '104vw', height: '65vh', marginLeft: '-2vw', marginTop: '-2vh',
            backgroundImage: isDystopia ? 'url(/homelayer/sky_dys.png)' : 'url(/homelayer/sky.png)',
            backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat',
            transformStyle: 'preserve-3d', willChange: 'transform'
          }}
        ></div>

        <div
          className="fixed top-[42vh] left-0"
          id="layer2"
          style={{
            width: '110vw', height: '80vh', marginLeft: '-5vw',
            backgroundImage: isDystopia ? 'url(/homelayer/behindmountain_dys.png)' : 'url(/homelayer/behindmountain.png)',
            backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat',
            transformStyle: 'preserve-3d', willChange: 'transform',
          }}
        ></div>

        <div
          className="fixed bottom-[5vh] -left-[5vw]"
          id="layer3"
          style={{
            width: '110vw', height: '72vh',
            backgroundImage: isDystopia ? 'url(/homelayer/mainmountain_dys.png)' : 'url(/homelayer/mainmountain.png)',
            backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat',
            transformStyle: 'preserve-3d', willChange: 'transform',
          }}
        ></div>

        <div
          id="title"
          className={`fixed top-[30%] font-bold text-[200px] text-center w-full bg-contain bg-center bg-no-repeat h-[35vh] ${isDystopia ? 'bg-[url(/text_main_dys_nobg.png)]' : 'bg-[url(/text_main_dys_nobg.png)]'}`}
          style={{ willChange: 'transform', pointerEvents: 'none', filter: isDystopia ? 'hue-rotate(180deg)' : 'hue-rotate(0deg)', zIndex: 10 }}
        ></div>

        {/* SECTION 1 FOREGROUND
            - Height is strictly controlled (imgDims.splitTop)
            - We added 2px extra to cover rounding errors
        */}
        <div
          className="absolute bottom-0 left-0"
          id="bottom-sec1"
          style={{
            width: '100vw',
            height: imgDims.splitTop > 0 ? `${imgDims.splitTop + 2}px` : '0px', 
            backgroundImage: bottomImage,
            backgroundPosition: 'top center',
            backgroundSize: `${imgDims.width}px ${imgDims.height}px`, 
            backgroundRepeat: 'no-repeat',
            zIndex: 20, 
            pointerEvents: 'none'
          }}
        ></div>
      </div>

      <div id="second-section" className='w-full h-screen bg-black relative overflow-hidden'>
        <div
          className="absolute -bottom-[2vh] -left-[2vw]"
          id="cave-inner"
          style={{
            width: '104vw', height: '104vh',
            backgroundImage: isDystopia ? 'url(/homelayer/caveinner_dys.png)' : 'url(/homelayer/caveinner.png)',
            backgroundSize: 'cover', backgroundPosition: 'center',
            willChange: 'transform', zIndex: 1 
          }}
        ></div>

        <div
          id="title2"
          className={`absolute -top-[30vh] font-bold text-[200px] text-center w-full bg-contain bg-center bg-no-repeat h-[35vh] ${isDystopia ? 'bg-[url(/text_main_dys_nobg.png)]' : 'bg-[url(/text_main_dys_nobg.png)]'}`}
          style={{ willChange: 'transform', pointerEvents: 'none', filter: isDystopia ? 'hue-rotate(180deg)' : 'hue-rotate(0deg)', zIndex: 2 }}
        ></div>

        <div
          className="absolute top-[150vh] left-0"
          id="rocket"
          style={{
            width: '100vw', height: '70vh',
            backgroundImage: isDystopia ? 'url(/homelayer/rocket_dys.png)' : 'url(/homelayer/rocket.png)',
            backgroundSize: 'contain', backgroundPosition: 'center', backgroundRepeat: 'no-repeat',
            willChange: 'transform', zIndex: 5
          }}
        ></div>

        {/* SECTION 2 FOREGROUND
            - top: -5px ensures seamless overlap
        */}
        <div
          className="absolute left-0"
          id="cave-outer-sec2"
          style={{
            top: '-5px', 
            width: '100vw',
            height: imgDims.splitBottom > 0 ? `${imgDims.splitBottom}px` : '0px',
            backgroundImage: bottomImage,
            backgroundPosition: 'bottom center',
            backgroundSize: `${imgDims.width}px ${imgDims.height}px`,
            backgroundRepeat: 'no-repeat',
            zIndex: 30, 
            pointerEvents: 'none'
          }}
        ></div>
      </div>
    </>
  );
}