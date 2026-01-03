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
                                        "COMMUNITY",
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
                                    {activeTab === "community" && (
                                        <div className="space-y-6">
                                            {/* WhatsApp Community Section */}
                                            <div className={cn(
                                                "relative overflow-hidden rounded-lg p-6 border-2 transition-all duration-300",
                                                theme.borderColor,
                                                "bg-gradient-to-br from-white/10 to-white/5"
                                            )}>
                                                <div className="relative z-10">
                                                    <div className="flex items-start justify-between mb-4">
                                                        <div>
                                                            <h2 className="text-white font-mono text-xl tracking-wider uppercase mb-2 flex items-center gap-2">
                                                                <span className={cn("inline-block w-3 h-3 rounded-full animate-pulse", theme.accentBg)}></span>
                                                                Join OJASS Community
                                                            </h2>
                                                            <p className="text-slate-300 text-sm">
                                                                Connect with participants, get event updates, and receive instant support
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <a
                                                        href="https://chat.whatsapp.com/YOUR_WHATSAPP_GROUP_LINK"
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className={cn(
                                                            "inline-flex items-center gap-3 px-6 py-3 rounded-md font-mono text-sm font-semibold transition-all duration-300 hover:scale-105 active:scale-95",
                                                            "border-2",
                                                            theme.borderColor,
                                                            theme.accentBg,
                                                            "text-black hover:shadow-lg"
                                                        )}
                                                    >
                                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                                                        </svg>
                                                        <span>Join WhatsApp Community</span>
                                                    </a>
                                                </div>

                                                {/* Decorative background element */}
                                                <div className={cn(
                                                    "absolute -right-10 -bottom-10 w-40 h-40 rounded-full opacity-10 blur-3xl",
                                                    theme.accentBg
                                                )}></div>
                                            </div>

                                            {/* Help & Support Section */}
                                            <div>
                                                <h3 className="text-white font-mono text-base tracking-wider uppercase mb-4 flex items-center gap-2">
                                                    <span className={cn("inline-block w-2 h-2 rounded-full", theme.accentBg)}></span>
                                                    Need Help? Contact Us
                                                </h3>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                                    {/* General Enquiry Contact */}
                                                    <div className={cn(
                                                        "group relative overflow-hidden rounded-lg border transition-all duration-300",
                                                        theme.borderColor,
                                                        "bg-white/5 hover:bg-white/10"
                                                    )}>
                                                        <div className="p-5">
                                                            <div className="flex items-center gap-3 mb-4">
                                                                <div className={cn(
                                                                    "w-10 h-10 rounded-lg flex items-center justify-center",
                                                                    theme.accentBg
                                                                )}>
                                                                    <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                    </svg>
                                                                </div>
                                                                <div>
                                                                    <p className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">General Enquiry</p>
                                                                    <p className="text-white font-bold text-base mt-0.5">Anurag Das</p>
                                                                </div>
                                                            </div>

                                                            <a
                                                                href="tel:+918340671871"
                                                                className={cn(
                                                                    "flex items-center gap-2 text-sm font-mono transition-colors duration-300 hover:text-white mb-3",
                                                                    theme.accentColor
                                                                )}
                                                            >
                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                                                </svg>
                                                                <span>+91 8340671871</span>
                                                            </a>

                                                            <p className="text-slate-400 text-xs leading-relaxed">
                                                                Event information and general inquiries
                                                            </p>
                                                        </div>

                                                        {/* Bottom accent line */}
                                                        <div className={cn("h-1 w-full transition-all duration-300 group-hover:h-1.5", theme.accentBg)}></div>
                                                    </div>
                                                    {/* Portal Support Contact */}
                                                    <div className={cn(
                                                        "group relative overflow-hidden rounded-lg border transition-all duration-300  mb-10",
                                                        theme.borderColor,
                                                        "bg-white/5 hover:bg-white/10"
                                                    )}>
                                                        <div className="p-5">
                                                            <div className="flex items-center gap-3 mb-4">
                                                                <div className={cn(
                                                                    "w-10 h-10 rounded-lg flex items-center justify-center",
                                                                    theme.accentBg
                                                                )}>
                                                                    <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                                    </svg>
                                                                </div>
                                                                <div>
                                                                    <p className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">Portal Support</p>
                                                                    <p className="text-white font-bold text-base mt-0.5">Ayush</p>
                                                                </div>
                                                            </div>

                                                            <a
                                                                href="tel:8299797516"
                                                                className={cn(
                                                                    "flex items-center gap-2 text-sm font-mono transition-colors duration-300 hover:text-white mb-3",
                                                                    theme.accentColor
                                                                )}
                                                            >
                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                                                </svg>
                                                                <span>+91 8299797516</span>
                                                            </a>

                                                            <p className="text-slate-400 text-xs leading-relaxed">
                                                                Technical support and portal-related queries
                                                            </p>
                                                        </div>

                                                        {/* Bottom accent line */}
                                                        <div className={cn("h-1 w-full transition-all duration-300 group-hover:h-1.5", theme.accentBg)}></div>
                                                    </div>

                                                </div>
                                            </div>
                                        </div>
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
