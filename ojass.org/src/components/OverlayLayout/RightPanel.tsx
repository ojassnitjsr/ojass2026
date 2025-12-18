import { useTheme } from "@/contexts/ThemeContext";
import { SocialMediaItems } from "@/lib/constants";
import gsap from "gsap";
import { useEffect, useRef, useState } from "react";
import { RiLoginBoxFill, RiUserFill } from "react-icons/ri";
import { CgProfile } from "react-icons/cg";
import Link from "next/link";

export default function RightPanel() {
    const { theme } = useTheme();
    const isDystopia = theme === "dystopia";
    const panelRef = useRef<HTMLDivElement>(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        // Check initial login state
        const checkLoginState = () => {
            const user = localStorage.getItem("user");
            setIsLoggedIn(!!user);
        };

        checkLoginState();

        // Listen for storage changes (works across tabs)
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === "user" || e.key === "token") {
                checkLoginState();
            }
        };

        // Listen for custom storage events (works in same tab)
        const handleCustomStorageChange = () => {
            checkLoginState();
        };

        window.addEventListener("storage", handleStorageChange);
        window.addEventListener("localStorageChange", handleCustomStorageChange);

        if (!panelRef.current) return;

        gsap.fromTo(
            panelRef.current,
            { x: 100, opacity: 0 },
            { x: 0, opacity: 1, duration: 0.8, ease: "power2.out", delay: 0.2 },
        );

        return () => {
            window.removeEventListener("storage", handleStorageChange);
            window.removeEventListener("localStorageChange", handleCustomStorageChange);
        };
    }, []);


    const socialLinks: Record<string, string> = {
        Instagram: "https://www.instagram.com/ojass.nitjsr",
        YouTube: "https://youtube.com/@ojass.nitjsr",
        LinkedIn: "https://www.linkedin.com/company/ojassnitjsr/",
        Facebook: "https://www.facebook.com/share/1CfzSfszvm/",
    };

    return (
        <div
            ref={panelRef}
            className={`layout-panel w-[60px] h-[50vh] fixed bottom-0 right-0 flex flex-col items-center justify-center hud-grid py-10 pt-14 pl-3 z-[100] ${isDystopia ? "is-dystopia" : ""
                }`}
            style={{
                position: "fixed",
                bottom: "0",
                right: "0",
                clipPath:
                    "polygon(30px 0%, 100% 0%, 100% 100%, 0% 100%, 20% 95%, 0% 50px)",
            }}
        >
            <div className="flex flex-col items-center justify-between h-full py-2">

                {isLoggedIn ? (
                    <Link
                        href="/dashboard"
                        className={`layout-text cursor-pointer hover:scale-110 transition-transform ${isDystopia ? "is-dystopia" : ""
                            } text-center`}
                        title="Dashboard"
                    >
                        <CgProfile className="size-6 mx-auto" />
                        <div className="text-[10px]">BOARD</div>
                    </Link>
                ) : (
                    <Link
                        href="/login"
                        className={`layout-text cursor-pointer hover:scale-110 transition-transform ${isDystopia ? "is-dystopia" : ""
                            } text-center`}
                        title="Login "
                    >
                        <RiLoginBoxFill className="size-6 mx-auto" />
                        <div className="text-[10px]">LOGIN</div>
                    </Link>
                )}


                {SocialMediaItems.map((item, idx) => (
                    <a
                        key={idx}
                        href={socialLinks[item.title] || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`layout-text cursor-pointer hover:scale-110 transition-transform ${isDystopia ? "is-dystopia" : ""
                            }`}
                        title={item.title}
                    >
                        <item.element className="size-6" />
                    </a>
                ))}
            </div>
        </div>
    );
}
