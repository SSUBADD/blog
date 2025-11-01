import { loadMonthData, getThisWeekItems, getRecommendedItems, CalendarItem } from './calendar-loader'

/**
 * 오늘의 글감 가져오기
 */
export async function getTodayItems(): Promise<CalendarItem[]> {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth() + 1
  
  try {
    const data = await loadMonthData(year, month)
    const today = now.toISOString().split('T')[0]
    
    // 오늘 날짜의 글감 찾기
    let items: CalendarItem[] = []
    for (const week of data.weeks) {
      for (const item of week.items) {
        if (item.date === today) {
          items.push(item)
        }
      }
    }
    
    // 오늘 글감이 없으면 가장 가까운 미래 글감 반환
    if (items.length === 0) {
      items = getRecommendedItems(data, { trending: true, count: 3 })
    }
    
    return items
  } catch (error) {
    console.error('Failed to load today items:', error)
    return []
  }
}

/**
 * 이번 주 글감 가져오기
 */
export async function getWeekItems(): Promise<CalendarItem[]> {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth() + 1
  
  try {
    const data = await loadMonthData(year, month)
    return getThisWeekItems(data)
  } catch (error) {
    console.error('Failed to load week items:', error)
    return []
  }
}

/**
 * 이번 달 글감 가져오기
 */
export async function getMonthItems(): Promise<CalendarItem[]> {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth() + 1
  
  try {
    const data = await loadMonthData(year, month)
    return getRecommendedItems(data, { count: 10 })
  } catch (error) {
    console.error('Failed to load month items:', error)
    return []
  }
}

/**
 * 계절 글감 가져오기 (현재 달 + 다음 달)
 */
export async function getSeasonItems(): Promise<CalendarItem[]> {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth() + 1
  
  try {
    const currentData = await loadMonthData(year, month)
    let items = getRecommendedItems(currentData, { category: 'season', count: 5 })
    
    // 다음 달 데이터도 시도
    try {
      const nextMonth = month === 12 ? 1 : month + 1
      const nextYear = month === 12 ? year + 1 : year
      const nextData = await loadMonthData(nextYear, nextMonth)
      const nextItems = getRecommendedItems(nextData, { category: 'season', count: 3 })
      items = [...items, ...nextItems]
    } catch {
      // 다음 달 데이터가 없으면 무시
    }
    
    return items
  } catch (error) {
    console.error('Failed to load season items:', error)
    return []
  }
}

/**
 * 인기 키워드 생성 (목업 데이터 기반)
 */
export function generateTrendingKeywords() {
  const now = new Date()
  const month = now.getMonth() + 1
  
  // 11월 키워드
  if (month === 11) {
    return [
      { text: "블랙프라이데이", count: 8500, trend: "up" as const },
      { text: "김장", count: 6200, trend: "up" as const },
      { text: "입동", count: 5800, trend: "up" as const },
      { text: "겨울패션", count: 4500, trend: "stable" as const },
      { text: "연말정산", count: 4200, trend: "up" as const },
      { text: "빼빼로데이", count: 3800, trend: "up" as const },
      { text: "난방", count: 3500, trend: "up" as const },
      { text: "가성비", count: 3200, trend: "stable" as const },
      { text: "선물추천", count: 2900, trend: "up" as const },
    ]
  }
  
  // 12월 키워드
  if (month === 12) {
    return [
      { text: "크리스마스", count: 9500, trend: "up" as const },
      { text: "연말선물", count: 7200, trend: "up" as const },
      { text: "새해목표", count: 6800, trend: "up" as const },
      { text: "겨울여행", count: 5500, trend: "stable" as const },
      { text: "연말결산", count: 5200, trend: "up" as const },
      { text: "파티룩", count: 4800, trend: "up" as const },
      { text: "홈파티", count: 4500, trend: "up" as const },
      { text: "베이킹", count: 3200, trend: "stable" as const },
      { text: "연말세일", count: 2900, trend: "up" as const },
    ]
  }
  
  // 기본 키워드
  return [
    { text: "트렌드", count: 5000, trend: "stable" as const },
    { text: "건강", count: 4500, trend: "up" as const },
    { text: "여행", count: 4200, trend: "stable" as const },
    { text: "패션", count: 3800, trend: "up" as const },
    { text: "요리", count: 3500, trend: "stable" as const },
    { text: "운동", count: 3200, trend: "up" as const },
    { text: "재테크", count: 2900, trend: "up" as const },
    { text: "자기계발", count: 2600, trend: "stable" as const },
    { text: "인테리어", count: 2400, trend: "up" as const },
  ]
}

/**
 * AI 조합 추천 생성
 */
export function generateAISuggestions() {
  const now = new Date()
  const month = now.getMonth() + 1
  
  if (month === 11) {
    return [
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
  }
  
  if (month === 12) {
    return [
      {
        combination: "크리스마스 + 선물",
        description: "센스있는 크리스마스 선물 아이디어",
        keywords: ["선물", "크리스마스", "추천"],
      },
      {
        combination: "연말결산 + 목표",
        description: "2025년 회고와 2026년 목표 설정하기",
        keywords: ["회고", "목표", "계획"],
      },
      {
        combination: "홈파티 + 레시피",
        description: "크리스마스 홈파티 메뉴 완벽 가이드",
        keywords: ["파티", "요리", "레시피"],
      },
    ]
  }
  
  return [
    {
      combination: "트렌드 + 분석",
      description: "최신 트렌드 분석과 인사이트",
      keywords: ["트렌드", "분석", "인사이트"],
    },
    {
      combination: "건강 + 루틴",
      description: "건강한 일상 루틴 만들기",
      keywords: ["건강", "루틴", "습관"],
    },
    {
      combination: "재테크 + 투자",
      description: "초보자를 위한 재테크 시작하기",
      keywords: ["재테크", "투자", "저축"],
    },
  ]
}

/**
 * 날씨 기반 추천 생성
 */
export function generateWeatherRecommendations(temperature: number) {
  if (temperature < 5) {
    return {
      weather: {
        condition: "snowy" as const,
        temperature,
        description: "매우 추운 날씨",
      },
      recommendations: [
        {
          topic: "겨울 패딩 추천",
          description: "영하의 날씨에 필요한 따뜻한 패딩",
          keywords: ["패딩", "겨울", "보온"],
        },
        {
          topic: "따뜻한 차 레시피",
          description: "몸을 녹여주는 건강한 차",
          keywords: ["차", "건강", "따뜻한"],
        },
      ],
    }
  }
  
  if (temperature < 15) {
    return {
      weather: {
        condition: "cloudy" as const,
        temperature,
        description: "쌀쌀한 날씨",
      },
      recommendations: [
        {
          topic: "가을 레이어드 코디",
          description: "환절기 스타일링 완벽 가이드",
          keywords: ["패션", "레이어드", "코디"],
        },
        {
          topic: "면역력 높이는 음식",
          description: "환절기 건강 지키는 식단",
          keywords: ["건강", "면역력", "음식"],
        },
      ],
    }
  }
  
  return {
    weather: {
      condition: "sunny" as const,
      temperature,
      description: "화창한 날씨",
    },
    recommendations: [
      {
        topic: "나들이 명소 추천",
        description: "날씨 좋은 날 가기 좋은 곳",
        keywords: ["여행", "나들이", "추천"],
      },
      {
        topic: "야외 활동 아이디어",
        description: "화창한 날 즐기는 액티비티",
        keywords: ["야외", "활동", "레저"],
      },
    ],
  }
}

