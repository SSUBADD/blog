import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'
import { z } from 'zod'

const swotSchema = z.object({
  strengths: z.string(),
  weaknesses: z.string(),
  opportunities: z.string(),
  threats: z.string(),
  notes: z.string().optional(),
})

// SWOT 저장
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = swotSchema.parse(body)

    const supabase = createServerSupabaseClient()

    const { data, error } = await supabase
      .from('swot_entries')
      .insert({
        user_id: 'anonymous',
        strengths: validatedData.strengths,
        weaknesses: validatedData.weaknesses,
        opportunities: validatedData.opportunities,
        threats: validatedData.threats,
        notes: validatedData.notes || '',
      })
      .select()
      .single()

    if (error) {
      console.error('Error saving SWOT:', error)
      return NextResponse.json(
        { error: 'SWOT 저장 중 오류가 발생했습니다.' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data,
    })
  } catch (error) {
    console.error('Error in SWOT POST:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: '잘못된 요청 데이터입니다.', details: error.issues },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'SWOT 저장 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}

// SWOT 히스토리 조회
export async function GET() {
  try {
    const supabase = createServerSupabaseClient()

    const { data, error } = await supabase
      .from('swot_entries')
      .select('*')
      .eq('user_id', 'anonymous')
      .order('created_at', { ascending: false })
      .limit(10)

    if (error) {
      console.error('Error fetching SWOT:', error)
      return NextResponse.json(
        { error: 'SWOT 조회 중 오류가 발생했습니다.' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data,
    })
  } catch (error) {
    console.error('Error in SWOT GET:', error)
    return NextResponse.json(
      { error: 'SWOT 조회 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}

