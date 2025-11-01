"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface TrendTabsProps {
  onTabChange?: (value: string) => void
  children: React.ReactNode
}

export function TrendTabs({ onTabChange, children }: TrendTabsProps) {
  return (
    <Tabs defaultValue="today" className="w-full" onValueChange={onTabChange}>
      <TabsList className="grid w-full grid-cols-4 mb-6">
        <TabsTrigger value="today">오늘</TabsTrigger>
        <TabsTrigger value="week">이번주</TabsTrigger>
        <TabsTrigger value="month">이번달</TabsTrigger>
        <TabsTrigger value="season">계절</TabsTrigger>
      </TabsList>
      {children}
    </Tabs>
  )
}

interface TrendTabContentProps {
  value: string
  children: React.ReactNode
}

export function TrendTabContent({ value, children }: TrendTabContentProps) {
  return <TabsContent value={value}>{children}</TabsContent>
}

