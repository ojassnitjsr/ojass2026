import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import { requireAdmin } from '@/lib/admin';
import { cookies } from 'next/headers';

/**
 * GET /api/admin/users/[userId]/referrals
 * Get all users referred by a specific user
 * Requires: Admin authentication
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  await connectToDatabase();

  try {
    const cookieStore = cookies();
    const tokenCookie = (await cookieStore).get('admin_token');
    requireAdmin(tokenCookie?.value);

    const { userId } = await params;

    // Get the user's OJASS ID
    const user = await User.findById(userId).select('ojassId');
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Find all users referred by this user's OJASS ID
    const referredUsers = await User.find({ referredBy: user.ojassId })
      .select('name email phone ojassId collegeName isPaid createdAt')
      .sort({ createdAt: -1 });

    return NextResponse.json({
      referrer: {
        _id: user._id,
        ojassId: user.ojassId,
      },
      referredUsers: referredUsers.map(u => ({
        _id: u._id,
        name: u.name,
        email: u.email,
        phone: u.phone,
        ojassId: u.ojassId,
        college: u.collegeName,
        isPaid: u.isPaid,
        registeredAt: u.createdAt,
      })),
    });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
    return NextResponse.json(
      { error: errorMessage },
      { status: errorMessage.includes('Unauthorized') ? 401 : 500 }
    );
  }
}

