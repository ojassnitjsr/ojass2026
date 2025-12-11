"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Receipt from "@/components/Receipt";

export default function ReceiptPage() {
  const router = useRouter();
  const [userData, setUserData] = useState<any>(null);
  const [paymentData, setPaymentData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get user data from localStorage
        const userStr = localStorage.getItem('user');
        if (userStr) {
          const user = JSON.parse(userStr);
          setUserData(user);
        }

        // Fetch payment data
        const token = localStorage.getItem('token');
        if (token) {
          const res = await fetch('/api/payment/status', {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (res.ok) {
            const data = await res.json();
            setPaymentData(data);
          }
        }
      } catch (err) {
        console.error('Error fetching receipt data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Loading receipt...</div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Please login to view receipt</div>
      </div>
    );
  }

  // Merge user data with payment data
  const mergedUser = {
    ...userData,
    payment: paymentData?.payment || null,
    paymentDate: paymentData?.paymentDate,
    paymentAmount: paymentData?.paymentAmount,
    orderId: paymentData?.orderId,
    isPaid: paymentData?.isPaid || userData.isPaid,
    paid: paymentData?.isPaid || userData.isPaid,
  };

  return (
    <Receipt 
      user={mergedUser} 
      onClose={() => router.push('/dashboard')}
    />
  );
}

