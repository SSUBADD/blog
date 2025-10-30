"use client"

import { Suspense, useMemo, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Loader2, PenSquare, Sparkles } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

type Mode = "title" | "body" | "sns"

const modeCopy: Record<Mode, { label: string; description: string }> = {
  title: {
    label: "제목 실험",
    description: "CTR 3% 이상 목표, 3가지 버전",
  },
  body: {
    label: "본문/개요",
    description: "SEO H2/H3 구조 포함",
  },
  sns: {
    label: "SNS 티저",
    description: "인스타/뉴스레터용 요약",
  },
}

const tones = ["인사이트 중심", "친근한 설명", "세일즈 집중", "데이터 기반"]
const personas = ["브랜드 대표", "콘텐츠 마케터", "카피라이터", "AI 어시스턴트"]
const ctas = ["상담 예약", "뉴스레터 구독", "이벤트 신청", "제품 비교"]

function WriterContent() {
  const params = useSearchParams()
  const derivedTopic = params.get("title") ?? ""
  const derivedKeywords = params.get("keywords") ?? ""

  const [mode, setMode] = useState<Mode>("title")
  const [topic, setTopic] = useState(derivedTopic)
  const [keywords, setKeywords] = useState(derivedKeywords)
  const [tone, setTone] = useState(tones[0])
  const [persona, setPersona] = useState(personas[0])
  const [cta, setCta] = useState(ctas[0])
  const [customNote, setCustomNote] = useState("")
  const [generating, setGenerating] = useState(false)
  const [results, setResults] = useState<string[]>([])

  const modePrompt = useMemo(() => {
    return `모드: ${modeCopy[mode].label}\n톤: ${tone}\nCTA: ${cta}\n페르소나: ${persona}\n키워드: ${keywords || "미입력"}`
  }, [mode, tone, cta, persona, keywords])

  const handleGenerate = async () => {
    if (!topic.trim()) return
    setGenerating(true)
    setResults([])

    try {
      let endpoint = '/api/ai/generate-title'
      if (mode === 'body') endpoint = '/api/ai/generate-body'
      if (mode === 'sns') endpoint = '/api/ai/generate-sns'

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          keywords,
          tone,
          persona,
          cta,
          customNote,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        alert(data.error || '생성 중 오류가 발생했습니다.')
        setGenerating(false)
        return
      }

      // 결과 설정
      if (mode === 'title' || mode === 'sns') {
        setResults(data.titles || data.copies || [])
      } else if (mode === 'body') {
        setResults([data.content])
      }

      setGenerating(false)
    } catch (error) {
      console.error('Error generating:', error)
      alert('생성 중 오류가 발생했습니다.')
      setGenerating(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-white/60 bg-white/85 p-6 shadow-[0_15px_60px_rgba(176,140,60,0.12)] backdrop-blur-xl">
        <p className="text-sm font-semibold text-amber-700">AI 카피 스튜디오</p>
        <div className="mt-2 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              주제와 톤을 지정하면 1분 안에 시안을 받을 수 있어요
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              Free 플랜은 제목 3개, 본문 1개, SNS 1개까지 자동 제안합니다. 버튼 클릭 한번으로 저장하세요.
            </p>
          </div>
          <div className="rounded-2xl border border-amber-100 bg-amber-50/70 px-4 py-3 text-sm text-amber-900">
            <p className="font-semibold">BYOK 키 미연결</p>
            <p className="text-xs">모의 생성기로 작동 중 · API 키 연결 시 실서비스로 전환됩니다.</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="rounded-3xl border border-white/70 bg-white/95 shadow-lg">
          <CardHeader>
            <CardTitle className="flex flex-wrap items-center gap-2 text-lg">
              <PenSquare className="h-5 w-5 text-amber-500" />
              프롬프트 설정
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="flex flex-wrap gap-2">
              {Object.entries(modeCopy).map(([key, value]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setMode(key as Mode)}
                  className={`rounded-2xl border px-4 py-3 text-left text-sm transition ${
                    mode === key
                      ? "border-amber-400 bg-amber-50 text-amber-900"
                      : "border-slate-200 bg-slate-50 text-slate-600 hover:border-amber-200"
                  }`}
                >
                  <p className="font-semibold">{value.label}</p>
                  <p className="text-xs">{value.description}</p>
                </button>
              ))}
            </div>
            <div className="grid gap-4">
              <label className="text-sm font-medium text-slate-700">
                주제 / 캠페인
                <Input
                  value={topic}
                  onChange={(event) => setTopic(event.target.value)}
                  className="mt-1"
                  placeholder="예) 워케이션 도시 Top 5"
                />
              </label>
              <label className="text-sm font-medium text-slate-700">
                키워드
                <Input
                  value={keywords}
                  onChange={(event) => setKeywords(event.target.value)}
                  className="mt-1"
                  placeholder="쉼표로 구분 · 예) 디지털노마드, 원격근무"
                />
              </label>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <label className="text-sm font-medium text-slate-700">
                톤 & 무드
                <select
                  value={tone}
                  onChange={(event) => setTone(event.target.value)}
                  className="mt-1 w-full rounded-xl border border-amber-100 bg-white px-3 py-2 text-sm"
                >
                  {tones.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </label>
              <label className="text-sm font-medium text-slate-700">
                페르소나
                <select
                  value={persona}
                  onChange={(event) => setPersona(event.target.value)}
                  className="mt-1 w-full rounded-xl border border-amber-100 bg-white px-3 py-2 text-sm"
                >
                  {personas.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </label>
              <label className="text-sm font-medium text-slate-700">
                CTA 유형
                <select
                  value={cta}
                  onChange={(event) => setCta(event.target.value)}
                  className="mt-1 w-full rounded-xl border border-amber-100 bg-white px-3 py-2 text-sm"
                >
                  {ctas.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <label className="text-sm font-medium text-slate-700">
              추가 지시 (선택)
              <Textarea
                value={customNote}
                onChange={(event) => setCustomNote(event.target.value)}
                className="mt-1"
                placeholder="예) 200자 이내, 구체적인 통계 1개 포함, CTA 앞에 감성 문장 추가"
              />
            </label>
            <div className="flex flex-wrap justify-between gap-3">
              <div className="text-xs text-slate-500">
                다음에 전송될 프롬프트
                <pre className="mt-1 max-w-xl rounded-2xl bg-slate-50 px-3 py-2 text-[11px] text-slate-700">
                  {modePrompt}
                </pre>
              </div>
              <Button
                onClick={handleGenerate}
                disabled={generating || !topic}
                className="rounded-2xl px-6 py-5 text-base font-semibold"
              >
                {generating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    생성 중...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    AI 제안 받기
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border border-white/70 bg-white/90 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Sparkles className="h-5 w-5 text-amber-500" />
              결과 / 스니펫
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {results.length === 0 && !generating ? (
              <div className="rounded-3xl border border-dashed border-amber-200 bg-amber-50/60 px-6 py-10 text-center">
                <p className="text-base font-semibold text-amber-900">
                  좌측에서 프롬프트를 작성하고 버튼을 눌러 주세요.
                </p>
                <p className="mt-2 text-sm text-amber-800">
                  주제, 톤, CTA 기준으로 3가지 버전을 생성해 비교할 수 있어요.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {results.map((text, index) => (
                  <div
                    key={index}
                    className="rounded-2xl border border-amber-100 bg-white/80 p-4 text-sm text-slate-700 shadow-inner"
                  >
                    <div className="mb-2 flex items-center justify-between text-xs uppercase tracking-wide text-slate-500">
                      <span>{modeCopy[mode].label}</span>
                      <Badge variant="secondary" className="rounded-full bg-amber-100 text-amber-900">
                        #{index + 1}
                      </Badge>
                    </div>
                    <p className="whitespace-pre-line leading-relaxed">{text}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function WriterPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">로딩 중...</div>}>
      <WriterContent />
    </Suspense>
  )
}
