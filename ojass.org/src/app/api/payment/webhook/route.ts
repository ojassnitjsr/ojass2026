import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import { getPricingForUser } from '@/utils/pricing.util';

/**
 * POST /api/payment/webhook
 * Handle Razorpay webhook events
 * This endpoint is called by Razorpay when payment events occur
 */
export async function POST(request: NextRequest) {
    try {
        // Get webhook secret
        const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

        if (!webhookSecret) {
            console.error('RAZORPAY_WEBHOOK_SECRET not configured');
            return NextResponse.json(
                { error: 'Webhook secret not configured' },
                { status: 500 }
            );
        }

        // Get signature from headers
        const signature = request.headers.get('x-razorpay-signature');

        if (!signature) {
            console.error('Webhook signature missing');
            return NextResponse.json(
                { error: 'Webhook signature missing' },
                { status: 400 }
            );
        }

        // Get raw body
        const body = await request.text();

        // Verify webhook signature
        const expectedSignature = crypto
            .createHmac('sha256', webhookSecret)
            .update(body)
            .digest('hex');

        if (signature !== expectedSignature) {
            console.error('Invalid webhook signature');
            return NextResponse.json(
                { error: 'Invalid webhook signature' },
                { status: 400 }
            );
        }

        // Parse the webhook payload
        const payload = JSON.parse(body);
        const event = payload.event;

        console.log('\n🔵 WEBHOOK EVENT:', event);
        console.log('📅 Timestamp:', new Date().toISOString());
        console.log('📦 Payload Data:', JSON.stringify(payload.payload || {}, null, 2));
        console.log('----------------------------------------\n');

        // Handle payment.authorized event
        if (event === 'payment.authorized' || event === 'payment.captured') {
            const payment = payload.payload.payment.entity;
            const orderId = payment.order_id;
            const paymentId = payment.id;

            console.log(`✅ Processing Payment: Order=${orderId}, Payment=${paymentId}`);

            // Connect to database
            await connectToDatabase();

            // Find user by order ID
            const user = await User.findOne({ razorpayOrderId: orderId });

            if (!user) {
                console.error('User not found for order:', orderId);
                return NextResponse.json(
                    { error: 'User not found' },
                    { status: 404 }
                );
            }

            // Check if payment is already marked as paid
            if (user.isPaid) {
                console.log('Payment already marked as paid for user:', user._id);
                return NextResponse.json(
                    { success: true, message: 'Payment already recorded' },
                    { status: 200 }
                );
            }

            // Get pricing info
            const pricing = getPricingForUser(user.email);

            // Update user payment status
            user.isPaid = true;
            user.razorpayPaymentId = paymentId;
            user.paymentAmount = pricing.amount;
            user.paymentDate = new Date();
            await user.save();

            console.log('Payment status updated for user:', user._id);

            return NextResponse.json(
                { success: true, message: 'Payment recorded successfully' },
                { status: 200 }
            );
        }

        // Handle payment.failed event
        if (event === 'payment.failed') {
            const payment = payload.payload.payment.entity;
            const orderId = payment.order_id;
            const paymentId = payment.id;
            const errorDescription = payment.error_description;

            console.log('Payment failed:', { orderId, paymentId, errorDescription });

            // You can add additional logging or notification logic here

            return NextResponse.json(
                { success: true, message: 'Payment failure recorded' },
                { status: 200 }
            );
        }

        // For other events, just acknowledge receipt
        return NextResponse.json(
            { success: true, message: 'Webhook received' },
            { status: 200 }
        );

    } catch (error: unknown) {
        console.error('Webhook processing error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json(
            {
                error: 'Failed to process webhook',
                details: errorMessage
            },
            { status: 500 }
        );
    }
}

