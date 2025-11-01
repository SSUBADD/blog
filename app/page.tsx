"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Sparkles, TrendingUp } from "lucide-react"
import { TrendTabs, TrendTabContent } from "@/components/dashboard/TrendTabs"
import { TimelineSection } from "@/components/dashboard/TimelineSection"
import { TrendingKeywords } from "@/components/dashboard/TrendingKeywords"
import { AITopicSuggestion } from "@/components/dashboard/AITopicSuggestion"
import { CategoryFilter } from "@/components/dashboard/CategoryFilter"
import { WeatherBasedRecommend } from "@/components/dashboard/WeatherBasedRecommend"
import { StepGuide } from "@/components/dashboard/StepGuide"
import { CalendarItem } from "@/lib/calendar-loader"
import {
  getTodayItems,
  getWeekItems,
  getMonthItems,
  getSeasonItems,
  generateTrendingKeywords,
  generateAISuggestions,
  generateWeatherRecommendations,
} from "@/lib/dashboard-data"

// 목업 데이터 (폴백용)
const mockTodayItems = [
  {
    id: "2025-11-01-kimchi",
    date: "2025-11-01",
    title: "김치의 날 특집 - 김장 완벽 가이드",
    short: "김장 가이드",
    cat: ["season", "lifestyle"],
    keywords: ["김치", "김장", "발효음식"],
    trending: true,
    priority: "high",
  },
  {
    id: "2025-11-01-culture",
    date: "2025-11-01",
    title: "문화의 날 무료 관람",
    short: "문화생활",
    cat: ["lifestyle", "trend"],
    keywords: ["문화의날", "전시", "무료"],
    trending: true,
    priority: "medium",
  },
]

const mockWeekItems = [
  {
    id: "2025-11-01-kimchi",
    date: "2025-11-01",
    title: "김치의 날",
    short: "김장 가이드",
    cat: ["season"],
    keywords: ["김치", "김장", "발효"],
    trending: true,
  },
  {
    id: "2025-11-03-culture",
    date: "2025-11-03",
    title: "문화의 날",
    short: "문화생활",
    cat: ["lifestyle"],
    keywords: ["문화", "전시", "공연"],
    trending: true,
  },
  {
    id: "2025-11-07-ipdong",
    date: "2025-11-07",
    title: "입동",
    short: "겨울 준비",
    cat: ["season"],
    keywords: ["입동", "겨울", "건강"],
    trending: true,
  },
]

const mockMonthItems = [
  ...mockWeekItems,
  {
    id: "2025-11-11-pepero",
    date: "2025-11-11",
    title: "빼빼로데이",
    short: "빼빼로데이 마케팅",
    cat: ["business"],
    keywords: ["빼빼로", "이벤트", "마케팅"],
    trending: true,
  },
  {
    id: "2025-11-29-bf",
    date: "2025-11-29",
    title: "블랙프라이데이",
    short: "블프 쇼핑 전략",
    cat: ["business"],
    keywords: ["블랙프라이데이", "쇼핑", "할인"],
    trending: true,
  },
]

const mockSeasonItems = [
  {
    id: "season-1",
    date: "2025-11-15",
    title: "가을 마무리",
    short: "가을 정리",
    cat: ["season"],
    keywords: ["가을", "단풍", "여행"],
  },
  {
    id: "season-2",
    date: "2025-12-01",
    title: "겨울 시작",
    short: "겨울 준비",
    cat: ["season"],
    keywords: ["겨울", "패딩", "난방"],
  },
  {
    id: "season-3",
    date: "2025-12-25",
    title: "크리스마스",
    short: "연말 시즌",
    cat: ["season"],
    keywords: ["크리스마스", "선물", "파티"],
  },
]

const mockKeywords = [
  { text: "블랙프라이데이", count: 8500, trend: "up" as const },
  { text: "김장", count: 6200, trend: "up" as const },
  { text: "입동", count: 5800, trend: "up" as const },
  { text: "겨울패션", count: 4500, trend: "stable" as const },
  { text: "연말정산", count: 4200, trend: "up" as const },
  { text: "크리스마스", count: 3800, trend: "up" as const },
  { text: "난방", count: 3500, trend: "up" as const },
  { text: "가성비", count: 3200, trend: "stable" as const },
  { text: "선물추천", count: 2900, trend: "up" as const },
]

const mockAISuggestions = [
  {
    combination: "블랙프라이데이 + 가성비",
    description: "연말 쇼핑 시즌 최고의 가성비 아이템 추천",
    keywords: ["쇼핑", "할인", "추천"],
  },
  {
    combination: "김장 + 건강",
    description: "김장철 건강하게 김치 담그는 법",
    keywords: ["김치", "발효", "면역력"],
  },
  {
    combination: "겨울패션 + 코디",
    description: "올 겨울 트렌디한 레이어드룩 완성하기",
    keywords: ["패션", "스타일", "레이어드"],
  },
]

const mockCategories = [
  { id: "season", name: "계절", color: "#10b981", count: 12 },
  { id: "trend", name: "트렌드", color: "#f59e0b", count: 18 },
  { id: "business", name: "비즈니스", color: "#ef4444", count: 15 },
  { id: "lifestyle", name: "라이프", color: "#8b5cf6", count: 20 },
  { id: "edu", name: "교육", color: "#3b82f6", count: 8 },
]

const mockWeather = {
  condition: "cloudy" as const,
  temperature: 8,
  description: "흐리고 쌀쌀한 날씨",
}

const mockWeatherRecommendations = [
  {
    topic: "겨울 패딩 추천",
    description: "추운 날씨에 필요한 따뜻한 패딩 아이템",
    keywords: ["패딩", "겨울", "보온"],
  },
  {
    topic: "따뜻한 차 레시피",
    description: "몸을 녹여주는 건강한 차 만들기",
    keywords: ["차", "건강", "따뜻한"],
  },
]

const steps = [
  {
    number: 1,
    title: "오늘의 글감 확인",
    description: "매일 자동 업데이트되는 타임라인에서 트렌드 키워드 발견",
    href: "#timeline",
  },
  {
    number: 2,
    title: "제목과 일정 작성",
    description: "마음에 드는 글감을 선택하고 제목 + 마감일 설정",
    href: "/plan",
  },
  {
    number: 3,
    title: "AI 초안 생성",
    description: "AI가 SEO 최적화된 블로그 초안을 자동 생성",
    href: "/writer",
  },
]

export default function DashboardPage() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [currentTab, setCurrentTab] = useState("today")
  const [todayItems, setTodayItems] = useState<CalendarItem[]>(mockTodayItems)
  const [weekItems, setWeekItems] = useState<CalendarItem[]>(mockWeekItems)
  const [monthItems, setMonthItems] = useState<CalendarItem[]>(mockMonthItems)
  const [seasonItems, setSeasonItems] = useState<CalendarItem[]>(mockSeasonItems)
  const [isLoading, setIsLoading] = useState(true)

  // 실제 데이터 로드
  useEffect(() => {
    async function loadData() {
      setIsLoading(true)
      try {
        const [today, week, month, season] = await Promise.all([
          getTodayItems(),
          getWeekItems(),
          getMonthItems(),
          getSeasonItems(),
        ])

        if (today.length > 0) setTodayItems(today)
        if (week.length > 0) setWeekItems(week)
        if (month.length > 0) setMonthItems(month)
        if (season.length > 0) setSeasonItems(season)
      } catch (error) {
        console.error("Failed to load dashboard data:", error)
        // 목업 데이터 사용 (이미 초기값으로 설정됨)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    )
  }

  // 동적 데이터 생성
  const keywords = generateTrendingKeywords()
  const aiSuggestions = generateAISuggestions()
  const weatherData = generateWeatherRecommendations(8)

  return (
    <main className="container py-8 space-y-12">
      {/* Hero Section */}
      <section className="text-center space-y-6 py-12">
        <div className="inline-flex items-center gap-2 rounded-full border-2 border-amber-500/30 bg-gradient-to-r from-amber-500/10 to-amber-600/10 px-6 py-3 text-sm font-semibold text-amber-700 dark:text-amber-400">
          <Sparkles className="h-5 w-5" />
          <span>블로그 글감 연구소</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold leading-tight">
          매일 블로그{" "}
          <span className="bg-gradient-to-r from-amber-500 to-amber-600 bg-clip-text text-transparent">
            뭐 쓰지?
          </span>
          <br />
          <span className="text-3xl md:text-5xl text-muted-foreground">
            고민 끝.
          </span>
        </h1>

        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          실시간 트렌드로 글감 찾고, AI로 초안 생성까지.
          <br />
          오늘의 기념일, 인기 키워드를 한눈에 확인하세요.
        </p>

        <div className="flex flex-wrap justify-center gap-4 pt-4">
          <Link
            href="#timeline"
            className="inline-flex h-14 items-center justify-center rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-10 text-lg font-bold text-white shadow-lg shadow-amber-500/30 transition-all hover:shadow-xl hover:shadow-amber-500/40 hover:scale-105"
          >
            <TrendingUp className="h-5 w-5 mr-2" />
            오늘의 글감 보기
          </Link>
          <Link
            href="/writer"
            className="inline-flex h-14 items-center justify-center rounded-xl border-2 border-amber-500/30 bg-white dark:bg-gray-900 px-10 text-lg font-bold transition-all hover:border-amber-500 hover:bg-amber-50 dark:hover:bg-gray-800"
          >
            <Sparkles className="h-5 w-5 mr-2" />
            AI 카피 생성
          </Link>
        </div>
      </section>

      {/* 3 Step Guide */}
      <section className="py-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            3단계로 시작하는 스마트 블로깅
          </h2>
          <p className="text-lg text-muted-foreground">
            복잡한 설정 없이 바로 시작할 수 있습니다
          </p>
        </div>
        <StepGuide steps={steps} />
      </section>

      {/* Main Dashboard */}
      <section id="timeline" className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">글감 타임라인</h2>
          <Link
            href="/calendar"
            className="text-sm text-amber-600 hover:text-amber-700 font-medium"
          >
            전체 캘린더 보기 →
          </Link>
        </div>

        <TrendTabs onTabChange={setCurrentTab}>
          <TrendTabContent value="today">
            <div className="grid gap-6 lg:grid-cols-2">
              <TimelineSection items={todayItems} title="오늘의 글감" />
              <TrendingKeywords keywords={keywords} />
            </div>
          </TrendTabContent>

          <TrendTabContent value="week">
            <div className="grid gap-6 lg:grid-cols-2">
              <TimelineSection items={weekItems} title="이번 주 글감" />
              <TrendingKeywords keywords={keywords} />
            </div>
          </TrendTabContent>

          <TrendTabContent value="month">
            <div className="grid gap-6 lg:grid-cols-2">
              <TimelineSection items={monthItems} title="이번 달 글감" />
              <TrendingKeywords keywords={keywords} />
            </div>
          </TrendTabContent>

          <TrendTabContent value="season">
            <div className="grid gap-6 lg:grid-cols-2">
              <TimelineSection items={seasonItems} title="계절 글감" />
              <TrendingKeywords keywords={keywords} />
            </div>
          </TrendTabContent>
        </TrendTabs>
      </section>

      {/* AI Suggestions */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold">AI 추천 조합</h2>
        <AITopicSuggestion suggestions={aiSuggestions} />
      </section>

      {/* Category Filter */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold">카테고리별 탐색</h2>
        <CategoryFilter
          categories={mockCategories}
          selectedCategories={selectedCategories}
          onCategoryToggle={handleCategoryToggle}
        />
      </section>

      {/* Weather Based Recommendations */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold">날씨 기반 추천</h2>
        <WeatherBasedRecommend
          weather={weatherData.weather}
          recommendations={weatherData.recommendations}
        />
      </section>

      {/* CTA Section */}
      <section className="py-16 text-center">
        <div className="rounded-3xl border-2 border-amber-500/30 bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-amber-950/20 dark:to-amber-900/10 p-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            지금 바로 시작하세요
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            무료로 시작해서 블로그 운영이 얼마나 쉬워지는지 경험해 보세요.
            <br />
            신용카드 등록 없이 바로 사용 가능합니다.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/writer"
              className="inline-flex h-14 items-center justify-center rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-10 text-lg font-bold text-white shadow-lg shadow-amber-500/30 transition-all hover:shadow-xl hover:shadow-amber-500/40 hover:scale-105"
            >
              무료로 시작하기 →
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
