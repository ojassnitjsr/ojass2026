"use client";
import { useTheme } from "@/contexts/ThemeContext";
import { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";

export default function NotificationPermissionModal() {
    const { theme } = useTheme();
    const [permissionStatus, setPermissionStatus] =
        useState<NotificationPermission>("default");
    const [showModal, setShowModal] = useState(false);

    // Check notification permission and subscription status
    useEffect(() => {
        if (typeof window !== "undefined" && "Notification" in window) {
            const status = window.Notification.permission;
            setPermissionStatus(status);
            // Show modal automatically if permission not granted
            if (status !== "granted") setShowModal(true);
        }
    }, []);

    // Helper functions
    function urlBase64ToUint8Array(base64String: string): Uint8Array {
        const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
        const base64 = (base64String + padding)
            .replace(/-/g, "+")
            .replace(/_/g, "/");
        const rawData = window.atob(base64);
        const buffer = new ArrayBuffer(rawData.length);
        const outputArray = new Uint8Array(buffer);
        for (let i = 0; i < rawData.length; ++i)
            outputArray[i] = rawData.charCodeAt(i);
        return outputArray;
    }

    function arrayBufferToBase64(buffer: ArrayBuffer): string {
        const bytes = new Uint8Array(buffer);
        let binary = "";
        for (let i = 0; i < bytes.byteLength; i++)
            binary += String.fromCharCode(bytes[i]);
        return window.btoa(binary);
    }

    // Request notification permission and subscribe
    const requestPermissionAndSubscribe = async () => {
        setShowModal(false);

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
                { scope: "/" },
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

            if (res.ok) alert("Notifications enabled successfully!");
            else alert("Failed to enable notifications");
        } catch (error) {
            console.error("Error subscribing to notifications:", error);
            alert("Failed to enable notifications");
        }
    };

    if (!showModal || permissionStatus === "granted") return null;

    const isDystopia = theme === "dystopia";
    const accentColor = isDystopia ? "rgb(255, 100, 0)" : "rgb(0, 255, 255)";
    const accentColorDim = isDystopia
        ? "rgba(255, 100, 0, 0.3)"
        : "rgba(0, 255, 255, 0.3)";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            {/* Modal Container */}
            <div
                className="relative max-w-sm w-full scale-80 md:scale-100"
                style={{ filter: `drop-shadow(0 0 20px ${accentColorDim})` }}>
                {/* Main panel */}
                <div
                    className="relative bg-black/95 border p-6 pb-8"
                    style={{
                        borderColor: accentColor,
                        clipPath:
                            "polygon(33px 0, 100% 0, 100% calc(100% - 33px), calc(100% - 33px) 100%, 0 100%, 0 33px)",
                        boxShadow: `inset 0 0 30px ${accentColorDim}`,
                    }}>
                    {/* Scan line effect */}
                    <div
                        className="absolute inset-0 pointer-events-none opacity-40"
                        style={{
                            backgroundImage:
                                "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)",
                        }}
                    />

                    {/* Close button */}
                    <button
                        onClick={() => setShowModal(false)}
                        className="absolute top-3 right-6 transition-all hover:scale-110"
                        style={{ color: accentColor }}>
                        <FaTimes size={16} />
                    </button>

                    {/* Header label */}
                    <div
                        className="absolute -top-px left-8 px-3 py-1 text-[10px] font-mono uppercase tracking-[0.2em]"
                        style={{
                            backgroundColor: accentColor,
                            color: "black",
                            clipPath:
                                "polygon(0 0, 100% 0, calc(100% - 6px) 100%, 6px 100%)",
                        }}>
                        System Alert
                    </div>

                    {/* Title */}
                    <h3
                        className="text-lg font-bold text-center mt-4 mb-2 tracking-wide uppercase"
                        style={{
                            color: accentColor,
                            textShadow: `0 0 10px ${accentColorDim}`,
                        }}>
                        Enable Notifications
                    </h3>

                    {/* Divider line */}
                    <div
                        className="w-24 h-px mx-auto mb-4"
                        style={{
                            background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)`,
                        }}
                    />

                    {/* Description */}
                    <p className="text-sm text-slate-400 text-center mb-6 font-light leading-relaxed">
                        Enable push notifications to receive instant updates
                        about events, announcements, and critical information.
                    </p>

                    {/* Buttons */}
                    <div className="flex gap-3">
                        <button
                            onClick={() => setShowModal(false)}
                            className="flex-1 py-2.5 px-4 text-sm font-medium uppercase tracking-wider transition-all hover:bg-white/5"
                            style={{
                                border: `1px solid ${accentColorDim}`,
                                color: "rgb(180, 180, 180)",
                                clipPath:
                                    "polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)",
                            }}>
                            Decline
                        </button>
                        <button
                            onClick={requestPermissionAndSubscribe}
                            className="flex-1 py-2.5 px-4 text-sm font-bold uppercase tracking-wider transition-all hover:brightness-110"
                            style={{
                                background: `linear-gradient(135deg, ${accentColor} 0%, ${isDystopia ? "rgb(200, 80, 0)" : "rgb(0, 200, 200)"} 100%)`,
                                color: "black",
                                clipPath:
                                    "polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)",
                                boxShadow: `0 0 15px ${accentColorDim}`,
                            }}>
                            Enable
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
