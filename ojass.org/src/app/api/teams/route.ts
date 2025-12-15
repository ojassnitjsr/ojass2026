import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Team from '@/models/Team';
import Event from '@/models/Event';
import { requireAuthAndPayment } from '@/lib/auth';
import crypto from 'crypto';

/**
 * POST /api/teams
 * Create a new team for an event
 * Requires: Authentication, Payment, Email Verification
 */
export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    // Verify authentication and payment
    const authResult = await requireAuthAndPayment(request);
    if (!authResult.success) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.error === 'Payment required to register for events' ? 402 : 401 }
      );
    }

    const { eventId, teamName } = await request.json();

    if (!eventId) {
      return NextResponse.json({ error: 'Event ID is required' }, { status: 400 });
    }

    // Check if event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    // Check if event is a team event
    if (!event.isTeamEvent) {
      return NextResponse.json({ error: 'This event does not support teams' }, { status: 400 });
    }

    // Check if user already has a team for this event
    const existingTeam = await Team.findOne({
      eventId,
      teamLeader: authResult.userId,
    });

    if (existingTeam) {
      return NextResponse.json(
        { error: 'You already have a team for this event' },
        { status: 400 }
      );
    }

    // Check if user is already a member of another team for this event
    const existingMemberTeam = await Team.findOne({
      eventId,
      teamMembers: authResult.userId,
    });

    if (existingMemberTeam) {
      return NextResponse.json(
        { error: 'You are already a member of a team for this event' },
        { status: 400 }
      );
    }

    // Generate unique join token
    const joinToken = crypto.randomBytes(32).toString('hex');

    // Create team
    const team = await Team.create({
      eventId,
      isIndividual: false,
      teamName: teamName || `Team ${authResult.user?.name || 'Unknown'}`,
      teamLeader: authResult.userId,
      teamMembers: [authResult.userId],
      joinToken,
    });

    // Populate team data
    await team.populate('teamLeader', 'name email phone ojassId');
    await team.populate('teamMembers', 'name email phone ojassId');
    await team.populate('eventId', 'name teamSizeMin teamSizeMax');

    return NextResponse.json(team, { status: 201 });
  } catch (error: unknown) {
    console.error('Error creating team:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create team' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/teams
 * Get user's teams
 * Requires: Authentication
 */
export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    // Verify authentication
    const authResult = await requireAuthAndPayment(request);
    if (!authResult.success) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.error === 'Payment required to register for events' ? 402 : 401 }
      );
    }

    // Get query params
    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get('eventId');

    // Build query
    const query: Record<string, unknown> = {
      $or: [
        { teamLeader: authResult.userId },
        { teamMembers: authResult.userId },
      ],
    };

    if (eventId) {
      query.eventId = eventId;
    }

    // Find teams
    const teams = await Team.find(query)
      .populate('teamLeader', 'name email phone ojassId')
      .populate('teamMembers', 'name email phone ojassId')
      .populate('eventId', 'name teamSizeMin teamSizeMax isTeamEvent img')
      .sort({ createdAt: -1 });

    return NextResponse.json(teams);
  } catch (error: unknown) {
    console.error('Error fetching teams:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch teams' },
      { status: 500 }
    );
  }
}

