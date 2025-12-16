"use client";

import React, { useState, useEffect } from "react";
import { useLoginTheme } from "@/components/login/theme";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmailVerificationModalProps {
    isOpen: boolean;
    onClose: () => void;
    email: string;
    onVerificationSuccess: () => void;
}

export default function EmailVerificationModal({
    isOpen,
    onClose,
    email,
    onVerificationSuccess,
}: EmailVerificationModalProps) {
    const theme = useLoginTheme();
    const [emailOtp, setEmailOtp] = useState("");
    const [emailOtpSent, setEmailOtpSent] = useState(false);
    const [verifyingEmail, setVerifyingEmail] = useState(false);
    const [sendingOtp, setSendingOtp] = useState(false);
    const [message, setMessage] = useState<{
        type: "success" | "error";
        text: string;
    } | null>(null);

    useEffect(() => {
        if (isOpen && !emailOtpSent) {
            handleSendEmailVerification();
        }
    }, [isOpen]);

    const handleSendEmailVerification = async () => {
        setSendingOtp(true);
        setMessage(null);
        try {
            const res = await fetch("/api/auth/send-email-verification", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();
            if (res.ok) {
                setEmailOtpSent(true);
                setMessage({
                    type: "success",
                    text:
                        data.message ||
                        "Verification email has been sent to your email!",
                });
                if (process.env.NODE_ENV === "development" && data.otp) {
                    console.log("Email OTP:", data.otp);
                }
            } else {
                setMessage({
                    type: "error",
                    text: data.error || "Failed to send verification email",
                });
            }
        } catch (err) {
            setMessage({
                type: "error",
                text: "Network error. Please try again.",
            });
        } finally {
            setSendingOtp(false);
        }
    };

    const handleVerifyEmail = async () => {
        if (!emailOtp || emailOtp.length !== 6) {
            setMessage({
                type: "error",
                text: "Please enter a valid 6-digit OTP",
            });
            return;
        }

        setVerifyingEmail(true);
        setMessage(null);
        try {
            const res = await fetch("/api/auth/verify-email", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, otp: parseInt(emailOtp) }),
            });

            const data = await res.json();
            if (res.ok) {
                setMessage({
                    type: "success",
                    text: "Email verified successfully!",
                });

                // Update user in localStorage
                const user = JSON.parse(localStorage.getItem("user") || "{}");
                const updatedUser = { ...user, isEmailVerified: true };
                localStorage.setItem("user", JSON.stringify(updatedUser));

                // Call success callback
                setTimeout(() => {
                    onVerificationSuccess();
                    onClose();
                }, 1500);
            } else {
                setMessage({
                    type: "error",
                    text: data.error || "Invalid OTP",
                });
            }
        } catch (err) {
            setMessage({
                type: "error",
                text: "Network error. Please try again.",
            });
        } finally {
            setVerifyingEmail(false);
        }
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100]"
                onClick={onClose}
            />

            {/* Modal */}
            <div
                className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-md z-[101]"
                onClick={(e) => e.stopPropagation()}>
                <div
                    className={cn(
                        "relative border rounded-xl bg-black p-8 shadow-2xl",
                        theme.borderColor,
                    )}>
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className={cn(
                            "absolute top-4 right-4 hover:opacity-70 transition-opacity",
                            theme.textColor,
                        )}>
                        <X size={24} />
                    </button>

                    {/* Header */}
                    <div className="mb-6">
                        <h2
                            className={cn(
                                "text-2xl font-black mb-2 tracking-wider",
                                theme.textColor,
                            )}>
                            VERIFY EMAIL
                        </h2>
                        <p className="text-slate-400 text-sm">
                            Enter the 6-digit code sent to{" "}
                            <span
                                className={cn(
                                    "font-semibold",
                                    theme.textColor,
                                )}>
                                {email}
                            </span>
                        </p>
                    </div>

                    {/* Messages */}
                    {message && (
                        <div
                            className={`mb-4 p-3 rounded text-sm border ${
                                message.type === "success"
                                    ? "bg-green-500/10 text-green-300 border-green-500/30"
                                    : "bg-red-500/10 text-red-300 border-red-500/30"
                            }`}>
                            {message.text}
                        </div>
                    )}

                    {/* OTP Input */}
                    {emailOtpSent && (
                        <div className="space-y-4">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={emailOtp}
                                    onChange={(e) =>
                                        setEmailOtp(
                                            e.target.value
                                                .replace(/\D/g, "")
                                                .slice(0, 6),
                                        )
                                    }
                                    placeholder="000000"
                                    maxLength={6}
                                    className={cn(
                                        "w-full bg-white/5 border rounded-lg px-4 py-4 text-white text-center text-2xl tracking-[1em] font-mono focus:outline-none transition-all placeholder:tracking-normal",
                                        theme.borderColorDim,
                                    )}
                                    autoFocus
                                />
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    onClick={handleVerifyEmail}
                                    disabled={
                                        emailOtp.length !== 6 || verifyingEmail
                                    }
                                    className={cn(
                                        "flex-1 py-3 px-6 border rounded font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider text-sm",
                                        theme.buttonPrimary,
                                    )}>
                                    {verifyingEmail ? "VERIFYING..." : "VERIFY"}
                                </button>
                                <button
                                    onClick={handleSendEmailVerification}
                                    disabled={sendingOtp}
                                    className={cn(
                                        "py-3 px-4 border rounded font-bold transition-all disabled:opacity-50 hover:bg-white/5 uppercase tracking-wider text-sm",
                                        theme.borderColorDim,
                                        theme.textColorDim,
                                    )}>
                                    {sendingOtp ? "..." : "RESEND"}
                                </button>
                            </div>
                        </div>
                    )}

                    {!emailOtpSent && (
                        <div className="text-center py-8">
                            <div
                                className={cn(
                                    "animate-spin rounded-full h-8 w-8 border-b-2 mx-auto mb-4",
                                    theme.borderColor,
                                )}></div>
                            <p className="text-slate-400 text-sm">
                                Sending verification email...
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
