"use client";

import { GlowCard } from "@/components/glow-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { eventApi } from "@/lib/eventApi";
import { reportsApi } from "@/lib/reportsApi";
import type { Event, User } from "@/lib/types";
import { userApi } from "@/lib/userApi";
import {
  AlertTriangle,
  ArrowRight,
  Calendar,
  DollarSign,
  Shield,
  TrendingUp,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export function AdminDashboard() {
  const [dashboardStats, setDashboardStats] = useState({
    totalUsers: 0,
    totalHosts: 0,
    totalEvents: 0,
    totalRevenue: 0,
  });
  const [recentUsers, setRecentUsers] = useState<User[]>([]);
  const [recentEvents, setRecentEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsResponse, usersResponse, eventsResponse] = await Promise.all([
        reportsApi.getAdminDashboardStats(),
        userApi.getAllUsers({ page: 1, limit: 6 }),
        eventApi.getAllEvents({ page: 1, limit: 6 }),
      ]);

      if (statsResponse.success) {
        setDashboardStats(statsResponse.data);
      }

      if (usersResponse.success) {
        setRecentUsers(usersResponse.data || []);
      }

      if (eventsResponse.success) {
        setRecentEvents(eventsResponse.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const stats = [
    {
      label: "Total Users",
      value: dashboardStats.totalUsers,
      icon: Users,
      change: "+12%",
      color: "text-blue-500",
    },
    {
      label: "Total Hosts",
      value: dashboardStats.totalHosts,
      icon: Shield,
      change: "+8%",
      color: "text-green-500",
    },
    {
      label: "Total Events",
      value: dashboardStats.totalEvents,
      icon: Calendar,
      change: "+24%",
      color: "text-purple-500",
    },
    {
      label: "Platform Revenue",
      value: `$${dashboardStats.totalRevenue}`,
      icon: DollarSign,
      change: "+18%",
      color: "text-amber-500",
    },
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <GlowCard key={i} className="p-5">
              <div className="animate-pulse space-y-3">
                <div className="h-10 w-10 bg-muted rounded-lg" />
                <div className="h-6 w-16 bg-muted rounded" />
                <div className="h-4 w-20 bg-muted rounded" />
              </div>
            </GlowCard>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Admin <span className="gradient-text">Dashboard</span>
        </h1>
        <p className="text-muted-foreground">
          Platform overview and management
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <GlowCard key={stat.label} className="p-5">
            <div className="flex items-center justify-between">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-lg bg-muted`}
              >
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <Badge variant="default" className="text-xs gap-1">
                <TrendingUp className="h-3 w-3" />
                {stat.change}
              </Badge>
            </div>
            <div className="mt-3">
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          </GlowCard>
        ))}
      </div>

      {/* Platform Health */}
      <GlowCard>
        <h2 className="font-semibold text-lg mb-4">Platform Health</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>User Satisfaction</span>
              <span className="font-medium">94%</span>
            </div>
            <Progress value={94} className="h-2" />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Event Completion Rate</span>
              <span className="font-medium">87%</span>
            </div>
            <Progress value={87} className="h-2" />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Host Retention</span>
              <span className="font-medium">91%</span>
            </div>
            <Progress value={91} className="h-2" />
          </div>
        </div>
      </GlowCard>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Users */}
        <GlowCard>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-lg">Recent Users</h2>
            <Link href="/dashboard/users">
              <Button variant="ghost" size="sm" className="gap-1">
                View all <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="space-y-3">
            {recentUsers.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9">
                    <AvatarImage
                      src={user.profilePhoto || "/placeholder.svg"}
                    />
                    <AvatarFallback>
                      {user.fullName?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-sm">{user.fullName}</p>
                    <p className="text-xs text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </div>
                <Badge
                  variant={
                    user.role === "ADMIN"
                      ? "destructive"
                      : user.role === "HOST"
                      ? "default"
                      : "secondary"
                  }
                  className="capitalize"
                >
                  {user.role}
                </Badge>
              </div>
            ))}
          </div>
        </GlowCard>

        {/* Recent Events */}
        <GlowCard>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-lg">Recent Events</h2>
            <Link href="/dashboard/events">
              <Button variant="ghost" size="sm" className="gap-1">
                View all <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="space-y-3">
            {recentEvents.map((event) => (
              <div
                key={event.id}
                className="flex items-center justify-between p-3 gap-3 rounded-lg bg-muted/50"
              >
                <Avatar className="h-9 w-9">
                  <AvatarImage
                    src={event.user?.profilePhoto || "/placeholder.svg"}
                  />
                  <AvatarFallback>
                    {event.user?.fullName?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{event.title}</p>
                  <p className="text-xs text-muted-foreground">
                    by {event.user?.fullName || "Unknown"} ·{" "}
                    {new Date(event.date).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="capitalize">
                    {event.status}
                  </Badge>
                  <Link href={`/events/${event.id}`}>
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </GlowCard>
      </div>

      {/* Quick Actions */}
      <GlowCard>
        <h2 className="font-semibold text-lg mb-4">Quick Actions</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Link href="/dashboard/users">
            <Button
              variant="outline"
              className="w-full justify-start gap-2 h-auto py-4 bg-transparent"
            >
              <Users className="h-5 w-5 text-blue-500" />
              <div className="text-left">
                <p className="font-medium">Manage Users</p>
                <p className="text-xs text-muted-foreground">
                  View and edit users
                </p>
              </div>
            </Button>
          </Link>
          <Link href="/dashboard/hosts">
            <Button
              variant="outline"
              className="w-full justify-start gap-2 h-auto py-4 bg-transparent"
            >
              <Shield className="h-5 w-5 text-green-500" />
              <div className="text-left">
                <p className="font-medium">Manage Hosts</p>
                <p className="text-xs text-muted-foreground">
                  Approve and manage hosts
                </p>
              </div>
            </Button>
          </Link>
          <Link href="/dashboard/events">
            <Button
              variant="outline"
              className="w-full justify-start gap-2 h-auto py-4 bg-transparent"
            >
              <Calendar className="h-5 w-5 text-purple-500" />
              <div className="text-left">
                <p className="font-medium">Manage Events</p>
                <p className="text-xs text-muted-foreground">
                  Review and moderate events
                </p>
              </div>
            </Button>
          </Link>
          <Link href="/dashboard/reviews">
            <Button
              variant="outline"
              className="w-full justify-start gap-2 h-auto py-4 bg-transparent"
            >
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              <div className="text-left">
                <p className="font-medium">Moderate Reviews</p>
                <p className="text-xs text-muted-foreground">
                  Handle reported content
                </p>
              </div>
            </Button>
          </Link>
        </div>
      </GlowCard>
    </div>
  );
}
