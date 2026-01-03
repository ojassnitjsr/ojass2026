import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Event from '@/models/Event'; // Import to register schema with Mongoose
import Team from '@/models/Team';
import { requireAuthAndPayment } from '@/lib/auth';

/**
 * POST /api/teams/[teamId]/leave
 * Leave a team
 * Requires: Authentication, Payment
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ teamId: string }> }
) {
  try {
    await connectToDatabase();
    const { teamId } = await params;

    // Verify authentication and payment
    const authResult = await requireAuthAndPayment(request);
    if (!authResult.success) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.error === 'Payment required to register for events' ? 402 : 401 }
      );
    }

    const team = await Team.findById(teamId);
    if (!team) {
      return NextResponse.json({ error: 'Team not found' }, { status: 404 });
    }

    // Check if user is the team leader
    if (team.teamLeader.toString() === authResult.userId) {
      return NextResponse.json(
        { error: 'Team leader cannot leave. Please delete the team or transfer leadership first.' },
        { status: 400 }
      );
    }

    // Check if user is a member
    const memberIndex = team.teamMembers.findIndex(
      (member: unknown) => (member as { toString: () => string }).toString() === authResult.userId
    );

    if (memberIndex === -1) {
      return NextResponse.json(
        { error: 'You are not a member of this team' },
        { status: 400 }
      );
    }

    // Remove user from team
    team.teamMembers.splice(memberIndex, 1);
    await team.save();

    return NextResponse.json({
      success: true,
      message: 'Successfully left the team',
    });
  } catch (error: unknown) {
    console.error('Error leaving team:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to leave team' },
      { status: 500 }
    );
  }
}

