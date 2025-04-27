"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useLanguage } from "@/components/language-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { useToast } from "@/components/ui/use-toast"
import { YieldResults } from "@/components/yield-results"
import { WeatherForecast } from "@/components/weather-forecast"
import { MarketPrices } from "@/components/market-prices"
import { CropRotation } from "@/components/crop-rotation"
import { PestDisease } from "@/components/pest-disease"
import { Loader2, RefreshCw } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { SoilHealthDashboard } from "@/components/soil-health-dashboard"
import { WaterManagementCalculator } from "@/components/water-management-calculator"
import { CropDiseaseDetector } from "@/components/crop-disease-detector"
import { WeatherAlerts } from "@/components/weather-alerts"
import { OfflineMode } from "@/components/offline-mode"
import { FarmingCalendar } from "@/components/farming-calendar"
import { CostCalculator } from "@/components/cost-calculator"
import { VoiceInput } from "@/components/voice-input"

// Define crop types with expanded list
const cropTypes = [
  { value: "rice", label: "Rice (Paddy)" },
  { value: "wheat", label: "Wheat" },
  { value: "maize", label: "Maize (Corn)" },
  { value: "sugarcane", label: "Sugarcane" },
  { value: "cotton", label: "Cotton" },
  { value: "jute", label: "Jute" },
  { value: "pulses", label: "Pulses" },
  { value: "groundnut", label: "Groundnut" },
  { value: "soybean", label: "Soybean" },
  { value: "mustard", label: "Mustard" },
  { value: "sunflower", label: "Sunflower" },
  { value: "potato", label: "Potato" },
  { value: "onion", label: "Onion" },
  { value: "tomato", label: "Tomato" },
  { value: "chilli", label: "Chilli" },
  { value: "turmeric", label: "Turmeric" },
  { value: "ginger", label: "Ginger" },
  { value: "banana", label: "Banana" },
  { value: "mango", label: "Mango" },
  { value: "coconut", label: "Coconut" },
]

// Define soil types
const soilTypes = [
  { value: "alluvial", label: "Alluvial Soil" },
  { value: "black", label: "Black Soil" },
  { value: "red", label: "Red Soil" },
  { value: "laterite", label: "Laterite Soil" },
  { value: "arid", label: "Arid Soil" },
  { value: "forest", label: "Forest Soil" },
  { value: "saline", label: "Saline Soil" },
  { value: "peaty", label: "Peaty Soil" },
  { value: "sandy", label: "Sandy Soil" },
  { value: "clayey", label: "Clayey Soil" },
]

// Initial form state
const initialFormState = {
  cropType: "",
  landArea: 1,
  landAreaUnit: "hectares",
  fertilizer: 100,
  rainfall: 50,
  soilType: "",
  temperature: 25,
  humidity: 60,
  sunlight: 6,
  historicalYield: 0,
}

// Default location (New Delhi, India)
const DEFAULT_LOCATION = {
  lat: 28.6139,
  lng: 77.209,
  address: "New Delhi, India",
}

export function CropAdvisor() {
  const { t } = useLanguage()
  const { toast } = useToast()
  const [formData, setFormData] = useState(initialFormState)
  const [results, setResults] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [location, setLocation] = useState<{
    lat: number | null
    lng: number | null
    address: string
  }>(DEFAULT_LOCATION)

  // Get location on component mount using IP-based geolocation only
  useEffect(() => {
    const getLocationByIP = async () => {
      try {
        // Use a free IP geolocation API that doesn't require API keys
        const response = await fetch("https://ipapi.co/json/")

        if (!response.ok) {
          throw new Error(`IP geolocation API returned ${response.status}`)
        }

        const data = await response.json()

        if (data.latitude && data.longitude) {
          setLocation({
            lat: data.latitude,
            lng: data.longitude,
            address: `${data.city || ""}, ${data.region || ""}, ${data.country_name || ""}`
              .replace(/, ,/g, ",")
              .replace(/^,|,$/g, ""),
          })
          return true
        }
        return false
      } catch (error) {
        console.error("Error fetching IP location:", error)
        return false
      }
    }

    // Try to get location by IP, silently fall back to default if it fails
    getLocationByIP().catch(() => {
      // Keep using default location
      console.log("Using default location")
    })
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSliderChange = (name: string, value: number[]) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value[0],
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Simulate AI prediction (in a real app, this would call an API)
    setTimeout(() => {
      // Simple mock prediction logic
      const baseYield =
        {
          rice: 4.5,
          wheat: 3.2,
          maize: 5.8,
          sugarcane: 70,
          cotton: 1.8,
          jute: 2.5,
          pulses: 1.2,
          groundnut: 1.5,
          soybean: 2.0,
          mustard: 1.1,
          sunflower: 1.3,
          potato: 20,
          onion: 25,
          tomato: 30,
          chilli: 2.5,
          turmeric: 5.5,
          ginger: 4.0,
          banana: 35,
          mango: 10,
          coconut: 15,
        }[formData.cropType as keyof typeof baseYield] || 3.0

      // Factors affecting yield
      const fertilizerFactor = formData.fertilizer / 100
      const rainfallFactor = formData.rainfall / 50
      const temperatureFactor = 1 - Math.abs(formData.temperature - 25) / 25
      const humidityFactor = formData.humidity / 60
      const sunlightFactor = formData.sunlight / 6

      // Calculate estimated yield
      let estimatedYield =
        baseYield * fertilizerFactor * rainfallFactor * temperatureFactor * humidityFactor * sunlightFactor

      // Convert to tons per hectare
      estimatedYield = Number.parseFloat(estimatedYield.toFixed(2))

      // Determine yield category
      let yieldCategory = "medium"
      if (estimatedYield < baseYield * 0.7) {
        yieldCategory = "low"
      } else if (estimatedYield > baseYield * 1.3) {
        yieldCategory = "high"
      }

      // Generate improvement suggestions
      const suggestions = []
      if (fertilizerFactor < 0.8) {
        suggestions.push("Increase fertilizer application by 20-30% for better nutrient availability.")
      }
      if (rainfallFactor < 0.8) {
        suggestions.push("Implement irrigation to compensate for low rainfall conditions.")
      }
      if (temperatureFactor < 0.8) {
        suggestions.push("Consider adjusting planting time to avoid extreme temperatures.")
      }
      if (humidityFactor < 0.8) {
        suggestions.push("Use mulching to retain soil moisture and improve humidity levels.")
      }
      if (sunlightFactor < 0.8) {
        suggestions.push("Ensure proper spacing between plants to maximize sunlight exposure.")
      }

      // Set results
      setResults({
        estimatedYield,
        yieldCategory,
        suggestions: suggestions.length > 0 ? suggestions : ["Your farming practices are already optimized!"],
        cropType: formData.cropType,
        landArea: formData.landArea,
        landAreaUnit: formData.landAreaUnit,
      })

      setLoading(false)
    }, 1500)
  }

  const handleReset = () => {
    setFormData(initialFormState)
    setResults(null)
  }

  return (
    <div className="grid gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">
          <span className="bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent">
            Krishimitra
          </span>
        </h1>
        <p className="text-muted-foreground">
          {t("yieldPrediction")} & {t("suggestions")} {t("system")}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>
              {t("cropType")} & {t("landArea")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="cropType">{t("cropType")}</Label>
                  <Select
                    value={formData.cropType}
                    onValueChange={(value) => handleSelectChange("cropType", value)}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t("selectCrop")} />
                    </SelectTrigger>
                    <SelectContent>
                      {cropTypes.map((crop) => (
                        <SelectItem key={crop.value} value={crop.value}>
                          {crop.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="landArea">{t("landArea")}</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="landArea"
                      name="landArea"
                      type="number"
                      min="0.1"
                      step="0.1"
                      value={formData.landArea}
                      onChange={handleInputChange}
                      required
                      className="flex-1"
                    />
                    <Select
                      value={formData.landAreaUnit}
                      onValueChange={(value) => handleSelectChange("landAreaUnit", value)}
                    >
                      <SelectTrigger className="w-[120px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hectares">{t("hectares")}</SelectItem>
                        <SelectItem value="acres">{t("acres")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="soilType">{t("soilType")}</Label>
                  <Select
                    value={formData.soilType}
                    onValueChange={(value) => handleSelectChange("soilType", value)}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t("selectSoil")} />
                    </SelectTrigger>
                    <SelectContent>
                      {soilTypes.map((soil) => (
                        <SelectItem key={soil.value} value={soil.value}>
                          {soil.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fertilizer">
                    {t("fertilizer")} ({t("kgPerHectare")})
                  </Label>
                  <div className="flex items-center gap-4">
                    <Slider
                      id="fertilizer"
                      min={0}
                      max={300}
                      step={10}
                      value={[formData.fertilizer]}
                      onValueChange={(value) => handleSliderChange("fertilizer", value)}
                      className="flex-1"
                    />
                    <span className="w-12 text-right">{formData.fertilizer}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="rainfall">
                    {t("rainfall")} ({t("mm")})
                  </Label>
                  <div className="flex items-center gap-4">
                    <Slider
                      id="rainfall"
                      min={0}
                      max={200}
                      step={5}
                      value={[formData.rainfall]}
                      onValueChange={(value) => handleSliderChange("rainfall", value)}
                      className="flex-1"
                    />
                    <span className="w-12 text-right">{formData.rainfall}</span>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h3 className="mb-4 font-medium">{t("weather")}</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="temperature">
                        {t("temperature")} ({t("celsius")})
                      </Label>
                      <div className="flex items-center gap-4">
                        <Slider
                          id="temperature"
                          min={0}
                          max={50}
                          step={1}
                          value={[formData.temperature]}
                          onValueChange={(value) => handleSliderChange("temperature", value)}
                          className="flex-1"
                        />
                        <span className="w-12 text-right">{formData.temperature}°C</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="humidity">
                        {t("humidity")} ({t("percent")})
                      </Label>
                      <div className="flex items-center gap-4">
                        <Slider
                          id="humidity"
                          min={0}
                          max={100}
                          step={5}
                          value={[formData.humidity]}
                          onValueChange={(value) => handleSliderChange("humidity", value)}
                          className="flex-1"
                        />
                        <span className="w-12 text-right">{formData.humidity}%</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="sunlight">
                        {t("sunlight")} ({t("hours")})
                      </Label>
                      <div className="flex items-center gap-4">
                        <Slider
                          id="sunlight"
                          min={0}
                          max={12}
                          step={0.5}
                          value={[formData.sunlight]}
                          onValueChange={(value) => handleSliderChange("sunlight", value)}
                          className="flex-1"
                        />
                        <span className="w-12 text-right">{formData.sunlight}h</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="historicalYield">
                      {t("historicalYield")} ({t("tons")})
                    </Label>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="historicalYieldToggle"
                        checked={formData.historicalYield > 0}
                        onCheckedChange={(checked) => {
                          setFormData((prev) => ({
                            ...prev,
                            historicalYield: checked ? 2 : 0,
                          }))
                        }}
                      />
                      <Label htmlFor="historicalYieldToggle">{formData.historicalYield > 0 ? "On" : "Off"}</Label>
                    </div>
                  </div>
                  {formData.historicalYield > 0 && (
                    <Input
                      id="historicalYield"
                      name="historicalYield"
                      type="number"
                      min="0.1"
                      step="0.1"
                      value={formData.historicalYield}
                      onChange={handleInputChange}
                      className="flex-1"
                    />
                  )}
                </div>
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={loading} className="flex-1">
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t("loading")}
                    </>
                  ) : (
                    t("predict")
                  )}
                </Button>
                <Button type="button" variant="outline" onClick={handleReset} disabled={loading}>
                  <RefreshCw className="h-4 w-4" />
                  <span className="sr-only">{t("reset")}</span>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="grid gap-6">
          {results ? (
            <YieldResults results={results} t={t} />
          ) : (
            <Card className="h-[300px] flex items-center justify-center">
              <CardContent className="text-center text-muted-foreground">
                <p>
                  {t("yieldPrediction")} {t("loading")}...
                </p>
                <p className="text-sm mt-2">{t("fillForm")}</p>
              </CardContent>
            </Card>
          )}

          <Tabs defaultValue="weather" className="w-full">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="weather">{t("weatherForecast")}</TabsTrigger>
              <TabsTrigger value="market">{t("marketPrices")}</TabsTrigger>
              <TabsTrigger value="rotation">Crop Rotation</TabsTrigger>
              <TabsTrigger value="pests">Pests & Diseases</TabsTrigger>
              <TabsTrigger value="soil">Soil Health</TabsTrigger>
              <TabsTrigger value="water">Water Mgmt</TabsTrigger>
            </TabsList>
            <TabsContent value="weather">
              <WeatherForecast location={location} t={t} />
            </TabsContent>
            <TabsContent value="market">
              <MarketPrices cropType={formData.cropType} t={t} />
            </TabsContent>
            <TabsContent value="rotation">
              <CropRotation cropType={formData.cropType} soilType={formData.soilType} t={t} />
            </TabsContent>
            <TabsContent value="pests">
              <PestDisease cropType={formData.cropType} t={t} />
            </TabsContent>
            <TabsContent value="soil">
              <SoilHealthDashboard cropType={formData.cropType} soilType={formData.soilType} t={t} />
            </TabsContent>
            <TabsContent value="water">
              <WaterManagementCalculator
                cropType={formData.cropType}
                soilType={formData.soilType}
                landArea={formData.landArea}
                landAreaUnit={formData.landAreaUnit}
                rainfall={formData.rainfall}
                t={t}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <CropDiseaseDetector />
        <WeatherAlerts location={location} />
        <OfflineMode cropType={formData.cropType} />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <FarmingCalendar cropType={formData.cropType} soilType={formData.soilType} t={t} />
        <CostCalculator
          cropType={formData.cropType}
          landArea={formData.landArea}
          landAreaUnit={formData.landAreaUnit}
          estimatedYield={results?.estimatedYield}
          t={t}
        />
      </div>

      <div className="p-4 border rounded-lg">
        <h3 className="font-medium mb-4">Voice Assistant</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Use voice commands to navigate the app or ask questions about farming
        </p>
        <VoiceInput
          onTranscript={(text) => {
            toast({
              title: "Voice command received",
              description: text,
              variant: "default",
            })
          }}
          placeholder="Press the microphone and say something like 'Show me weather forecast' or 'What is the best time to plant rice?'"
        />
      </div>
    </div>
  )
}
