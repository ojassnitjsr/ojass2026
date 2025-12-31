"use client";

import { useTheme } from "@/contexts/ThemeContext";
import clsx from "clsx";
import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import {
    FaArrowLeft,
    FaCube,
    FaFileContract,
    FaFingerprint,
    FaGavel,
    FaGlobeAmericas,
} from "react-icons/fa";

// --- Theme Utilities ---
const usePolicyThemeClasses = () => {
    const { theme } = useTheme();

    return useMemo(() => {
        const isUtopia = theme === "utopia";
        return {
            isUtopia,
            baseText: isUtopia ? "text-cyan-100" : "text-amber-50",
            mutedText: isUtopia ? "text-cyan-400/60" : "text-amber-400/60",
            primaryColor: isUtopia ? "text-cyan-400" : "text-amber-500",
            borderColor: isUtopia ? "border-cyan-500/30" : "border-amber-500/30",
            glassBg: isUtopia ? "bg-cyan-950/20" : "bg-amber-950/20",
            glassBorder: isUtopia ? "border-cyan-500/20" : "border-amber-500/20",
            accentBg: isUtopia ? "bg-cyan-500" : "bg-amber-600",
            accentGlow: isUtopia
                ? "shadow-[0_0_20px_rgba(6,182,212,0.4)]"
                : "shadow-[0_0_20px_rgba(245,158,11,0.4)]",
            scanline: isUtopia
                ? "bg-gradient-to-b from-transparent via-cyan-500/10 to-transparent"
                : "bg-gradient-to-b from-transparent via-amber-500/10 to-transparent",
        };
    }, [theme]);
};

// --- Data ---
const POLICIES = [
    {
        id: "terms",
        icon: <FaGavel />,
        title: "Terms and Conditions",
        code: "PROTO_001",
        content: (
            <div className="space-y-6">
                <p>
                    These Terms and Conditions outline the rules and guidelines for participation, access, and conduct during OJASS, the official technical fest of NIT Jamshedpur. By using our website, registering for events, or attending the fest, you agree to abide by the terms set forth below. Please read them carefully before proceeding.
                </p>

                <div>
                    <h3 className="font-bold text-xl mb-2 text-white">1. Definitions</h3>
                    <div className="pl-4 border-l-2 border-white/10 space-y-2">
                        <p><strong className="text-white">OJASS Services:</strong> Refers to the activities, events, workshops, exhibitions, and other initiatives organized during the fest, whether online or offline.</p>
                        <p><strong className="text-white">Visitor:</strong> Any individual attending OJASS events without registering for competitions or activities.</p>
                        <p><strong className="text-white">Participant:</strong> Any individual registered to compete or participate in OJASS activities, events, or workshops.</p>
                        <p><strong className="text-white">Organizer:</strong> Refers to the OJASS team, including coordinators, volunteers, and staff managing the fest.</p>
                    </div>
                </div>

                <div>
                    <h3 className="font-bold text-xl mb-2 text-white">2. Eligibility</h3>
                    <ul className="list-disc pl-5 space-y-2 marker:text-white/50">
                        <li>Participation in most events is open to current undergraduate or postgraduate students.</li>
                        <li>High school students may attend or participate with written consent from a parent or guardian.</li>
                        <li>Professionals or non-students may register for events explicitly designated as open to all.</li>
                    </ul>
                </div>

                <div>
                    <h3 className="font-bold text-xl mb-2 text-white">3. Services Provided</h3>
                    <p className="mb-2">OJASS offers opportunities for participation in various activities, including:</p>
                    <div className="pl-4 border-l-2 border-white/10 space-y-2">
                        <p><strong className="text-white">Competitions and Events:</strong> A wide range of technical, cultural, and skill-based competitions for registered participants.</p>
                        <p><strong className="text-white">Workshops and Seminars:</strong> Pre-scheduled workshops requiring prior registration and limited seats.</p>
                        <p><strong className="text-white">Exhibitions:</strong> Showcases of technology and innovation open to all attendees.</p>
                        <p><strong className="text-white">Accommodation:</strong> Limited temporary accommodation for outstation participants.</p>
                        <p><strong className="text-white">Prize Distribution:</strong> Prizes for winners as per event-specific criteria.</p>
                    </div>
                </div>

                <div>
                    <h3 className="font-bold text-xl mb-2 text-white">4. Prohibited Activities</h3>
                    <ul className="list-disc pl-5 space-y-2 marker:text-white/50">
                        <li>Using the service for any illegal purpose</li>
                        <li>Attempting to interfere with the proper functioning of the service</li>
                        <li>Bypassing any security features of the service</li>
                        <li>Sharing account credentials with third parties</li>
                    </ul>
                </div>

                <div>
                    <h3 className="font-bold text-xl mb-2 text-white">5. Intellectual Property</h3>
                    <p>The Service and its original content, features, and functionality are owned by OJASS and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.</p>
                </div>

                <div>
                    <h3 className="font-bold text-xl mb-2 text-white">6. Termination</h3>
                    <p>We may terminate or suspend your account and access to the Service immediately, without prior notice, for any reason, including breach of these Terms.</p>
                </div>

                <div>
                    <h3 className="font-bold text-xl mb-2 text-white">7. Limitation of Liability</h3>
                    <p>In no event shall OJASS be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or relating to your use of the Service.</p>
                </div>

                <div>
                    <h3 className="font-bold text-xl mb-2 text-white">8. Changes to Terms</h3>
                    <p>We reserve the right to modify or replace these Terms at any time. We will provide notice of any changes by posting the new Terms on this page.</p>
                </div>

                <div>
                    <h3 className="font-bold text-xl mb-2 text-white">Information Disclosure</h3>
                    <p>To the extent required or permitted by law, OJASS may also collect, use and disclose personal information in connection with security related or law enforcement investigations or in the course of cooperating with authorities or complying with legal requirements.</p>
                </div>

                <div>
                    <h3 className="font-bold text-xl mb-2 text-white">9. Contact Information</h3>
                    <div className="pl-4 border-l-2 border-white/10 space-y-1">
                        <p>For queries or concerns, reach out to the OJASS team at:</p>
                        <p><strong className="text-white">Email:</strong> ojass@nitjsr.ac.in</p>
                        <p><strong className="text-white">Phone:</strong> 83406 71871</p>
                        <p><strong className="text-white">Location:</strong> NIT Jamshedpur, Adityapur, Jamshedpur, Jharkhand - 831014</p>
                    </div>
                </div>

                <div className="opacity-50 text-sm border-t border-white/10 pt-4 mt-8">
                    Last updated: 17th December 2024
                </div>
            </div>
        ),
    },
    {
        id: "privacy",
        icon: <FaFingerprint />,
        title: "Privacy Policy",
        code: "DATA_SEC",
        content: (
            <div className="space-y-6">
                <p>
                    Thank you for visiting the official website of OJASS 2026. This Privacy Policy is designed to help you understand how we collect, use, disclose, and safeguard your personal information. By accessing or using our website, you consent to the practices described in this Privacy Policy.
                </p>

                <div>
                    <h3 className="font-bold text-xl mb-2 text-white">1. Information We Collect</h3>
                    <div className="pl-4 border-l-2 border-white/10 space-y-2">
                        <p><strong className="text-white">Personal Information:</strong> We may collect personal details such as your name, email address, contact number, and other relevant data when you register for events, purchase tickets, or participate in activities.</p>
                        <p><strong className="text-white">Non-Personal Information:</strong> We may also collect non-personal information, including browser type, IP address, and device information, to improve user experience and enhance our services.</p>
                    </div>
                </div>

                <div>
                    <h3 className="font-bold text-xl mb-2 text-white">2. How We Use Your Information</h3>
                    <div className="pl-4 border-l-2 border-white/10 space-y-2">
                        <p><strong className="text-white">Event Registration:</strong> Your personal information is used to process event registrations, provide tickets, and communicate important updates related to OJASS 2026.</p>
                        <p><strong className="text-white">Communication:</strong> We may use your email address or contact number to send updates about upcoming events, promotions, and other relevant information. You can opt-out of these communications at any time.</p>
                        <p><strong className="text-white">Improvement of Services:</strong> Non-personal information is used to analyze website usage patterns, troubleshoot issues, and improve overall functionality and user experience.</p>
                    </div>
                </div>

                <div>
                    <h3 className="font-bold text-xl mb-2 text-white">3. Disclosure of Information</h3>
                    <div className="pl-4 border-l-2 border-white/10 space-y-2">
                        <p><strong className="text-white">Third-Party Service Providers:</strong> Your information may be shared with trusted third-party service providers, such as payment gateways, to facilitate transactions and deliver services.</p>
                        <p><strong className="text-white">Legal Requirements:</strong> We may disclose personal information if required by law or in response to valid legal requests such as court orders or subpoenas.</p>
                    </div>
                </div>

                <div>
                    <h3 className="font-bold text-xl mb-2 text-white">4. Security</h3>
                    <p>We take reasonable measures to protect your personal information from unauthorized access, disclosure, alteration, or destruction. However, no method of electronic storage or internet transmission is entirely secure, and we cannot guarantee absolute security.</p>
                </div>

                <div>
                    <h3 className="font-bold text-xl mb-2 text-white">5. Cookies</h3>
                    <p>Our website may use cookies to enhance your browsing experience. You can adjust your browser settings to disable cookies, though this may affect the functionality of the site.</p>
                </div>

                <div>
                    <h3 className="font-bold text-xl mb-2 text-white">6. Links to Third-Party Websites</h3>
                    <p>Our website may contain links to external websites. OJASS 2026 is not responsible for the privacy practices or content of these websites. We recommend reviewing their privacy policies before providing any personal information.</p>
                </div>

                <div>
                    <h3 className="font-bold text-xl mb-2 text-white">7. Changes to this Privacy Policy</h3>
                    <p>OJASS 2026 reserves the right to modify or update this Privacy Policy at any time. Changes will take effect immediately upon posting. We encourage you to review this policy periodically for updates.</p>
                </div>

                <div>
                    <h3 className="font-bold text-xl mb-2 text-white">8. Contact Us</h3>
                    <p>If you have any questions or concerns regarding this Privacy Policy, please contact us at <a href="mailto:ojass@nitjsr.ac.in" className="underline hover:text-white">ojass@nitjsr.ac.in</a></p>
                </div>

                <div className="opacity-50 text-sm border-t border-white/10 pt-4 mt-8">
                    By using the OJASS 2026 website, you agree to the terms outlined in this Privacy Policy.
                </div>
            </div>
        ),
    },
    {
        id: "shipping",
        icon: <FaCube />,
        title: "Shipping & Delivery",
        code: "LOGISTICS_OPS",
        content: (
            <div className="space-y-6">
                <p>
                    <strong>Shipping and Delivery Policy for OJASS</strong><br />
                    This policy outlines the methods and procedures for ticket distribution and payment for OJASS 2026 events.
                </p>

                <div>
                    <h3 className="font-bold text-xl mb-2 text-white">1. Ticket Distribution</h3>
                    <ul className="list-disc pl-5 space-y-2 marker:text-white/50">
                        <li>Tickets may be collected at the venue</li>
                        <li>Tickets may be sent electronically</li>
                        <li>Choice of delivery method may be provided based on event requirements</li>
                    </ul>
                </div>

                <div>
                    <h3 className="font-bold text-xl mb-2 text-white">2. Payment for Venue Tickets</h3>
                    <ul className="list-disc pl-5 space-y-2 marker:text-white/50">
                        <li>Payment can be made in advance via the OJASS platform</li>
                        <li>Payment may be accepted at the venue, as decided by the organizers</li>
                    </ul>
                </div>

                <div>
                    <h3 className="font-bold text-xl mb-2 text-white">3. Offline Ticketing</h3>
                    <ul className="list-disc pl-5 space-y-2 marker:text-white/50">
                        <li>Tickets may be distributed through retail partners (e.g., cafés)</li>
                        <li>Offline tickets will be available alongside online availability</li>
                    </ul>
                </div>

                <div>
                    <h3 className="font-bold text-xl mb-2 text-white">4. Ticket Formats</h3>
                    <ul className="list-disc pl-5 space-y-2 marker:text-white/50">
                        <li>Organizers can offer electronic tickets</li>
                        <li>Paper tickets may be provided</li>
                        <li>Both formats may be available based on convenience and requirements</li>
                    </ul>
                </div>

                <div className="mt-8 pt-4 border-t border-white/10 text-center font-medium opacity-80">
                    By purchasing a ticket, you agree to these policies as set by the OJASS organizers.
                </div>

                <div className="opacity-50 text-sm mt-2 text-center">
                    Last updated: 17th December 2024
                </div>
            </div>
        ),
    },
    {
        id: "refund",
        icon: <FaFileContract />,
        title: "Cancellation Policy",
        code: "TRANS_LOG",
        content: (
            <div className="space-y-6">
                <p>
                    <strong>OJASS Cancellation and Refund Policy</strong><br />
                    The following outlines the terms and conditions governing ticket cancellations and refunds for OJASS, the official technical fest of NIT Jamshedpur. By purchasing a ticket for OJASS, you agree to these policies.
                </p>

                <div>
                    <h3 className="font-bold text-xl mb-2 text-white">1. Ticket Pricing and Payment</h3>
                    <ul className="list-disc pl-5 space-y-2 marker:text-white/50">
                        <li>The price payable for tickets is as stated on our official website or registration portal at the time of purchase.</li>
                        <li>Payments are final, and once a ticket is purchased, no modifications to the ticket price will be entertained.</li>
                    </ul>
                </div>

                <div>
                    <h3 className="font-bold text-xl mb-2 text-white">2. Ticket Collection and Distribution</h3>
                    <div className="space-y-4">
                        <div>
                            <h4 className="text-white font-medium mb-1">Collection of Tickets:</h4>
                            <ul className="list-disc pl-5 space-y-1 marker:text-white/50">
                                <li>Tickets will typically be available for collection at a designated location before the event.</li>
                                <li>You must collect your ticket from the specified location and time, presenting valid proof of identity.</li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-white font-medium mb-1">Alternative Distribution Methods:</h4>
                            <ul className="list-disc pl-5 space-y-1 marker:text-white/50">
                                <li>In some cases, tickets may be distributed via email, post, or other methods.</li>
                                <li>Only the billing address or email address provided during purchase will be used for dispatch.</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div>
                    <h3 className="font-bold text-xl mb-2 text-white">3. Ticket Verification</h3>
                    <ul className="list-disc pl-5 space-y-2 marker:text-white/50">
                        <li>Upon receiving your ticket, check all details immediately.</li>
                        <li>Any errors must be reported to the OJASS team within two working days or before the event, whichever is sooner.</li>
                    </ul>
                </div>

                <div>
                    <h3 className="font-bold text-xl mb-2 text-white">4. Admission Rules</h3>
                    <p className="mb-2">The event organizers and venue authorities reserve the right to:</p>
                    <ol className="list-decimal pl-5 space-y-2 marker:text-white/50">
                        <li>Refuse admission to any individual without providing a refund.</li>
                        <li>Require latecomers to wait for a convenient break in the event for admission.</li>
                        <li>Deny re-admission to individuals who leave the venue during the event.</li>
                        <li>Request individuals causing disruptions to leave the event.</li>
                        <li>Make changes to advertised details, including speakers, event content, and schedules, up to and including the event day.</li>
                    </ol>
                </div>

                <div>
                    <h3 className="font-bold text-xl mb-2 text-white">5. Event Cancellation, Postponement, or Alteration</h3>
                    <div className="space-y-4">
                        <div>
                            <h4 className="text-white font-medium mb-1">Cancellation or Rescheduling:</h4>
                            <ul className="list-disc pl-5 space-y-1 marker:text-white/50">
                                <li>If an event is canceled or rescheduled, reasonable efforts will be made to notify ticket holders.</li>
                                <li>Notifications will be sent using the contact details provided during registration. However, we do not guarantee prior notification before the event date.</li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-white font-medium mb-1">Refund Policy:</h4>
                            <ul className="list-disc pl-5 space-y-1 marker:text-white/50">
                                <li>All ticket sales are final and non-refundable.</li>
                                <li>No refunds will be provided for cancellations, postponements, delays, or alterations to the event.</li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-white font-medium mb-1">Responsibility:</h4>
                            <ul className="list-disc pl-5 space-y-1 marker:text-white/50">
                                <li>OJASS organizers are not liable for any losses or damages arising from event cancellations, delays, or changes.</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div>
                    <h3 className="font-bold text-xl mb-2 text-white">6. Security and Conduct</h3>
                    <ol className="list-decimal pl-5 space-y-2 marker:text-white/50">
                        <li>Tickets are issued subject to the venue&apos;s and OJASS organizer&apos;s rules and regulations.</li>
                        <li>Breach of these rules or engaging in unacceptable behaviour (e.g., causing nuisance, damage, or injury) may result in ejection from the venue without a refund.</li>
                        <li>Security searches may be conducted at the venue to ensure the safety of attendees.</li>
                        <li>Lost or stolen tickets will not be replaced, and the organizers bear no responsibility for such incidents.</li>
                    </ol>
                </div>

                <div>
                    <h3 className="font-bold text-xl mb-2 text-white">7. Ticket Restrictions</h3>
                    <ol className="list-decimal pl-5 space-y-2 marker:text-white/50">
                        <li>Tickets may be restricted to a maximum number per individual, credit card, or household.</li>
                        <li>If tickets are purchased in excess of the allowed limit, the organizers reserve the right to cancel the excess tickets without prior notice.</li>
                    </ol>
                </div>

                <div>
                    <h3 className="font-bold text-xl mb-2 text-white">8. Data Sharing and Third-Party Services</h3>
                    <ol className="list-decimal pl-5 space-y-2 marker:text-white/50">
                        <li>By purchasing a ticket, you consent to your data being used for event-related communications.</li>
                        <li>If external services like Zapier are used for ticket processing, your data may be shared with such third parties.</li>
                        <li>OJASS organizers are not liable for how third-party services handle your data, and by agreeing to OJASS terms, you also agree to the respective terms of such services.</li>
                    </ol>
                </div>

                <div>
                    <h3 className="font-bold text-xl mb-2 text-white">9. Loss of Personal Property</h3>
                    <p>
                        The venue, OJASS organizers, and associated third parties accept no responsibility for the loss or theft of personal belongings during the event.
                    </p>
                </div>

                <div className="opacity-50 text-sm border-t border-white/10 pt-4 mt-8 text-center">
                    Last updated: 17th December 2024
                </div>
            </div>
        ),
    },
];

// --- Background Component ---
const CyberGridBackground = ({ isUtopia }: { isUtopia: boolean }) => {
    return (
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none bg-black">
            {/* Base Gradient */}
            <div className={clsx(
                "absolute inset-0 bg-gradient-to-br transition-colors duration-1000",
                isUtopia
                    ? "from-slate-900 via-cyan-950 to-black"
                    : "from-orange-950 via-red-950 to-black"
            )} />

            {/* Retro Grid Plane Bottom */}
            <div className={clsx(
                "absolute bottom-0 left-[-50%] right-[-50%] h-[50vh] origin-bottom transform perspective-[500px] rotate-x-60",
                "bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)]",
                "bg-[size:40px_40px] animate-grid-move"
            )} />

            {/* Retro Grid Plane Top (Inverted) */}
            <div className={clsx(
                "absolute top-0 left-[-50%] right-[-50%] h-[50vh] origin-top transform perspective-[500px] rotate-x-[-60deg]",
                "bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)]",
                "bg-[size:40px_40px] animate-grid-move-reverse"
            )} />

            {/* Floating Particles / Nodes */}
            <div className="absolute inset-0">
                {[...Array(15)].map((_, i) => (
                    <div
                        key={i}
                        className={clsx(
                            "absolute rounded-full opacity-20 blur-sm animate-float",
                            isUtopia ? "bg-cyan-400" : "bg-orange-500"
                        )}
                        style={{
                            width: Math.random() * 100 + 50 + "px",
                            height: Math.random() * 100 + 50 + "px",
                            left: Math.random() * 100 + "%",
                            top: Math.random() * 100 + "%",
                            animationDuration: Math.random() * 10 + 10 + "s",
                            animationDelay: Math.random() * 5 + "s",
                        }}
                    />
                ))}
            </div>

            {/* Vignette */}
            <div className="absolute inset-0 bg-radial-gradient from-transparent via-black/40 to-black/90" />
        </div>
    );
};

export default function PolicyPage() {
    const themeClasses = usePolicyThemeClasses();
    const activeIdState = useState(POLICIES[0].id);
    const activeId = activeIdState[0];
    const setActiveId = activeIdState[1];
    const [isTransitioning, setIsTransitioning] = useState(false);
    const contentRef = useRef<HTMLDivElement>(null);

    const activePolicy = POLICIES.find(p => p.id === activeId) || POLICIES[0];

    const handleSelectProtocol = (id: string) => {
        if (id === activeId) return;
        setIsTransitioning(true);
        setTimeout(() => {
            setActiveId(id);
            setIsTransitioning(false);
            if (contentRef.current) contentRef.current.scrollTop = 0;
        }, 300);
    };

    return (
        <div className={clsx("relative min-h-screen font-sans overflow-hidden selection:bg-white/20", themeClasses.baseText)}>
            <CyberGridBackground isUtopia={themeClasses.isUtopia} />

            {/* Main Interface Container */}
            <main className="relative z-10 flex flex-col h-screen max-h-screen p-4 md:p-8">

                {/* Top Navigation Bar */}
                <header className="flex items-center justify-between mb-4 md:mb-8 shrink-0">
                    <Link
                        href="/"
                        className={clsx(
                            "group flex items-center gap-3 px-4 py-2 md:px-5 border rounded-full transition-all duration-300",
                            "bg-black/40 backdrop-blur-md hover:bg-white/10",
                            themeClasses.borderColor,
                            themeClasses.primaryColor
                        )}>
                        <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
                        <span className="font-mono text-xs md:text-sm tracking-widest uppercase">Eject</span>
                    </Link>

                    <div className="hidden md:flex items-center gap-4">
                        <div className="text-right">
                            <div className="text-[10px] font-mono opacity-50 tracking-[0.2em] uppercase">System Status</div>
                            <div className={clsx("font-bold uppercase tracking-wider text-sm", themeClasses.primaryColor)}>
                                {themeClasses.isUtopia ? "Optimized" : "Corrupted"}
                            </div>
                        </div>
                        <div className={clsx("w-3 h-3 rounded-full animate-pulse", themeClasses.accentBg)} />
                    </div>
                </header>

                {/* Content Grid */}
                <div className="flex-1 flex flex-col lg:grid lg:grid-cols-12 gap-4 md:gap-6 min-h-0">

                    {/* Left Panel: Selector Deck */}
                    <div className="shrink-0 lg:col-span-4 flex flex-row lg:flex-col gap-3 overflow-x-auto lg:overflow-y-auto lg:overflow-x-visible pb-2 lg:pb-0 pr-0 lg:pr-2 custom-scrollbar">
                        <div className="hidden lg:block mb-4">
                            <h1 className="text-5xl font-black tracking-tighter uppercase opacity-90 leading-none">
                                Legal<br />
                                <span className={themeClasses.mutedText}>Protocols</span>
                            </h1>
                            <div className="h-1 w-20 mt-4 bg-current opacity-50" />
                        </div>

                        {POLICIES.map((item) => {
                            const isActive = activeId === item.id;
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => handleSelectProtocol(item.id)}
                                    className={clsx(
                                        "relative group p-4 md:p-6 text-left transition-all duration-300 border-b-4 lg:border-b-0 lg:border-l-4 overflow-hidden shrink-0 w-64 lg:w-full rounded-lg lg:rounded-none",
                                        isActive
                                            ? `bg-white/10 ${themeClasses.primaryColor} border-current`
                                            : `bg-black/20 hover:bg-white/5 border-transparent opacity-60 hover:opacity-100`
                                    )}
                                >
                                    <div className="flex items-center justify-between relative z-10">
                                        <div className="flex items-center gap-3 md:gap-4">
                                            <span className="text-lg md:text-xl">{item.icon}</span>
                                            <div>
                                                <div className="font-bold uppercase tracking-wide text-xs md:text-sm">{item.title}</div>
                                                <div className="font-mono text-[10px] opacity-50">{item.code}</div>
                                            </div>
                                        </div>
                                        {isActive && <FaGlobeAmericas className="hidden lg:block animate-spin-slow opacity-50" />}
                                    </div>

                                    {/* Background Sweep Effect */}
                                    <div className={clsx(
                                        "absolute inset-0 origin-left transition-transform duration-500 ease-out",
                                        themeClasses.accentBg,
                                        isActive ? "scale-x-0" : "scale-x-0 group-hover:scale-x-[0.02]"
                                    )} />
                                </button>
                            );
                        })}
                    </div>

                    {/* Right Panel: Data Reader */}
                    <div className="flex-1 lg:col-span-8 relative flex flex-col min-h-0">
                        {/* Termintal Header */}
                        <div className={clsx(
                            "h-10 md:h-12 flex items-center justify-between px-4 md:px-6 border-t border-x rounded-t-lg backdrop-blur-xl shrink-0",
                            themeClasses.glassBg,
                            themeClasses.glassBorder
                        )}>
                            <div className="flex gap-2">
                                <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-red-500/50" />
                                <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-yellow-500/50" />
                                <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-green-500/50" />
                            </div>
                            <div className="font-mono text-[10px] md:text-xs opacity-50 truncate ml-4">
                                READING: {activePolicy.code}
                            </div>
                        </div>

                        {/* Main Reader Content */}
                        <div
                            className={clsx(
                                "relative flex-1 border-b border-x rounded-b-lg overflow-hidden backdrop-blur-md",
                                themeClasses.glassBg,
                                themeClasses.glassBorder
                            )}
                        >
                            {/* Animated Scanline */}
                            <div className={clsx("absolute top-0 left-0 w-full h-1 z-20 animate-scan", themeClasses.scanline)} />
                            <div className="hidden md:block absolute top-0 bottom-0 left-8 w-[1px] bg-white/5 z-0" />

                            <div
                                ref={contentRef}
                                className={clsx(
                                    "absolute inset-0 p-6 md:p-12 overflow-y-auto custom-scrollbar transition-all duration-300",
                                    isTransitioning ? "opacity-0 translate-y-4 filter blur-sm" : "opacity-100 translate-y-0 filter blur-0"
                                )}
                            >
                                <div className="max-w-3xl mx-auto md:mx-0">
                                    <div className="flex flex-col md:flex-row md:items-end gap-2 md:gap-4 mb-6 md:mb-8">
                                        <h2 className={clsx("text-2xl md:text-3xl lg:text-4xl font-bold uppercase", themeClasses.primaryColor)}>
                                            {activePolicy.title}
                                        </h2>
                                        <span className="font-mono text-xs md:text-sm opacity-50 mb-1">/ v.2026.1</span>
                                    </div>

                                    <div className="prose prose-invert prose-sm md:prose-lg leading-loose font-light max-w-none">
                                        {activePolicy.content}
                                    </div>

                                    <div className="mt-12 md:mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between opacity-50 text-[10px] md:text-xs font-mono uppercase gap-2">
                                        <div> AUTH_SIG: 0x{Math.random().toString(16).slice(2, 10).toUpperCase()}</div>
                                        <div> END_ OF_FILE </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <style jsx global>{`
                @keyframes grid-move {
                    0% { transform: perspective(500px) rotateX(60deg) translateY(0); }
                    100% { transform: perspective(500px) rotateX(60deg) translateY(40px); }
                }
                 @keyframes grid-move-reverse {
                    0% { transform: perspective(500px) rotateX(-60deg) translateY(0); }
                    100% { transform: perspective(500px) rotateX(-60deg) translateY(-40px); }
                }
                @keyframes float {
                    0%, 100% { transform: translate(0, 0); }
                    50% { transform: translate(-20px, 20px); }
                }
                @keyframes scan {
                    0% { top: 0%; opacity: 0; }
                    10% { opacity: 1; }
                    90% { opacity: 1; }
                    100% { top: 100%; opacity: 0; }
                }
                .animate-grid-move {
                    animation: grid-move 2s linear infinite;
                }
                .animate-grid-move-reverse {
                    animation: grid-move-reverse 2s linear infinite;
                }
                .animate-float {
                    animation: float 10s ease-in-out infinite;
                }
                .animate-scan {
                    animation: scan 4s linear infinite;
                }
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.2);
                    border-radius: 4px;
                }
            `}</style>
        </div>
    );
}
