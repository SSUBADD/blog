"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, CalendarDays } from "lucide-react"
import Link from "next/link"

export default function PlanPage() {
  return (
    <div className="space-y-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold leading-tight text-foreground">
              블로그 계획
            </h1>
            <p className="text-base text-muted-foreground">
              미션과 루틴을 통해 블로그 운영을 체계적으로 관리하세요.
            </p>
          </div>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <CalendarDays className="h-5 w-5 text-primary" />
              루틴 & 미션
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-3 rounded-lg bg-primary/10 px-4 py-3 text-primary">
              <CheckCircle2 className="h-5 w-5" />
              오늘 미션 2/4 완료 · 집중 시간 35분
            </div>
            <ul className="space-y-3">
              <li className="flex items-center justify-between rounded-lg border px-4 py-3">
                <span>전날 퍼포먼스 리뷰</span>
                <Badge variant="secondary">
                  완료
                </Badge>
              </li>
              <li className="flex items-center justify-between rounded-lg border px-4 py-3">
                <span>AI 제목 3개 테스트</span>
                <Badge>
                  진행 중
                </Badge>
              </li>
              <li className="flex items-center justify-between rounded-lg border px-4 py-3">
                <span>CTA AB 테스트 기록</span>
                <Badge variant="outline">
                  예정
                </Badge>
              </li>
            </ul>
            <Button asChild className="mt-2 w-full">
              <Link href="/mission">미션 업데이트</Link>
            </Button>
          </CardContent>
        </Card>
    </div>
  )
}
