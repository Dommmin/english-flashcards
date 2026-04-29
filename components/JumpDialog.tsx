"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Props {
  current: number;
  total: number;
  onJump: (index: number) => void;
}

export default function JumpDialog({ current, total, onJump }: Props) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

  const handleJump = () => {
    const n = parseInt(value, 10);
    if (isNaN(n) || n < 1 || n > total) return;
    onJump(n - 1);
    setOpen(false);
    setValue("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground font-mono text-xs h-8 px-2"
        >
          Przejdź do...
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-xs">
        <DialogHeader>
          <DialogTitle>Przejdź do karty</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 pt-2">
          <p className="text-sm text-muted-foreground">
            Teraz jesteś na karcie{" "}
            <span className="text-foreground font-medium">{current + 1}</span>{" "}
            z{" "}
            <span className="text-foreground font-medium">{total}</span>.
          </p>
          <Input
            type="number"
            min={1}
            max={total}
            placeholder={`1 – ${total}`}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleJump()}
            autoFocus
          />
          <Button
            onClick={handleJump}
            disabled={!value || parseInt(value) < 1 || parseInt(value) > total}
            className="w-full"
          >
            Przejdź
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
