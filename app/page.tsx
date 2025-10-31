"use client"

import { useEffect, useState } from "react"
import { ArrowRight, CalendarDays, CheckCircle2, Sparkles } from "lucide-react"
import Link from "next/link"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { loadMonthData, getRecommendedItems, type CalendarItem } from "@/lib/calendar-loader"

const quickLinks = [
  {
    title: "AI 카피 생성기",
    description: "톤·CTA 선택 후 20초 내 결과",
    href: "/writer",
  },
  {
    title: "브랜드 SWOT 정리",
    description: "팀 메모 공유용으로 정리",
    href: "/branding",
  },
  {
    title: "블로그 계획",
    description: "미션과 루틴으로 성장 관리",
    href: "/plan",
  },
]

export default function HomePage() {
  const [highlightedCalendar, setHighlightedCalendar] = useState<CalendarItem[]>([])

  useEffect(() => {
    loadCalendarData()
  }, [])

  const loadCalendarData = async () => {
    try {
      const now = new Date()
      const monthData = await loadMonthData(now.getFullYear(), now.getMonth() + 1)
      const recommended = getRecommendedItems(monthData, { priority: 'high', trending: true, count: 3 })
      setHighlightedCalendar(recommended)
    } catch (error) {
      console.error('Failed to load calendar data:', error)
    }
  }

  return (
    <div className="space-y-8">
      <section >
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border bg-secondary px-4 py-1 text-sm font-medium text-secondary-foreground">
              <Sparkles className="h-4 w-4 text-primary" />
              주간/월간 블로그 글감
            </div>
            <h1 class="text-3xl font-bold leading-tight text-foreground">
              주간/월간 단위로 관리하는
              <br />
              블로그 글감·이슈 트래킹
            </h1>
            <p class="text-base text-muted-foreground">
              캘린더에서 최신 트렌드와 시즌성 이슈를 확인하고, AI로 빠르게 글감을 만드세요.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg" className="text-base font-semibold">
                <Link href="/writer">AI 카피 바로 만들기</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="text-base"
              >
                <Link href="/calendar" className="flex items-center gap-2">
                  이번 주 이슈 보기
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>

        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        {highlightedCalendar.length > 0 ? (
          highlightedCalendar.map((item) => (
            <Card key={item.id}>
              <CardHeader className="space-y-1">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-lg font-semibold text-foreground">{item.title}</CardTitle>
                  {item.trending && <span className="text-sm">🔥</span>}
                </div>
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium text-primary">{item.date}</span>
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {item.keywords.slice(0, 3).map((keyword) => (
                    <Badge key={keyword} variant="secondary">
                      #{keyword}
                    </Badge>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">{item.desc}</p>
                <Button
                  asChild
                  variant="secondary"
                  className="w-full"
                >
                  <Link href={`/writer?topic=${encodeURIComponent(item.title)}&keywords=${encodeURIComponent(item.keywords.join(", "))}`}>
                    이 주제로 바로 작성
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-3 py-12 text-center text-muted-foreground">
            추천 글감을 불러오는 중...
          </div>
        )}
      </section>

      <section className="grid gap-6 lg:grid-cols-1">

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Sparkles className="h-5 w-5 text-primary" />
              퀵 액션
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            {quickLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="group flex items-center justify-between rounded-lg border bg-background p-5 text-left transition hover:border-primary hover:bg-secondary"
              >
                <div>
                  <p className="text-base font-semibold text-foreground">{link.title}</p>
                  <p className="text-sm text-muted-foreground">{link.description}</p>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground transition group-hover:translate-x-1 group-hover:text-primary" />
              </Link>
            ))}
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
