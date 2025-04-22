"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { useFeaturedCollection, usePrefetchObject } from "@/lib/queries"

interface CollectionItem {
  id: string
  title?: string
  artist?: string
  description?: string
  image?: string
}

export default function FeaturedArtworks() {
  const { data: featuredItems, isLoading, error } = useFeaturedCollection(3)

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Array(3)
          .fill(0)
          .map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-[300px] w-full rounded-lg" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
      </div>
    )
  }

  if (error || !featuredItems || featuredItems.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No featured artworks available</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {featuredItems.map((item) => (
        <FeaturedArtworkCard key={item.id} item={item} />
      ))}
    </div>
  )
}

function FeaturedArtworkCard({ item }: { item: CollectionItem }) {
  const prefetchObject = usePrefetchObject(item.id)

  return (
    <Card className="overflow-hidden" onMouseEnter={prefetchObject}>
      <CardContent className="p-0">
        <div className="relative aspect-[4/3] bg-muted">
          <Image
            src={item.image || "/placeholder.svg"}
            alt={item.title || "Featured artwork"}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute top-2 right-2">
            <Badge className="bg-primary">Featured</Badge>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-start p-4">
        <h3 className="text-xl font-medium">{item.title || "Untitled"}</h3>
        <p className="text-muted-foreground mb-2">{item.artist || "Unknown Artist"}</p>
        <p className="line-clamp-2 mb-4 text-sm">{item.description}</p>
        <Button asChild size="sm">
          <Link href={`/object/${item.id}`}>
            View Details
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
