'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, TrendingUp, Sparkles } from 'lucide-react'
import { Calendar } from "@/components/ui/calendar"
import { CalendarDetailSheet } from '@/components/CalendarDetailSheet'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  loadMetadata,
  loadMonthData,
  getRecommendedItems,
  getTopKeywords,
  getItemsByDateMap,
  type MonthData,
  type CalendarMeta,
  type CalendarItem
} from '@/lib/calendar-loader'
import { cn } from '@/lib/utils'
import { parseISO, isSameDay } from 'date-fns'

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [monthData, setMonthData] = useState<MonthData | null>(null)
  const [metadata, setMetadata] = useState<CalendarMeta | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [selectedItems, setSelectedItems] = useState<CalendarItem[]>([])
  const [sheetOpen, setSheetOpen] = useState(false)
  const [itemsByDate, setItemsByDate] = useState<Map<string, CalendarItem[]>>(new Map())
  const [daysWithItems, setDaysWithItems] = useState<Date[]>([])

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
      .then(data => {
        setMonthData(data)
        const map = getItemsByDateMap(data)
        setItemsByDate(map)
        const days = Array.from(map.keys()).map(dateStr => parseISO(dateStr))
        setDaysWithItems(days)
      })
      .catch((error) => {
        console.error('Failed to load month data:', error)
        setMonthData(null)
        setItemsByDate(new Map())
        setDaysWithItems([])
      })
      .finally(() => setLoading(false))
  }, [currentDate])

  // 날짜 선택 핸들러
  const handleDateSelect = (date: Date | undefined) => {
    if (!date) {
      setSelectedDate(undefined)
      setSelectedItems([])
      setSheetOpen(false)
      return
    }

    const dateString = format(date, 'yyyy-MM-dd')
    const items = itemsByDate.get(dateString) || []
    
    setSelectedDate(date)
    setSelectedItems(items)
    if (items.length > 0) {
      setSheetOpen(true)
    } else {
      setSheetOpen(false)
    }
  }

  // 월 이동
  const goToPreviousMonth = () => setCurrentDate(prev => subMonths(prev, 1))
  const goToNextMonth = () => setCurrentDate(prev => addMonths(prev, 1))
  const goToToday = () => {
    const today = new Date()
    setCurrentDate(today)
    setSelectedDate(today)
  }
  
  // 추천 글감
  const recommendedItems = monthData ? getRecommendedItems(monthData, { priority: 'high', trending: true, count: 6 }) : []
  
  // 인기 키워드
  const topKeywords = monthData ? getTopKeywords(monthData, 8) : []

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
                    📅 날짜를 선택해 글감을 확인하세요. 점으로 표시된 날에 글감이 있습니다.
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
        <Card className="p-0">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            month={currentDate}
            onMonthChange={setCurrentDate}
            locale={ko}
            modifiers={{
              hasItems: daysWithItems,
            }}
            modifiersStyles={{
              hasItems: {
                position: 'relative',
              }
            }}
            components={{
              DayContent: (props) => {
                const { date, activeModifiers } = props;
                const hasItems = activeModifiers.hasItems;
                const isSelected = activeModifiers.selected;

                return (
                  <div className="relative flex h-full w-full items-center justify-center">
                    {format(date, 'd')}
                    {hasItems && !isSelected && (
                      <div className="absolute bottom-1 h-1 w-1 rounded-full bg-primary" />
                    )}
                  </div>
                );
              }
            }}
            className="w-full"
          />
        </Card>

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
                  onClick={() => handleDateSelect(parseISO(item.date))}
                >
                  <div className="flex items-start gap-2">
                    {item.trending && <span className="text-sm">🔥</span>}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground line-clamp-2">
                        {item.title}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {format(parseISO(item.date), 'M/d (EEE)', { locale: ko })}
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
        </div>
      </div>

      {/* 상세 시트 */}
      {metadata && selectedDate && <CalendarDetailSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        date={selectedDate}
        items={selectedItems}
        categories={metadata.categories}
      />}
    </div>
  )
}
