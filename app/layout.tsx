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
  title: "블로그 글감 연구소 - 매일 뭐 쓰지? 고민 끝",
  description:
    "실시간 트렌드 기반 글감 추천, AI 키워드 조합, 체계적인 블로그 계획 관리까지. 블로거를 위한 스마트한 글감 연구소",
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
