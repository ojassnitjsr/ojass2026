"use client";

import React, { useRef, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/contexts/ThemeContext";
import clsx from "clsx";
import Image from "next/image";

interface PrizeData {
  total: string;
  winner: string;
  first_runner_up?: string;
  second_runner_up?: string;
}

interface EventHead {
  name: string;
  Phone: string;
}

interface EventData {
  _id: string;
  id?: string;
  name: string;
  img: string;
  description: string;
  rulebookurl: string;
  prizes: PrizeData;
  details: string[];
  rules: string[];
  event_head: EventHead;
  isTeamEvent?: boolean;
  teamSizeMin?: number;
  teamSizeMax?: number;
}

interface User {
  paid: boolean;
  events: string[];
}

export default function RedesignedEventPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { theme } = useTheme();
  const router = useRouter();

  const [eventData, setEventData] = useState<EventData | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [registration, setRegistration] = useState<any>(null);
  const [aspectRatio, setAspectRatio] = useState(16 / 9);
  const [eventId, setEventId] = useState<string | null>(null);
  const [userTeam, setUserTeam] = useState<any>(null);

  const textColor = theme === "utopia" ? "text-cyan-300" : "text-amber-400";
  const accentColor = theme === "utopia" ? "bg-cyan-500" : "bg-amber-500";
  const accentBorder =
    theme === "utopia" ? "border-cyan-400/70" : "border-amber-500/70";
  const accentHover =
    theme === "utopia" ? "hover:bg-cyan-600" : "hover:bg-amber-600";
  const huerotate =
    theme === "utopia" ? "" : "hue-rotate-[180deg] saturate-200 contrast-200";
  const trophyhuerotate =
    theme === "utopia" ? "hue-rotate-[180deg] saturate-200 contrast-200" : "";

  // --- Effect to resolve params (Next.js 15 async params) ---
  useEffect(() => {
    params.then((resolvedParams) => {
      setEventId(resolvedParams.eventId);
    });
  }, [params]);

  // --- Effect to track window aspect ratio ---
  useEffect(() => {
    const handleResize = () => {
      setAspectRatio(window.innerWidth / window.innerHeight);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // --- Fetch data ---
  useEffect(() => {
    if (!eventId) return;

    // Fetch event data from API
    fetch(`/api/events/${eventId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Event not found");
        }
        return response.json();
      })
      .then((data: EventData) => {
        setEventData(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching event data:", error);
        router.push("/events");
      });

    // Check user authentication and registration status
    const token = localStorage.getItem("token");
    if (token) {
      fetch(`/api/events/${eventId}/registered`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          setIsRegistered(data.isRegistered || false);
          setRegistration(data.registration);
        })
        .catch((error) => {
          console.error("Error checking registration:", error);
        });

      // Check if user has a team for this event
      fetch(`/api/teams?eventId=${eventId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then((teams) => {
          if (teams && Array.isArray(teams) && teams.length > 0) {
            // The API returns teams where user is leader or member, so take the first one
            setUserTeam(teams[0]);
          }
        })
        .catch((error) => {
          console.error("Error checking user team:", error);
        });

      const userStr = localStorage.getItem("user");
      if (userStr) {
        try {
          const userData = JSON.parse(userStr);
          setUser({
            paid: userData.isPaid || false,
            events: userData.events || [],
          });
        } catch (err) {
          console.error("Error parsing user data:", err);
        }
      }
    }
  }, [eventId, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-cyan-400 text-xl">Loading event...</div>
      </div>
    );
  }

  if (!eventData) {
    return null;
  }

  return (
    <>
      <div
        className={clsx(
          "relative min-h-screen w-full overflow-x-hidden  text-white "
        )}
      >
        <video
          autoPlay
          loop
          muted
          playsInline
          src="/events/eventbackground.mp4"
          className="absolute top-0 left-0 w-full h-full object-cover -z-10"
        />

        {/* --- DYNAMIC BACKGROUND RENDER --- */}
        {aspectRatio > 1 ? (
          <div
            className={clsx(
              "fixed inset-0 z-0 bg-[url('/events/eventbg.png')] bg-center bg-cover    transition-transform duration-300    h-[100vh] w-[100vw] ",
              huerotate
            )}
          />
        ) : (
          <div
            className="fixed inset-0 z-0 bg-[url('/events/eventbg.png')] bg-center bg-cover origin-top-left top-0 left-full
                       transition-transform duration-300
                       rotate-90 h-[100vw] w-[100vh]"
          />
        )}

        {/* --- MAIN CONTENT WRAPPER --- */}
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-12 py-8 sm:py-12 lg:py-16 h-[75vh] overflow-y-scroll mt-[12.5vh] w-[70vw]  lg:w-full">
          {/* --- PAGE TITLE --- */}
          <h1
            className={clsx(
              "text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-8 sm:mb-12 text-center lg:text-left",
              textColor
            )}
          >
            {eventData.name}
          </h1>

          {/* --- HERO SECTION --- */}
          <div className="relative w-full max-w-6xl mx-auto lg:mx-0 mb-8 sm:mb-12">
            <div className="flex flex-col lg:flex-row gap-12 bg-black/40 backdrop-blur-sm rounded-lg overflow-hidden border border-gray-800 p-4 sm:p-6">
              {/* Event Image */}
              <div className="w-full lg:w-2/5 flex-shrink-0">
                <Image
                  src={eventData.img}
                  alt={eventData.name}
                  width={500}
                  height={500}
                  className={clsx(
                    "w-full h-auto sm:h-full md:h-full object-cover object-center rounded-lg ",
                    huerotate
                  )}
                />
              </div>

              {/* Event Description */}
              <div>
                <div className="flex-1 flex flex-col justify-center">
                  <h2
                    className={clsx(
                      "text-xl sm:text-2xl font-bold mb-3 sm:mb-4",
                      textColor
                    )}
                  >
                    Event Description
                  </h2>
                  <p
                    className={clsx(
                      "text-base sm:text-lg leading-relaxed",
                      textColor
                    )}
                  >
                    {eventData.description}
                  </p>
                </div>
                <div>
                  <div
                    className={clsx(
                      "flex flex-col  mt-11 gap-4 sm:gap-6 p-4 sm:p-6 rounded-lg bg-black/60 border backdrop-blur-sm h-auto",
                      accentBorder
                    )}
                  >
                    {/* --- Action Buttons --- */}
                    <div className="flex flex-col gap-3 sm:gap-4">
                      <DynamicRegisterButton
                        user={user}
                        eventId={eventData._id || eventData.id || eventId || ""}
                        isRegistered={isRegistered}
                        accentColor={accentColor}
                        accentHover={accentHover}
                        router={router}
                        onRegisterSuccess={() => {
                          setIsRegistered(true);
                        }}
                        isTeamEvent={eventData.isTeamEvent}
                        teamSizeMin={eventData.teamSizeMin}
                        teamSizeMax={eventData.teamSizeMax}
                        userTeam={userTeam}
                        registration={registration}
                      />
                      <a
                        href={eventData.rulebookurl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-4 sm:px-6 rounded-lg w-full transition-colors text-sm sm:text-base"
                      >
                        Download Rulebook
                      </a>
                    </div>

                    {/* --- Coordinator Section --- */}
                    <div className="border-t border-gray-700 mt-3">
                      <h3 className="text-lg sm:text-xl font-bold mb-3 text-white">
                        Coordinator
                      </h3>
                      {eventData.event_head && (
                        <div className="text-sm sm:text-base font-light">
                          <p className="font-semibold text-white mb-1">
                            {eventData.event_head.name}
                          </p>
                          <p className={textColor}>
                            {eventData.event_head.Phone}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* --- FIRST ROW: Rules + Actions/Coordinator --- */}
          <div
            className={clsx(
              "p-4 sm:p-6 rounded-lg bg-black/60 border backdrop-blur-sm mb-20",
              accentBorder
            )}
          >
            <h3 className="text-xl sm:text-2xl font-bold mb-4 pb-2 border-b border-gray-600 text-white">
              Prizes
            </h3>
            <div
              className={clsx(
                " text-base sm:text-lg font-light space-y-3",
                textColor
              )}
            >
              <div className="bg-black/40 p-3 sm:p-4 rounded-lg">
                <p className="text-xs sm:text-sm uppercase tracking-wide text-gray-400 mb-1">
                  Total Prize Pool
                </p>
                <p className="text-xl sm:text-2xl font-bold text-white">
                  {eventData.prizes.total}
                </p>
              </div>

              <div className="flex justify-between items-end mx-auto h-auto p-0">
                {eventData.prizes.first_runner_up && (
                  <div className="flex flex-col items-center justify-end h-full flex-1">
                    <div
                      className={clsx(
                        "flex-grow flex items-end mb-2 h-[50%] scale-75",
                        trophyhuerotate
                      )}
                    >
                      <img
                        src="/events/secondposition.png"
                        className="object-contain"
                        alt="Second Position"
                      />
                    </div>
                    <div className="flex flex-col text-center">
                      <span className="">
                        {eventData.prizes.first_runner_up}
                      </span>
                    </div>
                  </div>
                )}

                {/* Winner - Largest */}
                <div className="flex flex-col items-center justify-end h-full flex-1">
                  <div
                    className={clsx(
                      "flex-grow flex items-end mb-2 scale-105",
                      trophyhuerotate
                    )}
                  >
                    <img
                      src="/events/firstposition.png"
                      className="h-[80%] object-contain"
                      alt="First Position"
                    />
                  </div>
                  <div className="flex flex-col text-center">
                    <span className="">{eventData.prizes.winner}</span>
                  </div>
                </div>

                {eventData.prizes.second_runner_up && (
                  <div className="flex flex-col items-center justify-end h-full flex-1">
                    <div
                      className={clsx(
                        "flex-grow flex items-end mb-2 scale-[0.6]",
                        trophyhuerotate
                      )}
                    >
                      <img
                        src="/events/thirdposition.png"
                        className="h-[50%] object-contain"
                        alt="Third Position"
                      />
                    </div>
                    <div className="flex flex-col text-center">
                      <span className="">
                        {eventData.prizes.second_runner_up}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          {/* --- SECOND ROW: Additional Details + Prizes --- */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            {/* --- Details Section --- */}
            {eventData.details && eventData.details.length > 0 && (
              <div>
                <EventSection title="Additional Details">
                  <ul
                    className={clsx(
                      "list-disc list-inside space-y-2 sm:space-y-3 text-base sm:text-lg font-light",
                      textColor
                    )}
                  >
                    {eventData.details.map((detail, index) => (
                      <li key={index} className="leading-relaxed">
                        {detail}
                      </li>
                    ))}
                  </ul>
                </EventSection>
              </div>
            )}

            {/* --- Rules Section --- */}
            {eventData.rules && eventData.rules.length > 0 && (
              <div>
                <EventSection title="Rules">
                  <ul
                    className={clsx(
                      "list-disc list-inside space-y-2 sm:space-y-3 text-base sm:text-lg font-light",
                      textColor
                    )}
                  >
                    {eventData.rules.map((rule, index) => (
                      <li key={index} className="leading-relaxed">
                        {rule}
                      </li>
                    ))}
                  </ul>
                </EventSection>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function EventSection({
  title,
  children,
  noMargin = false,
}: {
  title: string;
  children: React.ReactNode;
  noMargin?: boolean;
}) {
  return (
    <div className={clsx(!noMargin && "mb-4")}>
      <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 border-b border-gray-600 pb-2 text-white">
        {title}
      </h3>
      {children}
    </div>
  );
}

// --- Helper Component for "Smart" Button ---
function DynamicRegisterButton({
  user,
  eventId,
  isRegistered,
  accentColor,
  accentHover,
  router,
  onRegisterSuccess,
  isTeamEvent,
  teamSizeMin,
  teamSizeMax,
  userTeam,
  registration,
}: {
  user: User | null;
  eventId: string;
  isRegistered: boolean;
  accentColor: string;
  accentHover: string;
  router: any;
  onRegisterSuccess: () => void;
  isTeamEvent?: boolean;
  teamSizeMin?: number;
  teamSizeMax?: number;
  userTeam?: any;
  registration?: any;
}) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [showCreateTeam, setShowCreateTeam] = useState(false);
  const [teamName, setTeamName] = useState("");
  const [isCreatingTeam, setIsCreatingTeam] = useState(false);
  const [createdTeam, setCreatedTeam] = useState<any>(null);
  const [inviteLink, setInviteLink] = useState("");

  // Use existing team if available (prioritize created team, then userTeam, then registration)
  const currentTeam = createdTeam || userTeam || registration;

  // Case 1: User is not logged in
  if (!user) {
    return (
      <button
        onClick={() => router.push("/auth/login")}
        className={clsx(
          "flex items-center justify-center gap-2 text-black font-bold py-3 px-4 sm:px-6 rounded-lg w-full transition-colors text-sm sm:text-base",
          accentColor,
          accentHover
        )}
      >
        Login to Participate
      </button>
    );
  }

  // Case 2: User is logged in but not paid
  if (!user.paid) {
    return (
      <button
        onClick={() => {
          alert("Please complete payment to register for events");
          router.push("/dashboard");
        }}
        className={clsx(
          "flex items-center justify-center gap-2 text-black font-bold py-3 px-4 sm:px-6 rounded-lg w-full transition-colors text-sm sm:text-base",
          accentColor,
          accentHover
        )}
      >
        Complete Payment to Register
      </button>
    );
  }

  // Case 3: User is already registered
  if (isRegistered) {
    // If it's a team event and user has a team, show invite option
    if (isTeamEvent && currentTeam && currentTeam.joinToken) {
      const fullInviteLink = `${window.location.origin}/teams/join/${currentTeam.joinToken}`;
      
      return (
        <div className="space-y-3">
          <button
            disabled
            className="flex items-center justify-center gap-2 bg-green-600 text-white font-bold py-3 px-4 sm:px-6 rounded-lg w-full cursor-not-allowed text-sm sm:text-base"
          >
            You are Registered
          </button>
          <button
            onClick={() => {
              const linkToCopy = inviteLink || fullInviteLink;
              navigator.clipboard.writeText(linkToCopy).then(() => {
                alert("Invitation link copied to clipboard!");
              }).catch((err) => {
                console.error("Failed to copy link:", err);
                // Fallback: select text
                const textArea = document.createElement("textarea");
                textArea.value = linkToCopy;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand("copy");
                document.body.removeChild(textArea);
                alert("Invitation link copied to clipboard!");
              });
            }}
            className={clsx(
              "flex items-center justify-center gap-2 text-black font-bold py-3 px-4 sm:px-6 rounded-lg w-full transition-colors text-sm sm:text-base",
              accentColor,
              accentHover
            )}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            Invite a Friend
          </button>
        </div>
      );
    }
    
    // For individual events or if no team
    return (
      <button
        disabled
        className="flex items-center justify-center gap-2 bg-green-600 text-white font-bold py-3 px-4 sm:px-6 rounded-lg w-full cursor-not-allowed text-sm sm:text-base"
      >
        You are Registered
      </button>
    );
  }

  // Case 4: User can register
  // For team events, show create team option if not registered
  if (isTeamEvent && !isRegistered) {
    // If team exists (created or existing), show invitation link
    if (currentTeam) {
      const fullInviteLink = `${window.location.origin}/teams/join/${currentTeam.joinToken}`;
      const memberCount = Array.isArray(currentTeam.teamMembers) 
        ? currentTeam.teamMembers.length 
        : (typeof currentTeam.teamMembers === 'object' && currentTeam.teamMembers?.length) || 1;
      
      return (
        <div className="space-y-4">
          <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-4">
            <p className="text-green-300 text-sm font-semibold mb-2">
              {createdTeam ? "✓ Team Created Successfully!" : "✓ Your Team"}
            </p>
            <p className="text-white text-xs mb-3">
              Share this invitation link with your team members ({memberCount}/{teamSizeMax} members):
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                readOnly
                value={inviteLink || fullInviteLink}
                className="flex-1 bg-black/40 border border-gray-600 rounded px-3 py-2 text-white text-xs"
              />
              <button
                onClick={() => {
                  navigator.clipboard.writeText(inviteLink || fullInviteLink);
                  alert("Invitation link copied to clipboard!");
                }}
                className="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded text-xs"
              >
                Copy
              </button>
            </div>
            <p className="text-gray-400 text-xs mt-2">
              Team: {currentTeam.teamName || "My Team"}
            </p>
          </div>
          
          <button
            onClick={async () => {
              const token = localStorage.getItem("token");
              if (!token) {
                router.push("/auth/login");
                return;
              }

              setIsRegistering(true);
              try {
                const response = await fetch("/api/events/register", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                  },
                  body: JSON.stringify({
                    eventId: eventId,
                    teamId: currentTeam._id,
                  }),
                });

                const data = await response.json();

                if (!response.ok) {
                  throw new Error(data.error || "Registration failed");
                }

                onRegisterSuccess();
                alert("Successfully registered your team for the event!");
              } catch (error: any) {
                alert(error.message || "Failed to register");
              } finally {
                setIsRegistering(false);
              }
            }}
            disabled={isRegistering || memberCount < (teamSizeMin || 1)}
            className={clsx(
              "flex items-center justify-center gap-2 text-black font-bold py-3 px-4 sm:px-6 rounded-lg w-full transition-colors text-sm sm:text-base",
              accentColor,
              accentHover,
              (isRegistering || memberCount < (teamSizeMin || 1)) && "opacity-50 cursor-not-allowed"
            )}
          >
            {isRegistering 
              ? "Registering..." 
              : memberCount < (teamSizeMin || 1)
              ? `Need at least ${teamSizeMin} members to register`
              : "Register Team for Event"}
          </button>
        </div>
      );
    }

    // Show create team form
    if (showCreateTeam) {
      const handleCreateTeam = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/auth/login");
          return;
        }

        if (!teamName.trim()) {
          alert("Please enter a team name");
          return;
        }

        setIsCreatingTeam(true);
        try {
          const response = await fetch("/api/teams", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              eventId: eventId,
              teamName: teamName.trim(),
            }),
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.error || "Failed to create team");
          }

          setCreatedTeam(data);
          const fullInviteLink = `${window.location.origin}/teams/join/${data.joinToken}`;
          setInviteLink(fullInviteLink);
          alert("Team created successfully! Share the invitation link with your team members.");
        } catch (error: any) {
          alert(error.message || "Failed to create team");
        } finally {
          setIsCreatingTeam(false);
        }
      };

      return (
        <div className="space-y-4">
          <div className="bg-black/40 border border-gray-600 rounded-lg p-4">
            <h4 className="text-white font-semibold mb-3 text-sm">
              Create Team for This Event
            </h4>
            <div className="space-y-3">
              <div>
                <label className="text-gray-300 text-xs mb-1 block">
                  Team Name
                </label>
                <input
                  type="text"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  placeholder="Enter team name"
                  className="w-full bg-black/60 border border-gray-600 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-cyan-400"
                />
              </div>
              {teamSizeMin && teamSizeMax && (
                <p className="text-gray-400 text-xs">
                  Team size: {teamSizeMin} - {teamSizeMax} members
                </p>
              )}
            </div>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={handleCreateTeam}
              disabled={isCreatingTeam || !teamName.trim()}
              className={clsx(
                "flex-1 flex items-center justify-center gap-2 text-black font-bold py-3 px-4 sm:px-6 rounded-lg transition-colors text-sm sm:text-base",
                accentColor,
                accentHover,
                (isCreatingTeam || !teamName.trim()) && "opacity-50 cursor-not-allowed"
              )}
            >
              {isCreatingTeam ? "Creating..." : "Create Team"}
            </button>
            <button
              onClick={() => {
                setShowCreateTeam(false);
                setTeamName("");
              }}
              className="px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      );
    }

    // Show create team button for team events
    return (
      <button
        onClick={() => setShowCreateTeam(true)}
        className={clsx(
          "flex items-center justify-center gap-2 text-black font-bold py-3 px-4 sm:px-6 rounded-lg w-full transition-colors text-sm sm:text-base",
          accentColor,
          accentHover
        )}
      >
        Create Team & Register
      </button>
    );
  }

  // For individual events or if already registered in team
  const handleRegister = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/auth/login");
      return;
    }

    setIsRegistering(true);
    try {
      const response = await fetch("/api/events/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          eventId: eventId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Registration failed");
      }

      onRegisterSuccess();
      alert("Successfully registered for the event!");
    } catch (error: any) {
      alert(error.message || "Failed to register");
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <button
      onClick={handleRegister}
      disabled={isRegistering}
      className={clsx(
        "flex items-center justify-center gap-2 text-black font-bold py-3 px-4 sm:px-6 rounded-lg w-full transition-colors text-sm sm:text-base",
        accentColor,
        accentHover,
        isRegistering && "opacity-50 cursor-not-allowed"
      )}
    >
      {isRegistering ? "Registering..." : "Register for Event"}
    </button>
  );
}
