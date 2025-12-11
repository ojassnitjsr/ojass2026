import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import PushSubscription from "@/models/PushSubscription";
import jwt from "jsonwebtoken";

// Connect to MongoDB
async function connectDB() {
    if (mongoose.connection.readyState >= 1) return;

    const uri = process.env.MONGODB_URI;
    if (!uri) {
        throw new Error("MONGODB_URI is not defined in environment variables");
    }
    try {
        await mongoose.connect(uri);
        console.log("✅ MongoDB Connected");
    } catch (error) {
        console.error("❌ MongoDB connection error:", error);
        throw new Error("Database connection failed");
    }
}

// POST /api/notifications/subscribe
// Save user's push notification subscription
export async function POST(req: NextRequest) {
    try {
        await connectDB();

        // Get token from header
        const authHeader = req.headers.get("authorization");
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }

        const token = authHeader.split(" ")[1];
        const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

        // Verify token and get user ID
        let decoded: any;
        try {
            decoded = jwt.verify(token, JWT_SECRET);
        } catch (error) {
            return NextResponse.json(
                { success: false, message: "Invalid token" },
                { status: 401 }
            );
        }

        const userId = decoded.userId || decoded.id;
        if (!userId) {
            return NextResponse.json(
                { success: false, message: "Invalid token payload" },
                { status: 401 }
            );
        }

        const body = await req.json();
        const { endpoint, keys } = body;

        if (!endpoint || !keys || !keys.p256dh || !keys.auth) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Endpoint and keys (p256dh, auth) are required",
                },
                { status: 400 }
            );
        }

        // Check if subscription already exists for this endpoint
        const existing = await PushSubscription.findOne({ endpoint });

        if (existing) {
            // Update existing subscription
            existing.userId = userId;
            existing.keys = keys;
            await existing.save();

            return NextResponse.json({
                success: true,
                message: "Subscription updated successfully",
                data: existing,
            });
        } else {
            // Create new subscription
            const subscription = await PushSubscription.create({
                userId,
                endpoint,
                keys,
            });

            return NextResponse.json({
                success: true,
                message: "Subscription saved successfully",
                data: subscription,
            });
        }
    } catch (error) {
        console.error("Error saving subscription:", error);
        return NextResponse.json(
            { success: false, message: "Failed to save subscription" },
            { status: 500 }
        );
    }
}

