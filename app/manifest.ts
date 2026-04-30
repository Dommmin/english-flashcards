import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Flashcards",
    short_name: "Flashcards",
    description: "Nauka angielskich słówek",
    start_url: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#0c0c14",
    theme_color: "#0c0c14",
    icons: [
      {
        src: "/icon",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/apple-icon",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}
