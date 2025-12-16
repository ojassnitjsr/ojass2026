"use client";

import React from "react";
import { Calendar, Zap } from "lucide-react";
import { useLoginTheme } from "@/components/login/theme";
import { cn } from "@/lib/utils";

export default function RegisteredEvent({
    registeredEvents,
}: {
    registeredEvents: any[];
}) {
    const theme = useLoginTheme();

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
        </div>
    );
}
