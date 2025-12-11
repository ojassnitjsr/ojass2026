# Push Notification Setup Guide

This guide explains how to set up push notifications for the OJASS application.

## Prerequisites

1. Install the `web-push` package (already added to package.json)
2. Generate VAPID keys for push notifications

## Generating VAPID Keys

VAPID (Voluntary Application Server Identification) keys are required for web push notifications. Generate them using:

```bash
npx web-push generate-vapid-keys
```

This will output:
- **Public Key**: Add this to your `.env` file as `NEXT_PUBLIC_VAPID_PUBLIC_KEY`
- **Private Key**: Add this to your `.env` file as `VAPID_PRIVATE_KEY`

## Environment Variables

Add these to your `.env` file:

```env
# VAPID Keys for Push Notifications
NEXT_PUBLIC_VAPID_PUBLIC_KEY=your_public_key_here
VAPID_PRIVATE_KEY=your_private_key_here
VAPID_SUBJECT=mailto:support@ojass.in
```

## How It Works

### User Side (Frontend)
1. User visits the dashboard and opens the Notifications tab
2. System requests notification permission
3. If granted, service worker is registered
4. User subscribes to push notifications
5. Subscription is saved to the database

### Admin Side (Backend)
1. Admin creates a notification via `/api/admin/notification`
2. System:
   - Creates notification record in database
   - Creates UserNotification records for all users
   - Sends push notifications to all subscribed users
3. Users receive push notifications even when the browser is closed

### User Dashboard
1. Users can view all their notifications in the dashboard
2. Notifications are marked as read when clicked
3. Unread notifications are highlighted

## API Endpoints

### User Endpoints
- `POST /api/notifications/subscribe` - Save push subscription
- `GET /api/notifications` - Get user's notifications
- `PUT /api/notifications/[id]/read` - Mark notification as read

### Admin Endpoints
- `POST /api/admin/notification` - Create and send notification
  ```json
  {
    "title": "Notification Title",
    "description": "Notification description",
    "recipientIds": [] // Optional: specific user IDs, or omit to send to all
  }
  ```

## Service Worker

The service worker (`/public/sw.js`) handles:
- Receiving push notifications
- Displaying notifications
- Handling notification clicks

## Testing

1. Start your development server
2. Login as a user
3. Go to Dashboard > Notifications tab
4. Click "Enable Notifications"
5. Allow notification permission
6. Test by sending a notification from admin panel

## Troubleshooting

- **Permission denied**: User needs to manually allow notifications in browser settings
- **VAPID key errors**: Ensure keys are correctly set in environment variables
- **Service worker not registering**: Check browser console for errors
- **Notifications not received**: Verify service worker is active and subscription is saved

