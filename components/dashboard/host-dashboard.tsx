"use client";

import { GlowCard } from "@/components/glow-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { eventApi } from "@/lib/eventApi";
import { reportsApi } from "@/lib/reportsApi";
import { reviewApi } from "@/lib/reviewApi";
import {
  ArrowRight,
  Calendar,
  DollarSign,
  Eye,
  Plus,
  Star,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function HostDashboard() {
  const { user } = useAuth();
  const [hostStats, setHostStats] = useState<any>(null);
  const [upcomingEvents, setUpcomingEvents] = useState<any[]>([]);
  const [recentReviews, setRecentReviews] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchHostData();
    }
  }, [user]);

  const fetchHostData = async () => {
    try {
      const [statsResponse, eventsResponse, reviewsResponse] =
        await Promise.all([
          reportsApi.getHostStats(),
          eventApi.getUpcomingEvents(),
          reviewApi.getHostMyReviews(),
        ]);

      if (statsResponse.success) {
        setHostStats(statsResponse.data);
      }

      if (eventsResponse.success) {
        setUpcomingEvents(eventsResponse.data || []);
      }

      if (reviewsResponse.success) {
        setRecentReviews(reviewsResponse.data || []);
      }
    } catch (error) {
      toast.error("Failed to load dashboard data");
    } finally {
      setIsLoading(false);
    }
  };

  const stats = hostStats
    ? [
        {
          label: "Total Events",
          value: hostStats.totalEventsHosted || 0,
          icon: Calendar,
          change: `${hostStats.monthlyEventsHosted || 0} this month`,
          trend: "up",
        },
        {
          label: "Total Revenue",
          value: `$${hostStats.totalRevenue || 0}`,
          icon: DollarSign,
          change: "Total earned",
          trend: "up",
        },
        {
          label: "Avg Rating",
          value: hostStats.averageRating
            ? hostStats.averageRating.toFixed(1)
            : "0.0",
          icon: Star,
          change: `${recentReviews.length} reviews`,
          trend: "neutral",
        },
        {
          label: "Monthly Events",
          value: hostStats.monthlyEventsHosted || 0,
          icon: Calendar,
          change: `${hostStats.monthlyEventsHosted || 0} this month`,
          trend: "up",
        },
      ]
    : [];

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center">
        <div className="text-center">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Host <span className="gradient-text">Dashboard</span>
          </h1>
          <p className="text-muted-foreground">
            Manage your events and track performance
          </p>
        </div>
        <GlowCard className="px-3 py-2">
          <Link href="/dashboard/events/create">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Create Event
            </Button>
          </Link>
        </GlowCard>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <GlowCard key={stat.label} className="p-5">
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <stat.icon className="h-5 w-5 text-primary" />
              </div>
              <Badge
                variant={stat.trend === "up" ? "default" : "secondary"}
                className="text-xs gap-1"
              >
                {stat.trend === "up" && <TrendingUp className="h-3 w-3" />}
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

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Upcoming Events */}
        <GlowCard>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-lg">Upcoming Events</h2>
            <Link href="/dashboard/my-events">
              <Button variant="ghost" size="sm" className="gap-1">
                View all <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="space-y-3">
            {upcomingEvents.length > 0 ? (
              upcomingEvents.slice(0, 4).map((event) => (
                <div
                  key={event.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{event.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(event.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}{" "}
                      at {event.time}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="outline">
                      {event.currentParticipants}/{event.maxParticipants}
                    </Badge>
                    <Link href={`/events/${event.id}`}>
                      <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Calendar className="h-10 w-10 text-muted-foreground/50 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  No upcoming events
                </p>
              </div>
            )}
          </div>
        </GlowCard>

        {/* Recent Reviews */}
        <GlowCard>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-lg">Recent Reviews</h2>
            <Link href="/dashboard/reviews">
              <Button variant="ghost" size="sm" className="gap-1">
                View all <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="space-y-3">
            {recentReviews.length > 0 ? (
              recentReviews.slice(0, 3).map((review) => (
                <div
                  key={review.id}
                  className="flex gap-3 p-3 rounded-lg bg-muted/50"
                >
                  <Avatar className="h-9 w-9">
                    <AvatarImage
                      src={review.user?.profilePhoto || "/placeholder.svg"}
                    />
                    <AvatarFallback>
                      {review.user?.fullName?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-sm">
                        {review.user?.fullName || "Anonymous"}
                      </p>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-primary text-primary" />
                        <span className="text-sm">{review.rating}</span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {review.comment}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Star className="h-10 w-10 text-muted-foreground/50 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No reviews yet</p>
              </div>
            )}
          </div>
        </GlowCard>
      </div>
    </div>
  );
}
