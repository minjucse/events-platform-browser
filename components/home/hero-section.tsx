"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Search, MapPin, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 py-20 lg:py-32">
      {/* Background decorations */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-40 -top-40 h-80 w-80 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="absolute -left-40 top-1/2 h-80 w-80 rounded-full bg-purple-500/20 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 h-60 w-60 rounded-full bg-cyan-500/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-sm">
              <Sparkles className="h-4 w-4 text-blue-400" />
              <span className="text-slate-200">Join 10,000+ event enthusiasts</span>
            </div>

            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              <span className="text-white text-balance">Find Your Crew,</span>
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent text-balance">
                Join the Fun
              </span>
            </h1>

            <p className="max-w-xl text-lg text-slate-300 leading-relaxed">
             Never miss an event because you’re going solo. Connect with like-minded people for concerts, hiking adventures, game nights, tech meetups, and so much more.
            </p>

            {/* Search Bar */}
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  placeholder="Search events, activities..."
                  className="pl-10 h-12 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500/50"
                />
              </div>
              <div className="relative flex-1 sm:max-w-[200px]">
                <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  placeholder="Location"
                  className="pl-10 h-12 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500/50"
                />
              </div>
              <Link href="/events">
                <Button
                  size="lg"
                  className="h-12 px-8 w-full sm:w-auto bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-blue-500/50"
                >
                  Explore
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-8 pt-4">
              <div>
                <div className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  500+
                </div>
                <div className="text-sm text-slate-400">Active Events</div>
              </div>
              <div>
                <div className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  10K+
                </div>
                <div className="text-sm text-slate-400">Happy Members</div>
              </div>
              <div>
                <div className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  50+
                </div>
                <div className="text-sm text-slate-400">Cities</div>
              </div>
            </div>
          </div>

          {/* Hero Images Grid */}
          <div className="relative hidden lg:block">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-slate-700 shadow-2xl hover:shadow-blue-500/30 transition-all duration-300">
                  <Image
                    src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=600&fit=crop"
                    alt="Hiking adventure"
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-slate-700 shadow-2xl hover:shadow-cyan-500/30 transition-all duration-300">
                  <Image
                    src="https://images.unsplash.com/photo-1551431009-381d36ac3a14?w=500&h=400&fit=crop"
                    alt="Game night"
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-slate-700 shadow-2xl hover:shadow-purple-500/30 transition-all duration-300">
                  <Image
                    src="https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=500&h=400&fit=crop"
                    alt="Live music"
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-slate-700 shadow-2xl hover:shadow-blue-500/30 transition-all duration-300">
                  <Image
                    src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=600&fit=crop"
                    alt="Tech meetup"
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-300"
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