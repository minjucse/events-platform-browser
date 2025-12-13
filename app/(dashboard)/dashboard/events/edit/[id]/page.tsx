"use client";

import { GlowCard } from "@/components/glow-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/lib/auth-context";
import { eventApi } from "@/lib/eventApi";
import type { Event } from "@/lib/types";
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  Clock,
  DollarSign,
  ImageIcon,
  MapPin,
  Users,
} from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import type React from "react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const eventCategories = [
  "Technology",
  "Education",
  "Sports",
  "Music",
  "Art",
  "Food",
  "Business",
  "Health",
  "Travel",
  "Gaming",
];

// Helper function to format date for input
const formatDateForInput = (dateString: string) => {
  if (!dateString) return "";

  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";

    // Format as YYYY-MM-DD for input[type="date"]
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  } catch (error) {
    console.error("Error formatting date:", error);
    return "";
  }
};

export default function EditEventPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    eventCategory: "",
    date: "",
    time: "",
    location: "",
    minParticipants: "2",
    maxParticipants: "10",
    joiningFee: "0",
    status: "",
  });

  useEffect(() => {
    fetchEvent();
  }, [params.id]);

  useEffect(() => {
    if (event) {
      console.log("Setting form data from event:", event);

      setFormData({
        title: event.title || "",
        description: event.description || "",
        eventCategory: event.eventCategory || "",
        date: formatDateForInput(event.date),
        time: event.time || "",
        location: event.location || "",
        minParticipants: String(event.minParticipants || 2),
        maxParticipants: String(event.maxParticipants || 10),
        joiningFee: String(event.joiningFee || 0),
        status: event.status || "PENDING",
      });

      setImagePreview(event.eventImage || null);
    }
  }, [event]);

  const fetchEvent = async () => {
    try {
      setIsLoading(true);
      const response = await eventApi.getEventById(params.id as string);
      console.log("API Response:", response);

      if (response.success && response.data) {
        setEvent(response.data);
      } else {
        toast.error("Event not found");
        router.push("/dashboard/my-events");
      }
    } catch (error) {
      console.error("Error fetching event:", error);
      toast.error("Failed to load event");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center">
        <AlertCircle className="h-16 w-16 text-muted-foreground/50 mb-4" />
        <h1 className="text-2xl font-bold">Event not found</h1>
        <p className="text-muted-foreground mt-2">
          This event may have been removed or doesn't exist.
        </p>
        <Button
          className="mt-4"
          onClick={() => router.push("/dashboard/my-events")}
        >
          Back to My Events
        </Button>
      </div>
    );
  }

  if (user?.id !== event.userId && user?.role !== "ADMIN") {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center">
        <AlertCircle className="h-16 w-16 text-muted-foreground/50 mb-4" />
        <h1 className="text-2xl font-bold">Access Denied</h1>
        <p className="text-muted-foreground mt-2">
          You don't have permission to edit this event.
        </p>
        <Button className="mt-4" onClick={() => router.push("/events")}>
          Browse Events
        </Button>
      </div>
    );
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();

      // Add all form fields
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value);
      });

      // Handle image upload
      const fileInput = document.querySelector(
        'input[type="file"]'
      ) as HTMLInputElement;
      if (fileInput?.files?.[0]) {
        formDataToSend.append("eventImage", fileInput.files[0]);
      }

      const response = await eventApi.updateEvent(event.id, formDataToSend);

      if (response.success) {
        toast.success("Event updated successfully!");
        router.push(`/events/${event.id}`);
      } else {
        toast.error(response.message || "Failed to update event");
      }
    } catch (error) {
      console.error("Error updating event:", error);
      toast.error("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-8">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <Button
          variant="ghost"
          className="mb-6 gap-2"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">
            Edit <span className="gradient-text">Event</span>
          </h1>
          <p className="mt-2 text-muted-foreground">
            Update your event details
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Event Image */}
          <GlowCard>
            <Label className="text-base font-semibold">Event Image</Label>
            <p className="text-sm text-muted-foreground mb-4">
              Update your event's banner image
            </p>
            <div className="relative">
              {imagePreview ? (
                <div className="relative aspect-[16/9] overflow-hidden rounded-xl">
                  <Image
                    src={imagePreview}
                    alt="Event preview"
                    fill
                    className="object-cover"
                    priority
                  />
                  <label className="cursor-pointer">
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      className="absolute bottom-4 right-4"
                      asChild
                    >
                      <span>Change Image</span>
                    </Button>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                  </label>
                </div>
              ) : (
                <label className="flex aspect-[16/9] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-muted/50 hover:bg-muted transition-colors">
                  <ImageIcon className="h-12 w-12 text-muted-foreground/50 mb-3" />
                  <span className="text-sm font-medium">
                    Click to upload image
                  </span>
                  <span className="text-xs text-muted-foreground mt-1">
                    PNG, JPG up to 10MB
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </label>
              )}
            </div>
          </GlowCard>

          {/* Basic Info */}
          <GlowCard>
            <Label className="text-base font-semibold">Basic Information</Label>
            <div className="mt-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Event Title *</Label>
                <Input
                  id="title"
                  placeholder="Give your event a catchy title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your event..."
                  className="min-h-[150px]"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="eventCategory">Category *</Label>
                <Select
                  value={formData.eventCategory}
                  onValueChange={(value) =>
                    setFormData({ ...formData, eventCategory: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {eventCategories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {user?.role === "ADMIN" && (
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) =>
                      setFormData({ ...formData, status: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PENDING">Pending</SelectItem>
                      <SelectItem value="OPEN">Open</SelectItem>
                      <SelectItem value="UPCOMING">Upcoming</SelectItem>
                      <SelectItem value="ONGOING">Ongoing</SelectItem>
                      <SelectItem value="COMPLETED">Completed</SelectItem>
                      <SelectItem value="CANCELLED">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </GlowCard>

          {/* Date & Time */}
          <GlowCard>
            <Label className="text-base font-semibold">Date & Time</Label>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="date">Date *</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="date"
                    type="date"
                    className="pl-10"
                    value={formData.date}
                    onChange={(e) =>
                      setFormData({ ...formData, date: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="time">Time *</Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="time"
                    placeholder="e.g., 7:00 PM"
                    className="pl-10"
                    value={formData.time}
                    onChange={(e) =>
                      setFormData({ ...formData, time: e.target.value })
                    }
                    required
                  />
                </div>
              </div>
            </div>
          </GlowCard>

          <GlowCard>
            <Label className="text-base font-semibold">Location</Label>
            <div className="mt-4 space-y-2">
              <Label htmlFor="location">Venue *</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="location"
                  placeholder="Enter venue name or address"
                  className="pl-10"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  required
                />
              </div>
            </div>
          </GlowCard>

          <GlowCard>
            <Label className="text-base font-semibold">
              Participants & Pricing
            </Label>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="minParticipants">Min Participants *</Label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="minParticipants"
                    type="number"
                    min="1"
                    className="pl-10"
                    value={formData.minParticipants}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        minParticipants: e.target.value,
                      })
                    }
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxParticipants">Max Participants *</Label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="maxParticipants"
                    type="number"
                    min="1"
                    className="pl-10"
                    value={formData.maxParticipants}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        maxParticipants: e.target.value,
                      })
                    }
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="joiningFee">Joining Fee ($)</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="joiningFee"
                    type="number"
                    min="0"
                    step="0.01"
                    className="pl-10"
                    value={formData.joiningFee}
                    onChange={(e) =>
                      setFormData({ ...formData, joiningFee: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>
          </GlowCard>

          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1 bg-transparent"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={isSubmitting}>
              {isSubmitting ? "Updating..." : "Update Event"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
