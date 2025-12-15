import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import UserNotification from "@/models/UserNotification";
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

// PUT /api/notifications/[id]/read
// Mark notification as read
export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
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
        let decoded: { userId?: string; id?: string };
        try {
            decoded = jwt.verify(token, JWT_SECRET) as { userId?: string; id?: string };
        } catch {
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

        const { id } = await params;

        // Update user notification
        const userNotification = await UserNotification.findOneAndUpdate(
            { _id: id, userId },
            { isRead: true, readAt: new Date() },
            { new: true }
        );

        if (!userNotification) {
            return NextResponse.json(
                { success: false, message: "Notification not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: "Notification marked as read",
            data: userNotification,
        });
    } catch (error) {
        console.error("Error marking notification as read:", error);
        return NextResponse.json(
            { success: false, message: "Failed to mark notification as read" },
            { status: 500 }
        );
    }
}

