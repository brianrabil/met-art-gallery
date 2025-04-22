"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { getDepartmentHighlights } from "@/lib/api"
import type { DepartmentHighlight } from "@/lib/types"

export default function DepartmentsHero() {
  const [highlight, setHighlight] = useState<DepartmentHighlight | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchHighlight() {
      try {
        const highlights = await getDepartmentHighlights()
        const randomHighlight = highlights[Math.floor(Math.random() * highlights.length)]
        setHighlight(randomHighlight)
      } catch (error) {
        console.error("Error fetching department highlight:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchHighlight()
  }, [])

  return (
    <section className="relative w-full h-[50vh] min-h-[400px] flex items-center">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        {highlight?.image ? (
          <Image
            src={highlight.image || "/placeholder.svg"}
            alt={highlight.name || "Department highlight"}
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
          <h1 className="text-4xl md:text-5xl font-serif font-bold tracking-tight text-white mb-4">
            Explore Museum Departments
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl">
            Discover the specialized departments that curate and preserve the Metropolitan Museum of Art's vast
            collection spanning 5,000 years of world culture.
          </p>
        </div>
      </div>
    </section>
  )
}
