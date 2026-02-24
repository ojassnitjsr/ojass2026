"use client";
import React, { useState, useEffect } from "react";
import { Bell, CheckCircle, AlertTriangle, Star } from "lucide-react";
import { useLoginTheme } from "@/components/login/theme";
import { cn } from "@/lib/utils";

interface NotificationItem {
    id: string;
    notificationId: string;
    title: string;
    description: string;
    isRead: boolean;
    readAt?: Date;
    createdAt: Date;
}

export default function Notification() {
    const theme = useLoginTheme();
    const [notifications, setNotifications] = useState<NotificationItem[]>([]);
    const [loading, setLoading] = useState(true);

    // Fetch notifications
    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    setLoading(false);
                    return;
                }

                const res = await fetch("/api/notifications", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (res.ok) {
                    const data = await res.json();
                    if (data.success) {
                        setNotifications(data.data || []);
                    }
                }
            } catch (error) {
                console.error("Error fetching notifications:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchNotifications();
    }, []);

    // Mark notification as read
    const markAsRead = async (id: string) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) return;

            const res = await fetch(`/api/notifications/${id}/read`, {
                method: "PUT",
                headers: { Authorization: `Bearer ${token}` },
            });

            if (res.ok) {
                setNotifications((prev) =>
                    prev.map((n) =>
                        n.id === id
                            ? { ...n, isRead: true, readAt: new Date() }
                            : n,
                    ),
                );
            }
        } catch (error) {
            console.error("Error marking notification as read:", error);
        }
    };

    // Get icon based on notification type (simple heuristic)
    const getIcon = (title: string) => {
        const lowerTitle = title.toLowerCase();
        if (lowerTitle.includes("welcome") || lowerTitle.includes("success"))
            return CheckCircle;
        if (lowerTitle.includes("alert") || lowerTitle.includes("warning"))
            return AlertTriangle;
        if (lowerTitle.includes("event") || lowerTitle.includes("new"))
            return Star;
        return Bell;
    };

    if (loading) {
        return (
            <div className="text-center py-8">
                <div className={cn("text-sm", theme.textColor)}>
                    Loading notifications...
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {/* Notifications List */}
            <div className="space-y-3 overflow-y-auto">
                {notifications.length === 0 ? (
                    <div
                        className={cn(
                            "p-8 border rounded-lg backdrop-blur-md text-center",
                            theme.borderColorDim,
                            theme.bgGlass,
                        )}>
                        <Bell
                            className={cn(
                                "mx-auto mb-3 opacity-50",
                                theme.textColor,
                            )}
                            size={32}
                        />
                        <div
                            className={cn(
                                "text-base font-bold mb-2 uppercase tracking-wide",
                                theme.textColor,
                            )}>
                            No Notifications Yet
                        </div>
                        <div className="text-sm text-slate-500">
                            You&apos;ll receive updates about events,
                            announcements, and important information here.
                        </div>
                    </div>
                ) : (
                    notifications.map((n) => {
                        const Icon = getIcon(n.title);
                        return (
                            <div
                                key={n.id}
                                onClick={() => !n.isRead && markAsRead(n.id)}
                                className={cn(
                                    "p-4 border rounded-lg backdrop-blur-md transition-all cursor-pointer group",
                                    theme.borderColorDim,
                                    theme.bgGlass,
                                    !n.isRead
                                        ? "bg-white/5"
                                        : "opacity-70 hover:opacity-100",
                                )}>
                                <div className="flex items-start gap-3">
                                    <div
                                        className={cn(
                                            "p-2 rounded bg-white/5",
                                            theme.textColor,
                                        )}>
                                        <Icon size={16} />
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div
                                            className={cn(
                                                "text-sm font-bold text-slate-200 mb-1",
                                                theme.textColor,
                                            )}>
                                            {n.title}
                                            {!n.isRead && (
                                                <span className="ml-2 w-1.5 h-1.5 bg-blue-500 rounded-full inline-block align-middle"></span>
                                            )}
                                        </div>
                                        <div className="text-xs text-slate-400 leading-relaxed">
                                            {n.description}
                                        </div>
                                        <div className="text-[10px] text-slate-500 mt-2 font-mono uppercase">
                                            {new Date(
                                                n.createdAt,
                                            ).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
