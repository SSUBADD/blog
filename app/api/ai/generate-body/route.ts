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

    // 사용량 체크
    const usageCheck = await checkUsageLimit('body')
    if (!usageCheck.allowed) {
      return NextResponse.json(
        {
          error: `일일 본문 생성 한도(${usageCheck.limit}회)를 초과했습니다.`,
          current: usageCheck.current,
          limit: usageCheck.limit,
        },
        { status: 429 }
      )
    }

    const openai = new OpenAI({ apiKey })

    const prompt = `당신은 블로그 콘텐츠 전문 작가입니다. 다음 정보를 바탕으로 블로그 본문 개요를 작성해주세요.

주제: ${validatedData.topic}
키워드: ${validatedData.keywords || '없음'}
톤 & 무드: ${validatedData.tone || '전문적'}
페르소나: ${validatedData.persona || '콘텐츠 마케터'}
CTA 유형: ${validatedData.cta || '클릭 유도'}
추가 지시사항: ${validatedData.customNote || '없음'}

요구사항:
1. SEO 친화적인 H2, H3 구조 포함
2. 각 섹션별로 핵심 메시지와 키워드 자연스럽게 배치
3. 전체 구조는 도입-본론-결론-CTA 순서
4. 3가지 섹션 개요를 작성

응답 형식:
섹션 1: [제목]
- [핵심 내용 요약]
- [포함할 키워드 및 데이터]

섹션 2: [제목]
- [핵심 내용 요약]
- [포함할 키워드 및 데이터]

섹션 3: [제목]
- [핵심 내용 요약]
- [포함할 키워드 및 데이터]`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: '당신은 SEO 최적화된 블로그 본문 구조를 작성하는 전문가입니다.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    })

    const content = completion.choices[0]?.message?.content || ''

    // 사용량 증가
    await incrementUsage('body')

    return NextResponse.json({
      success: true,
      content,
      usage: {
        current: usageCheck.current + 1,
        limit: usageCheck.limit,
      },
    })
  } catch (error) {
    console.error('Error generating body:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: '잘못된 요청 데이터입니다.', details: error.issues },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: '본문 생성 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}

