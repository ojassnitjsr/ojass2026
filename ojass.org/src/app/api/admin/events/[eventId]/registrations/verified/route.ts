import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Team from "@/models/Team";
import { requireAdmin } from "@/lib/admin";
import { cookies } from "next/headers";

export async function GET(req: Request, { params }: { params: Promise<{ eventId: string }> }) {
  await connectToDatabase();

  try {
    const cookieStore = cookies();
    const tokenCookie = (await cookieStore).get("admin_token");
    requireAdmin(tokenCookie?.value);

    const { eventId } = await params;
    const verified = await Team.find({ eventId, isVerified: true })
      .populate("teamLeader", "name email phone")
      .populate("teamMembers", "name email phone")
      .sort({ createdAt: -1 });

    return NextResponse.json(verified);
  } catch (error: unknown) {
    const err = error as { message?: string };
    const status = err.message?.includes("Unauthorized") ? 401 : 400;
    return NextResponse.json({ error: err.message || "An error occurred" }, { status });
  }
}
