// app/api/dashboard/route.ts
import { NextResponse } from 'next/server';
import googleTrends from 'google-trends-api';
import { promises as fs } from 'fs';
import path from 'path';
import { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, parseISO, isWithinInterval, format } from 'date-fns';

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

    // For this example, we'll just read the current month's file.
    // A real implementation might need to read multiple files for 'seasonal' or 'weekly' tabs spanning two months.
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
    
    return filteredItems.slice(0, 10); // Limit items for display

  } catch (error) {
    console.error("Error fetching timeline data:", error);
    // Return a default or empty array in case of error (e.g., file not found)
    return [
        { id: 1, date: '11/1', title: '김치의 날', icon: '🔥', category: 'event' },
        { id: 2, date: '11/7', title: '입동', icon: '🍂', category: 'season' },
    ];
  }
}

// Fetch popular keywords from Google Trends
async function getPopularKeywords() {
  try {
    const trendsData = await googleTrends.dailyTrends({ geo: 'KR' });
    const trends = JSON.parse(trendsData).default.trendingSearchesDays[0].trendingSearches;
    return trends.slice(0, 9).map((trend: any, index: number) => ({
      keyword: trend.title.query,
      rank: 9 - index, // Simple ranking
    }));
  } catch (error) {
    console.error("Error fetching popular keywords:", error);
    return [
      { keyword: '블랙프라이데이', rank: 9 },
      { keyword: '패딩', rank: 8 },
    ];
  }
}

// Fetch trend chart data for the top keyword
async function getTrendChartData(topKeyword: string) {
    if (!topKeyword) return [];
    try {
        const interestData = await googleTrends.interestOverTime({
            keyword: topKeyword,
            startTime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
            geo: 'KR',
        });
        const timelineData = JSON.parse(interestData).default.timelineData;
        return timelineData.map((d: any) => ({
            date: d.formattedAxisTime,
            value: d.value[0],
        }));
    } catch (error) {
        console.error("Error fetching trend chart data:", error);
        return [
            { date: '10/25', value: 120 },
            { date: '10/26', value: 200 },
        ];
    }
}

// Fetch weather data
async function getWeatherData() {
  try {
    // IMPORTANT: Replace with your own OpenWeatherMap API key in .env.local
    const apiKey = process.env.OPENWEATHER_API_KEY || 'YOUR_API_KEY_HERE';
    if (apiKey === 'YOUR_API_KEY_HERE') {
        throw new Error('OpenWeatherMap API key is not configured.');
    }
    const city = 'Seoul'; // or get user's location
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
    // Return fallback data on error
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

  // Fetch all data in parallel
  const popularKeywords = await getPopularKeywords();
  const topKeyword = popularKeywords.length > 0 ? popularKeywords.reduce((a, b) => a.rank > b.rank ? a : b).keyword : '마케팅';
  
  const [timeline, trendChart, weather] = await Promise.all([
    getTimelineData(tab),
    getTrendChartData(topKeyword),
    getWeatherData(),
  ]);

  // Filter timeline by category if provided
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
    trendChart,
    aiRecommendation,
    weather,
    categories: ['계절', '이벤트', '쇼핑', '건강', '여행'],
  });
}