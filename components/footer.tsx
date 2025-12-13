import Link from "next/link"
import {  Mail, MapPin, Phone, CalendarCheck } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
           <Link href="/" className="flex items-center gap-2 mr-8 flex-shrink-0">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 text-white shadow-lg shadow-cyan-400/50">
              <CalendarCheck className="h-5 w-5" />
            </div>
            <span className="hidden font-bold sm:inline-block text-lg bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-300 bg-clip-text text-transparent">
              EventMate
            </span>
          </Link>
            <p className="text-sm text-muted-foreground">
              Connecting people through shared experiences. Find your tribe, join the fun.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-sm font-semibold">Quick Links</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/events" className="hover:text-foreground transition-colors">
                  Explore Events
                </Link>
              </li>
              <li>
                <Link href="/register?role=host" className="hover:text-foreground transition-colors">
                  Become a Host
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-foreground transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/help" className="hover:text-foreground transition-colors">
                  Help Center
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="mb-4 text-sm font-semibold">Categories</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/events?category=sports" className="hover:text-foreground transition-colors">
                  Sports
                </Link>
              </li>
              <li>
                <Link href="/events?category=music" className="hover:text-foreground transition-colors">
                  Music
                </Link>
              </li>
              <li>
                <Link href="/events?category=tech" className="hover:text-foreground transition-colors">
                  Tech
                </Link>
              </li>
              <li>
                <Link href="/events?category=food" className="hover:text-foreground transition-colors">
                  Food & Dining
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-4 text-sm font-semibold">Contact</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                info@eventmate.com
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                +1 (555) 123-5476
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                San Francisco, CA
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-border pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} EventMate. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
