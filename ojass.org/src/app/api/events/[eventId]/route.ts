import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Event from "@/models/Event";
import { Types } from "mongoose";

export async function GET(req: Request, { params }: { params: Promise<{ eventId: string }> }) {
  await connectToDatabase();
  const { eventId } = await params;
  let event;
  if(Types.ObjectId.isValid(eventId)) event = await Event.findById(eventId);
  if (!event) event = await Event.findOne({ redirect: eventId });
  if (!event) return NextResponse.json({ error: "Event not found" }, { status: 404 });
  return NextResponse.json(event);
}

export async function PUT(req: Request, { params }: { params: Promise<{ eventId: string }> }) {
  await connectToDatabase();
  try {
    const { eventId } = await params;
    const body = await req.json();
    const updatedEvent = await Event.findByIdAndUpdate(eventId, body, { new: true });
    return NextResponse.json(updatedEvent);
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 400 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ eventId: string }> }) {
  await connectToDatabase();
  try {
    const { eventId } = await params;
    await Event.findByIdAndDelete(eventId);
    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 400 });
  }
}

