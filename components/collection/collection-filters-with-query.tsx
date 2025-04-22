"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { SortAsc, SortDesc } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useArtPeriods, useArtStyles, useArtMediums } from "@/lib/queries"

export default function CollectionFiltersWithQuery() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false)

  // Fetch filter options with TanStack Query
  const { data: periods = [] } = useArtPeriods()
  const { data: styles = [] } = useArtStyles()
  const { data: mediums = [] } = useArtMediums()

  // Current filter values
  const currentPeriod = searchParams.get("period") || ""
  const currentStyle = searchParams.get("style") || ""
  const currentMedium = searchParams.get("medium") || ""
  const currentSort = searchParams.get("sort") || "relevance"
  const currentHighlight = searchParams.get("highlight") === "true"
  const currentPublicDomain = searchParams.get("publicDomain") === "true"

  // Local state for filter dialog
  const [localPeriod, setLocalPeriod] = useState(currentPeriod)
  const [localStyle, setLocalStyle] = useState(currentStyle)
  const [localMedium, setLocalMedium] = useState(currentMedium)
  const [localHighlight, setLocalHighlight] = useState(currentHighlight)
  const [localPublicDomain, setLocalPublicDomain] = useState(currentPublicDomain)

  // Reset local state when dialog opens
  useEffect(() => {
    if (isFilterDialogOpen) {
      setLocalPeriod(currentPeriod)
      setLocalStyle(currentStyle)
      setLocalMedium(currentMedium)
      setLocalHighlight(currentHighlight)
      setLocalPublicDomain(currentPublicDomain)
    }
  }, [isFilterDialogOpen, currentPeriod, currentStyle, currentMedium, currentHighlight, currentPublicDomain])

  // Apply filters
  const applyFilters = () => {
    const params = new URLSearchParams(searchParams.toString())

    if (localPeriod) params.set("period", localPeriod)
    else params.delete("period")

    if (localStyle) params.set("style", localStyle)
    else params.delete("style")

    if (localMedium) params.set("medium", localMedium)
    else params.delete("medium")

    if (localHighlight) params.set("highlight", "true")
    else params.delete("highlight")

    if (localPublicDomain) params.set("publicDomain", "true")
    else params.delete("publicDomain")

    // Reset to page 1 when filters change
    params.set("page", "1")

    router.push(`/collection?${params.toString()}`)
    setIsFilterDialogOpen(false)
  }

  // Apply sort
  const applySort = (sort: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("sort", sort)
    router.push(`/collection?${params.toString()}`)
  }

  // Clear all filters
  const clearFilters = () => {
    const params = new URLSearchParams()
    if (currentSort !== "relevance") params.set("sort", currentSort)
    router.push(`/collection?${params.toString()}`)
  }

  // Count active filters
  const activeFilterCount = [currentPeriod, currentStyle, currentMedium, currentHighlight, currentPublicDomain].filter(
    Boolean,
  ).length

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Sort Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="h-9">
            {currentSort === "relevance" ? <SortAsc className="mr-2 h-4 w-4" /> : <SortDesc className="mr-2 h-4 w-4" />}
            Sort: {getSortLabel(currentSort)}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Sort By</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => applySort("relevance")}>
              Relevance
              {currentSort === "relevance" && <span className="ml-auto">✓</span>}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => applySort("date-asc")}>
              Date (Oldest First)
              {currentSort === "date-asc" && <span className="ml-auto">✓</span>}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => applySort("date-desc")}>
              Date (Newest First)
              {currentSort === "date-desc" && <span className="ml-auto">✓</span>}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => applySort("title-asc")}>
              Title (A-Z)
              {currentSort === "title-asc" && <span className="ml-auto">✓</span>}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => applySort("title-desc")}>
              Title (Z-A)
              {currentSort === "title-desc" && <span className="ml-auto">✓</span>}
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      { /* Filter
