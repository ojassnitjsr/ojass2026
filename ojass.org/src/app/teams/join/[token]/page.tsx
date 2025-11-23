"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/contexts/ThemeContext";
import clsx from "clsx";

export default function JoinTeamPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const router = useRouter();
  const { theme } = useTheme();
  const [token, setToken] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState(false);
  const [teamInfo, setTeamInfo] = useState<any>(null);

  // Theme-based styling
  const glow = theme === "utopia" ? "#00ffff" : "#cc7722";
  const borderColor =
    theme === "utopia" ? "border-cyan-400" : "border-amber-500";
  const accentText =
    theme === "utopia" ? "text-cyan-300" : "text-amber-400";
  const accentBg =
    theme === "utopia" ? "bg-cyan-400/20" : "bg-amber-500/20";
  const accentHover =
    theme === "utopia"
      ? "hover:bg-cyan-400/30"
      : "hover:bg-amber-500/30";

  useEffect(() => {
    const initialize = async () => {
      // Get token from params
      const resolvedParams = await params;
      setToken(resolvedParams.token);

      // Check authentication
      const userToken = localStorage.getItem("token");
      const user = localStorage.getItem("user");

      if (!userToken || !user) {
        // Store the join token and redirect to login
        localStorage.setItem("pendingTeamJoin", resolvedParams.token);
        router.push("/login");
        return;
      }

      // User is authenticated, attempt to join
      await joinTeam(resolvedParams.token, userToken);
    };

    initialize();
  }, [params, router]);

  const joinTeam = async (joinToken: string, authToken: string) => {
    setLoading(false);
    setJoining(true);
    setError("");

    try {
      const response = await fetch(`/api/teams/join/${joinToken}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });

      const data = await response.json();

      if (response.status === 401) {
        // Token is invalid or expired, clear storage and redirect to login
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // Store the join token for after login
        localStorage.setItem('pendingTeamJoin', joinToken);
        router.push('/login');
        return;
      }

      if (!response.ok) {
        throw new Error(data.error || "Failed to join team");
      }

      setSuccess(true);
      setTeamInfo(data.team);

      // Redirect to dashboard after 3 seconds
      setTimeout(() => {
        router.push("/dashboard");
      }, 3000);
    } catch (err: any) {
      // Check if it's an authentication error
      if (err.message?.includes('Invalid or expired token') || err.message?.includes('Authentication')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.setItem('pendingTeamJoin', joinToken);
        router.push('/login');
        return;
      }
      setError(err.message || "An error occurred while joining the team");
      setJoining(false);
    }
  };

  const handleRetry = () => {
    const userToken = localStorage.getItem("token");
    if (userToken && token) {
      joinTeam(token, userToken);
    } else {
      router.push("/login");
    }
  };

  const handleGoToDashboard = () => {
    router.push("/dashboard");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-950 via-gray-950 to-black">
        <div className="text-center">
          <div
            className={clsx(
              "inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-current border-r-transparent",
              accentText
            )}
            role="status"
          >
            <span className="sr-only">Loading...</span>
          </div>
          <p className={clsx("mt-4 text-lg", accentText)}>
            Loading team invitation...
          </p>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-950 via-gray-950 to-black p-4">
        <div
          className={clsx(
            "max-w-md w-full p-8 rounded-2xl border-2 backdrop-blur-xl bg-black/40",
            borderColor
          )}
          style={{
            boxShadow: `0 0 30px ${glow}40, inset 0 0 30px ${glow}10`,
          }}
        >
          <div className="text-center">
            <div className="mb-6">
              <svg
                className={clsx("w-20 h-20 mx-auto", accentText)}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h1
              className={clsx(
                "text-3xl font-bold mb-4",
                accentText
              )}
            >
              Successfully Joined Team!
            </h1>
            {teamInfo && (
              <div className="mt-6 space-y-2">
                <p className="text-gray-300">
                  <span className="font-semibold">Team:</span>{" "}
                  {teamInfo.teamName || "Individual"}
                </p>
                {typeof teamInfo.eventId === "object" && (
                  <p className="text-gray-300">
                    <span className="font-semibold">Event:</span>{" "}
                    {teamInfo.eventId.name}
                  </p>
                )}
              </div>
            )}
            <p className="text-gray-400 mt-6 mb-6">
              Redirecting to dashboard...
            </p>
            <button
              onClick={handleGoToDashboard}
              className={clsx(
                "px-6 py-3 rounded-lg font-semibold transition-all",
                accentBg,
                accentText,
                borderColor,
                "border-2",
                accentHover
              )}
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-950 via-gray-950 to-black p-4">
      <div
        className={clsx(
          "max-w-md w-full p-8 rounded-2xl border-2 backdrop-blur-xl bg-black/40",
          borderColor
        )}
        style={{
          boxShadow: `0 0 30px ${glow}40, inset 0 0 30px ${glow}10`,
        }}
      >
        {joining ? (
          <div className="text-center">
            <div
              className={clsx(
                "inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-current border-r-transparent",
                accentText
              )}
              role="status"
            >
              <span className="sr-only">Joining...</span>
            </div>
            <p className={clsx("mt-4 text-lg", accentText)}>
              Joining team...
            </p>
          </div>
        ) : error ? (
          <div className="text-center">
            <div className="mb-6">
              <svg
                className="w-20 h-20 mx-auto text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold mb-4 text-red-400">
              Failed to Join Team
            </h1>
            <p className="text-gray-300 mb-6">{error}</p>
            <div className="space-y-3">
              <button
                onClick={handleRetry}
                className={clsx(
                  "w-full px-6 py-3 rounded-lg font-semibold transition-all",
                  accentBg,
                  accentText,
                  borderColor,
                  "border-2",
                  accentHover
                )}
              >
                Try Again
              </button>
              <button
                onClick={handleGoToDashboard}
                className="w-full px-6 py-3 rounded-lg font-semibold transition-all bg-gray-800 text-gray-300 border-2 border-gray-700 hover:bg-gray-700"
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <p className={clsx("text-lg", accentText)}>
              Preparing to join team...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

