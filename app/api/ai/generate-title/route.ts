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
    // API 키 확인
    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: 'OpenAI API 키가 설정되지 않았습니다.' },
        { status: 500 }
      )
    }

    // 요청 데이터 검증
    const body = await request.json()
    const validatedData = requestSchema.parse(body)

    // 사용량 체크
    const usageCheck = await checkUsageLimit('title')
    if (!usageCheck.allowed) {
      return NextResponse.json(
        {
          error: `일일 제목 생성 한도(${usageCheck.limit}회)를 초과했습니다.`,
          current: usageCheck.current,
          limit: usageCheck.limit,
        },
        { status: 429 }
      )
    }

    // OpenAI 클라이언트 생성
    const openai = new OpenAI({ apiKey })

    // 프롬프트 생성
    const prompt = `당신은 블로그 콘텐츠 전문가입니다. 다음 정보를 바탕으로 효과적인 블로그 제목을 3개 생성해주세요.

주제: ${validatedData.topic}
키워드: ${validatedData.keywords || '없음'}
톤 & 무드: ${validatedData.tone || '전문적'}
페르소나: ${validatedData.persona || '콘텐츠 마케터'}
CTA 유형: ${validatedData.cta || '클릭 유도'}
추가 지시사항: ${validatedData.customNote || '없음'}

요구사항:
1. 클릭률(CTR) 3% 이상을 목표로 하는 제목
2. 각 제목은 40자 이내로 작성
3. 숫자나 구체적인 혜택을 포함
4. 3가지 다른 접근법으로 작성

응답 형식:
제목1|||제목2|||제목3

(제목 사이에 |||로 구분하여 응답해주세요)`

    // OpenAI API 호출
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: '당신은 블로그 제목 작성 전문가입니다. 항상 3개의 제목을 |||로 구분하여 제공합니다.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.8,
      max_tokens: 500,
    })

    const responseText = completion.choices[0]?.message?.content || ''
    const titles = responseText.split('|||').map((t) => t.trim()).filter((t) => t.length > 0)

    // 사용량 증가
    await incrementUsage('title')

    return NextResponse.json({
      success: true,
      titles,
      usage: {
        current: usageCheck.current + 1,
        limit: usageCheck.limit,
      },
    })
  } catch (error) {
    console.error('Error generating titles:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: '잘못된 요청 데이터입니다.', details: error.issues },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: '제목 생성 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}

