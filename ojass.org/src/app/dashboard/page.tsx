"use client";
import Loader from "@/components/Loader";
import { useLoginTheme } from "@/components/login/theme";
import Board from "@/components/OverlayLayout/dashboard/Board";
import Certificate from "@/components/OverlayLayout/dashboard/Certificate";
import EmailVerificationModal from "@/components/OverlayLayout/dashboard/EmailVerificationModal";
import Notification from "@/components/OverlayLayout/dashboard/Notification";
import Profile from "@/components/OverlayLayout/dashboard/Profile";
import Receipt from "@/components/OverlayLayout/dashboard/Reciept";
import RegisteredEvent from "@/components/OverlayLayout/dashboard/RegisteredEvent";
import Team from "@/components/OverlayLayout/dashboard/Team";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";

export default function OjassDashboard() {
    const router = useRouter();
    const theme = useLoginTheme();
    const [activeTab, setActiveTab] = useState("receipt");
    const [profileData, setProfileData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [showEmailVerificationModal, setShowEmailVerificationModal] =
        useState(false);
    const [paymentData, setPaymentData] = useState<any>(null);
    const [pricing, setPricing] = useState<any>(null);
    const [userTeams, setUserTeams] = useState<any[]>([]);
    const [registeredEvents, setRegisteredEvents] = useState<any[]>([]);
    const [loadingTeams, setLoadingTeams] = useState(false);
    const currentUserId = profileData?._id || "u1";

    useEffect(() => {
        const fetchUserData = async () => {
            const user = localStorage.getItem("user");
            if (!user) {
                router.push("/login");
                return;
            }

            try {
                const userData = JSON.parse(user);
                const userProfile = {
                    name: userData.name,
                    email: userData.email,
                    college: userData.collegeName,
                    phone: userData.phone,
                    ojassId: userData.ojassId,
                    gender: userData.gender,
                    city: userData.city,
                    state: userData.state,
                    isPaid: userData.isPaid,
                    isEmailVerified: userData.isEmailVerified,
                    referralCount: userData.referralCount || 0,
                    idCardImageUrl: userData.idCardImageUrl || null,
                    idCardCloudinaryId: userData.idCardCloudinaryId || null,
                    _id: userData._id,
                };
                setProfileData(userProfile);

                // Fetch payment status and pricing
                const token = localStorage.getItem("token");
                if (token) {
                    // Fetch payment status
                    const paymentRes = await fetch("/api/payment/status", {
                        headers: { Authorization: `Bearer ${token}` },
                    });

                    if (paymentRes.ok) {
                        const payment = await paymentRes.json();
                        setPaymentData(payment);
                        // Update profile data with latest payment status
                        userProfile.isPaid = payment.isPaid;
                        userProfile.isEmailVerified = payment.isEmailVerified;
                        setProfileData({ ...userProfile });
                    }

                    // Fetch pricing
                    const pricingRes = await fetch("/api/pricing", {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    if (pricingRes.ok) {
                        const pricingData = await pricingRes.json();
                        setPricing(pricingData);
                    }

                    // Fetch user teams
                    setLoadingTeams(true);
                    try {
                        const teamsRes = await fetch("/api/teams", {
                            headers: { Authorization: `Bearer ${token}` },
                        });
                        if (teamsRes.ok) {
                            const teams = await teamsRes.json();
                            // Filter out individual teams (only show actual teams, not individual registrations)
                            const actualTeams = teams.filter(
                                (team: any) => !team.isIndividual,
                            );
                            // Transform teams to match Team component format
                            const transformedTeams = actualTeams.map(
                                (team: any) => ({
                                    _id: team._id,
                                    eventId: team.eventId?._id || team.eventId,
                                    eventName:
                                        team.eventId?.name || "Unknown Event",
                                    isIndividual: team.isIndividual,
                                    teamName: team.teamName || "Individual",
                                    teamLeader:
                                        typeof team.teamLeader === "object"
                                            ? {
                                                _id: team.teamLeader._id,
                                                name:
                                                    team.teamLeader.name ||
                                                    "Unknown",
                                                ojassId:
                                                    team.teamLeader.ojassId,
                                            }
                                            : team.teamLeader,
                                    teamMembers: team.teamMembers
                                        .filter((member: any) => {
                                            // Filter out leader from members list
                                            const memberId =
                                                typeof member === "object"
                                                    ? member._id
                                                    : member;
                                            const leaderId =
                                                typeof team.teamLeader ===
                                                    "object"
                                                    ? team.teamLeader._id
                                                    : team.teamLeader;
                                            return (
                                                memberId.toString() !==
                                                leaderId.toString()
                                            );
                                        })
                                        .map((member: any) => ({
                                            _id:
                                                typeof member === "object"
                                                    ? member._id
                                                    : member,
                                            name:
                                                typeof member === "object"
                                                    ? member.name
                                                    : "Unknown",
                                            ojassId:
                                                typeof member === "object"
                                                    ? member.ojassId
                                                    : undefined,
                                        })),
                                    joinToken: team.joinToken || "",
                                    isVerified: team.isVerified || false,
                                }),
                            );
                            setUserTeams(transformedTeams);
                        }
                    } catch (err) {
                        console.error("Error fetching teams:", err);
                    } finally {
                        setLoadingTeams(false);
                    }

                    // Fetch registered events
                    try {
                        const registrationsRes = await fetch(
                            "/api/events/my-registrations",
                            {
                                headers: { Authorization: `Bearer ${token}` },
                            },
                        );

                        if (registrationsRes.ok) {
                            const registrations = await registrationsRes.json();
                            // Transform registrations to match expected format
                            const transformedRegistrations = registrations.map(
                                (reg: any) => ({
                                    id: reg._id,
                                    name: reg.eventId?.name || "Unknown Event",
                                    date: new Date(
                                        reg.createdAt,
                                    ).toLocaleDateString("en-US", {
                                        month: "short",
                                        day: "numeric",
                                        year: "numeric",
                                    }),
                                    time: new Date(
                                        reg.createdAt,
                                    ).toLocaleTimeString("en-US", {
                                        hour: "numeric",
                                        minute: "2-digit",
                                        hour12: true,
                                    }),
                                    status: reg.isVerified
                                        ? "Confirmed"
                                        : "Pending",
                                    team: reg.isIndividual
                                        ? "Solo"
                                        : reg.teamName || "Team",
                                    registration: reg,
                                    isVerified: reg.isVerified || false,
                                }),
                            );
                            setRegisteredEvents(transformedRegistrations);
                        }
                    } catch (err) {
                        console.error("Error fetching registrations:", err);
                    }
                }
            } catch (err) {
                console.error("Error parsing user data:", err);
                router.push("/login");
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [router]);

    // Certificate type definition
    interface Certificate {
        id: string;
        event: string;
        type: string;
        date: string;
        url: string;
    }

    const certificates: Certificate[] = [];

    if (loading) {
        return <Loader />;
    }

    if (!profileData) {
        return null;
    }

    return (
        <div
            className={cn(
                "relative w-full min-h-screen overflow-hidden bg-black",
                theme.selection,
            )}>
            {/* Background - Matches Login Page */}
            <div className="fixed inset-0 w-full h-full pointer-events-none">
                <Image
                    src="/login/space-bg.png"
                    alt="Background"
                    width={1000}
                    height={1000}
                    className="absolute w-full h-full object-cover"
                    priority
                />
                {/* Optional: Add a subtle overlay to make text more readable if needed, or keep raw like login */}
                <div className="absolute inset-0 bg-black/20" />
            </div>

            {/* Back to Home Button */}
            <Link
                href="/"
                className={cn(
                    "absolute top-4 left-4 md:top-8 md:left-8 z-50 flex items-center gap-2 px-4 py-2 md:px-6 md:py-3 transition-all duration-300 hover:scale-105 active:scale-95 group",
                    "bg-black/50 border border-white/10 hover:border-white/30 backdrop-blur-md",
                    "text-white font-mono text-sm tracking-wider uppercase"
                )}
                style={{
                    clipPath: "polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)"
                }}>
                <FaArrowLeft className="group-hover:-translate-x-1 transition-transform duration-300" />
                <span>Home</span>
            </Link>

            {/* 🪩 Dashboard Layout */}
            <div className="relative h-full flex items-center justify-center px-4 md:px-8 py-8 md:py-12">
                <div className="w-full max-w-[90rem] xl:max-w-[110rem] 2xl:max-w-[130rem]">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                        {/* PROFILE CARD - Takes up 4 columns on large screens */}
                        <div className="lg:col-span-4 xl:col-span-3">
                            <Board
                                title="PROFILE"
                                isEmailVerified={
                                    profileData?.isEmailVerified || false
                                }
                                isPaid={paymentData?.isPaid || false}
                                pricing={pricing}
                                onPaymentClick={() => setActiveTab("receipt")}
                                onEmailVerificationClick={() => {
                                    if (!profileData?.idCardImageUrl) {
                                        alert("Please upload your ID card image first before verifying your email.");
                                        return;
                                    }
                                    setShowEmailVerificationModal(true);
                                }}
                                onRegisterNow={() => setActiveTab("events")}
                                onDownloadReceipt={() => { }}>
                                <div className="h-[calc(90vh-240px)] lg:h-[62vh] overflow-y-auto scrollbar-none">
                                    <Profile
                                        profileData={profileData}
                                        onProfileUpdate={(updatedUser: any) => {
                                            setProfileData((prev: any) => ({
                                                ...prev,
                                                idCardImageUrl: updatedUser.idCardImageUrl,
                                                idCardCloudinaryId: updatedUser.idCardCloudinaryId
                                            }));
                                        }}
                                    />
                                </div>
                            </Board>
                        </div>

                        {/* DASHBOARD CARD - Takes up 8 columns on large screens */}
                        <div className="lg:col-span-8 xl:col-span-9">
                            <Board title="DASHBOARD">
                                {/* Tabs */}
                                <div className="flex flex-wrap gap-2 mb-6 border-b border-white/10 pb-4">
                                    {[
                                        "RECEIPT",
                                        "EVENTS",
                                        "TEAMS",
                                        "CERTIFICATES",
                                        "NOTIFICATIONS",
                                    ].map((tab) => {
                                        const isActive =
                                            activeTab === tab.toLowerCase();
                                        return (
                                            <button
                                                key={tab}
                                                onClick={() =>
                                                    setActiveTab(
                                                        tab.toLowerCase(),
                                                    )
                                                }
                                                className={cn(
                                                    "px-4 py-2 text-xs md:text-sm font-mono tracking-wider transition-all duration-300 rounded-sm relative overflow-hidden group",
                                                    isActive
                                                        ? "bg-white/10 text-white font-bold border-b-2"
                                                        : "text-slate-400 hover:text-white hover:bg-white/5",
                                                    isActive
                                                        ? theme.accentBorder
                                                        : "border-transparent",
                                                )}>
                                                <span className="relative z-10">
                                                    {tab}
                                                </span>
                                                {isActive && (
                                                    <div
                                                        className={cn(
                                                            "absolute inset-0 opacity-20",
                                                            theme.accentBg,
                                                        )}
                                                    />
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>

                                {/* Tab Content */}
                                <div className="h-[60vh] lg:h-[65vh] overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent pr-2">
                                    {activeTab === "receipt" && (
                                        <Receipt userData={profileData} pricing={pricing} />
                                    )}
                                    {activeTab === "events" && (
                                        <RegisteredEvent
                                            registeredEvents={registeredEvents}
                                        />
                                    )}
                                    {activeTab === "teams" && (
                                        <Team
                                            teamData={userTeams}
                                            currentUserId={currentUserId}
                                        />
                                    )}
                                    {activeTab === "certificates" && (
                                        <Certificate
                                            certificates={certificates}
                                        />
                                    )}
                                    {activeTab === "notifications" && (
                                        <Notification />
                                    )}
                                </div>
                            </Board>
                        </div>
                    </div>
                </div>
            </div>

            {/* Email Verification Modal */}
            {showEmailVerificationModal && profileData && (
                <EmailVerificationModal
                    isOpen={showEmailVerificationModal}
                    onClose={() => setShowEmailVerificationModal(false)}
                    email={profileData.email}
                    onVerificationSuccess={() => {
                        // Refresh user data
                        const user = JSON.parse(
                            localStorage.getItem("user") || "{}",
                        );
                        const updatedUser = { ...user, isEmailVerified: true };
                        localStorage.setItem(
                            "user",
                            JSON.stringify(updatedUser),
                        );
                        setProfileData({
                            ...profileData,
                            isEmailVerified: true,
                        });
                        // Reload page to refresh all data
                        window.location.reload();
                    }}
                />
            )}
        </div>
    );
}
