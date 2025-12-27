import { useTheme } from "@/contexts/ThemeContext";
import { DayKey } from "@/lib/constants";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { IoExitOutline } from "react-icons/io5";
import TimelineCard from "./TimelineCard";
import TimelineDial from "./TimelineDial";
import SpaceTunnel from "@/components/login/SpaceTunnel";

const TimelinePage = () => {
    const getInitialDay = (): DayKey => {
        const today = new Date();
        const currentYear = today.getFullYear();
        const currentMonth = today.getMonth();
        const currentDate = today.getDate();

        if (currentYear === 2026 && currentMonth === 1) {
            if (currentDate === 19) return 1;
            if (currentDate === 20) return 2;
            if (currentDate === 21) return 3;
            if (currentDate === 22) return 4;
        }
        return 1;
    };
    const [selectedDay, setSelectedDay] = useState<DayKey>(getInitialDay);
    const [isAnimating, setIsAnimating] = useState(false);
    const [angle, setAngle] = useState((getInitialDay() - 1) * 90);
    const [isThrottled, setIsThrottled] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [showTransition, setShowTransition] = useState(false);
    const { theme } = useTheme();
    const isDystopia = theme === "dystopia";

    useEffect(() => {
        let styleElement = document.getElementById(
            "timeline-clip-styles",
        ) as HTMLStyleElement;

        if (!styleElement) {
            styleElement = document.createElement("style");
            styleElement.id = "timeline-clip-styles";
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

        return () => {
            styleElement?.remove();
        };
    }, []);

    const startAngleRef = useRef<number>(0);
    const currentAngleRef = useRef<number>(angle);
    const textContainerRef = useRef<HTMLDivElement>(null);

    const throttleDelay = 1000;
    const [direction, setDirection] = useState<"left" | "right">("left");

    const getDayFromAngle = (ang: number): DayKey => {
        const norm = ((ang % 360) + 360) % 360;
        let index = Math.round(norm / 90) % 4;
        if (index < 0) index += 4;
        return [1, 2, 3, 4][index] as DayKey;
    };

    const rotate = (dir: number) => {
        if (isAnimating || isThrottled) return;
        setShowTransition(true);

        const newAngle = angle + dir * 90;
        const newDay = getDayFromAngle(newAngle);

        const currentDay = getDayFromAngle(angle);
        const diff = (newDay - currentDay + 4) % 4;
        const actualDirection = diff === 1 || diff === -3 ? "left" : "right";
        setDirection(actualDirection);

        setAngle(newAngle);
        currentAngleRef.current = newAngle;

        if (newDay !== selectedDay) {
            setIsAnimating(true);
            const timer = setTimeout(() => {
                setSelectedDay(newDay);
                const animateTimer = setTimeout(
                    () => setIsAnimating(false),
                    600,
                );
                return () => clearTimeout(animateTimer);
            }, 300);
            return () => clearTimeout(timer);
        }
    };

    const handleWheel = (e: WheelEvent) => {
        e.preventDefault();
        if (isThrottled || isAnimating) return;

        const direction =
            Math.abs(e.deltaX) > Math.abs(e.deltaY)
                ? Math.sign(e.deltaX)
                : Math.sign(e.deltaY);
        if (direction !== 0) {
            setIsThrottled(true);
            rotate(direction);
            const timer = setTimeout(
                () => setIsThrottled(false),
                throttleDelay,
            );
            return () => clearTimeout(timer);
        }
    };

    const getAngle = (x: number, y: number, rect: DOMRect) => {
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        return (Math.atan2(y - cy, x - cx) * 180) / Math.PI;
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        e.preventDefault();
        if (isThrottled || isAnimating) return;
        setIsDragging(true);
        const rect = e.currentTarget.getBoundingClientRect();
        startAngleRef.current = getAngle(e.clientX, e.clientY, rect);
        currentAngleRef.current = angle;
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        e.preventDefault();
        if (!isDragging) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const delta =
            getAngle(e.clientX, e.clientY, rect) - startAngleRef.current;
        setAngle(currentAngleRef.current + delta);
    };

    const handleMouseUp = () => {
        if (!isDragging) return;
        setIsDragging(false);

        const snap = Math.round(angle / 90) * 90;
        setAngle(snap);
        currentAngleRef.current = snap;

        const newDay = getDayFromAngle(snap);
        const currentDay = getDayFromAngle(angle);
        const diff = (newDay - currentDay + 4) % 4;
        const actualDirection = diff === 1 || diff === -3 ? "left" : "right";
        setDirection(actualDirection);

        if (newDay !== selectedDay && !isAnimating) {
            setIsAnimating(true);
            const timer = setTimeout(() => {
                setSelectedDay(newDay);
                const innerTimer = setTimeout(() => {
                    setIsAnimating(false);
                }, 600);
                return () => clearTimeout(innerTimer);
            }, 100);
            return () => clearTimeout(timer);
        }
    };

    useEffect(() => {
        const container = textContainerRef.current?.parentElement;
        if (container)
            container.addEventListener("wheel", handleWheel, {
                passive: false,
            });

        return () => {
            if (container) container.removeEventListener("wheel", handleWheel);
        };
    }, [isThrottled, isAnimating, angle]);

    return (
        <div className="min-h-screen relative overflow-hidden">
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
            <AnimatePresence>
                {showTransition && (
                    <motion.div
                        className="fixed inset-0 pointer-events-none"
                        initial={{
                            x: direction === "left" ? "100%" : "-100%",
                            opacity: 1,
                        }}
                        animate={{
                            x: 0,
                            opacity: 1,
                            transition: { duration: 0.45, ease: "easeInOut" },
                        }}
                        exit={{
                            x: direction === "left" ? "-100%" : "100%",
                            opacity: 0,
                            transition: { duration: 0.3, ease: "easeIn" },
                        }}
                        onAnimationComplete={() => {
                            const timer = setTimeout(
                                () => setShowTransition(false),
                                500,
                            );
                            return () => clearTimeout(timer);
                        }}>
                        <div className="w-full h-full">
                            <SpaceTunnel />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
            <TimelineCard selectedDay={selectedDay} direction={direction} />
            {/* Fixed Dial at Bottom */}
            <div className="fixed bottom-0 left-0 right-0 z-50 pb-6">
                <TimelineDial
                    angle={angle}
                    theme={theme}
                    isDragging={isDragging}
                    selectedDay={selectedDay}
                    rotate={rotate}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    textContainerRef={textContainerRef}
                />
            </div>
        </div>
    );
};

export default TimelinePage;
