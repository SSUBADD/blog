"use client"

import { FormEvent, useState } from "react"
import { Activity, LinkIcon, Target } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

const goalOptions = ["트래픽 확대", "리드 전환", "브랜드 인지도", "커뮤니티 구축"]

export default function DiagnosisPage() {
  const [url, setUrl] = useState("")
  const [goal, setGoal] = useState(goalOptions[0])
  const [notes, setNotes] = useState("")
  const [loading, setLoading] = useState(false)
  const [report, setReport] = useState<null | {
    score: number
    summary: string
    strengths: string[]
    issues: string[]
    ctas: string[]
  }>(null)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!url) return
    setLoading(true)

    try {
      const response = await fetch('/api/ai/diagnose-blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url,
          goal,
          notes,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        alert(data.error || '진단 중 오류가 발생했습니다.')
        setLoading(false)
        return
      }

      setReport(data.report)
      setLoading(false)
    } catch (error) {
      console.error('Error diagnosing blog:', error)
      alert('진단 중 오류가 발생했습니다.')
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-white/60 bg-white/85 p-6 shadow-[0_20px_60px_rgba(176,140,60,0.12)]">
        <p className="text-sm font-semibold text-amber-700">블로그 건강 진단</p>
        <h1 className="mt-2 text-2xl font-bold text-slate-900">
          URL을 입력하면 60초 안에 구조·톤·CTA를 분석해 드릴게요
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          실제 AI 분석 연결 전까지는 모의 리포트로 미리 UX를 확인합니다. Pro 플랜에서 리포트를 PDF로 저장 가능해요.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="rounded-3xl border border-white/70 bg-white shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <LinkIcon className="h-5 w-5 text-amber-500" />
              사이트 정보
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <label className="text-sm font-medium text-slate-700">
                블로그 URL
                <Input
                  value={url}
                  onChange={(event) => setUrl(event.target.value)}
                  placeholder="https://bloglab.subad.kr"
                  className="mt-1"
                />
              </label>
              <label className="text-sm font-medium text-slate-700">
                목표
                <select
                  value={goal}
                  onChange={(event) => setGoal(event.target.value)}
                  className="mt-1 w-full rounded-xl border border-amber-100 bg-white px-3 py-2 text-sm"
                >
                  {goalOptions.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </label>
              <label className="text-sm font-medium text-slate-700">
                참고 사항 (선택)
                <Textarea
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                  placeholder="예) 2월 중 리드 50건 확보 목표, 제품 카테고리 3개"
                  className="mt-1"
                />
              </label>
              <Button
                type="submit"
                disabled={loading || !url}
                className="w-full rounded-2xl py-5 text-base font-semibold"
              >
                {loading ? "진단 중..." : "진단 요청"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border border-white/70 bg-white shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Activity className="h-5 w-5 text-amber-500" />
              결과 미리보기
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {report ? (
              <>
                <div className="rounded-2xl border border-amber-100 bg-amber-50/60 px-4 py-4 text-sm text-amber-900">
                  <p className="text-xs font-semibold uppercase text-amber-700">Health Score</p>
                  <p className="mt-2 text-3xl font-bold text-amber-900">{report.score}/100</p>
                  <p className="mt-2 text-slate-800">{report.summary}</p>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-2xl border border-green-100 bg-green-50/80 p-4 text-sm text-green-900">
                    <p className="flex items-center gap-2 font-semibold">
                      <Target className="h-4 w-4" /> 강점
                    </p>
                    <ul className="mt-3 space-y-2 text-green-900/90">
                      {report.strengths.map((item) => (
                        <li key={item} className="rounded-xl bg-white/70 px-3 py-2">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="rounded-2xl border border-rose-100 bg-rose-50/80 p-4 text-sm text-rose-900">
                    <p className="flex items-center gap-2 font-semibold">
                      ⚠️ 개선 포인트
                    </p>
                    <ul className="mt-3 space-y-2 text-rose-900/90">
                      {report.issues.map((item) => (
                        <li key={item} className="rounded-xl bg-white/70 px-3 py-2">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="rounded-2xl border border-white/60 bg-white/80 p-4">
                  <p className="text-sm font-semibold text-slate-800">CTA 제안</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {report.ctas.map((ctaItem) => (
                      <Badge key={ctaItem} variant="secondary" className="rounded-full bg-amber-100 text-amber-900">
                        {ctaItem}
                      </Badge>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="rounded-3xl border border-dashed border-amber-200 bg-amber-50/50 px-6 py-10 text-center text-sm text-amber-800">
                URL을 입력하고 ‘진단 요청’을 누르면 리포트를 바로 확인할 수 있습니다.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
