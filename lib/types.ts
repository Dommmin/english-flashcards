export interface Word {
  english: string;
  polish: string;
  example: string;
}

export interface Deck {
  id: string;
  name: string;
  words: Word[];
  currentIndex: number;
  createdAt: string;
}
