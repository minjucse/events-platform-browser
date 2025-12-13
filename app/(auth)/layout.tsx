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
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute -right-40 -top-40 h-80 w-80 rounded-full bg-blue-500/20 blur-3xl" />
          <div className="absolute -left-20 top-1/2 h-60 w-60 rounded-full bg-purple-500/20 blur-3xl" />
          <div className="absolute bottom-0 right-1/4 h-40 w-40 rounded-full bg-cyan-500/10 blur-3xl" />
        </div>
        <div className="relative flex flex-col justify-between p-12 text-white">
          <Link href="/" className="flex items-center gap-3 mr-8 flex-shrink-0">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 text-white shadow-lg shadow-cyan-400/50">
              <CalendarCheck className="h-5 w-5" />
            </div>
            <span className="hidden font-bold sm:inline-block text-xl bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-300 bg-clip-text text-transparent">
              EventMate
            </span>
          </Link>

          <div className="space-y-8">
            <div>
              <h1 className="text-5xl font-bold leading-tight text-balance mb-4">
                <span className="text-white">Find Your</span>
                <br />
                <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  Crew Today
                </span>
              </h1>
              <p className="text-lg text-slate-300 max-w-md leading-relaxed">
               Connect with like-minded people through local events, sports, hobbies, and activities.
                Don’t miss out on unforgettable experiences—find companions and make every moment count.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-6 pt-4">
              <div>
                <div className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  500+
                </div>
                <div className="text-sm text-slate-400 mt-1">Active Events</div>
              </div>
              <div>
                <div className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  10K+
                </div>
                <div className="text-sm text-slate-400 mt-1">Members</div>
              </div>
              <div>
                <div className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  4.9
                </div>
                <div className="text-sm text-slate-400 mt-1">Avg Rating</div>
              </div>
            </div>
          </div>

          <p className="text-sm text-slate-500">&copy; {new Date().getFullYear()} EventMate. All rights reserved.</p>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gradient-to-br from-white to-slate-50">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  )
}