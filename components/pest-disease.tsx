"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertTriangle, Bug, Loader2, Shield } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

interface PestDiseaseProps {
  cropType: string
  t: (key: string, section?: string) => string
}

interface PestDiseaseData {
  pests: Array<{
    name: string
    riskLevel: "low" | "medium" | "high"
    symptoms: string
    management: string
  }>
  diseases: Array<{
    name: string
    riskLevel: "low" | "medium" | "high"
    symptoms: string
    management: string
  }>
  currentAlerts: string[]
}

export function PestDisease({ cropType, t }: PestDiseaseProps) {
  const [pestDiseaseData, setPestDiseaseData] = useState<PestDiseaseData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (cropType) {
      // In a real app, this would fetch from an API
      // For demo purposes, we'll simulate an API response
      setLoading(true)
      setTimeout(() => {
        // Generate pest and disease data based on crop type
        const getPestsAndDiseases = (crop: string) => {
          const dataMap: Record<string, PestDiseaseData> = {
            rice: {
              pests: [
                {
                  name: "Rice Stem Borer",
                  riskLevel: "high",
                  symptoms: "Dead hearts in vegetative stage, white heads in reproductive stage",
                  management: "Use resistant varieties, balanced fertilization, proper water management",
                },
                {
                  name: "Brown Planthopper",
                  riskLevel: "medium",
                  symptoms: "Yellowing and drying of leaves, honeydew secretion",
                  management: "Avoid excessive nitrogen, maintain field sanitation, use resistant varieties",
                },
              ],
              diseases: [
                {
                  name: "Rice Blast",
                  riskLevel: "high",
                  symptoms: "Diamond-shaped lesions on leaves, neck blast on panicles",
                  management: "Use resistant varieties, fungicide application, balanced fertilization",
                },
                {
                  name: "Bacterial Leaf Blight",
                  riskLevel: "medium",
                  symptoms: "Water-soaked lesions on leaf margins, yellowing and drying of leaves",
                  management: "Use resistant varieties, avoid excessive nitrogen, proper spacing",
                },
              ],
              currentAlerts: [
                "High risk of Rice Blast due to recent rainfall patterns",
                "Monitor for Brown Planthopper in the next 2 weeks",
              ],
            },
            wheat: {
              pests: [
                {
                  name: "Aphids",
                  riskLevel: "medium",
                  symptoms: "Curling of leaves, stunted growth, honeydew secretion",
                  management: "Early sowing, balanced fertilization, natural enemies conservation",
                },
                {
                  name: "Termites",
                  riskLevel: "low",
                  symptoms: "Wilting of plants, hollow stems, poor germination",
                  management: "Soil treatment, adequate irrigation, removal of crop residues",
                },
              ],
              diseases: [
                {
                  name: "Wheat Rust",
                  riskLevel: "high",
                  symptoms: "Reddish-brown pustules on leaves and stems",
                  management: "Use resistant varieties, fungicide application, early sowing",
                },
                {
                  name: "Powdery Mildew",
                  riskLevel: "medium",
                  symptoms: "White powdery growth on leaves, stems and heads",
                  management: "Use resistant varieties, fungicide application, proper spacing",
                },
              ],
              currentAlerts: [
                "Wheat Rust outbreak reported in neighboring regions",
                "Favorable conditions for Powdery Mildew development",
              ],
            },
            maize: {
              pests: [
                {
                  name: "Fall Armyworm",
                  riskLevel: "high",
                  symptoms: "Ragged feeding damage on leaves, frass in whorls",
                  management: "Early detection, biological control, targeted insecticide application",
                },
                {
                  name: "Corn Earworm",
                  riskLevel: "medium",
                  symptoms: "Feeding damage on ear tips, presence of larvae in ears",
                  management: "Timely planting, biological control, resistant varieties",
                },
              ],
              diseases: [
                {
                  name: "Northern Corn Leaf Blight",
                  riskLevel: "medium",
                  symptoms: "Long, elliptical gray-green lesions on leaves",
                  management: "Crop rotation, resistant varieties, fungicide application",
                },
                {
                  name: "Common Rust",
                  riskLevel: "low",
                  symptoms: "Small, circular to elongate, reddish-brown pustules on leaves",
                  management: "Resistant varieties, fungicide application, early planting",
                },
              ],
              currentAlerts: [
                "Fall Armyworm migration expected in the next 10 days",
                "Monitor for early signs of Northern Corn Leaf Blight",
              ],
            },
          }

          // Default data if specific crop not found
          return (
            dataMap[crop as keyof typeof dataMap] || {
              pests: [
                {
                  name: "Generic Pest 1",
                  riskLevel: "medium",
                  symptoms: "Leaf damage, stunted growth",
                  management: "Integrated pest management, crop rotation",
                },
                {
                  name: "Generic Pest 2",
                  riskLevel: "low",
                  symptoms: "Feeding damage on plant parts",
                  management: "Biological control, proper field sanitation",
                },
              ],
              diseases: [
                {
                  name: "Generic Disease 1",
                  riskLevel: "medium",
                  symptoms: "Leaf spots, wilting",
                  management: "Resistant varieties, fungicide application",
                },
                {
                  name: "Generic Disease 2",
                  riskLevel: "low",
                  symptoms: "Discoloration, stunted growth",
                  management: "Crop rotation, proper spacing, balanced fertilization",
                },
              ],
              currentAlerts: ["Monitor for common pests and diseases in your region"],
            }
          )
        }

        const mockPestDiseaseData = getPestsAndDiseases(cropType)
        setPestDiseaseData(mockPestDiseaseData)
        setLoading(false)
      }, 1000)
    }
  }, [cropType])

  const getRiskBadge = (riskLevel: string) => {
    switch (riskLevel) {
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

  const getRiskProgress = (riskLevel: string) => {
    switch (riskLevel) {
      case "high":
        return 90
      case "medium":
        return 50
      case "low":
        return 20
      default:
        return 0
    }
  }

  if (!cropType) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Pest & Disease Monitor</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-6">
          <Bug className="h-8 w-8 text-muted-foreground mb-2" />
          <p className="text-center text-muted-foreground">
            Please select a crop type to get pest and disease information
          </p>
        </CardContent>
      </Card>
    )
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Pest & Disease Monitor</CardTitle>
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
        <CardTitle>Pest & Disease Monitor</CardTitle>
      </CardHeader>
      <CardContent>
        {pestDiseaseData && (
          <div className="space-y-4">
            {pestDiseaseData.currentAlerts.length > 0 && (
              <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-500" />
                  <h3 className="font-medium">Current Alerts</h3>
                </div>
                <ul className="space-y-1">
                  {pestDiseaseData.currentAlerts.map((alert, index) => (
                    <li key={index} className="text-sm">
                      {alert}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div>
              <h3 className="font-medium mb-3 flex items-center gap-2">
                <Bug className="h-5 w-5 text-red-500" />
                Common Pests
              </h3>
              <div className="space-y-4">
                {pestDiseaseData.pests.map((pest, index) => (
                  <div key={index} className="border rounded-lg p-3">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium">{pest.name}</h4>
                      {getRiskBadge(pest.riskLevel)}
                    </div>
                    <Progress value={getRiskProgress(pest.riskLevel)} className="h-1 mb-3" />
                    <div className="grid gap-2 text-sm">
                      <div>
                        <span className="font-medium">Symptoms: </span>
                        {pest.symptoms}
                      </div>
                      <div>
                        <span className="font-medium">Management: </span>
                        {pest.management}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <h3 className="font-medium mb-3 flex items-center gap-2">
                <Shield className="h-5 w-5 text-blue-500" />
                Common Diseases
              </h3>
              <div className="space-y-4">
                {pestDiseaseData.diseases.map((disease, index) => (
                  <div key={index} className="border rounded-lg p-3">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium">{disease.name}</h4>
                      {getRiskBadge(disease.riskLevel)}
                    </div>
                    <Progress value={getRiskProgress(disease.riskLevel)} className="h-1 mb-3" />
                    <div className="grid gap-2 text-sm">
                      <div>
                        <span className="font-medium">Symptoms: </span>
                        {disease.symptoms}
                      </div>
                      <div>
                        <span className="font-medium">Management: </span>
                        {disease.management}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
