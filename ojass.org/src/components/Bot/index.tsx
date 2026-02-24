"use client";
import { useTheme } from "@/contexts/ThemeContext";
import Image from "next/image";
import Link from "next/link";

export default function Bot() {
    const { theme } = useTheme();

    const isDystopia = theme === "dystopia";
    return (
        <div className="fixed bottom-0 sm:left-20 left-12 z-[100] cursor-pointer animate-float hover:scale-110 transition-transform duration-300">
            <Link href="/bot">
                <Image
                    src={!isDystopia ? "/robo_eut.png" : "/robo_dys.png"}
                    alt="Bot"
                    width={100}
                    height={100}
                    className="h-20 sm:h-full w-auto"
                />
            </Link>
        </div>
    );
}
