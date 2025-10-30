import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/ThemeProvider"
import { Header } from "@/components/Header"
import { Sidebar } from "@/components/Sidebar"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "블로그 뭐쓰지 AI",
  description:
    "매일 업데이트되는 이슈 캘린더와 AI 카피라이팅, 브랜드 진단을 한 번에 제공하는 블로그 콘텐츠 랩",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-background antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex min-h-screen">
            <Sidebar />
            <div className="flex min-h-screen flex-1 flex-col">
              <Header />
              <main className="flex-1 px-4 pb-10 pt-6 md:px-10">{children}</main>
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
