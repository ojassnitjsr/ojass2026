import mongoose, { Schema, Document, models } from "mongoose";

// Define TypeScript interface for PushSubscription
export interface IPushSubscription extends Document {
    userId: mongoose.Types.ObjectId;
    endpoint: string;
    keys: {
        p256dh: string;
        auth: string;
    };
    createdAt?: Date;
    updatedAt?: Date;
}

// Define Mongoose schema
const PushSubscriptionSchema = new Schema<IPushSubscription>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
        endpoint: {
            type: String,
            required: true,
            unique: true,
        },
        keys: {
            p256dh: {
                type: String,
                required: true,
            },
            auth: {
                type: String,
                required: true,
            },
        },
    },
    { timestamps: true }
);

// Avoid recompilation errors in Next.js (hot reload issue)
const PushSubscription =
    models.PushSubscription ||
    mongoose.model<IPushSubscription>("PushSubscription", PushSubscriptionSchema);

export default PushSubscription;

