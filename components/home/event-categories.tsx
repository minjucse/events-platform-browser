import Link from "next/link"
import {
  Music,
  Trophy,
  Mountain,
  Gamepad2,
  UtensilsCrossed,
  Palette,
  Laptop,
  Headphones,
  Heart,
  Users,
} from "lucide-react"
import { GlowCard } from "@/components/glow-card"

const categories = [
  { name: "Concerts", icon: Music, color: "text-pink-500", count: 42 },
  { name: "Sports", icon: Trophy, color: "text-green-500", count: 68 },
  { name: "Hiking", icon: Mountain, color: "text-emerald-500", count: 35 },
  { name: "Gaming", icon: Gamepad2, color: "text-purple-500", count: 29 },
  { name: "Food & Dining", icon: UtensilsCrossed, color: "text-orange-500", count: 54 },
  { name: "Art & Culture", icon: Palette, color: "text-rose-500", count: 31 },
  { name: "Tech Meetups", icon: Laptop, color: "text-blue-500", count: 47 },
  { name: "Live Music", icon: Headphones, color: "text-violet-500", count: 38 },
  { name: "Wellness", icon: Heart, color: "text-teal-500", count: 26 },
  { name: "Social", icon: Users, color: "text-amber-500", count: 63 },
]

export function EventCategories() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Explore by <span className="gradient-text">Category</span>
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Find events that match your interests across various categories
          </p>
        </div>

        <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {categories.map((category) => (
            <Link key={category.name} href={`/events?category=${category.name.toLowerCase().replace(/ & /g, "-")}`}>
              <GlowCard className="group flex flex-col items-center gap-3 p-5 text-center hover:bg-secondary/50 transition-colors cursor-pointer">
                <div className={`p-3 rounded-xl bg-secondary ${category.color}`}>
                  <category.icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-medium text-sm">{category.name}</h3>
                  <p className="text-xs text-muted-foreground">{category.count} events</p>
                </div>
              </GlowCard>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
