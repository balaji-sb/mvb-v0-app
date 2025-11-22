"use client"

import { useEffect, useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface CarouselItem {
  id: number
  title: string
  subtitle: string
  image: string
  cta: string
}

const carouselItems: CarouselItem[] = [
  {
    id: 1,
    title: "Welcome to Mahi's Vriksham Boutique",
    subtitle: "Premium Aari, Sewing & Boutique Materials",
    image: "/aari-embroidery-showcase.jpg",
    cta: "Shop Collection",
  },
  {
    id: 2,
    title: "Exquisite Embroidery Materials",
    subtitle: "Premium aari threads and embellishments for your creations",
    image: "/embroidery-materials-collection.jpg",
    cta: "Explore Aari",
  },
  {
    id: 3,
    title: "Fine Fabrics & Trimmings",
    subtitle: "Curated selection of silk, lace, and finishing materials",
    image: "/fabrics-trimmings-display.jpg",
    cta: "Shop Fabrics",
  },
]

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0)
  const [autoplay, setAutoplay] = useState(true)

  useEffect(() => {
    if (!autoplay) return

    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % carouselItems.length)
    }, 5000)

    return () => clearInterval(timer)
  }, [autoplay])

  const next = () => {
    setCurrent((prev) => (prev + 1) % carouselItems.length)
    setAutoplay(false)
  }

  const prev = () => {
    setCurrent((prev) => (prev - 1 + carouselItems.length) % carouselItems.length)
    setAutoplay(false)
  }

  return (
    <div className="relative w-full h-[500px] md:h-[600px] overflow-hidden rounded-lg bg-muted group">
      {/* Carousel Items */}
      <div className="relative w-full h-full">
        {carouselItems.map((item, index) => (
          <div
            key={item.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === current ? "opacity-100" : "opacity-0"
            }`}
          >
            <img src={item.image || "/placeholder.svg"} alt={item.title} className="w-full h-full object-cover" />
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            {/* Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-4 md:px-8">
              <h2 className="text-3xl md:text-5xl font-bold mb-2 md:mb-4 text-balance">{item.title}</h2>
              <p className="text-base md:text-lg text-gray-100 mb-6 md:mb-8 text-balance">{item.subtitle}</p>
              <button className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 md:px-8 py-2 md:py-3 rounded-lg font-semibold transition-colors">
                {item.cta}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={prev}
        onMouseEnter={() => setAutoplay(false)}
        onMouseLeave={() => setAutoplay(true)}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/30 hover:bg-white/50 text-white p-2 rounded-full transition-colors opacity-0 group-hover:opacity-100"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={next}
        onMouseEnter={() => setAutoplay(false)}
        onMouseLeave={() => setAutoplay(true)}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/30 hover:bg-white/50 text-white p-2 rounded-full transition-colors opacity-0 group-hover:opacity-100"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Dot Indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {carouselItems.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setCurrent(index)
              setAutoplay(false)
            }}
            className={`h-2 rounded-full transition-all ${
              index === current ? "bg-white w-8" : "bg-white/50 w-2 hover:bg-white/75"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
