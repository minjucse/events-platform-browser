"use client";

import { EventCard } from "@/components/event-card";
import { GlowCard } from "@/components/glow-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/lib/auth-context";
import { eventApi } from "@/lib/eventApi";
import { reportsApi } from "@/lib/reportsApi";
import { ArrowRight, Calendar, CalendarCheck, Star } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function UserDashboard() {
  const { user } = useAuth();
  const [userStats, setUserStats] = useState<any>(null);
  const [upcomingEvents, setUpcomingEvents] = useState<any[]>([]);
  const [recommendedEvents, setRecommendedEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    try {
      const [statsResponse, upcomingResponse, allEventsResponse] =
        await Promise.all([
          reportsApi.getUserStats(),
          eventApi.getMyPerticipatedEvents(),
          eventApi.getAllEvents({ limit: 6 }),
        ]);

      if (statsResponse.success) {
        setUserStats(statsResponse.data);
      }

      if (upcomingResponse.success) {
        const upcoming =
          upcomingResponse.data?.filter(
            (event: any) => new Date(event.date) > new Date()
          ) || [];
        setUpcomingEvents(upcoming.slice(0, 3));
      }

      if (allEventsResponse.success) {
        setRecommendedEvents(allEventsResponse.data?.slice(0, 3) || []);
      }
    } catch (error) {
      toast.error("Failed to load dashboard data");
    } finally {
      setIsLoading(false);
    }
  };

  const stats = userStats
    ? [
        {
          label: "Events Joined",
          value: userStats.totalEventsParticipants || 0,
          icon: CalendarCheck,
          change: `${userStats.monthlyEventsParticipants || 0} this month`,
        },
        {
          label: "Reviews Given",
          value: userStats.totalReviewsGiven || 0,
          icon: Star,
          change: `${userStats.averageRatingGiven || 0} avg rating`,
        },
        {
          label: " Averege Reviews Given",
          value: userStats.averageRatingGiven || 0,
          icon: Star,
          change: `${userStats.averageRatingGiven || 0} avg rating`,
        },
        {
          label: "Monthly Events Participation",
          value: userStats.monthlyEventsParticipants || 0,
          icon: Calendar,
          change: `${userStats.averageRatingGiven || 0} avg rating`,
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
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome back,{" "}
          <span className="gradient-text">{user?.fullName?.split(" ")[0]}</span>
        </h1>
        <p className="text-muted-foreground">
          Here's what's happening with your events
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <GlowCard key={stat.label} className="p-5">
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <stat.icon className="h-5 w-5 text-primary" />
              </div>
              <Badge variant="secondary" className="text-xs">
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

      {/* Activity Progress */}
      {userStats && (
        <GlowCard>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div>
              <h2 className="font-semibold text-lg">Monthly Activity</h2>
              <p className="text-sm text-muted-foreground">
                Your participation this month
              </p>
            </div>
            <Badge variant="outline" className="w-fit">
              {userStats.monthlyEventsParticipants || 0} events
            </Badge>
          </div>
          <Progress
            value={Math.min(
              (userStats.monthlyEventsParticipants || 0) * 10,
              100
            )}
            className="h-2"
          />
          <p className="text-xs text-muted-foreground mt-2">
            {userStats.monthlyEventsParticipants || 0} events participated this
            month
          </p>
        </GlowCard>
      )}

      {/* Upcoming Events */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Upcoming Events</h2>
          <Link href="/dashboard/upcoming">
            <Button variant="ghost" className="gap-1">
              View all <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
        {upcomingEvents.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {upcomingEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <GlowCard className="text-center py-12">
            <Calendar className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
            <h3 className="font-semibold">No upcoming events</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Join an event to see it here
            </p>
            <Link href="/events">
              <Button className="mt-4">Browse Events</Button>
            </Link>
          </GlowCard>
        )}
      </div>

      {/* Recommended Events */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Recommended for You</h2>
          <Link href="/events">
            <Button variant="ghost" className="gap-1">
              Explore <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {recommendedEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </div>
    </div>
  );
}
