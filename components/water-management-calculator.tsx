"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Loader2, Droplets, CloudRain, Timer, Calendar, AlertTriangle } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface WaterManagementCalculatorProps {
  cropType: string
  soilType: string
  landArea: number
  landAreaUnit: string
  rainfall: number
  t: (key: string, section?: string) => string
}

export function WaterManagementCalculator({
  cropType,
  soilType,
  landArea,
  landAreaUnit,
  rainfall,
  t,
}: WaterManagementCalculatorProps) {
  const [waterData, setWaterData] = useState<{
    waterRequirement: number // mm per day
    totalSeasonRequirement: number // mm for entire season
    irrigationSchedule: Array<{
      week: number
      waterNeeded: number // mm
      frequency: number // days between irrigation
      duration: number // minutes per irrigation
    }>
    waterConservationTips: string[]
    waterStressRisk: "low" | "medium" | "high"
    currentWaterBalance: number // mm (positive = excess, negative = deficit)
  } | null>(null)
  const [loading, setLoading] = useState(true)
  const [irrigationSystem, setIrrigationSystem] = useState("drip")
  const [flowRate, setFlowRate] = useState(10) // liters per minute
  const [customRainfall, setCustomRainfall] = useState(rainfall || 50)
  const [calculatedResults, setCalculatedResults] = useState<{
    waterNeeded: number
    irrigationTime: number
    waterSaved: number
  } | null>(null)

  useEffect(() => {
    if (cropType && soilType) {
      setLoading(true)
      // In a real app, this would fetch from an API
      setTimeout(() => {
        // Generate water management data based on crop and soil type
        const getWaterData = (crop: string, soil: string, rain: number) => {
          // Base water requirements by crop type (mm per day)
          const cropWaterNeeds: Record<string, number> = {
            rice: 8.5,
            wheat: 4.5,
            maize: 5.0,
            sugarcane: 7.0,
            cotton: 5.5,
            pulses: 3.5,
            groundnut: 4.0,
            soybean: 4.2,
            potato: 4.8,
            onion: 3.8,
            tomato: 5.2,
            chilli: 4.0,
            turmeric: 5.0,
            ginger: 4.5,
            banana: 6.5,
            mango: 5.0,
          }

          // Soil water retention factors
          const soilFactors: Record<string, number> = {
            sandy: 0.7, // low water retention
            alluvial: 1.0,
            black: 1.2,
            red: 0.9,
            laterite: 0.8,
            clayey: 1.3, // high water retention
          }

          // Calculate base water requirement
          const baseWaterNeed = cropWaterNeeds[crop as keyof typeof cropWaterNeeds] || 5.0
          const soilFactor = soilFactors[soil as keyof typeof soilFactors] || 1.0
          const dailyWaterNeed = baseWaterNeed * soilFactor

          // Calculate season length based on crop (days)
          const cropSeasonLength: Record<string, number> = {
            rice: 120,
            wheat: 140,
            maize: 100,
            sugarcane: 360,
            cotton: 180,
            pulses: 90,
            groundnut: 120,
            soybean: 100,
            potato: 100,
            onion: 120,
            tomato: 120,
            chilli: 150,
            turmeric: 240,
            ginger: 240,
            banana: 300,
            mango: 120,
          }

          const seasonLength = cropSeasonLength[crop as keyof typeof cropSeasonLength] || 120
          const totalSeasonNeed = dailyWaterNeed * seasonLength

          // Calculate water balance considering rainfall
          const effectiveRainfall = rain * 0.8 // 80% of rainfall is effective
          const waterBalance = effectiveRainfall - dailyWaterNeed * 7 // Weekly balance

          // Generate irrigation schedule
          const generateSchedule = () => {
            const schedule = []
            const weeksInSeason = Math.ceil(seasonLength / 7)

            for (let week = 1; week <= weeksInSeason; week++) {
              // Different water needs at different growth stages
              let stageFactor = 1.0
              if (week < weeksInSeason * 0.2) {
                stageFactor = 0.7 // Early stage
              } else if (week > weeksInSeason * 0.7) {
                stageFactor = 0.8 // Late stage
              } else {
                stageFactor = 1.2 // Mid/flowering stage
              }

              const weeklyWaterNeed = dailyWaterNeed * 7 * stageFactor
              const irrigationFrequency = soil === "sandy" ? 2 : soil === "clayey" ? 5 : 3
              const irrigationDuration = (weeklyWaterNeed / irrigationFrequency) * 10 // minutes

              schedule.push({
                week,
                waterNeeded: Math.round(weeklyWaterNeed),
                frequency: irrigationFrequency,
                duration: Math.round(irrigationDuration),
              })
            }

            return schedule
          }

          // Water conservation tips
          const getConservationTips = () => {
            const commonTips = [
              "Apply mulch around plants to reduce evaporation from soil",
              "Irrigate during early morning or evening to reduce evaporation losses",
              "Maintain your irrigation system to prevent leaks and ensure uniform water application",
            ]

            const soilSpecificTips: Record<string, string> = {
              sandy: "Consider adding organic matter to improve water retention in sandy soil",
              clayey: "Avoid overwatering clay soils to prevent waterlogging and root diseases",
              alluvial: "Implement contour farming to maximize water utilization in alluvial soils",
              red: "Use drip irrigation for efficient water use in red soils",
            }

            const cropSpecificTips: Record<string, string> = {
              rice: "Consider alternate wetting and drying technique to reduce water use in rice cultivation",
              wheat:
                "Schedule irrigation at critical growth stages like crown root initiation, flowering, and grain filling",
              sugarcane: "Use trash mulching to conserve soil moisture in sugarcane fields",
              cotton: "Implement deficit irrigation during vegetative growth to promote deeper root development",
            }

            const tips = [...commonTips]

            if (soilSpecificTips[soil as keyof typeof soilSpecificTips]) {
              tips.push(soilSpecificTips[soil as keyof typeof soilSpecificTips])
            }

            if (cropSpecificTips[crop as keyof typeof cropSpecificTips]) {
              tips.push(cropSpecificTips[crop as keyof typeof cropSpecificTips])
            }

            return tips
          }

          return {
            waterRequirement: Math.round(dailyWaterNeed * 10) / 10,
            totalSeasonRequirement: Math.round(totalSeasonNeed),
            irrigationSchedule: generateSchedule(),
            waterConservationTips: getConservationTips(),
            waterStressRisk: waterBalance < -20 ? "high" : waterBalance < 0 ? "medium" : "low",
            currentWaterBalance: Math.round(waterBalance),
          }
        }

        const mockWaterData = getWaterData(cropType, soilType, customRainfall)
        setWaterData(mockWaterData)
        setLoading(false)
      }, 1000)
    }
  }, [cropType, soilType, customRainfall])

  const calculateIrrigation = () => {
    if (!waterData) return

    // Convert land area to square meters
    const areaInSquareMeters = landAreaUnit === "hectares" ? landArea * 10000 : landArea * 4046.86 // acres to square meters

    // Calculate water needed in liters (1mm over 1m² = 1 liter)
    const waterNeededDaily = (waterData.waterRequirement * areaInSquareMeters) / 1000 // in cubic meters

    // Calculate irrigation time based on flow rate
    const irrigationTime = (waterNeededDaily * 1000) / (flowRate * 60) // hours

    // Calculate water saved compared to flood irrigation
    const conventionalWaterUse = (waterData.waterRequirement * 1.5 * areaInSquareMeters) / 1000
    const waterSaved =
      irrigationSystem === "drip"
        ? conventionalWaterUse - waterNeededDaily
        : irrigationSystem === "sprinkler"
          ? conventionalWaterUse - waterNeededDaily * 1.2
          : 0

    setCalculatedResults({
      waterNeeded: Math.round(waterNeededDaily * 100) / 100,
      irrigationTime: Math.round(irrigationTime * 100) / 100,
      waterSaved: Math.round(waterSaved * 100) / 100,
    })
  }

  const getStressColor = (stress: string) => {
    switch (stress) {
      case "high":
        return "text-red-500"
      case "medium":
        return "text-yellow-500"
      case "low":
        return "text-green-500"
      default:
        return "text-muted-foreground"
    }
  }

  const getStressBadge = (stress: string) => {
    switch (stress) {
      case "high":
        return (
          <Badge variant="outline" className="bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20">
            High Risk
          </Badge>
        )
      case "medium":
        return (
          <Badge
            variant="outline"
            className="bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20"
          >
            Medium Risk
          </Badge>
        )
      case "low":
        return (
          <Badge variant="outline" className="bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20">
            Low Risk
          </Badge>
        )
      default:
        return <Badge variant="outline">Unknown Risk</Badge>
    }
  }

  if (!cropType || !soilType) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Water Management</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-6">
          <Droplets className="h-8 w-8 text-muted-foreground mb-2" />
          <p className="text-center text-muted-foreground">
            Please select a crop type and soil type to view water management recommendations
          </p>
        </CardContent>
      </Card>
    )
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Water Management</CardTitle>
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
          <span>Water Management</span>
          {waterData && (
            <div className="flex items-center gap-2">
              <span className="text-sm">Water Stress Risk:</span>
              {getStressBadge(waterData.waterStressRisk)}
            </div>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {waterData && (
          <div className="space-y-6">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="schedule">Irrigation Schedule</TabsTrigger>
                <TabsTrigger value="calculator">Water Calculator</TabsTrigger>
                <TabsTrigger value="conservation">Water Conservation</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg flex flex-col items-center justify-center">
                    <div className="flex items-center gap-2 mb-2">
                      <Droplets className="h-5 w-5 text-blue-500" />
                      <span className="font-medium">Daily Water Need</span>
                    </div>
                    <div className="text-3xl font-bold mb-2">{waterData.waterRequirement} mm</div>
                    <div className="text-sm text-muted-foreground">per day</div>
                  </div>

                  <div className="p-4 border rounded-lg flex flex-col items-center justify-center">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="h-5 w-5 text-green-500" />
                      <span className="font-medium">Season Requirement</span>
                    </div>
                    <div className="text-3xl font-bold mb-2">{waterData.totalSeasonRequirement} mm</div>
                    <div className="text-sm text-muted-foreground">total for season</div>
                  </div>

                  <div className="p-4 border rounded-lg flex flex-col items-center justify-center">
                    <div className="flex items-center gap-2 mb-2">
                      <CloudRain className="h-5 w-5 text-indigo-500" />
                      <span className="font-medium">Water Balance</span>
                    </div>
                    <div
                      className={`text-3xl font-bold mb-2 ${waterData.currentWaterBalance < 0 ? "text-red-500" : "text-green-500"}`}
                    >
                      {waterData.currentWaterBalance} mm
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {waterData.currentWaterBalance < 0 ? "deficit" : "surplus"} (weekly)
                    </div>
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-4">Current Conditions</h3>

                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm">Recent Rainfall</span>
                        <span className="text-sm font-medium">{customRainfall} mm</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Slider
                          value={[customRainfall]}
                          min={0}
                          max={200}
                          step={5}
                          onValueChange={(value) => setCustomRainfall(value[0])}
                          className="flex-1"
                        />
                        <span className="w-12 text-right text-sm">{customRainfall} mm</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div>
                        <h4 className="text-sm font-medium mb-2">Soil Water Retention</h4>
                        <div className="flex items-center gap-2">
                          <Progress
                            value={
                              soilType === "clayey"
                                ? 90
                                : soilType === "black"
                                  ? 80
                                  : soilType === "alluvial"
                                    ? 60
                                    : soilType === "red"
                                      ? 50
                                      : soilType === "sandy"
                                        ? 30
                                        : 60
                            }
                            className="h-2 flex-1"
                          />
                          <span className="text-sm">
                            {soilType === "clayey" || soilType === "black"
                              ? "High"
                              : soilType === "alluvial"
                                ? "Medium"
                                : "Low"}
                          </span>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium mb-2">Crop Water Sensitivity</h4>
                        <div className="flex items-center gap-2">
                          <Progress
                            value={
                              cropType === "rice" || cropType === "sugarcane"
                                ? 90
                                : cropType === "tomato" || cropType === "onion"
                                  ? 80
                                  : cropType === "wheat" || cropType === "maize"
                                    ? 60
                                    : cropType === "cotton"
                                      ? 40
                                      : 70
                            }
                            className="h-2 flex-1"
                          />
                          <span className="text-sm">
                            {cropType === "rice" || cropType === "sugarcane"
                              ? "High"
                              : cropType === "tomato" || cropType === "onion"
                                ? "High"
                                : cropType === "wheat" || cropType === "maize"
                                  ? "Medium"
                                  : cropType === "cotton"
                                    ? "Low"
                                    : "Medium"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {waterData.waterStressRisk !== "low" && (
                  <div className="p-4 border rounded-lg border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-900/30">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
                      <div>
                        <h3 className="font-medium mb-1">Water Stress Alert</h3>
                        <p className="text-sm text-muted-foreground">
                          {waterData.waterStressRisk === "high"
                            ? "Current conditions indicate high risk of water stress. Immediate irrigation is recommended."
                            : "Moderate water stress risk detected. Monitor soil moisture closely and prepare for irrigation."}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="schedule" className="space-y-4 pt-4">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 px-3 font-medium">Week</th>
                        <th className="text-left py-2 px-3 font-medium">Water Needed</th>
                        <th className="text-left py-2 px-3 font-medium">Frequency</th>
                        <th className="text-left py-2 px-3 font-medium">Duration</th>
                      </tr>
                    </thead>
                    <tbody>
                      {waterData.irrigationSchedule.slice(0, 8).map((week) => (
                        <tr key={week.week} className="border-b">
                          <td className="py-2 px-3">Week {week.week}</td>
                          <td className="py-2 px-3">{week.waterNeeded} mm</td>
                          <td className="py-2 px-3">Every {week.frequency} days</td>
                          <td className="py-2 px-3">{week.duration} minutes</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium mb-3">Growth Stage Water Needs</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Water requirements vary throughout the growing season based on crop development stage.
                    </p>

                    <div className="space-y-3">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm">Early Stage (Establishment)</span>
                          <span className="text-sm font-medium">70%</span>
                        </div>
                        <Progress value={70} className="h-2" />
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm">Mid Stage (Flowering/Fruiting)</span>
                          <span className="text-sm font-medium">120%</span>
                        </div>
                        <Progress value={100} className="h-2" />
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm">Late Stage (Maturation)</span>
                          <span className="text-sm font-medium">80%</span>
                        </div>
                        <Progress value={80} className="h-2" />
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium mb-3">Irrigation Tips</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2 text-sm">
                        <Timer className="h-4 w-4 text-blue-500 mt-0.5" />
                        <span>Irrigate during early morning or late evening to reduce evaporation losses</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm">
                        <Droplets className="h-4 w-4 text-blue-500 mt-0.5" />
                        <span>Check soil moisture before irrigation to avoid over-watering</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm">
                        <CloudRain className="h-4 w-4 text-blue-500 mt-0.5" />
                        <span>Adjust irrigation schedule after rainfall events</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm">
                        <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5" />
                        <span>Watch for signs of water stress: wilting, curling leaves, or discoloration</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="calculator" className="space-y-4 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium mb-4">Irrigation System Calculator</h3>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="irrigationSystem">Irrigation System Type</Label>
                        <Select value={irrigationSystem} onValueChange={setIrrigationSystem}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="drip">Drip Irrigation</SelectItem>
                            <SelectItem value="sprinkler">Sprinkler System</SelectItem>
                            <SelectItem value="flood">Flood Irrigation</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="flowRate">Flow Rate (liters per minute)</Label>
                        <div className="flex items-center gap-2">
                          <Slider
                            id="flowRate"
                            min={1}
                            max={50}
                            step={1}
                            value={[flowRate]}
                            onValueChange={(value) => setFlowRate(value[0])}
                            className="flex-1"
                          />
                          <span className="w-12 text-right">{flowRate}</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Land Area</Label>
                        <div className="flex items-center gap-2">
                          <Input type="text" value={landArea} disabled className="flex-1" />
                          <span className="w-24 text-right">{landAreaUnit}</span>
                        </div>
                      </div>

                      <Button onClick={calculateIrrigation} className="w-full">
                        Calculate
                      </Button>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium mb-4">Results</h3>

                    {calculatedResults ? (
                      <div className="space-y-4">
                        <div className="p-3 bg-muted/50 rounded-lg">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Daily Water Needed:</span>
                            <span className="font-medium">{calculatedResults.waterNeeded} m³</span>
                          </div>
                        </div>

                        <div className="p-3 bg-muted/50 rounded-lg">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Irrigation Time:</span>
                            <span className="font-medium">{calculatedResults.irrigationTime} hours</span>
                          </div>
                        </div>

                        <div className="p-3 bg-muted/50 rounded-lg">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Water Saved vs. Conventional:</span>
                            <span className="font-medium text-green-600">{calculatedResults.waterSaved} m³</span>
                          </div>
                        </div>

                        <div className="p-3 border border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-900/30 rounded-lg">
                          <div className="flex items-start gap-2">
                            <Droplets className="h-5 w-5 text-green-500 mt-0.5" />
                            <div>
                              <h4 className="font-medium text-sm">Efficiency Analysis</h4>
                              <p className="text-xs text-muted-foreground mt-1">
                                {irrigationSystem === "drip"
                                  ? "Drip irrigation is 90% efficient, saving significant water compared to conventional methods."
                                  : irrigationSystem === "sprinkler"
                                    ? "Sprinkler systems are 75% efficient, offering moderate water savings."
                                    : "Flood irrigation is only 50% efficient. Consider upgrading to drip or sprinkler systems."}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-[200px] text-center text-muted-foreground">
                        <Droplets className="h-8 w-8 mb-2" />
                        <p>Enter your irrigation system details and click Calculate to see results</p>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="conservation" className="space-y-4 pt-4">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-4">Water Conservation Strategies</h3>

                  <ul className="space-y-3">
                    {waterData.waterConservationTips.map((tip, index) => (
                      <li key={index} className="flex items-start gap-2 p-3 bg-muted/50 rounded-lg">
                        <Droplets className="h-5 w-5 text-blue-500 mt-0.5 shrink-0" />
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium mb-3">Irrigation System Efficiency</h3>

                    <div className="space-y-3">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm">Drip Irrigation</span>
                          <span className="text-sm font-medium">90%</span>
                        </div>
                        <Progress value={90} className="h-2" />
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm">Sprinkler System</span>
                          <span className="text-sm font-medium">75%</span>
                        </div>
                        <Progress value={75} className="h-2" />
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm">Flood Irrigation</span>
                          <span className="text-sm font-medium">50%</span>
                        </div>
                        <Progress value={50} className="h-2" />
                      </div>
                    </div>

                    <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                      <p className="text-sm text-muted-foreground">
                        Upgrading from flood to drip irrigation can save up to 40% of water while improving crop yields
                        through more precise water application.
                      </p>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium mb-3">Rainwater Harvesting Potential</h3>

                    <p className="text-sm text-muted-foreground mb-4">
                      Collecting rainwater can supplement irrigation needs and reduce dependence on groundwater.
                    </p>

                    <div className="space-y-3">
                      <div className="flex items-start gap-2">
                        <CloudRain className="h-5 w-5 text-blue-500 mt-0.5 shrink-0" />
                        <div>
                          <span className="font-medium">Collection Area</span>
                          <p className="text-sm text-muted-foreground">
                            For every 100 m² of collection area, you can harvest approximately 1 m³ of water per 10 mm
                            of rainfall.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <Droplets className="h-5 w-5 text-blue-500 mt-0.5 shrink-0" />
                        <div>
                          <span className="font-medium">Storage Capacity</span>
                          <p className="text-sm text-muted-foreground">
                            Consider installing storage tanks or creating farm ponds to store rainwater for use during
                            dry periods.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
