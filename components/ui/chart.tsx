// NOTE: This component requires the 'recharts' and 'd3-shape' packages.
// Please install them via npm: npm install recharts d3-shape

'use client'

import * as React from 'react'
import {
  Area, 
  Bar, 
  Line, 
  AreaChart as AreaChartPrimitive, 
  BarChart as BarChartPrimitive, 
  LineChart as LineChartPrimitive, 
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import { cn } from '@/lib/utils'

const Chart = ({ className, ...props }: React.ComponentProps<'div'>) => (
  <div
    className={cn('grid aspect-[16/9] w-full gap-4 sm:grid-cols-2 xl:grid-cols-1', className)}
    {...props}
  />
)

const ChartContainer = ({ ...props }: React.ComponentProps<typeof ResponsiveContainer>) => (
  <ResponsiveContainer {...props} />
)

const ChartTooltip = ({ ...props }: React.ComponentProps<typeof Tooltip>) => (
  <Tooltip
    contentStyle={{
      background: 'hsl(var(--background))',
      borderColor: 'hsl(var(--border))',
    }}
    {...props}
  />
)

export {
  Chart,
  ChartContainer,
  ChartTooltip,
  AreaChartPrimitive,
  BarChartPrimitive,
  LineChartPrimitive,
  XAxis,
  YAxis,
  Area,
  Bar,
  Line,
}
