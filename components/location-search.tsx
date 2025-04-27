"use client"

import { useState, useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Search, MapPin, X } from "lucide-react"
import { useDebounce } from "@/hooks/use-debounce"

interface LocationSearchProps {
  onLocationSelect: (location: { lat: number; lng: number; address: string }) => void
  currentLocation: { lat: number | null; lng: number | null; address: string }
}

interface LocationResult {
  place_id: number | string
  lat: string | number
  lon: string | number
  display_name: string
}

export function LocationSearch({ onLocationSelect, currentLocation }: LocationSearchProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [results, setResults] = useState<LocationResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const debouncedSearchTerm = useDebounce(searchTerm, 500)
  const wrapperRef = useRef<HTMLDivElement>(null)

  // Search for locations when the debounced search term changes
  useEffect(() => {
    if (debouncedSearchTerm.length < 3) {
      setResults([])
      return
    }

    const searchLocations = async () => {
      setIsSearching(true)
      try {
        // Using OpenCage Geocoding API (free tier available)
        const response = await fetch(
          `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(debouncedSearchTerm)}&key=YOUR_OPENCAGE_API_KEY&limit=5`,
        )
        const data = await response.json()

        if (data.results) {
          const formattedResults = data.results.map((result: any) => ({
            place_id: result.annotations.geohash,
            lat: result.geometry.lat,
            lon: result.geometry.lng,
            display_name: result.formatted,
          }))
          setResults(formattedResults)
        } else {
          setResults([])
        }
      } catch (error) {
        console.error("Error searching for locations:", error)
        // Fallback to Nominatim if OpenCage fails
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(debouncedSearchTerm)}&limit=5`,
          )
          const data = await response.json()
          setResults(data)
        } catch (fallbackError) {
          console.error("Fallback location search also failed:", fallbackError)
          setResults([])
        }
      } finally {
        setIsSearching(false)
      }
    }

    searchLocations()
  }, [debouncedSearchTerm])

  // Close the results dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowResults(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [wrapperRef])

  const handleLocationSelect = (result: LocationResult) => {
    onLocationSelect({
      lat: Number(result.lat),
      lng: Number(result.lon),
      address: result.display_name,
    })
    setSearchTerm("")
    setShowResults(false)
  }

  const handleInputFocus = () => {
    if (searchTerm.length >= 3) {
      setShowResults(true)
    }
  }

  const handleClearSearch = () => {
    setSearchTerm("")
    setResults([])
    setShowResults(false)
  }

  return (
    <div className="relative" ref={wrapperRef}>
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Input
            placeholder="Search for a location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={handleInputFocus}
            className="pr-8"
          />
          {searchTerm && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-full w-8 p-0"
              onClick={handleClearSearch}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Clear search</span>
            </Button>
          )}
        </div>
        <Button variant="outline" size="icon">
          <Search className="h-4 w-4" />
          <span className="sr-only">Search</span>
        </Button>
      </div>

      {showResults && (
        <Card className="absolute z-10 mt-1 w-full max-h-[300px] overflow-auto">
          {isSearching ? (
            <div className="p-4 text-center text-sm text-muted-foreground">Searching...</div>
          ) : results.length > 0 ? (
            <ul className="py-2">
              {results.map((result) => (
                <li
                  key={result.place_id}
                  className="px-4 py-2 hover:bg-muted cursor-pointer flex items-start gap-2"
                  onClick={() => handleLocationSelect(result)}
                >
                  <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{result.display_name}</span>
                </li>
              ))}
            </ul>
          ) : searchTerm.length >= 3 ? (
            <div className="p-4 text-center text-sm text-muted-foreground">No results found</div>
          ) : (
            <div className="p-4 text-center text-sm text-muted-foreground">Type at least 3 characters to search</div>
          )}
        </Card>
      )}

      <div className="mt-2 text-xs text-muted-foreground flex items-center gap-1">
        <MapPin className="h-3 w-3" />
        <span className="truncate">{currentLocation.address}</span>
      </div>
    </div>
  )
}
