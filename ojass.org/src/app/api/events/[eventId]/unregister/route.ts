import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Team from '@/models/Team';
import { requireAuthAndPayment } from '@/lib/auth';

/**
 * DELETE /api/events/[eventId]/unregister
 * Unregister from an event
 * Requires: Authentication, Payment
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
) {
  try {
    await connectToDatabase();
    const { eventId } = await params;

    // Verify authentication and payment
    const authResult = await requireAuthAndPayment(request);
    if (!authResult.success) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.error === 'Payment required to register for events' ? 402 : 401 }
      );
    }

    // Find registration
    const registration = await Team.findOne({
      eventId,
      $or: [
        { teamLeader: authResult.userId },
        { teamMembers: authResult.userId },
      ],
    });

    if (!registration) {
      return NextResponse.json(
        { error: 'You are not registered for this event' },
        { status: 404 }
      );
    }

    // For individual events, delete the registration
    if (registration.isIndividual) {
      await Team.findByIdAndDelete(registration._id);
      return NextResponse.json({
        success: true,
        message: 'Successfully unregistered from event',
      });
    }

    // For team events
    // If user is team leader, delete the entire team
    if (registration.teamLeader.toString() === authResult.userId) {
      await Team.findByIdAndDelete(registration._id);
      return NextResponse.json({
        success: true,
        message: 'Team registration cancelled successfully',
      });
    }

    // If user is a member, remove them from the team
    registration.teamMembers = registration.teamMembers.filter(
      (member: any) => member.toString() !== authResult.userId
    );
    await registration.save();

    return NextResponse.json({
      success: true,
      message: 'Successfully left the team registration',
    });
  } catch (error: any) {
    console.error('Error unregistering:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to unregister' },
      { status: 500 }
    );
  }
}

