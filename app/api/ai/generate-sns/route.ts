import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { z } from 'zod'
import { checkUsageLimit, incrementUsage } from '@/lib/usage'

const requestSchema = z.object({
  topic: z.string().min(1),
  keywords: z.string().optional(),
  tone: z.string().optional(),
  persona: z.string().optional(),
  cta: z.string().optional(),
  customNote: z.string().optional(),
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

    // title과 같은 한도 사용
    const usageCheck = await checkUsageLimit('title')
    if (!usageCheck.allowed) {
      return NextResponse.json(
        {
          error: `일일 생성 한도(${usageCheck.limit}회)를 초과했습니다.`,
          current: usageCheck.current,
          limit: usageCheck.limit,
        },
        { status: 429 }
      )
    }

    const openai = new OpenAI({ apiKey })

    const prompt = `당신은 SNS 마케팅 전문가입니다. 다음 블로그 주제를 바탕으로 SNS 티저 카피를 3개 작성해주세요.

주제: ${validatedData.topic}
키워드: ${validatedData.keywords || '없음'}
톤 & 무드: ${validatedData.tone || '친근한'}
CTA 유형: ${validatedData.cta || '클릭 유도'}

요구사항:
1. 인스타그램, 뉴스레터에 적합한 짧은 형식
2. 각 카피는 150자 이내
3. 해시태그 2-3개 포함
4. FOMO 또는 호기심 유발 요소 포함
5. 3가지 다른 접근법

응답 형식:
SNS 버전 1: [카피 내용] #태그1 #태그2|||SNS 버전 2: [카피 내용] #태그1 #태그2|||SNS 버전 3: [카피 내용] #태그1 #태그2

(|||로 구분하여 응답해주세요)`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: '당신은 SNS 마케팅 카피라이터입니다. 항상 3개의 버전을 |||로 구분하여 제공합니다.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.9,
      max_tokens: 600,
    })

    const responseText = completion.choices[0]?.message?.content || ''
    const snsCopies = responseText.split('|||').map((t) => t.trim()).filter((t) => t.length > 0)

    // 사용량 증가 (title 카운트 사용)
    await incrementUsage('title')

    return NextResponse.json({
      success: true,
      copies: snsCopies,
      usage: {
        current: usageCheck.current + 1,
        limit: usageCheck.limit,
      },
    })
  } catch (error) {
    console.error('Error generating SNS copy:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: '잘못된 요청 데이터입니다.', details: error.issues },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'SNS 카피 생성 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}

