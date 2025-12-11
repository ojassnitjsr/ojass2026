"use client";
import React, { useState, useEffect } from "react";
import { Bell, CheckCircle, AlertTriangle, Star } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

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
  const { theme } = useTheme();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [permissionStatus, setPermissionStatus] = useState<NotificationPermission>("default");

  // Theme-driven styles (same pattern as Certificate.tsx)
  const glow = theme === "utopia" ? "#00ffff" : "#cc7722";
  const borderColor =
    theme === "utopia" ? "border-cyan-400/20" : "border-amber-500/20";
  const gradientFrom =
    theme === "utopia" ? "from-cyan-500/10" : "from-amber-500/10";
  const gradientTo =
    theme === "utopia" ? "to-blue-500/5" : "to-orange-500/5";
  const hoverFrom =
    theme === "utopia" ? "hover:from-cyan-500/20" : "hover:from-amber-500/20";
  const hoverTo =
    theme === "utopia" ? "hover:to-blue-500/10" : "hover:to-orange-500/10";
  const textAccent =
    theme === "utopia" ? "text-cyan-400" : "text-amber-400";
  const textLight =
    theme === "utopia" ? "text-cyan-300" : "text-amber-300";
  const scrollbarThumb =
    theme === "utopia" ? "scrollbar-thumb-cyan-500/40" : "scrollbar-thumb-amber-500/40";

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
    if (typeof window === "undefined" || !("Notification" in window) || !("serviceWorker" in navigator)) {
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
      const registration = await navigator.serviceWorker.register("/sw.js", {
        scope: "/",
      });

      // Wait for service worker to be ready
      await navigator.serviceWorker.ready;

      // Subscribe to push notifications
      const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
      if (!vapidKey) {
        alert("VAPID public key not configured. Please contact support.");
        return;
      }

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidKey) as BufferSource,
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
            p256dh: arrayBufferToBase64(subscription.getKey("p256dh")!),
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
            n.id === id ? { ...n, isRead: true, readAt: new Date() } : n
          )
        );
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  // Helper functions
  function urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
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
    if (lowerTitle.includes("welcome") || lowerTitle.includes("success")) return CheckCircle;
    if (lowerTitle.includes("alert") || lowerTitle.includes("warning")) return AlertTriangle;
    if (lowerTitle.includes("event") || lowerTitle.includes("new")) return Star;
    return Bell;
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className={`${textAccent} text-sm`}>Loading notifications...</div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Permission Request Button */}
      {permissionStatus !== "granted" && (
        <div
          className={`p-4 border ${borderColor} bg-gradient-to-r ${gradientFrom} ${gradientTo} backdrop-blur-sm text-center`}
          style={{
            clipPath: "polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)",
            boxShadow: `0 0 15px ${glow}20`,
          }}
        >
          <Bell className={`${textAccent} mx-auto mb-2`} size={24} />
          <div className={`text-sm font-semibold ${textAccent} mb-2`}>
            Enable Push Notifications
          </div>
          <div className="text-xs text-gray-300 mb-3">
            Get notified about important updates and announcements
          </div>
          <button
            onClick={requestPermissionAndSubscribe}
            className={`px-4 py-2 ${textAccent} border ${borderColor} hover:bg-opacity-20 transition-all text-sm`}
            style={{ clipPath: "polygon(5% 0, 95% 0, 100% 25%, 100% 75%, 95% 100%, 5% 100%, 0 75%, 0 25%)" }}
          >
            Enable Notifications
          </button>
        </div>
      )}

      {/* Notifications List */}
      <div className={`space-y-3 overflow-y-auto ${scrollbarThumb} scrollbar-thin scrollbar-track-transparent`}>
        {notifications.length === 0 ? (
          <div
            className={`p-6 border ${borderColor} bg-gradient-to-r ${gradientFrom} ${gradientTo} backdrop-blur-sm text-center`}
            style={{
              clipPath: "polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)",
              boxShadow: `0 0 15px ${glow}20`,
            }}
          >
            <Bell className={`${textAccent} mx-auto mb-2`} size={24} />
            <div className={`text-sm ${textAccent}`}>No notifications yet</div>
          </div>
        ) : (
          notifications.map((n) => {
            const Icon = getIcon(n.title);
            return (
              <div
                key={n.id}
                onClick={() => !n.isRead && markAsRead(n.id)}
                className={`p-4 border ${borderColor} bg-gradient-to-r ${gradientFrom} ${gradientTo} ${hoverFrom} ${hoverTo} transition-all backdrop-blur-sm cursor-pointer ${
                  !n.isRead ? "opacity-100" : "opacity-70"
                }`}
                style={{
                  clipPath: "polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)",
                  boxShadow: `0 0 15px ${glow}20`,
                }}
              >
                <div className="flex items-start gap-3">
                  <div
                    className="p-[6px] rounded flex-shrink-0"
                    style={{
                      background: `${glow}1A`,
                      boxShadow: `0 0 10px ${glow}55`,
                    }}
                  >
                    <Icon size={16} className={`${textAccent}`} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className={`text-sm font-semibold text-white`}>
                      {n.title}
                      {!n.isRead && (
                        <span className="ml-2 w-2 h-2 bg-blue-500 rounded-full inline-block"></span>
                      )}
                    </div>
                    <div className={`text-xs ${textLight}`}>{n.description}</div>
                    <div className="text-xs text-gray-400 mt-1">
                      {new Date(n.createdAt).toLocaleDateString()}
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
