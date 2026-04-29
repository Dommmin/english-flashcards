"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { storage } from "@/lib/storage";
import { Deck } from "@/lib/types";
import DeckCard from "@/components/DeckCard";

export default function Home() {
  const [decks, setDecks] = useState<Deck[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    storage.listDecks().then(setDecks).finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string) => {
    await storage.deleteDeck(id);
    setDecks((prev) => prev.filter((d) => d.id !== id));
  };

  if (loading) return null;

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Flashcards</h1>
            <p className="text-muted-foreground text-sm mt-0.5">
              {decks.length === 0
                ? "Brak talii — zaimportuj pierwszy plik CSV"
                : `${decks.length} ${decks.length === 1 ? "talia" : decks.length < 5 ? "talie" : "talii"}`}
            </p>
          </div>
          <Link href="/decks/new">
            <Button className="gap-2">
              <Plus className="size-4" />
              Nowa talia
            </Button>
          </Link>
        </div>

        {/* Deck list */}
        {decks.length === 0 ? (
          <div className="border border-dashed border-border rounded-2xl flex flex-col items-center justify-center py-20 text-center">
            <p className="text-4xl mb-4">🃏</p>
            <p className="text-muted-foreground text-sm max-w-xs">
              Zaimportuj plik CSV z kolumnami{" "}
              <span className="font-mono text-foreground">english</span>,{" "}
              <span className="font-mono text-foreground">polish</span>,{" "}
              <span className="font-mono text-foreground">example</span>, nadaj
              talii nazwę i zacznij naukę.
            </p>
            <Link href="/decks/new" className="mt-6">
              <Button variant="outline">Importuj plik CSV</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {decks.map((deck) => (
              <DeckCard key={deck.id} deck={deck} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
