'use client'

import { useEffect, useState } from 'react'

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowRight, Cpu, Thermometer } from 'lucide-react'
import Link from 'next/link'

// Define types for our dashboard data
interface TimelineItem {
  id: number;
  date: string;
  title: string;
  icon: string;
}

interface PopularKeyword {
  keyword: string;
  rank: number;
}

interface TrendChartData {
  date: string;
  value: number;
}

interface DashboardData {
  timeline: TimelineItem[];
  popularKeywords: PopularKeyword[];
  trendChart: TrendChartData[];
  aiRecommendation: {
    combination: string[];
    prompt: string;
  };
  weather: {
    temp: number;
    condition: string;
    recommendation: string;
  };
  categories: string[];
}


export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [activeTab, setActiveTab] = useState('today')
  const [activeCategories, setActiveCategories] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      const params = new URLSearchParams({
        tab: activeTab,
        categories: activeCategories.join(','),
      })
      try {
        const response = await fetch(`/api/dashboard?${params.toString()}`)
        const result = await response.json()
        setData(result)
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error)
        // Handle error state if needed
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [activeTab, activeCategories])

  const toggleCategory = (category: string) => {
    setActiveCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category) 
        : [...prev, category]
    )
  }

  const getKeywordSize = (rank: number) => {
    if (rank >= 7) return 'text-xl'
    if (rank >= 4) return 'text-lg'
    return 'text-base'
  }

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">대시보드 데이터를 불러오는 중...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="today">오늘</TabsTrigger>
          <TabsTrigger value="weekly">이번주</TabsTrigger>
          <TabsTrigger value="monthly">이번달</TabsTrigger>
          <TabsTrigger value="seasonal">계절</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>📅 타임라인 (날짜별 글감)</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-4 text-sm">
              {data.timeline.map(item => (
                <span key={item.id} className="font-medium">{`${item.date} ${item.title} ${item.icon}`}</span>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>🔥 실시간 인기 키워드</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap items-center gap-4">
              {data.popularKeywords.sort((a,b) => b.rank - a.rank).map(kw => (
                <Badge key={kw.keyword} variant="outline" className={`${getKeywordSize(kw.rank)} font-bold py-2 px-4`}>
                  {kw.keyword}
                </Badge>
              ))}
            </CardContent>
          </Card>


        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Cpu size={20} />
                AI 글감 조합 추천
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-center gap-2">
                <Badge variant="default" className="text-base">{data.aiRecommendation.combination[0]}</Badge>
                <span className="font-bold">+</span>
                <Badge variant="default" className="text-base">{data.aiRecommendation.combination[1]}</Badge>
              </div>
              <Button asChild className="w-full">
                <Link href={`/writer?prompt=${encodeURIComponent(data.aiRecommendation.prompt)}`}>
                  바로 AI 카피 생성 <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>🎯 카테고리별 필터</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {data.categories.map(cat => (
                <Button 
                  key={cat} 
                  variant={activeCategories.includes(cat) ? 'default' : 'outline'}
                  onClick={() => toggleCategory(cat)}
                >
                  {cat}
                </Button>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Thermometer size={20} />
                날씨 기반 추천
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-3">
              <p className='font-bold text-lg'>{`오늘 ${data.weather.condition} ${data.weather.temp}°C`}</p>
              <Button asChild variant="secondary" className="w-full">
                <Link href={`/writer?prompt=${encodeURIComponent(data.weather.recommendation)}`}>
                  {`→ "${data.weather.recommendation}" AI 카피 생성`}
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}