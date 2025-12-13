"use client";

import { GlowCard } from "@/components/glow-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useAuth } from "@/lib/auth-context";
import { reviewApi } from "@/lib/reviewApi";
import type { Review } from "@/lib/types";
import {
  CheckCircle,
  Eye,
  Flag,
  MoreVertical,
  Search,
  Star,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export default function ReviewsPage() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [ratingFilter, setRatingFilter] = useState<string>("all");
  const [reviews, setReviews] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ total: 0, page: 1, limit: 10 });

  const isAdmin = user?.role === "ADMIN";
  const isHost = user?.role === "HOST";

  useEffect(() => {
    fetchReviews();
  }, [page, searchQuery, ratingFilter]);

  const fetchReviews = async () => {
    setIsLoading(true);
    try {
      let response;
      
      if (isHost) {
        // For hosts, get their own reviews
        response = await reviewApi.getHostMyReviews();
      } else {
        // For admin and users, get all reviews with filters
        const params = new URLSearchParams({
          page: page.toString(),
          limit: "10",
        });
        
        if (searchQuery) {
          params.append("searchTerm", searchQuery);
        }
        
        if (ratingFilter !== "all") {
          params.append("rating", ratingFilter);
        }

        response = await reviewApi.getAllReviews(params);
      }
      
      if (response.success) {
        let reviewsData = response.data || [];
        
        // Apply client-side filtering for host reviews if needed
        if (isHost && (searchQuery || ratingFilter !== "all")) {
          if (searchQuery) {
            reviewsData = reviewsData.filter((review: any) =>
              review.comment.toLowerCase().includes(searchQuery.toLowerCase()) ||
              review.user?.fullName?.toLowerCase().includes(searchQuery.toLowerCase())
            );
          }
          if (ratingFilter !== "all") {
            reviewsData = reviewsData.filter((review: any) => 
              review.rating === parseInt(ratingFilter)
            );
          }
        }
        
        setReviews(reviewsData);
        setMeta(response.meta || { total: reviewsData.length, page: 1, limit: 10 });
      }
    } catch (error) {
      toast.error("Failed to fetch reviews");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    try {
      const response = await reviewApi.deleteReview(reviewId);
      if (response.success) {
        toast.success("Review deleted successfully");
        fetchReviews();
      } else {
        toast.error(response.message || "Failed to delete review");
      }
    } catch (error) {
      toast.error("Network error. Please try again.");
    }
  };

  const avgRating =
    reviews.length > 0
      ? (
          reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
        ).toFixed(1)
      : "0";

  const ratingDistribution = [5, 4, 3, 2, 1].map((rating) => ({
    rating,
    count: reviews.filter((r) => r.rating === rating).length,
    percentage:
      reviews.length > 0
        ? (reviews.filter((r) => r.rating === rating).length / reviews.length) *
          100
        : 0,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {isAdmin ? "All Reviews" : isHost ? "My Host Reviews" : "My Reviews"}
        </h1>
        <p className="text-muted-foreground">
          {isAdmin
            ? "Moderate and manage platform reviews"
            : isHost
            ? "Reviews you've received as a host"
            : "Reviews you've received and given"}
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <GlowCard className="p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Star className="h-6 w-6 text-primary fill-primary" />
            </div>
            <div>
              <p className="text-3xl font-bold">{avgRating}</p>
              <p className="text-sm text-muted-foreground">Average Rating</p>
            </div>
          </div>
        </GlowCard>
        <GlowCard className="p-5 col-span-1 sm:col-span-1 lg:col-span-3">
          <h3 className="font-medium mb-3">Rating Distribution</h3>
          <div className="space-y-2">
            {ratingDistribution.map(({ rating, count, percentage }) => (
              <div key={rating} className="flex items-center gap-2">
                <div className="flex items-center gap-1 w-12">
                  <span className="text-sm">{rating}</span>
                  <Star className="h-3 w-3 fill-primary text-primary" />
                </div>
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-sm text-muted-foreground w-8">
                  {count}
                </span>
              </div>
            ))}
          </div>
        </GlowCard>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search reviews..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              setPage(1)
            }}
          />
        </div>
        <Select value={ratingFilter} onValueChange={(v) => {
          setRatingFilter(v)
          setPage(1)
        }}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Filter by rating" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Ratings</SelectItem>
            <SelectItem value="5">5 Stars</SelectItem>
            <SelectItem value="4">4 Stars</SelectItem>
            <SelectItem value="3">3 Stars</SelectItem>
            <SelectItem value="2">2 Stars</SelectItem>
            <SelectItem value="1">1 Star</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {isLoading ? (
          <GlowCard className="text-center py-12">
            <p>Loading reviews...</p>
          </GlowCard>
        ) : reviews.length > 0 ? (
          reviews.map((review) => (
            <GlowCard key={review.id}>
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={review.user?.profilePhoto || "/placeholder.svg"}
                    />
                    <AvatarFallback>
                      {review.user?.fullName?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div>
                        <Link
                          href={`/profile/${review.user?.id}`}
                          className="font-medium hover:text-primary"
                        >
                          {review.user?.fullName || 'Unknown User'}
                        </Link>
                        <span className="text-sm text-muted-foreground">
                          {" "}
                          {new Date(review.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < review.rating
                                  ? "fill-primary text-primary"
                                  : "text-muted"
                              }`}
                            />
                          ))}
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link
                                href={`/profile/${review.user?.id}`}
                                className="flex items-center gap-2"
                              >
                                <Eye className="h-4 w-4" />
                                View Reviewer
                              </Link>
                            </DropdownMenuItem>
                            {isAdmin && (
                              <>
                                <DropdownMenuItem className="flex items-center gap-2">
                                  <CheckCircle className="h-4 w-4" />
                                  Mark as Verified
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="text-destructive focus:text-destructive flex items-center gap-2"
                                  onClick={() => handleDeleteReview(review.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                  Remove Review
                                </DropdownMenuItem>
                              </>
                            )}
                            <DropdownMenuItem
                              className="flex items-center gap-2"
                              onClick={() => toast.success("Review reported")}
                            >
                              <Flag className="h-4 w-4" />
                              Report
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                    <p className="mt-2 text-muted-foreground">
                      {review.comment}
                    </p>
                    <p className="mt-2 text-xs text-muted-foreground">
                      {new Date(review.createdAt).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              </GlowCard>
            ))
        ) : (
          <GlowCard className="text-center py-12">
            <Star className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
            <h3 className="font-semibold">No reviews found</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {searchQuery || ratingFilter !== "all"
                ? "Try adjusting your filters"
                : "No reviews to display yet"}
            </p>
          </GlowCard>
        )}
      </div>

      {/* Pagination */}
      {meta.total > meta.limit && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setPage(p => Math.max(1, p - 1))}
                className={page === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
            {Array.from({ length: Math.ceil(meta.total / meta.limit) }, (_, i) => i + 1).map(p => (
              <PaginationItem key={p}>
                <PaginationLink
                  onClick={() => setPage(p)}
                  isActive={page === p}
                  className="cursor-pointer"
                >
                  {p}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                onClick={() => setPage(p => Math.min(Math.ceil(meta.total / meta.limit), p + 1))}
                className={page === Math.ceil(meta.total / meta.limit) ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
