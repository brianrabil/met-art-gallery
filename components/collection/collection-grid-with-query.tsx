"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Eye, ArrowRight } from "lucide-react"
import Pagination from "@/components/pagination"
import { useFilteredCollection, usePrefetchCollection } from "@/lib/queries"
import type { CollectionItem } from "@/lib/types"

interface CollectionGridProps {
  viewType: "grid" | "masonry"
}

export default function CollectionGridWithQuery({ viewType }: CollectionGridProps) {
  const searchParams = useSearchParams()
  const page = Number.parseInt(searchParams.get("page") || "1")
  const period = searchParams.get("period") || ""
  const style = searchParams.get("style") || ""
  const medium = searchParams.get("medium") || ""
  const sort = searchParams.get("sort") || "relevance"
  const highlight = searchParams.get("highlight") === "true"
  const publicDomain = searchParams.get("publicDomain") === "true"

  const [selectedItem, setSelectedItem] = useState<CollectionItem | null>(null)
  const itemsPerPage = 12

  // Fetch collection data with TanStack Query
  const { data, isLoading, error } = useFilteredCollection({
    page,
    period,
    style,
    medium,
    sort,
    highlight,
    publicDomain,
    limit: itemsPerPage,
  })

  // Prefetch next page
  const prefetchNextPage = usePrefetchCollection({
    page: page + 1,
    period,
    style,
    medium,
    sort,
    highlight,
    publicDomain,
    limit: itemsPerPage,
  })

  if (isLoading) {
    return viewType === "grid" ? <GridSkeleton /> : <MasonrySkeleton />
  }

  if (error || !data || data.items.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-semibold">No items found</h3>
        <p className="text-muted-foreground mt-2">Try adjusting your filters to see more results</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {viewType === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {data.items.map((item) => (
            <CollectionItemCard
              key={item.id}
              item={item}
              onQuickView={() => setSelectedItem(item)}
              prefetchNextPage={prefetchNextPage}
            />
          ))}
        </div>
      ) : (
        <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-6 space-y-6">
          {data.items.map((item) => (
            <div key={item.id} className="break-inside-avoid mb-6">
              <CollectionItemCard
                item={item}
                onQuickView={() => setSelectedItem(item)}
                prefetchNextPage={prefetchNextPage}
              />
            </div>
          ))}
        </div>
      )}

      <Pagination currentPage={page} totalPages={data.totalPages} />

      {/* Quick View Modal */}
      {selectedItem && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedItem(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-background rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-video">
              <Image
                src={selectedItem.image || "/placeholder.svg"}
                alt={selectedItem.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 800px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h3 className="text-3xl font-light tracking-tight mb-2">{selectedItem.title}</h3>
                <p className="text-white/80 text-sm font-light">{selectedItem.artist}</p>
              </div>
            </div>
            <div className="p-6">
              <div className="flex flex-wrap gap-2 mb-4">
                {selectedItem.period && (
                  <span className="inline-flex items-center rounded-full border border-neutral-200 dark:border-neutral-800 px-2.5 py-0.5 text-xs font-light">
                    {selectedItem.period}
                  </span>
                )}
                {selectedItem.style && (
                  <span className="inline-flex items-center rounded-full border border-neutral-200 dark:border-neutral-800 px-2.5 py-0.5 text-xs font-light">
                    {selectedItem.style}
                  </span>
                )}
                {selectedItem.medium && (
                  <span className="inline-flex items-center rounded-full border border-neutral-200 dark:border-neutral-800 px-2.5 py-0.5 text-xs font-light">
                    {selectedItem.medium}
                  </span>
                )}
              </div>
              <p className="mb-6">{selectedItem.description}</p>
              <div className="flex justify-end gap-4">
                <Button variant="outline" onClick={() => setSelectedItem(null)}>
                  Close
                </Button>
                <Button asChild>
                  <Link href={`/object/${selectedItem.id}`} className="flex items-center gap-1">
                    View Details
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Link>
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}

function CollectionItemCard({
  item,
  onQuickView,
  prefetchNextPage,
}: {
  item: CollectionItem
  onQuickView: () => void
  prefetchNextPage: () => void
}) {
  // Extract a short description from the item data
  const shortDescription = item.description
    ? item.description.substring(0, 120) + (item.description.length > 120 ? "..." : "")
    : item.medium || item.style || item.period || "Metropolitan Museum of Art collection"

  return (
    <div
      className="group relative w-full overflow-hidden rounded-3xl bg-black shadow-lg transition-all duration-300 hover:shadow-xl"
      onMouseEnter={prefetchNextPage}
    >
      {/* Image Container */}
      <div className="relative aspect-[3/4] w-full overflow-hidden">
        <Image
          src={item.image || "/placeholder.svg"}
          alt={item.title || "Artwork image"}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        {/* Top tagline */}
        {item.isHighlight && (
          <div className="absolute left-6 top-6 text-sm font-light tracking-wide text-white/90">Featured Artwork</div>
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
      </div>

      {/* Content overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
        <h2 className="mb-2 text-3xl font-light tracking-tight line-clamp-2">{item.title || "Untitled"}</h2>

        <p className="mb-4 text-sm font-light text-white/80 line-clamp-2">{shortDescription}</p>

        <div className="flex items-center justify-between">
          <p className="text-sm font-light text-white/70 line-clamp-1">{item.artist || "Unknown Artist"}</p>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="border-white/30 bg-transparent text-white hover:bg-white/10"
              onClick={(e) => {
                e.preventDefault()
                onQuickView()
              }}
            >
              <Eye className="h-3.5 w-3.5 mr-1" />
              Quick View
            </Button>

            <Button
              asChild
              variant="outline"
              size="sm"
              className="border-white/30 bg-transparent text-white hover:bg-white/10"
            >
              <Link href={`/object/${item.id}`} className="flex items-center gap-1">
                Details
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Bottom tags */}
        <div className="mt-4 flex flex-wrap gap-2">
          {item.period && (
            <span className="inline-flex items-center rounded-full border border-white/20 px-2.5 py-0.5 text-xs font-light text-white/70">
              {item.period}
            </span>
          )}
          {item.medium && (
            <span className="inline-flex items-center rounded-full border border-white/20 px-2.5 py-0.5 text-xs font-light text-white/70">
              {item.medium}
            </span>
          )}
          {item.style && (
            <span className="inline-flex items-center rounded-full border border-white/20 px-2.5 py-0.5 text-xs font-light text-white/70">
              {item.style}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

function GridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {Array(12)
        .fill(0)
        .map((_, i) => (
          <div key={i} className="overflow-hidden rounded-3xl bg-neutral-100 shadow-md dark:bg-neutral-900">
            <div className="relative aspect-[3/4] w-full">
              <Skeleton className="absolute inset-0 h-full w-full" />
            </div>
            <div className="p-6 space-y-3">
              <Skeleton className="h-8 w-4/5" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <div className="flex justify-between items-center pt-2">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-8 w-24 rounded-md" />
              </div>
            </div>
          </div>
        ))}
    </div>
  )
}

function MasonrySkeleton() {
  return (
    <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-6 space-y-6">
      {Array(12)
        .fill(0)
        .map((_, i) => (
          <div
            key={i}
            className="break-inside-avoid mb-6 overflow-hidden rounded-3xl bg-neutral-100 shadow-md dark:bg-neutral-900"
          >
            <div className="relative aspect-[3/4] w-full">
              <Skeleton className="absolute inset-0 h-full w-full" />
            </div>
            <div className="p-6 space-y-3">
              <Skeleton className="h-8 w-4/5" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <div className="flex justify-between items-center pt-2">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-8 w-24 rounded-md" />
              </div>
            </div>
          </div>
        ))}
    </div>
  )
}
