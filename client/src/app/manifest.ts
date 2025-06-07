import { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "WishWave",
    short_name: "WW",
    description: "WishWave сервис создания и обмена списками желаний",
    start_url: "/",
    background_color: "#fff",
    theme_color: "#fff",
    display: "standalone",
    icons: [
      // {
      //   src: "/icons/icon-72x72.png",
      //   sizes: "72x72",
      //   type: "image/png",
      // },
      // {
      //   src: "/icons/icon-192x192.png",
      //   sizes: "192x192",
      //   type: "image/png",
      // },
      // {
      //   src: "/icons/icon-512x512.png",
      //   sizes: "512x512",
      //   type: "image/png",
      // },
      {
        src: "/favicon.ico",
        sizes: "256x256",
        type: "image/ico",
        purpose: "any",
      },
    ],
  }
}
