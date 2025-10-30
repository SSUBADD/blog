-- 블로그 뭐쓰지 AI - Supabase 데이터베이스 스키마
-- 이 파일을 Supabase SQL Editor에서 실행하세요

-- 1. 사용량 추적 테이블
CREATE TABLE IF NOT EXISTS users_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL DEFAULT 'anonymous',
  date DATE NOT NULL,
  title_count INTEGER DEFAULT 0,
  body_count INTEGER DEFAULT 0,
  diagnosis_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- 2. SWOT 분석 저장 테이블
CREATE TABLE IF NOT EXISTS swot_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL DEFAULT 'anonymous',
  strengths TEXT,
  weaknesses TEXT,
  opportunities TEXT,
  threats TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. 미션 체크 상태 테이블
CREATE TABLE IF NOT EXISTS missions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL DEFAULT 'anonymous',
  mission_id INTEGER NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, mission_id, date)
);

-- 4. 진단 리포트 히스토리 테이블
CREATE TABLE IF NOT EXISTS diagnosis_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL DEFAULT 'anonymous',
  url TEXT NOT NULL,
  goal TEXT,
  score INTEGER,
  summary TEXT,
  strengths JSONB,
  issues JSONB,
  ctas JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스 생성 (성능 최적화)
CREATE INDEX IF NOT EXISTS idx_users_usage_user_date ON users_usage(user_id, date);
CREATE INDEX IF NOT EXISTS idx_swot_entries_user ON swot_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_missions_user_date ON missions(user_id, date);
CREATE INDEX IF NOT EXISTS idx_diagnosis_reports_user ON diagnosis_reports(user_id);

-- RLS (Row Level Security) 정책 설정
-- MVP에서는 인증 없이 사용하므로 모든 접근 허용
ALTER TABLE users_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE swot_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE missions ENABLE ROW LEVEL SECURITY;
ALTER TABLE diagnosis_reports ENABLE ROW LEVEL SECURITY;

-- 모든 사용자가 읽고 쓸 수 있도록 설정 (MVP용)
CREATE POLICY "Enable all access for users_usage" ON users_usage FOR ALL USING (true);
CREATE POLICY "Enable all access for swot_entries" ON swot_entries FOR ALL USING (true);
CREATE POLICY "Enable all access for missions" ON missions FOR ALL USING (true);
CREATE POLICY "Enable all access for diagnosis_reports" ON diagnosis_reports FOR ALL USING (true);

