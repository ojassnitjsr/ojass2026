"use client";
import React from "react";
import { Award, Calendar } from "lucide-react";
import { FaEye, FaDownload } from "react-icons/fa";
import { useLoginTheme } from "@/components/login/theme";
import { cn } from "@/lib/utils";

interface Certificate {
    id: string;
    event: string;
    type: string;
    date: string;
    url: string;
}

export default function Certificate({
    certificates,
}: {
    certificates: Certificate[];
}) {
    const theme = useLoginTheme();

    const handleView = (url: string) => {
        window.open(url, "_blank");
    };

    const handleDownload = (url: string, name: string) => {
        const link = document.createElement("a");
        link.href = url;
        link.download = name || "certificate.pdf";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="space-y-3 overflow-y-auto">
            {certificates && certificates.length > 0 ? (
                certificates.map((cert) => (
                    <div
                        key={cert.id}
                        className={cn(
                            "p-4 border rounded-lg backdrop-blur-md transition-all relative overflow-hidden group",
                            theme.borderColorDim,
                            theme.bgGlass,
                        )}>
                        <div className="flex items-start gap-3">
                            <Award
                                size={18}
                                className={cn(
                                    "mt-1 flex-shrink-0",
                                    theme.textColor,
                                )}
                            />
                            <div className="flex-1 min-w-0">
                                <div
                                    className={cn(
                                        "text-sm font-bold text-slate-200",
                                        theme.textColor,
                                    )}>
                                    {cert.event}
                                </div>
                                <div
                                    className={cn(
                                        "text-xs font-medium mb-1 opacity-80",
                                        theme.textColorDim,
                                    )}>
                                    {cert.type}
                                </div>
                                <div className="flex items-center gap-2 text-xs text-slate-400">
                                    <Calendar size={12} />
                                    {cert.date}
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => handleView(cert.url)}
                                    className={cn(
                                        "p-2 rounded-full transition-all hover:bg-white/10",
                                        theme.textColor,
                                    )}
                                    title="View Certificate">
                                    <FaEye size={14} />
                                </button>
                                <button
                                    onClick={() =>
                                        handleDownload(cert.url, cert.event)
                                    }
                                    className={cn(
                                        "p-2 rounded-full transition-all hover:bg-white/10",
                                        theme.textColor,
                                    )}
                                    title="Download Certificate">
                                    <FaDownload size={14} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))
            ) : (
                <div
                    className={cn(
                        "p-8 border rounded-lg backdrop-blur-md text-center",
                        theme.borderColorDim,
                        theme.bgGlass,
                    )}>
                    <Award
                        size={32}
                        className={cn(
                            "mx-auto mb-3 opacity-50",
                            theme.textColor,
                        )}
                    />
                    <div
                        className={cn(
                            "text-base font-bold mb-2 uppercase tracking-wide",
                            theme.textColor,
                        )}>
                        No Certificates Yet
                    </div>
                    <div className="text-sm text-slate-500">
                        Certificates will be available here after the event
                        concludes.
                    </div>
                </div>
            )}
        </div>
    );
}
