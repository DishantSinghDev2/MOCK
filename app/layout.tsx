import type React from "react"
import type { Metadata } from "next"
import { DM_Sans } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { ErrorBoundary } from "@/components/ui/error-boundary"

const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-dm-sans",
})

export const metadata: Metadata = {
  title: "MOCK by DIT - AI-Native Mock & Test API Platform",
  description:
    "Generate mock APIs automatically and run hands-off AI testing jobs against any API. Built by DishIs Technologies.",
  generator: "MOCK by DIT",
  keywords: ["API", "Mock", "Testing", "AI", "Developer Tools", "DishIs Technologies"],
  authors: [{ name: "DishIs Technologies" }],
  creator: "DishIs Technologies",
  publisher: "DishIs Technologies",
  robots: "index, follow",
  openGraph: {
    title: "MOCK by DIT - AI-Native Mock & Test API Platform",
    description: "Generate mock APIs automatically and run hands-off AI testing jobs against any API.",
    url: "https://mock.dishis.tech",
    siteName: "MOCK by DIT",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MOCK by DIT - AI-Native Mock & Test API Platform",
    description: "Generate mock APIs automatically and run hands-off AI testing jobs against any API.",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${dmSans.variable} antialiased`} suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange={false}>
          <ErrorBoundary>{children}</ErrorBoundary>
        </ThemeProvider>
      </body>
    </html>
  )
}
