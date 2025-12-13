"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Search, MapPin, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-background via-background to-muted/30 py-20 lg:py-32">
      {/* Background decorations */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-40 -top-40 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -left-40 top-1/2 h-80 w-80 rounded-full bg-accent/10 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 h-60 w-60 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/50 px-4 py-1.5 text-sm">
              <Sparkles className="h-4 w-4 text-primary" />
              <span>Join 10,000+ event enthusiasts</span>
            </div>

            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              <span className="text-balance">Find Your Tribe,</span>
              <br />
              <span className="gradient-text text-balance">Join the Fun</span>
            </h1>

            <p className="max-w-xl text-lg text-muted-foreground leading-relaxed">
              Never miss out on events because you lack companions. Connect with like-minded people for concerts, hiking
              trips, game nights, tech meetups, and more.
            </p>

            {/* Search Bar */}
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Search events, activities..." className="pl-10 h-12 bg-card" />
              </div>
              <div className="relative flex-1 sm:max-w-[200px]">
                <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Location" className="pl-10 h-12 bg-card" />
              </div>
              <Link href="/events">
                <Button size="lg" className="h-12 px-8 w-full sm:w-auto">
                  Explore
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-8 pt-4">
              <div>
                <div className="text-3xl font-bold gradient-text">500+</div>
                <div className="text-sm text-muted-foreground">Active Events</div>
              </div>
              <div>
                <div className="text-3xl font-bold gradient-text">10K+</div>
                <div className="text-sm text-muted-foreground">Happy Members</div>
              </div>
              <div>
                <div className="text-3xl font-bold gradient-text">50+</div>
                <div className="text-sm text-muted-foreground">Cities</div>
              </div>
            </div>
          </div>

          {/* Hero Images Grid */}
          <div className="relative hidden lg:block">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="card-glow relative aspect-[4/5] overflow-hidden rounded-2xl">
                  <Image
                    src="/sunset-hiking-trail-mountains.jpg"
                    alt="Hiking adventure"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="card-glow relative aspect-[4/3] overflow-hidden rounded-2xl">
                  <Image src="/board-games-night-friends-playing.jpg" alt="Game night" fill className="object-cover" />
                </div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="card-glow relative aspect-[4/3] overflow-hidden rounded-2xl">
                  <Image src="/jazz-club-live-music-performance.jpg" alt="Live music" fill className="object-cover" />
                </div>
                <div className="card-glow relative aspect-[4/5] overflow-hidden rounded-2xl">
                  <Image
                    src="/tech-networking-event-startup-meetup.jpg"
                    alt="Tech meetup"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
