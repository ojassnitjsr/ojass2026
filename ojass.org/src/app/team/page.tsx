"use client";

import { useLoginTheme } from "@/components/login/theme";
import TeamCard from "@/components/team/TeamCard";
import WebTeamCard from "@/components/team/WebTeamCard";
import { useTheme } from "@/contexts/ThemeContext";
import { useEffect, useState } from "react";

interface TeamMember {
    id: number;
    name: string;
    imageUrl: string;
    designation: string;
    phone?: string;
    email?: string;
    githubUrl?: string;
    linkedinUrl?: string;
    category?: "Core" | "Web";
}

export default function TeamPage() {
    const { theme: currentTheme } = useTheme();
    const isDystopia = currentTheme === "dystopia";
    const themeStyles = useLoginTheme();
    const [teamData, setTeamData] = useState<TeamMember[]>([]);

    useEffect(() => {
        fetch("/team/team.json")
            .then((res) => res.json())
            .then((data) => setTeamData(data))
            .catch((err) => console.error("Error loading team data:", err));
    }, []);

    const coreTeam = teamData.filter((member) => member.category === "Core");
    const webTeam = teamData.filter((member) => member.category === "Web");

    return (
        <div
            style={{
                position: "relative",
                height: "100vh",
                width: "100vw",
                overflow: "hidden",
            }}>
            {/* Background Image */}
            <div
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    backgroundImage: isDystopia
                        ? 'url("/team_bg_dys.png")'
                        : 'url("/team_bg_eut.png")',
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    zIndex: 1,
                }}
            />

            {/* Glass Screen */}
            <div
                className={`${themeStyles.bgGlass} ${themeStyles.borderColorDim} border-2`}
                style={{
                    position: "absolute",
                    top: "12vh",
                    bottom: "5vh",
                    left: "5vw",
                    right: "5vw",
                    WebkitBackdropFilter: "blur(20px) saturate(180%)",
                    boxShadow: isDystopia
                        ? "0 0 40px rgba(255, 100, 0, 1), inset 0 0 40px rgba(255, 100, 0, 0.4)"
                        : "0 0 40px rgba(0, 255, 255, 1), inset 0 0 40px rgba(0, 255, 255, 0.4)",
                    zIndex: 2,
                    overflow: "hidden",
                    clipPath:
                        "polygon(0 0, 100% 0, 100% 20%, calc(100% - 15px) 24%, calc(100% - 15px) 100%, 0 100%, 0 90%, 15px 87%, 15px 13%, 0 10%)",
                }}>
                {/* Scan Line */}
                <div
                    style={{
                        position: "absolute",
                        top: 0,
                        left: "-100%",
                        width: "100%",
                        height: "100%",
                        background: isDystopia
                            ? "linear-gradient(90deg, transparent 0%, rgba(255, 100, 0, 0.1) 50%, transparent 100%)"
                            : "linear-gradient(90deg, transparent 0%, rgba(0, 255, 255, 0.1) 50%, transparent 100%)",
                        animation: "scan 3s linear infinite",
                        pointerEvents: "none",
                        zIndex: 0,
                    }}
                />

                {/* Scrollable Area */}
                <div
                    className="custom-scrollbar"
                    style={{
                        position: "relative",
                        width: "100%",
                        height: "100%",
                        overflowY: "auto",
                        overflowX: "hidden",
                        zIndex: 10,
                        padding: "1rem 2.5rem",
                    }}>
                    {/* CORE TEAM SECTION */}
                    <div className="mb-16">
                        <h2
                            className={`text-center text-4xl font-bold mb-8 uppercase tracking-widest ${themeStyles.textColor} ${themeStyles.textGlow}`}>
                            Core
                        </h2>
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns:
                                    "repeat(auto-fill, minmax(280px, 1fr))",
                                gap: "2rem",
                                width: "100%",
                                margin: "0 auto",
                            }}>
                            {coreTeam.map((member) => (
                                <div
                                    key={member.id}
                                    style={{
                                        display: "flex",
                                        justifyContent: "center",
                                    }}>
                                    <TeamCard
                                        name={member.name}
                                        role={member.designation}
                                        imageUrl={member.imageUrl}
                                        phone={member.phone || ""}
                                        email={member.email || ""}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* WEB TEAM SECTION */}
                    <div className="mb-8">
                        <h2
                            className={`text-center text-3xl font-bold mb-8 uppercase tracking-widest ${themeStyles.textColor} ${themeStyles.textGlow}`}>
                            Web
                        </h2>
                        <div
                            style={{
                                    display: "grid",
                                gridTemplateColumns:
                                    "repeat(auto-fill, minmax(350px, 1fr))",
                                gap: "2rem",
                                width: "100%",
                                margin: "0 auto",
                            }}>
                            {webTeam.map((member) => (
                                <div
                                    key={member.id}
                                    style={{
                                        display: "flex",
                                        justifyContent: "center",
                                    }}>
                                    <WebTeamCard
                                        name={member.name}
                                        role={member.designation}
                                        imageUrl={member.imageUrl}
                                        linkedinUrl={member.linkedinUrl || "#"}
                                        githubUrl={member.githubUrl || "#"}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes scan {
                    0% {
                        left: -100%;
                    }
                    100% {
                        left: 100%;
                    }
                }
                .custom-scrollbar::-webkit-scrollbar {
                    width: 8px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: ${isDystopia
                        ? "rgba(40, 20, 10, 0.3)"
                        : "rgba(0, 20, 40, 0.3)"};
                    border-radius: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: ${isDystopia
                        ? "rgba(255, 100, 0, 0.5)"
                        : "rgba(0, 255, 255, 0.5)"};
                    border-radius: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: ${isDystopia
                        ? "rgba(255, 100, 0, 0.7)"
                        : "rgba(0, 255, 255, 0.7)"};
                }
            `}</style>
        </div>
    );
}
