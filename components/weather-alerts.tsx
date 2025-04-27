"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Bell, CloudRain, Thermometer, Wind, AlertTriangle } from "lucide-react"

type WeatherAlert = {
  id: string
  type: "rain" | "temperature" | "wind" | "other"
  severity: "low" | "medium" | "high"
  title: string
  description: string
  date: Date
}

type WeatherAlertsProps = {
  location: {
    lat: number | null
    lng: number | null
    address: string
  }
}

export function WeatherAlerts({ location }: WeatherAlertsProps) {
  const [alerts, setAlerts] = useState<WeatherAlert[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate fetching weather alerts
    const fetchAlerts = async () => {
      setLoading(true)

      // In a real app, you would fetch from a weather API using location
      // For demo purposes, we'll generate some sample alerts
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const sampleAlerts: WeatherAlert[] = [
        {
          id: "1",
          type: "rain",
          severity: "medium",
          title: "Heavy Rainfall Expected",
          description:
            "Heavy rainfall expected in your area over the next 48 hours. Consider delaying any planned spraying or fertilizer application.",
          date: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
        },
        {
          id: "2",
          type: "temperature",
          severity: "high",
          title: "Heat Wave Alert",
          description:
            "Temperatures expected to rise above 40°C for the next 3 days. Ensure crops have adequate irrigation.",
          date: new Date(Date.now() + 12 * 60 * 60 * 1000), // 12 hours from now
        },
        {
          id: "3",
          type: "wind",
          severity: "low",
          title: "Moderate Winds",
          description: "Moderate winds expected. Secure any temporary structures or coverings in your farm.",
          date: new Date(Date.now() + 36 * 60 * 60 * 1000), // 36 hours from now
        },
      ]

      setAlerts(sampleAlerts)
      setLoading(false)
    }

    if (location.lat && location.lng) {
      fetchAlerts()
    } else {
      // If no location is available, use default alerts
      setAlerts([
        {
          id: "default",
          type: "other",
          severity: "medium",
          title: "Location Not Available",
          description: "Weather alerts are based on your location. Enable location services for personalized alerts.",
          date: new Date(),
        },
      ])
      setLoading(false)
    }
  }, [location])

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "rain":
        return <CloudRain className="h-5 w-5" />
      case "temperature":
        return <Thermometer className="h-5 w-5" />
      case "wind":
        return <Wind className="h-5 w-5" />
      default:
        return <AlertTriangle className="h-5 w-5" />
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "low":
        return "bg-yellow-500"
      case "medium":
        return "bg-orange-500"
      case "high":
        return "bg-red-500"
      default:
        return "bg-blue-500"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Weather Alerts
        </CardTitle>
        <CardDescription>
          {location.address !== "Location not available"
            ? `Weather alerts for ${location.address}`
            : "Enable location for personalized alerts"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center h-40">
            <p className="text-sm text-muted-foreground">Loading weather alerts...</p>
          </div>
        ) : alerts.length > 0 ? (
          <div className="space-y-4">
            {alerts.map((alert) => (
              <Alert key={alert.id} variant="default">
                <div className="flex items-start gap-3">
                  {getAlertIcon(alert.type)}
                  <div className="flex-1">
                    <AlertTitle className="flex items-center gap-2">
                      {alert.title}
                      <Badge className={`${getSeverityColor(alert.severity)} text-white`}>
                        {alert.severity.charAt(0).toUpperCase() + alert.severity.slice(1)}
                      </Badge>
                    </AlertTitle>
                    <AlertDescription className="mt-1">{alert.description}</AlertDescription>
                  </div>
                </div>
              </Alert>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-40">
            <p className="text-sm text-muted-foreground">No weather alerts at this time</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
