"use client"

import { startOfMonth, endOfMonth, eachDayOfInterval, format, isSameMonth, isToday, startOfWeek, endOfWeek, isSameDay } from 'date-fns'
import { ko } from 'date-fns/locale'
import { cn } from '@/lib/utils'
import type { CalendarItem, MonthData } from '@/lib/calendar-loader'
import { getItemsByDateMap } from '@/lib/calendar-loader'

interface CalendarGridProps {
  data: MonthData
  currentDate: Date
  selectedDate: Date | null
  onDateSelect: (date: Date, items: CalendarItem[]) => void
  filteredCategories?: string[]
}

export function CalendarGrid({
  data,
  currentDate,
  selectedDate,
  onDateSelect,
  filteredCategories = []
}: CalendarGridProps) {
  // 월의 첫날과 마지막날
  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  
  // 캘린더 그리드를 위해 주의 시작과 끝 포함
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 }) // 일요일 시작
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 })
  
  // 모든 날짜 배열
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd })
  
  // 날짜별 아이템 맵
  const itemsMap = getItemsByDateMap(data)
  
  // 요일 헤더
  const weekDays = ['일', '월', '화', '수', '목', '금', '토']
  
  // 우선순위에 따른 dot 색상
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500'
      case 'medium':
        return 'bg-primary'
      case 'low':
        return 'bg-muted-foreground'
      default:
        return 'bg-muted'
    }
  }
  
  // 날짜별 필터링된 아이템
  const getFilteredItems = (dateStr: string): CalendarItem[] => {
    const items = itemsMap.get(dateStr) || []
    
    if (filteredCategories.length === 0) {
      return items
    }
    
    return items.filter(item => 
      item.cat.some(cat => filteredCategories.includes(cat))
    )
  }
  
  return (
    <div className="w-full">
      {/* 요일 헤더 */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map((day, i) => (
          <div
            key={day}
            className={cn(
              "text-center py-2 text-sm font-semibold text-muted-foreground",
              i === 0 ? "text-red-500" : i === 6 ? "text-blue-500" : ""
            )}
          >
            {day}
          </div>
        ))}
      </div>
      
      {/* 날짜 그리드 */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((day) => {
          const dateStr = format(day, 'yyyy-MM-dd')
          const items = getFilteredItems(dateStr)
          const isCurrentMonth = isSameMonth(day, currentDate)
          const isSelected = selectedDate && isSameDay(day, selectedDate)
          const isTodayDate = isToday(day)
          const dayOfWeek = day.getDay()
          
          // 우선순위 높은 아이템 찾기
          const highPriorityItem = items.find(item => item.priority === 'high')
          const priorityColor = highPriorityItem 
            ? getPriorityColor(highPriorityItem.priority)
            : items.length > 0 
            ? getPriorityColor(items[0].priority)
            : ''
          
          return (
            <button
              key={dateStr}
              type="button"
              onClick={() => items.length > 0 && onDateSelect(day, items)}
              disabled={items.length === 0}
              className={cn(
                "relative aspect-square p-2 rounded-lg transition-all duration-200",
                "flex flex-col items-center justify-center",
                "hover:shadow-md",
                // 현재 월 여부
                isCurrentMonth ? "text-foreground" : "text-muted-foreground/50",
                // 오늘 날짜
                isTodayDate && "ring-2 ring-primary font-bold",
                // 선택된 날짜
                isSelected && "bg-primary/20",
                // 글감이 있는 날짜
                items.length > 0 && isCurrentMonth && "bg-secondary border hover:bg-secondary/80 cursor-pointer",
                // 글감이 없는 날짜
                items.length === 0 && "cursor-default",
                // 일요일
                dayOfWeek === 0 && !isCurrentMonth && "text-red-500/50",
                // 토요일
                dayOfWeek === 6 && !isCurrentMonth && "text-blue-500/50"
              )}
            >
              {/* 날짜 */}
              <span className={cn(
                "text-sm md:text-base",
                isTodayDate && "font-bold"
              )}>
                {format(day, 'd')}
              </span>
              
              {/* 글감 dot 및 개수 */}
              {items.length > 0 && isCurrentMonth && (
                <div className="flex items-center gap-1 mt-1">
                  <div className={cn(
                    "w-1.5 h-1.5 rounded-full",
                    priorityColor
                  )} />
                  <span className="text-[10px] text-primary font-semibold">
                    {items.length}
                  </span>
                </div>
              )}
              
              {/* 트렌딩 표시 */}
              {items.some(item => item.trending) && isCurrentMonth && (
                <div className="absolute top-1 right-1">
                  <span className="text-[10px]">🔥</span>
                </div>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
