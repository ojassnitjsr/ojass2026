import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Team from '@/models/Team';

import { requireAuthAndPayment } from '@/lib/auth';

/**
 * GET /api/teams/[teamId]
 * Get team details
 * Requires: Authentication
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ teamId: string }> }
) {
  try {
    await connectToDatabase();
    const { teamId } = await params;

    // Verify authentication
    const authResult = await requireAuthAndPayment(request);
    if (!authResult.success) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.error === 'Payment required to register for events' ? 402 : 401 }
      );
    }

    const team = await Team.findById(teamId)
      .populate('teamLeader', 'name email phone ojassId')
      .populate('teamMembers', 'name email phone ojassId')
      .populate('eventId', 'name teamSizeMin teamSizeMax isTeamEvent img description');

    if (!team) {
      return NextResponse.json({ error: 'Team not found' }, { status: 404 });
    }

    // Check if user is part of the team
    const isMember = team.teamLeader.toString() === authResult.userId ||
      team.teamMembers.some((member: unknown) => (member as { _id: { toString: () => string } })._id.toString() === authResult.userId);

    if (!isMember) {
      return NextResponse.json({ error: 'Unauthorized to view this team' }, { status: 403 });
    }

    return NextResponse.json(team);
  } catch (error: unknown) {
    console.error('Error fetching team:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch team' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/teams/[teamId]
 * Update team details (only team leader can update)
 * Requires: Authentication, Payment
 */
export async function PUT(
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
    if (team.teamLeader.toString() !== authResult.userId) {
      return NextResponse.json(
        { error: 'Only team leader can update team details' },
        { status: 403 }
      );
    }

    const { teamName } = await request.json();

    if (teamName) {
      team.teamName = teamName;
    }

    await team.save();

    await team.populate('teamLeader', 'name email phone ojassId');
    await team.populate('teamMembers', 'name email phone ojassId');
    await team.populate('eventId', 'name teamSizeMin teamSizeMax isTeamEvent');

    return NextResponse.json(team);
  } catch (error: unknown) {
    console.error('Error updating team:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update team' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/teams/[teamId]
 * Delete team (only team leader can delete)
 * When a team is deleted, all members (leader + teamMembers) are automatically unregistered from the event
 * because the Team document itself represents the event registration.
 * Requires: Authentication, Payment
 */
export async function DELETE(
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

    const team = await Team.findById(teamId)
      .populate('eventId', 'name');

    if (!team) {
      return NextResponse.json({ error: 'Team not found' }, { status: 404 });
    }

    // Check if user is the team leader
    if (team.teamLeader.toString() !== authResult.userId) {
      return NextResponse.json(
        { error: 'Only team leader can delete the team' },
        { status: 403 }
      );
    }

    // Store event info for response message
    const eventName = (team.eventId as unknown as { name?: string })?.name || 'the event';
    const memberCount = team.teamMembers.length;

    // Delete the team
    // This automatically unregisters all members (leader + teamMembers) from the event
    // because the Team document IS the registration record
    await Team.findByIdAndDelete(teamId);

    return NextResponse.json({
      success: true,
      message: `Team deleted successfully. All ${memberCount} member(s) including the leader have been unregistered from ${eventName}.`
    });
  } catch (error: unknown) {
    console.error('Error deleting team:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete team' },
      { status: 500 }
    );
  }
}

