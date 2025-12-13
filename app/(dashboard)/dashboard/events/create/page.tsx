"use client";

import type React from "react";

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
import {
  ArrowLeft,
  Calendar,
  Clock,
  DollarSign,
  ImageIcon,
  MapPin,
  Users,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const eventCategories = [
  "Technology",
  "Education",
  "Sports",
  "Photography",
  "Programming",
  "Music",
  "Art",
  "Food",
  "Business",
  "Health",
  "Travel",
  "Gaming",
];

export default function CreateEventPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [eventImageFile, setEventImageFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    eventCategory: "",
    eventImage: "",
    date: "",
    time: "",
    location: "",
    minParticipants: "2",
    maxParticipants: "10",
    joiningFee: "0",
  });

  // Redirect if not a host
  if (user && user.role === "USER") {
    router.push("/register?role=HOST");
    return null;
  }

  // const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files?.[0];
  //   if (file) {
  //     const reader = new FileReader();
  //     reader.onloadend = () => {
  //       setImagePreview(reader.result as string);
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setEventImageFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();

  //   if (!user) {
  //     toast.error("Please log in to create events");
  //     router.push("/login");
  //     return;
  //   }

  //   setIsSubmitting(true);
  //   try {
  //     const formDataToSend = new FormData();
  //     Object.entries(formData).forEach(([key, value]) => {
  //       formDataToSend.append(key, value);
  //     });

  //     const fileInput = document.querySelector(
  //       'input[type="file"]'
  //     ) as HTMLInputElement;
  //     if (fileInput?.files?.[0]) {
  //       formDataToSend.append("eventImage", fileInput.files[0]);
  //     }

  //     const response = await eventApi.createEvent(formDataToSend);

  //     if (response.success) {
  //       toast.success("Event created successfully!");
  //       router.push("/dashboard/my-events");
  //     } else {
  //       toast.error(response.message || "Failed to create event");
  //     }
  //   } catch (error) {
  //     toast.error("Network error. Please try again.");
  //   }
  //   setIsSubmitting(false);
  // };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error("Please log in to create events");
      router.push("/login");
      return;
    }

    if (!eventImageFile) {
      toast.error("Event image is required");
      return;
    }

    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();

      // Append normal fields
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value);
      });

      // Append image
      formDataToSend.append("eventImage", eventImageFile);

      const response = await eventApi.createEvent(formDataToSend);

      if (response.success) {
        toast.success("Event created successfully!");
        router.push("/dashboard/my-events");
      } else {
        toast.error(response.message || "Failed to create event");
      }
    } catch (error) {
      toast.error("Network error. Please try again.");
    }

    setIsSubmitting(false);
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
            Create New <span className="gradient-text">Event</span>
          </h1>
          <p className="mt-2 text-muted-foreground">
            Fill in the details to create your event and connect with
            participants
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Event Image */}
          <GlowCard>
            <Label className="text-base font-semibold">Event Image</Label>
            <p className="text-sm text-muted-foreground mb-4">
              Add a compelling image that represents your event
            </p>
            <div className="relative">
              {imagePreview ? (
                <div className="relative aspect-[16/9] overflow-hidden rounded-xl">
                  <Image
                    src={imagePreview || "/placeholder.svg"}
                    alt="Event preview"
                    fill
                    className="object-cover"
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    className="absolute bottom-4 right-4"
                    onClick={() => setImagePreview(null)}
                  >
                    Change Image
                  </Button>
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
                  placeholder="Describe your event, what to expect, what to bring..."
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
                  required
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

          {/* Location */}
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

          {/* Participants & Price */}
          <GlowCard>
            <Label className="text-base font-semibold">
              Participants & Pricing
            </Label>
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="minParticipants">Min Participants</Label>
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
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxParticipants">Max Participants</Label>
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
                <p className="text-xs text-muted-foreground">
                  Set to 0 for free events
                </p>
              </div>
            </div>
          </GlowCard>

          {/* Submit */}
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
              {isSubmitting ? "Creating Event..." : "Create Event"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
