import CursorEffect from "@/components/cursor/CursorEffect";
import OverlayLayout from "@/components/OverlayLayout/Layout";
import { ThemeProvider } from "@/contexts/ThemeContext";
import type { Metadata } from "next";
import { headers } from "next/headers";
import Script from "next/script";
import { ReactNode } from "react";
import "./globals.css";

const metaDataDescription =
    "Join us for OJASS 2026, the premier annual techno-management festival featuring cutting-edge technology, innovation, and exciting competitions.";

export const metadata: Metadata = {
    title: {
        default: "OJASS 2026 | NIT Jamshedpur",
        template: "%s | OJASS 2026",
    },
    description: metaDataDescription,
    applicationName: "OJASS 2026",
    authors: [{ name: "OJASS Team", url: "https://ojass.org" }],
    generator: "Next.js",
    keywords: [
        "OJASS",
        "OJASS 2026",
        "NIT Jamshedpur",
        "Techno-management festival",
        "Technical festival",
        "Cultural festival",
        "Robotics",
        "Coding",
        "Workshops",
        "Events",
        "Competitions",
        "Engineering",
        "Technology",
        "Innovation",
    ],
    referrer: "origin-when-cross-origin",
    creator: "OJASS Web Team",
    publisher: "OJASS Team",
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
        },
    },
    openGraph: {
        type: "website",
        locale: "en_US",
        url: "https://ojass.org",
        title: "OJASS 2026 | NIT Jamshedpur",
        description: metaDataDescription,
        siteName: "OJASS 2026",
    },
    twitter: {
        card: "summary_large_image",
        title: "OJASS 2026 | NIT Jamshedpur",
        description: metaDataDescription,
        creator: "@ojass_nitjsr",
    },
    alternates: {
        canonical: "https://ojass.org",
    },
};

export default async function RootLayout({
    children,
}: Readonly<{
    children: ReactNode;
}>) {
    const headersList = await headers();
    const userAgent = headersList.get("user-agent") || "";
    const isMobile = Boolean(
        userAgent.match(
            /Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i,
        ),
    );

    return (
        <html lang="en" className="overflow-x-hidden">
            <body>
                <Script
                    src="https://www.googletagmanager.com/gtag/js?id=G-CST4WFC808"
                    strategy="afterInteractive"
                />
                <Script id="google-analytics" strategy="afterInteractive">
                    {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
            
              gtag('config', 'G-CST4WFC808');
            `}
                </Script>
                <ThemeProvider>
                    {children}
                    <OverlayLayout />
                    {!isMobile && <CursorEffect />}
                </ThemeProvider>
            </body>
        </html>
    );
}
