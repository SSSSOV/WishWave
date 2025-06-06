import type { Metadata } from "next"
import { Comfortaa, Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/context/ThemeContext"
import { ToastContainer } from "react-toastify"
import { Toaster } from "react-hot-toast"

const comfortaa = Comfortaa({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "WishWave",
  description: "Сервис создания и обмена списками желаний",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ru">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        />
        <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
        <meta name="theme-color" color="#1a211f" />
      </head>
      <body className={`${comfortaa.className} ${comfortaa.className} antialiased`}>
        {/* <ToastContainer className="p-1 gap-1" /> */}
        {/* <div>
          <Toaster
            position="bottom-center"
            toastOptions={{
              // Define default options
              icon: null,
              className: "toast",
              duration: 2000,
              removeDelay: 1000,

              // Default options for specific types
              // success: {
              //   className: "toast success",
              // },
              // error: {
              //   className: "toast error",
              // },
            }}
          />
        </div> */}
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
