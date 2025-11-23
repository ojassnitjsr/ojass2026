import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Team from '@/models/Team';
import User from '@/models/User';
import Event from '@/models/Event';
import { requireAuthAndPayment } from '@/lib/auth';

/**
 * POST /api/teams/[teamId]/members/add
 * Add a member to team by OJASS ID (only team leader can add)
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

    const { ojassId } = await request.json();

    if (!ojassId) {
      return NextResponse.json({ error: 'OJASS ID is required' }, { status: 400 });
    }

    // Validate OJASS ID format
    if (!/^OJASS26[A-Z0-9]{4}$/.test(ojassId)) {
      return NextResponse.json({ error: 'Invalid OJASS ID format' }, { status: 400 });
    }

    // Find team
    const team = await Team.findById(teamId)
      .populate('eventId', 'name teamSizeMin teamSizeMax isTeamEvent');

    if (!team) {
      return NextResponse.json({ error: 'Team not found' }, { status: 404 });
    }

    // Check if user is the team leader
    if (team.teamLeader.toString() !== authResult.userId) {
      return NextResponse.json(
        { error: 'Only team leader can add members' },
        { status: 403 }
      );
    }

    // Find user by OJASS ID
    const userToAdd = await User.findOne({ ojassId: ojassId.toUpperCase() });

    if (!userToAdd) {
      return NextResponse.json(
        { error: 'User with this OJASS ID not found' },
        { status: 404 }
      );
    }

    // Check if user is verified and paid
    if (!userToAdd.isEmailVerified) {
      return NextResponse.json(
        { error: 'User must verify their email before joining a team' },
        { status: 400 }
      );
    }

    if (!userToAdd.isPaid) {
      return NextResponse.json(
        { error: 'User must complete payment before joining a team' },
        { status: 400 }
      );
    }

    // Check if user is already the team leader
    if (team.teamLeader.toString() === userToAdd._id.toString()) {
      return NextResponse.json(
        { error: 'User is already the team leader' },
        { status: 400 }
      );
    }

    // Check if user is already a member
    if (team.teamMembers.some((member: any) => member.toString() === userToAdd._id.toString())) {
      return NextResponse.json(
        { error: 'User is already a member of this team' },
        { status: 400 }
      );
    }

    // Check if team has reached max size
    const event = team.eventId as any;
    if (team.teamMembers.length >= event.teamSizeMax) {
      return NextResponse.json(
        { error: 'Team has reached maximum size' },
        { status: 400 }
      );
    }

    // Check if user is already in another team for this event
    const existingTeam = await Team.findOne({
      eventId: team.eventId,
      $or: [
        { teamLeader: userToAdd._id },
        { teamMembers: userToAdd._id },
      ],
    });

    if (existingTeam) {
      return NextResponse.json(
        { error: 'User is already registered for this event in another team' },
        { status: 400 }
      );
    }

    // Add user to team
    team.teamMembers.push(userToAdd._id as any);
    await team.save();

    // Populate and return
    await team.populate('teamLeader', 'name email phone ojassId');
    await team.populate('teamMembers', 'name email phone ojassId');
    await team.populate('eventId', 'name teamSizeMin teamSizeMax isTeamEvent img');

    return NextResponse.json({
      success: true,
      message: 'Member added successfully',
      team,
    });
  } catch (error: any) {
    console.error('Error adding team member:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to add team member' },
      { status: 500 }
    );
  }
}

