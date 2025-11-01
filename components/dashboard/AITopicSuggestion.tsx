"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Sparkles, ArrowRight } from "lucide-react"
import Link from "next/link"

interface TopicSuggestion {
  combination: string
  description: string
  keywords: string[]
}

interface AITopicSuggestionProps {
  suggestions: TopicSuggestion[]
}

export function AITopicSuggestion({ suggestions }: AITopicSuggestionProps) {
  return (
    <Card className="p-6 bg-gradient-to-br from-amber-50/50 to-amber-100/30 dark:from-amber-950/20 dark:to-amber-900/10 border-amber-200 dark:border-amber-800">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="h-5 w-5 text-amber-600" />
        <h3 className="text-lg font-semibold">AI 글감 조합 추천</h3>
      </div>
      
      <div className="space-y-3">
        {suggestions.map((suggestion, idx) => (
          <div
            key={idx}
            className="p-4 rounded-lg bg-white dark:bg-gray-900 border border-amber-200 dark:border-amber-800"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <p className="font-semibold text-amber-900 dark:text-amber-100 mb-1">
                  {suggestion.combination}
                </p>
                <p className="text-sm text-muted-foreground mb-2">
                  {suggestion.description}
                </p>
                <div className="flex flex-wrap gap-1">
                  {suggestion.keywords.map((keyword, kidx) => (
                    <span
                      key={kidx}
                      className="text-xs px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300"
                    >
                      #{keyword}
                    </span>
                  ))}
                </div>
              </div>
              
              <Link href={`/writer?topic=${encodeURIComponent(suggestion.combination)}`}>
                <Button
                  size="sm"
                  className="bg-amber-600 hover:bg-amber-700 text-white"
                >
                  <Sparkles className="h-4 w-4 mr-1" />
                  생성
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 text-center">
        <Link href="/writer">
          <Button variant="outline" className="w-full border-amber-300 dark:border-amber-700">
            더 많은 조합 보기
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </Link>
      </div>
    </Card>
  )
}

