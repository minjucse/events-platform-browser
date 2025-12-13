"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { reviewApi } from "@/lib/reviewApi";
import { Star } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface ReviewFormProps {
  eventId: string;
  hostName: string;
  onSubmit?: () => void;
  trigger?: React.ReactNode;
}

export function ReviewForm({
  eventId,
  hostName,
  onSubmit,
  trigger,
}: ReviewFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    if (comment.trim().length < 10) {
      toast.error("Please write a review with at least 10 characters");
      return;
    }

    setIsSubmitting(true);
    try {
      // const { reviewApi } = await import("@/lib/reviewApi");
      const response = await reviewApi.createReview({
        eventId,
        rating,
        comment: comment.trim(),
      });

      if (response.success) {
        setIsOpen(false);
        setRating(0);
        setComment("");
        toast.success("Review submitted successfully!");
        onSubmit?.();
      } else {
        toast.error(response.message || "Failed to submit review");
      }
    } catch (error) {
      toast.error("Network error. Please try again.");
    }
    setIsSubmitting(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" className="gap-2 bg-transparent">
            <Star className="h-4 w-4" />
            Write Review
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Review {hostName}</DialogTitle>
          <DialogDescription>
            Share your experience with this host to help others
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Rating Stars */}
          <div className="space-y-2">
            <Label>Rating</Label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className="p-1 transition-transform hover:scale-110"
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                >
                  <Star
                    className={`h-8 w-8 transition-colors ${
                      star <= (hoverRating || rating)
                        ? "fill-primary text-primary"
                        : "text-muted-foreground"
                    }`}
                  />
                </button>
              ))}
            </div>
            {rating > 0 && (
              <p className="text-sm text-muted-foreground">
                {rating === 1 && "Poor"}
                {rating === 2 && "Fair"}
                {rating === 3 && "Good"}
                {rating === 4 && "Very Good"}
                {rating === 5 && "Excellent"}
              </p>
            )}
          </div>

          {/* Comment */}
          <div className="space-y-2">
            <Label htmlFor="comment">Your Review</Label>
            <Textarea
              id="comment"
              placeholder="Share your experience with this host. What did you enjoy? Would you recommend them to others?"
              className="min-h-[120px]"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              {comment.length}/500 characters (minimum 10)
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Review"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
