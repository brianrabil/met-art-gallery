"use client"

import Image from "next/image"
import { useCollectionHighlight } from "@/lib/queries"
import { Skeleton } from "@/components/ui/skeleton"

export default function CollectionHero() {
  const { data: highlight, isLoading } = useCollectionHighlight()

  if (isLoading) {
    return (
      <section className="relative w-full h-[60vh] min-h-[500px] flex items-center">
        <div className="absolute inset-0 z-0">
          <Skeleton className="h-full w-full" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <Skeleton className="h-12 w-3/4 mb-4" />
            <Skeleton className="h-6 w-full mb-2" />
            <Skeleton className="h-6 w-2/3" />
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="relative w-full h-[60vh] min-h-[500px] flex items-center">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        {highlight?.image ? (
          <Image
            src={highlight.image || "/placeholder.svg"}
            alt={highlight.title || "Collection highlight"}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-slate-900 to-slate-700" />
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
            {highlight && (
              <div className="bg-black/30 backdrop-blur-sm p-4 rounded-lg border border-white/10 max-w-md">
                <h2 className="text-xl font-medium text-white mb-2">Featured: {highlight.title}</h2>
                <p className="text-white/80 text-sm">{highlight.description}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
