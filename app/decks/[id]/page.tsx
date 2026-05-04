"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { storage } from "@/lib/storage";
import FlashCard from "@/components/FlashCard";
import JumpDialog from "@/components/JumpDialog";
import { deckKeys } from "@/app/page";

// ─── Loading skeleton ──────────────────────────────────────────────────────────
function DeckSkeleton() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="flex items-center justify-between px-4 py-3 border-b border-border">
        <Skeleton className="size-8 rounded-md" />
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-7 w-24 rounded-md" />
      </header>
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="flex flex-col items-center w-full max-w-lg">
          <div className="w-full mb-6 px-1 space-y-2">
            <div className="flex justify-between">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-3 w-8" />
            </div>
            <Skeleton className="h-1 w-full rounded-full" />
          </div>
          <Skeleton className="w-full rounded-2xl min-h-[300px]" />
          <div className="flex gap-2 mt-5">
            <Skeleton className="h-8 w-24 rounded-full" />
            <Skeleton className="h-8 w-36 rounded-full" />
          </div>
          <div className="flex gap-2 mt-4 w-full">
            <Skeleton className="h-10 flex-1 rounded-xl" />
            <Skeleton className="h-10 flex-1 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────
export default function DeckPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [index, setIndex] = useState<number | null>(null);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { data: deck, isLoading, isError } = useQuery({
    queryKey: deckKeys.deck(id),
    queryFn: () => storage.getDeck(id),
    retry: 1,
  });

  // Inicjalizuj index z bazy tylko przy pierwszym załadowaniu
  useEffect(() => {
    if (deck && index === null) {
      setIndex(deck.currentIndex);
    }
  }, [deck, index]);

  // Przekieruj gdy talia nie istnieje
  useEffect(() => {
    if (!isLoading && (deck === null || isError)) {
      router.replace("/");
    }
  }, [isLoading, deck, isError, router]);

  // Zapis z debounce — nie bombarduj bazy przy każdym swipe
  const saveIndexMutation = useMutation({
    mutationFn: ({ deckId, idx }: { deckId: string; idx: number }) =>
      storage.saveIndex(deckId, idx),
  });

  const navigate = useCallback(
    (newIndex: number) => {
      if (!deck) return;
      const clamped = Math.max(0, Math.min(newIndex, deck.words.length - 1));
      setIndex(clamped);
      // Zapisz do bazy dopiero po 800ms bez kolejnego swipe
      if (saveTimer.current) clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(() => {
        saveIndexMutation.mutate({ deckId: deck.id, idx: clamped });
      }, 800);
    },
    [deck, saveIndexMutation]
  );

  useEffect(
    () => () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    },
    []
  );

  const goNext = useCallback(
    () => navigate((index ?? 0) + 1),
    [navigate, index]
  );
  const goPrev = useCallback(
    () => navigate((index ?? 0) - 1),
    [navigate, index]
  );

  if (isLoading || index === null || !deck) return <DeckSkeleton />;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="flex items-center justify-between px-4 py-3 border-b border-border">
        <Link href="/">
          <Button variant="ghost" size="icon" className="size-8">
            <ArrowLeft className="size-4" />
          </Button>
        </Link>
        <p className="text-sm font-medium truncate max-w-[180px]">
          {deck.name}
        </p>
        <JumpDialog
          current={index}
          total={deck.words.length}
          onJump={navigate}
        />
      </header>

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
