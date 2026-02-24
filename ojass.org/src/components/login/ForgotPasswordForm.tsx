"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";
import {
    FaCheck,
    FaEnvelope,
    FaExclamationTriangle,
    FaEye,
    FaEyeSlash,
    FaInfoCircle,
    FaKey,
    FaLock,
} from "react-icons/fa";
import { useLoginTheme } from "./theme";
import { Button, Card, Input } from "./UI";

interface ForgotPasswordFormProps {
    onSwitchToLogin: () => void;
}

export const ForgotPasswordForm = ({
    onSwitchToLogin,
}: ForgotPasswordFormProps) => {
    const theme = useLoginTheme();
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [showTooltip, setShowTooltip] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleSendEmail = async () => {
        if (!email.trim()) return;
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/auth/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });
            const data = await res.json();
            if (res.ok) {
                setSuccess("Email Sent. Check your inbox.");
                setTimeout(() => {
                    setSuccess("");
                    setStep(2);
                }, 1500);
            } else setError(data.error || "Failed to send email");
        } catch (err) {
            setError("Failed to send email");
        } finally {
            setLoading(false);
        }
    };

    const handleSetPassword = async () => {
        if (otp.trim().length !== 6) {
            setError("Invalid OTP length.");
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/auth/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email,
                    otp: parseInt(otp),
                    newPassword,
                }),
            });
            const data = await res.json();
            if (res.ok) {
                setSuccess("Password Updated");
                setStep(3);
                setTimeout(() => {
                    onSwitchToLogin();
                }, 2000);
            } else {
                setError(data.error || "Update failed");
            }
        } catch (err) {
            setError("Failed to update password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card active className="w-full max-w-lg mx-auto relative">
            {/* Progress Bar */}
            <div className="absolute top-0 left-0 w-full h-1 bg-slate-800 mb-4">
                <div
                    className={cn(
                        "h-full transition-all duration-500",
                        theme.accentBg,
                    )}
                    style={{ width: `${(step / 3) * 100}%` }}
                />
            </div>

            <div className="text-center mb-4 pt-4">
                <h2
                    className={cn(
                        "text-2xl font-bold tracking-widest",
                        theme.textColor,
                        theme.textGlow,
                    )}>
                    FORGOT PASSWORD
                </h2>
            </div>

            <div className="space-y-6">
                {step === 1 && (
                    <div className="space-y-4 animate-slide-in">
                        <Input
                            label="Registered Email"
                            placeholder="Enter Email Address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            icon={<FaEnvelope />}
                        />
                        <Button
                            onClick={handleSendEmail}
                            isLoading={loading}
                            className="w-full">
                            Send Email
                        </Button>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-4 animate-slide-in">
                        <div className="relative">
                            <Input
                                label="Reset Code (OTP)"
                                placeholder="000000"
                                value={otp}
                                onChange={(e) => {
                                    const val = e.target.value
                                        .replace(/\D/g, "")
                                        .slice(0, 6);
                                    setOtp(val);
                                    setError("");
                                }}
                                icon={<FaKey />}
                                className="text-center tracking-[0.5em]"
                            />

                            <div className="absolute right-3 top-[34px]">
                                <button
                                    type="button"
                                    onClick={() => setShowTooltip(!showTooltip)}
                                    onMouseEnter={() => setShowTooltip(true)}
                                    onMouseLeave={() => setShowTooltip(false)}
                                    className={cn(
                                        "opacity-50 hover:opacity-100 transition-colors cursor-pointer focus:outline-none",
                                        theme.accentColor,
                                    )}>
                                    <FaInfoCircle />
                                </button>

                                <div
                                    className={cn(
                                        `pointer-events-none absolute right-0 top-0 mt-6 w-64 bg-black text-white text-xs rounded-md px-3 py-2 shadow-lg border transition-all duration-200 origin-top-right z-2 ${
                                            showTooltip
                                                ? "opacity-100 scale-100 translate-y-0"
                                                : "opacity-0 scale-95 -translate-y-2"
                                        }`,
                                        theme.borderColorDim,
                                    )}>
                                    Enter the 6-digit code sent to{" "}
                                    <span className={cn(theme.textColor)}>
                                        {email}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="relative">
                            <Input
                                label="New Password"
                                type={showNewPassword ? "text" : "password"}
                                placeholder="New Password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                icon={<FaLock />}
                            />
                            <button
                                type="button"
                                onClick={() =>
                                    setShowNewPassword(!showNewPassword)
                                }
                                className={cn(
                                    "absolute right-3 top-[36.5px] opacity-50 hover:opacity-100 transition-colors",
                                    theme.accentColor,
                                )}>
                                {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>

                        <div className="relative">
                            <Input
                                label="Confirm Password"
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="Confirm Password"
                                value={confirmPassword}
                                onChange={(e) =>
                                    setConfirmPassword(e.target.value)
                                }
                                icon={<FaLock />}
                            />
                            <button
                                type="button"
                                onClick={() =>
                                    setShowConfirmPassword(!showConfirmPassword)
                                }
                                className={cn(
                                    "absolute right-3 top-[36.5px] opacity-50 hover:opacity-100 transition-colors",
                                    theme.accentColor,
                                )}>
                                {showConfirmPassword ? (
                                    <FaEyeSlash />
                                ) : (
                                    <FaEye />
                                )}
                            </button>
                        </div>

                        <Button
                            onClick={handleSetPassword}
                            isLoading={loading}
                            className="w-full">
                            Update Password
                        </Button>
                    </div>
                )}

                {step === 3 && (
                    <div className="flex flex-col items-center space-y-4 animate-slide-in">
                        <div className={cn("text-4xl", theme.textColor)}>
                            <FaCheck />
                        </div>
                        <p className="text-slate-300">
                            Password updated successfully.
                        </p>
                    </div>
                )}

                {error && (
                    <div className="p-2 bg-red-500/10 border border-red-500/50 text-red-400 text-sm font-mono flex justify-center items-center gap-2">
                        <FaExclamationTriangle className="size-3" />
                        <span>ERROR: {error}</span>
                    </div>
                )}

                {success && (
                    <div className="p-2 bg-green-500/10 border border-green-500/50 text-green-400 text-sm font-mono flex justify-center items-center gap-2">
                        <FaCheck className="size-3" />
                        <span>{success}</span>
                    </div>
                )}

                {step !== 3 && (
                    <div className="flex flex-col gap-4 justify-center items-center">
                        <div className="h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent w-full" />
                        <Button
                            type="button"
                            className="text-xs"
                            onClick={onSwitchToLogin}>
                            Back to Login
                        </Button>
                    </div>
                )}
            </div>
        </Card>
    );
};
