"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { storage } from "@/lib/storage";
import { Deck } from "@/lib/types";
import FlashCard from "@/components/FlashCard";
import JumpDialog from "@/components/JumpDialog";

export default function DeckPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [deck, setDeck] = useState<Deck | null>(null);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    storage.getDeck(id).then((d) => {
      if (!d) { router.replace("/"); return; }
      setDeck(d);
      setIndex(d.currentIndex);
    }).finally(() => setLoading(false));
  }, [id, router]);

  const navigate = useCallback(
    (newIndex: number) => {
      if (!deck) return;
      const clamped = Math.max(0, Math.min(newIndex, deck.words.length - 1));
      setIndex(clamped);
      storage.saveIndex(deck.id, clamped);
    },
    [deck]
  );

  const goNext = useCallback(() => navigate(index + 1), [navigate, index]);
  const goPrev = useCallback(() => navigate(index - 1), [navigate, index]);

  if (loading || !deck) return null;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-border">
        <Link href="/">
          <Button variant="ghost" size="icon" className="size-8">
            <ArrowLeft className="size-4" />
          </Button>
        </Link>
        <div className="text-center">
          <p className="text-sm font-medium truncate max-w-[180px]">
            {deck.name}
          </p>
        </div>
        <JumpDialog
          current={index}
          total={deck.words.length}
          onJump={navigate}
        />
      </header>

      {/* Card */}
      <div className="flex-1 flex items-center justify-center p-4">
        <FlashCard
          word={deck.words[index]}
          index={index}
          total={deck.words.length}
          onNext={goNext}
          onPrev={goPrev}
        />
      </div>
    </div>
  );
}
