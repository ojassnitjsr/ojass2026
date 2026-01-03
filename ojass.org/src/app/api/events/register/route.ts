import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Event from '@/models/Event';
import Team from '@/models/Team';
import { requireAuthAndPayment } from '@/lib/auth';

/**
 * POST /api/events/register
 * Register for an event (individual or team)
 * Requires: Authentication, Payment
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

    const { eventId, teamId } = await request.json();

    if (!eventId) {
      return NextResponse.json({ error: 'Event ID is required' }, { status: 400 });
    }

    // Check if event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    // For individual events
    if (!event.isTeamEvent) {
      // Check if user is already registered
      const existingRegistration = await Team.findOne({
        eventId,
        isIndividual: true,
        teamLeader: authResult.userId,
      });

      if (existingRegistration) {
        return NextResponse.json(
          { error: 'You are already registered for this event' },
          { status: 400 }
        );
      }

      // Create individual registration
      const registration = await Team.create({
        eventId,
        isIndividual: true,
        teamLeader: authResult.userId,
        teamMembers: [authResult.userId],
      });

      await registration.populate('teamLeader', 'name email phone ojassId');
      await registration.populate('teamMembers', 'name email phone ojassId');
      await registration.populate('eventId', 'name teamSizeMin teamSizeMax isTeamEvent img');

      return NextResponse.json({
        success: true,
        message: 'Successfully registered for the event',
        registration,
      }, { status: 201 });
    }

    // For team events
    if (!teamId) {
      return NextResponse.json(
        { error: 'Team ID is required for team events' },
        { status: 400 }
      );
    }

    // Check if team exists and user is part of it
    const team = await Team.findById(teamId);
    if (!team) {
      return NextResponse.json({ error: 'Team not found' }, { status: 404 });
    }

    // Check if user is team leader or member
    const isLeader = team.teamLeader.toString() === authResult.userId;
    const isMember = team.teamMembers.some(
      (member) => member.toString() === authResult.userId
    );

    if (!isLeader && !isMember) {
      return NextResponse.json(
        { error: 'You are not part of this team' },
        { status: 403 }
      );
    }

    // Check if team is already registered for this event
    if (team.eventId.toString() !== eventId) {
      return NextResponse.json(
        { error: 'This team is not for this event' },
        { status: 400 }
      );
    }

    // Check if team size is valid
    if (team.teamMembers.length < event.teamSizeMin) {
      return NextResponse.json(
        { error: `Team must have at least ${event.teamSizeMin} members` },
        { status: 400 }
      );
    }

    if (team.teamMembers.length > event.teamSizeMax) {
      return NextResponse.json(
        { error: `Team cannot have more than ${event.teamSizeMax} members` },
        { status: 400 }
      );
    }

    // Team is already registered (team creation = registration)
    await team.populate('teamLeader', 'name email phone ojassId');
    await team.populate('teamMembers', 'name email phone ojassId');
    await team.populate('eventId', 'name teamSizeMin teamSizeMax isTeamEvent img');

    return NextResponse.json({
      success: true,
      message: 'Team is registered for the event',
      registration: team,
    });
  } catch (error: unknown) {
    console.error('Error registering for event:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to register for event';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

