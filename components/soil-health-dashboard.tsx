"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Loader2, Leaf, Droplets, Zap, ThermometerSun, AlertTriangle } from "lucide-react"
import { ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendItem } from "@/components/ui/chart"
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, PieChart, Pie, Sector } from "recharts"

interface SoilHealthDashboardProps {
  soilType: string
  cropType: string
  t: (key: string, section?: string) => string
}

interface SoilHealthData {
  ph: number
  organicMatter: number
  nitrogen: number
  phosphorus: number
  potassium: number
  micronutrients: {
    zinc: number
    iron: number
    manganese: number
    copper: number
    boron: number
  }
  texture: {
    sand: number
    silt: number
    clay: number
  }
  recommendations: string[]
  healthScore: number
}

export function SoilHealthDashboard({ soilType, cropType, t }: SoilHealthDashboardProps) {
  const [soilData, setSoilData] = useState<SoilHealthData | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    if (soilType) {
      setLoading(true)
      // In a real app, this would fetch from an API
      setTimeout(() => {
        // Generate soil health data based on soil type
        const getSoilHealthData = (soil: string): SoilHealthData => {
          const baseData: Record<string, Partial<SoilHealthData>> = {
            alluvial: {
              ph: 7.2,
              organicMatter: 2.8,
              nitrogen: 75,
              phosphorus: 65,
              potassium: 80,
              micronutrients: {
                zinc: 0.8,
                iron: 4.5,
                manganese: 2.1,
                copper: 0.9,
                boron: 0.6,
              },
              texture: {
                sand: 40,
                silt: 40,
                clay: 20,
              },
              healthScore: 85,
            },
            black: {
              ph: 7.8,
              organicMatter: 1.9,
              nitrogen: 60,
              phosphorus: 70,
              potassium: 90,
              micronutrients: {
                zinc: 0.6,
                iron: 3.8,
                manganese: 1.8,
                copper: 1.1,
                boron: 0.5,
              },
              texture: {
                sand: 25,
                silt: 30,
                clay: 45,
              },
              healthScore: 75,
            },
            red: {
              ph: 6.5,
              organicMatter: 1.5,
              nitrogen: 50,
              phosphorus: 45,
              potassium: 60,
              micronutrients: {
                zinc: 0.5,
                iron: 5.2,
                manganese: 1.5,
                copper: 0.7,
                boron: 0.4,
              },
              texture: {
                sand: 60,
                silt: 20,
                clay: 20,
              },
              healthScore: 65,
            },
            sandy: {
              ph: 6.8,
              organicMatter: 1.0,
              nitrogen: 40,
              phosphorus: 35,
              potassium: 45,
              micronutrients: {
                zinc: 0.4,
                iron: 3.0,
                manganese: 1.2,
                copper: 0.5,
                boron: 0.3,
              },
              texture: {
                sand: 80,
                silt: 10,
                clay: 10,
              },
              healthScore: 55,
            },
            clayey: {
              ph: 7.5,
              organicMatter: 2.2,
              nitrogen: 65,
              phosphorus: 55,
              potassium: 75,
              micronutrients: {
                zinc: 0.7,
                iron: 4.0,
                manganese: 2.0,
                copper: 1.0,
                boron: 0.5,
              },
              texture: {
                sand: 20,
                silt: 20,
                clay: 60,
              },
              healthScore: 70,
            },
          }

          // Generate recommendations based on soil type and values
          const getRecommendations = (soilData: Partial<SoilHealthData>, soil: string) => {
            const recommendations = []

            if (soilData.ph && soilData.ph > 7.5) {
              recommendations.push("Apply sulfur or gypsum to reduce soil pH")
            } else if (soilData.ph && soilData.ph < 6.5) {
              recommendations.push("Apply agricultural lime to increase soil pH")
            }

            if (soilData.organicMatter && soilData.organicMatter < 2.0) {
              recommendations.push("Incorporate organic matter through compost or green manure")
            }

            if (soilData.nitrogen && soilData.nitrogen < 60) {
              recommendations.push("Apply nitrogen fertilizer or grow nitrogen-fixing cover crops")
            }

            if (soilData.phosphorus && soilData.phosphorus < 50) {
              recommendations.push("Apply phosphorus fertilizer or bone meal")
            }

            if (soilData.potassium && soilData.potassium < 60) {
              recommendations.push("Apply potassium fertilizer or wood ash")
            }

            if (soil === "sandy") {
              recommendations.push("Improve water retention by adding organic matter")
            } else if (soil === "clayey") {
              recommendations.push("Improve drainage and aeration through tillage and organic amendments")
            }

            return recommendations.length > 0
              ? recommendations
              : ["Your soil is in good condition for the selected crop"]
          }

          const soilDataResult = baseData[soil as keyof typeof baseData] || baseData.alluvial
          return {
            ...soilDataResult,
            recommendations: getRecommendations(soilDataResult, soil),
          } as SoilHealthData
        }

        const mockSoilData = getSoilHealthData(soilType)
        setSoilData(mockSoilData)
        setLoading(false)
      }, 1000)
    }
  }, [soilType, cropType])

  const getNutrientStatus = (value: number, type: string) => {
    const thresholds: Record<string, [number, number]> = {
      nitrogen: [50, 70],
      phosphorus: [40, 60],
      potassium: [60, 80],
      organicMatter: [1.5, 2.5],
    }

    const [low, high] = thresholds[type] || [0, 0]

    if (value < low) return "low"
    if (value > high) return "high"
    return "optimal"
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "low":
        return (
          <Badge variant="outline" className="bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20">
            Low
          </Badge>
        )
      case "optimal":
        return (
          <Badge variant="outline" className="bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20">
            Optimal
          </Badge>
        )
      case "high":
        return (
          <Badge
            variant="outline"
            className="bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20"
          >
            High
          </Badge>
        )
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const getHealthScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500"
    if (score >= 60) return "text-yellow-500"
    return "text-red-500"
  }

  const nutrientData = soilData
    ? [
        { name: "N", value: soilData.nitrogen, fill: "#4ade80" },
        { name: "P", value: soilData.phosphorus, fill: "#60a5fa" },
        { name: "K", value: soilData.potassium, fill: "#f97316" },
      ]
    : []

  const textureData = soilData
    ? [
        { name: "Sand", value: soilData.texture.sand, fill: "#fbbf24" },
        { name: "Silt", value: soilData.texture.silt, fill: "#60a5fa" },
        { name: "Clay", value: soilData.texture.clay, fill: "#f43f5e" },
      ]
    : []

  const micronutrientData = soilData
    ? [
        { name: "Zinc", value: soilData.micronutrients.zinc * 100, fill: "#8b5cf6" },
        { name: "Iron", value: soilData.micronutrients.iron * 20, fill: "#ec4899" },
        { name: "Manganese", value: soilData.micronutrients.manganese * 50, fill: "#14b8a6" },
        { name: "Copper", value: soilData.micronutrients.copper * 100, fill: "#f97316" },
        { name: "Boron", value: soilData.micronutrients.boron * 200, fill: "#6366f1" },
      ]
    : []

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index)
  }

  const renderActiveShape = (props: any) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props

    return (
      <g>
        <text x={cx} y={cy} dy={-20} textAnchor="middle" fill={fill} className="text-xs font-medium">
          {payload.name}
        </text>
        <text x={cx} y={cy} textAnchor="middle" fill={fill} className="text-lg font-bold">
          {`${value}%`}
        </text>
        <text x={cx} y={cy} dy={20} textAnchor="middle" fill={fill} className="text-xs">
          {`(${(percent * 100).toFixed(0)}%)`}
        </text>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius + 6}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={innerRadius - 6}
          outerRadius={innerRadius - 2}
          fill={fill}
        />
      </g>
    )
  }

  if (!soilType) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Soil Health Dashboard</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-6">
          <Leaf className="h-8 w-8 text-muted-foreground mb-2" />
          <p className="text-center text-muted-foreground">Please select a soil type to view soil health analysis</p>
        </CardContent>
      </Card>
    )
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Soil Health Dashboard</CardTitle>
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

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between">
          <span>Soil Health Dashboard</span>
          {soilData && (
            <Badge
              variant="outline"
              className={`${
                soilData.healthScore >= 80
                  ? "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20"
                  : soilData.healthScore >= 60
                    ? "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20"
                    : "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20"
              }`}
            >
              Health Score: {soilData.healthScore}/100
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {soilData && (
          <div className="space-y-6">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-3 md:grid-cols-5">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="nutrients">Nutrients</TabsTrigger>
                <TabsTrigger value="texture">Texture</TabsTrigger>
                <TabsTrigger value="micro" className="hidden md:inline-flex">
                  Micronutrients
                </TabsTrigger>
                <TabsTrigger value="recommendations" className="hidden md:inline-flex">
                  Recommendations
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg flex flex-col items-center justify-center">
                    <div className="flex items-center gap-2 mb-2">
                      <ThermometerSun className="h-5 w-5 text-yellow-500" />
                      <span className="font-medium">pH Level</span>
                    </div>
                    <div className="text-3xl font-bold mb-2">{soilData.ph.toFixed(1)}</div>
                    <div className="text-sm text-muted-foreground">
                      {soilData.ph < 6.5 ? "Acidic" : soilData.ph > 7.5 ? "Alkaline" : "Neutral"}
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg flex flex-col items-center justify-center">
                    <div className="flex items-center gap-2 mb-2">
                      <Leaf className="h-5 w-5 text-green-500" />
                      <span className="font-medium">Organic Matter</span>
                    </div>
                    <div className="text-3xl font-bold mb-2">{soilData.organicMatter.toFixed(1)}%</div>
                    <div className="flex items-center">
                      {getStatusBadge(getNutrientStatus(soilData.organicMatter, "organicMatter"))}
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg flex flex-col items-center justify-center">
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="h-5 w-5 text-blue-500" />
                      <span className="font-medium">Soil Type</span>
                    </div>
                    <div className="text-xl font-bold mb-2 capitalize">{soilType} Soil</div>
                    <div className="text-sm text-muted-foreground">
                      {soilData.texture.sand > 60 ? "Sandy" : soilData.texture.clay > 40 ? "Clayey" : "Loamy"} texture
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <div className="p-4 border rounded-lg h-full">
                      <h3 className="font-medium mb-4">Primary Nutrients (ppm)</h3>
                      <div className="h-[200px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={nutrientData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                            <XAxis dataKey="name" />
                            <YAxis />
                            <ChartTooltip
                              content={({ active, payload }) => {
                                if (active && payload && payload.length) {
                                  return (
                                    <ChartTooltipContent>
                                      <div className="font-bold">{payload[0].name}</div>
                                      <div>{payload[0].value} ppm</div>
                                    </ChartTooltipContent>
                                  )
                                }
                                return null
                              }}
                            />
                            <Bar dataKey="value">
                              {nutrientData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.fill} />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="p-4 border rounded-lg h-full">
                      <h3 className="font-medium mb-2">Health Score</h3>
                      <div className="flex flex-col items-center justify-center h-[180px]">
                        <div className={`text-5xl font-bold ${getHealthScoreColor(soilData.healthScore)}`}>
                          {soilData.healthScore}
                        </div>
                        <div className="text-sm text-muted-foreground mt-2">out of 100</div>
                        <Progress
                          value={soilData.healthScore}
                          className="h-2 mt-4 w-full"
                          indicatorClassName={
                            soilData.healthScore >= 80
                              ? "bg-green-500"
                              : soilData.healthScore >= 60
                                ? "bg-yellow-500"
                                : "bg-red-500"
                          }
                        />
                        <div className="text-sm mt-4 text-center">
                          {soilData.healthScore >= 80
                            ? "Excellent soil health"
                            : soilData.healthScore >= 60
                              ? "Moderate soil health"
                              : "Poor soil health - needs improvement"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="nutrients" className="space-y-4 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">Nitrogen (N)</h3>
                      {getStatusBadge(getNutrientStatus(soilData.nitrogen, "nitrogen"))}
                    </div>
                    <div className="text-3xl font-bold mb-2">{soilData.nitrogen} ppm</div>
                    <Progress value={(soilData.nitrogen / 100) * 100} className="h-2" />
                    <p className="text-sm text-muted-foreground mt-2">
                      {soilData.nitrogen < 50
                        ? "Low nitrogen levels may limit plant growth"
                        : soilData.nitrogen > 70
                          ? "High nitrogen levels may cause excessive vegetative growth"
                          : "Optimal nitrogen levels for most crops"}
                    </p>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">Phosphorus (P)</h3>
                      {getStatusBadge(getNutrientStatus(soilData.phosphorus, "phosphorus"))}
                    </div>
                    <div className="text-3xl font-bold mb-2">{soilData.phosphorus} ppm</div>
                    <Progress value={(soilData.phosphorus / 100) * 100} className="h-2" />
                    <p className="text-sm text-muted-foreground mt-2">
                      {soilData.phosphorus < 40
                        ? "Low phosphorus may affect root development and flowering"
                        : soilData.phosphorus > 60
                          ? "High phosphorus levels are good for root crops"
                          : "Optimal phosphorus levels for most crops"}
                    </p>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">Potassium (K)</h3>
                      {getStatusBadge(getNutrientStatus(soilData.potassium, "potassium"))}
                    </div>
                    <div className="text-3xl font-bold mb-2">{soilData.potassium} ppm</div>
                    <Progress value={(soilData.potassium / 100) * 100} className="h-2" />
                    <p className="text-sm text-muted-foreground mt-2">
                      {soilData.potassium < 60
                        ? "Low potassium may reduce stress tolerance and fruit quality"
                        : soilData.potassium > 80
                          ? "High potassium levels improve crop quality and disease resistance"
                          : "Optimal potassium levels for most crops"}
                    </p>
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-4">Nutrient Balance</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    The ideal N:P:K ratio varies by crop type. For {cropType || "most crops"}, a balanced ratio is
                    important for optimal growth.
                  </p>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="h-3 w-3 rounded-full bg-green-500"></div>
                    <span className="text-sm">Nitrogen: {soilData.nitrogen} ppm</span>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                    <span className="text-sm">Phosphorus: {soilData.phosphorus} ppm</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-orange-500"></div>
                    <span className="text-sm">Potassium: {soilData.potassium} ppm</span>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="texture" className="space-y-4 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium mb-4">Soil Texture Composition</h3>
                    <div className="h-[250px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            activeIndex={activeIndex}
                            activeShape={renderActiveShape}
                            data={textureData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            dataKey="value"
                            onMouseEnter={onPieEnter}
                          >
                            {textureData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                          </Pie>
                          <ChartTooltip
                            content={({ active, payload }) => {
                              if (active && payload && payload.length) {
                                return (
                                  <ChartTooltipContent>
                                    <div className="font-bold">{payload[0].name}</div>
                                    <div>{payload[0].value}%</div>
                                  </ChartTooltipContent>
                                )
                              }
                              return null
                            }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <ChartLegend className="mt-2 flex justify-center gap-4">
                      <ChartLegendItem name="Sand" color="#fbbf24" />
                      <ChartLegendItem name="Silt" color="#60a5fa" />
                      <ChartLegendItem name="Clay" color="#f43f5e" />
                    </ChartLegend>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium mb-4">Texture Properties</h3>
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm">Water Retention</span>
                          <span className="text-sm font-medium">
                            {soilData.texture.clay > 40 ? "High" : soilData.texture.sand > 60 ? "Low" : "Medium"}
                          </span>
                        </div>
                        <Progress
                          value={soilData.texture.clay > 40 ? 90 : soilData.texture.sand > 60 ? 30 : 60}
                          className="h-2"
                        />
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm">Drainage</span>
                          <span className="text-sm font-medium">
                            {soilData.texture.sand > 60 ? "High" : soilData.texture.clay > 40 ? "Low" : "Medium"}
                          </span>
                        </div>
                        <Progress
                          value={soilData.texture.sand > 60 ? 90 : soilData.texture.clay > 40 ? 30 : 60}
                          className="h-2"
                        />
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm">Nutrient Retention</span>
                          <span className="text-sm font-medium">
                            {soilData.texture.clay > 40 ? "High" : soilData.texture.sand > 60 ? "Low" : "Medium"}
                          </span>
                        </div>
                        <Progress
                          value={soilData.texture.clay > 40 ? 90 : soilData.texture.sand > 60 ? 30 : 60}
                          className="h-2"
                        />
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm">Aeration</span>
                          <span className="text-sm font-medium">
                            {soilData.texture.sand > 60 ? "High" : soilData.texture.clay > 40 ? "Low" : "Medium"}
                          </span>
                        </div>
                        <Progress
                          value={soilData.texture.sand > 60 ? 90 : soilData.texture.clay > 40 ? 30 : 60}
                          className="h-2"
                        />
                      </div>
                    </div>

                    <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                      <h4 className="text-sm font-medium mb-2">Soil Management Tips</h4>
                      <p className="text-xs text-muted-foreground">
                        {soilData.texture.sand > 60
                          ? "Sandy soil: Add organic matter to improve water and nutrient retention. Consider more frequent irrigation with smaller amounts of water."
                          : soilData.texture.clay > 40
                            ? "Clay soil: Improve drainage by adding organic matter and avoiding working the soil when wet. Consider raised beds for better drainage."
                            : "Loamy soil: Maintain organic matter levels through regular additions of compost or mulch."}
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="micro" className="space-y-4 pt-4">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-4">Micronutrient Levels</h3>
                  <div className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={micronutrientData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <ChartTooltip
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              return (
                                <ChartTooltipContent>
                                  <div className="font-bold">{payload[0].name}</div>
                                  <div>{(payload[0].value / 100).toFixed(2)} ppm</div>
                                </ChartTooltipContent>
                              )
                            }
                            return null
                          }}
                        />
                        <Bar dataKey="value">
                          {micronutrientData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium mb-2">Zinc (Zn)</h3>
                    <div className="text-xl font-bold mb-1">{soilData.micronutrients.zinc.toFixed(2)} ppm</div>
                    <Progress value={(soilData.micronutrients.zinc / 1) * 100} className="h-2 mb-2" />
                    <p className="text-xs text-muted-foreground">
                      {soilData.micronutrients.zinc < 0.5
                        ? "Deficient - may cause stunted growth and reduced yields"
                        : "Sufficient for most crops"}
                    </p>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium mb-2">Iron (Fe)</h3>
                    <div className="text-xl font-bold mb-1">{soilData.micronutrients.iron.toFixed(2)} ppm</div>
                    <Progress value={(soilData.micronutrients.iron / 10) * 100} className="h-2 mb-2" />
                    <p className="text-xs text-muted-foreground">
                      {soilData.micronutrients.iron < 3.0
                        ? "Deficient - may cause chlorosis (yellowing) of leaves"
                        : "Sufficient for most crops"}
                    </p>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium mb-2">Manganese (Mn)</h3>
                    <div className="text-xl font-bold mb-1">{soilData.micronutrients.manganese.toFixed(2)} ppm</div>
                    <Progress value={(soilData.micronutrients.manganese / 4) * 100} className="h-2 mb-2" />
                    <p className="text-xs text-muted-foreground">
                      {soilData.micronutrients.manganese < 1.0
                        ? "Deficient - may cause interveinal chlorosis and reduced growth"
                        : "Sufficient for most crops"}
                    </p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="recommendations" className="space-y-4 pt-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-4">
                    <AlertTriangle className="h-5 w-5 text-yellow-500" />
                    <h3 className="font-medium">Soil Improvement Recommendations</h3>
                  </div>

                  <ul className="space-y-3">
                    {soilData.recommendations.map((recommendation, index) => (
                      <li key={index} className="flex items-start gap-2 p-3 bg-muted/50 rounded-lg">
                        <Leaf className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                        <span>{recommendation}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-3">Crop-Specific Soil Management</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {cropType
                      ? `These recommendations are tailored for ${cropType} cultivation in ${soilType} soil.`
                      : "Select a crop type to get crop-specific soil management recommendations."}
                  </p>

                  {cropType && (
                    <div className="space-y-3">
                      <div className="flex items-start gap-2">
                        <Droplets className="h-5 w-5 text-blue-500 mt-0.5 shrink-0" />
                        <div>
                          <span className="font-medium">Water Management</span>
                          <p className="text-sm text-muted-foreground">
                            {soilData.texture.sand > 60
                              ? "Frequent irrigation with smaller amounts of water is recommended for sandy soils."
                              : soilData.texture.clay > 40
                                ? "Avoid overwatering as clay soils have poor drainage. Consider drip irrigation."
                                : "Moderate irrigation with attention to soil moisture levels is recommended."}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <Zap className="h-5 w-5 text-purple-500 mt-0.5 shrink-0" />
                        <div>
                          <span className="font-medium">Fertilization Strategy</span>
                          <p className="text-sm text-muted-foreground">
                            {soilData.nitrogen < 50 || soilData.phosphorus < 40 || soilData.potassium < 60
                              ? "Apply balanced fertilizer with emphasis on deficient nutrients. Consider split applications."
                              : "Maintain current fertility levels with regular soil testing to monitor changes."}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <ThermometerSun className="h-5 w-5 text-yellow-500 mt-0.5 shrink-0" />
                        <div>
                          <span className="font-medium">pH Management</span>
                          <p className="text-sm text-muted-foreground">
                            {soilData.ph < 6.5
                              ? "Apply agricultural lime to raise pH for optimal nutrient availability."
                              : soilData.ph > 7.5
                                ? "Consider applying sulfur or gypsum to lower pH gradually."
                                : "Current pH is optimal for most crops. Maintain with regular monitoring."}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
