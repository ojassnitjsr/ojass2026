"use client";

import React, { useState, useEffect } from "react";
import { useLoginTheme } from "@/components/login/theme";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { REGISTRATION_TIER_CONFIG, RegistrationTier } from "@/lib/constants";
import { FaChevronDown } from "react-icons/fa";

declare global {
    interface Window {
        Razorpay: any;
    }
}

export default function Receipt({ userData, pricing }: { userData?: any, pricing: any }) {
    const theme = useLoginTheme();
    const router = useRouter();
    const [paymentData, setPaymentData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [paymentLoading, setPaymentLoading] = useState(false);
    const [showPerks, setShowPerks] = useState(false);
    const [message, setMessage] = useState<{
        type: "success" | "error";
        text: string;
    } | null>(null);

    useEffect(() => {
        const fetchPaymentStatus = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await fetch("/api/payment/status", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await res.json();
                if (res.ok) {
                    setPaymentData(data);
                }
            } catch (err) {
                console.error("Error fetching payment status:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchPaymentStatus();
    }, []);

    const handlePayNow = async () => {
        setPaymentLoading(true);
        setMessage(null);
        try {
            const token = localStorage.getItem("token");

            // Create Razorpay order
            const orderRes = await fetch("/api/payment/create-order", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            const orderData = await orderRes.json();

            if (!orderRes.ok) {
                const errorText = orderData.details
                    ? `${orderData.error}: ${orderData.details}`
                    : orderData.error || "Failed to create order";
                setMessage({ type: "error", text: errorText });
                setPaymentLoading(false);
                return;
            }

            // Load Razorpay script if not loaded
            if (!window.Razorpay) {
                const script = document.createElement("script");
                script.src = "https://checkout.razorpay.com/v1/checkout.js";
                script.onload = () => initRazorpay(orderData);
                script.onerror = () => {
                    setMessage({
                        type: "error",
                        text: "Failed to load Razorpay",
                    });
                    setPaymentLoading(false);
                };
                document.body.appendChild(script);
            } else {
                initRazorpay(orderData);
            }
        } catch (err) {
            setMessage({
                type: "error",
                text: "Network error. Please try again.",
            });
            setPaymentLoading(false);
        }
    };

    const initRazorpay = (orderData: any) => {
        const options = {
            key: orderData.razorpayKeyId,
            amount: orderData.order.amount,
            currency: orderData.order.currency,
            order_id: orderData.order.id,
            name: "OJASS 2026",
            description: "Registration Fee",
            prefill: {
                email: userData?.email || "",
                contact: userData?.phone || "",
            },
            handler: async (response: any) => {
                try {
                    const token = localStorage.getItem("token");
                    const verifyRes = await fetch("/api/payment/verify", {
                        method: "POST",
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                        }),
                    });

                    const verifyData = await verifyRes.json();

                    if (verifyRes.ok && verifyData.success) {
                        setMessage({
                            type: "success",
                            text: "Payment successful!",
                        });

                        // Update user in localStorage
                        const user = JSON.parse(
                            localStorage.getItem("user") || "{}",
                        );
                        const updatedUser = { ...user, isPaid: true };
                        localStorage.setItem(
                            "user",
                            JSON.stringify(updatedUser),
                        );

                        // Refresh payment status
                        setTimeout(() => window.location.reload(), 1500);
                    } else {
                        setMessage({
                            type: "error",
                            text:
                                verifyData.error ||
                                "Payment verification failed",
                        });
                    }
                } catch (err) {
                    setMessage({
                        type: "error",
                        text: "Payment verification error",
                    });
                } finally {
                    setPaymentLoading(false);
                }
            },
            modal: {
                ondismiss: () => {
                    setPaymentLoading(false);
                },
            },
        };

        const razorpay = new window.Razorpay(options);
        razorpay.open();
    };

    const handleDownloadReceipt = () => {
        if (!paymentData || !userData) return;
        router.push("/receipt");
    };

    if (loading) {
        return (
            <div className={cn("text-center p-8", theme.textColor)}>
                Loading payment details...
            </div>
        );
    }

    const isEmailVerified =
        userData?.isEmailVerified || paymentData?.isEmailVerified || false;
    const isPaid = paymentData?.isPaid || false;

    // If email not verified, show message
    if (!isEmailVerified) {
        return (
            <div className="space-y-3">
                <div
                    className={cn(
                        "p-6 border backdrop-blur-md rounded-lg",
                        theme.borderColorDim,
                        theme.bgGlass,
                    )}>
                    <div
                        className={cn(
                            "text-sm font-bold mb-3 uppercase tracking-wider",
                            theme.textColor,
                        )}>
                        EMAIL VERIFICATION REQUIRED
                    </div>
                    <div className="text-slate-400 text-sm">
                        <p>
                            Please verify your email address in the Profile
                            section to proceed with payment.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    // If email verified but not paid, show payment option
    if (!isPaid) {
        return (
            <div className="space-y-3">
                <div
                    className={cn(
                        "p-6 border backdrop-blur-md rounded-lg",
                        theme.borderColorDim,
                        theme.bgGlass,
                    )}>
                    <div
                        className={cn(
                            "text-sm font-bold mb-3 uppercase tracking-wider",
                            theme.textColor,
                        )}>
                        PAYMENT STATUS
                    </div>
                    <div className="text-slate-400 text-sm mb-6 space-y-2">
                        <p>Registration payment is pending.</p>
                        <p className="text-green-400 text-xs">
                            Email verified ✓
                        </p>
                        <p className="text-xs opacity-70">
                            Please complete your payment to access all features.
                        </p>
                    </div>
                    {pricing && (
                        <div
                            className={cn(
                                "text-center mb-4 p-4 rounded bg-white/5 border border-white/10",
                                theme.textColor,
                            )}>
                            <p className="text-sm opacity-70 uppercase tracking-widest">
                                Registration Fee
                            </p>
                            <p className="text-3xl font-bold mt-1">
                                ₹{pricing.amount}
                            </p>
                            {pricing.offerActive && (
                                <p className="text-xs text-green-400 mt-2 font-mono">
                                    Special Offer Active
                                </p>
                            )}
                            <p className={cn("text-xs mt-2 opacity-60 font-medium", theme.accentColor)}> One-time fee • No hidden charges </p>
                        </div>
                    )}

                    <button
                        onClick={() => setShowPerks(!showPerks)}
                        className={cn(
                            "w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg border text-xs font-medium transition-all duration-200 mb-4",
                            theme.borderColorDim,
                            "hover:bg-white/5",
                            theme.textColor,
                        )}>
                        <span>{showPerks ? "Hide Perks" : "View Perks"}</span>
                        <FaChevronDown/>
                    </button>

                    {/* Perks Section */}
                    <div
                        className={cn(
                            "overflow-hidden transition-all duration-300 ease-in-out",
                            showPerks
                                ? "max-h-96 opacity-100 mb-6"
                                : "max-h-0 opacity-0",
                        )}>
                        <RegistrationBenefits
                            tier={!pricing.isNitJsrStudent ? "NIT_JSR" : "OTHER_COLLEGE"} 
                            theme={theme}
                        />
                    </div>

                    {message && (
                        <div
                            className={`mb-4 p-3 text-xs rounded border ${message.type === "success"
                                ? "bg-green-500/10 text-green-300 border-green-500/30"
                                : "bg-red-500/10 text-red-300 border-red-500/30"
                                }`}>
                            {message.text}
                        </div>
                    )}
                    <button
                        onClick={handlePayNow}
                        disabled={paymentLoading}
                        className={cn(
                            "w-full py-3 px-6 border rounded font-bold tracking-wide uppercase text-sm",
                            theme.buttonPrimary,
                        )}>
                        {paymentLoading ? "PROCESSING..." : "PAY NOW"}
                    </button>
                </div>
            </div>
        );
    }

    const paymentDate = paymentData.paymentDate
        ? new Date(paymentData.paymentDate).toLocaleDateString("en-IN", {
            year: "numeric",
            month: "long",
            day: "numeric",
        })
        : "N/A";

    const paymentTime = paymentData.paymentDate
        ? new Date(paymentData.paymentDate).toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
        })
        : "N/A";

    return (
        <div className="flex flex-col h-full overflow-hidden content-center px-1">
            <div className="overflow-y-auto space-y-4 pr-1">
                {/* 🎫 Receipt Header */}
                <div
                    className={cn(
                        "p-6 border rounded-lg backdrop-blur-md text-center",
                        theme.borderColorDim,
                        theme.bgGlass,
                    )}>
                    <div
                        className={cn(
                            "text-2xl font-black mb-2 tracking-widest",
                            theme.textColor,
                        )}>
                        OJASS 2026
                    </div>
                    <div
                        className={cn(
                            "text-sm uppercase tracking-wide opacity-80 mb-1",
                            theme.textColor,
                        )}>
                        Payment Receipt
                    </div>
                    <div className="text-xs text-slate-500 font-mono">
                        National Institute of Technology, Jamshedpur
                    </div>
                </div>

                {/* 💳 Receipt Details Section */}
                <div
                    className={cn(
                        "p-6 border rounded-lg backdrop-blur-md",
                        theme.borderColorDim,
                        theme.bgGlass,
                    )}>
                    <div
                        className={cn(
                            "text-xs font-bold mb-4 uppercase tracking-widest opacity-70",
                            theme.textColor,
                        )}>
                        Receipt Details
                    </div>
                    <div className="space-y-3 text-sm">
                        <div className="flex justify-between items-center py-2 border-b border-white/5">
                            <span className="text-slate-400 font-medium">
                                Receipt ID
                            </span>
                            <span className="text-slate-300 font-mono text-xs">
                                {paymentData.orderId || "N/A"}
                            </span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-white/5">
                            <span className="text-slate-400 font-medium">
                                Payment ID
                            </span>
                            <span className="text-slate-300 font-mono text-xs break-all text-right">
                                {paymentData.razorpayPaymentId || "N/A"}
                            </span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-white/5">
                            <span className="text-slate-400 font-medium">
                                Date
                            </span>
                            <span className="text-slate-300">
                                {paymentDate}
                            </span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-white/5">
                            <span className="text-slate-400 font-medium">
                                Time
                            </span>
                            <span className="text-slate-300">
                                {paymentTime}
                            </span>
                        </div>
                        <div className="flex justify-between items-center py-2">
                            <span className="text-slate-400 font-medium">
                                Status
                            </span>
                            <span className="text-green-400 font-bold flex items-center gap-1 text-xs uppercase tracking-wide">
                                <span>✓</span> Paid
                            </span>
                        </div>
                    </div>
                </div>

                {/* 👤 User Information Section */}
                <div
                    className={cn(
                        "p-6 border rounded-lg backdrop-blur-md",
                        theme.borderColorDim,
                        theme.bgGlass,
                    )}>
                    <div
                        className={cn(
                            "text-xs font-bold mb-4 uppercase tracking-widest opacity-70",
                            theme.textColor,
                        )}>
                        User Information
                    </div>
                    <div className="space-y-3 text-sm">
                        <div className="flex justify-between items-center py-2 border-b border-white/5">
                            <span className="text-slate-400 font-medium">
                                Name
                            </span>
                            <span className="text-slate-300 text-right">
                                {userData?.name || "N/A"}
                            </span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-white/5">
                            <span className="text-slate-400 font-medium">
                                OJASS ID
                            </span>
                            <span className="text-slate-300 font-mono">
                                {userData?.ojassId || "N/A"}
                            </span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-white/5">
                            <span className="text-slate-400 font-medium">
                                Email
                            </span>
                            <span className="text-slate-300 text-right text-xs break-all">
                                {userData?.email || "N/A"}
                            </span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-opacity-20">
                            <span className="text-slate-400 font-medium">
                                Phone
                            </span>
                            <span className="text-slate-300">
                                {userData?.phone || "N/A"}
                            </span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-white/5">
                            <span className="text-slate-400 font-medium">
                                College
                            </span>
                            <span className="text-slate-300 text-right text-xs">
                                {userData?.email?.toLowerCase().endsWith('@nitjsr.ac.in')
                                    ? 'NIT Jamshedpur'
                                    : userData?.college || userData?.collegeName || "N/A"}
                            </span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-white/5">
                            <span className="text-slate-400 font-medium">
                                Registration Type
                            </span>
                            <span className={cn("text-right text-xs font-semibold", theme.accentColor)}>
                                {userData?.email?.toLowerCase().endsWith('@nitjsr.ac.in')
                                    ? 'NIT JSR'
                                    : userData?.college || userData?.collegeName || 'Other College'}
                            </span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-t border-white/10 pt-3">
                            <span className="text-slate-400 font-medium">
                                Registration Phase
                            </span>
                            <span className={cn("text-right text-xs font-bold uppercase tracking-wide", theme.accentColor)}>
                                {paymentData?.registrationPhase || pricing?.phaseName || 'Early Bird Offer'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* 💰 Payment Summary Section */}
                <div
                    className={cn(
                        "p-6 border rounded-lg backdrop-blur-md",
                        theme.borderColorDim,
                        theme.bgGlass,
                    )}>
                    <div
                        className={cn(
                            "text-xs font-bold mb-4 uppercase tracking-widest opacity-70",
                            theme.textColor,
                        )}>
                        Payment Summary
                    </div>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-slate-400 font-medium text-base">
                                Amount Paid
                            </span>
                            <span
                                className={cn(
                                    "font-bold text-3xl",
                                    theme.textColor,
                                )}>
                                ₹
                                {paymentData.paymentAmount?.toFixed(2) ||
                                    "0.00"}
                            </span>
                        </div>
                        <div className="flex items-center justify-end gap-2 mt-2">
                            <div className="w-5 h-5 rounded-full flex items-center justify-center bg-green-500/20 border border-green-500/50">
                                <span className="text-green-400 text-[10px] font-bold">
                                    ✓
                                </span>
                            </div>
                            <span className="text-green-400 text-xs font-bold uppercase tracking-wide">
                                Payment Confirmed
                            </span>
                        </div>
                    </div>
                </div>

                {/* 📄 Footer Note */}
                <div
                    className={cn(
                        "p-4 border rounded-lg backdrop-blur-md text-center",
                        theme.borderColorDim,
                        theme.bgGlass,
                    )}>
                    <p className="text-[10px] text-slate-500 italic mb-2">
                        This is a system generated receipt.
                    </p>
                    <p className={cn("text-xs opacity-70", theme.textColor)}>
                        Thank you for your registration!
                    </p>
                </div>
            </div>
            {/* Download Receipt Button */}
            <div className="mt-6 text-center pb-2">
                <button
                    onClick={handleDownloadReceipt}
                    className={cn(
                        "relative border px-8 py-3 font-bold text-sm transition-all overflow-hidden group rounded w-full tracking-widest uppercase",
                        theme.buttonPrimary,
                    )}>
                    DOWNLOAD RECEIPT (PDF)
                </button>
            </div>
        </div>
    );
}

interface RegistrationBenefitsProps {
    tier: RegistrationTier;
    theme: {
        borderColorDim: string;
        textColor: string;
    };
}

const RegistrationBenefits = ({ tier, theme }: RegistrationBenefitsProps) => {
    const perks = REGISTRATION_TIER_CONFIG[tier];

    return (
        <div
            className={cn(
                "p-4 rounded-lg border transition-all duration-300",
                theme.borderColorDim,
                `bg-gradient-to-br from-purple-500/10 to-transparent`,
            )}>
            <ul className="space-y-2 text-xs text-slate-300">
                {perks.map((perk, index) => (
                    <li key={index} className="flex items-center gap-2">
                        <span className="mt-0.5 text-purple-400">✓</span>
                        <span>
                            {perk.prefix}
                            {perk.bold && (
                                <strong className="text-white">
                                    {perk.bold}
                                </strong>
                            )}
                            {perk.suffix}
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    );
};
