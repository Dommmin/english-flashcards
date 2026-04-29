import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { DeckModel } from "@/lib/models/Deck";

function toClient(doc: any) {
  return {
    id: doc._id.toString(),
    name: doc.name,
    words: doc.words,
    currentIndex: doc.currentIndex ?? 0,
    createdAt: doc.createdAt instanceof Date
      ? doc.createdAt.toISOString()
      : doc.createdAt,
  };
}

export async function GET(
  _: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  await connectDB();
  const deck = await DeckModel.findById(id).lean();
  if (!deck) return NextResponse.json(null, { status: 404 });
  return NextResponse.json(toClient(deck));
}

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  await connectDB();
  const body = await req.json();
  await DeckModel.findByIdAndUpdate(id, body);
  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  await connectDB();
  await DeckModel.findByIdAndDelete(id);
  return NextResponse.json({ ok: true });
}
