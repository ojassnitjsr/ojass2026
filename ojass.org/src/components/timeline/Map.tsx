import { useTheme } from "@/contexts/ThemeContext";
import { DayKey, timelineData } from "@/lib/constants";
import { MapPin, Radio, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import ElectroBorder from "./ElectroBorder";

type EventStatus = "COMPLETED" | "LIVE NOW" | "SCHEDULED";

interface EventData {
    id: number;
    title: string;
    start: Date;
    end: Date;
    location: string;
    desc: string;
    coords: { x: number; y: number };
}

const EventDetailsContent = ({
    event,
    status,
    isDystopian,
    onClose,
}: {
    event: EventData;
    status: EventStatus;
    isDystopian: boolean;
    onClose: () => void;
}) => {
    const accentColor = isDystopian ? "text-yellow-400" : "text-cyan-400";
    const borderColor = isDystopian ? "border-yellow-500" : "border-cyan-500";
    const glowColor = isDystopian
        ? "shadow-yellow-500/20"
        : "shadow-cyan-500/20";

    return (
        <div className="h-full flex flex-col">
            {/* Mobile Close Button */}
            <button
                onClick={onClose}
                className="md:hidden absolute top-2 right-2 z-50 p-2 text-white/50 hover:text-white bg-black/50 backdrop-blur rounded-full">
                <X size={24} />
            </button>

            <div className="flex-1 overflow-y-auto p-4 md:p-6 scrollbar-thin scrollbar-thumb-white/10">
                <ElectroBorder
                    borderWidth={2}
                    borderColor={isDystopian ? "#EAB308" : "#22D3EE"}>
                    <div
                        className={`relative p-6 bg-black/80 backdrop-blur-md ${glowColor} shadow-2xl`}>
                        {/* Status Header */}
                        <div className="flex justify-between items-start mb-6">
                            {status === "LIVE NOW" ? (
                                <span
                                    className={`flex items-center gap-2 text-[10px] font-bold px-3 py-1 rounded animate-pulse border ${
                                        isDystopian
                                            ? "bg-red-500/20 border-red-500 text-red-500"
                                            : "bg-emerald-500/20 border-emerald-500 text-emerald-400"
                                    }`}>
                                    <Radio
                                        size={12}
                                        className="animate-spin-slow"
                                    />{" "}
                                    TRANSMITTING
                                </span>
                            ) : (
                                <span className="text-[10px] px-2 py-1 rounded border border-white/10 text-white/50 uppercase tracking-widest">
                                    {status}
                                </span>
                            )}
                            \/\/\/ {event.id.toString().padStart(3, "0")}
                        </div>

                        {/* Title */}
                        <h1
                            className={`text-2xl md:text-3xl font-black italic uppercase leading-none mb-4 ${accentColor}`}>
                            {event.title}
                        </h1>

                        {/* Location */}
                        <div className="flex items-center gap-2 text-white/70 text-sm mb-6 pb-4 border-b border-white/10 font-mono">
                            <MapPin size={14} className={accentColor} />
                            {event.location}
                        </div>

                        {/* Time Grid */}
                        <div className="grid grid-cols-2 gap-px bg-white/10 border border-white/10 mb-6">
                            <div className="bg-black/40 p-3">
                                <div
                                    className={`text-[9px] uppercase mb-1 opacity-70 ${accentColor}`}>
                                    Start Sequence
                                </div>
                                <div className="font-mono text-white text-sm">
                                    {event.start.toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}
                                </div>
                            </div>
                            <div className="bg-black/40 p-3">
                                <div
                                    className={`text-[9px] uppercase mb-1 opacity-70 ${accentColor}`}>
                                    End Sequence
                                </div>
                                <div className="font-mono text-white text-sm">
                                    {event.end.toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <h4 className="text-[10px] uppercase tracking-widest opacity-40">
                                Decoded Data
                            </h4>
                            <p className="text-sm leading-relaxed text-white/80 font-light border-l-2 border-white/10 pl-3">
                                {event.desc}
                            </p>
                        </div>
                    </div>
                </ElectroBorder>
            </div>
        </div>
    );
};

const MapNode = ({
    event,
    status,
    isSelected,
    onClick,
    isDystopian,
}: {
    event: EventData;
    status: EventStatus;
    isSelected: boolean;
    onClick: () => void;
    isDystopian: boolean;
}) => {
    const isLive = status === "LIVE NOW";
    const isPast = status === "COMPLETED";

    // Dynamic Colors based on state
    let nodeColor = isDystopian ? "bg-yellow-500" : "bg-cyan-500";
    let ringColor = isDystopian ? "border-yellow-500" : "border-cyan-500";

    if (isLive) {
        nodeColor = isDystopian ? "bg-red-500" : "bg-emerald-500";
        ringColor = isDystopian ? "border-red-500" : "border-emerald-500";
    } else if (isPast) {
        nodeColor = "bg-slate-700";
        ringColor = "border-slate-700";
    }

    return (
        <button
            onClick={onClick}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 group outline-none z-30"
            style={{ top: `${event.coords.y}%`, left: `${event.coords.x}%` }}>
            <div className="relative flex items-center justify-center w-12 h-12">
                {/* Spinner */}
                {isSelected && (
                    <div
                        className={`absolute w-12 h-12 border border-dashed rounded-full animate-[spin_4s_linear_infinite] opacity-100 ${ringColor}`}
                    />
                )}

                {/* Live Pulse Effects */}
                {isLive && (
                    <>
                        <div
                            className={`absolute w-full h-full rounded-full animate-ping opacity-20 ${nodeColor}`}
                        />
                        <div
                            className={`absolute w-[180%] h-[180%] border rounded-full animate-pulse opacity-30 ${ringColor}`}
                        />
                    </>
                )}

                {/* Core Dot */}
                <div
                    className={`w-3 h-3 rounded-full shadow-[0_0_15px_currentColor] transition-all duration-300 z-10 ${nodeColor} ${
                        isSelected ? "scale-125" : "group-hover:scale-110"
                    }`}
                />

                {/* Hover Label (Only visible on hover or selection) */}
                <div
                    className={`
                    absolute top-8 whitespace-nowrap bg-black/90 backdrop-blur px-2 py-1 border border-white/10 
                    text-[9px] uppercase tracking-widest transition-all duration-300 pointer-events-none
                    ${
                        isSelected
                            ? "opacity-100 translate-y-0"
                            : "opacity-0 translate-y-[-5px] group-hover:opacity-100 group-hover:translate-y-0"
                    }
                `}>
                    <span
                        className={
                            isDystopian ? "text-yellow-400" : "text-cyan-400"
                        }>
                        {event.title}
                    </span>
                </div>
            </div>
        </button>
    );
};

// --- Main Component ---

const EventMap = ({ selectedDay }: { selectedDay: DayKey }) => {
    const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
    const [now, setNow] = useState(new Date());
    const { theme } = useTheme();
    const isDystopian = theme === "dystopia";
    const [isBooting, setIsBooting] = useState(true);

    // Boot Sequence
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
        return timelineData(hour, t)[selectedDay].events;
    }, [selectedDay]);

    const getEventStatus = (start: Date, end: Date) => {
        if (now > end) return "COMPLETED";
        if (now >= start && now <= end) return "LIVE NOW";
        return "SCHEDULED";
    };

    // Calculate SVG Path connecting the dots
    const pathData = useMemo(() => {
        return events.reduce((acc, point, i) => {
            // Map 0-100% to viewbox 1000x500
            const x = (point.coords.x / 100) * 1000;
            const y = (point.coords.y / 100) * 500;
            return i === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
        }, "");
    }, [events]);

    const activeEvent = events.find((e) => e.id === selectedEventId);

    return (
        <div
            className={`h-screen w-full bg-[#030303] overflow-hidden font-mono flex flex-col relative ${
                !isDystopian
                    ? "text-cyan-400 selection:bg-cyan-500/30"
                    : "text-yellow-400 selection:bg-yellow-500/30"
            }`}>
            {/* --- Background Elements --- */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#000000_90%)] pointer-events-none" />

            {/* --- Header --- */}
            <header className="relative w-full p-6 flex justify-end items-center pointer-events-none z-20">
                <div className="flex flex-col justify-center items-end">
                    <div className="text-[10px] uppercase tracking-widest mb-1 opacity-70">
                        Local System Time
                    </div>

                    <div
                        className={`text-2xl font-bold text-white tabular-nums drop-shadow-[0_0_10px_currentColor] ${
                            !isDystopian ? "text-cyan-400" : "text-yellow-400"
                        }`}>
                        {now.toLocaleDateString([], {
                            day: "numeric",
                            month: "long",
                        })}
                    </div>
                    <div
                        className={`text-3xl font-bold text-white tabular-nums drop-shadow-[0_0_10px_currentColor] ${
                            !isDystopian ? "text-cyan-400" : "text-yellow-400"
                        }`}>
                        {now.toLocaleTimeString([], { hour12: false })}
                    </div>
                </div>
            </header>

            {/* --- Main Content Layout --- */}
            <div
                className={`flex-1 flex relative w-full h-full transition-all duration-1000 ${
                    isBooting ? "opacity-0 scale-95" : "opacity-100 scale-100"
                }`}>
                {/* MAP AREA */}
                <div
                    className={`relative h-full transition-all duration-500 ease-in-out
                    ${selectedEventId ? "w-full md:w-[75%]" : "w-full"}
                    `}>
                    <div className="w-full h-full flex items-center justify-center p-4">
                        {/* Map Container */}
                        <div className="relative w-full max-w-5xl aspect-video select-none">
                            {/* SVG Layer */}
                            <svg
                                className="absolute inset-0 w-full h-full overflow-visible pointer-events-none"
                                viewBox="0 0 1000 500">
                                <path
                                    d={pathData}
                                    stroke={
                                        !isDystopian ? "#164e63" : "#632B16"
                                    }
                                    strokeWidth="2"
                                    fill="none"
                                    className="opacity-50"
                                />
                                {/* Animated Dash Overlay */}
                                <path
                                    d={pathData}
                                    stroke={
                                        !isDystopian ? "#22d3ee" : "#eab308"
                                    }
                                    strokeWidth="1"
                                    fill="none"
                                    strokeDasharray="10 20"
                                    className="opacity-30 animate-[dash_20s_linear_infinite]"
                                />
                            </svg>

                            {/* Nodes */}
                            {events.map((evt) => (
                                <MapNode
                                    key={evt.id}
                                    event={evt}
                                    status={getEventStatus(evt.start, evt.end)}
                                    isSelected={selectedEventId === evt.id}
                                    onClick={() =>
                                        setSelectedEventId(
                                            selectedEventId === evt.id
                                                ? null
                                                : evt.id,
                                        )
                                    }
                                    isDystopian={isDystopian}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Details Panel */}
                <div
                    className={`
                    fixed md:static inset-0 z-40 
                    md:border-l md:border-white/5 md:bg-black/20
                    transition-all duration-500 transform
                    ${
                        selectedEventId
                            ? "translate-x-0 opacity-100 w-full md:w-[25%]"
                            : "translate-x-full opacity-0 md:w-0 md:opacity-0 md:overflow-hidden"
                    }
                `}>
                    {/* Dark Overlay */}
                    <div
                        className="absolute inset-0 bg-black/80 md:hidden backdrop-blur-sm"
                        onClick={() => setSelectedEventId(null)}
                    />

                    {/* Panel */}
                    <div
                        className={`
                        absolute right-0 top-0 bottom-0 
                        w-[85%] md:w-full 
                        bg-[#050505] md:bg-transparent 
                        border-l border-white/10 md:border-none
                        shadow-2xl md:shadow-none
                    `}>
                        {activeEvent && (
                            <EventDetailsContent
                                event={activeEvent}
                                status={getEventStatus(
                                    activeEvent.start,
                                    activeEvent.end,
                                )}
                                isDystopian={isDystopian}
                                onClose={() => setSelectedEventId(null)}
                            />
                        )}
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes dash {
                    to {
                        stroke-dashoffset: -1000;
                    }
                }
            `}</style>
        </div>
    );
};

export default EventMap;
