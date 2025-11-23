import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const response = NextResponse.json({
        success: true,
        message: "Logged out successfully",
    });

    const isProduction = process.env.NODE_ENV === "production";
    const origin = req.headers.get('origin');
    const isLocalhost = origin && (origin.includes('localhost') || origin.includes('127.0.0.1'));
    const requestUrl = `${req.nextUrl.protocol}//${req.nextUrl.host}`;
    const isCrossOrigin = origin && origin !== requestUrl;

    let sameSite: "strict" | "lax" | "none" = "lax";
    let secure: boolean = isProduction;
    let domain: string | undefined = undefined;

    // Handle ojass.org subdomains
    const host = req.headers.get('host') || '';
    if (host.includes('ojass.org')) {
        domain = '.ojass.org';
        sameSite = "lax";
    } else if (isCrossOrigin) {
        sameSite = "none";
        secure = isProduction || (!!(isLocalhost) && !isProduction);
    }

    response.cookies.set({
        name: "admin_token",
        value: "",
        maxAge: 0, // delete cookie
        path: "/",
        httpOnly: true,
        secure: secure,
        sameSite: sameSite as "strict" | "lax" | "none",
        domain: domain,
    });

    return response;
}
