"use client";

import { useTheme } from '@/contexts/ThemeContext';
import { useGSAP } from '@gsap/react';
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, useState } from 'react';
export default function Home() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const isMouseParallaxEnabledRef = useRef<boolean>(true);
  const { theme } = useTheme();
  const isDystopia = theme === "dystopia";
  if (typeof window !== 'undefined' && (gsap as any).registeredPlugins?.includes?.(ScrollTrigger) !== true) {
    gsap.registerPlugin(ScrollTrigger);
  }

  // Smooth mouse tracking without throttling
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isMouseParallaxEnabledRef.current) return;
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;

        // Normalize to -1 to 1 range, centered at 0
        const normalizedX = (x - 0.5) * 2;
        const normalizedY = (y - 0.5) * 2;

        setMousePosition({ x: normalizedX, y: normalizedY });
      }
    };

    const handleMouseLeave = () => {
      // Smoothly reset to center when mouse leaves
      setMousePosition({ x: 0, y: 0 });
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      container.addEventListener('mouseleave', handleMouseLeave);

      return () => {
        container.removeEventListener('mousemove', handleMouseMove);
        container.removeEventListener('mouseleave', handleMouseLeave);
      };
    }
  }, []);


  // GSAP animations for parallax effect - moving the divs themselves
  useGSAP(() => {
    // Animate layers based on mouse position
    const animateLayers = () => {
      if (!isMouseParallaxEnabledRef.current) return; // enable only at top
      const { x, y } = mousePosition;

      // Different parallax speeds for each layer (closer layers move more)
      const bgSpeed = 0.1;      // Background moves least (furthest)
      const layer2Speed = 0.3;  // Layer 2 moves more
      const layer3Speed = 0.5;  // Layer 3 moves even more
      const bottomSpeed = 0.7;  // Bottom layer moves most (closest)
      const titleSpeed = 0.9;

      // Calculate movement amounts for div positioning
      const bgX = x * bgSpeed * 40;      // Max 40px movement
      const bgY = y * bgSpeed * 30;      // Max 30px movement

      const layer2X = x * layer2Speed * 60;
      const layer2Y = y * layer2Speed * 40;

      const layer3X = x * layer3Speed * 80;
      const layer3Y = y * layer3Speed * 50;

      const bottomX = x * bottomSpeed * 100;
      const bottomY = y * bottomSpeed * 60;

      const titleX = x * titleSpeed * 80;
      const titleY = y * titleSpeed * 50;

      // Subtle rotation for 3D effect (very small angles)
      const bgRotateX = y * bgSpeed * 0.5;
      const bgRotateY = x * bgSpeed * 0.5;

      const layer2RotateX = y * layer2Speed * 1;
      const layer2RotateY = x * layer2Speed * 1;

      const layer3RotateX = y * layer3Speed * 1.5;
      const layer3RotateY = x * layer3Speed * 1.5;

      const titleRotateY = x * titleSpeed * 1.2;


      // Parallax for the title text
      // faster for foreground text

      // Move the actual divs instead of background position
      gsap.to('#bg', {
        x: bgX,
        y: bgY,
        rotationX: bgRotateX,
        rotationY: bgRotateY,
        transformOrigin: 'center center',
        duration: 0.2,
        ease: 'none'
      });

      gsap.to('#layer2', {
        x: layer2X,
        y: layer2Y,
        rotationX: layer2RotateX,
        rotationY: layer2RotateY,
        transformOrigin: 'center center',
        duration: 0.2,
        ease: 'none'
      });

      gsap.to('#layer3', {
        x: layer3X,
        y: layer3Y,
        rotationX: layer3RotateX,
        rotationY: layer3RotateY,
        transformOrigin: 'center center',
        duration: 0.2,
        ease: 'none'
      });

      gsap.to('#bottom', {
        x: bottomX,
        y: bottomY,
        duration: 0.2,
        ease: 'none'
      });

      gsap.to('#title', {
        x: titleX,
        y: titleY,
        rotationY: titleRotateY,
        transformOrigin: 'center center',
        duration: 0.2,
        ease: 'none'
      });
    };

    animateLayers();
  }, [mousePosition]);

  useGSAP(() => {
    if (!containerRef.current) return;

    ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top top',
      end: 'bottom+=100% top',
      scrub: true,
      onUpdate: () => {
        const scrollY = window.scrollY;
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        const progress = maxScroll > 0 ? scrollY / maxScroll : 0;

        // Mouse parallax only when page is at top
        isMouseParallaxEnabledRef.current = scrollY === 0;

        // Parallax speeds: 
        // We use negative Y to move elements UP as the user scrolls DOWN (Natural scroll direction).

        // Title (Floating text) 
        gsap.set('#title', {
          y: scrollY,
          scale: 1 + progress * 0.05,
        });

        // Bottom (Foreground) - Moves naturally with scroll (Speed ~1.0)
        // This "cancels" relative motion between the scroll and this element's position on page.
        gsap.set('#bottom', {
          y: 0,
          scale: 1 + progress * 0.05,
        });

        // Layer3 (Behind bottom) - Moves slower (Speed ~0.6)
        gsap.set('#layer3', {
          y: scrollY * 0.3,
          scale: 1 + progress * 0.02,
        });

        // Layer2 (Behind layer3) - Moves slower (Speed ~0.3)
        gsap.set('#layer2', {
          y: scrollY * 0.6,
          scale: 1 + progress * 0.04,
        });

        // Background (Furthest) - Moves slowest (Speed ~0.1)
        gsap.set('#bg', {
          y: scrollY * 0.9,
          scale: 1 + progress * 0.06,
          rotationX: progress * 2,
          transformOrigin: 'center center'
        });
      }
    });
  }, []);

  useGSAP(() => {
    // Parallax for the second section (Cave & Rocket)
    ScrollTrigger.create({
      trigger: '#second-section',
      start: 'top bottom', // Start when the top of the section enters the bottom of viewport
      end: 'bottom top',   // End when the bottom of the section leaves the top of viewport
      scrub: true,
      onUpdate: (self) => {
        const progress = self.progress;

        // Cave (Background) - Moves slower (Parallax effect)
        // Moving it slightly DOWN (positive Y) as we scroll UP the content makes it appear further away
        gsap.set('#cave', {
          y: (progress - 0.5) * 100,
        });

        // Rocket (Foreground) - Moves faster or stays put
        // Moving it UP (negative Y) makes it appear closer/floating
        gsap.set('#rocket', {
          y: -(progress - 0.5) * 200,
        });

        // Title 2 (in second section) - Moves into view from bottom
        gsap.set('#title2', {
          y: (progress - 0.5) * 50, // Slight parallax
          scale: 1 + progress * 0.05,
        });
      }
    });
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
            backgroundImage: isDystopia ? 'url(/homelayer/sky.png)' : 'url(/homelayer/sky.png)',
            backgroundSize: 'contain',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            transformStyle: 'preserve-3d',
            willChange: 'transform'
          }}
        ></div>

        <div
          className="fixed top-[32vh] left-0"
          id="layer2"
          style={{
            width: '110vw',
            height: '80vh',
            marginLeft: '-5vw',
            backgroundImage: isDystopia ? 'url(/homelayer/behindmountain2.png)' : 'url(/homelayer/behindmountain2.png)',
            backgroundSize: 'contain',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            // filter: isDystopia ? 'brightness(1.2) hue-rotate(180deg)' : 'blur(0px) brightness(1.2) hue-rotate(0deg)',
            transformStyle: 'preserve-3d',
            willChange: 'transform',
            // backgroundColor: 'red',
          }}
        ></div>



        <div
          className="fixed bottom-[5vh] left-0 flex flex-row justify-between"
          id="layer3"
          style={{
            width: '110vw',
            height: '65vh',
            marginLeft: '-5vw',
            transformStyle: 'preserve-3d',
            willChange: 'transform',
            backgroundImage: 'url(/homelayer/mainmountain.png)',
            backgroundSize: 'contain',
            backgroundPosition: '80% 10%',
            backgroundRepeat: 'no-repeat',
          }}
        >
        </div>

        <div
          id="title"
          className='fixed top-[40%] font-bold text-[200px] text-center w-full bg-[url(/layers/text.png)] bg-contain bg-center bg-no-repeat h-[20vh]'
          style={{ willChange: 'transform', pointerEvents: 'none', filter: isDystopia ? 'hue-rotate(180deg)' : 'hue-rotate(0deg)', }}
        >
        </div>

        <div
          className="fixed -bottom-[5vh] left-0"
          id="bottom"
          style={{
            width: '120vw',
            height: '64vh',
            marginLeft: '-10vw',
            backgroundImage: 'url(/homelayer/bottom.png)',
            backgroundSize: 'contain',
            backgroundPosition: 'bottom center',
            backgroundRepeat: 'no-repeat',
            willChange: 'transform',
            filter: isDystopia ? 'hue-rotate(180deg)' : 'hue-rotate(0deg)',
          }}
        ></div>
      </div>
      <div id="second-section" className='w-full h-screen bg-white relative overflow-hidden'>
        <div
          className="absolute top-0 left-0"
          id="cave"
          style={{
            width: '100vw',
            height: '100vh',
            marginLeft: '0',
            backgroundImage: 'url(/homelayer/cave.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'bottom center',
            backgroundRepeat: 'no-repeat',
            willChange: 'transform'
          }}
        ></div>
        <div
          id="title2"
          className='absolute top-[40%] font-bold text-[200px] text-center w-full bg-[url(/layers/text.png)] bg-contain bg-center bg-no-repeat h-[20vh]'
          style={{ willChange: 'transform', pointerEvents: 'none', filter: isDystopia ? 'hue-rotate(180deg)' : 'hue-rotate(0deg)', }}
        >
        </div>
        <div
          className="absolute bottom-[10vh] left-0"
          id="rocket"
          style={{
            width: '100vw',
            height: '70vh',
            marginLeft: '0',
            backgroundImage: 'url(/homelayer/rocket.png)',
            backgroundSize: 'contain',
            backgroundPosition: 'center center',
            backgroundRepeat: 'no-repeat',
            willChange: 'transform'
          }}
        ></div>
      </div>
    </>
  );
}