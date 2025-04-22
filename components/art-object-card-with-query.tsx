"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowRight } from "lucide-react"
import { useObjectDetail, usePrefetchObject } from "@/lib/queries"

export default function ArtObjectCardWithQuery({ objectId }: { objectId: number }) {
  const { data: object, isLoading, error } = useObjectDetail(objectId)
  const prefetchObject = usePrefetchObject(objectId)

  // Prefetch on hover
  const handleMouseEnter = () => {
    prefetchObject()
  }

  if (isLoading) {
    return <ArtObjectCardSkeleton />
  }

  if (error || !object) {
    return null
  }

  // Extract a short description from the object data
  const shortDescription = object.objectDescription
    ? object.objectDescription.substring(0, 120) + (object.objectDescription.length > 120 ? "..." : "")
    : object.culture || object.period || object.department || "Metropolitan Museum of Art collection"

  return (
    <div
      className="group relative w-full overflow-hidden rounded-3xl bg-black shadow-lg transition-all duration-300 hover:shadow-xl"
      onMouseEnter={handleMouseEnter}
    >
      {/* Image Container */}
      <div className="relative aspect-[3/4] w-full overflow-hidden">
        {object.primaryImage ? (
          <Image
            src={object.primaryImage || "/placeholder.svg"}
            alt={object.title || "Artwork image"}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-neutral-800">
            <p className="text-sm text-neutral-400">No image available</p>
          </div>
        )}

        {/* Top tagline */}
        {object.isHighlight && (
          <div className="absolute left-6 top-6 text-sm font-light tracking-wide text-white/90">Featured Artwork</div>
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
      </div>

      {/* Content overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
        <h2 className="mb-2 text-3xl font-light tracking-tight">{object.title || "Untitled"}</h2>

        <p className="mb-4 text-sm font-light text-white/80">{shortDescription}</p>

        <div className="flex items-center justify-between">
          <p className="text-sm font-light text-white/70">{object.artistDisplayName || "Unknown Artist"}</p>

          <Button
            asChild
            variant="outline"
            size="sm"
            className="border-white/30 bg-transparent text-white hover:bg-white/10"
          >
            <Link href={`/object/${objectId}`} className="flex items-center gap-1">
              Details
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>

        {/* Bottom tags */}
        <div className="mt-4 flex flex-wrap gap-2">
          {object.department && (
            <span className="inline-flex items-center rounded-full border border-white/20 px-2.5 py-0.5 text-xs font-light text-white/70">
              {object.department}
            </span>
          )}
          {object.objectDate && (
            <span className="inline-flex items-center rounded-full border border-white/20 px-2.5 py-0.5 text-xs font-light text-white/70">
              {object.objectDate}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

function ArtObjectCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-3xl bg-neutral-100 shadow-md dark:bg-neutral-900">
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
  )
}
