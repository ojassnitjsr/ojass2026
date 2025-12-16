"use client";

import { cn } from "@/lib/utils";
import { HTMLMotionProps, motion } from "framer-motion";
import React, {
    ButtonHTMLAttributes,
    InputHTMLAttributes,
    ReactNode,
} from "react";
import { FaChevronDown, FaSpinner } from "react-icons/fa";
import { useLoginTheme } from "./theme";

// ---  Card ---
interface CardProps extends HTMLMotionProps<"div"> {
    children: ReactNode;
    active?: boolean;
}

export const Card = ({
    children,
    className,
    active = false,
    ...props
}: CardProps) => {
    const theme = useLoginTheme();
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={cn(
                "relative p-6 md:p-8 bg-slate-900/60 backdrop-blur-xl border overflow-hidden group",
                theme.borderColorDim,
                active ? theme.cardActive : "",
                className,
            )}
            style={{
                clipPath:
                    "polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)",
            }}
            {...props}>
            {/* Corner Decorations */}
            <div
                className={cn(
                    "absolute top-0 left-0 w-4 h-4 border-l-2 border-t-2",
                    theme.cornerBorder,
                )}
            />
            <div
                className={cn(
                    "absolute bottom-0 right-0 w-4 h-4 border-r-2 border-b-2",
                    theme.cornerBorder,
                )}
            />

            {/* Scanline Effect */}
            <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-0 bg-[length:100%_2px,3px_100%] opacity-20" />

            <div className="relative z-10">{children}</div>
        </motion.div>
    );
};

// ---  Input ---
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    icon?: ReactNode;
    label?: string;
    error?: string;
}

export const Input = ({
    className,
    icon,
    label,
    error,
    ...props
}: InputProps) => {
    const theme = useLoginTheme();
    return (
        <div className="w-full space-y-1">
            {label && (
                <label
                    className={cn(
                        "text-xs uppercase tracking-widest font-semibold ml-1",
                        theme.textColorDim,
                    )}>
                    {label}
                </label>
            )}
            <div className="relative group">
                <div
                    className={cn(
                        "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 clip-path-input",
                        theme.accentBgDim,
                    )}
                    style={{
                        clipPath:
                            "polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)",
                    }}
                />

                <input
                    className={cn(
                        "w-full bg-slate-950/50 border border-slate-700 text-white px-4 py-2 outline-none transition-all duration-300 placeholder:text-slate-600",
                        theme.inputFocus,
                        error
                            ? "border-red-500 focus:border-red-500"
                            : "hover:border-slate-600",
                        icon ? "pl-11" : "",
                        className,
                    )}
                    style={{
                        clipPath:
                            "polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)",
                    }}
                    {...props}
                />
                {icon && (
                    <div
                        className={cn(
                            "absolute left-3 top-1/2 -translate-y-1/2 opacity-70",
                            theme.accentColor,
                        )}>
                        {icon}
                    </div>
                )}
            </div>
            {error && (
                <p className="text-red-400 text-xs ml-1 animate-pulse">
                    {error}
                </p>
            )}
        </div>
    );
};

// ---  Select ---
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
}

export const Select = ({
    className,
    label,
    children,
    ...props
}: SelectProps) => {
    const theme = useLoginTheme();
    return (
        <div className="w-full space-y-1">
            {label && (
                <label
                    className={cn(
                        "text-xs uppercase tracking-widest font-semibold ml-1",
                        theme.textColorDim,
                    )}>
                    {label}
                </label>
            )}
            <div className="relative">
                <select
                    className={cn(
                        "w-full bg-slate-950/50 border border-slate-700 text-white px-4 py-2 outline-none transition-all duration-300 appearance-none cursor-pointer",
                        theme.inputFocus,
                        "hover:border-slate-600",
                        className,
                    )}
                    style={{
                        clipPath:
                            "polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)",
                    }}
                    {...props}>
                    {children}
                </select>
                <div
                    className={cn(
                        "absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none",
                        theme.accentColor,
                    )}>
                    <FaChevronDown />
                </div>
            </div>
        </div>
    );
};

// ---  Button ---
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "outline";
    isLoading?: boolean;
}

export const Button = ({
    children,
    className,
    variant = "primary",
    isLoading,
    ...props
}: ButtonProps) => {
    const theme = useLoginTheme();
    const variants = {
        primary: theme.buttonPrimary,
        secondary:
            "bg-slate-800/50 border-slate-600 text-slate-300 hover:border-slate-400 hover:text-white hover:bg-slate-700/50",
        outline: theme.buttonOutline,
    };

    return (
        <button
            className={cn(
                "relative px-6 py-2 font-bold uppercase tracking-wider text-sm border transition-all duration-300",
                variants[variant],
                isLoading && "opacity-70 cursor-wait",
                className,
            )}
            style={{
                clipPath:
                    "polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)",
            }}
            disabled={isLoading}
            {...props}>
            <div className="flex items-center justify-center gap-2">
                {isLoading && (
                    <span className="animate-spin">
                        <FaSpinner />
                    </span>
                )}
                {children}
            </div>
        </button>
    );
};
