import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import Team from '@/models/Team';
import { requireAdmin } from '@/lib/admin';
import { cookies } from 'next/headers';

/**
 * GET /api/admin/users
 * Get all users with pagination and filters
 * Requires: Admin authentication
 */
export async function GET(req: NextRequest) {
  await connectToDatabase();

  try {
    const cookieStore = cookies();
    const tokenCookie = (await cookieStore).get('admin_token');
    requireAdmin(tokenCookie?.value);

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const search = searchParams.get('search') || '';
    const paymentStatus = searchParams.get('paymentStatus') || 'all';
    const emailVerified = searchParams.get('emailVerified');

    // Build query
    const query: any = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { ojassId: { $regex: search, $options: 'i' } },
        { collegeName: { $regex: search, $options: 'i' } },
      ];
    }

    if (paymentStatus === 'paid') {
      query.isPaid = true;
    } else if (paymentStatus === 'unpaid') {
      query.isPaid = false;
    }

    if (emailVerified === 'true') {
      query.isEmailVerified = true;
    } else if (emailVerified === 'false') {
      query.isEmailVerified = false;
    }

    // Get total count
    const total = await User.countDocuments(query);

    // Get users
    const users = await User.find(query)
      .select('-password -emailOtp -emailOtpExpires -resetPasswordOtp -resetPasswordOtpExpires')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    // Get event counts for each user
    const userIds = users.map(u => u._id);
    const eventCounts = await Team.aggregate([
      {
        $match: {
          $or: [
            { teamLeader: { $in: userIds } },
            { teamMembers: { $in: userIds } },
          ],
        },
      },
      {
        $project: {
          eventId: 1,
          userIds: {
            $setUnion: [
              ['$teamLeader'],
              '$teamMembers',
            ],
          },
        },
      },
      {
        $unwind: '$userIds',
      },
      {
        $match: {
          userIds: { $in: userIds },
        },
      },
      {
        $group: {
          _id: '$userIds',
          eventCount: { $addToSet: '$eventId' },
        },
      },
      {
        $project: {
          userId: '$_id',
          eventCount: { $size: '$eventCount' },
        },
      },
    ]);

    // Create a map of userId to eventCount
    const eventCountMap = new Map(
      eventCounts.map((item: any) => [item.userId.toString(), item.eventCount])
    );

    // Add event count to each user
    const usersWithEventCount = users.map((user: any) => ({
      ...user.toObject(),
      eventCount: eventCountMap.get(user._id.toString()) || 0,
    }));

    return NextResponse.json({
      users: usersWithEventCount,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message },
      { status: err.message.includes('Unauthorized') ? 401 : 500 }
    );
  }
}

