"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { storage } from "@/lib/storage";
import DeckCard from "@/components/DeckCard";

// ─── Query keys ────────────────────────────────────────────────────────────────
export const deckKeys = {
  all: ["decks"] as const,
  deck: (id: string) => ["decks", id] as const,
};

// ─── Loading skeleton ──────────────────────────────────────────────────────────
function DeckListSkeleton() {
  return (
    <div className="space-y-3">
      {[0, 1].map((i) => (
        <div
          key={i}
          className="p-5 rounded-2xl border border-border bg-card space-y-4"
        >
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <Skeleton className="h-5 w-44" />
              <Skeleton className="h-3 w-28" />
            </div>
            <Skeleton className="size-8 rounded-md" />
          </div>
          <div className="space-y-1.5">
            <div className="flex justify-between">
              <Skeleton className="h-3 w-32" />
              <Skeleton className="h-3 w-8" />
            </div>
            <Skeleton className="h-1.5 w-full rounded-full" />
          </div>
          <Skeleton className="h-10 w-full rounded-xl" />
        </div>
      ))}
    </div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────
export default function Home() {
  const queryClient = useQueryClient();

  const {
    data: decks = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: deckKeys.all,
    queryFn: () => storage.listDecks(),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => storage.deleteDeck(id),
    // Optimistic update — usuń z UI natychmiast, bez czekania na serwer
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: deckKeys.all });
      const prev = queryClient.getQueryData(deckKeys.all);
      queryClient.setQueryData(deckKeys.all, (old: typeof decks) =>
        old.filter((d) => d.id !== id)
      );
      return { prev };
    },
    onError: (_err, _id, ctx) => {
      queryClient.setQueryData(deckKeys.all, ctx?.prev);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: deckKeys.all });
    },
  });

  const subtitle = isLoading
    ? "Ładowanie..."
    : decks.length === 0
      ? "Brak talii — zaimportuj pierwszy plik CSV"
      : `${decks.length} ${decks.length === 1 ? "talia" : decks.length < 5 ? "talie" : "talii"}`;

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Flashcards</h1>
            <p className="text-muted-foreground text-sm mt-0.5">{subtitle}</p>
          </div>
          <Link href="/decks/new">
            <Button className="gap-2">
              <Plus className="size-4" />
              Nowa talia
            </Button>
          </Link>
        </div>

        {isLoading && <DeckListSkeleton />}

        {isError && (
          <div className="border border-destructive/40 bg-destructive/10 rounded-2xl p-6 text-center text-sm text-destructive">
            Błąd połączenia z bazą danych. Sprawdź konfigurację.
          </div>
        )}

        {!isLoading && !isError && decks.length === 0 && (
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
        )}

        {!isLoading && !isError && decks.length > 0 && (
          <div className="space-y-3">
            {decks.map((deck) => (
              <DeckCard
                key={deck.id}
                deck={deck}
                onDelete={(id) => deleteMutation.mutate(id)}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
