"use client";

import { ForgotPasswordForm } from "@/components/login/ForgotPasswordForm";
import { LoginForm } from "@/components/login/LoginForm";
import { RegisterForm } from "@/components/login/RegisterForm";
import SpaceTunnel from "@/components/login/SpaceTunnel";
import { useLoginTheme } from "@/components/login/theme";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function LoginPage() {
    const theme = useLoginTheme();

    const [showTunnel, setShowTunnel] = useState(true);
    const [fadeOut, setFadeOut] = useState(false);
    const [showForm, setShowForm] = useState(false);

    const [mode, setMode] = useState<"login" | "register" | "forgot">("login");

    useEffect(() => {
        // Start fading out the tunnel and fading in the background
        const t1 = setTimeout(() => setFadeOut(true), 1000);
        // Remove the tunnel component after the fade transition completes
        const t2 = setTimeout(() => setShowTunnel(false), 2500);
        // Show the form
        const t3 = setTimeout(() => setShowForm(true), 2500);

        return () => {
            clearTimeout(t1);
            clearTimeout(t2);
            clearTimeout(t3);
        };
    }, []);

    return (
        <div
            className={cn(
                "fixed w-full h-full overflow-hidden bg-black text-slate-200 font-sans",
                theme.selection,
            )}>
            {/* Backgrounds */}
            <div
                className={`fixed inset-0 w-full h-full transition-opacity duration-1000 ${fadeOut ? "opacity-100" : "opacity-0"
                    }`}>
                {/* Space */}
                <Image
                    src="/login/space-bg.png"
                    alt="Background"
                    width={1000}
                    height={1000}
                    className="absolute w-full h-full object-cover"
                />

                {/* Spacecraft */}
                <Image
                    src="/login/spacecraft.png"
                    alt="Spacecraft"
                    width={1000}
                    height={1000}
                    className={`absolute w-full h-full object-cover transition-transform duration-2000 pointer-events-none ${fadeOut ? "scale-100" : "scale-10"
                        }`}
                />
            </div>

            {/* Tunnel Overlay */}
            {showTunnel && (
                <div
                    className={`fixed w-full h-full inset-0 z-50 overflow-hidden transition-all duration-1000 ${fadeOut ? "opacity-0 scale-90" : "opacity-100 scale-100"
                        }`}>
                    <SpaceTunnel />
                </div>
            )}

            {/* Main Content */}
            <div
                className={`fixed inset-0 flex items-center justify-center p-4 transition-all duration-1000 z-10 ${showForm ? "opacity-100 scale-100" : "opacity-0 scale-90"
                    }`}>
                <div className="w-full max-w-7xl flex flex-col items-center justify-center relative">
                    <div
                        className={cn(
                            "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] rounded-full blur-[100px] pointer-events-none",
                            theme.bgGlass,
                        )}
                    />

                    {/* Container */}
                    <div className="relative z-20 w-[80%] mb-12">
                        {mode === "login" && (
                            <LoginForm
                                onSwitchToRegister={() => setMode("register")}
                                onSwitchToForgot={() => setMode("forgot")}
                            />
                        )}

                        {mode === "register" && (
                            <RegisterForm
                                onSwitchToLogin={() => setMode("login")}
                            />
                        )}

                        {mode === "forgot" && (
                            <ForgotPasswordForm
                                onSwitchToLogin={() => setMode("login")}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
