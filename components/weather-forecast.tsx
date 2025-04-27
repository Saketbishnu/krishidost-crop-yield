"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Cloud, CloudRain, Droplets, MapPin, Sun, Thermometer, Wind } from "lucide-react"
import { LocationSearch } from "@/components/location-search"

interface WeatherForecastProps {
  location: {
    lat: number | null
    lng: number | null
    address: string
  }
  t: (key: string, section?: string) => string
}

interface WeatherData {
  temperature: number
  humidity: number
  windSpeed: number
  condition: string
  forecast: Array<{
    day: string
    temperature: number
    condition: string
  }>
}

export function WeatherForecast({ location, t }: WeatherForecastProps) {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentLocation, setCurrentLocation] = useState(location)

  useEffect(() => {
    setCurrentLocation(location)
  }, [location])

  useEffect(() => {
    // Always fetch weather data, even with default location
    if (currentLocation.lat && currentLocation.lng) {
      // In a real app, this would fetch from a weather API
      // For demo purposes, we'll simulate a weather API response
      setLoading(true)
      setTimeout(() => {
        const mockWeatherData: WeatherData = {
          temperature: Math.floor(Math.random() * 15) + 20, // 20-35°C
          humidity: Math.floor(Math.random() * 30) + 50, // 50-80%
          windSpeed: Math.floor(Math.random() * 20) + 5, // 5-25 km/h
          condition: ["Sunny", "Cloudy", "Rainy", "Partly Cloudy"][Math.floor(Math.random() * 4)],
          forecast: [
            {
              day: "Today",
              temperature: Math.floor(Math.random() * 15) + 20,
              condition: ["Sunny", "Cloudy", "Rainy", "Partly Cloudy"][Math.floor(Math.random() * 4)],
            },
            {
              day: "Tomorrow",
              temperature: Math.floor(Math.random() * 15) + 20,
              condition: ["Sunny", "Cloudy", "Rainy", "Partly Cloudy"][Math.floor(Math.random() * 4)],
            },
            {
              day: "Day 3",
              temperature: Math.floor(Math.random() * 15) + 20,
              condition: ["Sunny", "Cloudy", "Rainy", "Partly Cloudy"][Math.floor(Math.random() * 4)],
            },
          ],
        }
        setWeather(mockWeatherData)
        setLoading(false)
      }, 1000)
    }
  }, [currentLocation.lat, currentLocation.lng])

  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case "sunny":
        return <Sun className="h-6 w-6 text-yellow-500" />
      case "cloudy":
        return <Cloud className="h-6 w-6 text-gray-500" />
      case "rainy":
        return <CloudRain className="h-6 w-6 text-blue-500" />
      case "partly cloudy":
        return (
          <div className="relative">
            <Sun className="h-6 w-6 text-yellow-500" />
            <Cloud className="h-4 w-4 text-gray-500 absolute -bottom-1 -right-1" />
          </div>
        )
      default:
        return <Sun className="h-6 w-6 text-yellow-500" />
    }
  }

  const handleLocationSelect = (newLocation: { lat: number; lng: number; address: string }) => {
    setCurrentLocation(newLocation)
  }

  if (!currentLocation.lat || !currentLocation.lng) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t("weatherForecast")}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-6">
          <MapPin className="h-8 w-8 text-muted-foreground mb-2" />
          <p className="text-center text-muted-foreground">{t("locationNotAvailable")}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex justify-between items-center">
          <span>{t("weatherForecast")}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <LocationSearch onLocationSelect={handleLocationSelect} currentLocation={currentLocation} />
        </div>

        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-20 w-full" />
            <div className="grid grid-cols-3 gap-2">
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
          </div>
        ) : (
          weather && (
            <>
              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50 mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-background">{getWeatherIcon(weather.condition)}</div>
                  <div>
                    <p className="text-sm font-medium">{weather.condition}</p>
                    <p className="text-2xl font-bold">{weather.temperature}°C</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                  <div className="flex items-center gap-1">
                    <Droplets className="h-4 w-4 text-blue-500" />
                    <span>{weather.humidity}%</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Wind className="h-4 w-4 text-blue-300" />
                    <span>{weather.windSpeed} km/h</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Thermometer className="h-4 w-4 text-red-500" />
                    <span>Feels like {weather.temperature - 2}°C</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {weather.forecast.map((day, index) => (
                  <div key={index} className="flex flex-col items-center p-3 rounded-lg bg-muted/50">
                    <span className="text-sm font-medium">{day.day}</span>
                    <div className="my-2">{getWeatherIcon(day.condition)}</div>
                    <span className="text-sm">{day.temperature}°C</span>
                  </div>
                ))}
              </div>
            </>
          )
        )}
      </CardContent>
    </Card>
  )
}
