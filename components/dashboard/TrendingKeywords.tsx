"use client"

import { Card } from "@/components/ui/card"
import { TrendingUp } from "lucide-react"
import Link from "next/link"

interface Keyword {
  text: string
  count: number
  trend: "up" | "down" | "stable"
}

interface TrendingKeywordsProps {
  keywords: Keyword[]
}

export function TrendingKeywords({ keywords }: TrendingKeywordsProps) {
  const maxCount = Math.max(...keywords.map((k) => k.count))
  
  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">실시간 인기 키워드</h3>
      </div>
      
      <div className="flex flex-wrap gap-3">
        {keywords.map((keyword, idx) => {
          const size = Math.max(0.8, (keyword.count / maxCount) * 1.5)
          const fontSize = `${size}rem`
          
          return (
            <Link key={idx} href={`/writer?keyword=${encodeURIComponent(keyword.text)}`}>
              <div
                className="inline-flex items-center gap-1 px-4 py-2 rounded-full bg-gradient-to-r from-amber-500/10 to-amber-600/10 hover:from-amber-500/20 hover:to-amber-600/20 border border-amber-500/20 cursor-pointer transition-all hover:scale-105"
                style={{ fontSize }}
              >
                <span className="font-semibold text-amber-700 dark:text-amber-400">
                  {keyword.text}
                </span>
                {keyword.trend === "up" && (
                  <span className="text-green-600 text-xs">↑</span>
                )}
                {keyword.trend === "down" && (
                  <span className="text-red-600 text-xs">↓</span>
                )}
              </div>
            </Link>
          )
        })}
      </div>
      
      <p className="text-xs text-muted-foreground mt-4 text-center">
        클릭하면 AI 카피 생성 페이지로 이동합니다
      </p>
    </Card>
  )
}

