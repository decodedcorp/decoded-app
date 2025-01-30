import { MetadataRoute } from "next";

// TODO: Add this files
// public/
// ├── favicon.ico
// ├── icon-192x192.png
// └── icon-512x512.png

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "DECODED",
    short_name: "DECODED",
    description: "DECODED",
    start_url: "/",
    display: "standalone",
    background_color: "#000000",
    theme_color: "#000000",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
