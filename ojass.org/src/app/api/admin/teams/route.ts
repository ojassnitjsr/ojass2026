import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Team from '@/models/Team';
import { requireAdmin } from '@/lib/admin';
import { cookies } from 'next/headers';

/**
 * GET /api/admin/teams
 * Get all teams with pagination and filters
 * Requires: Admin authentication
 */
export async function GET(req: NextRequest) {
  await connectToDatabase();

  try {
    const cookieStore = cookies();
    const tokenCookie = (await cookieStore).get('admin_token');
    requireAdmin(tokenCookie?.value);

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const search = searchParams.get('search') || '';
    const eventId = searchParams.get('eventId');
    const isIndividual = searchParams.get('isIndividual');

    // Build query
    const query: Record<string, unknown> = {};

    if (eventId) {
      query.eventId = eventId;
    }

    if (isIndividual === 'true') {
      query.isIndividual = true;
    } else if (isIndividual === 'false') {
      query.isIndividual = false;
    }

    // Get total count
    const total = await Team.countDocuments(query);

    // Get teams
    let teams = await Team.find(query)
      .populate('teamLeader', 'name email phone ojassId isPaid collegeName')
      .populate('teamMembers', 'name email phone ojassId isPaid collegeName')
      .populate('eventId', 'name teamSizeMin teamSizeMax isTeamEvent img')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    // Filter by search if provided
    if (search) {
      teams = teams.filter((team) => {
        const teamName = team.teamName?.toLowerCase() || '';
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const eventName = (team.eventId as any)?.name?.toLowerCase() || '';
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const leaderName = (team.teamLeader as any)?.name?.toLowerCase() || '';
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const leaderEmail = (team.teamLeader as any)?.email?.toLowerCase() || '';
        const searchLower = search.toLowerCase();
        return (
          teamName.includes(searchLower) ||
          eventName.includes(searchLower) ||
          leaderName.includes(searchLower) ||
          leaderEmail.includes(searchLower)
        );
      });
    }

    return NextResponse.json({
      teams,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
    return NextResponse.json(
      { error: errorMessage },
      { status: errorMessage.includes('Unauthorized') ? 401 : 500 }
    );
  }
}

