"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  CalendarDays,
  Home,
  PencilLine,
  Shield,
  ListTodo,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "./ui/button"

const menuItems = [
  { href: "/", label: "홈", icon: Home },
  { href: "/calendar", label: "글감 캘린더", icon: CalendarDays },
  { href: "/plan", label: "블로그 계획", icon: ListTodo },
  { href: "/writer", label: "AI 카피라이팅", icon: PencilLine },
  { href: "/diagnosis", label: "블로그 진단", icon: Shield },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden w-72 flex-col border-r lg:flex">
      <div className="flex flex-1 flex-col gap-y-6 px-6 py-8">
        <div className="flex items-center gap-x-4">
            <p className="text-lg font-semibold leading-tight">
                블로그 글감 연구소
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
            프리미엄으로 업그레이드
          </p>
          <p className="mt-1 text-muted-foreground">
            AI 블로그 초안 생성과 무제한 계획 관리를 시작하세요.
          </p>
          <Button

            className="mt-4 w-full"
          >
            프리미엄 시작하기
          </Button>
        </div>
      </div>
    </aside>
  )
}
