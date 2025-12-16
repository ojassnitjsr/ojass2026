import { Theme } from "@/lib/constants";

interface TimelineDialProps {
    angle: number;
    theme: Theme;
    isDragging: boolean;
    selectedDay: number;
    rotate: (dir: number) => void;
    onMouseDown: (e: React.MouseEvent) => void;
    onMouseMove: (e: React.MouseEvent) => void;
    onMouseUp: () => void;
    onMouseLeave: () => void;
    textContainerRef: React.RefObject<HTMLDivElement | null>;
}

const TimelineDial = ({
    angle,
    theme,
    isDragging,
    selectedDay,
    rotate,
    onMouseDown,
    onMouseMove,
    onMouseUp,
    onMouseLeave,
    textContainerRef,
}: TimelineDialProps) => {
    const dayLabels = [
        { angle: 0, day: 1, label: "DAY 1", subtext: "Monday" },
        { angle: 90, day: 2, label: "DAY 2", subtext: "Tuesday" },
        { angle: 180, day: 3, label: "DAY 3", subtext: "Wednesday" },
        { angle: 270, day: 4, label: "DAY 4", subtext: "Thursday" },
    ];

    return (
        <div
            className="relative w-[350px] h-[350px] mx-auto"
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseLeave}
            ref={textContainerRef}
            role="slider"
            aria-valuenow={selectedDay}
            aria-valuemin={1}
            aria-valuemax={4}
            aria-label={`Select timeline day: Day ${selectedDay}`}
            style={{
                cursor: isDragging ? "grabbing" : "grab",
                marginBottom: "-235px",
                marginTop: "20px",
            }}>
            <div className="absolute top-1/4 left-1/3 text-white">Rotate/Tap Dial</div>

            <svg
                viewBox="0 0 538 538"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{
                    width: "100%",
                    height: "100%",
                    transform: `rotate(${angle}deg)`,
                    transition: `transform ${
                        isDragging ? "0s" : "1s"
                    } ease-out`,
                    pointerEvents: "none",
                    filter:
                        theme === "utopia"
                            ? "drop-shadow(0 0 30px rgba(0, 255, 255, 0.4))"
                            : "drop-shadow(0 0 30px rgba(139, 0, 0, 0.5))",
                }}
                className="absolute top-0 left-0">
                <defs>
                    <clipPath id="clip0_1_4">
                        <rect width="538" height="538" fill="white" />
                    </clipPath>

                    <linearGradient
                        id="ringGradient"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="100%">
                        {theme === "utopia" ? (
                            <>
                                <stop
                                    offset="0%"
                                    stopColor="#00ffff"
                                    stopOpacity="0.9"
                                />
                                <stop
                                    offset="50%"
                                    stopColor="#0088ff"
                                    stopOpacity="0.7"
                                />
                                <stop
                                    offset="100%"
                                    stopColor="#00ffff"
                                    stopOpacity="0.9"
                                />
                            </>
                        ) : (
                            <>
                                <stop
                                    offset="0%"
                                    stopColor="#ff0000"
                                    stopOpacity="0.9"
                                />
                                <stop
                                    offset="50%"
                                    stopColor="#8B0000"
                                    stopOpacity="0.7"
                                />
                                <stop
                                    offset="100%"
                                    stopColor="#ff0000"
                                    stopOpacity="0.9"
                                />
                            </>
                        )}
                    </linearGradient>

                    <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
                        {theme === "utopia" ? (
                            <>
                                <stop
                                    offset="0%"
                                    stopColor="#00ffff"
                                    stopOpacity="0.4"
                                />
                                <stop
                                    offset="100%"
                                    stopColor="#000000"
                                    stopOpacity="0"
                                />
                            </>
                        ) : (
                            <>
                                <stop
                                    offset="0%"
                                    stopColor="#ff0000"
                                    stopOpacity="0.4"
                                />
                                <stop
                                    offset="100%"
                                    stopColor="#000000"
                                    stopOpacity="0"
                                />
                            </>
                        )}
                    </radialGradient>

                    <filter
                        id="glow"
                        x="-60%"
                        y="-120%"
                        width="220%"
                        height="300%">
                        <feGaussianBlur
                            in="SourceGraphic"
                            stdDeviation="3"
                            result="blur1"
                        />
                        <feGaussianBlur
                            in="SourceGraphic"
                            stdDeviation="6"
                            result="blur2"
                        />
                        <feBlend in="blur1" in2="blur2" mode="lighten" />
                        <feMerge>
                            <feMergeNode in="blur2" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>

                    <filter
                        id="strongGlow"
                        x="-60%"
                        y="-120%"
                        width="220%"
                        height="300%">
                        <feGaussianBlur
                            in="SourceGraphic"
                            stdDeviation="6"
                            result="blur1"
                        />
                        <feGaussianBlur
                            in="SourceGraphic"
                            stdDeviation="12"
                            result="blur2"
                        />
                        <feBlend in="blur1" in2="blur2" mode="lighten" />
                        <feMerge>
                            <feMergeNode in="blur2" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>

                    <pattern
                        id="techGrid"
                        x="0"
                        y="0"
                        width="20"
                        height="20"
                        patternUnits="userSpaceOnUse">
                        <path
                            d="M 20 0 L 0 0 0 20"
                            fill="none"
                            stroke={
                                theme === "utopia"
                                    ? "rgba(0,255,255,0.1)"
                                    : "rgba(139,0,0,0.1)"
                            }
                            strokeWidth="0.5"
                        />
                    </pattern>

                    <pattern
                        id="hexPattern"
                        x="0"
                        y="0"
                        width="40"
                        height="40"
                        patternUnits="userSpaceOnUse">
                        <path
                            d="M20,5 L30,15 L30,25 L20,35 L10,25 L10,15 Z"
                            fill="none"
                            stroke={
                                theme === "utopia"
                                    ? "rgba(0,200,255,0.08)"
                                    : "rgba(139,0,0,0.08)"
                            }
                            strokeWidth="0.5"
                        />
                    </pattern>
                </defs>

                <g clipPath="url(#clip0_1_4)">
                    {/* Background effects */}
                    <circle cx="269" cy="269" r="250" fill="url(#centerGlow)" />
                    <circle
                        cx="269"
                        cy="269"
                        r="265"
                        fill="url(#techGrid)"
                        stroke="none"
                    />
                    <circle
                        cx="269"
                        cy="269"
                        r="230"
                        fill="url(#hexPattern)"
                        stroke="none"
                    />

                    {/* Outer ring system */}
                    <circle
                        cx="269"
                        cy="269"
                        r="265"
                        stroke="url(#ringGradient)"
                        strokeWidth="5"
                        fill="none"
                        filter="url(#strongGlow)"
                    />
                    <circle
                        cx="269"
                        cy="269"
                        r="265"
                        stroke={
                            theme === "utopia"
                                ? "rgba(0,255,255,0.4)"
                                : "rgba(255,0,0,0.4)"
                        }
                        strokeWidth="2"
                        fill="none"
                    />
                    <circle
                        cx="269"
                        cy="269"
                        r="268"
                        stroke={
                            theme === "utopia"
                                ? "rgba(0,200,255,0.2)"
                                : "rgba(139,0,0,0.2)"
                        }
                        strokeWidth="1"
                        fill="none"
                        strokeDasharray="10,5"
                    />

                    {/* Inner ring system */}
                    <circle
                        cx="269"
                        cy="269"
                        r="192"
                        stroke="url(#ringGradient)"
                        strokeWidth="4"
                        fill="none"
                        filter="url(#glow)"
                    />
                    <circle
                        cx="269"
                        cy="269"
                        r="192"
                        stroke={
                            theme === "utopia"
                                ? "rgba(0,255,255,0.3)"
                                : "rgba(255,0,0,0.3)"
                        }
                        strokeWidth="2"
                        fill="none"
                    />

                    {/* Additional decorative rings */}
                    <circle
                        cx="269"
                        cy="269"
                        r="230"
                        stroke={
                            theme === "utopia"
                                ? "rgba(0,200,255,0.2)"
                                : "rgba(139,0,0,0.2)"
                        }
                        strokeWidth="1.5"
                        fill="none"
                        strokeDasharray="8,4"
                    />
                    <circle
                        cx="269"
                        cy="269"
                        r="210"
                        stroke={
                            theme === "utopia"
                                ? "rgba(0,200,255,0.15)"
                                : "rgba(139,0,0,0.15)"
                        }
                        strokeWidth="1"
                        fill="none"
                        strokeDasharray="4,4"
                    />
                    <circle
                        cx="269"
                        cy="269"
                        r="175"
                        stroke={
                            theme === "utopia"
                                ? "rgba(0,150,255,0.1)"
                                : "rgba(100,0,0,0.1)"
                        }
                        strokeWidth="0.5"
                        fill="none"
                        strokeDasharray="3,3"
                    />

                    {/* Dynamic 8-section Spokes and Nodes */}
                    {[0, 45, 90, 135, 180, 225, 270, 315].map((ang, i) => {
                        const rad = (ang * Math.PI) / 180;
                        const isPrimary = i % 2 === 0; // 0, 90, 180, 270

                        // Radii
                        const rInner = 196;
                        const rOuter = 269;

                        // Calculate coords relative to center 269, 269
                        const x1 = 269 + rInner * Math.cos(rad);
                        const y1 = 269 + rInner * Math.sin(rad);
                        const x2 = 269 + rOuter * Math.cos(rad);
                        const y2 = 269 + rOuter * Math.sin(rad);

                        return (
                            <g key={i}>
                                {/* Glow Line */}
                                <line
                                    x1={x1}
                                    y1={y1}
                                    x2={x2}
                                    y2={y2}
                                    stroke="url(#ringGradient)"
                                    strokeWidth={isPrimary ? 6 : 4}
                                    filter={
                                        isPrimary
                                            ? "url(#strongGlow)"
                                            : "url(#glow)"
                                    }
                                    strokeLinecap="round"
                                />
                                {/* Core Line */}
                                <line
                                    x1={x1}
                                    y1={y1}
                                    x2={x2}
                                    y2={y2}
                                    stroke={
                                        theme === "utopia"
                                            ? "rgba(0,255,255,0.6)"
                                            : "rgba(255,0,0,0.6)"
                                    }
                                    strokeWidth={isPrimary ? 3 : 2}
                                    strokeLinecap="round"
                                />

                                {/* Node at endpoint */}
                                <circle
                                    cx={x2}
                                    cy={y2}
                                    r={isPrimary ? 8 : 6}
                                    fill={
                                        theme === "utopia"
                                            ? "#00ffff"
                                            : "#ff0000"
                                    }
                                    filter="url(#strongGlow)"
                                />
                                <circle
                                    cx={x2}
                                    cy={y2}
                                    r={isPrimary ? 5 : 3}
                                    fill={
                                        theme === "utopia"
                                            ? "#ffffff"
                                            : "#ffcccc"
                                    }
                                />
                            </g>
                        );
                    })}

                    {/* Center power core */}
                    <circle
                        cx="269"
                        cy="269"
                        r="35"
                        fill={
                            theme === "utopia"
                                ? "rgba(0,255,255,0.05)"
                                : "rgba(255,0,0,0.05)"
                        }
                        stroke="url(#ringGradient)"
                        strokeWidth="2"
                        filter="url(#glow)"
                    />
                    <circle
                        cx="269"
                        cy="269"
                        r="25"
                        fill={
                            theme === "utopia"
                                ? "rgba(0,200,255,0.15)"
                                : "rgba(200,0,0,0.15)"
                        }
                        stroke={theme === "utopia" ? "#00ffff" : "#ff0000"}
                        strokeWidth="2"
                        filter="url(#glow)"
                    />
                    <circle
                        cx="269"
                        cy="269"
                        r="15"
                        fill={
                            theme === "utopia"
                                ? "rgba(0,255,255,0.3)"
                                : "rgba(255,0,0,0.3)"
                        }
                        stroke={theme === "utopia" ? "#00ffff" : "#ff0000"}
                        strokeWidth="1.5"
                    />
                    <circle
                        cx="269"
                        cy="269"
                        r="8"
                        fill={theme === "utopia" ? "#00ffff" : "#ff0000"}
                        filter="url(#strongGlow)"
                    />
                    <circle
                        cx="269"
                        cy="269"
                        r="4"
                        fill={theme === "utopia" ? "#ffffff" : "#ffffff"}
                    />

                    {/* Tick marks around the dial */}
                    {[...Array(80)].map((_, i) => {
                        const tickAngle = (i * 4.5 * Math.PI) / 180;
                        const innerR = i % 5 === 0 ? 240 : 250;
                        const outerR = 260;
                        const x1 = 269 + innerR * Math.cos(tickAngle);
                        const y1 = 269 + innerR * Math.sin(tickAngle);
                        const x2 = 269 + outerR * Math.cos(tickAngle);
                        const y2 = 269 + outerR * Math.sin(tickAngle);
                        return (
                            <line
                                key={i}
                                x1={x1}
                                y1={y1}
                                x2={x2}
                                y2={y2}
                                stroke={
                                    theme === "utopia"
                                        ? "rgba(0,200,255,0.3)"
                                        : "rgba(139,0,0,0.3)"
                                }
                                strokeWidth={i % 5 === 0 ? 2 : 0.5}
                            />
                        );
                    })}
                </g>
            </svg>

            {/* Day labels - positioned outside the rotating SVG */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                {dayLabels.map((day) => {
                    const labelAngle = ((day.angle - angle) * Math.PI) / 180;
                    const radius = 220;
                    const x = 175 + radius * Math.cos(labelAngle - Math.PI / 2);
                    const y = 175 + radius * Math.sin(labelAngle - Math.PI / 2);
                    const isActive = day.day === selectedDay;
                    const labelColor =
                        theme === "utopia" ? "text-cyan-400" : "text-rose-400";
                    const subColor =
                        theme === "utopia" ? "text-cyan-600" : "text-rose-600";

                    return (
                        <div
                            key={day.day}
                            className="absolute transition-all duration-1000"
                            style={{
                                left: `${x}px`,
                                top: `${y}px`,
                                transform: "translate(-50%, -50%)",
                                opacity: isActive ? 1 : 0.4,
                            }}>
                            <div className="text-center">
                                <div
                                    className={`font-mono font-bold mb-1 transition-all duration-500 ${labelColor}`}
                                    style={{
                                        fontSize: isActive ? "14px" : "11px",
                                        textShadow: isActive
                                            ? "0 0 20px rgba(147, 51, 234, 0.8)"
                                            : "none",
                                    }}>
                                    {day.label}
                                </div>
                                <div
                                    className={`font-mono text-xs ${subColor}`}
                                    style={{
                                        opacity: isActive ? 1 : 0.6,
                                        fontSize: "9px",
                                    }}>
                                    {day.subtext}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Invisible interaction zones */}
            <div className="absolute inset-0 flex">
                <div
                    className="w-1/2 cursor-pointer"
                    onClick={() => rotate(-1)}
                />
                <div
                    className="w-1/2 cursor-pointer"
                    onClick={() => rotate(1)}
                />
            </div>
        </div>
    );
};

export default TimelineDial;
