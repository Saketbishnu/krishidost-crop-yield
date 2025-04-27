"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowRight, Loader2, Sprout } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface CropRotationProps {
  cropType: string
  soilType: string
  t: (key: string, section?: string) => string
}

interface RotationData {
  currentCrop: string
  recommendedSequence: string[]
  benefits: string[]
  timeframe: string
}

export function CropRotation({ cropType, soilType, t }: CropRotationProps) {
  const [rotationData, setRotationData] = useState<RotationData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (cropType && soilType) {
      // In a real app, this would fetch from an API
      // For demo purposes, we'll simulate an API response
      setLoading(true)
      setTimeout(() => {
        // Generate rotation recommendations based on crop and soil type
        const getRecommendedCrops = (crop: string, soil: string) => {
          const rotationMap: Record<string, string[]> = {
            rice: ["legumes", "wheat", "maize", "vegetables"],
            wheat: ["legumes", "rice", "oilseeds", "vegetables"],
            maize: ["legumes", "wheat", "vegetables", "oilseeds"],
            sugarcane: ["legumes", "rice", "vegetables", "wheat"],
            cotton: ["legumes", "maize", "vegetables", "wheat"],
            pulses: ["wheat", "rice", "maize", "vegetables"],
            groundnut: ["wheat", "rice", "vegetables", "maize"],
            soybean: ["wheat", "rice", "maize", "vegetables"],
            potato: ["legumes", "maize", "wheat", "vegetables"],
            onion: ["legumes", "wheat", "maize", "vegetables"],
            tomato: ["legumes", "wheat", "maize", "vegetables"],
          }

          // Default rotation if specific crop not found
          return rotationMap[crop as keyof typeof rotationMap] || ["legumes", "cereals", "vegetables", "oilseeds"]
        }

        const getBenefits = (crop: string) => {
          const benefitsMap: Record<string, string[]> = {
            rice: [
              "Breaks pest and disease cycles",
              "Improves soil fertility",
              "Reduces weed pressure",
              "Diversifies income sources",
            ],
            wheat: [
              "Reduces soil erosion",
              "Improves soil structure",
              "Breaks pest cycles",
              "Optimizes nutrient utilization",
            ],
            maize: [
              "Enhances soil organic matter",
              "Reduces pest pressure",
              "Improves water use efficiency",
              "Balances nutrient uptake",
            ],
            default: [
              "Improves soil health and structure",
              "Reduces pest and disease pressure",
              "Optimizes nutrient utilization",
              "Increases overall farm productivity",
            ],
          }

          return benefitsMap[crop as keyof typeof benefitsMap] || benefitsMap.default
        }

        const mockRotationData: RotationData = {
          currentCrop: cropType,
          recommendedSequence: getRecommendedCrops(cropType, soilType),
          benefits: getBenefits(cropType),
          timeframe: "3-4 years rotation cycle",
        }

        setRotationData(mockRotationData)
        setLoading(false)
      }, 1000)
    }
  }, [cropType, soilType])

  if (!cropType || !soilType) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Crop Rotation Planner</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-6">
          <Sprout className="h-8 w-8 text-muted-foreground mb-2" />
          <p className="text-center text-muted-foreground">
            Please select a crop type and soil type to get rotation recommendations
          </p>
        </CardContent>
      </Card>
    )
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Crop Rotation Planner</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-4">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
          <div className="space-y-2">
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
        <CardTitle>Crop Rotation Planner</CardTitle>
      </CardHeader>
      <CardContent>
        {rotationData && (
          <div className="space-y-4">
            <div className="bg-muted/50 p-4 rounded-lg">
              <h3 className="font-medium mb-2">Recommended Rotation Sequence</h3>
              <div className="flex flex-wrap items-center gap-2">
                <Badge
                  variant="outline"
                  className="bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20"
                >
                  {cropType}
                </Badge>
                {rotationData.recommendedSequence.map((crop, index) => (
                  <div key={index} className="flex items-center">
                    <ArrowRight className="h-4 w-4 mx-1 text-muted-foreground" />
                    <Badge variant="outline">{crop}</Badge>
                  </div>
                ))}
                <ArrowRight className="h-4 w-4 mx-1 text-muted-foreground" />
                <Badge
                  variant="outline"
                  className="bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20"
                >
                  {cropType}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-2">{rotationData.timeframe}</p>
            </div>

            <div>
              <h3 className="font-medium mb-2">Benefits of This Rotation</h3>
              <ul className="space-y-2">
                {rotationData.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <Sprout className="h-4 w-4 text-green-500 mt-0.5" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-muted/30 p-4 rounded-lg mt-4">
              <h3 className="font-medium mb-2">Soil Health Impact</h3>
              <p className="text-sm">
                This rotation plan is optimized for {soilType} soil and will help maintain soil structure, prevent
                nutrient depletion, and reduce the buildup of soil-borne pathogens specific to {cropType}.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
