import { Deck, Word } from "./types";

const BASE = "/api/decks";

async function json<T>(res: Response): Promise<T> {
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export const storage = {
  listDecks(): Promise<Deck[]> {
    return fetch(BASE).then(json<Deck[]>);
  },

  getDeck(id: string): Promise<Deck | null> {
    return fetch(`${BASE}/${id}`).then((r) =>
      r.status === 404 ? null : json<Deck>(r)
    );
  },

  async createDeck(name: string, words: Word[]): Promise<Deck> {
    return json(
      await fetch(BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, words }),
      })
    );
  },

  saveIndex(deckId: string, index: number): Promise<void> {
    return fetch(`${BASE}/${deckId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentIndex: index }),
    }).then(() => undefined);
  },

  deleteDeck(id: string): Promise<void> {
    return fetch(`${BASE}/${id}`, { method: "DELETE" }).then(() => undefined);
  },
};
