# 블로그 뭐쓰지 AI - 설정 가이드

## 📋 필수 준비사항

1. **Supabase 계정** - https://supabase.com
2. **OpenAI API 키** - https://platform.openai.com
3. **Node.js 18+** 설치

## 🚀 설치 및 설정

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경변수 설정

프로젝트 루트에 `.env.local` 파일을 생성하세요:

```env
# OpenAI API Key
OPENAI_API_KEY=sk-proj-...

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
```

### 3. Supabase 데이터베이스 설정

1. Supabase 대시보드에 로그인
2. 새 프로젝트 생성 (또는 기존 프로젝트 선택)
3. SQL Editor 열기
4. `supabase-migrations.sql` 파일의 내용을 복사하여 실행

이 과정으로 다음 테이블이 생성됩니다:
- `users_usage` - 사용량 추적
- `swot_entries` - SWOT 분석 저장
- `missions` - 미션 체크 상태
- `diagnosis_reports` - 진단 리포트

### 4. Supabase 프로젝트 설정값 확인

**Supabase Dashboard → Settings → API**에서 다음 값을 복사:

- **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
- **anon/public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **service_role key** → `SUPABASE_SERVICE_ROLE_KEY`

### 5. OpenAI API 키 발급

1. https://platform.openai.com 접속
2. API Keys 메뉴로 이동
3. "Create new secret key" 클릭
4. 생성된 키를 복사하여 `OPENAI_API_KEY`에 입력

⚠️ **주의**: API 키는 절대 공개 저장소에 커밋하지 마세요!

## 🏃 실행

### 개발 서버 실행

```bash
npm run dev
```

브라우저에서 http://localhost:3000 접속

### 프로덕션 빌드

```bash
npm run build
npm start
```

## 🚀 Vercel 배포

**이제 Vercel에 배포할 준비가 완료되었습니다!**

Tailwind CSS가 안정 버전(3.4.17)으로 설정되어 있어 Vercel에서 CSS가 완벽하게 작동합니다.

상세한 배포 가이드는 [VERCEL-DEPLOY.md](./VERCEL-DEPLOY.md) 참고

## ✅ 기능 테스트

설정이 완료되면 다음 기능들을 테스트하세요:

1. **대시보드** (/) - 사용량 통계가 표시되는지 확인
2. **AI 카피 생성** (/writer)
   - 제목 생성 (하루 3회 제한)
   - 본문 생성 (하루 1회 제한)
   - SNS 카피 생성
3. **블로그 진단** (/diagnosis)
   - URL 입력하여 AI 진단 받기 (하루 1회 제한)
4. **브랜딩 SWOT** (/branding)
   - SWOT 입력 후 저장
   - 히스토리 확인
5. **미션 체크** (/mission)
   - 미션 체크/언체크
   - 새로고침 후에도 상태 유지 확인

## 🔧 문제 해결

### "OpenAI API 키가 설정되지 않았습니다" 오류

- `.env.local` 파일이 프로젝트 루트에 있는지 확인
- 개발 서버를 재시작 (`npm run dev` 중지 후 재실행)
- 환경변수 이름이 정확한지 확인

### Supabase 연결 오류

- Supabase 프로젝트 URL이 올바른지 확인
- API 키가 올바르게 복사되었는지 확인
- `supabase-migrations.sql`이 실행되었는지 확인

### 사용량이 업데이트되지 않음

- 브라우저를 새로고침
- Supabase 대시보드에서 `users_usage` 테이블 확인
- 브라우저 콘솔에서 에러 메시지 확인

## 📊 Free 플랜 제한

현재 MVP는 Free 플랜 기준으로 다음 제한이 있습니다:

- **제목 생성**: 3회/일
- **본문 생성**: 1회/일
- **블로그 진단**: 1회/일

제한은 매일 자정(UTC)에 초기화됩니다.

## 🚢 배포

### Vercel 배포

1. GitHub에 프로젝트 푸시
2. Vercel에 로그인 (https://vercel.com)
3. "Import Project" 선택
4. 환경변수 설정:
   - `OPENAI_API_KEY`
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
5. Deploy!

## 📞 지원

문제가 발생하면:
- 이메일: subad@subad.kr
- 프로젝트 Issues 탭에 등록

## 🔐 보안 체크리스트

- [ ] `.env.local` 파일이 `.gitignore`에 포함되어 있음
- [ ] API 키가 클라이언트 코드에 노출되지 않음
- [ ] Supabase RLS가 활성화되어 있음 (프로덕션 시 사용자별 정책 추가 필요)
- [ ] 환경변수가 Vercel에 안전하게 저장됨

