import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Team from '@/models/Team';
import { requireAdmin } from '@/lib/admin';
import { cookies } from 'next/headers';

/**
 * GET /api/admin/users/[userId]/registrations
 * Get all event registrations for a specific user
 * Requires: Admin authentication
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  await connectToDatabase();

  try {
    const cookieStore = cookies();
    const tokenCookie = (await cookieStore).get('admin_token');
    requireAdmin(tokenCookie?.value);

    const { userId } = await params;

    // Find all registrations where user is leader or member
    const registrations = await Team.find({
      $or: [
        { teamLeader: userId },
        { teamMembers: userId },
      ],
    })
      .populate('teamLeader', 'name email phone ojassId')
      .populate('teamMembers', 'name email phone ojassId')
      .populate('eventId', 'name teamSizeMin teamSizeMax isTeamEvent img description')
      .sort({ createdAt: -1 });

    return NextResponse.json(registrations);
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message },
      { status: err.message.includes('Unauthorized') ? 401 : 500 }
    );
  }
}

