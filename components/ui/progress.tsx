import * as React from "react"

import { cn } from "@/lib/utils"

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number
}

export function Progress({ value, className, ...props }: ProgressProps) {
  const clamped = Math.min(100, Math.max(0, value))
  return (
    <div
      className={cn(
        "relative h-2 w-full overflow-hidden rounded-full bg-muted",
        className
      )}
      {...props}
    >
      <div
        className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-amber-300 via-amber-400 to-orange-400 transition-all"
        style={{ width: `${clamped}%` }}
      />
    </div>
  )
}
