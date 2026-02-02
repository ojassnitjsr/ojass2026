"use client";

import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import {
    FaExclamationTriangle,
    FaEye,
    FaEyeSlash,
    FaLock,
    FaUser,
} from "react-icons/fa";
import { useLoginTheme } from "./theme";
import { Button, Card, Input } from "./UI";

interface LoginFormProps {
    onSwitchToRegister: () => void;
    onSwitchToForgot: () => void;
}

export const LoginForm = ({
    onSwitchToRegister,
    onSwitchToForgot,
}: LoginFormProps) => {
    const router = useRouter();
    const theme = useLoginTheme();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [hasPendingTeamJoin, setHasPendingTeamJoin] = useState(false);

    useEffect(() => {
        if (localStorage.getItem("pendingTeamJoin"))
            setHasPendingTeamJoin(true);
    }, []);

    const handleLogin = async (e: FormEvent) => {
        e.preventDefault();

        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: username.includes("@") ? username : undefined,
                    phone: !username.includes("@") ? username : undefined,
                    password,
                }),
            });

            const data = await res.json();

            if (res.ok) {
                localStorage.setItem("token", data.token);
                localStorage.setItem("user", JSON.stringify(data.user));

                const pendingTeamJoin = localStorage.getItem("pendingTeamJoin");
                if (pendingTeamJoin) {
                    localStorage.removeItem("pendingTeamJoin");
                    router.push(`/teams/join/${pendingTeamJoin}`);
                } else router.push("/dashboard");
            } else setError(data.error || "Login failed");
        } catch {
            setError("Network error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card active className="w-full max-w-md mx-auto">
            <div className="text-center mb-8">
                <h2
                    className={cn(
                        "text-2xl font-bold tracking-widest",
                        theme.textColor,
                        theme.textGlow,
                    )}>
                    PARTICIPANT ACCESS
                </h2>
                <p className="text-slate-400 text-xs mt-2 uppercase tracking-wide">
                    Enter credentials to proceed
                </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
                {hasPendingTeamJoin && (
                    <div
                        className={cn(
                            "p-3 border text-sm flex items-center gap-2 animate-pulse",
                            theme.accentBgDim,
                            theme.borderColor,
                            theme.accentColor,
                        )}>
                        <FaExclamationTriangle />
                        <span>
                            You have a pending team invitation. Please login to
                            join.
                        </span>
                    </div>
                )}

                <Input
                    label="Email"
                    placeholder="Email or Phone"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    icon={<FaUser />}
                />

                <div className="relative">
                    <Input
                        label="Password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        icon={<FaLock />}
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className={cn(
                            "absolute right-3 top-[36.5px] opacity-50 hover:opacity-100 transition-colors",
                            theme.accentColor,
                        )}>
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                </div>

                {error && (
                    <div className="p-2 bg-red-500/10 border border-red-500/50 text-red-400 text-sm font-mono flex justify-center items-center gap-2">
                        <FaExclamationTriangle className="size-3" />
                        <span>ERROR: {error}</span>
                    </div>
                )}

                <Button
                    type="submit"
                    isLoading={loading}
                    className="w-full text-lg">
                    Login
                </Button>

                <div className="flex flex-col gap-4">
                    <div className="h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent w-full" />
                    <div className="flex justify-between items-center">
                        <Button
                            type="button"
                            className="text-xs"
                            onClick={onSwitchToRegister}>
                            Register Now
                        </Button>
                        <Button
                            type="button"
                            className="text-xs"
                            onClick={onSwitchToForgot}>
                            Reset Password
                        </Button>
                    </div>
                </div>
            </form>
        </Card>
    );
};
