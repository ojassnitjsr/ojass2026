import webpush from "web-push";
import PushSubscription from "@/models/PushSubscription";

// Configure web-push with VAPID keys
// These should be set in environment variables
const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || "";
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY || "";
const VAPID_SUBJECT = process.env.VAPID_SUBJECT || "mailto:support@ojass.in";

if (VAPID_PUBLIC_KEY && VAPID_PRIVATE_KEY) {
    webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);
}

/**
 * Send push notification to a single subscription
 */
export async function sendPushNotification(
    subscription: {
        endpoint: string;
        keys: {
            p256dh: string;
            auth: string;
        };
    },
    payload: {
        title: string;
        body: string;
        icon?: string;
        badge?: string;
        data?: any;
    }
): Promise<boolean> {
    try {
        const notificationPayload = JSON.stringify({
            title: payload.title,
            body: payload.body,
            icon: payload.icon || "/logo.svg",
            badge: payload.badge || "/logo.svg",
            data: payload.data || {},
        });

        await webpush.sendNotification(
            {
                endpoint: subscription.endpoint,
                keys: {
                    p256dh: subscription.keys.p256dh,
                    auth: subscription.keys.auth,
                },
            },
            notificationPayload
        );

        return true;
    } catch (error: any) {
        console.error("Error sending push notification:", error);
        // If subscription is invalid, we might want to delete it
        if (error.statusCode === 410 || error.statusCode === 404) {
            // Subscription expired or not found
            try {
                await PushSubscription.findOneAndDelete({
                    endpoint: subscription.endpoint,
                });
            } catch (deleteError) {
                console.error("Error deleting invalid subscription:", deleteError);
            }
        }
        return false;
    }
}

/**
 * Send push notification to all users
 */
export async function sendPushNotificationToAll(
    payload: {
        title: string;
        body: string;
        icon?: string;
        badge?: string;
        data?: any;
    }
): Promise<{ sent: number; failed: number }> {
    try {
        const subscriptions = await PushSubscription.find({});

        let sent = 0;
        let failed = 0;

        // Send notifications in parallel (with limit to avoid overwhelming)
        const batchSize = 100;
        for (let i = 0; i < subscriptions.length; i += batchSize) {
            const batch = subscriptions.slice(i, i + batchSize);
            const results = await Promise.allSettled(
                batch.map((sub) =>
                    sendPushNotification(
                        {
                            endpoint: sub.endpoint,
                            keys: sub.keys,
                        },
                        payload
                    )
                )
            );

            results.forEach((result) => {
                if (result.status === "fulfilled" && result.value) {
                    sent++;
                } else {
                    failed++;
                }
            });
        }

        return { sent, failed };
    } catch (error) {
        console.error("Error sending push notifications to all:", error);
        return { sent: 0, failed: 0 };
    }
}

