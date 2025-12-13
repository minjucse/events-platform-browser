"use client";

import { GlowCard } from "@/components/glow-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import type { Event } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";
import { favouriteEventsApi } from "@/lib/favouriteEventsApi";
import { Calendar, Clock, DollarSign, MapPin, Users, Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { toast } from "sonner";

interface EventCardProps {
  event: Event;
  className?: string;
}

const getCategoryColor = (category: string) => {
  const colors: Record<string, string> = {
    Technology: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    Education: "bg-green-500/10 text-green-500 border-green-500/20",
    Sports: "bg-orange-500/10 text-orange-500 border-orange-500/20",
    Music: "bg-purple-500/10 text-purple-500 border-purple-500/20",
    Art: "bg-pink-500/10 text-pink-500 border-pink-500/20",
    Food: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  };
  return colors[category] || "bg-gray-500/10 text-gray-500 border-gray-500/20";
};

export function EventCard({ event, className }: EventCardProps) {
  const { user } = useAuth();
  const [isFavourite, setIsFavourite] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const spotsLeft = event.maxParticipants - event.currentParticipants;
  const isFull = spotsLeft <= 0;

  useEffect(() => {
    if (user) {
      checkIfFavourite();
    }
  }, [user, event.id]);

  const checkIfFavourite = async () => {
    try {
      const response = await favouriteEventsApi.getMyFavourites();
      if (response.success && response.data) {
        const isFav = response.data.some((fav: any) => fav.eventId === event.id);
        setIsFavourite(isFav);
      }
    } catch (error) {
      console.error("Failed to check favourite status:", error);
    }
  };

  const handleToggleFavourite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      toast.error("Please log in to save events");
      return;
    }

    setIsLoading(true);
    try {
      if (isFavourite) {
        const response = await favouriteEventsApi.removeFromFavourites(event.id);
        if (response.success) {
          setIsFavourite(false);
          toast.success("Removed from favourites");
        }
      } else {
        const response = await favouriteEventsApi.addToFavourites(event.id);
        if (response.success) {
          setIsFavourite(true);
          toast.success("Added to favourites");
        }
      }
    } catch (error) {
      toast.error("Failed to update favourites");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Link href={`/events/${event.id}`}>
      <GlowCard
        className={cn("group overflow-hidden p-0 cursor-pointer", className)}
      >
        <div className="relative aspect-16/10 overflow-hidden">
          <Image
            src={event.eventImage || "/placeholder.svg"}
            alt={event.title || "Event Image"}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-linear-to-t from-background/80 to-transparent" />
          <div className="absolute left-3 top-3">
            <Badge
              className={cn("border", getCategoryColor(event.eventCategory))}
            >
              {event.eventCategory}
            </Badge>
          </div>
          <div className="absolute right-3 top-3 flex items-center gap-2">
            {user && (
              <button
                onClick={handleToggleFavourite}
                disabled={isLoading}
                className="p-2 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background transition-colors disabled:opacity-50"
              >
                <Heart
                  className={`h-4 w-4 transition-colors ${
                    isFavourite ? "fill-red-500 text-red-500" : "text-muted-foreground hover:text-red-500"
                  }`}
                />
              </button>
            )}
            {isFull && (
              <Badge variant="destructive">Full</Badge>
            )}
          </div>
        </div>

        <div className="p-4 space-y-3">
          <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-primary transition-colors">
            {event.title}
          </h3>

          <div className="flex flex-col gap-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 shrink-0" />
              <span>
                {new Date(event.date).toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                })}
              </span>
              <Clock className="h-4 w-4 shrink-0 ml-2" />
              <span>{event.time}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 shrink-0" />
              <span className="line-clamp-1">{event.location}</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-border">
            <div className="flex items-center gap-2">
              <Avatar className="h-7 w-7">
                <AvatarImage
                  src={event?.user?.profilePhoto || "/placeholder.svg"}
                />
                <AvatarFallback>
                  {event?.user?.fullName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm text-muted-foreground">
                {event?.user?.fullName}
              </span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="flex items-center gap-1 text-muted-foreground">
                <Users className="h-4 w-4" />
                <span>
                  {event.currentParticipants}/{event.maxParticipants}
                </span>
              </div>
              {event.joiningFee > 0 ? (
                <div className="flex items-center gap-0.5 font-semibold text-primary">
                  <DollarSign className="h-4 w-4" />
                  <span>{event.joiningFee}</span>
                </div>
              ) : (
                <Badge variant="secondary">Free</Badge>
              )}
            </div>
          </div>
        </div>
      </GlowCard>
    </Link>
  );
}
