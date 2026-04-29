"use client";

import { useEffect, useRef, useState } from "react";
import { Word } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface Props {
  word: Word;
  index: number;
  total: number;
  onNext: () => void;
  onPrev: () => void;
}

export default function FlashCard({
  word,
  index,
  total,
  onNext,
  onPrev,
}: Props) {
  const [flipped, setFlipped] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const touchMoved = useRef(false);

  useEffect(() => {
    setFlipped(false);
  }, [index]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") onNext();
      else if (e.key === "ArrowLeft") onPrev();
      else if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        setFlipped((f) => !f);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onNext, onPrev]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    touchMoved.current = false;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const dx = Math.abs(e.touches[0].clientX - touchStartX.current);
    const dy = Math.abs(e.touches[0].clientY - (touchStartY.current ?? 0));
    if (dx > 10 || dy > 10) touchMoved.current = true;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = e.changedTouches[0].clientY - (touchStartY.current ?? 0);

    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) {
      if (dx > 0) onNext();
      else onPrev();
    } else if (!touchMoved.current) {
      setFlipped((f) => !f);
    }

    touchStartX.current = null;
    touchStartY.current = null;
  };

  const progress = ((index + 1) / total) * 100;

  return (
    <div className="flex flex-col items-center w-full max-w-lg">
      {/* Progress */}
      <div className="w-full mb-6 px-1">
        <div className="flex justify-between text-xs text-muted-foreground mb-2 font-mono">
          <span>
            {index + 1} / {total}
          </span>
          <span>{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-1" />
      </div>

      {/* Card */}
      <div
        className="w-full cursor-pointer select-none"
        style={{ perspective: "1200px" }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={() => setFlipped((f) => !f)}
      >
        <div
          className="relative w-full transition-transform duration-500 ease-in-out"
          style={{
            transformStyle: "preserve-3d",
            transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
            minHeight: "280px",
          }}
        >
          {/* Front */}
          <div
            className="absolute inset-0 rounded-2xl bg-card border border-border flex flex-col items-center justify-center p-8"
            style={{ backfaceVisibility: "hidden" }}
          >
            <p className="text-xs uppercase tracking-widest text-muted-foreground font-mono mb-5">
              angielski
            </p>
            <p className="text-4xl font-bold text-foreground text-center leading-tight">
              {word.english}
            </p>
            <p className="text-muted-foreground/40 text-xs mt-8">
              dotknij, aby odkryć
            </p>
          </div>

          {/* Back */}
          <div
            className="absolute inset-0 rounded-2xl bg-card border border-primary/20 flex flex-col items-center justify-center p-8"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          >
            <p className="text-xs uppercase tracking-widest text-muted-foreground font-mono mb-4">
              tłumaczenie
            </p>
            <p className="text-3xl font-bold text-primary text-center leading-snug mb-5">
              {word.polish || "—"}
            </p>
            {word.example && (
              <>
                <div className="w-8 h-px bg-border mb-5" />
                <p className="text-muted-foreground text-sm italic text-center leading-relaxed max-w-xs">
                  &ldquo;{word.example}&rdquo;
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Navigation buttons */}
      <div className="flex gap-2 mt-6 w-full">
        <Button
          variant="outline"
          onClick={onPrev}
          disabled={index === 0}
          className="flex-1"
        >
          ← Poprzednia
        </Button>
        <Button
          onClick={onNext}
          disabled={index === total - 1}
          className="flex-1"
        >
          Następna →
        </Button>
      </div>

      <p className="text-muted-foreground/40 text-xs mt-4 font-mono">
        ← → nawigacja · spacja = odwróć
      </p>
    </div>
  );
}
