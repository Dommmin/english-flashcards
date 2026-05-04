"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { storage } from "@/lib/storage";
import { Word } from "@/lib/types";
import CSVImport from "@/components/CSVImport";
import { deckKeys } from "@/app/page";

export default function NewDeckPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [words, setWords] = useState<Word[]>([]);
  const [name, setName] = useState("");

  const createMutation = useMutation({
    mutationFn: ({ name, words }: { name: string; words: Word[] }) =>
      storage.createDeck(name, words),
    onSuccess: (deck) => {
      // Unieważnij cache listy talii żeby home odświeżył się przy powrocie
      queryClient.invalidateQueries({ queryKey: deckKeys.all });
      router.push(`/decks/${deck.id}`);
    },
  });

  const handleImport = (w: Word[], filename: string) => {
    setWords(w);
    if (!name) {
      const suggested = filename.replace(/\.[^.]+$/, "").replace(/[-_]/g, " ");
      setName(suggested);
    }
  };

  const handleSave = () => {
    if (!name.trim() || words.length === 0) return;
    createMutation.mutate({ name: name.trim(), words });
  };

  const saving = createMutation.isPending;

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-xl mx-auto px-4 py-10">
        <div className="flex items-center gap-3 mb-8">
          <Link href="/">
            <Button variant="ghost" size="icon" className="size-8">
              <ArrowLeft className="size-4" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold">Nowa talia</h1>
        </div>

        <div className="space-y-6">
          <div>
            <p className="text-sm text-muted-foreground mb-3">
              1. Wybierz plik CSV
            </p>
            <CSVImport onImport={handleImport} currentCount={words.length} />
          </div>

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

          {words.length > 0 && (
            <Button
              onClick={handleSave}
              disabled={!name.trim() || saving}
              className="w-full"
              size="lg"
            >
              {saving ? (
                <>
                  <Loader2 className="size-4 animate-spin mr-2" />
                  Zapisywanie...
                </>
              ) : (
                "Zapisz i zacznij naukę →"
              )}
            </Button>
          )}

          {createMutation.isError && (
            <p className="text-destructive text-sm text-center">
              Błąd zapisu. Spróbuj ponownie.
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
