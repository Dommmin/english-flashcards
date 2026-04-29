"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { storage } from "@/lib/storage";
import { Word } from "@/lib/types";
import CSVImport from "@/components/CSVImport";

export default function NewDeckPage() {
  const router = useRouter();
  const [words, setWords] = useState<Word[]>([]);
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);

  const handleImport = (w: Word[], filename: string) => {
    setWords(w);
    if (!name) {
      const suggested = filename.replace(/\.[^.]+$/, "").replace(/[-_]/g, " ");
      setName(suggested);
    }
  };

  const handleSave = async () => {
    if (!name.trim() || words.length === 0) return;
    setSaving(true);
    const deck = await storage.createDeck(name.trim(), words);
    router.push(`/decks/${deck.id}`);
  };

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Link href="/">
            <Button variant="ghost" size="icon" className="size-8">
              <ArrowLeft className="size-4" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold">Nowa talia</h1>
        </div>

        <div className="space-y-6">
          {/* CSV import */}
          <div>
            <p className="text-sm text-muted-foreground mb-3">
              1. Wybierz plik CSV
            </p>
            <CSVImport onImport={handleImport} currentCount={words.length} />
          </div>

          {/* Name */}
          {words.length > 0 && (
            <div>
              <p className="text-sm text-muted-foreground mb-3">
                2. Nadaj nazwę talii
              </p>
              <Input
                placeholder="np. Oxford 3000, Angielski B2..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSave()}
                autoFocus
              />
            </div>
          )}

          {/* Save */}
          {words.length > 0 && (
            <Button
              onClick={handleSave}
              disabled={!name.trim() || saving}
              className="w-full"
              size="lg"
            >
              {saving ? "Zapisywanie..." : "Zapisz i zacznij naukę →"}
            </Button>
          )}
        </div>
      </div>
    </main>
  );
}
