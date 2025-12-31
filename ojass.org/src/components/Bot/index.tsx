"use client";
import { useTheme } from "@/contexts/ThemeContext";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export default function Bot() {
    const { theme } = useTheme();

    const isDystopia = theme === "dystopia";
    return (
        <motion.div
            className="fixed bottom-0 sm:left-20 left-12 z-[100] cursor-pointer"
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            whileHover={{ scale: 1.1 }}>
            <Link href="/bot">
                <Image
                    src={!isDystopia ? "/robo_eut.png" : "/robo_dys.png"}
                    alt="Bot"
                    width={100}
                    height={100}
                    className="h-20 sm:h-full w-auto"
                />
            </Link>
        </motion.div>
    );
}
