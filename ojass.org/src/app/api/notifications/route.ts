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

// GET /api/notifications
// Get user's notifications
export async function GET(req: NextRequest) {
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

        // Get user's notifications
        const userNotifications = await UserNotification.find({ userId })
            .populate("notificationId")
            .sort({ createdAt: -1 })
            .limit(50);

        // Format response
        interface PopulatedNotification {
            _id: unknown;
            title: string;
            description: string;
            createdAt: Date;
        }
        const notifications = userNotifications.map((un) => ({
            id: un._id,
            notificationId: (un.notificationId as PopulatedNotification)._id,
            title: (un.notificationId as PopulatedNotification).title,
            description: (un.notificationId as PopulatedNotification).description,
            isRead: un.isRead,
            readAt: un.readAt,
            createdAt: (un.notificationId as PopulatedNotification).createdAt,
        }));

        return NextResponse.json({
            success: true,
            data: notifications,
        });
    } catch (error) {
        console.error("Error fetching notifications:", error);
        return NextResponse.json(
            { success: false, message: "Failed to fetch notifications" },
            { status: 500 }
        );
    }
}

