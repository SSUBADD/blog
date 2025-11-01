# 💡 블로그 뭐쓰지 AI

**매일 글감 캘린더형 이슈글감 제공 · 수익형 AI 카피라이터**

Next.js 기반의 블로그 콘텐츠 자동화 플랫폼입니다.

## ✨ 주요 기능

- 📅 **글감 캘린더** - 매일 최신 이슈/키워드 제공
- ✍️ **AI 카피라이터** - OpenAI 기반 제목·본문·SNS 카피 생성
- ✅ **투두·실행 미션** - 매일 미션 체크 및 연속 방문 관리
- 🎯 **브랜딩 분석 (SWOT)** - 브랜드 포지션 정리 및 저장
- 🔍 **자가진단** - 블로그 분석 및 개선 제안

## 🚀 빠른 시작

### 1. 설치

```bash
npm install
```

### 2. 환경 설정

프로젝트 루트에 `.env.local` 파일 생성:

```env
OPENAI_API_KEY=your_openai_api_key
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_key
```

### 3. Supabase 데이터베이스 설정

`supabase-migrations.sql` 파일을 Supabase SQL Editor에서 실행

### 4. 개발 서버 실행

```bash
npm run dev
```

직접 GIT 푸시 VERCEL 배포 웹에서 직접 확인!

## 📖 상세 가이드
- **메인페이지**: [UP.md](./UP.md)
- **설정 가이드**: [SETUP.md](./SETUP.md)
- **Vercel 배포**: [VERCEL-DEPLOY.md](./VERCEL-DEPLOY.md) ⭐ 새로 추가!
- **MVP 완료 보고서**: [MVP-COMPLETION-REPORT.md](./MVP-COMPLETION-REPORT.md)

## 🛠️ 기술 스택

- **Framework**: Next.js 16 (App Router + TypeScript)
- **UI**: shadcn/ui + TailwindCSS 3.4.17
- **Database**: Supabase
- **AI**: OpenAI API (GPT-4o-mini)
- **Deployment**: Vercel ✅ 배포 준비 완료

## 📂 프로젝트 구조

```
├── app/
│   ├── api/              # API Routes
│   │   ├── ai/          # AI 생성 엔드포인트
│   │   ├── swot/        # SWOT 저장/조회
│   │   ├── missions/    # 미션 관리
│   │   └── usage/       # 사용량 조회
│   ├── branding/        # 브랜딩 SWOT 페이지
│   ├── calendar/        # 글감 캘린더
│   ├── diagnosis/       # 블로그 진단
│   ├── mission/         # 미션 체크
│   ├── writer/          # AI 카피 생성
│   └── page.tsx         # 대시보드
├── components/          # 재사용 컴포넌트
├── lib/
│   ├── supabase.ts     # Supabase 클라이언트
│   ├── usage.ts        # 사용량 관리
│   └── utils.ts        # 유틸리티
└── data/
    └── calendar-data.json  # 글감 데이터
```

## 💰 플랜 구조

### Free 플랜 (MVP)
- AI 제목 생성: 3회/일
- AI 본문 생성: 1회/일
- 블로그 진단: 1회/일
- 글감 캘린더: 무제한
- SWOT 저장: 무제한
- 미션 체크: 무제한

### Pro 플랜 (향후)
- 모든 AI 생성 무제한
- 고속 처리
- 주간 리포트 자동 발송
- 히스토리 무제한 저장

## 🔐 보안

- API 키는 서버 사이드에서만 사용
- Supabase RLS 활성화
- 환경변수로 민감 정보 관리
- Rate limiting 적용

## 📧 문의

- **이메일**: subad@subad.kr
- **강의 사이트**: https://class.subad.kr
- **도메인**: https://bloglab.subad.kr

## 📝 라이선스

Copyright © 2025 서브에드(SubAdd)

---

**개발 및 운영**: 서브에드(SubAdd, 섭엗)  
블로그 자동화 & 브랜딩 마케팅 컨설팅 기업
