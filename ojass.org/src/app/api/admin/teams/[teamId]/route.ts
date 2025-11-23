import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Team from '@/models/Team';
import { requireAdmin } from '@/lib/admin';
import { cookies } from 'next/headers';

/**
 * GET /api/admin/teams/[teamId]
 * Get team details
 * Requires: Admin authentication
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ teamId: string }> }
) {
  await connectToDatabase();

  try {
    const cookieStore = cookies();
    const tokenCookie = (await cookieStore).get('admin_token');
    requireAdmin(tokenCookie?.value);

    const { teamId } = await params;

    const team = await Team.findById(teamId)
      .populate('teamLeader', 'name email phone ojassId isPaid collegeName')
      .populate('teamMembers', 'name email phone ojassId isPaid collegeName')
      .populate('eventId', 'name teamSizeMin teamSizeMax isTeamEvent img description');

    if (!team) {
      return NextResponse.json({ error: 'Team not found' }, { status: 404 });
    }

    return NextResponse.json(team);
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message },
      { status: err.message.includes('Unauthorized') ? 401 : 500 }
    );
  }
}

/**
 * DELETE /api/admin/teams/[teamId]
 * Delete team
 * Requires: Admin authentication
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ teamId: string }> }
) {
  await connectToDatabase();

  try {
    const cookieStore = cookies();
    const tokenCookie = (await cookieStore).get('admin_token');
    requireAdmin(tokenCookie?.value);

    const { teamId } = await params;

    const team = await Team.findByIdAndDelete(teamId);

    if (!team) {
      return NextResponse.json({ error: 'Team not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Team deleted successfully' });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message },
      { status: err.message.includes('Unauthorized') ? 401 : 500 }
    );
  }
}

