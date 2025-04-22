"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getRandomFeaturedArtwork } from "@/lib/api"
import type { ArtObject } from "@/lib/types"

export default function HeroSection() {
  const [artwork, setArtwork] = useState<ArtObject | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchFeaturedArtwork() {
      try {
        const featuredArtwork = await getRandomFeaturedArtwork()
        setArtwork(featuredArtwork)
      } catch (error) {
        console.error("Error fetching featured artwork:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchFeaturedArtwork()
  }, [])

  return (
    <section className="relative w-full h-[80vh] min-h-[600px] flex items-center">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        {artwork?.primaryImage ? (
          <Image
            src={artwork.primaryImage || "/placeholder.svg"}
            alt={artwork.title || "Featured artwork"}
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
      <div className="container mx-auto px-4 relative z-10 pt-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="text-white space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold tracking-tight">
              Discover Art Masterpieces
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-lg">
              Explore the Metropolitan Museum of Art's vast collection of artwork, artifacts, and historical objects
              from around the world.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg" className="bg-white text-foreground hover:bg-white/90">
                <Link href="/">
                  Explore Collection
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
                <Link href="/departments">Browse Departments</Link>
              </Button>
            </div>
          </div>

          {artwork && (
            <div className="hidden lg:block bg-black/30 backdrop-blur-sm p-6 rounded-lg border border-white/10">
              <div className="space-y-4">
                <h2 className="text-2xl font-medium text-white">{artwork.title || "Untitled"}</h2>
                {artwork.artistDisplayName && (
                  <p className="text-white/80">
                    By <span className="font-medium">{artwork.artistDisplayName}</span>
                    {artwork.objectDate && `, ${artwork.objectDate}`}
                  </p>
                )}
                {artwork.department && <p className="text-white/70">{artwork.department}</p>}
                <Button asChild variant="link" className="text-white p-0 h-auto">
                  <Link href={`/object/${artwork.objectID}`}>
                    View Details
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Attribution */}
      {artwork && (
        <div className="absolute bottom-4 right-4 z-10">
          <Link
            href={`/object/${artwork.objectID}`}
            className="text-xs text-white/70 hover:text-white bg-black/30 px-2 py-1 rounded-md backdrop-blur-sm"
          >
            {artwork.title} {artwork.artistDisplayName ? `by ${artwork.artistDisplayName}` : ""}
          </Link>
        </div>
      )}
    </section>
  )
}
