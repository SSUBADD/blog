import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, parseISO, startOfWeek, endOfWeek } from 'date-fns'
import { ko } from 'date-fns/locale'

// 타입 정의
export interface CalendarItem {
  id: string
  date: string
  day: number
  dayName: string
  title: string
  short: string
  cat: string[]
  keywords: string[]
  desc: string
  difficulty: number
  time: number
  priority: 'high' | 'medium' | 'low'
  trending: boolean
  cta?: string
}

export interface WeekData {
  week: number
  dateRange: string
  weekTheme: string
  items: CalendarItem[]
}

export interface MonthData {
  year: number
  month: number
  monthName: string
  theme: string
  weeks: WeekData[]
}

export interface Category {
  id: string
  name: string
  color: string
}

export interface CalendarMeta {
  version: string
  lastUpdated: string
  availableMonths: Array<{
    year: number
    month: number
    file: string
    theme: string
    itemCount: number
    highlights: string[]
  }>
  categories: Category[]
}

/**
 * 메타 데이터 로드
 */
export async function loadMetadata(): Promise<CalendarMeta> {
  const response = await fetch('/data/calendar-meta.json')
  if (!response.ok) {
    throw new Error('Failed to load calendar metadata')
  }
  return response.json()
}

/**
 * 특정 월의 데이터 로드
 */
export async function loadMonthData(year: number, month: number): Promise<MonthData> {
  const fileName = `${year}-${String(month).padStart(2, '0')}.json`
  const response = await fetch(`/data/${fileName}`)
  if (!response.ok) {
    throw new Error(`Failed to load data for ${year}-${month}`)
  }
  return response.json()
}

/**
 * 특정 날짜의 글감 찾기
 */
export function findItemsByDate(data: MonthData, dateStr: string): CalendarItem[] {
  const items: CalendarItem[] = []
  
  for (const week of data.weeks) {
    for (const item of week.items) {
      if (item.date === dateStr) {
        items.push(item)
      }
    }
  }
  
  return items
}

/**
 * 날짜별로 모든 글감을 매핑
 */
export function getItemsByDateMap(data: MonthData): Map<string, CalendarItem[]> {
  const map = new Map<string, CalendarItem[]>()
  
  for (const week of data.weeks) {
    for (const item of week.items) {
      const existing = map.get(item.date) || []
      map.set(item.date, [...existing, item])
    }
  }
  
  return map
}

/**
 * 추천 글감 필터링
 */
export interface RecommendedOptions {
  priority?: 'high' | 'medium' | 'low'
  trending?: boolean
  category?: string
  count?: number
}

export function getRecommendedItems(
  data: MonthData,
  options: RecommendedOptions = {}
): CalendarItem[] {
  let items: CalendarItem[] = []
  
  // 모든 아이템 수집
  for (const week of data.weeks) {
    items.push(...week.items)
  }
  
  // 필터링
  if (options.priority) {
    items = items.filter(item => item.priority === options.priority)
  }
  
  if (options.trending !== undefined) {
    items = items.filter(item => item.trending === options.trending)
  }
  
  if (options.category) {
    items = items.filter(item => item.cat.includes(options.category!))
  }
  
  // 정렬: priority high -> trending -> 최신순
  items.sort((a, b) => {
    if (a.priority === 'high' && b.priority !== 'high') return -1
    if (a.priority !== 'high' && b.priority === 'high') return 1
    if (a.trending && !b.trending) return -1
    if (!a.trending && b.trending) return 1
    return new Date(b.date).getTime() - new Date(a.date).getTime()
  })
  
  // 개수 제한
  if (options.count) {
    items = items.slice(0, options.count)
  }
  
  return items
}

/**
 * 이번 주 글감 가져오기
 */
export function getThisWeekItems(data: MonthData): CalendarItem[] {
  const now = new Date()
  const weekStart = startOfWeek(now, { weekStartsOn: 0 }) // 일요일 시작
  const weekEnd = endOfWeek(now, { weekStartsOn: 0 })
  
  let items: CalendarItem[] = []
  
  for (const week of data.weeks) {
    for (const item of week.items) {
      const itemDate = parseISO(item.date)
      if (itemDate >= weekStart && itemDate <= weekEnd) {
        items.push(item)
      }
    }
  }
  
  return items
}

/**
 * 카테고리별 통계
 */
export function getCategoryStats(data: MonthData): Record<string, number> {
  const stats: Record<string, number> = {}
  
  for (const week of data.weeks) {
    for (const item of week.items) {
      for (const cat of item.cat) {
        stats[cat] = (stats[cat] || 0) + 1
      }
    }
  }
  
  return stats
}

/**
 * 인기 키워드 추출
 */
export function getTopKeywords(data: MonthData, limit: number = 10): Array<{ keyword: string; count: number }> {
  const keywordCount: Record<string, number> = {}
  
  for (const week of data.weeks) {
    for (const item of week.items) {
      for (const keyword of item.keywords) {
        keywordCount[keyword] = (keywordCount[keyword] || 0) + 1
      }
    }
  }
  
  return Object.entries(keywordCount)
    .map(([keyword, count]) => ({ keyword, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit)
}
