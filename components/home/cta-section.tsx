import Link from "next/link"
import { ArrowRight, UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"

export function CTASection() {
  return (
    <section className="py-20 bg-gradient-to-br from-primary/10 via-accent/5 to-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary to-accent p-8 sm:p-12 lg:p-16">
          {/* Background decoration */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-white/10 blur-3xl" />
          </div>

          <div className="relative mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl text-balance">
              Ready to Find Your Next Adventure?
            </h2>
            <p className="mt-6 text-lg text-white/80 leading-relaxed max-w-xl mx-auto">
              Join thousands of people who have discovered new friends, hobbies, and unforgettable experiences through
              EventHub.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/register">
                <Button size="lg" className="bg-white text-primary hover:bg-white/90 gap-2 h-12 px-8">
                  <UserPlus className="h-5 w-5" />
                  Get Started Free
                </Button>
              </Link>
              <Link href="/register?role=host">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/30 bg-white/10 text-white hover:bg-white/20 gap-2 h-12 px-8"
                >
                  Become a Host
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
