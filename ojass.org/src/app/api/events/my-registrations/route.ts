import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Team from '@/models/Team';
import { requireAuthAndPayment } from '@/lib/auth';

/**
 * GET /api/events/my-registrations
 * Get user's event registrations
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

    // Find registrations
    const registrations = await Team.find(query)
      .populate('teamLeader', 'name email phone ojassId')
      .populate('teamMembers', 'name email phone ojassId')
      .populate('eventId', 'name teamSizeMin teamSizeMax isTeamEvent img description organizer')
      .sort({ createdAt: -1 });

    return NextResponse.json(registrations);
  } catch (error: unknown) {
    console.error('Error fetching registrations:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch registrations';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

