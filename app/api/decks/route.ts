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

export async function GET() {
  try {
    await connectDB();
    const decks = await DeckModel.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json(decks.map(toClient));
  } catch (err) {
    console.error("GET /api/decks:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const { name, words } = await req.json();
    const deck = await DeckModel.create({ name, words });
    return NextResponse.json(toClient(deck.toObject()), { status: 201 });
  } catch (err) {
    console.error("POST /api/decks:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
