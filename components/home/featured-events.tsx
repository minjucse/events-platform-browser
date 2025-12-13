"use client";

import { EventCard } from "@/components/event-card";
import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import type { Event } from "@/lib/types";

export function FeaturedEvents() {
  const [ongoingEvents, setOngoingEvents] = useState<Event[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    fetchOngoingEvents();
  }, []);

  useEffect(() => {
    if (ongoingEvents.length > 4) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex(prev => (prev + 1) % Math.max(1, ongoingEvents.length - 3));
      }, 3000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [ongoingEvents.length]);

  const fetchOngoingEvents = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/event/ongoing`, {
        credentials: "include",
      });
      const data = await response.json();
      if (data.success) {
        setOngoingEvents(data.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch ongoing events:", error);
    }
  };

  const scrollToIndex = (index: number) => {
    setCurrentIndex(index);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = setInterval(() => {
        setCurrentIndex(prev => (prev + 1) % Math.max(1, ongoingEvents.length - 3));
      }, 3000);
    }
  };

  const nextSlide = () => {
    const maxIndex = Math.max(0, ongoingEvents.length - 4);
    scrollToIndex(currentIndex >= maxIndex ? 0 : currentIndex + 1);
  };

  const prevSlide = () => {
    const maxIndex = Math.max(0, ongoingEvents.length - 4);
    scrollToIndex(currentIndex <= 0 ? maxIndex : currentIndex - 1);
  };

  const visibleEvents = ongoingEvents.slice(currentIndex, currentIndex + 4);
  if (visibleEvents.length < 4 && ongoingEvents.length >= 4) {
    visibleEvents.push(...ongoingEvents.slice(0, 4 - visibleEvents.length));
  }

  return (
    <section className="py-20 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-10">
          <div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              <span className="gradient-text">Ongoing</span> Events
            </h2>
            <p className="mt-2 text-muted-foreground">
              Discover exciting events happening near you
            </p>
          </div>
          <Link href="/events">
            <Button variant="outline" className="gap-2 bg-transparent">
              View All Events
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="relative">
          {ongoingEvents.length > 4 && (
            <>
              <Button
                variant="outline"
                size="icon"
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-background/80 backdrop-blur-sm"
                onClick={prevSlide}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-background/80 backdrop-blur-sm"
                onClick={nextSlide}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </>
          )}
          
          <div 
            ref={scrollRef}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 transition-transform duration-500"
          >
            {(ongoingEvents.length <= 4 ? ongoingEvents : visibleEvents).map((event, index) => (
              <EventCard key={`${event.id}-${index}`} event={event} />
            ))}
          </div>
          
          {ongoingEvents.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No ongoing events available</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
