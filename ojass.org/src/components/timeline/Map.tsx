import { useTheme } from "@/contexts/ThemeContext";
import { DayKey, timelineData } from "@/lib/constants";
import { MapPin, Radio, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import ElectroBorder from "./ElectroBorder";

const SciFiEventMap = ({ selectedDay }: { selectedDay: DayKey }) => {
    const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
    const [now, setNow] = useState(new Date());
    const { theme } = useTheme();
    const isDystopian = theme === "dystopia";
    const [isBooting, setIsBooting] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setIsBooting(false), 800);
        const clockInterval = setInterval(() => setNow(new Date()), 1000);
        return () => {
            clearTimeout(timer);
            clearInterval(clockInterval);
        };
    }, []);

    const events = useMemo(() => {
        const t = new Date();
        const hour = 60 * 60 * 1000;
        const selectedDateEvents = timelineData(hour, t)[selectedDay].events;
        return selectedDateEvents;
    }, [selectedDay]);

    const getEventStatus = (start: Date, end: Date) => {
        if (now > end) return "COMPLETED";
        if (now >= start && now <= end) return "LIVE NOW";
        return "SCHEDULED";
    };

    const activeTimeEvent = events.find((e) => now >= e.start && now <= e.end);

    const displayEvent = selectedEventId
        ? events.find((e) => e.id === selectedEventId)
        : activeTimeEvent;

    const pathData = useMemo(() => {
        return events.reduce((acc, point, i) => {
            const x = (point.coords.x / 100) * 1000;
            const y = (point.coords.y / 100) * 500;
            return i === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
        }, "");
    }, [events]);

    return (
        <div
            className={`h-screen w-full bg-[#030303] overflow-hidden font-mono relative ${
                !isDystopian
                    ? "text-cyan-400 selection:bg-cyan-500/30"
                    : "text-yellow-400 selection:bg-yellow-500/30"
            }`}>
            {/* Grid Background */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#000000_90%)] pointer-events-none" />

            {/* Header */}
            <div className="absolute top-0 left-0 w-full p-6 flex justify-end items-center pointer-events-none z-20">
                <div className="text-right">
                    <div
                        className={`text-[10px] uppercase tracking-widest mb-1 ${
                            !isDystopian ? "text-cyan-400" : "text-yellow-400"
                        }`}>
                        Local System Time
                    </div>
                    <div
                        className={`text-3xl font-bold text-white tabular-nums drop-shadow-[0_0_10px_rgba(0,255,255,0.3)] ${
                            !isDystopian ? "text-cyan-400" : "text-yellow-400"
                        }`}>
                        {now.toLocaleTimeString([], { hour12: false })}
                    </div>
                    <div
                        className={`text-xs text-cyan-500/50 uppercase tracking-widest mt-1 ${
                            !isDystopian ? "text-cyan-400" : "text-yellow-400"
                        }`}>
                        {now.toLocaleDateString(undefined, {
                            weekday: "long",
                            month: "short",
                            day: "numeric",
                        })}
                    </div>
                </div>
            </div>

            {/* Main */}
            <div
                className={`relative w-full h-full flex items-center justify-center transition-all duration-1000 ${
                    isBooting ? "opacity-0 scale-95" : "opacity-100 scale-100"
                }`}>
                {/* SVG Map */}
                <div className="relative w-full max-w-5xl aspect-video">
                    <svg
                        className="absolute inset-0 w-full h-full overflow-visible pointer-events-none"
                        viewBox="0 0 1000 500">
                        {/* Static Path */}
                        <path
                            d={pathData}
                            stroke={!isDystopian ? "#164e63" : "#632B16"}
                            strokeWidth="2"
                            fill="none"
                            opacity="0.5"
                        />
                    </svg>

                    {/* Nodes */}
                    {events.map((evt) => {
                        const status = getEventStatus(evt.start, evt.end);
                        const isLive = status === "LIVE NOW";
                        const isPast = status === "COMPLETED";
                        const isSelected = selectedEventId === evt.id;

                        return (
                            <button
                                key={evt.id}
                                onClick={() =>
                                    setSelectedEventId(
                                        isSelected ? null : evt.id,
                                    )
                                }
                                className="absolute transform -translate-x-1/2 -translate-y-1/2 group outline-none z-30"
                                style={{
                                    top: `${evt.coords.y}%`,
                                    left: `${evt.coords.x}%`,
                                }}>
                                <div className="relative flex items-center justify-center">
                                    {isSelected && (
                                        <div className="absolute w-12 h-12 border border-white rounded-full animate-[spin_4s_linear_infinite] opacity-100" />
                                    )}
                                    {isSelected && (
                                        <div
                                            className={`absolute w-14 h-14 border-t border-b ${
                                                !isDystopian
                                                    ? "border-cyan-400"
                                                    : "border-yellow-400"
                                            } rounded-full animate-[spin_2s_linear_reverse_infinite] opacity-80`}
                                        />
                                    )}

                                    {isLive && (
                                        <>
                                            <div
                                                className={`absolute w-full h-full ${
                                                    !isDystopian
                                                        ? "bg-emerald-500"
                                                        : "bg-red-500"
                                                } rounded-full animate-ping opacity-20`}
                                            />
                                            <div
                                                className={`absolute w-[200%] h-[200%] border rounded-full animate-pulse ${
                                                    !isDystopian
                                                        ? "border-emerald-500/30"
                                                        : "border-red-500/30"
                                                }`}
                                            />
                                        </>
                                    )}

                                    <div
                                        className={`w-4 h-4 rounded-full border-2 transition-all duration-300 shadow-[0_0_15px_currentColor] z-10 
                                        ${
                                            isLive
                                                ? !isDystopian
                                                    ? "bg-emerald-950 border-emerald-400 text-emerald-400"
                                                    : "bg-red-950 border-red-400 text-red-400"
                                                : isPast
                                                ? !isDystopian
                                                    ? "bg-slate-900 border-slate-600 text-slate-600"
                                                    : "bg-pink-950 border-pink-400 text-pink-400"
                                                : !isDystopian
                                                ? "bg-cyan-950 border-cyan-400 text-cyan-400"
                                                : "bg-rose-950 border-rose-400 text-rose-400"
                                        }`}
                                    />

                                    {/* Label on Hover or Select */}
                                    <div
                                        className={`absolute top-6 left-1/2 -translate-x-1/2 whitespace-nowrap bg-black/80 backdrop-blur px-2 py-1 border border-cyan-900 text-[10px] uppercase tracking-widest transition-all
                                        ${
                                            isSelected || isLive
                                                ? "opacity-100 translate-y-0"
                                                : "opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0"
                                        }
                                    `}>
                                        {isLive && (
                                            <span
                                                className={`${
                                                    !isDystopian
                                                        ? "text-emerald-400"
                                                        : "text-red-400"
                                                } font-bold mr-2`}>
                                                ● LIVE
                                            </span>
                                        )}
                                        {evt.title}
                                    </div>
                                </div>
                            </button>
                        );
                    })}

                    {displayEvent && (
                        <div className="absolute bottom-4 right-4 md:bottom-12 md:right-12 w-full max-w-sm z-40">
                            <ElectroBorder
                                borderWidth={4}
                                borderColor={
                                    isDystopian ? "#ff0003" : "#00fffc"
                                }>
                                <div
                                    className={`bg-[#050505]/50 border-l-4 ${
                                        isDystopian
                                            ? "border-red-700"
                                            : "border-cyan-700"
                                    } p-6 backdrop-blur-md shadow-[0_10px_40px_-10px_rgba(0,0,0,0.8)] rounded-2xl m-2 animate-in slide-in-from-right-10 fade-in duration-300 relative overflow-hidden`}>
                                    {selectedEventId && (
                                        <button
                                            onClick={() =>
                                                setSelectedEventId(null)
                                            }
                                            className={`absolute top-2 right-2 p-1 ${
                                                isDystopian
                                                    ? "text-red-700"
                                                    : "text-cyan-700"
                                            } hover:text-white transition-colors`}>
                                            <X size={16} />
                                        </button>
                                    )}
                                    <div className="relative z-10">
                                        {/* Header Badge */}
                                        <div className="flex items-center gap-2 mb-3">
                                            {getEventStatus(
                                                displayEvent.start,
                                                displayEvent.end,
                                            ) === "LIVE NOW" ? (
                                                <span
                                                    className={`${
                                                        isDystopian
                                                            ? "bg-amber-500/10 border border-amber-500/50 text-amber-400"
                                                            : "bg-emerald-500/10 border border-emerald-500/50 text-emerald-400"
                                                    }
                                                    text-[9px] font-bold px-2 py-0.5 rounded flex items-center gap-1 animate-pulse ${
                                                        isDystopian
                                                            ? "text-amber-700"
                                                            : "text-emerald-400"
                                                    }`}>
                                                    <Radio size={10} /> LIVE
                                                    BROADCAST
                                                </span>
                                            ) : (
                                                <span
                                                    className={`${
                                                        isDystopian
                                                            ? "bg-amber-500/10 border border-amber-500/50 text-amber-400"
                                                            : "bg-emerald-500/10 border border-emerald-500/50 text-emerald-400"
                                                    } text-[9px] px-2 py-0.5 rounded`}>
                                                    ARCHIVE DATA
                                                </span>
                                            )}
                                            {selectedEventId && (
                                                <span className="text-[9px] text-yellow-500/80 tracking-widest uppercase border border-yellow-500/30 px-1">
                                                    Manual Override
                                                </span>
                                            )}
                                        </div>

                                        <h2 className="text-2xl font-black text-white italic uppercase leading-none mb-1">
                                            {displayEvent.title}
                                        </h2>
                                        <div
                                            className={`flex items-center gap-2 text-xs 
                                        ${
                                            isDystopian
                                                ? "text-yellow-600"
                                                : "text-cyan-600"
                                        } mb-4`}>
                                            <MapPin size={12} />{" "}
                                            {displayEvent.location}
                                        </div>

                                        {/* Time Grid */}
                                        <div className="grid grid-cols-2 gap-px bg-cyan-900/30 border border-cyan-900/50 mb-4">
                                            <div className="bg-black/40 p-2">
                                                <div
                                                    className={`text-[9px] ${
                                                        isDystopian
                                                            ? "text-yellow-600"
                                                            : "text-cyan-600"
                                                    } uppercase mb-1`}>
                                                    Start Time
                                                </div>
                                                <div className="text-xs text-white font-mono">
                                                    {displayEvent.start.toLocaleTimeString(
                                                        [],
                                                        {
                                                            hour: "2-digit",
                                                            minute: "2-digit",
                                                        },
                                                    )}
                                                </div>
                                                <div
                                                    className={`text-[9px] ${
                                                        isDystopian
                                                            ? "text-yellow-500/50"
                                                            : "text-cyan-500/50"
                                                    }`}>
                                                    {displayEvent.start.toLocaleDateString()}
                                                </div>
                                            </div>
                                            <div className="bg-black/40 p-2">
                                                <div
                                                    className={`text-[9px] ${
                                                        isDystopian
                                                            ? "text-yellow-600"
                                                            : "text-cyan-600"
                                                    } uppercase mb-1`}>
                                                    End Time
                                                </div>
                                                <div className="text-xs text-white font-mono">
                                                    {displayEvent.end.toLocaleTimeString(
                                                        [],
                                                        {
                                                            hour: "2-digit",
                                                            minute: "2-digit",
                                                        },
                                                    )}
                                                </div>
                                                <div
                                                    className={`text-[9px] ${
                                                        isDystopian
                                                            ? "text-yellow-500/50"
                                                            : "text-cyan-500/50"
                                                    }`}>
                                                    {displayEvent.end.toLocaleDateString()}
                                                </div>
                                            </div>
                                        </div>

                                        <p
                                            className={`text-xs ${
                                                isDystopian
                                                    ? "text-yellow-100/70"
                                                    : "text-cyan-100/70"
                                            } leading-relaxed font-light border-t border-cyan-900/50 pt-3`}>
                                            {displayEvent.desc}
                                        </p>
                                    </div>
                                </div>
                            </ElectroBorder>
                        </div>
                    )}
                </div>
            </div>

            <style jsx>{`
                @keyframes dash {
                    to {
                        stroke-dashoffset: 0;
                    }
                }
            `}</style>
        </div>
    );
};

export default SciFiEventMap;
