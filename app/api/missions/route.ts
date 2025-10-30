import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'
import { z } from 'zod'

const missionToggleSchema = z.object({
  missionId: z.number(),
  completed: z.boolean(),
})

// 오늘의 미션 상태 조회
export async function GET() {
  try {
    const supabase = createServerSupabaseClient()
    const today = new Date().toISOString().split('T')[0]

    const { data, error } = await supabase
      .from('missions')
      .select('*')
      .eq('user_id', 'anonymous')
      .eq('date', today)

    if (error) {
      console.error('Error fetching missions:', error)
      return NextResponse.json(
        { error: '미션 조회 중 오류가 발생했습니다.' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      missions: data || [],
    })
  } catch (error) {
    console.error('Error in missions GET:', error)
    return NextResponse.json(
      { error: '미션 조회 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}

// 미션 토글
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { missionId, completed } = missionToggleSchema.parse(body)

    const supabase = createServerSupabaseClient()
    const today = new Date().toISOString().split('T')[0]

    // 기존 미션 확인
    const { data: existing } = await supabase
      .from('missions')
      .select('*')
      .eq('user_id', 'anonymous')
      .eq('mission_id', missionId)
      .eq('date', today)
      .single()

    if (existing) {
      // 업데이트
      const { error } = await supabase
        .from('missions')
        .update({ completed })
        .eq('id', existing.id)

      if (error) {
        console.error('Error updating mission:', error)
        return NextResponse.json(
          { error: '미션 업데이트 중 오류가 발생했습니다.' },
          { status: 500 }
        )
      }
    } else {
      // 새로 생성
      const { error } = await supabase.from('missions').insert({
        user_id: 'anonymous',
        mission_id: missionId,
        completed,
        date: today,
      })

      if (error) {
        console.error('Error creating mission:', error)
        return NextResponse.json(
          { error: '미션 생성 중 오류가 발생했습니다.' },
          { status: 500 }
        )
      }
    }

    return NextResponse.json({
      success: true,
    })
  } catch (error) {
    console.error('Error in missions POST:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: '잘못된 요청 데이터입니다.', details: error.issues },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: '미션 저장 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}

