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
    title: "오늘의 루틴",
    description: "미션 체크로 리듬 만들기",
    href: "/mission",
  },
]

export default function HomePage() {
  const [usageStats, setUsageStats] = useState({
    title: { used: 0, limit: 3 },
    body: { used: 0, limit: 1 },
    diagnosis: { used: 0, limit: 1 },
  })
  const [highlightedCalendar, setHighlightedCalendar] = useState<CalendarItem[]>([])

  useEffect(() => {
    fetchUsage()
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

  const fetchUsage = async () => {
    try {
      const response = await fetch('/api/usage')
      const data = await response.json()
      if (data.success && data.stats) {
        setUsageStats(data.stats)
      }
    } catch (error) {
      console.error('Error fetching usage:', error)
    }
  }

  const automationStatus = [
    {
      title: "AI 제목",
      value: `${usageStats.title.used}/${usageStats.title.limit}`,
      status: usageStats.title.used >= usageStats.title.limit ? "오늘 할당량 모두 사용" : "사용 가능",
      percent: (usageStats.title.used / usageStats.title.limit) * 100,
    },
    {
      title: "AI 본문",
      value: `${usageStats.body.used}/${usageStats.body.limit}`,
      status: "Free 플랜 기준",
      percent: (usageStats.body.used / usageStats.body.limit) * 100,
    },
    {
      title: "블로그 진단",
      value: `${usageStats.diagnosis.used}/${usageStats.diagnosis.limit}`,
      status: usageStats.diagnosis.used === 0 ? "오늘 미사용" : "사용 완료",
      percent: (usageStats.diagnosis.used / usageStats.diagnosis.limit) * 100,
    },
  ]

  return (
    <div className="space-y-8">
      <section >
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border bg-secondary px-4 py-1 text-sm font-medium text-secondary-foreground">
              <Sparkles className="h-4 w-4 text-primary" />
              오늘 추천 6건 업데이트 완료
            </div>
            <h1 className="text-3xl font-bold leading-tight text-foreground">
              매일 아침 확인하는
              <br />
              블로그 콘텐츠 컨트롤 타워
            </h1>
            <p className="text-base text-muted-foreground">
              최신 이슈 캘린더, AI 카피라이팅, 브랜드 진단, 실행 루틴까지 한 곳에서 정리하세요.
              무료 플랜에서도 핵심 기능을 모두 시도할 수 있습니다.
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
          <Card className="w-full max-w-md">
            <CardHeader>
                <CardTitle className="text-primary">이번 주 자동화 요약</CardTitle>
            </CardHeader>
            <CardContent className="mt-5 space-y-4">
              {automationStatus.map((item) => (
                <div key={item.title} className="rounded-lg border bg-secondary/30 p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-muted-foreground">{item.title}</p>
                    <span className="text-base font-semibold text-foreground">{item.value}</span>
                  </div>
                  <Progress value={item.percent} className="mt-3" />
                  <p className="mt-2 text-xs text-primary">{item.status}</p>
                </div>
              ))}
            </CardContent>
          </Card>
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

      <section className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <CalendarDays className="h-5 w-5 text-primary" />
              루틴 & 미션
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-3 rounded-lg bg-primary/10 px-4 py-3 text-primary">
              <CheckCircle2 className="h-5 w-5" />
              오늘 미션 2/4 완료 · 집중 시간 35분
            </div>
            <ul className="space-y-3">
              <li className="flex items-center justify-between rounded-lg border px-4 py-3">
                <span>전날 퍼포먼스 리뷰</span>
                <Badge variant="secondary">
                  완료
                </Badge>
              </li>
              <li className="flex items-center justify-between rounded-lg border px-4 py-3">
                <span>AI 제목 3개 테스트</span>
                <Badge>
                  진행 중
                </Badge>
              </li>
              <li className="flex items-center justify-between rounded-lg border px-4 py-3">
                <span>CTA AB 테스트 기록</span>
                <Badge variant="outline">
                  예정
                </Badge>
              </li>
            </ul>
            <Button asChild className="mt-2 w-full">
              <Link href="/mission">미션 업데이트</Link>
            </Button>
          </CardContent>
        </Card>
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
