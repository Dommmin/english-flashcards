"use client";

import { useState } from "react";
import Link from "next/link";
import { Trash2, BookOpen } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Deck } from "@/lib/types";

interface Props {
  deck: Deck;
  onDelete: (id: string) => void;
}

export default function DeckCard({ deck, onDelete }: Props) {
  const [confirming, setConfirming] = useState(false);
  const progress = Math.round(((deck.currentIndex + 1) / deck.words.length) * 100);
  const date = new Date(deck.createdAt).toLocaleDateString("pl-PL", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const handleDelete = () => {
    if (!confirming) {
      setConfirming(true);
      setTimeout(() => setConfirming(false), 3000);
      return;
    }
    onDelete(deck.id);
  };

  return (
    <Card className="p-5 flex flex-col gap-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="font-semibold truncate">{deck.name}</h2>
            <Badge variant="secondary" className="shrink-0 font-mono text-xs">
              {deck.words.length.toLocaleString()} kart
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Dodano {date}
          </p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className={`size-8 shrink-0 ${confirming ? "text-destructive hover:text-destructive" : "text-muted-foreground"}`}
          onClick={handleDelete}
          title={confirming ? "Kliknij ponownie, aby potwierdzić" : "Usuń talię"}
        >
          <Trash2 className="size-4" />
        </Button>
      </div>

      {/* Progress */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs text-muted-foreground font-mono">
          <span>
            Karta {deck.currentIndex + 1} z {deck.words.length}
          </span>
          <span>{progress}%</span>
        </div>
        <Progress value={progress} className="h-1.5" />
      </div>

      <Link href={`/decks/${deck.id}`} className="block">
        <Button className="w-full gap-2">
          <BookOpen className="size-4" />
          Kontynuuj naukę
        </Button>
      </Link>
    </Card>
  );
}
