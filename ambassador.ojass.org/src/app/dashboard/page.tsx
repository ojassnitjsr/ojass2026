"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import DashboardNavbar from "@/components/DashboardNavbar";
import UserCard from "@/components/UserCard";
import ReferralCard from "@/components/ReferralCard";
import StatsCards from "@/components/StatsCards";
import { useAuth } from "@/contexts/AuthContext";
import { referralAPI, ReferralStatsResponse } from "@/lib/api";

interface Referral {
  name: string;
  phone: string;
  status: "Paid" | "Unpaid";
  email?: string;
  ojassId?: string;
  registeredAt?: string;
}

export default function DashboardPage() {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [stats, setStats] = useState({
    totalReferrals: 0,
    totalPaid: 0,
    totalUnpaid: 0,
  });
  const [loadingReferrals, setLoadingReferrals] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Protect route - redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, loading, router]);

  // Fetch referral data
  useEffect(() => {
    const fetchReferrals = async () => {
      if (!isAuthenticated || !user) return;

      setLoadingReferrals(true);
      setError(null);

      try {
        const data: ReferralStatsResponse = await referralAPI.getStats();

        // Transform referred users to match Referral interface
        const referralList: Referral[] = data.referredUsers.map((ref) => ({
          name: ref.name,
          phone: ref.phone || ref.email || "N/A",
          email: ref.email,
          ojassId: ref.ojassId,
          registeredAt: ref.registeredAt,
          status: ref.isPaid ? ("Paid" as const) : ("Unpaid" as const),
        }));

        setReferrals(referralList);

        // Calculate stats
        const totalPaid = referralList.filter((r) => r.status === "Paid").length;
        const totalUnpaid = referralList.filter((r) => r.status === "Unpaid").length;

        setStats({
          totalReferrals: data.referralCount,
          totalPaid,
          totalUnpaid,
        });
      } catch (err: unknown) {
        console.error("Error fetching referrals:", err);
        const message = err instanceof Error ? err.message : "Failed to load referrals";
        setError(message);
        // If 401, user might need to re-login
        if (message.includes("401") || message.includes("Unauthorized")) {
          router.push("/login");
        }
      } finally {
        setLoadingReferrals(false);
      }
    };

    if (isAuthenticated && user) {
      fetchReferrals();
    }
  }, [isAuthenticated, user, router]);

  // Show loading state while checking authentication
  if (loading || (!isAuthenticated && !loading)) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF8C00] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // Calculate earnings (placeholder - would need actual calculation based on payment structure)
  const earnings = "₹0"; // Placeholder

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      <DashboardNavbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-12">
        {/* Dashboard Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-3">
            Welcome to Your <span className="text-[#FF8C00]">OJASS Dashboard</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl">
            Track your referrals, payments, and OJASS ID here.
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8"
        >
          <StatsCards
            totalReferrals={stats.totalReferrals}
            totalPaid={stats.totalPaid}
            totalUnpaid={stats.totalUnpaid}
            earnings={earnings}
          />
        </motion.div>

        {/* User Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8"
        >
          <UserCard
            ojassId={user.ojassId}
            name={user.name}
            phone={user.phone}
            referralCode={user.referralCode}
          />
        </motion.div>

        {/* Referrals Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Referrals <span className="text-[#FF8C00]">List</span>
            </h2>
            <span className="text-sm text-gray-500">
              {stats.totalReferrals} {stats.totalReferrals === 1 ? "referral" : "referrals"}
            </span>
          </div>

          {loadingReferrals ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF8C00] mx-auto mb-4"></div>
              <p className="text-gray-600">Loading referrals...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
              <p className="text-red-700">{error}</p>
            </div>
          ) : referrals.length === 0 ? (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
              <p className="text-gray-600 text-lg">No referrals yet</p>
              <p className="text-gray-500 text-sm mt-2">Start sharing your referral code to get referrals!</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
              {referrals.map((referral, index) => (
                <motion.div
                  key={referral.ojassId || index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                >
                  <ReferralCard
                    name={referral.name}
                    phone={referral.phone || referral.email || "N/A"}
                    status={referral.status}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
}

