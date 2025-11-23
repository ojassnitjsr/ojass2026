import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import Team from '@/models/Team';
import Event from '@/models/Event';
import { requireAdmin } from '@/lib/admin';
import { cookies } from 'next/headers';

/**
 * GET /api/admin/stats
 * Get overall statistics
 * Requires: Admin authentication
 */
export async function GET(req: NextRequest) {
  await connectToDatabase();

  try {
    const cookieStore = cookies();
    const tokenCookie = (await cookieStore).get('admin_token');
    requireAdmin(tokenCookie?.value);

    // Get user statistics
    const totalUsers = await User.countDocuments();
    const paidUsers = await User.countDocuments({ isPaid: true });
    const unpaidUsers = await User.countDocuments({ isPaid: false });
    const emailVerifiedUsers = await User.countDocuments({ isEmailVerified: true });
    const nitJsrUsers = await User.countDocuments({ isNitJsrStudent: true });

    // Get team/registration statistics
    const totalTeams = await Team.countDocuments();
    const individualRegistrations = await Team.countDocuments({ isIndividual: true });
    const teamRegistrations = await Team.countDocuments({ isIndividual: false });

    // Get event statistics
    const totalEvents = await Event.countDocuments();
    const teamEvents = await Event.countDocuments({ isTeamEvent: true });
    const individualEvents = await Event.countDocuments({ isTeamEvent: false });

    // Get registrations per event
    const registrationsByEvent = await Team.aggregate([
      {
        $group: {
          _id: '$eventId',
          count: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: 'events',
          localField: '_id',
          foreignField: '_id',
          as: 'event',
        },
      },
      {
        $unwind: {
          path: '$event',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          eventId: '$_id',
          eventName: '$event.name',
          registrations: '$count',
        },
      },
      {
        $sort: { registrations: -1 },
      },
    ]);

    // Get payment statistics
    const paymentStats = await User.aggregate([
      {
        $group: {
          _id: null,
          totalAmount: { $sum: '$paymentAmount' },
          averageAmount: { $avg: '$paymentAmount' },
        },
      },
    ]);

    // Get referral statistics
    const referralStats = await User.aggregate([
      {
        $group: {
          _id: null,
          totalReferrals: { $sum: '$referralCount' },
          usersWithReferrals: {
            $sum: {
              $cond: [{ $gt: ['$referralCount', 0] }, 1, 0],
            },
          },
        },
      },
    ]);

    return NextResponse.json({
      users: {
        total: totalUsers,
        paid: paidUsers,
        unpaid: unpaidUsers,
        emailVerified: emailVerifiedUsers,
        nitJsr: nitJsrUsers,
      },
      teams: {
        total: totalTeams,
        individual: individualRegistrations,
        team: teamRegistrations,
      },
      events: {
        total: totalEvents,
        teamEvents,
        individualEvents,
      },
      registrationsByEvent,
      payments: {
        totalAmount: paymentStats[0]?.totalAmount || 0,
        averageAmount: paymentStats[0]?.averageAmount || 0,
      },
      referrals: {
        totalReferrals: referralStats[0]?.totalReferrals || 0,
        usersWithReferrals: referralStats[0]?.usersWithReferrals || 0,
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message },
      { status: err.message.includes('Unauthorized') ? 401 : 500 }
    );
  }
}

