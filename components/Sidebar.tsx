"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BadgeCheck,
  CalendarDays,
  LayoutDashboard,
  PencilLine,
  Shield,
  Target,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "./ui/button"

const menuItems = [
  { href: "/", label: "대시보드", icon: LayoutDashboard },
  { href: "/calendar", label: "글감 캘린더", icon: CalendarDays },
  { href: "/writer", label: "AI 카피라이팅", icon: PencilLine },
  { href: "/diagnosis", label: "블로그 진단", icon: Shield },
  { href: "/branding", label: "브랜드 분석", icon: Target },
  { href: "/mission", label: "오늘의 미션", icon: BadgeCheck },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden w-72 flex-col border-r lg:flex">
      <div className="flex flex-1 flex-col gap-y-6 px-6 py-8">
        <div className="flex items-center gap-x-4">
            <p className="text-lg font-semibold leading-tight">
                블로그 뭐쓰지 AI
            </p>
        </div>


        <nav className="space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group flex items-center gap-3 rounded-lg px-4 py-3 text-base font-medium transition-all",
                  isActive
                    ? "bg-primary/10 text-primary "
                    : "text-muted-foreground hover:bg-primary/5 hover:text-primary"
                )}
              >
                <Icon
                  className={cn(
                    "h-5 w-5",
                    isActive ? "text-primary" : "text-muted-foreground "
                  )}
                />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        <div className="mt-auto rounded-lg border bg-card p-4 text-sm leading-relaxed text-card-foreground">
          <p className="font-semibold ">
            주간 리포트 자동화
          </p>
          <p className="mt-1 text-muted-foreground">
            Pro 플랜으로 AI 진단 + 이메일 리포트를 예약 발송해 보세요.
          </p>
          <Button
            
            className="mt-4 w-full"
          >
            업그레이드
          </Button>
        </div>
      </div>
    </aside>
  )
}
