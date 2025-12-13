"use client"

import { useState, useEffect } from "react"
import { Search, MapPin, Calendar, SlidersHorizontal, X, Grid, List } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { EventCard } from "@/components/event-card"
import { eventApi } from "@/lib/eventApi"
import type { Event } from "@/lib/types"
import { toast } from "sonner"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

const eventCategories = [
  "Technology", "Education", "Sports", "Music", "Art", "Food", "Business", "Health", "Travel", "Gaming"
]

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [location, setLocation] = useState("")
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [sortBy, setSortBy] = useState("date")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [priceFilter, setPriceFilter] = useState<"all" | "free" | "paid">("all")
  const [page, setPage] = useState(1)
  const [meta, setMeta] = useState({ total: 0, page: 1, limit: 12 })

  useEffect(() => {
    fetchEvents()
  }, [page, searchQuery, selectedCategories, priceFilter])

  const fetchEvents = async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "12",
      })
      
      if (searchQuery) {
        params.append("searchTerm", searchQuery)
      }
      
      if (selectedCategories.length > 0) {
        params.append("eventCategory", selectedCategories[0])
      }
      
      const response = await eventApi.getAllEvents(params)
      if (response.success) {
        setEvents(response.data || [])
        setMeta(response.meta || { total: 0, page: 1, limit: 12 })
      }
    } catch (error) {
      toast.error("Failed to fetch events")
    }
    setIsLoading(false)
  }

  const filteredEvents = (() => {
    let filteredEvents = [...events]

    if (searchQuery) {
      filteredEvents = filteredEvents.filter(
        (e) =>
          e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          e.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          e.location.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    if (location) {
      filteredEvents = filteredEvents.filter(
        (e) => e.location.toLowerCase().includes(location.toLowerCase())
      )
    }

    if (selectedCategories.length > 0) {
      filteredEvents = filteredEvents.filter((e) => selectedCategories.includes(e.eventCategory))
    }

    if (priceFilter === "free") {
      filteredEvents = filteredEvents.filter((e) => e.joiningFee === 0)
    } else if (priceFilter === "paid") {
      filteredEvents = filteredEvents.filter((e) => e.joiningFee > 0)
    }

    if (sortBy === "date") {
      filteredEvents.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    } else if (sortBy === "price-low") {
      filteredEvents.sort((a, b) => a.joiningFee - b.joiningFee)
    } else if (sortBy === "price-high") {
      filteredEvents.sort((a, b) => b.joiningFee - a.joiningFee)
    } else if (sortBy === "participants") {
      filteredEvents.sort((a, b) => b.currentParticipants - a.currentParticipants)
    }

    return filteredEvents
  })()

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category],
    )
  }

  const clearFilters = () => {
    setSearchQuery("")
    setLocation("")
    setSelectedCategories([])
    setPriceFilter("all")
    setSortBy("date")
    setPage(1)
  }

  const hasActiveFilters = searchQuery || location || selectedCategories.length > 0 || priceFilter !== "all"

  return (
    <div className="py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Explore <span className="gradient-text">Events</span>
          </h1>
          <p className="mt-2 text-muted-foreground">Discover and join exciting activities happening near you</p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search events..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setPage(1)
                }}
              />
            </div>
            <div className="relative sm:w-48">
              <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Location"
                className="pl-10"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="sm:w-44">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Date (Soonest)</SelectItem>
                <SelectItem value="price-low">Price (Low to High)</SelectItem>
                <SelectItem value="price-high">Price (High to Low)</SelectItem>
                <SelectItem value="participants">Most Popular</SelectItem>
              </SelectContent>
            </Select>

            {/* Mobile Filters */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="gap-2 sm:hidden bg-transparent">
                  <SlidersHorizontal className="h-4 w-4" />
                  Filters
                  {hasActiveFilters && (
                    <Badge variant="secondary" className="ml-1">
                      {selectedCategories.length + (priceFilter !== "all" ? 1 : 0)}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                </SheetHeader>
                <div className="mt-6 space-y-6">
                  {/* Categories */}
                  <div>
                    <Label className="text-sm font-medium mb-3 block">Categories</Label>
                    <div className="space-y-2">
                      {eventCategories.map((category) => (
                        <div key={category} className="flex items-center space-x-2">
                          <Checkbox
                            id={`mobile-${category}`}
                            checked={selectedCategories.includes(category)}
                            onCheckedChange={() => toggleCategory(category)}
                          />
                          <Label htmlFor={`mobile-${category}`} className="text-sm font-normal">
                            {category}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Price */}
                  <div>
                    <Label className="text-sm font-medium mb-3 block">Price</Label>
                    <div className="space-y-2">
                      {[
                        { value: "all", label: "All Events" },
                        { value: "free", label: "Free Events" },
                        { value: "paid", label: "Paid Events" },
                      ].map((option) => (
                        <div key={option.value} className="flex items-center space-x-2">
                          <Checkbox
                            id={`mobile-price-${option.value}`}
                            checked={priceFilter === option.value}
                            onCheckedChange={() => setPriceFilter(option.value as typeof priceFilter)}
                          />
                          <Label htmlFor={`mobile-price-${option.value}`} className="text-sm font-normal">
                            {option.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button variant="outline" className="w-full bg-transparent" onClick={clearFilters}>
                    Clear All Filters
                  </Button>
                </div>
              </SheetContent>
            </Sheet>

            {/* View Mode Toggle */}
            <div className="hidden sm:flex border rounded-lg">
              <Button
                variant={viewMode === "grid" ? "secondary" : "ghost"}
                size="icon"
                onClick={() => setViewMode("grid")}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "secondary" : "ghost"}
                size="icon"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Desktop Category Pills */}
          <div className="hidden sm:flex flex-wrap gap-2">
            {eventCategories.map((category) => (
              <Button
                key={category}
                variant={selectedCategories.includes(category) ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  toggleCategory(category)
                  setPage(1)
                }}
                className="rounded-full"
              >
                {category}
              </Button>
            ))}
            <Select value={priceFilter} onValueChange={(v) => {
              setPriceFilter(v as typeof priceFilter)
              setPage(1)
            }}>
              <SelectTrigger className="w-32 h-8 rounded-full">
                <SelectValue placeholder="Price" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Prices</SelectItem>
                <SelectItem value="free">Free Only</SelectItem>
                <SelectItem value="paid">Paid Only</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Active Filters */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-muted-foreground">Active filters:</span>
              {searchQuery && (
                <Badge variant="secondary" className="gap-1">
                  Search: {searchQuery}
                  <button onClick={() => setSearchQuery("")}>
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {location && (
                <Badge variant="secondary" className="gap-1">
                  Location: {location}
                  <button onClick={() => setLocation("")}>
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {selectedCategories.map((cat) => (
                <Badge key={cat} variant="secondary" className="gap-1 capitalize">
                  {cat}
                  <button onClick={() => toggleCategory(cat)}>
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
              {priceFilter !== "all" && (
                <Badge variant="secondary" className="gap-1 capitalize">
                  {priceFilter}
                  <button onClick={() => setPriceFilter("all")}>
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Clear all
              </Button>
            </div>
          )}
        </div>

        {/* Results */}
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {filteredEvents.length} of {meta.total} events (Page {meta.page})
          </p>
        </div>

        {isLoading ? (
          <div className="text-center py-16">Loading events...</div>
        ) : filteredEvents.length > 0 ? (
          <div
            className={viewMode === "grid" ? "grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "space-y-4"}
          >
            {filteredEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Calendar className="h-16 w-16 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-semibold">No events found</h3>
            <p className="text-muted-foreground mt-1">Try adjusting your filters or search query</p>
            <Button variant="outline" className="mt-4 bg-transparent" onClick={clearFilters}>
              Clear Filters
            </Button>
          </div>
        )}
        
        {/* Pagination */}
        {meta.total > meta.limit && (
          <div className="mt-8">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    className={page === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
                {Array.from({ length: Math.ceil(meta.total / meta.limit) }, (_, i) => i + 1).map(p => (
                  <PaginationItem key={p}>
                    <PaginationLink
                      onClick={() => setPage(p)}
                      isActive={page === p}
                      className="cursor-pointer"
                    >
                      {p}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    onClick={() => setPage(p => Math.min(Math.ceil(meta.total / meta.limit), p + 1))}
                    className={page === Math.ceil(meta.total / meta.limit) ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
    </div>
  )
}
