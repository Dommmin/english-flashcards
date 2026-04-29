import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

interface Cache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

const cache: Cache = (global as any).__mongoose ?? { conn: null, promise: null };
(global as any).__mongoose = cache;

export async function connectDB() {
  if (cache.conn) return cache.conn;
  if (!cache.promise) {
    cache.promise = mongoose.connect(MONGODB_URI, { bufferCommands: false });
  }
  cache.conn = await cache.promise;
  return cache.conn;
}
