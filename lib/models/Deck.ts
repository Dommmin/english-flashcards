import { model, models, Schema } from "mongoose";

const WordSchema = new Schema(
  { english: String, polish: String, example: String },
  { _id: false }
);

const DeckSchema = new Schema({
  name: { type: String, required: true },
  words: [WordSchema],
  currentIndex: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

export const DeckModel = models.Deck ?? model("Deck", DeckSchema);
