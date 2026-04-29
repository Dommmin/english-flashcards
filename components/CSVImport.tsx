"use client";

import { useCallback, useState } from "react";
import Papa from "papaparse";
import { CheckCircle2, Upload } from "lucide-react";
import { Word } from "@/lib/types";

interface Props {
  onImport: (words: Word[], filename: string) => void;
  currentCount?: number;
}

export default function CSVImport({ onImport, currentCount = 0 }: Props) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState("");

  const processFile = useCallback(
    (file: File) => {
      setError("");
      Papa.parse<Record<string, string>>(file, {
        header: true,
        skipEmptyLines: true,
        complete(results) {
          const words: Word[] = [];
          for (const row of results.data) {
            const english = (row.english || "").trim();
            const polish = (row.polish || "").trim();
            const example = (row.example || "").trim();
            if (english) words.push({ english, polish, example });
          }
          if (words.length === 0) {
            setError(
              "Brak słówek. Wymagane kolumny: english, polish, example."
            );
            return;
          }
          onImport(words, file.name);
        },
        error() {
          setError("Błąd podczas wczytywania pliku.");
        },
      });
    },
    [onImport]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  };

  if (currentCount > 0) {
    return (
      <label className="flex items-center gap-3 p-4 rounded-xl border border-border bg-card cursor-pointer hover:bg-accent/30 transition-colors">
        <input
          type="file"
          accept=".csv"
          className="hidden"
          onChange={handleChange}
        />
        <CheckCircle2 className="size-5 text-primary shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium">
            {currentCount.toLocaleString()} słówek wczytanych
          </p>
          <p className="text-xs text-muted-foreground">Kliknij, aby zmienić</p>
        </div>
      </label>
    );
  }

  return (
    <div>
      <label
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-10 cursor-pointer transition-all ${
          isDragging
            ? "border-primary bg-primary/5"
            : "border-border hover:border-border/80 hover:bg-accent/20"
        }`}
      >
        <input
          type="file"
          accept=".csv"
          className="hidden"
          onChange={handleChange}
        />
        <Upload className="size-8 text-muted-foreground mb-3" />
        <p className="font-semibold text-sm mb-1">Przeciągnij plik CSV</p>
        <p className="text-muted-foreground text-xs">lub kliknij, aby wybrać</p>
        <p className="font-mono text-xs text-muted-foreground/60 mt-4">
          english · polish · example
        </p>
      </label>
      {error && (
        <p className="text-destructive text-sm mt-2 text-center">{error}</p>
      )}
    </div>
  );
}
