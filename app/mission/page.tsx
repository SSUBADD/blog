"use client"

import { useEffect, useMemo, useState } from "react"
import { CheckCircle2, Flame, Timer } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

type Mission = {
  id: number
  title: string
  description: string
  duration: string
  category: string
}

const missionList: Mission[] = [
  {
    id: 1,
    title: "이슈 캘린더에서 글감 2개 선택",
    description: "금주 집중 카테고리를 잠금",
    duration: "10분",
    category: "전략",
  },
  {
    id: 2,
    title: "AI 제목 3개 테스트",
    description: "CTR 3% 목표, 헤드라인 기록",
    duration: "15분",
    category: "제작",
  },
  {
    id: 3,
    title: "CTA AB 테스트 로그 남기기",
    description: "전환 데이터 표준화",
    duration: "8분",
    category: "전환",
  },
  {
    id: 4,
    title: "커뮤니티 댓글 2개 이상",
    description: "브랜드 친밀도 확보",
    duration: "7분",
    category: "커뮤니티",
  },
]

export default function MissionPage() {
  const [completed, setCompleted] = useState<number[]>([])
  const [loading, setLoading] = useState(true)

  const progress = useMemo(
    () => Math.round((completed.length / missionList.length) * 100),
    [completed.length]
  )

  // 오늘의 미션 상태 불러오기
  useEffect(() => {
    fetchMissions()
  }, [])

  const fetchMissions = async () => {
    try {
      const response = await fetch('/api/missions')
      const data = await response.json()

      if (data.success && data.missions) {
        const completedIds = data.missions
          .filter((m: any) => m.completed)
          .map((m: any) => m.mission_id)
        setCompleted(completedIds)
      }
      setLoading(false)
    } catch (error) {
      console.error('Error fetching missions:', error)
      setLoading(false)
    }
  }

  const toggleMission = async (id: number) => {
    const isCompleted = completed.includes(id)
    const newCompleted = isCompleted
      ? completed.filter((item) => item !== id)
      : [...completed, id]

    // 낙관적 업데이트
    setCompleted(newCompleted)

    try {
      const response = await fetch('/api/missions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          missionId: id,
          completed: !isCompleted,
        }),
      })

      if (!response.ok) {
        // 실패시 롤백
        setCompleted(completed)
        alert('미션 상태 저장 중 오류가 발생했습니다.')
      }
    } catch (error) {
      console.error('Error toggling mission:', error)
      // 실패시 롤백
      setCompleted(completed)
      alert('미션 상태 저장 중 오류가 발생했습니다.')
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-white/60 bg-white/85 p-6 shadow-[0_20px_60px_rgba(176,140,60,0.12)]">
        <p className="text-sm font-semibold text-amber-700">오늘의 루틴</p>
        <div className="mt-3 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">루틴 체커에서 집중 시간을 기록하세요</h1>
            <p className="mt-2 text-sm text-slate-600">
              체크가 완료되면 streak가 유지되고, 주간 보고서에 바로 반영됩니다.
            </p>
          </div>
          <div className="rounded-2xl border border-amber-100 bg-amber-50/60 px-5 py-3 text-sm text-amber-900">
            <p className="font-semibold">현재 스트릭 5일</p>
            <p className="text-xs">2일만 더 하면 Pro 베타 초대권!</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="rounded-3xl border border-white/70 bg-white shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <CheckCircle2 className="h-5 w-5 text-amber-500" />
              체크리스트
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {missionList.map((mission) => {
              const done = completed.includes(mission.id)
              return (
                <button
                  key={mission.id}
                  onClick={() => toggleMission(mission.id)}
                  className={`flex w-full flex-col rounded-2xl border px-5 py-4 text-left transition ${
                    done
                      ? "border-green-200 bg-green-50/80"
                      : "border-slate-100 bg-white hover:border-amber-200"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <p className="text-base font-semibold text-slate-900">{mission.title}</p>
                    <Badge
                      variant="secondary"
                      className={`rounded-full ${done ? "bg-green-100 text-green-900" : "bg-amber-50 text-amber-800"}`}
                    >
                      {mission.category}
                    </Badge>
                  </div>
                  <p className="mt-1 text-sm text-slate-600">{mission.description}</p>
                  <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
                    <Timer className="h-4 w-4" />
                    {mission.duration}
                  </div>
                </button>
              )
            })}
          </CardContent>
        </Card>

        <Card className="rounded-3xl border border-white/70 bg-white shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Flame className="h-5 w-5 text-amber-500" />
              진행 상황
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="rounded-2xl border border-amber-100 bg-amber-50/60 p-4">
              <p className="text-sm font-medium text-amber-900">오늘 완료율</p>
              <div className="mt-2 flex items-center gap-3">
                <p className="text-3xl font-bold text-amber-900">{progress}%</p>
                <Progress value={progress} className="flex-1" />
              </div>
              <p className="mt-1 text-xs text-amber-800">
                {completed.length}/{missionList.length}개 완료
              </p>
            </div>
            <div className="rounded-2xl border border-white/60 bg-white/80 p-4 text-sm text-slate-600">
              <p className="font-semibold text-slate-800">포커스 메모</p>
              <p className="mt-2">
                캘린더에서 선택한 주제를 오전 11시 전까지 작성하면 몰입도가 가장 높습니다. 오늘도 같은 리듬을 유지해 볼까요?
              </p>
            </div>
            <Button className="w-full rounded-2xl py-5">포커스 세션 기록</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
