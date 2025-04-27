"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/components/ui/use-toast"
import { Wifi, WifiOff, Download, Trash2, Database, RefreshCw, Check, AlertTriangle, Loader2 } from "lucide-react"

interface OfflineModeProps {
  cropType: string
}

export function OfflineMode({ cropType }: OfflineModeProps) {
  const { toast } = useToast()
  const [isOnline, setIsOnline] = useState(true)
  const [offlineData, setOfflineData] = useState<{
    crops: string[]
    lastSynced: Date | null
    storageUsed: number
    storageLimit: number
  }>({
    crops: [],
    lastSynced: null,
    storageUsed: 0,
    storageLimit: 50, // MB
  })
  const [isSyncing, setIsSyncing] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)

  useEffect(() => {
    // Check online status
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    setIsOnline(navigator.onLine)

    // Load offline data from localStorage
    const loadOfflineData = () => {
      try {
        const savedData = localStorage.getItem("krishimitra_offline_data")
        if (savedData) {
          const parsedData = JSON.parse(savedData)
          setOfflineData({
            ...parsedData,
            lastSynced: parsedData.lastSynced ? new Date(parsedData.lastSynced) : null,
          })
        }
      } catch (error) {
        console.error("Error loading offline data:", error)
      }
    }

    loadOfflineData()

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  const downloadCropData = () => {
    if (!cropType) {
      toast({
        title: "No crop selected",
        description: "Please select a crop type to download data.",
        variant: "destructive",
      })
      return
    }

    setIsDownloading(true)

    // Simulate downloading data
    setTimeout(() => {
      // Check if crop is already downloaded
      if (offlineData.crops.includes(cropType)) {
        toast({
          title: "Data already downloaded",
          description: `Offline data for ${cropType} is already available.`,
          variant: "default",
        })
        setIsDownloading(false)
        return
      }

      // Update offline data
      const newOfflineData = {
        ...offlineData,
        crops: [...offlineData.crops, cropType],
        lastSynced: new Date(),
        storageUsed: offlineData.storageUsed + Math.random() * 5 + 2, // Random size between 2-7 MB
      }

      setOfflineData(newOfflineData)

      // Save to localStorage
      localStorage.setItem("krishimitra_offline_data", JSON.stringify(newOfflineData))

      toast({
        title: "Download complete",
        description: `Offline data for ${cropType} is now available.`,
        variant: "default",
      })

      setIsDownloading(false)
    }, 2000)
  }

  const syncData = () => {
    if (!isOnline) {
      toast({
        title: "Offline mode",
        description: "Cannot sync data while offline. Please connect to the internet and try again.",
        variant: "destructive",
      })
      return
    }

    setIsSyncing(true)

    // Simulate syncing data
    setTimeout(() => {
      const newOfflineData = {
        ...offlineData,
        lastSynced: new Date(),
      }

      setOfflineData(newOfflineData)

      // Save to localStorage
      localStorage.setItem("krishimitra_offline_data", JSON.stringify(newOfflineData))

      toast({
        title: "Sync complete",
        description: "Your data has been successfully synchronized.",
        variant: "default",
      })

      setIsSyncing(false)
    }, 2000)
  }

  const clearOfflineData = () => {
    // Confirm before clearing
    if (confirm("Are you sure you want to clear all offline data? This cannot be undone.")) {
      setOfflineData({
        crops: [],
        lastSynced: null,
        storageUsed: 0,
        storageLimit: 50,
      })

      // Clear from localStorage
      localStorage.removeItem("krishimitra_offline_data")

      toast({
        title: "Offline data cleared",
        description: "All offline data has been removed from your device.",
        variant: "default",
      })
    }
  }

  const formatStorageSize = (sizeInMB: number) => {
    if (sizeInMB < 1) {
      return `${Math.round(sizeInMB * 1024)} KB`
    }
    return `${sizeInMB.toFixed(1)} MB`
  }

  const getTimeAgo = (date: Date) => {
    if (!date) return "Never"

    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000)

    let interval = seconds / 31536000
    if (interval > 1) return `${Math.floor(interval)} years ago`

    interval = seconds / 2592000
    if (interval > 1) return `${Math.floor(interval)} months ago`

    interval = seconds / 86400
    if (interval > 1) return `${Math.floor(interval)} days ago`

    interval = seconds / 3600
    if (interval > 1) return `${Math.floor(interval)} hours ago`

    interval = seconds / 60
    if (interval > 1) return `${Math.floor(interval)} minutes ago`

    return `${Math.floor(seconds)} seconds ago`
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between">
          <span>Offline Mode</span>
          <Badge
            variant="outline"
            className={
              isOnline
                ? "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20"
                : "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20"
            }
          >
            {isOnline ? (
              <div className="flex items-center gap-1">
                <Wifi className="h-3 w-3" />
                <span>Online</span>
              </div>
            ) : (
              <div className="flex items-center gap-1">
                <WifiOff className="h-3 w-3" />
                <span>Offline</span>
              </div>
            )}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">Storage Usage</h3>
              <span className="text-xs text-muted-foreground">
                {formatStorageSize(offlineData.storageUsed)} / {formatStorageSize(offlineData.storageLimit)}
              </span>
            </div>
            <Progress
              value={(offlineData.storageUsed / offlineData.storageLimit) * 100}
              className="h-2"
              indicatorClassName={
                offlineData.storageUsed > offlineData.storageLimit * 0.8
                  ? "bg-red-500"
                  : offlineData.storageUsed > offlineData.storageLimit * 0.5
                    ? "bg-yellow-500"
                    : undefined
              }
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-4">
                <Database className="h-5 w-5 text-blue-500" />
                <h3 className="font-medium">Offline Data</h3>
              </div>

              {offlineData.crops.length > 0 ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Available crops:</span>
                    <span>{offlineData.crops.length}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {offlineData.crops.map((crop) => (
                      <Badge
                        key={crop}
                        variant="outline"
                        className="bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20"
                      >
                        {crop}
                      </Badge>
                    ))}
                  </div>
                  <div className="text-xs text-muted-foreground mt-2">
                    Last synced: {offlineData.lastSynced ? getTimeAgo(offlineData.lastSynced) : "Never"}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-4 text-center">
                  <AlertTriangle className="h-8 w-8 text-yellow-500 mb-2" />
                  <p className="text-sm text-muted-foreground">
                    No offline data available. Download crop data to use the app offline.
                  </p>
                </div>
              )}
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-4">
                <Download className="h-5 w-5 text-green-500" />
                <h3 className="font-medium">Download Options</h3>
              </div>

              <div className="space-y-3">
                <Button
                  className="w-full"
                  onClick={downloadCropData}
                  disabled={isDownloading || !cropType || offlineData.crops.includes(cropType)}
                >
                  {isDownloading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Downloading...
                    </>
                  ) : offlineData.crops.includes(cropType) ? (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      {cropType} Available Offline
                    </>
                  ) : (
                    <>
                      <Download className="mr-2 h-4 w-4" />
                      Download {cropType || "Crop"} Data
                    </>
                  )}
                </Button>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={syncData}
                  disabled={isSyncing || !isOnline || offlineData.crops.length === 0}
                >
                  {isSyncing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Syncing...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Sync Data
                    </>
                  )}
                </Button>

                <Button
                  variant="destructive"
                  className="w-full"
                  onClick={clearOfflineData}
                  disabled={offlineData.crops.length === 0}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Clear Offline Data
                </Button>
              </div>
            </div>
          </div>

          <div className="p-4 border rounded-lg">
            <h3 className="font-medium mb-3">Offline Features</h3>
            <ul className="space-y-2">
              <li className="flex items-start gap-2 text-sm">
                <Check className="h-4 w-4 text-green-500 mt-0.5" />
                <span>View crop information and recommendations</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <Check className="h-4 w-4 text-green-500 mt-0.5" />
                <span>Access saved crop calendars and schedules</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <Check className="h-4 w-4 text-green-500 mt-0.5" />
                <span>Use disease identification with previously downloaded data</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <Check className="h-4 w-4 text-green-500 mt-0.5" />
                <span>Calculate costs and profits with offline calculators</span>
              </li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
