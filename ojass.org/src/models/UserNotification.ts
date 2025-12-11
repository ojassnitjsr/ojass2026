import mongoose, { Schema, Document, models } from "mongoose";

// Define TypeScript interface for UserNotification (tracks which users received which notifications)
export interface IUserNotification extends Document {
    userId: mongoose.Types.ObjectId;
    notificationId: mongoose.Types.ObjectId;
    isRead: boolean;
    readAt?: Date;
    createdAt?: Date;
    updatedAt?: Date;
}

// Define Mongoose schema
const UserNotificationSchema = new Schema<IUserNotification>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
        notificationId: {
            type: Schema.Types.ObjectId,
            ref: "Notification",
            required: true,
            index: true,
        },
        isRead: {
            type: Boolean,
            default: false,
        },
        readAt: {
            type: Date,
        },
    },
    { timestamps: true }
);

// Compound index to ensure one notification per user
UserNotificationSchema.index({ userId: 1, notificationId: 1 }, { unique: true });

// Avoid recompilation errors in Next.js (hot reload issue)
const UserNotification =
    models.UserNotification ||
    mongoose.model<IUserNotification>("UserNotification", UserNotificationSchema);

export default UserNotification;

