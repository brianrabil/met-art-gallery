"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Filter, SortAsc, SortDesc, X } from "lucide-react"
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { useArtPeriods, useArtStyles, useArtMediums } from "@/lib/queries"

export default function CollectionFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false)

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

  // Fetch filter options using TanStack Query
  const { data: periods = [] } = useArtPeriods()
  const { data: styles = [] } = useArtStyles()
  const { data: mediums = [] } = useArtMediums()

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

      {/* Filter Dialog */}
      <Dialog open={isFilterDialogOpen} onOpenChange={setIsFilterDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="h-9">
            <Filter className="mr-2 h-4 w-4" />
            Filters
            {activeFilterCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {activeFilterCount}
              </Badge>
            )}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Filter Collection</DialogTitle>
            <DialogDescription>
              Refine the collection based on your preferences. Apply multiple filters to narrow your results.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-6 py-4">
            {/* Period Filter */}
            <div className="grid gap-2">
              <Label htmlFor="period">Time Period</Label>
              <RadioGroup id="period" value={localPeriod} onValueChange={setLocalPeriod}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="" id="period-all" />
                  <Label htmlFor="period-all">All Periods</Label>
                </div>
                {periods.map((period) => (
                  <div key={period} className="flex items-center space-x-2">
                    <RadioGroupItem value={period} id={`period-${period}`} />
                    <Label htmlFor={`period-${period}`}>{period}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {/* Style Filter */}
            <div className="grid gap-2">
              <Label htmlFor="style">Art Style</Label>
              <RadioGroup id="style" value={localStyle} onValueChange={setLocalStyle}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="" id="style-all" />
                  <Label htmlFor="style-all">All Styles</Label>
                </div>
                {styles.map((style) => (
                  <div key={style} className="flex items-center space-x-2">
                    <RadioGroupItem value={style} id={`style-${style}`} />
                    <Label htmlFor={`style-${style}`}>{style}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {/* Medium Filter */}
            <div className="grid gap-2">
              <Label htmlFor="medium">Medium</Label>
              <RadioGroup id="medium" value={localMedium} onValueChange={setLocalMedium}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="" id="medium-all" />
                  <Label htmlFor="medium-all">All Mediums</Label>
                </div>
                {mediums.map((medium) => (
                  <div key={medium} className="flex items-center space-x-2">
                    <RadioGroupItem value={medium} id={`medium-${medium}`} />
                    <Label htmlFor={`medium-${medium}`}>{medium}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {/* Additional Filters */}
            <div className="grid gap-2">
              <Label>Additional Filters</Label>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="highlight"
                  checked={localHighlight}
                  onCheckedChange={(checked) => setLocalHighlight(checked === true)}
                />
                <Label htmlFor="highlight">Highlights Only</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="publicDomain"
                  checked={localPublicDomain}
                  onCheckedChange={(checked) => setLocalPublicDomain(checked === true)}
                />
                <Label htmlFor="publicDomain">Public Domain Only</Label>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsFilterDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={applyFilters}>Apply Filters</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Clear Filters Button */}
      {activeFilterCount > 0 && (
        <Button variant="ghost" size="sm" className="h-9" onClick={clearFilters}>
          <X className="mr-2 h-4 w-4" />
          Clear Filters
        </Button>
      )}

      {/* Active Filter Badges */}
      <div className="flex flex-wrap gap-2 mt-2 md:mt-0">
        {currentPeriod && (
          <Badge variant="outline" className="h-7">
            Period: {currentPeriod}
          </Badge>
        )}
        {currentStyle && (
          <Badge variant="outline" className="h-7">
            Style: {currentStyle}
          </Badge>
        )}
        {currentMedium && (
          <Badge variant="outline" className="h-7">
            Medium: {currentMedium}
          </Badge>
        )}
        {currentHighlight && (
          <Badge variant="outline" className="h-7">
            Highlights Only
          </Badge>
        )}
        {currentPublicDomain && (
          <Badge variant="outline" className="h-7">
            Public Domain Only
          </Badge>
        )}
      </div>
    </div>
  )
}

function getSortLabel(sort: string): string {
  switch (sort) {
    case "date-asc":
      return "Date (Oldest)"
    case "date-desc":
      return "Date (Newest)"
    case "title-asc":
      return "Title (A-Z)"
    case "title-desc":
      return "Title (Z-A)"
    default:
      return "Relevance"
  }
}
