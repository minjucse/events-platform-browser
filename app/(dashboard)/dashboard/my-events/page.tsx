"use client";

import { EventCard } from "@/components/event-card";
import { GlowCard } from "@/components/glow-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useAuth } from "@/lib/auth-context";
import { eventApi } from "@/lib/eventApi";
import { Calendar, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function MyEventsPage() {
  const { user } = useAuth();
  const [events, setEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ total: 0, page: 1, limit: 10 });

  useEffect(() => {
    if (user) {
      fetchMyEvents();
    }
  }, [user, page, searchQuery]);

  const fetchMyEvents = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "12",
      });

      if (searchQuery) {
        params.append("searchTerm", searchQuery);
      }

      const response = await eventApi.getMyPerticipatedEvents();
      if (response.success) {
        setEvents(response.data || []);
        setMeta(response.meta || { total: 0, page: 1, limit: 12 });
      }
    } catch (error) {
      toast.error("Failed to fetch events");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          My <span className="gradient-text">Events</span>
        </h1>
        <p className="text-muted-foreground">
          Events you have participated in
        </p>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search events..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setPage(1);
          }}
        />
      </div>

      {/* Events Grid */}
      {isLoading ? (
        <div className="text-center py-8">Loading events...</div>
      ) : events.length === 0 ? (
        <GlowCard className="text-center py-12">
          <Calendar className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
          <h3 className="font-semibold">No events found</h3>
          <p className="text-sm text-muted-foreground mt-1">
            You haven't participated in any events yet
          </p>
        </GlowCard>
      ) : (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>

          {/* Pagination */}
          {meta.total > meta.limit && (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setPage(Math.max(1, page - 1))}
                    className={page === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
                {Array.from({ length: Math.ceil(meta.total / meta.limit) }).map((_, i) => (
                  <PaginationItem key={i}>
                    <PaginationLink
                      onClick={() => setPage(i + 1)}
                      isActive={page === i + 1}
                      className="cursor-pointer"
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    onClick={() => setPage(Math.min(Math.ceil(meta.total / meta.limit), page + 1))}
                    className={page === Math.ceil(meta.total / meta.limit) ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </>
      )}
    </div>
  );
}