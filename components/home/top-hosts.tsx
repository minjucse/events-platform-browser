import Link from "next/link"
import Image from "next/image"
import { Star, MapPin, Calendar } from "lucide-react"
import { HoverEffectCard } from "@/components/hoverEffect-card"
import { Badge } from "@/components/ui/badge"
import { mockUsers, mockEvents } from "@/lib/mock-data"

export function TopHosts() {
  const hosts = mockUsers.filter((u) => u.role === "HOST")

  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Top-Rated <span className="gradient-text">Hosts</span>
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Meet our amazing community hosts who create unforgettable experiences
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {hosts.map((host) => {
            const hostedEvents = mockEvents.filter((e) => e.eventCategory === host.id).length
            return (
              <Link key={host.id} href={`/profile/${host.id}`}>
                <HoverEffectCard className="group flex flex-col items-center text-center cursor-pointer">
                  <div className="relative mb-4">
                    <div className="relative h-24 w-24 overflow-hidden rounded-full ring-4 ring-primary/20">
                      <Image
                        src={
                          host.id === "user_2"
                            ? "/professional-woman-headshot.png"
                            : "/asian-man-professional-headshot.png"
                        }
                        alt={host.fullName}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <Badge className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground">
                      <Star className="h-3 w-3 mr-1 fill-current" />
                      {host.rating}
                    </Badge>
                  </div>

                  <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">{host.fullName}</h3>

                  <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                    <MapPin className="h-3 w-3" />
                    {host.location}
                  </div>

                  <p className="mt-3 text-sm text-muted-foreground line-clamp-2">{host.bio}</p>

                  <div className="mt-4 flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4 text-primary" />
                      <span className="font-medium">{hostedEvents}</span>
                      <span className="text-muted-foreground">events</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-primary" />
                      <span className="font-medium">{host.reviewCount}</span>
                      <span className="text-muted-foreground">reviews</span>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap justify-center gap-1">
                    {host.interests.slice(0, 3).map((interest) => (
                      <Badge key={interest} variant="secondary" className="text-xs">
                        {interest}
                      </Badge>
                    ))}
                  </div>
                </HoverEffectCard>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
