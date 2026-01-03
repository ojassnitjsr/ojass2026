"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Receipt from "@/components/Receipt";

export default function ReceiptPage() {
  const router = useRouter();
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/login');
          return;
        }

        const res = await fetch('/api/payment/status', {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (res.ok) {
          const data = await res.json();
          // Use data directly from API (secure)
          setUserData(data);
        } else {
          console.error("Failed to fetch receipt data");
          router.push('/dashboard');
        }
      } catch (err) {
        console.error('Error fetching receipt data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-white text-xl animate-pulse">Generating secure receipt...</div>
      </div>
    );
  }

  if (!userData) {
    return null;
  }

  // Map API response to Receipt component expected format
  const secureUser = {
    name: userData.name,
    email: userData.email,
    ojassId: userData.ojassId,
    phone: userData.phone,
    college: userData.college,
    collegeName: userData.collegeName,
    registrationPhase: userData.registrationPhase,
    isPaid: userData.isPaid,
    payment: {
      receiptId: userData.orderId || userData.razorpayOrderId || 'N/A',
      date: userData.paymentDate,
      amount: userData.paymentAmount,
      status: userData.isPaid ? 'completed' : 'pending'
    },
    paymentDate: userData.paymentDate,
    paymentAmount: userData.paymentAmount,
    orderId: userData.orderId
  };

  return (
    <Receipt
      user={secureUser}
      onClose={() => router.push('/dashboard')}
    />
  );
}
