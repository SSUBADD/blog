import Link from "next/link"
import { TrendingUp, Calendar, Sparkles, CheckSquare, Flame, Leaf, ShoppingBag } from "lucide-react"

const trendingTopics = [
  { icon: Flame, title: "김치의 날", date: "11/1", category: "이벤트" },
  { icon: Leaf, title: "입동", date: "11/7", category: "계절" },
  { icon: ShoppingBag, title: "블랙프라이데이", date: "11/29", category: "쇼핑" },
]

const coreFeatures = [
  {
    icon: Calendar,
    title: "매일 업데이트되는 글감 캘린더",
    description: "기념일, 이벤트, 계절 키워드를 자동으로 수집해서 오늘/이번주/이번달 타임라인으로 제공합니다.",
    href: "/calendar",
  },
  {
    icon: CheckSquare,
    title: "블로그 계획 관리",
    description: "글감 선택부터 제목 작성, 마감일 설정까지. 투두리스트로 진행 상황을 체계적으로 추적하세요.",
    href: "/plan",
  },
  {
    icon: Sparkles,
    title: "AI 키워드 조합 추천",
    description: '"블프 + 가성비" 같은 트렌드 조합을 AI가 자동 제안하고, 클릭 한 번으로 초안을 생성합니다.',
    href: "/writer",
  },
]

const steps = [
  {
    number: 1,
    title: "오늘의 글감 확인",
    description: "매일 자동 업데이트되는 타임라인에서 트렌드 키워드를 발견하세요.",
  },
  {
    number: 2,
    title: "제목과 일정 작성",
    description: "마음에 드는 글감을 선택하고 제목과 마감일을 설정합니다.",
  },
  {
    number: 3,
    title: "AI 초안 생성 (프리미엄)",
    description: "AI가 SEO 최적화된 블로그 초안을 자동으로 생성합니다.",
  },
]

const pricingPlans = [
  {
    name: "무료 플랜",
    price: "₩0",
    period: "영구 무료",
    features: [
      "글감 캘린더 접근",
      "계획 관리 (월 5개)",
      "키워드 조합 추천",
      "기본 통계 확인",
    ],
    cta: "무료로 시작하기",
    href: "/calendar",
    isPrimary: false,
  },
  {
    name: "프리미엄",
    price: "₩9,900",
    period: "월",
    badge: "추천",
    features: [
      "모든 무료 기능",
      "무제한 계획 생성",
      "AI 블로그 초안 생성",
      "SEO 최적화 제안",
      "우선 고객 지원",
    ],
    cta: "프리미엄 시작하기",
    href: "/plan",
    isPrimary: true,
  },
]

export default function Page() {
  return (
    <main className="container flex flex-col gap-24 py-16">
      {/* Hero Section */}
      <section className="grid items-center gap-12 lg:grid-cols-2">
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
            <TrendingUp className="h-4 w-4" />
            <span>실시간 트렌드 기반 글감 추천</span>
          </div>

          <h1 className="text-4xl font-extrabold leading-tight md:text-6xl">
            매일 블로그 뭐 쓰지?
            <br />
            <span className="text-primary">고민 끝.</span>
          </h1>

          <p className="text-lg text-muted-foreground md:text-xl">
            실시간 트렌드로 글감 찾고, 계획 세우는 연구소.
            <br />
            오늘의 기념일, 날씨, 인기 키워드까지 한눈에 확인하세요.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link
              href="/calendar"
              className="inline-flex h-12 items-center justify-center rounded-lg bg-primary px-8 text-base font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              오늘의 글감 보기 →
            </Link>
            <Link
              href="/plan"
              className="inline-flex h-12 items-center justify-center rounded-lg border border-input bg-background px-8 text-base font-semibold transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              무료로 시작하기
            </Link>
          </div>
        </div>

        {/* Preview Card */}
        <div className="rounded-2xl border bg-card p-8 shadow-xl">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-lg font-semibold">오늘의 글감 미리보기</h3>
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              실시간 업데이트
            </span>
          </div>

          <div className="space-y-4">
            {trendingTopics.map((topic, index) => {
              const Icon = topic.icon
              return (
                <div
                  key={index}
                  className="flex items-center gap-4 rounded-xl border bg-background p-4 transition-all hover:border-primary/50 hover:shadow-md"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">{topic.title}</p>
                    <p className="text-sm text-muted-foreground">{topic.date} • {topic.category}</p>
                  </div>
                </div>
              )
            })}
          </div>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            로그인하면 AI 추천 조합까지 확인 가능
          </p>
        </div>
      </section>

      {/* Core Features */}
      <section className="space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold md:text-4xl">
            블로거를 위한 스마트한 글감 연구소
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            매일 뭐 쓸지 고민하는 시간을 줄이고, 글쓰기에 집중하세요
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {coreFeatures.map((feature, index) => {
            const Icon = feature.icon
            return (
              <Link key={index} href={feature.href}>
                <article className="group h-full rounded-2xl border bg-card p-8 transition-all hover:border-primary/50 hover:shadow-xl">
                  <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary/20">
                    <Icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="mb-3 text-xl font-bold">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </article>
              </Link>
            )
          })}
        </div>
      </section>

      {/* How It Works */}
      <section className="rounded-3xl border bg-gradient-to-br from-primary/5 to-primary/10 p-12">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold md:text-4xl">3단계로 시작하는 스마트 블로깅</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            복잡한 설정 없이 바로 시작할 수 있습니다
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((step) => (
            <div key={step.number} className="relative">
              <div className="rounded-2xl border bg-background p-8">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
                  {step.number}
                </div>
                <h3 className="mb-3 text-xl font-bold">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
              {step.number < 3 && (
                <div className="absolute right-0 top-1/2 hidden h-0.5 w-8 -translate-y-1/2 translate-x-full bg-primary/30 md:block" />
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Social Proof */}
      <section className="text-center">
        <div className="inline-flex flex-col items-center gap-4 rounded-2xl border bg-card p-8">
          <div className="flex -space-x-2">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="h-10 w-10 rounded-full border-2 border-background bg-gradient-to-br from-primary to-primary/50"
              />
            ))}
          </div>
          <p className="text-2xl font-bold">이미 1,200명의 블로거가 사용 중</p>
          <p className="text-muted-foreground">
            매일 평균 50개의 새로운 글감이 추가되고 있습니다
          </p>
        </div>
      </section>

      {/* Pricing */}
      <section className="space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold md:text-4xl">
            무료로 시작하고, 필요할 때 업그레이드
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            모든 플랜에서 핵심 기능을 사용할 수 있습니다
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:gap-12">
          {pricingPlans.map((plan) => (
            <article
              key={plan.name}
              className={`relative rounded-3xl border p-8 ${
                plan.isPrimary
                  ? "border-primary bg-gradient-to-br from-primary/5 to-primary/10 shadow-xl"
                  : "bg-card"
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="rounded-full bg-primary px-4 py-1 text-sm font-bold text-primary-foreground">
                    {plan.badge}
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-2xl font-bold">{plan.name}</h3>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-5xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground">/ {plan.period}</span>
                </div>
              </div>

              <ul className="mb-8 space-y-4">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckSquare className="h-5 w-5 flex-shrink-0 text-primary" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                href={plan.href}
                className={`block w-full rounded-lg py-3 text-center font-semibold transition-colors ${
                  plan.isPrimary
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "border border-input bg-background hover:bg-accent hover:text-accent-foreground"
                }`}
              >
                {plan.cta}
              </Link>
            </article>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="rounded-3xl border bg-gradient-to-r from-primary to-primary/80 p-12 text-center text-primary-foreground">
        <h2 className="text-3xl font-bold md:text-4xl">
          지금 바로 오늘의 글감을 확인하세요
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg opacity-90">
          무료로 시작해서 블로그 운영이 얼마나 쉬워지는지 경험해 보세요.
          <br />
          신용카드 등록 없이 바로 사용 가능합니다.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            href="/calendar"
            className="inline-flex h-12 items-center justify-center rounded-lg bg-background px-8 text-base font-semibold text-foreground transition-colors hover:bg-background/90"
          >
            무료로 시작하기 →
          </Link>
        </div>
      </section>
    </main>
  )
}
