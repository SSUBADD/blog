"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Cloud, CloudRain, Sun, Snowflake, Wind, ArrowRight } from "lucide-react"
import Link from "next/link"

interface WeatherRecommendation {
  topic: string
  description: string
  keywords: string[]
}

interface WeatherBasedRecommendProps {
  weather: {
    condition: "sunny" | "cloudy" | "rainy" | "snowy" | "windy"
    temperature: number
    description: string
  }
  recommendations: WeatherRecommendation[]
}

const weatherIcons = {
  sunny: Sun,
  cloudy: Cloud,
  rainy: CloudRain,
  snowy: Snowflake,
  windy: Wind,
}

const weatherColors = {
  sunny: "from-yellow-500/10 to-orange-500/10 border-yellow-500/20",
  cloudy: "from-gray-500/10 to-gray-600/10 border-gray-500/20",
  rainy: "from-blue-500/10 to-blue-600/10 border-blue-500/20",
  snowy: "from-cyan-500/10 to-blue-500/10 border-cyan-500/20",
  windy: "from-teal-500/10 to-cyan-500/10 border-teal-500/20",
}

export function WeatherBasedRecommend({ weather, recommendations }: WeatherBasedRecommendProps) {
  const WeatherIcon = weatherIcons[weather.condition]
  
  return (
    <Card className={`p-6 bg-gradient-to-br ${weatherColors[weather.condition]} border-2`}>
      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center justify-center h-12 w-12 rounded-full bg-white dark:bg-gray-900">
          <WeatherIcon className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">날씨 기반 추천</h3>
          <p className="text-sm text-muted-foreground">
            {weather.description} {weather.temperature}°C
          </p>
        </div>
      </div>
      
      <div className="space-y-3">
        {recommendations.map((rec, idx) => (
          <div
            key={idx}
            className="p-4 rounded-lg bg-white dark:bg-gray-900 border"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <p className="font-semibold mb-1">{rec.topic}</p>
                <p className="text-sm text-muted-foreground mb-2">
                  {rec.description}
                </p>
                <div className="flex flex-wrap gap-1">
                  {rec.keywords.map((keyword, kidx) => (
                    <span
                      key={kidx}
                      className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary"
                    >
                      #{keyword}
                    </span>
                  ))}
                </div>
              </div>
              
              <Link href={`/writer?topic=${encodeURIComponent(rec.topic)}`}>
                <Button size="sm" variant="outline">
                  작성
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}

