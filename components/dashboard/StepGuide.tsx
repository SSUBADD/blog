"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Circle } from "lucide-react"
import Link from "next/link"

interface Step {
  number: number
  title: string
  description: string
  href: string
  completed?: boolean
}

interface StepGuideProps {
  steps: Step[]
}

export function StepGuide({ steps }: StepGuideProps) {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      {steps.map((step, idx) => (
        <Card
          key={step.number}
          className="relative p-6 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 border-2"
        >
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-amber-500 to-amber-600 text-xl font-bold text-white shadow-lg">
              {step.number}
            </div>
            
            <div className="flex-1">
              <h3 className="text-lg font-bold mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {step.description}
              </p>
              
              <Link href={step.href}>
                <Button
                  size="sm"
                  variant={step.completed ? "outline" : "default"}
                  className="w-full"
                >
                  {step.completed ? (
                    <>
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      완료
                    </>
                  ) : (
                    <>
                      <Circle className="h-4 w-4 mr-2" />
                      시작하기
                    </>
                  )}
                </Button>
              </Link>
            </div>
          </div>
          
          {idx < steps.length - 1 && (
            <div className="absolute right-0 top-1/2 hidden h-0.5 w-8 -translate-y-1/2 translate-x-full bg-gradient-to-r from-amber-500/50 to-transparent md:block" />
          )}
        </Card>
      ))}
    </div>
  )
}

