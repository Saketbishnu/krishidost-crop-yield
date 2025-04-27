"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Loader2, CalendarIcon, ArrowRight, Sprout, CloudRain, Sun, Tractor, Scissors, AlertTriangle } from 'lucide-react'
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

interface FarmingCalendarProps {
  cropType: string
  soilType: string
  t: (key: string, section?: string) => string
}

interface CalendarEvent {
  id: string
  title: string
  date: Date
  type: "planting" | "irrigation" | "fertilization" | "pestControl" | "harvesting" | "other"
  description: string
  priority: "high" | "medium" | "low"
}

interface CropTimeline {
  crop: string
  stages: Array<{
    name: string
    duration: string
    activities: string[]
    startDay: number
    endDay: number
  }>
  totalDuration: number
}

export function FarmingCalendar({ cropType, soilType, t }: FarmingCalendarProps) {
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [timeline, setTimeline] = useState<CropTimeline | null>(null)
  const [loading, setLoading] = useState(true)
  const [date, setDate] = useState<Date>(new Date())
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)
  const [view, setView] = useState<"month" | "timeline">("month")

  useEffect(() => {
    if (cropType) {
      setLoading(true)
      // In a real app, this would fetch from an API
      setTimeout(() => {
        // Generate calendar data based on crop type
        const generateCalendarData = (crop: string) => {
          const today = new Date()
          const startDate = new Date(today)

          // Set start date to beginning of current month for demo purposes
          startDate.setDate(1)

          // Generate crop timeline
          const cropTimelines: Record<string, CropTimeline> = {
            rice: {
              crop: "Rice",
              totalDuration: 120,
              stages: [
                {
                  name: "Land Preparation",
                  duration: "15 days",
                  activities: ["Plowing", "Harrowing", "Leveling"],
                  startDay: 0,
                  endDay: 15,
                },
                {
                  name: "Sowing/Transplanting",
                  duration: "10 days",
                  activities: ["Seed soaking", "Nursery preparation", "Transplanting"],
                  startDay: 15,
                  endDay: 25,
                },
                {
                  name: "Vegetative Stage",
                  duration: "45 days",
                  activities: ["Irrigation", "Weed management", "Fertilizer application"],
                  startDay: 25,
                  endDay: 70,
                },
                {
                  name: "Reproductive Stage",
                  duration: "30 days",
                  activities: ["Irrigation", "Pest monitoring", "Disease control"],
                  startDay: 70,
                  endDay: 100,
                },
                {
                  name: "Ripening Stage",
                  duration: "20 days",
                  activities: ["Water management", "Bird control"],
                  startDay: 100,
                  endDay: 120,
                },
              ],
            },
            wheat: {
              crop: "Wheat",
              totalDuration: 140,
              stages: [
                {
                  name: "Land Preparation",
                  duration: "10 days",
                  activities: ["Plowing", "Harrowing", "Seed bed preparation"],
                  startDay: 0,
                  endDay: 10,
                },
                {
                  name: "Sowing",
                  duration: "5 days",
                  activities: ["Seed treatment", "Sowing", "Initial irrigation"],
                  startDay: 10,
                  endDay: 15,
                },
                {
                  name: "Vegetative Stage",
                  duration: "60 days",
                  activities: ["Irrigation", "Weed management", "Fertilizer application"],
                  startDay: 15,
                  endDay: 75,
                },
                {
                  name: "Reproductive Stage",
                  duration: "40 days",
                  activities: ["Irrigation", "Disease monitoring", "Pest control"],
                  startDay: 75,
                  endDay: 115,
                },
                {
                  name: "Ripening Stage",
                  duration: "25 days",
                  activities: ["Water management", "Harvest preparation"],
                  startDay: 115,
                  endDay: 140,
                },
              ],
            },
            maize: {
              crop: "Maize",
              totalDuration: 100,
              stages: [
                {
                  name: "Land Preparation",
                  duration: "10 days",
                  activities: ["Plowing", "Harrowing", "Seed bed preparation"],
                  startDay: 0,
                  endDay: 10,
                },
                {
                  name: "Sowing",
                  duration: "5 days",
                  activities: ["Seed treatment", "Sowing", "Initial irrigation"],
                  startDay: 10,
                  endDay: 15,
                },
                {
                  name: "Vegetative Stage",
                  duration: "40 days",
                  activities: ["Irrigation", "Weed management", "Fertilizer application"],
                  startDay: 15,
                  endDay: 55,
                },
                {
                  name: "Tasseling & Silking",
                  duration: "20 days",
                  activities: ["Irrigation", "Disease monitoring", "Pest control"],
                  startDay: 55,
                  endDay: 75,
                },
                {
                  name: "Grain Filling & Maturity",
                  duration: "25 days",
                  activities: ["Water management", "Harvest preparation"],
                  startDay: 75,
                  endDay: 100,
                },
              ],
            },
          }

          const defaultTimeline: CropTimeline = {
            crop: crop,
            totalDuration: 120,
            stages: [
              {
                name: "Land Preparation",
                duration: "15 days",
                activities: ["Plowing", "Harrowing", "Seed bed preparation"],
                startDay: 0,
                endDay: 15,
              },
              {
                name: "Planting",
                duration: "10 days",
                activities: ["Seed treatment", "Sowing/Planting", "Initial irrigation"],
                startDay: 15,
                endDay: 25,
              },
              {
                name: "Early Growth",
                duration: "30 days",
                activities: ["Irrigation", "Weed management", "Fertilizer application"],
                startDay: 25,
                endDay: 55,
              },
              {
                name: "Mid Season",
                duration: "40 days",
                activities: ["Irrigation", "Pest monitoring", "Disease control"],
                startDay: 55,
                endDay: 95,
              },
              {
                name: "Maturity & Harvest",
                duration: "25 days",
                activities: ["Water management", "Harvest preparation", "Harvesting"],
                startDay: 95,
                endDay: 120,
              },
            ],
          }

          const cropTimeline = cropTimelines[crop as keyof typeof cropTimelines] || defaultTimeline

          // Generate events based on timeline
          const events: CalendarEvent[] = []

          // Land preparation event
          const landPrepDate = new Date(startDate)
          events.push({
            id: "event1",
            title: "Land Preparation",
            date: landPrepDate,
            type: "other",
            description: "Begin land preparation activities including plowing and harrowing.",
            priority: "high",
          })

          // Planting event
          const plantingDate = new Date(startDate)
          plantingDate.setDate(plantingDate.getDate() + cropTimeline.stages[1].startDay)
          events.push({
            id: "event2",
            title: "Planting/Sowing",
            date: plantingDate,
            type: "planting",
            description: `Start ${crop} planting or sowing. Ensure proper seed treatment and spacing.`,
            priority: "high",
          })

          // First fertilization
          const firstFertDate = new Date(startDate)
          firstFertDate.setDate(firstFertDate.getDate() + cropTimeline.stages[2].startDay + 5)
          events.push({
            id: "event3",
            title: "First Fertilization",
            date: firstFertDate,
            type: "fertilization",
            description: "Apply first dose of fertilizer according to soil test recommendations.",
            priority: "medium",
          })

          // Irrigation events
          for (let i = 1; i <= 4; i++) {
            const irrigationDate = new Date(startDate)
            irrigationDate.setDate(irrigationDate.getDate() + i * 20)
            events.push({
              id: `irrigation${i}`,
              title: `Irrigation ${i}`,
              date: irrigationDate,
              type: "irrigation",
              description: `Scheduled irrigation based on crop water requirements.`,
              priority: i === 2 ? "high" : "medium",
            })
          }

          // Pest control
          const pestControlDate = new Date(startDate)
          pestControlDate.setDate(pestControlDate.getDate() + cropTimeline.stages[3].startDay + 10)
          events.push({
            id: "pest1",
            title: "Pest Monitoring",
            date: pestControlDate,
            type: "pestControl",
            description: "Check for pest infestation and apply control measures if needed.",
            priority: "medium",
          })

          // Second fertilization
          const secondFertDate = new Date(startDate)
          secondFertDate.setDate(secondFertDate.getDate() + cropTimeline.stages[3].startDay)
          events.push({
            id: "event6",
            title: "Second Fertilization",
            date: secondFertDate,
            type: "fertilization",
            description: "Apply second dose of fertilizer to support reproductive growth.",
            priority: "medium",
          })

          // Harvest preparation
          const harvestPrepDate = new Date(startDate)
          harvestPrepDate.setDate(harvestPrepDate.getDate() + cropTimeline.stages[4].startDay)
          events.push({
            id: "event7",
            title: "Harvest Preparation",
            date: harvestPrepDate,
            type: "other",
            description: "Prepare equipment and resources for upcoming harvest.",
            priority: "medium",
          })

          // Harvest
          const harvestDate = new Date(startDate)
          harvestDate.setDate(harvestDate.getDate() + cropTimeline.totalDuration - 5)
          events.push({
            id: "event8",
            title: "Harvest",
            date: harvestDate,
            type: "harvesting",
            description: `Harvest ${crop} at optimal maturity for best quality and yield.`,
            priority: "high",
          })

          return { events, timeline: cropTimeline }
        }

        const { events, timeline } = generateCalendarData(cropType)
        setEvents(events)
        setTimeline(timeline)
        setLoading(false)
      }, 1000)
    }
  }, [cropType])

  const getEventIcon = (type: string) => {
    switch (type) {
      case "planting":
        return <Sprout className="h-4 w-4 text-green-500" />
      case "irrigation":
        return <CloudRain className="h-4 w-4 text-blue-500" />
      case "fertilization":
        return <Tractor className="h-4 w-4 text-yellow-500" />
      case "pestControl":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      case "harvesting":
        return <Scissors className="h-4 w-4 text-orange-500" />
      default:
        return <Sun className="h-4 w-4 text-purple-500" />
    }
  }

  const getEventBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return (
          <Badge variant="outline" className="bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20">
            High Priority
          </Badge>
        )
      case "medium":
        return (
          <Badge
            variant="outline"
            className="bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20"
          >
            Medium Priority
          </Badge>
        )
      case "low":
        return (
          <Badge variant="outline" className="bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20">
            Low Priority
          </Badge>
        )
      default:
        return <Badge variant="outline">Unknown Priority</Badge>
    }
  }

  const getDayEvents = (day: Date | any) => {
    // Ensure day is a valid Date object before using Date methods
    if (!day || typeof day.getDate !== "function") {
      return []
    }

    return events.filter(
      (event) =>
        event.date.getDate() === day.getDate() &&
        event.date.getMonth() === day.getMonth() &&
        event.date.getFullYear() === day.getFullYear(),
    )
  }

  const handleDateSelect = (day: Date) => {
    setDate(day)
    const dayEvents = getDayEvents(day)
    if (dayEvents.length > 0) {
      setSelectedEvent(dayEvents[0])
    } else {
      setSelectedEvent(null)
    }
  }

  if (!cropType) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Farming Calendar</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-6">
          <CalendarIcon className="h-8 w-8 text-muted-foreground mb-2" />
          <p className="text-center text-muted-foreground">Please select a crop type to view the farming calendar</p>
        </CardContent>
      </Card>
    )
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Farming Calendar</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-4">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-[300px] w-full" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between">
          <span>Farming Calendar</span>
          <div className="flex items-center gap-2">
            <Button variant={view === "month" ? "default" : "outline"} size="sm" onClick={() => setView("month")}>
              Month
            </Button>
            <Button variant={view === "timeline" ? "default" : "outline"} size="sm" onClick={() => setView("timeline")}>
              Timeline
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {view === "month" ? (
          <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
            <div className="md:col-span-4">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(day) => day && handleDateSelect(day)}
                className="rounded-md border"
                components={{
                  Day: ({ day, ...props }: { day: Date | any }) => {
                    // Ensure day is a valid Date object before using it
                    if (!day || typeof day.getDate !== "function") {
                      // Return a td element instead of div to avoid hydration error
                      return <td {...props} />
                    }

                    const dayEvents = getDayEvents(day)
                    // Use td instead of div to match the expected HTML structure
                    return (
                      <td {...props}>
                        {format(day, "d")}
                        {dayEvents.length > 0 && (
                          <div className="flex justify-center mt-1">
                            <div
                              className={`h-1 w-1 rounded-full ${
                                dayEvents.some((e) => e.priority === "high")
                                  ? "bg-red-500"
                                  : dayEvents.some((e) => e.priority === "medium")
                                    ? "bg-yellow-500"
                                    : "bg-green-500"
                              }`}
                            />
                          </div>
                        )}
                      </td>
                    )
                  },
                }}
              />
            </div>

            <div className="md:col-span-3">
              <div className="border rounded-md p-4 h-full">
                <h3 className="font-medium mb-2">Events for {format(date, "MMMM d, yyyy")}</h3>

                {selectedEvent ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getEventIcon(selectedEvent.type)}
                        <span className="font-medium">{selectedEvent.title}</span>
                      </div>
                      {getEventBadge(selectedEvent.priority)}
                    </div>

                    <p className="text-sm text-muted-foreground">{selectedEvent.description}</p>

                    <Separator />

                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Recommendations</h4>
                      <ul className="space-y-1">
                        {selectedEvent.type === "planting" && (
                          <>
                            <li className="text-xs text-muted-foreground">
                              • Ensure proper seed treatment before planting
                            </li>
                            <li className="text-xs text-muted-foreground">
                              • Maintain recommended spacing between plants
                            </li>
                            <li className="text-xs text-muted-foreground">
                              • Apply starter fertilizer if soil test indicates deficiency
                            </li>
                          </>
                        )}
                        {selectedEvent.type === "irrigation" && (
                          <>
                            <li className="text-xs text-muted-foreground">• Check soil moisture before irrigation</li>
                            <li className="text-xs text-muted-foreground">
                              • Irrigate during early morning or evening to reduce evaporation
                            </li>
                            <li className="text-xs text-muted-foreground">• Ensure uniform water distribution</li>
                          </>
                        )}
                        {selectedEvent.type === "fertilization" && (
                          <>
                            <li className="text-xs text-muted-foreground">
                              • Apply fertilizer based on soil test recommendations
                            </li>
                            <li className="text-xs text-muted-foreground">
                              • Avoid applying fertilizer on wet foliage
                            </li>
                            <li className="text-xs text-muted-foreground">
                              • Consider split application for better nutrient uptake
                            </li>
                          </>
                        )}
                        {selectedEvent.type === "pestControl" && (
                          <>
                            <li className="text-xs text-muted-foreground">• Scout for pests regularly</li>
                            <li className="text-xs text-muted-foreground">
                              • Use integrated pest management (IPM) practices
                            </li>
                            <li className="text-xs text-muted-foreground">
                              • Follow safety guidelines when applying pesticides
                            </li>
                          </>
                        )}
                        {selectedEvent.type === "harvesting" && (
                          <>
                            <li className="text-xs text-muted-foreground">
                              • Harvest at optimal maturity for best quality
                            </li>
                            <li className="text-xs text-muted-foreground">
                              • Ensure proper drying and storage conditions
                            </li>
                            <li className="text-xs text-muted-foreground">
                              • Clean and prepare equipment before harvesting
                            </li>
                          </>
                        )}
                        {selectedEvent.type === "other" && (
                          <>
                            <li className="text-xs text-muted-foreground">
                              • Follow best practices for the specific activity
                            </li>
                            <li className="text-xs text-muted-foreground">
                              • Document all farming activities for future reference
                            </li>
                            <li className="text-xs text-muted-foreground">
                              • Monitor weather conditions before proceeding
                            </li>
                          </>
                        )}
                      </ul>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-[200px] text-center text-muted-foreground">
                    <CalendarIcon className="h-8 w-8 mb-2" />
                    <p>No events scheduled for this day</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium mb-4">{cropType} Growing Season Timeline</h3>

              {timeline && (
                <div className="relative">
                  <div className="absolute left-4 h-full w-0.5 bg-muted-foreground/20" />

                  <div className="space-y-8">
                    {timeline.stages.map((stage, index) => (
                      <div key={index} className="relative pl-10">
                        <div className="absolute left-[14px] -translate-x-1/2 h-6 w-6 rounded-full bg-background border-2 border-primary flex items-center justify-center">
                          <span className="text-xs font-bold">{index + 1}</span>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">{stage.name}</h4>
                            <Badge variant="outline">{stage.duration}</Badge>
                          </div>

                          <p className="text-sm text-muted-foreground">
                            Days {stage.startDay} - {stage.endDay} of growing season
                          </p>

                          <div className="bg-muted/50 p-3 rounded-lg">
                            <h5 className="text-sm font-medium mb-2">Key Activities</h5>
                            <ul className="space-y-1">
                              {stage.activities.map((activity, actIndex) => (
                                <li key={actIndex} className="flex items-start gap-2 text-xs">
                                  <ArrowRight className="h-3 w-3 text-primary mt-0.5" />
                                  <span>{activity}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium mb-3">Critical Periods</h3>

                <div className="space-y-3">
                  <div className="flex items-start gap-2 p-2 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-900/30 rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-medium">Flowering/Reproductive Stage</h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        Ensure adequate water and nutrients during this critical period. Stress at this stage can
                        significantly reduce yield.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 p-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-900/30 rounded-lg">
                    <CloudRain className="h-5 w-5 text-blue-500 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-medium">Early Growth Stage</h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        Maintain proper soil moisture for good establishment. Weed control is critical during this
                        period.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 p-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900/30 rounded-lg">
                    <Scissors className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-medium">Harvest Timing</h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        Harvest at optimal maturity for best quality and yield. Monitor crop closely as it approaches
                        maturity.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 border rounded-lg">
                <h3 className="font-medium mb-3">Upcoming Events</h3>

                <div className="space-y-3">
                  {events.slice(0, 5).map((event, index) => (
                    <div key={index} className="flex items-start gap-2 p-2 bg-muted/50 rounded-lg">
                      {getEventIcon(event.type)}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-medium truncate">{event.title}</h4>
                          <span className="text-xs text-muted-foreground">{format(event.date, "MMM d")}</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 truncate">{event.description}</p>
                      </div>
                    </div>
                  ))}

                  <Button variant="outline" size="sm" className="w-full">
                    View All Events
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
