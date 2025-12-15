"use client";

import { useTheme } from "@/contexts/ThemeContext";
import { IEvent } from "@/models/Event";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
    FaArrowLeft,
    FaCheck,
    FaChevronRight,
    FaFileAlt,
    FaFileDownload,
    FaInfoCircle,
    FaMicrochip,
    FaShareAlt,
    FaTerminal,
    FaTrophy,
    FaUsers,
} from "react-icons/fa";
import { GiPodiumSecond, GiPodiumThird, GiPodiumWinner } from "react-icons/gi";
import { IoExitOutline } from "react-icons/io5";

// Types
interface User {
    paid: boolean;
    events: string[];
}

interface RegistrationStatus {
    isRegistered: boolean;
    registration: any;
}

interface Team {
    _id: string;
    teamName: string;
    joinToken: string;
    teamMembers: any[];
}

// --- Theme Utilities ---
const useEventThemeClasses = () => {
    const { theme } = useTheme();

    return useMemo(() => {
        const isUtopia = theme === "utopia";
        return {
            textColor: isUtopia ? "text-cyan-300" : "text-amber-400",
            borderColor: isUtopia ? "border-cyan-500" : "border-amber-500",
            bgGlass: isUtopia ? "bg-cyan-950/30" : "bg-amber-950/30",
            accentColor: isUtopia ? "bg-cyan-500" : "bg-amber-500",
            accentGlow: isUtopia
                ? "shadow-[0_0_15px_rgba(6,182,212,0.5)]"
                : "shadow-[0_0_15px_rgba(245,158,11,0.5)]",
            accentHover: isUtopia ? "hover:bg-cyan-400" : "hover:bg-amber-400",
            textGlow: isUtopia
                ? "drop-shadow-[0_0_5px_rgba(6,182,212,0.8)]"
                : "drop-shadow-[0_0_5px_rgba(245,158,11,0.8)]",
            imageFilter: isUtopia
                ? "sepia-[.4] saturate-150 contrast-125"
                : "sepia-[.2] hue-rotate-180 saturate-150",
        };
    }, [theme]);
};

// --- Main Component ---
export default function EventPage({ params }: { params: { eventId: string } }) {
    const router = useRouter();
    const eventId = params.eventId;

    const themeClasses = useEventThemeClasses();
    const { theme } = useTheme();
    const isDystopia = theme === "dystopia";

    const [eventData, setEventData] = useState<IEvent | null>(null);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<User | null>(null);
    const [registration, setRegistration] = useState<RegistrationStatus>({
        isRegistered: false,
        registration: null,
    });
    const [userTeam, setUserTeam] = useState<Team | null>(null);

    useEffect(() => {
        let styleElement = document.getElementById(
            "gallery-clip-styles",
        ) as HTMLStyleElement;

        if (!styleElement) {
            styleElement = document.createElement("style");
            styleElement.id = "gallery-clip-styles";
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

        return () => styleElement?.remove();
    }, []);

    // --- Data fetching
    useEffect(() => {
        if (!eventId) {
            router.push("/events");
            return;
        }

        const token = localStorage.getItem("token");

        // Fetch event
        fetch(`/api/events/${eventId}`)
            .then((res) => {
                if (!res.ok) throw new Error("Event not found");
                return res.json();
            })
            .then((data: IEvent) => {
                setEventData(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Failed to load event:", err);
                router.push("/events");
            });

        // Authenticated requests
        if (token) {
            // Registration status
            fetch(`/api/events/${eventId}/registered`, {
                headers: { Authorization: `Bearer ${token}` },
            })
                .then((res) => res.json())
                .then((data) => setRegistration(data))
                .catch(console.error);

            // User team
            fetch(`/api/teams?eventId=${eventId}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
                .then((res) => res.json())
                .then((teams: Team[]) => {
                    if (Array.isArray(teams) && teams.length > 0) {
                        setUserTeam(teams[0]);
                    }
                })
                .catch(console.error);

            // User data
            try {
                const userStr = localStorage.getItem("user");
                if (userStr) {
                    const userData = JSON.parse(userStr);
                    setUser({
                        paid: Boolean(userData.isPaid),
                        events: userData.events || [],
                    });
                }
            } catch (err) {
                console.error("User data parse error:", err);
            }
        }
    }, [eventId, router]);

    if (loading) {
        return (
            <div className="fixed inset-0 bg-black flex items-center justify-center z-2">
                <div className="flex flex-col items-center gap-6">
                    <div className="relative w-24 h-24">
                        <div
                            className={`absolute inset-0 border-t-2 border-b-2 ${themeClasses.borderColor} rounded-full animate-spin`}
                        />
                        <div
                            className={`absolute inset-2 border-r-2 border-l-2 ${themeClasses.borderColor} rounded-full animate-reverse-spin`}
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <FaMicrochip
                                className={`${themeClasses.textColor} animate-pulse`}
                            />
                        </div>
                    </div>
                    <div
                        className={`${themeClasses.textColor} font-mono text-sm tracking-[0.5em] uppercase animate-pulse`}>
                        System Initializing...
                    </div>
                </div>
            </div>
        );
    }

    if (!eventData) return null;

    return (
        <div className="relative text-gray-100 font-sans selection:bg-cyan-500/30 overflow-x-hidden">
            {/* Background Elements */}
            <div className="fixed inset-0 z-0">
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    src="/events/eventbackground.mp4"
                    className="absolute inset-0 w-full h-full object-cover opacity-40 grayscale-[50%]"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/90 backdrop-blur-[2px]" />
                <div className="absolute inset-0 bg-[url('/events/eventbg.png')] bg-cover bg-center sm:h-screen h-[100vw] w-[100vh] origin-top-left top-0 left-full rotate-90 sm:w-screen sm:scale-95 sm:rotate-0 sm:origin-center sm:left-0" />
            </div>

            <Link
                href="/events"
                className={`clip-left absolute top-6 left-6 z-50 flex items-center gap-2 px-6 py-3 backdrop-blur-sm transition-all duration-300 hover:scale-105 active:scale-95 ${
                    isDystopia
                        ? "bg-[#ee8f59]/20 hover:bg-[#ee8f59]/40 text-white"
                        : "bg-cyan-500/20 hover:bg-cyan-500/40 text-white"
                }`}>
                <FaArrowLeft size={20} />
                <span className="font-semibold tracking-wider">Go Back</span>
            </Link>

            {/* Main Content */}
            <main className="relative w-full max-w-6xl mx-auto px-[calc(20vw-20px)] sm:px-4 md:px-[calc(10vw-50px)] xl:px-[calc(10vw-120px)] py-8 sm:h-[65vh] h-[80vh] overflow-y-auto sm:mt-[15vh] mt-[10vh] ">
                {/* Header Section */}
                <div className="mb-12 relative">
                    <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-white/20 to-transparent hidden md:block" />

                    <div className="flex flex-col gap-2">
                        <div
                            className={clsx(
                                "flex items-center gap-3 font-mono text-xs tracking-widest uppercase opacity-70",
                                themeClasses.textColor,
                            )}>
                            <span className="border border-current px-2 py-0.5 rounded-sm">
                                ID:{" "}
                                {(eventData._id as string).slice(-6) || "UNK"}
                            </span>
                            <span className="w-10 h-px bg-current opacity-50" />
                            <span>
                                {eventData.isTeamEvent
                                    ? "Team Protocol"
                                    : "Solo Operative"}
                            </span>
                        </div>

                        <h1
                            className={clsx(
                                "text-5xl sm:text-7xl md:text-8xl font-black tracking-tighter uppercase leading-[0.9]",
                                "text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-500",
                                themeClasses.textGlow,
                            )}>
                            {eventData.name}
                        </h1>
                        {/* Decorative dashes */}
                        <div className="flex gap-1 mt-2">
                            {[...Array(20)].map((_, i) => (
                                <div
                                    key={i}
                                    className={clsx(
                                        "h-1 w-full",
                                        Math.random() > 0.5
                                            ? "bg-white/20"
                                            : "bg-transparent",
                                    )}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                    {/* Left Column: Visuals & Details */}
                    <div className="lg:col-span-8 flex flex-col gap-10">
                        {/* Hero Image Frame */}
                        <div className="relative group">
                            {/* Tech Frame */}
                            <div
                                className={clsx(
                                    "absolute -inset-0.5 opacity-75 blur-sm transition duration-500 group-hover:opacity-100",
                                    themeClasses.accentColor,
                                )}
                            />
                            <div className="relative bg-black p-1 clip-path-polygon">
                                <div className="relative aspect-video overflow-hidden clip-path-polygon bg-gray-900">
                                    <Image
                                        src={eventData.img}
                                        alt={eventData.name}
                                        fill
                                        className={clsx(
                                            "object-cover transition-transform duration-700 group-hover:scale-105",
                                            themeClasses.imageFilter,
                                        )}
                                    />
                                    {/* Valid overlay scanlines */}
                                    <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.5)_50%)] bg-[length:100%_4px] pointer-events-none opacity-30" />

                                    {/* HUD Elements on Image */}
                                    <div className="absolute top-4 left-4 flex gap-1">
                                        <div className="w-2 h-2 bg-red-500 animate-pulse" />
                                        <div className="w-2 h-2 bg-red-500/50" />
                                        <div className="w-2 h-2 bg-red-500/20" />
                                    </div>
                                    <div className="absolute bottom-4 right-4 font-mono text-[10px] text-white/70 bg-black/60 px-2 py-1 border border-white/20">
                                        IMG_SRC_RENDER // V.2.0
                                    </div>
                                </div>
                            </div>

                            {/* Decorative corners */}
                            <div
                                className={clsx(
                                    "absolute -top-1 -left-1 w-6 h-6 border-l-2 border-t-2",
                                    themeClasses.borderColor,
                                )}
                            />
                            <div
                                className={clsx(
                                    "absolute -bottom-1 -right-1 w-6 h-6 border-r-2 border-b-2",
                                    themeClasses.borderColor,
                                )}
                            />
                        </div>

                        {/* Description Module */}
                        <div className="relative border-l-2 border-white/10 pl-6 lg:pl-10 py-2">
                            <div
                                className={clsx(
                                    "absolute -left-[3px] top-0 h-10 w-1",
                                    themeClasses.accentColor,
                                )}
                            />
                            <h2 className="3 font-bold tracking-widest text-white uppercase mb-6 flex items-center gap-3">
                                <FaTerminal
                                    className={clsx(
                                        "w-5",
                                        themeClasses.textColor,
                                    )}
                                />
                                <span className={themeClasses.textGlow}>
                                    Mission Brief
                                </span>
                            </h2>
                            <p
                                className={clsx(
                                    "text-lg leading-relaxed text-gray-300 font-light",
                                    themeClasses.textColor,
                                )}>
                                {eventData.description}
                            </p>

                            {/* Tags / Meta Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
                                <MetaCard
                                    icon={<FaUsers />}
                                    label="Team Configuration"
                                    value={
                                        eventData.isTeamEvent
                                            ? `${eventData.teamSizeMin} - ${eventData.teamSizeMax} OPERATIVES`
                                            : "SOLO OPERATIVE"
                                    }
                                    themeClasses={themeClasses}
                                />
                                <MetaCard
                                    icon={<FaTrophy />}
                                    label="Bounty Allocation"
                                    value={eventData.prizes.total}
                                    themeClasses={themeClasses}
                                />
                            </div>
                        </div>

                        {/* Additional Info Tabs/Sections */}
                        <EventDetailsSection
                            eventData={eventData}
                            themeClasses={themeClasses}
                        />
                    </div>

                    {/* Right Column: Sidebar (Registration & Coordinator) */}
                    <div className="lg:col-span-4 space-y-8">
                        {/* Registration Card - Sticky on Desktop */}
                        <div className="lg:sticky lg:top-24 space-y-8">
                            <div className={clsx("relative p-1")}>
                                {/* Border Glow */}
                                <div
                                    className={clsx(
                                        "absolute inset-0 opacity-50 blur-sm",
                                        themeClasses.accentColor,
                                    )}
                                />

                                <div className="relative bg-black border border-white/20 p-6 clip-path-chamfer">
                                    {/* Corner Accents */}
                                    <div className="absolute top-0 left-0 w-3 h-3 bg-white/20" />
                                    <div className="absolute top-0 right-0 w-3 h-3 bg-white/20" />
                                    <div className="absolute bottom-0 left-0 w-3 h-3 bg-white/20" />
                                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-white/20" />

                                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2 uppercase tracking-wider">
                                        <div
                                            className={clsx(
                                                "w-2 h-2 rounded-full animate-pulse",
                                                themeClasses.accentColor,
                                            )}
                                        />
                                        Access Control
                                    </h3>

                                    <RegisterButton
                                        user={user}
                                        eventId={eventData._id as string}
                                        isRegistered={registration.isRegistered}
                                        accentColor={themeClasses.accentColor}
                                        accentHover={themeClasses.accentHover}
                                        themeClasses={themeClasses}
                                        router={router}
                                        onRegisterSuccess={() =>
                                            setRegistration({
                                                isRegistered: true,
                                                registration: null,
                                            })
                                        }
                                        isTeamEvent={eventData.isTeamEvent}
                                        teamSizeMin={eventData.teamSizeMin}
                                        teamSizeMax={eventData.teamSizeMax}
                                        userTeam={userTeam}
                                        registration={registration.registration}
                                    />

                                    {eventData.rulebookurl && (
                                        <a
                                            href={eventData.rulebookurl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="mt-6 group flex items-center justify-center gap-3 w-full py-3 px-4 bg-transparent border border-gray-600 hover:border-gray-400 text-gray-300 hover:text-white transition-all text-xs font-mono tracking-wider uppercase relative overflow-hidden">
                                            <div className="absolute top-0 left-0 w-[2px] h-full bg-white scale-y-0 group-hover:scale-y-100 transition-transform origin-top" />
                                            <FaFileDownload className="group-hover:animate-bounce" />
                                            Download Protocols
                                            <div className="absolute bottom-0 right-0 w-[2px] h-full bg-white scale-y-0 group-hover:scale-y-100 transition-transform origin-bottom" />
                                        </a>
                                    )}
                                </div>
                            </div>

                            {/* Prizes Widget */}
                            <PrizesWidget
                                eventData={eventData}
                                themeClasses={themeClasses}
                            />

                            {/* Coordinator Widget */}
                            {eventData.event_head && (
                                <div className="group relative">
                                    <div className="absolute -inset-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                                    <div className="relative bg-black/80 backdrop-blur-md border border-white/10 p-5">
                                        {/* Tech decoration */}
                                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[1px] bg-white/20"></div>

                                        {/* eslint-disable-next-line react/jsx-no-comment-textnodes */}
                                        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-[0.2em] mb-4 text-center">
                                            // Communication Node
                                        </h3>
                                        <div className="flex items-center gap-4">
                                            <div
                                                className={clsx(
                                                    "w-12 h-12 flex items-center justify-center font-bold text-black clip-path-hexagon",
                                                    themeClasses.accentColor,
                                                )}>
                                                {eventData.event_head.name[0]}
                                            </div>
                                            <div className="overflow-hidden">
                                                <p className="font-bold text-white text-base uppercase">
                                                    {eventData.event_head.name}
                                                </p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <div
                                                        className={clsx(
                                                            "w-1 h-1 rounded-full",
                                                            themeClasses.accentColor,
                                                        )}
                                                    />
                                                    <p
                                                        className={clsx(
                                                            "font-mono text-xs tracking-wider",
                                                            themeClasses.textColor,
                                                        )}>
                                                        {
                                                            eventData.event_head
                                                                .Phone
                                                        }
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            <style jsx global>{`
                .clip-path-polygon {
                    clip-path: polygon(
                        10px 0,
                        100% 0,
                        100% calc(100% - 10px),
                        calc(100% - 10px) 100%,
                        0 100%,
                        0 10px
                    );
                }
                .clip-path-chamfer {
                    clip-path: polygon(
                        0 0,
                        100% 0,
                        100% 100%,
                        20px 100%,
                        0 calc(100% - 20px)
                    );
                }
                .clip-path-slanted {
                    clip-path: polygon(
                        0 0,
                        calc(100% - 20px) 0,
                        100% 20px,
                        100% 100%,
                        0 100%
                    );
                }
                .clip-path-btn {
                    clip-path: polygon(
                        10px 0,
                        100% 0,
                        100% calc(100% - 10px),
                        calc(100% - 10px) 100%,
                        0 100%,
                        0 10px
                    );
                }
                .clip-path-hexagon {
                    clip-path: polygon(
                        25% 0%,
                        75% 0%,
                        100% 50%,
                        75% 100%,
                        25% 100%,
                        0% 50%
                    );
                }
            `}</style>
        </div>
    );
}

// --- Subcomponents ---

function MetaCard({
    icon,
    label,
    value,
    themeClasses,
}: {
    icon: any;
    label: string;
    value: any;
    themeClasses: any;
}) {
    return (
        <div className="bg-white/5 border border-white/10 p-4 relative overflow-hidden group">
            <div
                className={clsx(
                    "absolute top-0 right-0 w-2 h-2 opacity-50",
                    themeClasses.accentColor,
                )}
            />
            <div className="flex items-start gap-3 relative z-1">
                <div
                    className={clsx(
                        "p-2 bg-black/50 rounded-sm border border-white/10",
                        themeClasses.textColor,
                    )}>
                    {icon}
                </div>
                <div>
                    <h4 className="text-[10px] uppercase text-gray-500 tracking-wider font-mono mb-1">
                        {label}
                    </h4>
                    <p className="text-white font-bold font-mono text-sm">
                        {value}
                    </p>
                </div>
            </div>
            {/* Hover Grid Effect */}
            <div className="absolute inset-0 bg-[url('/grid.png')] opacity-0 group-hover:opacity-10 transition-opacity" />
        </div>
    );
}

function PrizesWidget({
    eventData,
    themeClasses,
}: {
    eventData: IEvent;
    themeClasses: any;
}) {
    const { prizes } = eventData;
    return (
        <div className="relative border-l-2 border-white/20 pl-4">
            <div className="absolute -left-[2px] top-0 h-8 w-[2px] bg-white text-glow" />

            <h3 className="text-xl font-bold text-white mb-6 uppercase tracking-wider">
                Rank Rewards
            </h3>
            <div className="space-y-3">
                <div className="relative group">
                    <div
                        className={clsx(
                            "absolute inset-0 opacity-20 blur-md transition-opacity group-hover:opacity-40",
                            themeClasses.accentColor,
                        )}
                    />
                    <div className="relative flex items-center justify-between p-4 bg-black/60 border border-white/10 clip-path-slanted">
                        <div className="flex items-center gap-4">
                            <span className="text-3xl drop-shadow-md">
                                <GiPodiumWinner />
                            </span>
                            <span className="font-mono text-xs text-gray-400 uppercase tracking-widest">
                                Target_01
                            </span>
                        </div>
                        <span
                            className={clsx(
                                "font-bold text-xl font-mono",
                                themeClasses.textColor,
                                themeClasses.textGlow,
                            )}>
                            {prizes.winner}
                        </span>
                    </div>
                </div>

                {prizes.first_runner_up && (
                    <div className="relative flex items-center justify-between p-3 bg-black/40 border border-white/5">
                        <div className="flex items-center gap-4">
                            <span className="text-3xl opacity-80">
                                <GiPodiumSecond />
                            </span>
                            <span className="font-mono text-xs text-gray-500 uppercase tracking-widest">
                                Target_02
                            </span>
                        </div>
                        <span
                            className={clsx(
                                "font-bold font-mono text-gray-200",
                            )}>
                            {prizes.first_runner_up}
                        </span>
                    </div>
                )}
                {prizes.second_runner_up && (
                    <div className="relative flex items-center justify-between p-3 bg-black/40 border border-white/5">
                        <div className="flex items-center gap-4">
                            <span className="text-3xl opacity-80">
                                <GiPodiumThird />
                            </span>

                            <span className="font-mono text-xs text-gray-500 uppercase tracking-widest">
                                Target_03
                            </span>
                        </div>
                        <span
                            className={clsx(
                                "font-bold font-mono text-gray-200",
                            )}>
                            {prizes.second_runner_up}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}

function EventDetailsSection({
    eventData,
    themeClasses,
}: {
    eventData: IEvent;
    themeClasses: any;
}) {
    const hasDetails = eventData.details && eventData.details.length > 0;
    const hasRules = eventData.rules && eventData.rules.length > 0;

    if (!hasDetails && !hasRules) return null;

    return (
        <div className="grid grid-cols-1 gap-12 mt-8">
            {hasRules && (
                <div className="space-y-6">
                    <h3 className="text-xl font-bold text-white flex items-center gap-3 border-b border-white/10 pb-2">
                        <FaFileAlt className={clsx(themeClasses.textColor)} />
                        Engagement Rules
                        <span className="ml-auto text-[10px] font-mono text-gray-600 bg-gray-900 border border-gray-800 px-2 py-1">
                            READ-ONLY
                        </span>
                    </h3>
                    <ul className="grid gap-3">
                        {eventData.rules!.map((r, i) => (
                            <li
                                key={i}
                                className="group relative flex gap-4 text-gray-300 leading-relaxed pl-4">
                                {/* Decorative line */}
                                <div
                                    className={clsx(
                                        "absolute left-0 top-2 bottom-2 w-[2px] bg-white/10 group-hover:bg-current transition-colors",
                                        themeClasses.textColor,
                                    )}
                                />
                                <span
                                    className={clsx(
                                        "font-mono font-bold text-sm mt-1 opacity-50",
                                    )}>
                                    {(i + 1).toString().padStart(2, "0")}
                                </span>
                                <span className="text-sm font-light hover:text-white transition-colors">
                                    {r}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {hasDetails && (
                <div className="space-y-6">
                    <h3 className="text-xl font-bold text-white flex items-center gap-3 border-b border-white/10 pb-2">
                        <FaInfoCircle
                            className={clsx(themeClasses.textColor)}
                        />
                        Data & Parameters
                        <span className="ml-auto text-[10px] font-mono text-gray-600 bg-gray-900 border border-gray-800 px-2 py-1">
                            INFO_SEC
                        </span>
                    </h3>
                    <div className="bg-black/40 border border-white/10 p-6 relative">
                        {/* Corner markers */}
                        <div className="absolute top-0 left-0 w-2 h-2 border-l border-t border-white/30" />
                        <div className="absolute top-0 right-0 w-2 h-2 border-r border-t border-white/30" />
                        <div className="absolute bottom-0 left-0 w-2 h-2 border-l border-b border-white/30" />
                        <div className="absolute bottom-0 right-0 w-2 h-2 border-r border-b border-white/30" />

                        <div className="space-y-4">
                            {eventData.details!.map((d, i) => (
                                <div
                                    key={i}
                                    className="text-gray-300 leading-relaxed flex gap-3 text-sm">
                                    <FaChevronRight
                                        className={clsx(
                                            "w-3 h-3 mt-1 shrink-0",
                                            themeClasses.textColor,
                                        )}
                                    />
                                    {d}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function RegisterButton({
    user,
    eventId,
    isRegistered,
    accentColor,
    accentHover,
    themeClasses,
    router,
    onRegisterSuccess,
    isTeamEvent,
    teamSizeMin = 1,
    teamSizeMax = 4,
    userTeam,
    registration,
}: {
    user: User | null;
    eventId: string;
    isRegistered: boolean;
    accentColor: string;
    accentHover: string;
    themeClasses: any;
    router: ReturnType<typeof useRouter>;
    onRegisterSuccess: () => void;
    isTeamEvent?: boolean;
    teamSizeMin?: number;
    teamSizeMax?: number;
    userTeam: Team | null;
    registration: any;
}) {
    const [isRegistering, setIsRegistering] = useState(false);
    const [showCreateTeam, setShowCreateTeam] = useState(false);
    const [teamName, setTeamName] = useState("");
    const [isCreatingTeam, setIsCreatingTeam] = useState(false);
    const [createdTeam, setCreatedTeam] = useState<Team | null>(null);
    const [inviteLink, setInviteLink] = useState("");

    const currentTeam = createdTeam || userTeam || registration;

    const copyToClipboard = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            alert("Invitation link copied to clipboard!");
        } catch (err) {
            console.warn("Clipboard copy failed:", err);
            const textarea = document.createElement("textarea");
            textarea.value = text;
            textarea.style.position = "fixed";
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand("copy");
            document.body.removeChild(textarea);
            alert("Invitation link copied to clipboard!");
        }
    };

    const buttonBaseClasses = `
        w-full py-4 px-6 font-bold text-black transition-all transform active:scale-[0.98] 
        flex items-center justify-center gap-2 text-sm sm:text-base tracking-widest uppercase
        clip-path-btn relative overflow-hidden group
    `;

    // Tech button wrapper
    const TechButton = ({ onClick, disabled, children, className }: any) => (
        <button
            onClick={onClick}
            disabled={disabled}
            className={clsx(
                buttonBaseClasses,
                accentColor,
                accentHover,
                disabled && "opacity-50 cursor-not-allowed grayscale",
                className,
            )}>
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            <span className="relative z-1 flex items-center justify-center gap-2">
                {children}
            </span>
        </button>
    );

    // ========= Render States =========
    if (!user) {
        return (
            <TechButton onClick={() => router.push("/login")}>
                Initialize Session [Login]
            </TechButton>
        );
    }

    if (!user.paid) {
        return (
            <TechButton
                onClick={() => {
                    alert("Please complete payment to register for events");
                    router.push("/dashboard");
                }}>
                Credits Required [Pay]
            </TechButton>
        );
    }

    if (isRegistered) {
        if (isTeamEvent && currentTeam?.joinToken) {
            const fullInviteLink = `${window.location.origin}/teams/join/${currentTeam.joinToken}`;
            return (
                <div className="space-y-4">
                    <div className="bg-green-500/10 border border-green-500/30 p-4 clip-path-polygon relative">
                        <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-green-500" />
                        <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-green-500" />

                        <div className="flex justify-center items-center gap-3">
                            <div className="w-6 h-6 rounded-sm bg-green-500 flex items-center justify-center text-black font-bold">
                                <FaCheck size={12} />
                            </div>
                            <div className="text-green-400 font-bold font-mono text-sm tracking-wider">
                                STATUS: REGISTERED
                            </div>
                        </div>
                    </div>
                    <TechButton
                        onClick={() =>
                            copyToClipboard(inviteLink || fullInviteLink)
                        }>
                        <FaShareAlt />
                        Share Uplink
                    </TechButton>
                </div>
            );
        }

        return (
            <div className="bg-green-500/10 border border-green-500/30 p-4 clip-path-polygon flex items-center gap-3 w-full">
                <div className="w-6 h-6 rounded-sm bg-green-500 flex items-center justify-center text-black font-bold">
                    ✓
                </div>
                <div className="text-green-400 font-bold font-mono text-sm tracking-wider">
                    STATUS: REGISTERED
                </div>
            </div>
        );
    }

    // ========= Team Event Logic =========
    if (isTeamEvent) {
        if (currentTeam) {
            const memberCount = Array.isArray(currentTeam.teamMembers)
                ? currentTeam.teamMembers.length
                : 1;

            const fullInviteLink = `${window.location.origin}/teams/join/${currentTeam.joinToken}`;
            return (
                <div className="space-y-4">
                    <div className="bg-gray-900/80 border border-gray-700 p-5 backdrop-blur-sm relative">
                        {/* Tech Corners */}
                        <div className="absolute top-0 left-0 w-2 h-2 border-l border-t border-white/50" />
                        <div className="absolute top-0 right-0 w-2 h-2 border-r border-t border-white/50" />

                        <div className="flex justify-between items-center mb-3">
                            <span className="text-gray-300 font-bold text-xs font-mono uppercase">
                                UNIT: {currentTeam.teamName}
                            </span>
                            <span className="text-[10px] px-2 py-1 bg-gray-800 border border-gray-700 rounded-sm text-gray-300 font-mono">
                                {memberCount}/{teamSizeMax} UNITS
                            </span>
                        </div>

                        <div className="flex gap-1">
                            <input
                                readOnly
                                value={inviteLink || fullInviteLink}
                                className="flex-1 bg-black border border-gray-700 px-3 py-2 text-gray-300 text-[10px] font-mono tracking-wider focus:outline-none focus:border-white/50"
                            />
                            <button
                                onClick={() =>
                                    copyToClipboard(
                                        inviteLink || fullInviteLink,
                                    )
                                }
                                className="px-3 py-2 bg-gray-800 border border-gray-700 hover:bg-gray-700 text-white text-[10px] font-bold font-mono uppercase hover:text-cyan-400 transition-colors">
                                Copy
                            </button>
                        </div>
                    </div>

                    <TechButton
                        onClick={async () => {
                            const token = localStorage.getItem("token");
                            if (!token) {
                                router.push("/login");
                                return;
                            }
                            setIsRegistering(true);
                            try {
                                const res = await fetch(
                                    "/api/events/register",
                                    {
                                        method: "POST",
                                        headers: {
                                            "Content-Type": "application/json",
                                            Authorization: `Bearer ${token}`,
                                        },
                                        body: JSON.stringify({
                                            eventId,
                                            teamId: currentTeam._id,
                                        }),
                                    },
                                );
                                const data = await res.json();
                                if (!res.ok)
                                    throw new Error(
                                        data.error || "Registration failed",
                                    );
                                onRegisterSuccess();
                                alert("Team registered successfully!");
                            } catch (err: any) {
                                alert(err.message || "Failed to register team");
                            } finally {
                                setIsRegistering(false);
                            }
                        }}
                        disabled={isRegistering || memberCount < teamSizeMin}>
                        {isRegistering
                            ? "Processing..."
                            : memberCount < teamSizeMin
                            ? `Assemble ${teamSizeMin} Units`
                            : "Confirm Deployment"}
                    </TechButton>
                </div>
            );
        }

        if (showCreateTeam) {
            return (
                <div className="space-y-4 animate-slide-in">
                    <div className="bg-black/60 border border-gray-700 p-5 relative">
                        <div
                            className={clsx(
                                "absolute top-0 left-0 w-full h-[1px]",
                                themeClasses.accentColor,
                            )}
                        />

                        <h4 className="text-white font-bold mb-4 flex items-center justify-between font-mono text-xs uppercase tracking-widest">
                            New Unit Formation
                            <span className="text-gray-500">
                                Size: {teamSizeMin}–{teamSizeMax}
                            </span>
                        </h4>
                        <div className="space-y-3">
                            <input
                                type="text"
                                value={teamName}
                                onChange={(e) => setTeamName(e.target.value)}
                                placeholder="ENTER UNIT DESIGNATION"
                                className={clsx(
                                    "w-full bg-transparent border-b-2 border-gray-700 px-2 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-current font-mono text-sm transition-colors",
                                    themeClasses.textColor,
                                )}
                            />
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={async () => {
                                const token = localStorage.getItem("token");
                                if (!token) {
                                    router.push("/login");
                                    return;
                                }
                                if (!teamName.trim()) {
                                    alert("Enter a team name");
                                    return;
                                }
                                setIsCreatingTeam(true);
                                try {
                                    const res = await fetch("/api/teams", {
                                        method: "POST",
                                        headers: {
                                            "Content-Type": "application/json",
                                            Authorization: `Bearer ${token}`,
                                        },
                                        body: JSON.stringify({
                                            eventId,
                                            teamName: teamName.trim(),
                                        }),
                                    });
                                    if (res.status === 401) {
                                        localStorage.setItem("token", "");
                                        localStorage.setItem("user", "");
                                        router.push("/login");
                                        return;
                                    }
                                    const data = await res.json();
                                    if (!res.ok) throw new Error(data.error);
                                    setCreatedTeam(data);
                                    const link = `${window.location.origin}/teams/join/${data.joinToken}`;
                                    setInviteLink(link);
                                    setShowCreateTeam(false);
                                    alert(
                                        "Team created! Share the invite link.",
                                    );
                                } catch (err: any) {
                                    alert(
                                        err.message || "Team creation failed",
                                    );
                                } finally {
                                    setIsCreatingTeam(false);
                                }
                            }}
                            disabled={isCreatingTeam || !teamName.trim()}
                            className={clsx(
                                "flex-1 font-bold text-black py-3 uppercase tracking-wider text-sm clip-path-slanted hover:brightness-110 transition-all",
                                accentColor,
                                (!teamName.trim() || isCreatingTeam) &&
                                    "opacity-50",
                            )}>
                            {isCreatingTeam ? "CREATING..." : "INITIATE"}
                        </button>
                        <button
                            onClick={() => setShowCreateTeam(false)}
                            className="px-6 py-3 bg-transparent border border-gray-600 hover:border-gray-400 text-gray-400 hover:text-white font-mono text-xs uppercase tracking-wider transition-colors">
                            ABORT
                        </button>
                    </div>
                </div>
            );
        }

        return (
            <TechButton onClick={() => setShowCreateTeam(true)}>
                Form Unit & Deploy
            </TechButton>
        );
    }

    // ========= Individual Event =========
    return (
        <TechButton
            onClick={async () => {
                const token = localStorage.getItem("token");
                if (!token) {
                    router.push("/login");
                    return;
                }
                setIsRegistering(true);
                try {
                    const res = await fetch("/api/events/register", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({ eventId }),
                    });
                    const data = await res.json();
                    if (!res.ok) throw new Error(data.error);
                    onRegisterSuccess();
                    alert("Registered successfully!");
                } catch (err: any) {
                    alert(err.message || "Registration failed");
                } finally {
                    setIsRegistering(false);
                }
            }}
            disabled={isRegistering}>
            {isRegistering ? "Processing..." : "Engage Protocol [Register]"}
        </TechButton>
    );
}
