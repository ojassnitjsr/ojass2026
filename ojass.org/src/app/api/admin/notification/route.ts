import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import Notification from "@/models/Notification";
import UserNotification from "@/models/UserNotification";
import User from "@/models/User";
import { sendPushNotificationToAll } from "@/utils/pushNotification.util";

// ✅ Connect to MongoDB using MONGODB_URI from .env
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

// ✅ POST /api/admin/notification
// Creates a new notification, stores it for all users, and sends push notifications
export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const body = await req.json();
        const { title, description, recipientIds } = body; // recipientIds is optional - if not provided, send to all users

        if (!title || !description) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Title and description are required",
                },
                { status: 400 },
            );
        }

        // Create notification in DB
        const notification = await Notification.create({
            title,
            description,
            recipients: recipientIds || [], // Store recipient IDs if specified
        });

        // Get all users (or specific recipients)
        let users;
        if (recipientIds && recipientIds.length > 0) {
            users = await User.find({ _id: { $in: recipientIds } });
        } else {
            users = await User.find({});
        }

        // Create UserNotification records for all users
        const userNotifications = users.map((user) => ({
            userId: user._id,
            notificationId: notification._id,
            isRead: false,
        }));

        await UserNotification.insertMany(userNotifications);

        // Send push notifications to all subscribed users
        const pushResult = await sendPushNotificationToAll({
            title,
            body: description,
            icon: "/logo.svg",
            badge: "/logo.svg",
            data: {
                notificationId: notification._id.toString(),
                url: "/dashboard",
            },
        });

        return NextResponse.json(
            {
                success: true,
                message: "Notification created and sent successfully",
                data: {
                    notification,
                    recipients: users.length,
                    pushNotifications: {
                        sent: pushResult.sent,
                        failed: pushResult.failed,
                    },
                },
            },
            { status: 201 },
        );
    } catch (error) {
        console.error("Error creating notification:", error);
        return NextResponse.json(
            { success: false, message: "Failed to create notification" },
            { status: 500 },
        );
    }
}

// ✅ GET /api/admin/notification
// Fetch all notifications
export async function GET() {
    try {
        await connectDB();

        const notifications = await Notification.find().sort({ createdAt: -1 });


        return NextResponse.json({
            success: true,
            data: notifications,
        });
    } catch (error) {
        console.error("Error fetching notifications:", error);
        return NextResponse.json(
            { success: false, message: "Failed to fetch notifications" },
            { status: 500 },
        );
    }
}
