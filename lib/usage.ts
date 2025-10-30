import { createServerSupabaseClient } from './supabase'

export type UsageType = 'title' | 'body' | 'diagnosis'

export const USAGE_LIMITS = {
  free: {
    title: 3,
    body: 1,
    diagnosis: 1,
  },
  pro: {
    title: Infinity,
    body: Infinity,
    diagnosis: Infinity,
  },
}

/**
 * 오늘 날짜의 사용량 가져오기
 */
export async function getTodayUsage(userId: string = 'anonymous') {
  const supabase = createServerSupabaseClient()
  const today = new Date().toISOString().split('T')[0] // YYYY-MM-DD

  const { data, error } = await supabase
    .from('users_usage')
    .select('*')
    .eq('user_id', userId)
    .eq('date', today)
    .single()

  if (error && error.code !== 'PGRST116') {
    // PGRST116은 "no rows returned" 에러
    console.error('Error fetching usage:', error)
    return null
  }

  return data
}

/**
 * 사용량 체크 - 제한을 초과했는지 확인
 */
export async function checkUsageLimit(
  type: UsageType,
  userId: string = 'anonymous',
  plan: 'free' | 'pro' = 'free'
): Promise<{ allowed: boolean; current: number; limit: number }> {
  const usage = await getTodayUsage(userId)
  const limit = USAGE_LIMITS[plan][type]

  let current = 0
  if (usage) {
    switch (type) {
      case 'title':
        current = usage.title_count
        break
      case 'body':
        current = usage.body_count
        break
      case 'diagnosis':
        current = usage.diagnosis_count
        break
    }
  }

  return {
    allowed: current < limit,
    current,
    limit,
  }
}

/**
 * 사용량 증가
 */
export async function incrementUsage(
  type: UsageType,
  userId: string = 'anonymous'
): Promise<boolean> {
  const supabase = createServerSupabaseClient()
  const today = new Date().toISOString().split('T')[0]

  // 기존 레코드 확인
  const usage = await getTodayUsage(userId)

  if (usage) {
    // 업데이트
    const updates: Record<string, number> = {}
    switch (type) {
      case 'title':
        updates.title_count = usage.title_count + 1
        break
      case 'body':
        updates.body_count = usage.body_count + 1
        break
      case 'diagnosis':
        updates.diagnosis_count = usage.diagnosis_count + 1
        break
    }

    const { error } = await supabase
      .from('users_usage')
      .update(updates)
      .eq('id', usage.id)

    if (error) {
      console.error('Error updating usage:', error)
      return false
    }
  } else {
    // 새로 생성
    const newUsage = {
      user_id: userId,
      date: today,
      title_count: type === 'title' ? 1 : 0,
      body_count: type === 'body' ? 1 : 0,
      diagnosis_count: type === 'diagnosis' ? 1 : 0,
    }

    const { error } = await supabase.from('users_usage').insert(newUsage)

    if (error) {
      console.error('Error creating usage:', error)
      return false
    }
  }

  return true
}

/**
 * 클라이언트에서 사용할 사용량 가져오기 API
 */
export async function getUsageStats(userId: string = 'anonymous') {
  const usage = await getTodayUsage(userId)

  return {
    title: {
      used: usage?.title_count || 0,
      limit: USAGE_LIMITS.free.title,
    },
    body: {
      used: usage?.body_count || 0,
      limit: USAGE_LIMITS.free.body,
    },
    diagnosis: {
      used: usage?.diagnosis_count || 0,
      limit: USAGE_LIMITS.free.diagnosis,
    },
  }
}

