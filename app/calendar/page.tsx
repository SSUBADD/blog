"use client"

import { useEffect, useState } from 'react'
import { format, addMonths, subMonths } from 'date-fns'
import { ko } from 'date-fns/locale'
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, TrendingUp, Sparkles, BarChart3 } from 'lucide-react'
import { CalendarGrid } from '@/components/CalendarGrid'
import { CalendarDetailSheet } from '@/components/CalendarDetailSheet'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  loadMetadata,
  loadMonthData,
  getRecommendedItems,
  getThisWeekItems,
  getCategoryStats,
  getTopKeywords,
  type MonthData,
  type CalendarMeta,
  type CalendarItem
} from '@/lib/calendar-loader'
import { cn } from '@/lib/utils'

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [monthData, setMonthData] = useState<MonthData | null>(null)
  const [metadata, setMetadata] = useState<CalendarMeta | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedItems, setSelectedItems] = useState<CalendarItem[]>([])
  const [sheetOpen, setSheetOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  // 메타데이터 로드
  useEffect(() => {
    loadMetadata()
      .then(setMetadata)
      .catch(console.error)
  }, [])

  // 월 데이터 로드
  useEffect(() => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth() + 1

    setLoading(true)
    loadMonthData(year, month)
      .then(setMonthData)
      .catch((error) => {
        console.error('Failed to load month data:', error)
        setMonthData(null)
      })
      .finally(() => setLoading(false))
  }, [currentDate])

  // 날짜 선택 핸들러
  const handleDateSelect = (date: Date, items: CalendarItem[]) => {
    setSelectedDate(date)
    setSelectedItems(items)
    setSheetOpen(true)
  }

  // 월 이동
  const goToPreviousMonth = () => setCurrentDate(prev => subMonths(prev, 1))
  const goToNextMonth = () => setCurrentDate(prev => addMonths(prev, 1))
  const goToToday = () => setCurrentDate(new Date())

  // 추천 글감
  const recommendedItems = monthData ? getRecommendedItems(monthData, { priority: 'high', trending: true, count: 6 }) : []
  
  // 이번 주 글감
  const thisWeekItems = monthData ? getThisWeekItems(monthData) : []
  
  // 카테고리 통계
  const categoryStats = monthData ? getCategoryStats(monthData) : {}
  
  // 인기 키워드
  const topKeywords = monthData ? getTopKeywords(monthData, 8) : []

  // 필터링된 카테고리 배열
  const filteredCategories = selectedCategory ? [selectedCategory] : []

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">캘린더 로딩 중...</p>
        </div>
      </div>
    )
  }

  if (!monthData || !metadata) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <CalendarIcon className="w-16 h-16 text-muted-foreground/20 mx-auto" />
          <p className="text-muted-foreground">캘린더 데이터를 불러올 수 없습니다.</p>
          <Button onClick={() => window.location.reload()}>다시 시도</Button>
        </div>
      </div>
    )
  }

  const totalItems = Object.values(categoryStats).reduce((sum, count) => sum + count, 0)

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <Card>
        <CardContent className="p-6">
            <div className="flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-3">
                    <h1 className="text-3xl font-bold text-foreground">
                        {format(currentDate, 'yyyy년 M월', { locale: ko })}
                    </h1>
                    <Badge variant={"outline"} className="border-primary/50 text-primary">
                        {monthData.theme}
                    </Badge>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">
                    📅 매일 새로운 글감으로 콘텐츠 고민 해결
                    </p>
                </div>
                
                {/* 월 이동 컨트롤 */}
                <div className="flex items-center gap-2">
                    <Button
                    variant="outline"
                    size="icon"
                    onClick={goToPreviousMonth}
                    
                    >
                    <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                    variant="outline"
                    onClick={goToToday}
                    
                    >
                    오늘
                    </Button>
                    <Button
                    variant="outline"
                    size="icon"
                    onClick={goToNextMonth}
                    
                    >
                    <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* 메인 캘린더 */}
        <div className="space-y-4">
          {/* 카테고리 필터 */}
          <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-primary" />
                    카테고리 필터
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex flex-wrap gap-2">
                <button
                    type="button"
                    onClick={() => setSelectedCategory(null)}
                    className={cn(
                    "rounded-full px-4 py-2 text-sm font-medium transition-all",
                    selectedCategory === null
                        ? "bg-primary text-primary-foreground shadow-md"
                        : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                    )}
                >
                    전체 ({totalItems})
                </button>
                {metadata.categories.map((cat) => (
                    <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id)}
                    className={cn(
                        "rounded-full px-4 py-2 text-sm font-medium transition-all",
                        selectedCategory === cat.id
                        ? "text-white shadow-md"
                        : "hover:opacity-80"
                    )}
                    style={{
                        backgroundColor: selectedCategory === cat.id ? cat.color : `${cat.color}20`,
                        color: selectedCategory === cat.id ? 'white' : cat.color
                    }}
                    >
                    {cat.name} ({categoryStats[cat.id] || 0})
                    </button>
                ))}
                </div>
            </CardContent>
          </Card>
          
          {/* 캘린더 그리드 */}
          <Card className="p-6">
            <CalendarGrid
              data={monthData}
              currentDate={currentDate}
              selectedDate={selectedDate}
              onDateSelect={handleDateSelect}
              filteredCategories={filteredCategories}
            />
          </Card>
        </div>

        {/* 사이드바 */}
        <div className="space-y-4">
          {/* HOT 추천 글감 */}
          <Card className="border-2 border-primary/50">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-primary">
                <TrendingUp className="h-5 w-5" />
                HOT 추천 글감
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {recommendedItems.slice(0, 4).map((item) => (
                <div
                  key={item.id}
                  className="rounded-lg border bg-card p-3 cursor-pointer hover:shadow-md transition-all hover:border-primary/50"
                  onClick={() => handleDateSelect(new Date(item.date), [item])}
                >
                  <div className="flex items-start gap-2">
                    {item.trending && <span className="text-sm">🔥</span>}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground line-clamp-2">
                        {item.title}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {format(new Date(item.date), 'M/d (EEE)', { locale: ko })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              {recommendedItems.length === 0 && (
                <p className="text-sm text-center text-muted-foreground py-4">
                  추천 글감이 없습니다
                </p>
              )}
            </CardContent>
          </Card>

          {/* 인기 키워드 */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-primary">
                <Sparkles className="h-5 w-5" />
                인기 키워드
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {topKeywords.map(({ keyword, count }) => (
                  <Badge
                    key={keyword}
                    variant="secondary"
                  >
                    #{keyword} <span className="ml-1 text-xs opacity-70">({count})</span>
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 활용 팁 */}
          <Card className="bg-secondary/50 border-primary/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-primary">💡 활용 팁</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-foreground/80">
                <li>✨ 날짜를 클릭해 상세 정보를 확인하세요</li>
                <li>🎯 카테고리별로 필터링해 보세요</li>
                <li>🔥 HOT 글감은 트렌딩 주제입니다</li>
                <li>📝 AI 작성기로 바로 연결됩니다</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 상세 시트 */}
      {metadata && <CalendarDetailSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        date={selectedDate}
        items={selectedItems}
        categories={metadata.categories}
      />}
    </div>
  )
}
