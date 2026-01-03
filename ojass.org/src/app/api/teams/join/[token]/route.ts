import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
// Import Event before Team to ensure schema is registered first
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Event from '@/models/Event';
import Team from '@/models/Team';
import { requireAuthAndPayment } from '@/lib/auth';

/**
 * POST /api/teams/join/[token]
 * Join a team using invite token
 * Requires: Authentication, Payment
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    await connectToDatabase();
    const { token } = await params;

    // Verify authentication and payment
    const authResult = await requireAuthAndPayment(request);
    if (!authResult.success) {
      let status = 401;
      if (authResult.error === 'Payment required to register for events') {
        status = 402;
      } else if (authResult.error === 'Email verification required') {
        status = 403;
      }

      return NextResponse.json(
        { error: authResult.error },
        { status }
      );
    }

    // Find team by join token
    const team = await Team.findOne({ joinToken: token })
      .populate('eventId', 'name teamSizeMin teamSizeMax isTeamEvent');

    if (!team) {
      return NextResponse.json({ error: 'Invalid invite link' }, { status: 404 });
    }

    // Check if user is already the team leader
    if (team.teamLeader.toString() === authResult.userId) {
      return NextResponse.json(
        { error: 'You are already the team leader' },
        { status: 400 }
      );
    }

    // Check if user is already a member
    if (team.teamMembers.some((member) => member.toString() === authResult.userId)) {
      return NextResponse.json(
        { error: 'You are already a member of this team' },
        { status: 400 }
      );
    }

    // Check if team has reached max size
    interface PopulatedEvent {
      teamSizeMax: number;
    }
    const event = team.eventId as unknown as PopulatedEvent;
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
        { teamLeader: authResult.userId },
        { teamMembers: authResult.userId },
      ],
    });

    if (existingTeam) {
      return NextResponse.json(
        { error: 'You are already registered for this event in another team' },
        { status: 400 }
      );
    }

    // Add user to team
    team.teamMembers.push(authResult.userId as unknown as typeof team.teamMembers[0]);
    await team.save();

    // Populate and return
    await team.populate('teamLeader', 'name email phone ojassId');
    await team.populate('teamMembers', 'name email phone ojassId');
    await team.populate('eventId', 'name teamSizeMin teamSizeMax isTeamEvent img');

    return NextResponse.json({
      success: true,
      message: 'Successfully joined the team',
      team,
    });
  } catch (error: unknown) {
    console.error('Error joining team:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to join team';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

