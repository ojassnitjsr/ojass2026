"use client";

import React, { useState, useEffect } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { useRouter } from "next/navigation";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function Receipt({ userData }: { userData?: any }) {
  const { theme } = useTheme();
  const router = useRouter();
  const [paymentData, setPaymentData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // 🎨 Dynamic theme-based styles
  const glow = theme === "utopia" ? "#00ffff" : "#cc7722";
  const textColor =
    theme === "utopia" ? "text-cyan-300" : "text-amber-400";
  const borderColor =
    theme === "utopia" ? "border-cyan-400/30" : "border-amber-500/30";
  const gradientFrom =
    theme === "utopia"
      ? "from-cyan-500/10 to-blue-500/5"
      : "from-amber-700/15 to-orange-900/10";
  const boxShadow = `0 0 20px ${glow}33, inset 0 0 15px ${glow}22`;

  useEffect(() => {
    const fetchPaymentStatus = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('/api/payment/status', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (res.ok) {
          setPaymentData(data);
        }
      } catch (err) {
        console.error('Error fetching payment status:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPaymentStatus();
  }, []);

  // Listen for download trigger from parent
  // useEffect(() => {
  //   const checkDownloadTrigger = () => {
  //     // const shouldDownload = sessionStorage.getItem('downloadReceipt');
  //     if ( paymentData?.isPaid && userData) {
  //       // Use setTimeout to ensure paymentData is available
  //       setTimeout(() => {
  //         handleDownloadReceipt();
  //         // sessionStorage.removeItem('downloadReceipt');
  //       }, 100);
  //     }
  //   };
    
  //   if (paymentData && userData) {
  //     checkDownloadTrigger();
  //   }
  // }, [paymentData, userData]); // eslint-disable-line react-hooks/exhaustive-deps

  const handlePayNow = async () => {
    setPaymentLoading(true);
    setMessage(null);
    try {
      const token = localStorage.getItem('token');
      
      // Create Razorpay order
      const orderRes = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const orderData = await orderRes.json();
      
      if (!orderRes.ok) {
        const errorText = orderData.details 
          ? `${orderData.error}: ${orderData.details}`
          : orderData.error || 'Failed to create order';
        setMessage({ type: 'error', text: errorText });
        setPaymentLoading(false);
        return;
      }

      // Load Razorpay script if not loaded
      if (!window.Razorpay) {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => initRazorpay(orderData);
        script.onerror = () => {
          setMessage({ type: 'error', text: 'Failed to load Razorpay' });
          setPaymentLoading(false);
        };
        document.body.appendChild(script);
      } else {
        initRazorpay(orderData);
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
      setPaymentLoading(false);
    }
  };

  const initRazorpay = (orderData: any) => {
    const options = {
      key: orderData.razorpayKeyId,
      amount: orderData.order.amount,
      currency: orderData.order.currency,
      order_id: orderData.order.id,
      name: 'OJASS 2026',
      description: 'Registration Fee',
      prefill: {
        email: userData?.email || '',
        contact: userData?.phone || '',
      },
      handler: async (response: any) => {
        try {
          const token = localStorage.getItem('token');
          const verifyRes = await fetch('/api/payment/verify', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            })
          });
          
          const verifyData = await verifyRes.json();
          
          if (verifyRes.ok && verifyData.success) {
            setMessage({ type: 'success', text: 'Payment successful!' });
            
            // Update user in localStorage
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            const updatedUser = { ...user, isPaid: true };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            
            // Refresh payment status
            setTimeout(() => window.location.reload(), 1500);
          } else {
            setMessage({ type: 'error', text: verifyData.error || 'Payment verification failed' });
          }
        } catch (err) {
          setMessage({ type: 'error', text: 'Payment verification error' });
        } finally {
          setPaymentLoading(false);
        }
      },
      modal: {
        ondismiss: () => {
          setPaymentLoading(false);
        }
      }
    };
    
    const razorpay = new window.Razorpay(options);
    razorpay.open();
  };

  const handleDownloadReceipt = () => {
    if (!paymentData || !userData) return;
    
    // Navigate to receipt page instead of generating PDF
    router.push('/receipt');
  };

  if (loading) {
    return <div className="text-cyan-400 text-center">Loading payment details...</div>;
  }

  const isEmailVerified = userData?.isEmailVerified || paymentData?.isEmailVerified || false;
  const isPaid = paymentData?.isPaid || false;

  console.log(isEmailVerified, isPaid)

  // If email not verified, show message
  if (!isEmailVerified) {
    return (
      <div className="space-y-3">
        <div
          className={`p-4 border ${borderColor} bg-gradient-to-r ${gradientFrom} backdrop-blur-md transition-all duration-300`}
          style={{
            clipPath: "polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)",
            boxShadow,
          }}
        >
          <div className={`text-sm font-semibold ${textColor} mb-3`}>
            EMAIL VERIFICATION REQUIRED
          </div>
          <div className="text-gray-300 text-sm">
            <p>Please verify your email address in the Profile section to proceed with payment.</p>
          </div>
        </div>
      </div>
    );
  }

  // If email verified but not paid, show payment option
  if (!isPaid) {
    return (
      <div className="space-y-3">
        <div
          className={`p-4 border ${borderColor} bg-gradient-to-r ${gradientFrom} backdrop-blur-md transition-all duration-300`}
          style={{
            clipPath: "polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)",
            boxShadow,
          }}
        >
          <div className={`text-sm font-semibold ${textColor} mb-3`}>
            PAYMENT STATUS
          </div>
          <div className="text-gray-300 text-sm mb-4">
            <p className="mb-2">Registration payment is pending.</p>
            <p className="text-xs mb-2">Email verified ✓</p>
            <p className="text-xs">Please complete your payment to access all features.</p>
          </div>
          {message && (
            <div className={`mb-3 p-2 text-xs rounded ${message.type === 'success' ? 'bg-green-500/20 text-green-300 border border-green-500' : 'bg-red-500/20 text-red-300 border border-red-500'}`}>
              {message.text}
            </div>
          )}
          <button
            onClick={handlePayNow}
            disabled={paymentLoading}
            className={`w-full py-2 px-4 border-2 ${borderColor} ${textColor} hover:bg-opacity-20 transition-all disabled:opacity-50`}
            style={{ clipPath: "polygon(5% 0, 95% 0, 100% 25%, 100% 75%, 95% 100%, 5% 100%, 0 75%, 0 25%)" }}
          >
            {paymentLoading ? 'PROCESSING...' : 'PAY NOW'}
          </button>
        </div>
      </div>
    );
  }

  const paymentDate = paymentData.paymentDate 
    ? new Date(paymentData.paymentDate).toLocaleDateString('en-IN', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric'
      })
    : 'N/A';

  const paymentTime = paymentData.paymentDate 
    ? new Date(paymentData.paymentDate).toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit'
      })
    : 'N/A';

  return (
    <div className="flex flex-col h-full overflow-hidden content-center">
    <div className="overflow-y-auto space-y-4">
      {/* 🎫 Receipt Header */}
      <div
        className={`p-6 border-2 ${borderColor} bg-gradient-to-br ${gradientFrom} backdrop-blur-md transition-all duration-300 text-center`}
        style={{
          clipPath: "polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)",
          boxShadow: `0 0 30px ${glow}50, inset 0 0 20px ${glow}20`,
        }}
      >
        <div className={`text-2xl font-bold ${textColor} mb-2`} style={{ textShadow: `0 0 10px ${glow}` }}>
          OJASS 2026
        </div>
        <div className={`text-sm ${textColor} opacity-80 mb-1`}>
          Payment Receipt
        </div>
        <div className="text-xs text-gray-400">
          National Institute of Technology, Jamshedpur
        </div>
      </div>

      {/* 💳 Receipt Details Section */}
      <div
        className={`p-5 border ${borderColor} bg-gradient-to-r ${gradientFrom} backdrop-blur-md transition-all duration-300`}
        style={{
          clipPath: "polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)",
          boxShadow,
        }}
      >
        <div className={`text-sm font-semibold ${textColor} mb-4 uppercase tracking-wider`}>
          Receipt Details
        </div>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between items-center py-2 border-b border-opacity-20" style={{ borderColor: glow }}>
            <span className={`${textColor} font-medium`}>Receipt ID</span>
            <span className="text-gray-300 font-mono text-xs">{paymentData.orderId || 'N/A'}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-opacity-20" style={{ borderColor: glow }}>
            <span className={`${textColor} font-medium`}>Payment ID</span>
            <span className="text-gray-300 font-mono text-xs break-all text-right">{paymentData.razorpayPaymentId || 'N/A'}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-opacity-20" style={{ borderColor: glow }}>
            <span className={`${textColor} font-medium`}>Date</span>
            <span className="text-gray-300">{paymentDate}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-opacity-20" style={{ borderColor: glow }}>
            <span className={`${textColor} font-medium`}>Time</span>
            <span className="text-gray-300">{paymentTime}</span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className={`${textColor} font-medium`}>Status</span>
            <span className="text-green-400 font-bold flex items-center gap-1">
              <span>✓</span> Paid
            </span>
          </div>
        </div>
      </div>

      {/* 👤 User Information Section */}
      <div
        className={`p-5 border ${borderColor} bg-gradient-to-r ${gradientFrom} backdrop-blur-md transition-all duration-300`}
        style={{
          clipPath: "polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)",
          boxShadow,
        }}
      >
        <div className={`text-sm font-semibold ${textColor} mb-4 uppercase tracking-wider`}>
          User Information
        </div>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between items-center py-2 border-b border-opacity-20" style={{ borderColor: glow }}>
            <span className={`${textColor} font-medium`}>Name</span>
            <span className="text-gray-300 text-right">{userData?.name || 'N/A'}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-opacity-20" style={{ borderColor: glow }}>
            <span className={`${textColor} font-medium`}>OJASS ID</span>
            <span className="text-gray-300 font-mono">{userData?.ojassId || 'N/A'}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-opacity-20" style={{ borderColor: glow }}>
            <span className={`${textColor} font-medium`}>Email</span>
            <span className="text-gray-300 text-right text-xs break-all">{userData?.email || 'N/A'}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-opacity-20" style={{ borderColor: glow }}>
            <span className={`${textColor} font-medium`}>Phone</span>
            <span className="text-gray-300">{userData?.phone || 'N/A'}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-opacity-20" style={{ borderColor: glow }}>
            <span className={`${textColor} font-medium`}>College</span>
            <span className="text-gray-300 text-right">{userData?.college || 'N/A'}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-opacity-20" style={{ borderColor: glow }}>
            <span className={`${textColor} font-medium`}>City</span>
            <span className="text-gray-300">{userData?.city || 'N/A'}</span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className={`${textColor} font-medium`}>State</span>
            <span className="text-gray-300">{userData?.state || 'N/A'}</span>
          </div>
        </div>
      </div>

      {/* 💰 Payment Summary Section */}
      <div
        className={`p-5 border-2 ${borderColor} bg-gradient-to-r ${gradientFrom} backdrop-blur-md transition-all duration-300 relative overflow-hidden`}
        style={{
          clipPath: "polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)",
          boxShadow: `0 0 40px ${glow}60, inset 0 0 30px ${glow}25`,
          background: `linear-gradient(135deg, ${theme === 'utopia' ? 'rgba(0,255,255,0.2)' : 'rgba(204,119,34,0.2)'} 0%, ${theme === 'utopia' ? 'rgba(0,150,255,0.1)' : 'rgba(180,90,0,0.1)'} 100%)`,
        }}
      >
        <div className={`text-sm font-semibold ${textColor} mb-4 uppercase tracking-wider`}>
          Payment Summary
        </div>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className={`${textColor} font-medium text-base`}>Amount Paid</span>
            <span className={`${textColor} font-bold text-2xl`} style={{ textShadow: `0 0 10px ${glow}` }}>
              ₹{paymentData.paymentAmount?.toFixed(2) || '0.00'}
            </span>
          </div>
          <div className="flex items-center justify-end gap-2 mt-2">
            <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: `rgba(0,200,0,0.2)`, border: `2px solid rgba(0,200,0,0.5)` }}>
              <span className="text-green-400 text-xs font-bold">✓</span>
            </div>
            <span className="text-green-400 font-semibold">Payment Confirmed</span>
          </div>
        </div>
      </div>

      {/* ⚙️ Transaction Details Section */}
      <div
        className={`p-5 border ${borderColor} bg-gradient-to-r ${gradientFrom} backdrop-blur-md transition-all duration-300`}
        style={{
          clipPath: "polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)",
          boxShadow,
        }}
      >
        <div className={`text-sm font-semibold ${textColor} mb-4 uppercase tracking-wider`}>
          Transaction Details
        </div>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between items-center py-2 border-b border-opacity-20" style={{ borderColor: glow }}>
            <span className={`${textColor} font-medium`}>Payment Gateway</span>
            <span className="text-gray-300">Razorpay</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-opacity-20" style={{ borderColor: glow }}>
            <span className={`${textColor} font-medium`}>Payment Method</span>
            <span className="text-gray-300">Online</span>
          </div>
          <div className="flex justify-between items-start py-2">
            <span className={`${textColor} font-medium`}>Razorpay Order ID</span>
            <span className="text-gray-300 font-mono text-xs break-all text-right">{paymentData.razorpayOrderId || 'N/A'}</span>
          </div>
        </div>
      </div>

      {/* 📄 Footer Note */}
      <div className={`p-4 border ${borderColor} bg-gradient-to-r ${gradientFrom} backdrop-blur-md transition-all duration-300 text-center`}
        style={{
          clipPath: "polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)",
          boxShadow,
        }}
      >
        <p className="text-xs text-gray-400 italic mb-2">
          This is a system generated receipt.
        </p>
        <p className={`text-xs ${textColor} opacity-70`}>
          Thank you for your registration!
        </p>
      </div>
    </div>
    {/* Download Receipt Button */}
      <div className="mt-7 text-center ">
  <button
    onClick={handleDownloadReceipt}
    className="relative border-2 px-8 py-1 font-bold text-lg transition-all overflow-hidden group
               border-cyan-400 text-cyan-400 disabled:opacity-50"
    style={{
      boxShadow: '0 0 30px rgba(34, 211, 238, 0.4)',
      clipPath: 'polygon(10% 0, 90% 0, 100% 50%, 90% 100%, 10% 100%, 0 50%)',
    }}
  >
    <div className="absolute inset-0 bg-cyan-400/0 group-hover:bg-cyan-400 transition-all duration-300"></div>

    <span className="relative group-hover:text-slate-900 transition-colors duration-300 drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]">
      DOWNLOAD RECEIPT (PDF)
    </span>
  </button>
</div>

      </div>


  );
}
