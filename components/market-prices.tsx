"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ArrowDown, ArrowUp, Loader2, Minus } from "lucide-react"

interface MarketPricesProps {
  cropType: string
  t: (key: string, section?: string) => string
}

interface MarketData {
  markets: Array<{
    name: string
    price: number
    change: number
    trend: "up" | "down" | "stable"
  }>
}

export function MarketPrices({ cropType, t }: MarketPricesProps) {
  const [marketData, setMarketData] = useState<MarketData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (cropType) {
      // In a real app, this would fetch from a market price API
      // For demo purposes, we'll simulate a market API response
      setTimeout(() => {
        const mockMarketData: MarketData = {
          markets: [
            {
              name: "Delhi Agricultural Market",
              price: Math.floor(Math.random() * 1000) + 1000,
              change: Number.parseFloat((Math.random() * 5 - 2.5).toFixed(2)),
              trend: Math.random() > 0.6 ? "up" : Math.random() > 0.3 ? "down" : "stable",
            },
            {
              name: "Mumbai Wholesale Market",
              price: Math.floor(Math.random() * 1000) + 1000,
              change: Number.parseFloat((Math.random() * 5 - 2.5).toFixed(2)),
              trend: Math.random() > 0.6 ? "up" : Math.random() > 0.3 ? "down" : "stable",
            },
            {
              name: "Kolkata Farmers Market",
              price: Math.floor(Math.random() * 1000) + 1000,
              change: Number.parseFloat((Math.random() * 5 - 2.5).toFixed(2)),
              trend: Math.random() > 0.6 ? "up" : Math.random() > 0.3 ? "down" : "stable",
            },
            {
              name: "Chennai Agricultural Hub",
              price: Math.floor(Math.random() * 1000) + 1000,
              change: Number.parseFloat((Math.random() * 5 - 2.5).toFixed(2)),
              trend: Math.random() > 0.6 ? "up" : Math.random() > 0.3 ? "down" : "stable",
            },
            {
              name: "Bangalore Rural Market",
              price: Math.floor(Math.random() * 1000) + 1000,
              change: Number.parseFloat((Math.random() * 5 - 2.5).toFixed(2)),
              trend: Math.random() > 0.6 ? "up" : Math.random() > 0.3 ? "down" : "stable",
            },
          ],
        }
        setMarketData(mockMarketData)
        setLoading(false)
      }, 1000)
    }
  }, [cropType])

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <ArrowUp className="h-4 w-4 text-green-500" />
      case "down":
        return <ArrowDown className="h-4 w-4 text-red-500" />
      default:
        return <Minus className="h-4 w-4 text-gray-500" />
    }
  }

  const getTrendBadge = (trend: string, change: number) => {
    switch (trend) {
      case "up":
        return (
          <Badge variant="outline" className="bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20">
            <ArrowUp className="h-3 w-3 mr-1" />
            {change}%
          </Badge>
        )
      case "down":
        return (
          <Badge variant="outline" className="bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20">
            <ArrowDown className="h-3 w-3 mr-1" />
            {Math.abs(change)}%
          </Badge>
        )
      default:
        return (
          <Badge variant="outline" className="bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20">
            <Minus className="h-3 w-3 mr-1" />
            {change}%
          </Badge>
        )
    }
  }

  if (!cropType) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t("marketPrices")}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-6">
          <p className="text-center text-muted-foreground">{t("selectCrop")}</p>
        </CardContent>
      </Card>
    )
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t("marketPrices")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-4">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>{t("marketPrices")}</CardTitle>
      </CardHeader>
      <CardContent>
        {marketData && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("market")}</TableHead>
                <TableHead className="text-right">{t("price")} (₹/quintal)</TableHead>
                <TableHead className="text-right">{t("change")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {marketData.markets.map((market, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{market.name}</TableCell>
                  <TableCell className="text-right">₹{market.price}</TableCell>
                  <TableCell className="text-right">{getTrendBadge(market.trend, market.change)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
