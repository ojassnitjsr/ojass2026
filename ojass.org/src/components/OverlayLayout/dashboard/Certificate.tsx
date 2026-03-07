"use client";
import React, { useState } from "react";
import { Award, Download, Eye, CheckCircle, X, ExternalLink } from "lucide-react";
import { useLoginTheme } from "@/components/login/theme";
import { cn } from "@/lib/utils";

interface CertificateEntry {
    id: string;
    eventName: string;
    participantName: string;
    ojassId: string;
    isTeam: boolean;
    teamName?: string;
}

interface CertificateProps {
    verifiedEvents: {
        id: string;
        name: string;
        isVerified: boolean;
        status: string;
    }[];
    profileData: {
        name: string;
        ojassId: string;
    };
}

function certUrl(entry: CertificateEntry): string {
    const p = new URLSearchParams({
        name: entry.participantName,
        ojassId: entry.ojassId,
        eventName: entry.eventName,
    });
    return `/certificate/view?${p.toString()}`;
}

export default function Certificate({
    verifiedEvents,
    profileData,
}: CertificateProps) {
    const theme = useLoginTheme();
    const [previewEntry, setPreviewEntry] = useState<CertificateEntry | null>(null);

    // Build list — verified events only
    const certificates: CertificateEntry[] = verifiedEvents
        .filter((e) => e.isVerified || e.status === "Confirmed")
        .map((e) => ({
            id: `event-${e.id}`,
            eventName: e.name,
            participantName: profileData.name,
            ojassId: profileData.ojassId,
            isTeam: false,
        }));

    // ── Empty state ────────────────────────────────────────────────────────
    if (certificates.length === 0) {
        return (
            <div
                className={cn(
                    "p-8 border rounded-lg backdrop-blur-md text-center",
                    theme.borderColorDim,
                    theme.bgGlass,
                )}>
                <Award
                    size={40}
                    className={cn("mx-auto mb-4 opacity-40", theme.textColor)}
                />
                <div
                    className={cn(
                        "text-base font-bold mb-2 uppercase tracking-wide",
                        theme.textColor,
                    )}>
                    No Certificates Available
                </div>
                <div className="text-sm text-slate-500 max-w-xs mx-auto leading-relaxed">
                    Certificates are issued only for{" "}
                    <span className="text-green-400 font-semibold">verified</span>{" "}
                    team/event registrations. Complete verification to unlock your
                    certificates.
                </div>
            </div>
        );
    }

    // ── Certificate cards ──────────────────────────────────────────────────
    return (
        <div className="space-y-3">
            {/* Header */}
            <div className="flex items-center gap-2 mb-4">
                <Award size={16} className={cn(theme.textColor)} />
                <span
                    className={cn(
                        "text-xs font-mono uppercase tracking-widest",
                        theme.textColorDim,
                    )}>
                    {certificates.length} Certificate
                    {certificates.length !== 1 ? "s" : ""} Available
                </span>
            </div>

            {/* Cards */}
            {certificates.map((cert) => (
                <div
                    key={cert.id}
                    className={cn(
                        "p-4 border rounded-xl backdrop-blur-md transition-all relative overflow-hidden",
                        theme.borderColorDim,
                        theme.bgGlass,
                    )}>
                    {/* Corner accent */}
                    <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/5 rounded-bl-full pointer-events-none" />

                    <div className="flex items-start gap-3">
                        {/* Icon */}
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 bg-green-500/10 border border-green-500/20">
                            <Award size={18} className="text-green-400" />
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                                <span className="text-sm font-bold tracking-wide text-slate-100">
                                    {cert.eventName}
                                </span>
                                <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-green-500/10 text-green-400 border border-green-500/20 uppercase tracking-wider">
                                    <CheckCircle size={9} />
                                    Verified
                                </span>
                            </div>
                            <div className="text-xs text-slate-400 mb-0.5">
                                {cert.isTeam ? (
                                    <span>
                                        Team:{" "}
                                        <span className="text-slate-300 font-medium">
                                            {cert.teamName}
                                        </span>
                                    </span>
                                ) : (
                                    <span>Individual Participation</span>
                                )}
                            </div>
                            <div className="text-[11px] text-slate-500 font-mono">
                                {cert.participantName} &bull;{" "}
                                <span className="opacity-70">{cert.ojassId}</span>
                            </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-1.5 flex-shrink-0">
                            {/* Preview — opens modal with iframe */}
                            <button
                                onClick={() => setPreviewEntry(cert)}
                                title="View Certificate"
                                className="p-2 rounded-lg border transition-all hover:scale-105 active:scale-95 bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white">
                                <Eye size={14} />
                            </button>

                            {/* Download — open in new tab (user can Ctrl+P / Save as PDF) */}
                            <a
                                href={certUrl(cert)}
                                target="_blank"
                                rel="noreferrer"
                                title="Open to download (use browser print/save)"
                                className="p-2 rounded-lg border transition-all hover:scale-105 active:scale-95 bg-green-500/10 border-green-500/20 text-green-400 hover:bg-green-500/20 flex items-center">
                                <Download size={14} />
                            </a>
                        </div>
                    </div>
                </div>
            ))}

            {/* Preview Modal — iframe showing the exact certificate page */}
            {previewEntry && (
                <div
                    className="fixed inset-0 bg-black/95 backdrop-blur-md flex items-center justify-center z-[200] p-4 lg:pl-[calc(33.33%+1rem)] xl:pl-[calc(25%+1rem)]"
                    onClick={() => setPreviewEntry(null)}>
                    <div
                        className="relative w-full max-w-5xl mx-auto"
                        onClick={(e) => e.stopPropagation()}>
                        {/* Header */}
                        <div className="flex items-center justify-between mb-3 px-1">
                            <span className="text-slate-300 text-sm font-mono uppercase tracking-wider truncate pr-4">
                                {previewEntry.eventName} — Certificate Preview
                            </span>
                            <div className="flex items-center gap-2 flex-shrink-0">
                                {/* Open full page */}
                                <a
                                    href={certUrl(previewEntry)}
                                    target="_blank"
                                    rel="noreferrer"
                                    title="Open in full tab (then Ctrl+P to save as PDF)"
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold uppercase tracking-wider bg-green-500/20 border border-green-500/40 text-green-400 hover:bg-green-500/30 transition-all">
                                    <ExternalLink size={12} />
                                    Open &amp; Download
                                </a>
                                <button
                                    onClick={() => setPreviewEntry(null)}
                                    className="p-1.5 rounded-lg bg-white/10 text-slate-300 hover:bg-white/20 hover:text-white transition-all">
                                    <X size={16} />
                                </button>
                            </div>
                        </div>

                        {/* iframe — renders the real HTML/CSS/font */}
                        <div className="rounded-xl overflow-hidden shadow-2xl border border-white/10">
                            <iframe
                                src={certUrl(previewEntry)}
                                title="Certificate Preview"
                                className="w-full block mx-auto"
                                style={{ height: "56vw", maxHeight: "72vh", border: "none", display: "block" }}
                                loading="eager"
                            />
                        </div>

                        {/* Hint */}
                        <p className="mt-3 text-center text-xs text-slate-500 font-mono">
                            Click <span className="text-green-400">Open &amp; Download</span> → then press{" "}
                            <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-slate-300">Ctrl+P</kbd> and select{" "}
                            <span className="text-slate-300">Save as PDF</span>
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
