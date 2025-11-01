// app/api/dashboard/route.ts
import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, parseISO, isWithinInterval, format, type Interval } from 'date-fns';

// --- Type Definitions ---
interface CalendarItem {
  id: string;
  date: string; // "yyyy-MM-dd"
  title: string;
  icon: string; // Emoji
  category: string;
}

// --- Data Fetching Functions ---

// Fetch timeline data from local JSON files
async function getTimelineData(tab: string): Promise<CalendarItem[]> {
  try {
    const now = new Date();
    let interval: Interval;

    switch (tab) {
      case 'weekly':
        interval = { start: startOfWeek(now, { weekStartsOn: 1 }), end: endOfWeek(now, { weekStartsOn: 1 }) };
        break;
      case 'monthly':
        interval = { start: startOfMonth(now), end: endOfMonth(now) };
        break;
      case 'seasonal':
        // Example: current month + next 2 months
        interval = { start: startOfMonth(now), end: endOfMonth(new Date(now.getFullYear(), now.getMonth() + 2, 1)) };
        break;
      default: // 'today'
        interval = { start: startOfDay(now), end: endOfDay(now) };
    }

    const fileName = `${format(now, 'yyyy-MM')}.json`;
    const filePath = path.join(process.cwd(), 'public', 'data', fileName);
    
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const monthData = JSON.parse(fileContent);

    const allItems: CalendarItem[] = monthData.weeks.flatMap((week: any) => 
        week.items.map((item: any) => ({
            id: item.id,
            date: item.date,
            title: item.title,
            icon: item.trending ? '🔥' : '📄', // Simple icon logic
            category: item.cat[0] || 'general'
        }))
    );

    const filteredItems = allItems.filter(item => isWithinInterval(parseISO(item.date), interval));
    
    return filteredItems.slice(0, 10);

  } catch (error) {
    console.error("Error fetching timeline data:", error);
    return [
        { id: 1, date: '11/1', title: '김치의 날', icon: '🔥', category: 'event' },
        { id: 2, date: '11/7', title: '입동', icon: '🍂', category: 'season' },
    ];
  }
}

// Fetch weather data
async function getWeatherData() {
  try {
    const apiKey = process.env.OPENWEATHER_API_KEY || 'YOUR_API_KEY_HERE';
    if (apiKey === 'YOUR_API_KEY_HERE') {
        throw new Error('OpenWeatherMap API key is not configured.');
    }
    const city = 'Seoul';
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=kr`;

    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch weather data');
    
    const data = await response.json();

    const temp = Math.round(data.main.temp);
    let condition = data.weather[0].description || '맑음';

    let recommendation = '블로그 글감 고민하기 좋은 날씨';
    if (temp <= 5) recommendation = '따뜻한 실내에서 할 수 있는 활동 추천';
    if (temp >= 25) recommendation = '더운 여름을 이기는 시원한 아이템 추천';
    if (data.weather[0].main.includes('Rain')) recommendation = '비 오는 날 감성 글감 추천';
    if (data.weather[0].main.includes('Snow')) recommendation = '눈 오는 날 특별한 글감 추천';

    return { temp, condition, recommendation };

  } catch (error) {
    console.error("Error fetching weather data:", error);
    return {
      temp: 10,
      condition: '날씨 정보 없음',
      recommendation: '오늘의 추천 활동',
    };
  }
}


// --- Main API Handler ---
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const tab = searchParams.get('tab') || 'today';
  const categories = searchParams.get('categories')?.split(',').filter(Boolean) || [];

  const popularKeywords = [
    { keyword: '샘플 키워드1', rank: 9 },
    { keyword: '샘플 키워드2', rank: 8 },
  ];
  const topKeyword = '샘플';

  const [timeline, weather] = await Promise.all([
    getTimelineData(tab),
    getWeatherData(),
  ]);

  const filteredTimeline = categories.length > 0 
    ? timeline.filter(item => categories.includes(item.category))
    : timeline;

  const aiRecommendation = {
      combination: [topKeyword, popularKeywords[1]?.keyword || '세일'],
      prompt: `${topKeyword} ${popularKeywords[1]?.keyword || '세일'} 관련 블로그 글 써줘`,
  };

  return NextResponse.json({
    timeline: filteredTimeline,
    popularKeywords,
    aiRecommendation,
    weather,
    categories: ['계절', '이벤트', '쇼핑', '건강', '여행'],
  });
}
