import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Event from '@/models/Event'; // Import to register schema with Mongoose
import Team from '@/models/Team';
import { requireAuthAndPayment } from '@/lib/auth';

/**
 * GET /api/events/[eventId]/registered
 * Check if user is registered for an event
 * Requires: Authentication
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
) {
  try {
    await connectToDatabase();
    const { eventId } = await params;

    // Verify authentication
    const authResult = await requireAuthAndPayment(request);
    if (!authResult.success) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.error === 'Payment required to register for events' ? 402 : 401 }
      );
    }

    // Check if user is registered
    const registration = await Team.findOne({
      eventId,
      $or: [
        { teamLeader: authResult.userId },
        { teamMembers: authResult.userId },
      ],
    })
      .populate('teamLeader', 'name email phone ojassId')
      .populate('teamMembers', 'name email phone ojassId')
      .populate('eventId', 'name teamSizeMin teamSizeMax isTeamEvent img');

    return NextResponse.json({
      isRegistered: !!registration,
      registration: registration || null,
    });
  } catch (error: unknown) {
    console.error('Error checking registration:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to check registration';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

