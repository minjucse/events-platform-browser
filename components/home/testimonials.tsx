"use client"

import { useState } from "react"
import Image from "next/image"
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react"
import { Button } from "@/components/ui/button"
import { GlowCard } from "@/components/glow-card"

const testimonials = [
  {
    id: 1,
    name: "Alex Thompson",
    role: "Software Engineer",
    avatar: "/professional-man-headshot.png",
    rating: 5,
    text: "EventHub changed my social life completely. I moved to a new city knowing no one, and within a month I had a whole group of friends through hiking and tech events. The hosts are amazing and the events are well-organized.",
    event: "Tech Networking & Hiking",
  },
  {
    id: 2,
    name: "Maria Garcia",
    role: "Marketing Manager",
    avatar: "/professional-woman-headshot.png",
    rating: 5,
    text: "As someone who loves concerts but hates going alone, this platform is a game-changer. I've met incredible people with similar music tastes, and we now have a regular group for live shows!",
    event: "Jazz Night at Blue Note",
  },
  {
    id: 3,
    name: "David Kim",
    role: "Startup Founder",
    avatar: "/asian-man-professional-headshot.png",
    rating: 5,
    text: "The networking events here are top-notch. I've made valuable connections that have helped my business grow. The community is genuine and supportive. Highly recommend for entrepreneurs!",
    event: "Tech Startup Networking",
  },
  {
    id: 4,
    name: "Emily Chen",
    role: "Yoga Instructor",
    avatar: "/young-woman-smiling-headshot.png",
    rating: 5,
    text: "I started hosting wellness events through EventHub and the response has been incredible. The platform makes it easy to manage participants and payments. My community has grown 10x!",
    event: "Morning Yoga Sessions",
  },
]

export function Testimonials() {
  const [current, setCurrent] = useState(0)

  const next = () => setCurrent((prev) => (prev + 1) % testimonials.length)
  const prev = () => setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length)

  return (
    <section className="py-20 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            What Our <span className="gradient-text">Community</span> Says
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Real stories from real people who found their tribe through EventHub
          </p>
        </div>

        {/* Desktop Grid */}
        <div className="hidden lg:grid lg:grid-cols-2 gap-6">
          {testimonials.map((testimonial) => (
            <GlowCard key={testimonial.id} className="relative">
              <Quote className="absolute right-6 top-6 h-10 w-10 text-primary/10" />
              <div className="flex gap-4">
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full">
                  <Image
                    src={testimonial.avatar || "/placeholder.svg"}
                    alt={testimonial.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-semibold">{testimonial.name}</h3>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  <div className="mt-1 flex gap-0.5">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                    ))}
                  </div>
                </div>
              </div>
              <p className="mt-4 text-muted-foreground leading-relaxed">"{testimonial.text}"</p>
              <p className="mt-4 text-sm font-medium text-primary">Attended: {testimonial.event}</p>
            </GlowCard>
          ))}
        </div>

        {/* Mobile Carousel */}
        <div className="lg:hidden">
          <GlowCard className="relative">
            <Quote className="absolute right-6 top-6 h-10 w-10 text-primary/10" />
            <div className="flex gap-4">
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full">
                <Image
                  src={testimonials[current].avatar || "/placeholder.svg"}
                  alt={testimonials[current].name}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h3 className="font-semibold">{testimonials[current].name}</h3>
                <p className="text-sm text-muted-foreground">{testimonials[current].role}</p>
                <div className="mt-1 flex gap-0.5">
                  {Array.from({ length: testimonials[current].rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                  ))}
                </div>
              </div>
            </div>
            <p className="mt-4 text-muted-foreground leading-relaxed">"{testimonials[current].text}"</p>
            <p className="mt-4 text-sm font-medium text-primary">Attended: {testimonials[current].event}</p>
          </GlowCard>

          <div className="mt-6 flex items-center justify-center gap-4">
            <Button variant="outline" size="icon" onClick={prev}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrent(index)}
                  className={`h-2 w-2 rounded-full transition-colors ${
                    index === current ? "bg-primary" : "bg-muted-foreground/30"
                  }`}
                />
              ))}
            </div>
            <Button variant="outline" size="icon" onClick={next}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
