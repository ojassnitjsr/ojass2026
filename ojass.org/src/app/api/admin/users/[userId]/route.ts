import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import { requireAdmin } from '@/lib/admin';
import { cookies } from 'next/headers';

/**
 * GET /api/admin/users/[userId]
 * Get user details
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

    const user = await User.findById(userId).select(
      '-password -emailOtp -emailOtpExpires -resetPasswordOtp -resetPasswordOtpExpires'
    );

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message },
      { status: err.message.includes('Unauthorized') ? 401 : 500 }
    );
  }
}

/**
 * PUT /api/admin/users/[userId]
 * Update user details
 * Requires: Admin authentication
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  await connectToDatabase();

  try {
    const cookieStore = cookies();
    const tokenCookie = (await cookieStore).get('admin_token');
    requireAdmin(tokenCookie?.value);

    const { userId } = await params;
    const body = await req.json();

    // Fields that can be updated by admin
    const allowedFields = [
      'name',
      'email',
      'phone',
      'gender',
      'collegeName',
      'city',
      'state',
      'isPaid',
      'isEmailVerified',
      'isNitJsrStudent',
      'referralCount',
    ];

    const updateData: any = {};
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updateData[field] = body[field];
      }
    }

    const user = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
    }).select('-password -emailOtp -emailOtpExpires -resetPasswordOtp -resetPasswordOtpExpires');

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message },
      { status: err.message.includes('Unauthorized') ? 401 : 500 }
    );
  }
}

/**
 * DELETE /api/admin/users/[userId]
 * Delete user
 * Requires: Admin authentication
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  await connectToDatabase();

  try {
    const cookieStore = cookies();
    const tokenCookie = (await cookieStore).get('admin_token');
    requireAdmin(tokenCookie?.value);

    const { userId } = await params;

    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'User deleted successfully' });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message },
      { status: err.message.includes('Unauthorized') ? 401 : 500 }
    );
  }
}

