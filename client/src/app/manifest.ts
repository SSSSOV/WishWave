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
      {
        src: "/favicon.ico",
        sizes: "256x256",
        type: "image/ico",
        purpose: "any",
      },
    ],
  }
}
