import { Deck, Word } from "./types";

const DECKS_KEY = "fc_decks";

function readDecks(): Deck[] {
  try {
    const raw = localStorage.getItem(DECKS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeDecks(decks: Deck[]): void {
  localStorage.setItem(DECKS_KEY, JSON.stringify(decks));
}

export const storage = {
  listDecks(): Deck[] {
    return readDecks();
  },

  getDeck(id: string): Deck | null {
    return readDecks().find((d) => d.id === id) ?? null;
  },

  createDeck(name: string, words: Word[]): Deck {
    const deck: Deck = {
      id: crypto.randomUUID(),
      name,
      words,
      currentIndex: 0,
      createdAt: new Date().toISOString(),
    };
    writeDecks([...readDecks(), deck]);
    return deck;
  },

  saveIndex(deckId: string, index: number): void {
    const decks = readDecks().map((d) =>
      d.id === deckId ? { ...d, currentIndex: index } : d
    );
    writeDecks(decks);
  },

  deleteDeck(id: string): void {
    writeDecks(readDecks().filter((d) => d.id !== id));
  },
};
