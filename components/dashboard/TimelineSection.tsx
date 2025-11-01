"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Flame, Leaf, ShoppingBag, Gift, Snowflake } from "lucide-react"
import Link from "next/link"

interface TimelineItem {
  id: string
  date: string
  title: string
  short: string
  cat: string[]
  keywords: string[]
  trending?: boolean
  priority?: string
}

interface TimelineSectionProps {
  items: TimelineItem[]
  title?: string
}

const iconMap: Record<string, any> = {
  trend: Flame,
  season: Leaf,
  business: ShoppingBag,
  lifestyle: Gift,
  edu: Calendar,
  default: Snowflake,
}

const categoryColors: Record<string, string> = {
  trend: "bg-orange-500/10 text-orange-600 border-orange-500/20",
  season: "bg-green-500/10 text-green-600 border-green-500/20",
  business: "bg-red-500/10 text-red-600 border-red-500/20",
  lifestyle: "bg-purple-500/10 text-purple-600 border-purple-500/20",
  edu: "bg-blue-500/10 text-blue-600 border-blue-500/20",
}

export function TimelineSection({ items, title = "타임라인" }: TimelineSectionProps) {
  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <Calendar className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      
      <div className="space-y-3">
        {items.map((item) => {
          const Icon = iconMap[item.cat[0]] || iconMap.default
          const dateObj = new Date(item.date)
          const dateStr = `${dateObj.getMonth() + 1}/${dateObj.getDate()}`
          
          return (
            <Link key={item.id} href="/writer">
              <div className="flex items-center gap-4 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-all cursor-pointer group">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-muted-foreground">{dateStr}</span>
                    {item.trending && (
                      <Badge variant="secondary" className="text-xs">
                        🔥 인기
                      </Badge>
                    )}
                  </div>
                  <p className="font-semibold truncate">{item.short}</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {item.keywords.slice(0, 3).map((keyword, idx) => (
                      <span
                        key={idx}
                        className={`text-xs px-2 py-0.5 rounded-full border ${
                          categoryColors[item.cat[0]] || categoryColors.trend
                        }`}
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </Card>
  )
}

