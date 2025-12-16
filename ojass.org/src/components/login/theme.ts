import { useTheme } from "@/contexts/ThemeContext";
import { useMemo } from "react";

export const useLoginTheme = () => {
    const { theme } = useTheme();

    return useMemo(() => {
        const isUtopia = theme === "utopia";
        return {
            textColor: isUtopia ? "text-cyan-400" : "text-amber-400",
            textColorDim: isUtopia ? "text-cyan-300/70" : "text-amber-300/70",
            textColorSlate: isUtopia ? "text-slate-400" : "text-stone-400", // For subtle text
            borderColor: isUtopia ? "border-cyan-500" : "border-amber-500",
            borderColorDim: isUtopia
                ? "border-cyan-500/30"
                : "border-amber-500/30",
            bgGlass: isUtopia ? "bg-cyan-950/30" : "bg-amber-950/30",
            accentColor: isUtopia ? "text-cyan-500" : "text-amber-500",
            accentBg: isUtopia ? "bg-cyan-500" : "bg-amber-500",
            accentBgDim: isUtopia ? "bg-cyan-500/10" : "bg-amber-500/10",
            accentBorder: isUtopia ? "border-cyan-400" : "border-amber-400",
            accentGlow: isUtopia
                ? "shadow-[0_0_15px_rgba(6,182,212,0.5)]"
                : "shadow-[0_0_15px_rgba(245,158,11,0.5)]",
            textGlow: isUtopia
                ? "drop-shadow-[0_0_5px_rgba(6,182,212,0.8)]"
                : "drop-shadow-[0_0_5px_rgba(245,158,11,0.8)]",
            selection: isUtopia
                ? "selection:bg-cyan-500/30 selection:text-cyan-200"
                : "selection:bg-amber-500/30 selection:text-amber-200",
            buttonPrimary: isUtopia
                ? "bg-cyan-500/20 border-cyan-400 text-cyan-100 hover:bg-cyan-400 hover:text-slate-900 hover:shadow-[0_0_20px_rgba(6,182,212,0.6)]"
                : "bg-amber-500/20 border-amber-400 text-amber-100 hover:bg-amber-400 hover:text-stone-900 hover:shadow-[0_0_20px_rgba(245,158,11,0.6)]",
            buttonOutline: isUtopia
                ? "bg-transparent border-cyan-400/50 text-cyan-400 hover:border-cyan-400 hover:shadow-[0_0_15px_rgba(6,182,212,0.2)]"
                : "bg-transparent border-amber-400/50 text-amber-400 hover:border-amber-400 hover:shadow-[0_0_15px_rgba(245,158,11,0.2)]",
            inputFocus: isUtopia
                ? "focus:border-cyan-400 focus:bg-slate-900/80 focus:shadow-[0_0_15px_rgba(6,182,212,0.2)]"
                : "focus:border-amber-400 focus:bg-stone-900/80 focus:shadow-[0_0_15px_rgba(245,158,11,0.2)]",
            cardActive: isUtopia
                ? "shadow-[0_0_30px_rgba(6,182,212,0.15)] border-cyan-400/60"
                : "shadow-[0_0_30px_rgba(245,158,11,0.15)] border-amber-400/60",
            cornerBorder: isUtopia ? "border-cyan-400" : "border-amber-400",
        };
    }, [theme]);
};
