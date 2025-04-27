"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Loader2, DollarSign, TrendingUp, TrendingDown, BarChart, PieChart, Download } from "lucide-react"
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Cell,
  PieChart as RechartsPieChart,
  Pie,
  Tooltip,
} from "recharts"

interface CostCalculatorProps {
  cropType: string
  landArea: number
  landAreaUnit: string
  estimatedYield?: number
  t: (key: string, section?: string) => string
}

interface CostData {
  inputs: {
    seeds: number
    fertilizers: number
    pesticides: number
    irrigation: number
    labor: number
    machinery: number
    others: number
  }
  marketPrice: number
  profitMargin: number
  breakEvenYield: number
  returnOnInvestment: number
}

export function CostCalculator({ cropType, landArea, landAreaUnit, estimatedYield, t }: CostCalculatorProps) {
  const [costData, setCostData] = useState<CostData | null>(null)
  const [loading, setLoading] = useState(true)
  const [customInputs, setCustomInputs] = useState<Record<string, number>>({
    seeds: 0,
    fertilizers: 0,
    pesticides: 0,
    irrigation: 0,
    labor: 0,
    machinery: 0,
    others: 0,
    marketPrice: 0,
  })
  const [calculatedResults, setCalculatedResults] = useState<{
    totalCost: number
    grossIncome: number
    netProfit: number
    profitMargin: number
    roi: number
    breakEvenYield: number
  } | null>(null)
  const [yield_value, setYield] = useState(estimatedYield || 0)

  useEffect(() => {
    if (cropType && landArea) {
      setLoading(true)
      // In a real app, this would fetch from an API
      setTimeout(() => {
        // Generate cost data based on crop type and land area
        const getCostData = (crop: string, area: number, areaUnit: string): CostData => {
          // Convert area to hectares for consistent calculations
          const areaInHectares = areaUnit === "acres" ? area * 0.404686 : area

          // Base costs per hectare for different crops (in currency units)
          const baseCosts: Record<
            string,
            {
              seeds: number
              fertilizers: number
              pesticides: number
              irrigation: number
              labor: number
              machinery: number
              others: number
              marketPrice: number
            }
          > = {
            rice: {
              seeds: 2500,
              fertilizers: 5000,
              pesticides: 2000,
              irrigation: 3000,
              labor: 8000,
              machinery: 4000,
              others: 1500,
              marketPrice: 20000, // per ton
            },
            wheat: {
              seeds: 2000,
              fertilizers: 4000,
              pesticides: 1500,
              irrigation: 2500,
              labor: 6000,
              machinery: 3500,
              others: 1200,
              marketPrice: 22000, // per ton
            },
            maize: {
              seeds: 3000,
              fertilizers: 4500,
              pesticides: 1800,
              irrigation: 2200,
              labor: 5500,
              machinery: 3000,
              others: 1300,
              marketPrice: 18000, // per ton
            },
            sugarcane: {
              seeds: 6000,
              fertilizers: 7000,
              pesticides: 2500,
              irrigation: 4000,
              labor: 10000,
              machinery: 5000,
              others: 2000,
              marketPrice: 3000, // per ton
            },
            cotton: {
              seeds: 4000,
              fertilizers: 5500,
              pesticides: 3000,
              irrigation: 3500,
              labor: 9000,
              machinery: 4500,
              others: 1800,
              marketPrice: 60000, // per ton
            },
          }

          // Default costs if specific crop not found
          const defaultCost = {
            seeds: 3000,
            fertilizers: 5000,
            pesticides: 2000,
            irrigation: 3000,
            labor: 7000,
            machinery: 4000,
            others: 1500,
            marketPrice: 20000, // per ton
          }

          const cropCosts = baseCosts[crop as keyof typeof baseCosts] || defaultCost

          // Scale costs based on area
          const scaledCosts = {
            seeds: Math.round(cropCosts.seeds * areaInHectares),
            fertilizers: Math.round(cropCosts.fertilizers * areaInHectares),
            pesticides: Math.round(cropCosts.pesticides * areaInHectares),
            irrigation: Math.round(cropCosts.irrigation * areaInHectares),
            labor: Math.round(cropCosts.labor * areaInHectares),
            machinery: Math.round(cropCosts.machinery * areaInHectares),
            others: Math.round(cropCosts.others * areaInHectares),
          }

          // Calculate total cost
          const totalCost = Object.values(scaledCosts).reduce((sum, cost) => sum + cost, 0)

          // Calculate profit margin and ROI
          const averageYield = getAverageYield(crop) * areaInHectares
          const grossIncome = averageYield * cropCosts.marketPrice
          const netProfit = grossIncome - totalCost
          const profitMargin = (netProfit / grossIncome) * 100
          const roi = (netProfit / totalCost) * 100

          // Calculate break-even yield
          const breakEvenYield = totalCost / cropCosts.marketPrice

          // Set custom inputs initial values
          setCustomInputs({
            seeds: scaledCosts.seeds,
            fertilizers: scaledCosts.fertilizers,
            pesticides: scaledCosts.pesticides,
            irrigation: scaledCosts.irrigation,
            labor: scaledCosts.labor,
            machinery: scaledCosts.machinery,
            others: scaledCosts.others,
            marketPrice: cropCosts.marketPrice,
          })

          // Set yield if not provided
          if (!estimatedYield) {
            setYield(averageYield)
          }

          return {
            inputs: scaledCosts,
            marketPrice: cropCosts.marketPrice,
            profitMargin: Math.round(profitMargin * 10) / 10,
            breakEvenYield: Math.round(breakEvenYield * 100) / 100,
            returnOnInvestment: Math.round(roi * 10) / 10,
          }
        }

        // Helper function to get average yield for different crops (tons per hectare)
        const getAverageYield = (crop: string): number => {
          const yields: Record<string, number> = {
            rice: 4.5,
            wheat: 3.2,
            maize: 5.8,
            sugarcane: 70,
            cotton: 1.8,
            pulses: 1.2,
            groundnut: 1.5,
            soybean: 2.0,
            potato: 20,
            onion: 25,
            tomato: 30,
          }

          return yields[crop as keyof typeof yields] || 3.0
        }

        const mockCostData = getCostData(cropType, landArea, landAreaUnit)
        setCostData(mockCostData)
        setLoading(false)
      }, 1000)
    }
  }, [cropType, landArea, landAreaUnit, estimatedYield])

  const calculateResults = () => {
    if (!costData) return

    // Calculate total cost
    const totalCost = Object.entries(customInputs)
      .filter(([key]) => key !== "marketPrice")
      .reduce((sum, [_, value]) => sum + value, 0)

    // Calculate gross income, profit, and other metrics
    const grossIncome = yield_value * customInputs.marketPrice
    const netProfit = grossIncome - totalCost
    const profitMargin = grossIncome > 0 ? (netProfit / grossIncome) * 100 : 0
    const roi = totalCost > 0 ? (netProfit / totalCost) * 100 : 0
    const breakEvenYield = customInputs.marketPrice > 0 ? totalCost / customInputs.marketPrice : 0

    setCalculatedResults({
      totalCost,
      grossIncome,
      netProfit,
      profitMargin: Math.round(profitMargin * 10) / 10,
      roi: Math.round(roi * 10) / 10,
      breakEvenYield: Math.round(breakEvenYield * 100) / 100,
    })
  }

  const handleInputChange = (name: string, value: number) => {
    setCustomInputs((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value)
  }

  if (!cropType || !landArea) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Cost Calculator</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-6">
          <DollarSign className="h-8 w-8 text-muted-foreground mb-2" />
          <p className="text-center text-muted-foreground">
            Please select a crop type and enter land area to use the cost calculator
          </p>
        </CardContent>
      </Card>
    )
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Cost Calculator</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-4">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-[200px] w-full" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Skeleton className="h-[150px] w-full" />
              <Skeleton className="h-[150px] w-full" />
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const costBreakdownData = costData
    ? [
        { name: "Seeds", value: customInputs.seeds },
        { name: "Fertilizers", value: customInputs.fertilizers },
        { name: "Pesticides", value: customInputs.pesticides },
        { name: "Irrigation", value: customInputs.irrigation },
        { name: "Labor", value: customInputs.labor },
        { name: "Machinery", value: customInputs.machinery },
        { name: "Others", value: customInputs.others },
      ]
    : []

  const profitAnalysisData = calculatedResults
    ? [
        { name: "Total Cost", value: calculatedResults.totalCost },
        { name: "Gross Income", value: calculatedResults.grossIncome },
        { name: "Net Profit", value: calculatedResults.netProfit },
      ]
    : []

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d", "#ffc658"]

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between">
          <span>Cost Calculator</span>
          {calculatedResults && (
            <Badge
              variant="outline"
              className={`${
                calculatedResults.netProfit > 0
                  ? "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20"
                  : "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20"
              }`}
            >
              {calculatedResults.netProfit > 0 ? "Profitable" : "Loss"}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {costData && (
          <div className="space-y-6">
            <Tabs defaultValue="inputs" className="w-full">
              <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
                <TabsTrigger value="inputs">Cost Inputs</TabsTrigger>
                <TabsTrigger value="results">Results</TabsTrigger>
                <TabsTrigger value="breakdown">Cost Breakdown</TabsTrigger>
                <TabsTrigger value="analysis">Profit Analysis</TabsTrigger>
              </TabsList>

              <TabsContent value="inputs" className="space-y-4 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="seeds">Seeds Cost ({formatCurrency(customInputs.seeds)})</Label>
                      <Slider
                        id="seeds"
                        min={0}
                        max={costData.inputs.seeds * 2}
                        step={100}
                        value={[customInputs.seeds]}
                        onValueChange={(value) => handleInputChange("seeds", value[0])}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="fertilizers">Fertilizers Cost ({formatCurrency(customInputs.fertilizers)})</Label>
                      <Slider
                        id="fertilizers"
                        min={0}
                        max={costData.inputs.fertilizers * 2}
                        step={100}
                        value={[customInputs.fertilizers]}
                        onValueChange={(value) => handleInputChange("fertilizers", value[0])}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="pesticides">Pesticides Cost ({formatCurrency(customInputs.pesticides)})</Label>
                      <Slider
                        id="pesticides"
                        min={0}
                        max={costData.inputs.pesticides * 2}
                        step={100}
                        value={[customInputs.pesticides]}
                        onValueChange={(value) => handleInputChange("pesticides", value[0])}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="irrigation">Irrigation Cost ({formatCurrency(customInputs.irrigation)})</Label>
                      <Slider
                        id="irrigation"
                        min={0}
                        max={costData.inputs.irrigation * 2}
                        step={100}
                        value={[customInputs.irrigation]}
                        onValueChange={(value) => handleInputChange("irrigation", value[0])}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="labor">Labor Cost ({formatCurrency(customInputs.labor)})</Label>
                      <Slider
                        id="labor"
                        min={0}
                        max={costData.inputs.labor * 2}
                        step={100}
                        value={[customInputs.labor]}
                        onValueChange={(value) => handleInputChange("labor", value[0])}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="machinery">Machinery Cost ({formatCurrency(customInputs.machinery)})</Label>
                      <Slider
                        id="machinery"
                        min={0}
                        max={costData.inputs.machinery * 2}
                        step={100}
                        value={[customInputs.machinery]}
                        onValueChange={(value) => handleInputChange("machinery", value[0])}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="others">Other Costs ({formatCurrency(customInputs.others)})</Label>
                      <Slider
                        id="others"
                        min={0}
                        max={costData.inputs.others * 2}
                        step={100}
                        value={[customInputs.others]}
                        onValueChange={(value) => handleInputChange("others", value[0])}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="marketPrice">Market Price (₹/ton)</Label>
                        <Input
                          id="marketPrice"
                          type="number"
                          min={0}
                          step={100}
                          value={customInputs.marketPrice}
                          onChange={(e) => handleInputChange("marketPrice", Number(e.target.value))}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="yield">Expected Yield (tons)</Label>
                        <Input
                          id="yield"
                          type="number"
                          min={0}
                          step={0.1}
                          value={yield_value}
                          onChange={(e) => setYield(Number(e.target.value))}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <Button onClick={calculateResults} className="w-full">
                  Calculate Profitability
                </Button>
              </TabsContent>

              <TabsContent value="results" className="space-y-4 pt-4">
                {calculatedResults ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 border rounded-lg flex flex-col items-center justify-center">
                        <div className="flex items-center gap-2 mb-2">
                          <DollarSign className="h-5 w-5 text-muted-foreground" />
                          <span className="font-medium">Total Cost</span>
                        </div>
                        <div className="text-2xl font-bold mb-2">{formatCurrency(calculatedResults.totalCost)}</div>
                        <div className="text-sm text-muted-foreground">
                          For {landArea} {landAreaUnit}
                        </div>
                      </div>

                      <div className="p-4 border rounded-lg flex flex-col items-center justify-center">
                        <div className="flex items-center gap-2 mb-2">
                          <TrendingUp className="h-5 w-5 text-green-500" />
                          <span className="font-medium">Gross Income</span>
                        </div>
                        <div className="text-2xl font-bold mb-2">{formatCurrency(calculatedResults.grossIncome)}</div>
                        <div className="text-sm text-muted-foreground">Based on {yield_value} tons yield</div>
                      </div>

                      <div className="p-4 border rounded-lg flex flex-col items-center justify-center">
                        <div className="flex items-center gap-2 mb-2">
                          <TrendingDown
                            className={`h-5 w-5 ${calculatedResults.netProfit >= 0 ? "text-green-500" : "text-red-500"}`}
                          />
                          <span className="font-medium">Net Profit</span>
                        </div>
                        <div
                          className={`text-2xl font-bold mb-2 ${calculatedResults.netProfit >= 0 ? "text-green-600" : "text-red-600"}`}
                        >
                          {formatCurrency(calculatedResults.netProfit)}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {calculatedResults.netProfit >= 0 ? "Profit" : "Loss"}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 border rounded-lg">
                        <h3 className="font-medium mb-3">Profit Margin</h3>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-2xl font-bold">{calculatedResults.profitMargin.toFixed(1)}%</span>
                          <Badge
                            variant="outline"
                            className={`${
                              calculatedResults.profitMargin > 20
                                ? "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20"
                                : calculatedResults.profitMargin > 0
                                  ? "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20"
                                  : "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20"
                            }`}
                          >
                            {calculatedResults.profitMargin > 20
                              ? "Excellent"
                              : calculatedResults.profitMargin > 0
                                ? "Moderate"
                                : "Poor"}
                          </Badge>
                        </div>
                        <Progress
                          value={Math.max(0, Math.min(100, calculatedResults.profitMargin + 30))}
                          className="h-2"
                        />
                      </div>

                      <div className="p-4 border rounded-lg">
                        <h3 className="font-medium mb-3">Return on Investment</h3>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-2xl font-bold">{calculatedResults.roi.toFixed(1)}%</span>
                          <Badge
                            variant="outline"
                            className={`${
                              calculatedResults.roi > 30
                                ? "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20"
                                : calculatedResults.roi > 0
                                  ? "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20"
                                  : "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20"
                            }`}
                          >
                            {calculatedResults.roi > 30 ? "Excellent" : calculatedResults.roi > 0 ? "Moderate" : "Poor"}
                          </Badge>
                        </div>
                        <Progress value={Math.max(0, Math.min(100, calculatedResults.roi + 20))} className="h-2" />
                      </div>

                      <div className="p-4 border rounded-lg">
                        <h3 className="font-medium mb-3">Break-even Yield</h3>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-2xl font-bold">{calculatedResults.breakEvenYield.toFixed(2)} tons</span>
                          <Badge
                            variant="outline"
                            className={`${
                              yield_value > calculatedResults.breakEvenYield * 1.5
                                ? "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20"
                                : yield_value > calculatedResults.breakEvenYield
                                  ? "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20"
                                  : "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20"
                            }`}
                          >
                            {yield_value > calculatedResults.breakEvenYield * 1.5
                              ? "Safe Margin"
                              : yield_value > calculatedResults.breakEvenYield
                                ? "Above Break-even"
                                : "Below Break-even"}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <Progress
                            value={(calculatedResults.breakEvenYield / yield_value) * 100}
                            className="h-2 flex-1"
                          />
                          <span className="text-xs text-muted-foreground w-24 text-right">
                            {((calculatedResults.breakEvenYield / yield_value) * 100).toFixed(0)}% of expected
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <h3 className="font-medium mb-3">Recommendations</h3>
                      <div className="space-y-2">
                        {calculatedResults.netProfit < 0 && (
                          <div className="flex items-start gap-2 p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/30 rounded-lg">
                            <TrendingDown className="h-5 w-5 text-red-500 mt-0.5" />
                            <div>
                              <h4 className="text-sm font-medium">Loss Alert</h4>
                              <p className="text-xs text-muted-foreground mt-1">
                                Your current inputs result in a loss. Consider reducing costs, increasing yield, or
                                finding better market prices.
                              </p>
                            </div>
                          </div>
                        )}

                        {calculatedResults.profitMargin < 15 && calculatedResults.profitMargin >= 0 && (
                          <div className="flex items-start gap-2 p-2 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-900/30 rounded-lg">
                            <TrendingDown className="h-5 w-5 text-yellow-500 mt-0.5" />
                            <div>
                              <h4 className="text-sm font-medium">Low Profit Margin</h4>
                              <p className="text-xs text-muted-foreground mt-1">
                                Your profit margin is relatively low. Look for ways to reduce input costs or improve
                                yield.
                              </p>
                            </div>
                          </div>
                        )}

                        {calculatedResults.profitMargin >= 15 && (
                          <div className="flex items-start gap-2 p-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900/30 rounded-lg">
                            <TrendingUp className="h-5 w-5 text-green-500 mt-0.5" />
                            <div>
                              <h4 className="text-sm font-medium">Good Profit Potential</h4>
                              <p className="text-xs text-muted-foreground mt-1">
                                Your current inputs show good profit potential. Focus on maintaining yield and quality.
                              </p>
                            </div>
                          </div>
                        )}

                        <div className="flex items-start gap-2 p-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-900/30 rounded-lg">
                          <BarChart className="h-5 w-5 text-blue-500 mt-0.5" />
                          <div>
                            <h4 className="text-sm font-medium">Cost Management</h4>
                            <p className="text-xs text-muted-foreground mt-1">
                              {Object.entries(customInputs)
                                .filter(([key]) => key !== "marketPrice")
                                .sort(([_, a], [__, b]) => b - a)[0][0] === "labor"
                                ? "Labor is your highest cost. Consider mechanization where possible to reduce labor costs."
                                : Object.entries(customInputs)
                                      .filter(([key]) => key !== "marketPrice")
                                      .sort(([_, a], [__, b]) => b - a)[0][0] === "fertilizers"
                                  ? "Fertilizers are your highest cost. Consider soil testing to optimize fertilizer application."
                                  : "Focus on reducing your highest cost inputs while maintaining productivity."}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <Button variant="outline" className="w-full">
                      <Download className="h-4 w-4 mr-2" />
                      Export Analysis as PDF
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-[300px] text-center text-muted-foreground">
                    <DollarSign className="h-8 w-8 mb-2" />
                    <p>Enter your cost inputs and click Calculate to see results</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="breakdown" className="space-y-4 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPieChart>
                        <Pie
                          data={costBreakdownData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {costBreakdownData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              return (
                                <div className="bg-background border rounded-lg shadow-md p-2">
                                  <p className="font-medium">{payload[0].name}</p>
                                  <p>{formatCurrency(payload[0].value)}</p>
                                </div>
                              )
                            }
                            return null
                          }}
                        />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-medium">Cost Breakdown</h3>

                    <div className="space-y-3">
                      {costBreakdownData.map((item, index) => (
                        <div key={index}>
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2">
                              <div
                                className="h-3 w-3 rounded-full"
                                style={{ backgroundColor: COLORS[index % COLORS.length] }}
                              />
                              <span className="text-sm">{item.name}</span>
                            </div>
                            <span className="text-sm font-medium">{formatCurrency(item.value)}</span>
                          </div>
                          <Progress
                            value={(item.value / costBreakdownData.reduce((sum, i) => sum + i.value, 0)) * 100}
                            className="h-1"
                            indicatorClassName={`bg-[${COLORS[index % COLORS.length]}]`}
                          />
                        </div>
                      ))}
                    </div>

                    <div className="p-3 bg-muted/50 rounded-lg mt-4">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Total Cost</span>
                        <span className="font-bold">
                          {formatCurrency(costBreakdownData.reduce((sum, item) => sum + item.value, 0))}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="analysis" className="space-y-4 pt-4">
                {calculatedResults ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsBarChart
                          data={profitAnalysisData}
                          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip
                            content={({ active, payload }) => {
                              if (active && payload && payload.length) {
                                return (
                                  <div className="bg-background border rounded-lg shadow-md p-2">
                                    <p className="font-medium">{payload[0].name}</p>
                                    <p>{formatCurrency(payload[0].value)}</p>
                                  </div>
                                )
                              }
                              return null
                            }}
                          />
                          <Bar dataKey="value">
                            {profitAnalysisData.map((entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={
                                  entry.name === "Total Cost"
                                    ? "#ff8042"
                                    : entry.name === "Gross Income"
                                      ? "#8884d8"
                                      : calculatedResults.netProfit >= 0
                                        ? "#00C49F"
                                        : "#ff0000"
                                }
                              />
                            ))}
                          </Bar>
                        </RechartsBarChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-medium">Profit Analysis</h3>

                      <div className="space-y-3">
                        <div className="p-3 border rounded-lg">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">Cost per Hectare</span>
                            <span>
                              {formatCurrency(
                                calculatedResults.totalCost /
                                  (landAreaUnit === "hectares" ? landArea : landArea * 0.404686),
                              )}
                            </span>
                          </div>
                        </div>

                        <div className="p-3 border rounded-lg">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">Revenue per Hectare</span>
                            <span>
                              {formatCurrency(
                                calculatedResults.grossIncome /
                                  (landAreaUnit === "hectares" ? landArea : landArea * 0.404686),
                              )}
                            </span>
                          </div>
                        </div>

                        <div className="p-3 border rounded-lg">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">Profit per Hectare</span>
                            <span className={calculatedResults.netProfit >= 0 ? "text-green-600" : "text-red-600"}>
                              {formatCurrency(
                                calculatedResults.netProfit /
                                  (landAreaUnit === "hectares" ? landArea : landArea * 0.404686),
                              )}
                            </span>
                          </div>
                        </div>

                        <div className="p-3 border rounded-lg">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">Cost per Ton</span>
                            <span>{formatCurrency(calculatedResults.totalCost / yield_value)}</span>
                          </div>
                        </div>

                        <div className="p-3 border rounded-lg">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">Profit per Ton</span>
                            <span className={calculatedResults.netProfit >= 0 ? "text-green-600" : "text-red-600"}>
                              {formatCurrency(calculatedResults.netProfit / yield_value)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-[300px] text-center text-muted-foreground">
                    <PieChart className="h-8 w-8 mb-2" />
                    <p>Calculate results first to see profit analysis</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
