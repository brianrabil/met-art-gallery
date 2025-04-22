"use client"

import Image from "next/image"
import { useCollectionHighlight } from "@/lib/queries"
import { Skeleton } from "@/components/ui/skeleton"

export default function CollectionHeroWithQuery() {
  const { data: highlight, isLoading } = useCollectionHighlight()

  return (
    <section className="relative w-full h-[60vh] min-h-[500px] flex items-center">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        {isLoading || !highlight?.image ? (
          <div className="w-full h-full bg-gradient-to-r from-slate-900 to-slate-700" />
        ) : (
          <Image
            src={highlight.image || "/placeholder.svg"}
            alt={highlight.title || "Collection highlight"}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        )}
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold tracking-tight text-white mb-4">
            Curated Collection
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mb-6">
            Explore our carefully selected artworks from the Metropolitan Museum of Art's vast collection, featuring
            masterpieces across various periods, styles, and cultures.
          </p>
          <div className="flex flex-wrap gap-4">
            {isLoading ? (
              <div className="bg-black/30 backdrop-blur-sm p-4 rounded-lg border border-white/10 max-w-md">
                <Skeleton className="h-7 w-48 bg-white/20 mb-2" />
                <Skeleton className="h-4 w-full bg-white/20" />
                <Skeleton className="h-4 w-3/4 bg-white/20 mt-1" />
              </div>
            ) : highlight ? (
              <div className="bg-black/30 backdrop-blur-sm p-4 rounded-lg border border-white/10 max-w-md">
                <h2 className="text-xl font-medium text-white mb-2">Featured: {highlight.title}</h2>
                <p className="text-white/80 text-sm">{highlight.description}</p>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  )
}
