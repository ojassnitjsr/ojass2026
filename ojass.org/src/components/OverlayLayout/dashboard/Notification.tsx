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
    const [permissionStatus, setPermissionStatus] =
        useState<NotificationPermission>("default");

    // Check notification permission and subscription status
    useEffect(() => {
        if (typeof window !== "undefined" && "Notification" in window) {
            setPermissionStatus(window.Notification.permission);
        }
    }, []);

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

    // Request notification permission and subscribe
    const requestPermissionAndSubscribe = async () => {
        if (
            typeof window === "undefined" ||
            !("Notification" in window) ||
            !("serviceWorker" in navigator)
        ) {
            alert("Your browser doesn't support push notifications");
            return;
        }

        try {
            // Request permission
            const permission = await window.Notification.requestPermission();
            setPermissionStatus(permission);

            if (permission !== "granted") {
                alert("Notification permission denied");
                return;
            }

            // Register service worker
            const registration = await navigator.serviceWorker.register(
                "/sw.js",
                {
                    scope: "/",
                },
            );

            // Wait for service worker to be ready
            await navigator.serviceWorker.ready;

            // Subscribe to push notifications
            const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
            if (!vapidKey) {
                alert(
                    "VAPID public key not configured. Please contact support.",
                );
                return;
            }

            const subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(
                    vapidKey,
                ) as BufferSource,
            });

            // Save subscription to backend
            const token = localStorage.getItem("token");
            if (!token) {
                alert("Please login to enable notifications");
                return;
            }

            const res = await fetch("/api/notifications/subscribe", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    endpoint: subscription.endpoint,
                    keys: {
                        p256dh: arrayBufferToBase64(
                            subscription.getKey("p256dh")!,
                        ),
                        auth: arrayBufferToBase64(subscription.getKey("auth")!),
                    },
                }),
            });

            if (res.ok) {
                alert("Notifications enabled successfully!");
            } else {
                alert("Failed to enable notifications");
            }
        } catch (error) {
            console.error("Error subscribing to notifications:", error);
            alert("Failed to enable notifications");
        }
    };

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

    // Helper functions
    function urlBase64ToUint8Array(base64String: string): Uint8Array {
        const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
        const base64 = (base64String + padding)
            .replace(/-/g, "+")
            .replace(/_/g, "/");
        const rawData = window.atob(base64);
        const buffer = new ArrayBuffer(rawData.length);
        const outputArray = new Uint8Array(buffer);
        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    }

    function arrayBufferToBase64(buffer: ArrayBuffer): string {
        const bytes = new Uint8Array(buffer);
        let binary = "";
        for (let i = 0; i < bytes.byteLength; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return window.btoa(binary);
    }

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
            {/* Permission Request Button */}
            {permissionStatus !== "granted" && (
                <div
                    className={cn(
                        "p-4 border rounded-lg backdrop-blur-md text-center",
                        theme.borderColorDim,
                        theme.bgGlass,
                    )}>
                    <Bell
                        className={cn(
                            "mx-auto mb-2 opacity-80",
                            theme.textColor,
                        )}
                        size={24}
                    />
                    <div
                        className={cn(
                            "text-sm font-bold mb-2 uppercase tracking-wide",
                            theme.textColor,
                        )}>
                        Enable Push Notifications
                    </div>
                    <div className="text-xs text-slate-400 mb-4">
                        Get notified about important updates and announcements
                    </div>
                    <button
                        onClick={requestPermissionAndSubscribe}
                        className={cn(
                            "px-6 py-2 border rounded font-bold uppercase tracking-wider text-xs transition-all",
                            theme.buttonOutline,
                        )}>
                        Enable Notifications
                    </button>
                </div>
            )}

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
                            size={24}
                        />
                        <div
                            className={cn(
                                "text-sm font-medium opacity-70",
                                theme.textColor,
                            )}>
                            No notifications yet
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
