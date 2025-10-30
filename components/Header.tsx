"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTheme } from "next-themes"
import { Bell, Menu, Moon, Sparkles, Sun } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "./ui/button"
import {
  Sheet,  
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet"

const navItems = [
  { href: "/", label: "대시보드" },
  { href: "/calendar", label: "글감 캘린더" },
  { href: "/writer", label: "AI 카피" },
  { href: "/diagnosis", label: "블로그 진단" },
  { href: "/branding", label: "브랜딩" },
  { href: "/mission", label: "미션" },
]

export function Header() {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur-sm">
      <div className="flex h-16 w-full items-center justify-between gap-3 px-4 md:px-8">
        <div className="flex items-center gap-3">
          <div className="lg:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">메뉴 열기</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72">
                <SheetHeader className="mb-6 text-left">
                  <SheetTitle>블로그 뭐쓰지 AI</SheetTitle>
                </SheetHeader>
                <nav className="grid gap-3 text-sm font-medium">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "rounded-xl px-3 py-2 transition",
                        pathname === item.href
                          ? "bg-secondary text-foreground"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {item.label}
                    </Link>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
          <div className="hidden items-center gap-4 text-sm text-muted-foreground md:flex">
            <div className="flex items-center gap-1 rounded-full border bg-secondary px-3 py-1 text-foreground">
              <Sparkles className="h-4 w-4 text-primary" />
              <span>금주 추천 6건</span>
            </div>
            <span>AI 작성 12건 / Free 플랜</span>
          </div>
        </div>
        <div className="flex items-center gap-2 md:gap-3">
          <Button variant="outline" size="sm" className="text-xs">
            가이드 보기
          </Button>
          <Button
            asChild
            className="text-sm font-semibold"
          >
            <Link href="/writer">새 글 작성</Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="relative"
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">테마 전환</span>
          </Button>
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5 text-primary" />
            <span className="absolute -right-0.5 -top-0.5 inline-flex h-2 w-2 rounded-full bg-red-500" />
          </Button>
          <div className="hidden h-10 w-10 items-center justify-center rounded-full bg-secondary text-sm font-semibold text-foreground md:flex">
            SA
          </div>
        </div>
      </div>
    </header>
  )
}
