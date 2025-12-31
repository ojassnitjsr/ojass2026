"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import Loader from "@/components/Loader";

// Dynamically import components to avoid heavy loading on wrong devices
const HomePC = dynamic(() => import("@/components/Home/HomePC"), {
    loading: () => <Loader />,
});
const HomePhone = dynamic(() => import("@/components/Home/HomePhone"), {
    loading: () => <Loader />,
});

export default function Home() {
    const [isMobile, setIsMobile] = useState<boolean | null>(null);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    if (isMobile === null) {
        return <Loader />;
    }

    return isMobile ? <HomePhone /> : <HomePC />;
}
