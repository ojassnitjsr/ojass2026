import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Event from '@/models/Event'; // Import to register schema with Mongoose
import Team from '@/models/Team';
import { requireAuthAndPayment } from '@/lib/auth';

/**
 * DELETE /api/teams/[teamId]/members/[memberId]
 * Remove a member from team (only team leader can remove)
 * Requires: Authentication, Payment
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ teamId: string; memberId: string }> }
) {
  try {
    await connectToDatabase();
    const { teamId, memberId } = await params;

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
    if (team.teamLeader.toString() !== authResult.userId) {
      return NextResponse.json(
        { error: 'Only team leader can remove members' },
        { status: 403 }
      );
    }

    // Check if trying to remove the team leader
    if (team.teamLeader.toString() === memberId) {
      return NextResponse.json(
        { error: 'Cannot remove team leader' },
        { status: 400 }
      );
    }

    // Remove member
    team.teamMembers = team.teamMembers.filter(
      (member: unknown) => (member as { toString: () => string }).toString() !== memberId
    );
    await team.save();

    return NextResponse.json({
      success: true,
      message: 'Member removed successfully',
    });
  } catch (error: unknown) {
    console.error('Error removing member:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to remove member' },
      { status: 500 }
    );
  }
}

