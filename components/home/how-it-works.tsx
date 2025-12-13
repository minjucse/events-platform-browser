import { Search, UserPlus, Calendar, PartyPopper } from "lucide-react"
import { GlowCard } from "@/components/glow-card"

const steps = [
  {
    icon: Search,
    title: "Discover Events",
    description: "Browse through hundreds of events and activities in your area based on your interests.",
  },
  {
    icon: UserPlus,
    title: "Join or Create",
    description: "Join existing events or become a host and create your own unique experiences.",
  },
  {
    icon: Calendar,
    title: "Get Matched",
    description: "Connect with like-minded people who share your passion for the same activities.",
  },
  {
    icon: PartyPopper,
    title: "Experience Together",
    description: "Meet in person, have fun, and build lasting friendships through shared experiences.",
  },
]

export function HowItWorks() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            How It <span className="gradient-text">Works</span>
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Getting started is easy. Find your next adventure in just a few simple steps.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <GlowCard key={index} className="relative text-center">
              <div className="absolute -top-4 left-4 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                {index + 1}
              </div>
              <div className="flex flex-col items-center pt-4">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                  <step.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </div>
            </GlowCard>
          ))}
        </div>
      </div>
    </section>
  )
}
