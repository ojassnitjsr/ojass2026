import mongoose, { Schema, Document, models } from "mongoose";

// Define TypeScript interface for Notification
export interface INotification extends Document {
    title: string;
    description: string;
    recipients?: mongoose.Types.ObjectId[]; // Users who should receive this notification
    createdAt?: Date;
    updatedAt?: Date;
}

// Define Mongoose schema
const NotificationSchema = new Schema<INotification>(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
            trim: true,
        },
        recipients: [{
            type: Schema.Types.ObjectId,
            ref: "User",
        }],
    },
    { timestamps: true }, // auto adds createdAt and updatedAt
);

// Avoid recompilation errors in Next.js (hot reload issue)
const Notification =
    models.Notification ||
    mongoose.model<INotification>("Notification", NotificationSchema);

export default Notification;
