"use client";

import React from "react";
import Link from "next/link";
import { Calendar, Zap, Loader2, Trash2 } from "lucide-react";
import { useLoginTheme } from "@/components/login/theme";
import { cn } from "@/lib/utils";

export default function RegisteredEvent({
    registeredEvents,
}: {
    registeredEvents: any[];
}) {
    const theme = useLoginTheme();

    const [loadingMap, setLoadingMap] = React.useState<Record<string, boolean>>({});

    const handleUnregister = async (registrationId: string) => {
        if (!confirm("Are you sure you want to unregister from this event?")) return;

        setLoadingMap((prev) => ({ ...prev, [registrationId]: true }));
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                alert("Please login first");
                return;
            }

            const response = await fetch(`/api/teams/${registrationId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || "Failed to unregister");
            }

            alert("Successfully unregistered from the event");
            window.location.reload();
        } catch (error: any) {
            alert(error.message || "Failed to unregister");
        } finally {
            setLoadingMap((prev) => ({ ...prev, [registrationId]: false }));
        }
    };

    return (
        <div className="space-y-3">
            {registeredEvents.map((event) => (
                <div
                    key={event.id}
                    className={cn(
                        "p-4 border rounded-lg backdrop-blur-md transition-all relative overflow-hidden group",
                        theme.borderColorDim,
                        theme.bgGlass,
                    )}>
                    {/* 🏷️ Event Header */}
                    <div className="flex items-start justify-between gap-3 mb-2">
                        <div>
                            <div
                                className={cn(
                                    "text-sm font-bold text-slate-200 tracking-wide",
                                    theme.textColor,
                                )}>
                                {event.name}
                            </div>
                            <div className="text-xs text-slate-500 mt-1 uppercase tracking-wider font-semibold">
                                Team: {event.team}
                            </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                            <span
                                className={cn(
                                    "text-[10px] uppercase font-bold px-2 py-0.5 rounded border tracking-wider",
                                    event.status === "Confirmed" || event.isVerified
                                        ? "bg-green-500/10 text-green-400 border-green-500/30"
                                        : "bg-red-500/10 text-red-400 border-red-500/30",
                                )}>
                                {event.status === "Confirmed" || event.isVerified
                                    ? "Verified"
                                    : "Unverified"}
                            </span>

                            {/* Unregister Button for Individual Events */}
                            {event.registration?.isIndividual && (
                                <button
                                    onClick={() => handleUnregister(event.id)}
                                    disabled={loadingMap[event.id]}
                                    className="flex items-center gap-1 text-[10px] text-red-400 hover:text-red-300 border border-red-500/20 bg-red-500/10 hover:bg-red-500/20 px-2 py-1 rounded transition-all uppercase font-bold tracking-wider disabled:opacity-50"
                                >
                                    {loadingMap[event.id] ? (
                                        <Loader2 size={10} className="animate-spin" />
                                    ) : (
                                        <Trash2 size={10} />
                                    )}
                                    Unregister
                                </button>
                            )}
                        </div>
                    </div>

                    {/* 📅 Event Details */}
                    <div className="space-y-1 mt-3 pt-3 border-t border-white/5">
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                            <Calendar size={12} className="opacity-70" />
                            <span className="font-mono">{event.date}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                            <Zap size={12} className="opacity-70" />
                            <span className="font-mono">{event.time}</span>
                        </div>
                    </div>
                </div>
            ))}
            {/* Explore Events Link */}
            <Link
                href="/events"
                className={cn(
                    "flex items-center justify-center p-3 mt-4 border border-dashed rounded-lg transition-all hover:bg-white/5 group",
                    theme.borderColorDim,
                )}>
                <span
                    className={cn(
                        "text-sm font-bold uppercase tracking-wider flex items-center gap-2",
                        theme.textColor,
                    )}>
                    Explore other events
                    <Zap size={14} className="group-hover:translate-x-1 transition-transform" />
                </span>
            </Link>
        </div>
    );
}
