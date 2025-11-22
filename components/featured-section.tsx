"use client"

export default function FeaturedSection() {
  return (
    <section className="py-12 md:py-16">
      <div className="mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2 text-balance">
          Why Choose Mahi's Vriksham Boutique?
        </h2>
        <p className="text-muted-foreground">
          Premium aari, sewing supplies, and boutique materials crafted with excellence
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        {[
          {
            icon: "🧵",
            title: "Premium Quality",
            description: "Authentic aari threads and finest fabrics sourced from trusted suppliers",
          },
          {
            icon: "🎨",
            title: "Curated Selection",
            description: "Handpicked materials perfect for embroidery, sewing, and boutique design",
          },
          {
            icon: "⚡",
            title: "Expert Support",
            description: "Guidance and expertise for embroidery artists and fashion designers",
          },
        ].map((item, index) => (
          <div
            key={index}
            className="p-6 rounded-lg bg-muted/50 border border-border hover:border-primary/50 hover:bg-muted transition-all"
          >
            <div className="text-4xl mb-4">{item.icon}</div>
            <h3 className="text-lg font-semibold text-foreground mb-2">{item.title}</h3>
            <p className="text-muted-foreground text-sm">{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
