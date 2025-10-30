import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// 서버 사이드에서 사용하는 클라이언트 (RLS 우회 가능)
export function createServerSupabaseClient() {
  const serviceUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-service-key'
  return createClient(serviceUrl, supabaseServiceRoleKey)
}

// 데이터베이스 타입 정의
export type UsageRecord = {
  id: string
  user_id: string
  date: string
  title_count: number
  body_count: number
  diagnosis_count: number
  created_at: string
}

export type SWOTEntry = {
  id: string
  user_id: string
  strengths: string
  weaknesses: string
  opportunities: string
  threats: string
  notes: string
  created_at: string
}

export type Mission = {
  id: string
  user_id: string
  mission_id: number
  completed: boolean
  date: string
  created_at: string
}

export type DiagnosisReport = {
  id: string
  user_id: string
  url: string
  goal: string
  score: number
  summary: string
  strengths: string[]
  issues: string[]
  ctas: string[]
  created_at: string
}

