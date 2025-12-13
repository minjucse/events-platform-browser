import type React from "react"
import Link from "next/link"
import { CalendarCheck } from "lucide-react"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary via-primary/90 to-accent relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute -right-40 -top-40 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -left-20 top-1/2 h-60 w-60 rounded-full bg-white/5 blur-3xl" />
          <div className="absolute bottom-0 right-1/4 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
        </div>
        <div className="relative flex flex-col justify-between p-12 text-white">
          <Link href="/" className="flex items-center gap-2 mr-8 flex-shrink-0">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 text-white shadow-lg shadow-cyan-400/50">
              <CalendarCheck className="h-5 w-5" />
            </div>
            <span className="hidden font-bold sm:inline-block text-lg bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-300 bg-clip-text text-transparent">
              EventMate
            </span>
          </Link>

          <div className="space-y-6">
            <h1 className="text-4xl font-bold leading-tight text-balance">
              Find Your Tribe,
              <br />
              Join the Fun
            </h1>
            <p className="text-lg text-white/80 max-w-md leading-relaxed">
              Connect with like-minded people through local events, sports, hobbies, and activities. Never miss out on
              experiences because you lack companions.
            </p>
            <div className="flex gap-8 pt-4">
              <div>
                <div className="text-3xl font-bold">500+</div>
                <div className="text-sm text-white/70">Active Events</div>
              </div>
              <div>
                <div className="text-3xl font-bold">10K+</div>
                <div className="text-sm text-white/70">Members</div>
              </div>
              <div>
                <div className="text-3xl font-bold">4.9</div>
                <div className="text-sm text-white/70">Avg Rating</div>
              </div>
            </div>
          </div>

          <p className="text-sm text-white/60">&copy; {new Date().getFullYear()} EventMate. All rights reserved.</p>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  )
}
