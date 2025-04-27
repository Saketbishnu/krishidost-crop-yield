"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, AlertTriangle, XCircle, ArrowUp, Minus } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

interface YieldResultsProps {
  results: {
    estimatedYield: number
    yieldCategory: string
    suggestions: string[]
    cropType: string
    landArea: number
    landAreaUnit: string
  }
  t: (key: string, section?: string) => string
}

export function YieldResults({ results, t }: YieldResultsProps) {
  const getCategoryIcon = () => {
    switch (results.yieldCategory) {
      case "high":
        return <CheckCircle2 className="h-6 w-6 text-green-500 dark:text-green-400" />
      case "medium":
        return <AlertTriangle className="h-6 w-6 text-yellow-500 dark:text-yellow-400" />
      case "low":
        return <XCircle className="h-6 w-6 text-red-500 dark:text-red-400" />
      default:
        return <Minus className="h-6 w-6" />
    }
  }

  const getCategoryColor = () => {
    switch (results.yieldCategory) {
      case "high":
        return "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20"
      case "medium":
        return "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20"
      case "low":
        return "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20"
      default:
        return "bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20"
    }
  }

  const getCategoryProgress = () => {
    switch (results.yieldCategory) {
      case "high":
        return 90
      case "medium":
        return 60
      case "low":
        return 30
      default:
        return 50
    }
  }

  const getTotalYield = () => {
    const area = results.landArea
    const areaMultiplier = results.landAreaUnit === "acres" ? 0.404686 : 1 // Convert acres to hectares if needed
    return (results.estimatedYield * area * areaMultiplier).toFixed(2)
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between">
          <span>{t("yieldPrediction")}</span>
          <Badge variant="outline" className={getCategoryColor()}>
            <span className="flex items-center gap-1">
              {getCategoryIcon()}
              {t(results.yieldCategory)}
            </span>
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">{t("estimatedYield")}</span>
            <span className="font-medium">
              {results.estimatedYield} {t("tons")}/{t("hectares")}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">{t("totalYield")}</span>
            <span className="font-medium">
              {getTotalYield()} {t("tons")}
            </span>
          </div>
          <Progress value={getCategoryProgress()} className="h-2 mt-2" />
        </div>

        <div className="space-y-2">
          <h3 className="font-medium">{t("improvementTips")}</h3>
          <ul className="space-y-2">
            {results.suggestions.map((suggestion, index) => (
              <li key={index} className="flex items-start gap-2 text-sm p-2 rounded-md bg-muted/50">
                <ArrowUp className="h-4 w-4 text-green-500 dark:text-green-400 mt-0.5 shrink-0" />
                <span>{suggestion}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
