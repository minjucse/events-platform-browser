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
import { favouriteEventsApi } from "@/lib/favouriteEventsApi";
import { Heart, Search } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function SavedEventsPage() {
  const { user } = useAuth();
  const [favouriteEvents, setFavouriteEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ total: 0, page: 1, limit: 10 });

  useEffect(() => {
    if (user) {
      fetchFavouriteEvents();
    }
  }, [user, page, searchQuery]);

  const fetchFavouriteEvents = async () => {
    setIsLoading(true);
    try {
      const response = await favouriteEventsApi.getMyFavourites();
      if (response.success) {
        // Filter by search query if provided
        let events = response.data || [];
        if (searchQuery) {
          events = events.filter((fav: any) =>
            fav.event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            fav.event.description.toLowerCase().includes(searchQuery.toLowerCase())
          );
        }
        setFavouriteEvents(events);
        setMeta(response.meta || { total: events.length, page: 1, limit: 12 });
      }
    } catch (error) {
      toast.error("Failed to fetch favourite events");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Saved <span className="gradient-text">Events</span>
        </h1>
        <p className="text-muted-foreground">
          Your favourite events collection
        </p>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search saved events..."
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
        <div className="text-center py-8">Loading saved events...</div>
      ) : favouriteEvents.length === 0 ? (
        <GlowCard className="text-center py-12">
          <Heart className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
          <h3 className="font-semibold">No saved events</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Save events you're interested in to see them here
          </p>
          <Link href="/events">
            <Button className="mt-4">Browse Events</Button>
          </Link>
        </GlowCard>
      ) : (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {favouriteEvents.map((favourite) => (
              <EventCard key={favourite.id} event={favourite.event} />
            ))}
          </div>

          {/* Pagination */}
          {meta.total > 12 && (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setPage(Math.max(1, page - 1))}
                    className={page === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
                {Array.from({ length: Math.ceil(meta.total / 12) }).map((_, i) => (
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
                    onClick={() => setPage(Math.min(Math.ceil(meta.total / 12), page + 1))}
                    className={page === Math.ceil(meta.total / 12) ? "pointer-events-none opacity-50" : "cursor-pointer"}
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