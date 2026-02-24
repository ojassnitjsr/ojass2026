"use client";

import Button from "@/components/general/button";
import { useLoginTheme } from "@/components/login/theme";
import { cn } from "@/lib/utils";
import { CreditCard, Mail, Verified } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

interface BoardProps {
    children: React.ReactNode;
    title?: string;
    className?: string;
    isEmailVerified?: boolean;
    isPaid?: boolean;
    pricing?: any;
    onPaymentClick?: () => void;
    onEmailVerificationClick?: () => void;
    onRegisterNow?: () => void;
    onDownloadReceipt?: () => void;
}

export default function Board({
    children,
    title,
    className = "",
    isEmailVerified = false,
    isPaid = false,
    pricing,
    onPaymentClick,
    onEmailVerificationClick,
    onRegisterNow,
    onDownloadReceipt,
}: BoardProps) {
    const theme = useLoginTheme();
    const user = localStorage.getItem("user");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    const handleLogOut = async () => {
        const token = localStorage.getItem("token");
        console.log(token);
        setLoading(true);
        setError("");
        try {
            const res = await fetch("/api/auth/logout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await res.json();
            if (res.ok) {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                // Dispatch custom event to notify other components
                window.dispatchEvent(new Event("localStorageChange"));
                router.push("/login");
            } else {
                setError(data.error || "LogOut failed");
            }
        } catch (err) {
            setError("Network error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className={cn(
                "relative h-[90vh] rounded-2xl overflow-hidden",
                className,
            )}
            style={{
                clipPath:
                    "polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)",
            }}>
            {/* Background & Thin Border */}
            <div
                className={cn(
                    "absolute inset-0 backdrop-blur-xl border-2 transition-colors duration-500",
                    theme.bgGlass,
                    theme.borderColorDim,
                )}
            />

            {/* Content Layer */}
            <div className="relative z-10 p-6">
                <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-4">
                    {title && (
                        <div
                            className={cn(
                                "text-sm font-mono tracking-[0.2em] font-bold",
                                theme.textColor,
                            )}>
                            {title}
                        </div>
                    )}

                    {title === "PROFILE" && user && (
                        <Button
                            content={loading ? "LOGGING OUT..." : "LOGOUT"}
                            onClick={handleLogOut}
                        />
                    )}
                </div>

                {children}

                {/* Email Verification Button (only under PROFILE and if email is NOT verified) */}
                {title === "PROFILE" &&
                    !isEmailVerified &&
                    onEmailVerificationClick && (
                        <button
                            onClick={onEmailVerificationClick}
                            className={cn(
                                "w-full py-4 px-6 rounded relative overflow-hidden group transition-all duration-300 mt-6 cursor-pointer border",
                                theme.buttonPrimary,
                                theme.accentBgDim,
                            )}
                            style={{
                                clipPath:
                                    "polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)",
                            }}>
                            <div className="relative flex items-center justify-center group gap-3">
                                <Mail size={20} className={`${theme.textColor} group-hover:text-black`} />
                                <span
                                    className={cn(
                                        "font-bold text-lg tracking-wide uppercase group-hover:text-black",
                                        theme.textColor,
                                    )}>
                                    Verify Email
                                </span>
                            </div>
                        </button>
                    )}

                {/* Payment Button (only under PROFILE, if email is verified but NOT paid) */}
                {title === "PROFILE" &&
                    isEmailVerified &&
                    !isPaid &&
                    onPaymentClick && (
                        <div className="mt-6 space-y-3">
                            <button 
                                onClick={() => {
                                    onPaymentClick?.();
                                    // Scroll to Pay Now button after tab change
                                    setTimeout(() => {
                                        const payNowButton = document.getElementById("pay-now-button");
                                        if (payNowButton) 
                                            payNowButton.scrollIntoView({
                                                behavior: "smooth",
                                                block: "center",
                                            });
                                    }, 150);
                                }}
                                className={cn(
                                    "w-full py-4 px-6 rounded relative overflow-hidden group transition-all duration-300 cursor-pointer border",
                                    theme.buttonPrimary,
                                )}
                                style={{
                                    clipPath:
                                        "polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)",
                                }}>
                                <div className="relative flex items-center justify-center gap-3">
                                    <CreditCard
                                        size={20}
                                    />
                                    <span
                                        className={cn(
                                            "font-bold text-lg tracking-wide uppercase",
                                        )}>
                                        Register Now
                                    </span>
                                </div>
                            </button>
                        </div>
                    )}

                {/* Download Receipt Button (only under PROFILE, if email is verified AND paid) */}
                {title === "PROFILE" && isEmailVerified && isPaid && (
                    <div
                        className={cn(
                            "w-full py-4 px-6 rounded relative overflow-hidden mt-6 text-center border",
                            "bg-green-500/10 border-green-500/30 text-green-400",
                        )}
                        style={{
                            clipPath:
                                "polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)",
                        }}>
                        <div className="relative flex items-center justify-center gap-3">
                            <Verified size={20} />
                            <span className="font-bold text-lg tracking-wide uppercase">
                                REGISTERED
                            </span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
