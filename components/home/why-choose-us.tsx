import { Shield, Users, Zap, Heart, Globe, Award } from "lucide-react"
import { GlowCard } from "@/components/glow-card"

const features = [
  {
    icon: Shield,
    title: "Verified Hosts",
    description: "All hosts are verified and reviewed by our community for your safety and peace of mind.",
  },
  {
    icon: Users,
    title: "Genuine Connections",
    description: "Meet real people with shared interests, not just online profiles. Build lasting friendships.",
  },
  {
    icon: Zap,
    title: "Easy & Fast",
    description: "Find and join events in seconds. Our intuitive platform makes discovery effortless.",
  },
  {
    icon: Heart,
    title: "Community First",
    description: "We prioritize community wellbeing with inclusive events and supportive moderation.",
  },
  {
    icon: Globe,
    title: "Local & Global",
    description: "From local coffee meetups to international travel groups, find events everywhere.",
  },
  {
    icon: Award,
    title: "Quality Events",
    description: "Curated experiences with detailed reviews help you find the perfect events.",
  },
]

export function WhyChooseUs() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Why Choose <span className="gradient-text">EventHub</span>
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            We're more than just an event platform. We're a community built on trust, genuine connections, and
            unforgettable experiences.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <GlowCard key={index} className="group">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
              </div>
            </GlowCard>
          ))}
        </div>
      </div>
    </section>
  )
}
