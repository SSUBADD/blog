# 🚀 Vercel 배포 가이드

## ✅ 배포 준비 완료

Tailwind CSS가 3.4.17 안정 버전으로 다운그레이드되어 Vercel에서 완벽하게 작동합니다!

## 📋 배포 전 체크리스트

### 1. 로컬 빌드 확인
```bash
npm run build
npm start
```

브라우저에서 http://localhost:3000 접속하여 CSS가 정상 작동하는지 확인

### 2. Git 커밋 및 푸시

```bash
git add .
git commit -m "Tailwind 3.4.x로 다운그레이드 - Vercel 배포 준비 완료"
git push origin main
```

## 🌐 Vercel 배포 단계

### 방법 1: GitHub 연동 (추천)

1. **Vercel 대시보드 접속**
   - https://vercel.com 로그인
   - "Add New Project" 클릭

2. **GitHub 저장소 연결**
   - GitHub에서 프로젝트 선택
   - Import 클릭

3. **환경변수 설정** (매우 중요!)
   
   다음 4개 환경변수를 반드시 입력하세요:

   ```
   OPENAI_API_KEY=sk-proj-xxxxx...
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
   ```

4. **배포 시작**
   - "Deploy" 버튼 클릭
   - 2-3분 대기

5. **배포 완료!**
   - 생성된 URL 클릭하여 확인
   - 모든 CSS 스타일이 정상 작동하는지 확인

### 방법 2: Vercel CLI

```bash
# Vercel CLI 설치
npm i -g vercel

# 배포
vercel

# 프로덕션 배포
vercel --prod
```

## 🎨 UI 확인 사항

배포 후 다음 UI 요소들이 정상 작동하는지 확인하세요:

- ✅ **Glass 효과**: backdrop-blur가 적용된 헤더와 카드
- ✅ **그라데이션**: 골드/옐로우 그라데이션 버튼
- ✅ **Shadow**: 부드러운 그림자 효과
- ✅ **Hover 효과**: 버튼 및 카드 호버 애니메이션
- ✅ **반응형**: 모바일/태블릿/데스크톱 레이아웃
- ✅ **다크모드**: 테마 전환 정상 작동

## 🔧 Vercel 설정 최적화

### 1. Build & Development Settings

- **Framework Preset**: Next.js (자동 감지)
- **Build Command**: `npm run build`
- **Output Directory**: `.next` (기본값)
- **Install Command**: `npm install`

### 2. Environment Variables

Production, Preview, Development 모두에 동일한 환경변수 적용:

```
OPENAI_API_KEY → Production + Preview + Development
NEXT_PUBLIC_SUPABASE_URL → Production + Preview + Development
NEXT_PUBLIC_SUPABASE_ANON_KEY → Production + Preview + Development
SUPABASE_SERVICE_ROLE_KEY → Production + Preview + Development
```

### 3. Domains

원하는 커스텀 도메인 연결:
- `bloglab.subad.kr`
- 또는 Vercel 제공 도메인 사용

## 🐛 문제 해결

### CSS가 적용되지 않는 경우

1. **브라우저 캐시 삭제**
   - Ctrl + Shift + R (하드 리프레시)

2. **Vercel 빌드 로그 확인**
   - Deployments → 최신 배포 클릭
   - Build Logs 확인

3. **환경변수 확인**
   - Settings → Environment Variables
   - 4개 모두 설정되어 있는지 확인

### API 호출 오류

1. **OpenAI API 키 확인**
   - 유효한 키인지 확인
   - 사용량 한도 확인

2. **Supabase 연결 확인**
   - URL과 키가 정확한지 확인
   - 데이터베이스 마이그레이션 실행 확인

### 빌드 실패

```bash
# 로컬에서 빌드 테스트
npm run build

# 의존성 재설치
rm -rf node_modules package-lock.json
npm install
npm run build
```

## 📊 성능 최적화

Vercel에서 자동으로 제공하는 최적화:

- ✅ **Edge Network**: 글로벌 CDN
- ✅ **Automatic HTTPS**: SSL 인증서 자동 발급
- ✅ **Compression**: Gzip/Brotli 압축
- ✅ **Image Optimization**: Next.js 이미지 최적화
- ✅ **Caching**: 정적 자산 캐싱

## 🔄 지속적 배포 (CI/CD)

GitHub 연동 시 자동으로 설정됨:

- `main` 브랜치 푸시 → 프로덕션 배포
- 다른 브랜치 푸시 → 프리뷰 배포
- Pull Request → 프리뷰 URL 자동 생성

## 📱 모바일 테스트

배포 후 다음 기기에서 테스트하세요:

- iOS Safari
- Android Chrome
- 다양한 화면 크기

## ✨ 배포 완료 후

1. **도메인 연결**
   - `bloglab.subad.kr` 설정
   - DNS 레코드 추가

2. **Analytics 설정**
   - Vercel Analytics 활성화
   - 사용자 행동 추적

3. **모니터링**
   - 에러 로그 확인
   - 성능 지표 모니터링

## 🎉 성공!

모든 CSS 스타일이 정상 작동하는 프로덕션 사이트가 배포되었습니다!

**배포된 사이트 확인:**
- 대시보드: 실시간 사용량 표시
- AI 카피: 제목/본문/SNS 생성
- 블로그 진단: AI 분석
- SWOT: 저장 및 히스토리
- 미션: 체크 상태 유지

---

**문의**: subad@subad.kr  
**프로젝트**: 블로그 뭐쓰지 AI

