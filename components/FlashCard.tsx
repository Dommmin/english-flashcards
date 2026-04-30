"use client";

import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX, RotateCcw, Loader2 } from "lucide-react";
import { Word } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useSpeech } from "@/hooks/useSpeech";

const AUTO_READ_KEY = "fc_autoread";

interface Props {
  word: Word;
  index: number;
  total: number;
  onNext: () => void;
  onPrev: () => void;
}

export default function FlashCard({ word, index, total, onNext, onPrev }: Props) {
  const [flipped, setFlipped] = useState(false);
  const [autoRead, setAutoRead] = useState(true);
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const touchMoved = useRef(false);
  const justTouched = useRef(false);
  const { speak, stop, speaking, supported } = useSpeech();

  // Load autoRead preference once
  useEffect(() => {
    const saved = localStorage.getItem(AUTO_READ_KEY);
    if (saved !== null) setAutoRead(saved === "true");
  }, []);

  // Auto-read when card changes
  useEffect(() => {
    setFlipped(false);
    if (autoRead && supported) {
      // Small delay so the flip animation starts first
      const t = setTimeout(() => speak(word.english), 300);
      return () => clearTimeout(t);
    } else {
      stop();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  // Read example sentence when card is flipped to back
  useEffect(() => {
    if (flipped && autoRead && supported && word.example) {
      const t = setTimeout(() => speak(word.example!), 400);
      return () => clearTimeout(t);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flipped]);

  // When autoRead is toggled on, read current word immediately
  const toggleAutoRead = () => {
    const next = !autoRead;
    setAutoRead(next);
    localStorage.setItem(AUTO_READ_KEY, String(next));
    if (next && supported) speak(word.english);
    else stop();
  };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) return;
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
    if (dx > 20 || dy > 20) touchMoved.current = true;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = e.changedTouches[0].clientY - (touchStartY.current ?? 0);
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) {
      justTouched.current = true;
      if (dx < 0) onNext(); else onPrev();
    } else if (!touchMoved.current) {
      justTouched.current = true;
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
          <span>{index + 1} / {total}</span>
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
        onClick={() => {
          if (justTouched.current) { justTouched.current = false; return; }
          setFlipped((f) => !f);
        }}
      >
        <div
          className="relative w-full transition-transform duration-500 ease-in-out"
          style={{
            transformStyle: "preserve-3d",
            transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
            minHeight: "300px",
          }}
        >
          {/* Front */}
          <div
            className="absolute inset-0 rounded-2xl bg-card border border-border flex flex-col items-center justify-center p-8 gap-3"
            style={{ backfaceVisibility: "hidden" }}
          >
            <p className="text-xs uppercase tracking-widest text-muted-foreground font-mono">
              angielski
            </p>
            <p className="text-4xl font-bold text-foreground text-center leading-tight">
              {word.english}
            </p>
            <p className="text-muted-foreground/40 text-xs mt-2">
              dotknij, aby odkryć
            </p>
          </div>

          {/* Back */}
          <div
            className="absolute inset-0 rounded-2xl bg-card border border-primary/20 flex flex-col items-center justify-center p-8 gap-0"
            style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
          >
            <p className="text-xs uppercase tracking-widest text-muted-foreground font-mono mb-4">
              tłumaczenie
            </p>
            <p className="text-3xl font-bold text-primary text-center leading-snug mb-5">
              {word.polish || "—"}
            </p>
            {word.example && (
              <>
                <div className="w-8 h-px bg-border mb-4" />
                <p className="text-muted-foreground text-sm italic text-center leading-relaxed max-w-xs">
                  &ldquo;{word.example}&rdquo;
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Controls row */}
      {supported && (
        <div className="flex items-center justify-center gap-2 mt-5">
          {/* Re-read button */}
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => speak(word.english)}
            disabled={speaking}
          >
            {speaking ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <RotateCcw className="size-3.5" />
            )}
            {speaking ? "Czyta..." : "Ponów"}
          </Button>

          {/* Auto-read toggle */}
          <Button
            variant={autoRead ? "secondary" : "ghost"}
            size="sm"
            className="gap-2"
            onClick={toggleAutoRead}
          >
            {autoRead ? (
              <Volume2 className="size-3.5 text-primary" />
            ) : (
              <VolumeX className="size-3.5" />
            )}
            Auto-czytanie {autoRead ? "wł." : "wył."}
          </Button>
        </div>
      )}

      {/* Navigation buttons */}
      <div className="flex gap-2 mt-4 w-full">
        <Button variant="outline" onClick={onPrev} disabled={index === 0} className="flex-1">
          ← Poprzednia
        </Button>
        <Button onClick={onNext} disabled={index === total - 1} className="flex-1">
          Następna →
        </Button>
      </div>

      <p className="text-muted-foreground/40 text-xs mt-4 font-mono">
        ← → nawigacja · spacja = odwróć
      </p>
    </div>
  );
}
