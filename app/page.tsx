import Link from "next/link"

const featureCards = [
  {
    title: "만세력 캘린더",
    description:
      "날짜를 선택하면 lunar-javascript로 계산한 간지·오행을 바로 확인하고 감정과 메모를 기록할 수 있어요.",
    href: "/calendar",
    cta: "캘린더 열기"
  },
  {
    title: "감정 통계",
    description:
      "최근 일기의 감정 추세와 오행 밸런스를 차트로 시각화해 패턴을 빠르게 이해해요.",
    href: "/stats",
    cta: "통계 보기"
  },
  {
    title: "커뮤니티 & 콘텐츠",
    description:
      "다른 사람의 기록을 참고하고, 자동 발행되는 연간 운세 콘텐츠로 영감을 얻을 수 있어요.",
    href: "/community",
    cta: "살펴보기"
  }
]

const startSteps = [
  "생년월일과 태어난 시간을 저장해 오늘의 천간·지지를 준비해요.",
  "캘린더에서 하루 감정과 메모를 남기고, 필요하면 Supabase 동기화를 켜요.",
  "통계 화면에서 반복되는 감정/오행 패턴을 점검하고 계획에 반영해요.",
  "프리미엄이 되면 AI 요약과 월간 리포트로 더 깊은 분석을 받아요."
]

const faqs = [
  {
    question: "만세력 계산은 어떻게 진행되나요?",
    answer:
      "공식 릴리스에서는 lunar-javascript 모듈을 사용해 간지, 월령, 대운 정보를 정확히 계산합니다."
  },
  {
    question: "내 기록은 어디에 저장되나요?",
    answer:
      "로그인 전에는 브라우저 LocalStorage에 저장되고, 로그인하면 Supabase DB(RLS 적용)로 안전하게 동기화돼요."
  },
  {
    question: "프리미엄 기능은 무엇인가요?",
    answer:
      "AI 기반 일기 요약, 월간 인사이트 리포트, 고급 차트, 커뮤니티 프리미엄 공간 등을 순차적으로 제공할 예정입니다."
  }
]

export default function Page() {
  return (
    <main className="container flex flex-col gap-20 py-16">
      <section className="grid items-center gap-12 lg:grid-cols-[minmax(0,1.2fr),minmax(0,1fr)]">
        <div className="space-y-6">
          <span className="badge border-brand text-brand">사주 일기 MVP</span>
          <h1 className="text-3xl font-extrabold leading-snug md:text-5xl">
            하루의 감정과 오행 흐름을
            <br className="hidden md:block" />
            한 화면에서 기록하고 분석하세요.
          </h1>
          <p className="max-w-xl text-neutral-700 md:text-lg">
            오늘의 천간지지, 감정 기록, 계획 수립까지 한 번에 관리하는 사주 기반 라이프로그 서비스예요. 만세력 캘린더와
            감정 통계를 통해 나만의 패턴을 발견해 보세요.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/calendar" className="btn-primary">
              오늘 기록 시작하기
            </Link>
            <Link href="/stats" className="btn-ghost">
              통계 미리 보기
            </Link>
          </div>
        </div>
        <div className="card flex flex-col gap-6 p-6">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-neutral-500">오늘의 스냅샷</span>
            <span className="rounded-full bg-brand/10 px-3 py-1 text-xs font-medium text-brand">베타 데이터</span>
          </div>
          <div className="space-y-4">
            <div className="rounded-xl border border-neutral-100 bg-neutral-50 p-4">
              <p className="text-sm text-neutral-500">오늘의 천간/지지</p>
              <p className="text-lg font-semibold text-neutral-900">계갑 / 辛巳</p>
              <p className="text-sm text-neutral-600">
                균형 잡힌 금의 기운으로 관계와 커뮤니케이션에 집중해 보세요.
              </p>
            </div>
            <div>
              <p className="mb-2 text-sm font-semibold text-neutral-600">감정 체크</p>
              <div className="grid grid-cols-5 gap-2 text-2xl">
                {['😞', '😐', '🙂', '😀', '🤩'].map((emoji) => (
                  <div
                    key={emoji}
                    className="flex h-12 items-center justify-center rounded-lg border border-neutral-200 bg-white"
                  >
                    {emoji}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <p className="text-xs text-neutral-500">실제 데이터와 AI 요약은 로그인 후 자동으로 채워집니다.</p>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        {featureCards.map((feature) => (
          <article key={feature.title} className="card flex flex-col justify-between p-6">
            <div className="space-y-3">
              <h3 className="text-xl font-semibold">{feature.title}</h3>
              <p className="text-sm text-neutral-600">{feature.description}</p>
            </div>
            <Link href={feature.href} className="btn-ghost mt-6 self-start">
              {feature.cta}
            </Link>
          </article>
        ))}
      </section>

      <section className="card grid gap-8 p-10 md:grid-cols-[minmax(0,1.1fr),minmax(0,1fr)]">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">이렇게 활용해 보세요</h2>
          <p className="text-neutral-600">
            첫 번째 MVP는 로컬 저장 기반이지만, Supabase 연동과 AI 리포트를 준비하고 있어요. 아래 순서를 따라 천천히
            기능을 확장해 보세요.
          </p>
        </div>
        <ol className="space-y-3 text-sm text-neutral-700">
          {startSteps.map((step, index) => (
            <li key={step} className="flex gap-3 rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand/10 text-sm font-bold text-brand">
                {index + 1}
              </span>
              <span className="leading-relaxed">{step}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        {faqs.map((faq) => (
          <article key={faq.question} className="card p-6">
            <h3 className="text-base font-semibold text-neutral-900">{faq.question}</h3>
            <p className="mt-3 text-sm text-neutral-600">{faq.answer}</p>
          </article>
        ))}
      </section>

      <section className="card flex flex-col items-center gap-4 p-10 text-center">
        <h2 className="text-2xl font-bold">곧 공개될 프리미엄 기능도 기대해 주세요</h2>
        <p className="max-w-2xl text-neutral-600">
          Stripe/Toss 구독과 연동되는 AI 사주 분석, 월간 요약 리포트, 커뮤니티 프리미엄 존 등 로드맵에 있는 기능을
          차근차근 공개할 예정입니다. 지금은 일기부터 차근차근 기록해 보세요!
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/free" className="btn-ghost">
            무료 사주 미리보기
          </Link>
          <Link href="/community" className="btn-primary">
            커뮤니티 참여 준비 알림 받기
          </Link>
        </div>
      </section>
    </main>
  )
}
