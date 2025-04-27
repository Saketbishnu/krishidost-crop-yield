"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

const ChartTooltipContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return <div className={cn("rounded-md border bg-popover p-2 text-sm shadow-sm", className)} ref={ref} {...props} />
  },
)
ChartTooltipContent.displayName = "ChartTooltipContent"

const ChartTooltip = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>
}
ChartTooltip.displayName = "ChartTooltip"

const ChartLegend = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return <div className={cn("flex items-center justify-center", className)} ref={ref} {...props} />
  },
)
ChartLegend.displayName = "ChartLegend"

interface ChartLegendItemProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string
  color: string
}

const ChartLegendItem = ({ name, color }: ChartLegendItemProps) => {
  return (
    <div className="flex items-center gap-2">
      <div className="h-3 w-3 rounded-full" style={{ backgroundColor: color }} />
      <span className="text-sm">{name}</span>
    </div>
  )
}
ChartLegendItem.displayName = "ChartLegendItem"

export { ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendItem }
