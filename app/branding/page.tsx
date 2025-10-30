"use client"

import { useEffect, useState } from "react"
import { Lightbulb, ListChecks } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"

type SWOTKey = "S" | "W" | "O" | "T"

const initialState: Record<SWOTKey, string> = {
  S: "",
  W: "",
  O: "",
  T: "",
}

const presetHints: Record<SWOTKey, string[]> = {
  S: ["AI 기반 카피라이팅 경험", "브랜드 톤 & 매뉴얼 보유", "고객사 후기 40건 누적"],
  W: ["SEO 카테고리 최적화 미진", "CTA 실험 데이터 부족", "콘텐츠 업로드 주기 불규칙"],
  O: ["2025 AI 업무 자동화 트렌드", "B2B 교육 시장 확대", "브랜드 협업 제안 증가"],
  T: ["경쟁사의 유료 뉴스레터 확대", "광고 단가 상승", "검색 알고리즘 업데이트"],
}

type SavedSWOT = {
  id: string
  strengths: string
  weaknesses: string
  opportunities: string
  threats: string
  notes: string
  created_at: string
}

export default function BrandingPage() {
  const [swot, setSwot] = useState(initialState)
  const [notes, setNotes] = useState<string[]>([])
  const [savedHistory, setSavedHistory] = useState<SavedSWOT[]>([])
  const [saving, setSaving] = useState(false)

  // 히스토리 불러오기
  useEffect(() => {
    fetchHistory()
  }, [])

  const fetchHistory = async () => {
    try {
      const response = await fetch('/api/swot')
      const data = await response.json()
      if (data.success && data.data) {
        setSavedHistory(data.data)
        // 타임라인 메모로 변환
        const historyNotes = data.data.map((item: SavedSWOT) => {
          const date = new Date(item.created_at).toLocaleString("ko-KR", {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })
          return `${date} · S: ${item.strengths.split("\n")[0] || "-"} | W: ${item.weaknesses.split("\n")[0] || "-"}`
        })
        setNotes(historyNotes)
      }
    } catch (error) {
      console.error('Error fetching SWOT history:', error)
    }
  }

  const handleHint = (key: SWOTKey) => {
    setSwot((prev) => ({
      ...prev,
      [key]: presetHints[key].join("\n"),
    }))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const response = await fetch('/api/swot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          strengths: swot.S,
          weaknesses: swot.W,
          opportunities: swot.O,
          threats: swot.T,
          notes: '',
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        alert(data.error || '저장 중 오류가 발생했습니다.')
        setSaving(false)
        return
      }

      // 히스토리 새로고침
      await fetchHistory()
      alert('SWOT 분석이 저장되었습니다!')
      setSaving(false)
    } catch (error) {
      console.error('Error saving SWOT:', error)
      alert('저장 중 오류가 발생했습니다.')
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-white/60 bg-white/85 p-6 shadow-[0_20px_60px_rgba(176,140,60,0.12)] backdrop-blur-xl">
        <p className="text-sm font-semibold text-amber-700">브랜드 랩</p>
        <h1 className="mt-2 text-2xl font-bold text-slate-900">
          브랜드 SWOT을 구조화하고 팀 메모로 공유하세요
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          힌트를 누르면 추천 문장을 불러오고, 저장 버튼으로 타임라인을 남길 수 있습니다.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="rounded-3xl border border-white/70 bg-white shadow-lg lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <ListChecks className="h-5 w-5 text-amber-500" />
              SWOT 메모
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-5 md:grid-cols-2">
            {(["S", "W", "O", "T"] as SWOTKey[]).map((key) => (
              <div key={key} className="space-y-3 rounded-2xl border border-amber-100 bg-amber-50/40 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">
                      {key === "S"
                        ? "Strength"
                        : key === "W"
                          ? "Weakness"
                          : key === "O"
                            ? "Opportunity"
                            : "Threat"}
                    </p>
                    <p className="text-sm text-slate-600">
                      {key === "S" && "살려야 할 핵심 자산"}
                      {key === "W" && "채워야 할 부분"}
                      {key === "O" && "시장 기회"}
                      {key === "T" && "주의 요소"}
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-xs text-amber-700"
                    onClick={() => handleHint(key)}
                  >
                    힌트
                  </Button>
                </div>
                <Textarea
                  value={swot[key]}
                  onChange={(event) =>
                    setSwot((prev) => ({ ...prev, [key]: event.target.value }))
                  }
                  placeholder="3줄 이내로 핵심 포인트를 적어주세요."
                  className="bg-white/80"
                />
              </div>
            ))}
          </CardContent>
        </Card>
        <Card className="rounded-3xl border border-white/70 bg-white shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Lightbulb className="h-5 w-5 text-amber-500" />
              팀 공유 메모
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-2xl border border-amber-100 bg-amber-50/60 p-4 text-sm text-amber-900">
              저장 버튼을 누르면 메모가 타임라인으로 기록됩니다.
            </div>
            <Button onClick={handleSave} disabled={saving} className="w-full rounded-2xl py-5">
              {saving ? '저장 중...' : '저장 및 공유'}
            </Button>
            <div className="space-y-3">
              {notes.length === 0 ? (
                <p className="text-sm text-slate-500">아직 저장된 메모가 없어요.</p>
              ) : (
                notes.map((note, idx) => (
                  <div
                    key={`${note}-${idx}`}
                    className="rounded-2xl border border-white/60 bg-white/90 px-4 py-3 text-sm text-slate-700"
                  >
                    {note}
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
