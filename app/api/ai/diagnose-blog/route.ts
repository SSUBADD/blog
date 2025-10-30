import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { z } from 'zod'
import { checkUsageLimit, incrementUsage } from '@/lib/usage'
import { createServerSupabaseClient } from '@/lib/supabase'

const requestSchema = z.object({
  url: z.string().url(),
  goal: z.string().min(1),
  notes: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: 'OpenAI API 키가 설정되지 않았습니다.' },
        { status: 500 }
      )
    }

    const body = await request.json()
    const validatedData = requestSchema.parse(body)

    // 사용량 체크
    const usageCheck = await checkUsageLimit('diagnosis')
    if (!usageCheck.allowed) {
      return NextResponse.json(
        {
          error: `일일 진단 한도(${usageCheck.limit}회)를 초과했습니다.`,
          current: usageCheck.current,
          limit: usageCheck.limit,
        },
        { status: 429 }
      )
    }

    const openai = new OpenAI({ apiKey })

    // 실제로는 URL을 크롤링하거나 분석해야 하지만, MVP에서는 AI에게 일반적인 진단을 요청
    const prompt = `당신은 블로그 컨설턴트입니다. 다음 정보를 바탕으로 블로그 진단 리포트를 작성해주세요.

블로그 URL: ${validatedData.url}
목표: ${validatedData.goal}
참고사항: ${validatedData.notes || '없음'}

일반적인 블로그 분석 기준으로 다음 항목을 평가해주세요:
1. 건강 점수 (0-100점)
2. 요약 (1-2문장)
3. 강점 3가지 (구체적으로)
4. 개선 포인트 3가지 (구체적으로)
5. CTA 제안 3가지 (실행 가능한 액션)

응답은 반드시 다음 JSON 형식으로 작성해주세요:
{
  "score": 78,
  "summary": "요약 내용",
  "strengths": ["강점1", "강점2", "강점3"],
  "issues": ["개선점1", "개선점2", "개선점3"],
  "ctas": ["CTA제안1", "CTA제안2", "CTA제안3"]
}`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: '당신은 블로그 분석 전문가입니다. 항상 JSON 형식으로만 응답합니다.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 1000,
      response_format: { type: 'json_object' },
    })

    const responseText = completion.choices[0]?.message?.content || '{}'
    const report = JSON.parse(responseText)

    // Supabase에 저장
    const supabase = createServerSupabaseClient()
    const { error: saveError } = await supabase.from('diagnosis_reports').insert({
      user_id: 'anonymous',
      url: validatedData.url,
      goal: validatedData.goal,
      score: report.score,
      summary: report.summary,
      strengths: report.strengths,
      issues: report.issues,
      ctas: report.ctas,
    })

    if (saveError) {
      console.error('Error saving diagnosis report:', saveError)
    }

    // 사용량 증가
    await incrementUsage('diagnosis')

    return NextResponse.json({
      success: true,
      report,
      usage: {
        current: usageCheck.current + 1,
        limit: usageCheck.limit,
      },
    })
  } catch (error) {
    console.error('Error diagnosing blog:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: '잘못된 요청 데이터입니다.', details: error.issues },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: '블로그 진단 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}

