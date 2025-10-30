"use client"

import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import { useRouter } from 'next/navigation'
import { Clock, Sparkles, TrendingUp, Zap } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { CalendarItem, Category } from '@/lib/calendar-loader'
import { cn } from '@/lib/utils'

interface CalendarDetailSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  date: Date | null
  items: CalendarItem[]
  categories: Category[]
}

export function CalendarDetailSheet({
  open,
  onOpenChange,
  date,
  items,
  categories
}: CalendarDetailSheetProps) {
  const router = useRouter()
  
  const getCategoryColor = (catId: string) => {
    const category = categories.find(c => c.id === catId)
    return category?.color || '#f59e0b'
  }
  
  const getCategoryName = (catId: string) => {
    const category = categories.find(c => c.id === catId)
    return category?.name || catId
  }
  
  const getDifficultyLabel = (difficulty: number) => {
    if (difficulty <= 1) return { label: '쉬움', color: 'bg-green-500/10 text-green-500' }
    if (difficulty <= 2) return { label: '보통', color: 'bg-yellow-500/10 text-yellow-500' }
    return { label: '어려움', color: 'bg-red-500/10 text-red-500' }
  }
  
  const handleWriteWithAI = (item: CalendarItem) => {
    const params = new URLSearchParams({
      topic: item.title,
      keywords: item.keywords.join(', ')
    })
    router.push(`/writer?${params.toString()}`)
  }
  
  if (!date) return null
  
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent 
        side="bottom" 
        className="h-[85vh] sm:h-[80vh] overflow-y-auto rounded-t-lg border-t-2 border-primary/50"
      >
        <SheetHeader className="text-left pb-4 border-b">
          <SheetTitle className="text-2xl font-bold text-foreground">
            {format(date, 'M월 d일 (EEE)', { locale: ko })}
          </SheetTitle>
          <SheetDescription>
            {items.length}개의 글감이 있습니다
          </SheetDescription>
        </SheetHeader>
        
        <div className="mt-6 space-y-4">
          {items.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              이 날짜에는 등록된 글감이 없습니다.
            </div>
          ) : (
            items.map((item) => {
              const difficultyInfo = getDifficultyLabel(item.difficulty)
              
              return (
                <div
                  key={item.id}
                  className={cn(
                    "rounded-lg border-2 p-5 transition-all duration-200 bg-card",
                    item.priority === 'high' 
                      ? "border-primary/50 shadow-lg shadow-primary/10"
                      : "border-border shadow-md"
                  )}
                >
                  {/* 헤더: 제목 + 트렌딩 */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <h3 className="text-lg font-bold text-foreground flex-1">
                      {item.title}
                    </h3>
                    {item.trending && (
                      <Badge className="bg-gradient-to-r from-red-500 to-orange-500 text-white border-0 flex items-center gap-1">
                        <TrendingUp className="h-3 w-3" />
                        HOT
                      </Badge>
                    )}
                  </div>
                  
                  {/* 카테고리 */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {item.cat.map((catId) => (
                      <Badge
                        key={catId}
                        variant="outline"
                        style={{ 
                          borderColor: getCategoryColor(catId),
                          color: getCategoryColor(catId)
                        }}
                      >
                        {getCategoryName(catId)}
                      </Badge>
                    ))}
                  </div>
                  
                  {/* 설명 */}
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                    {item.desc}
                  </p>
                  
                  {/* 키워드 */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {item.keywords.map((keyword) => (
                      <Badge key={keyword} variant={"secondary"}>
                        <Sparkles className="h-3 w-3 mr-1" />
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                  
                  {/* 메타 정보 */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="flex items-center gap-2 rounded-lg bg-secondary px-3 py-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <div className="flex-1">
                        <p className="text-xs text-muted-foreground">소요시간</p>
                        <p className="text-sm font-semibold text-foreground">{item.time}분</p>
                      </div>
                    </div>
                    <div className={cn(
                      "flex items-center gap-2 rounded-lg px-3 py-2",
                      difficultyInfo.color
                    )}>
                      <Zap className="h-4 w-4" />
                      <div className="flex-1">
                        <p className="text-xs opacity-70">난이도</p>
                        <p className="text-sm font-semibold">{difficultyInfo.label}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* CTA */}
                  {item.cta && (
                    <div className="mb-4 rounded-lg border border-primary/30 bg-primary/10 px-4 py-2 text-xs text-primary">
                      💡 추천 CTA: {item.cta}
                    </div>
                  )}
                  
                  {/* AI 작성 버튼 */}
                  <Button
                    onClick={() => handleWriteWithAI(item)}
                    className="w-full"
                    size="lg"
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    AI로 이 글감 작성하기
                  </Button>
                </div>
              )
            })
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}

