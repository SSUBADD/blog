import { NextResponse } from 'next/server'
import { getUsageStats } from '@/lib/usage'

export async function GET() {
  try {
    const stats = await getUsageStats('anonymous')

    return NextResponse.json({
      success: true,
      stats,
    })
  } catch (error) {
    console.error('Error fetching usage stats:', error)
    return NextResponse.json(
      { error: '사용량 조회 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}

