"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Calendar,
  CalendarCheck,
  Compass,
  LayoutDashboard,
  LogOut,
  Menu,
  Plus,
  Shield,
  User,
  Users,
  X,
  ChevronDown,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";

export function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-cyan-200/20 bg-gradient-to-r from-slate-950 via-blue-950 to-purple-950 backdrop-blur-xl supports-[backdrop-filter]:bg-slate-950/80 shadow-lg shadow-purple-500/10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 mr-8 flex-shrink-0">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 text-white shadow-lg shadow-cyan-400/50">
              <CalendarCheck className="h-5 w-5" />
            </div>
            <span className="hidden font-bold sm:inline-block text-lg bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-300 bg-clip-text text-transparent">
              EventMate
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1 flex-1">
            {/* Explore Events */}
            <Link href="/events">
              <Button
                variant="ghost"
                className={cn(
                  "gap-2 text-gray-300 hover:text-white hover:bg-white/10 transition-all",
                  isActive("/events") && "text-cyan-300 bg-cyan-500/20"
                )}
              >
                <Compass className="h-4 w-4" />
                Explore Events
              </Button>
            </Link>

            {/* My Events - Only for logged-in users */}
            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className={cn(
                      "gap-2 text-gray-300 hover:text-white hover:bg-white/10 transition-all",
                      pathname.includes("/dashboard") && "text-cyan-300 bg-cyan-500/20"
                    )}
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    My Events
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="bg-slate-900 border-cyan-200/20">
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/events/upcoming" className="flex items-center gap-2 cursor-pointer text-gray-300 hover:text-white hover:bg-cyan-500/20">
                      <Calendar className="h-4 w-4" />
                      Upcoming Events
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/events/past" className="flex items-center gap-2 cursor-pointer text-gray-300 hover:text-white hover:bg-cyan-500/20">
                      <Calendar className="h-4 w-4" />
                      Past Events
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/events/saved" className="flex items-center gap-2 cursor-pointer text-gray-300 hover:text-white hover:bg-cyan-500/20">
                      <Calendar className="h-4 w-4" />
                      Saved Events
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* Host Menu - Only for hosts */}
            {user && (user.role === "HOST" || user.role === "ADMIN") && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className={cn(
                      "gap-2 text-gray-300 hover:text-white hover:bg-white/10 transition-all",
                      pathname.includes("/dashboard") && "text-cyan-300 bg-cyan-500/20"
                    )}
                  >
                    <Plus className="h-4 w-4" />
                    Host
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="bg-slate-900 border-cyan-200/20">
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/events/create" className="flex items-center gap-2 cursor-pointer text-gray-300 hover:text-white hover:bg-cyan-500/20">
                      <Plus className="h-4 w-4" />
                      Create Event
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/events" className="flex items-center gap-2 cursor-pointer text-gray-300 hover:text-white hover:bg-cyan-500/20">
                      <LayoutDashboard className="h-4 w-4" />
                      Manage Events
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/participants" className="flex items-center gap-2 cursor-pointer text-gray-300 hover:text-white hover:bg-cyan-500/20">
                      <Users className="h-4 w-4" />
                      Participants
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/revenue" className="flex items-center gap-2 cursor-pointer text-gray-300 hover:text-white hover:bg-cyan-500/20">
                      <Calendar className="h-4 w-4" />
                      Revenue
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* Become a Host - Only for regular users */}
            {user && user.role === "USER" && (
              <Link href="/become-host">
                <Button
                  variant="ghost"
                  className={cn(
                    "gap-2 text-gray-300 hover:text-white hover:bg-white/10 transition-all",
                    isActive("/become-host") && "text-cyan-300 bg-cyan-500/20"
                  )}
                >
                  <Shield className="h-4 w-4" />
                  Become a Host
                </Button>
              </Link>
            )}

            {/* Admin Menu - Only for admins */}
            {user && user.role === "ADMIN" && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className={cn(
                      "gap-2 text-gray-300 hover:text-white hover:bg-white/10 transition-all",
                      pathname.includes("/dashboard") && "text-cyan-300 bg-cyan-500/20"
                    )}
                  >
                    <Shield className="h-4 w-4" />
                    Admin
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="bg-slate-900 border-cyan-200/20">
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/users" className="flex items-center gap-2 cursor-pointer text-gray-300 hover:text-white hover:bg-cyan-500/20">
                      <Users className="h-4 w-4" />
                      Manage Users
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/hosts" className="flex items-center gap-2 cursor-pointer text-gray-300 hover:text-white hover:bg-cyan-500/20">
                      <Shield className="h-4 w-4" />
                      Manage Hosts
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/events" className="flex items-center gap-2 cursor-pointer text-gray-300 hover:text-white hover:bg-cyan-500/20">
                      <Calendar className="h-4 w-4" />
                      Manage Events
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/reports" className="flex items-center gap-2 cursor-pointer text-gray-300 hover:text-white hover:bg-cyan-500/20">
                      <LayoutDashboard className="h-4 w-4" />
                      Reports
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {/* Right Side - Desktop */}
          <div className="hidden lg:flex items-center gap-2 ml-auto">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-9 gap-2 text-gray-300 hover:text-white hover:bg-white/10"
                  >
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-sm font-semibold text-white">
                      {user.fullName?.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm">{user.fullName}</span>
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-slate-900 border-cyan-200/20">
                  <div className="flex items-center gap-2 p-2">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center font-semibold text-white">
                      {user.fullName?.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-white">
                        {user.fullName}
                      </span>
                      <span className="text-xs text-cyan-300/70 capitalize">
                        {user.role}
                      </span>
                    </div>
                  </div>
                  <DropdownMenuSeparator className="bg-cyan-200/20" />
                  <DropdownMenuItem asChild>
                    <Link
                      href="/dashboard/profile"
                      className="flex items-center gap-2 cursor-pointer text-gray-300 hover:text-white hover:bg-cyan-500/20"
                    >
                      <User className="h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      href="/dashboard"
                      className="flex items-center gap-2 cursor-pointer text-gray-300 hover:text-white hover:bg-cyan-500/20"
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-cyan-200/20" />
                  <DropdownMenuItem
                    onClick={logout}
                    className="text-red-400 hover:text-red-300 focus:text-red-300 cursor-pointer hover:bg-red-500/20"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-white/10">Log in</Button>
                </Link>
                <Link href="/register">
                  <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white shadow-lg shadow-cyan-500/50">Get Started</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden border-t border-border py-4 space-y-2">
            <Link href="/events" onClick={() => setIsOpen(false)}>
              <Button
                variant={isActive("/events") ? "secondary" : "ghost"}
                className="w-full justify-start gap-2"
              >
                <Compass className="h-4 w-4" />
                Explore Events
              </Button>
            </Link>

            {user && (
              <>
                <Link href="/dashboard/events/upcoming" onClick={() => setIsOpen(false)}>
                  <Button
                    variant={isActive("/dashboard/events/upcoming") ? "secondary" : "ghost"}
                    className="w-full justify-start gap-2"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    My Events
                  </Button>
                </Link>

                {(user.role === "HOST" || user.role === "ADMIN") && (
                  <Link href="/dashboard/events/create" onClick={() => setIsOpen(false)}>
                    <Button
                      variant={isActive("/dashboard/events/create") ? "secondary" : "ghost"}
                      className="w-full justify-start gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      Create Event
                    </Button>
                  </Link>
                )}

                {user.role === "USER" && (
                  <Link href="/become-host" onClick={() => setIsOpen(false)}>
                    <Button
                      variant={isActive("/become-host") ? "secondary" : "ghost"}
                      className="w-full justify-start gap-2"
                    >
                      <Shield className="h-4 w-4" />
                      Become a Host
                    </Button>
                  </Link>
                )}

                {user.role === "ADMIN" && (
                  <>
                    <Link href="/dashboard/users" onClick={() => setIsOpen(false)}>
                      <Button
                        variant="ghost"
                        className="w-full justify-start gap-2"
                      >
                        <Users className="h-4 w-4" />
                        Manage Users
                      </Button>
                    </Link>
                    <Link href="/dashboard/events" onClick={() => setIsOpen(false)}>
                      <Button
                        variant="ghost"
                        className="w-full justify-start gap-2"
                      >
                        <Calendar className="h-4 w-4" />
                        Manage Events
                      </Button>
                    </Link>
                  </>
                )}

                <Link href="/dashboard/profile" onClick={() => setIsOpen(false)}>
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-2"
                  >
                    <User className="h-4 w-4" />
                    Profile
                  </Button>
                </Link>

                <Button
                  variant="destructive"
                  className="w-full justify-start gap-2"
                  onClick={() => {
                    logout();
                    setIsOpen(false);
                  }}
                >
                  <LogOut className="h-4 w-4" />
                  Log out
                </Button>
              </>
            )}

            {!user && (
              <div className="flex flex-col gap-2 pt-2 border-t border-border">
                <Link href="/login" onClick={() => setIsOpen(false)}>
                  <Button variant="outline" className="w-full">
                    Log in
                  </Button>
                </Link>
                <Link href="/register" onClick={() => setIsOpen(false)}>
                  <Button className="w-full">Get Started</Button>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}