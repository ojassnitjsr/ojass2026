import { NextResponse, NextRequest } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";

// Define the expected JWT payload structure
interface AdminJwtPayload extends JwtPayload {
    role: string;
    userId?: string;
}

// Verifies admin_token and also checks if the role is "admin"
export function adminMiddleware(request: NextRequest) {
    try {
        const adminToken = request.cookies.get("admin_token")?.value;

        if (!adminToken) {
            return NextResponse.json(
                { error: "Authentication token not found" },
                { status: 401 }
            );
        }

        if (!process.env.JWT_SECRET) {
            console.error("JWT_SECRET is not configured");
            return NextResponse.json(
                { error: "Server configuration error" },
                { status: 500 }
            );
        }

        const decoded = jwt.verify(adminToken, process.env.JWT_SECRET);

        // Type guard to check if decoded is an object with a role property
        if (typeof decoded === 'string' || !decoded || typeof decoded.role !== 'string') {
            return NextResponse.json(
                { error: "Invalid token format" },
                { status: 401 }
            );
        }

        // Now TypeScript knows decoded has a role property
        const payload = decoded as AdminJwtPayload;

        if (payload.role !== 'admin') {
            return NextResponse.json(
                { error: "Only admins can access this route!" },
                { status: 401 }
            );
        }
        const response = NextResponse.next();

        response.headers.set("x-admin-data", JSON.stringify(payload));

        return response;

    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            return NextResponse.json(
                { error: "Invalid token" },
                { status: 401 }
            );
        }

        if (error instanceof jwt.TokenExpiredError) {
            return NextResponse.json(
                { error: "Token expired" },
                { status: 401 }
            );
        }

        console.error("Middleware error:", error);

        return NextResponse.json(
            { error: "Authentication failed" },
            { status: 500 }
        );
    }
}