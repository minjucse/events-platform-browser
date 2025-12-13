// "use client";

// import {
//   endOfDayLocal,
//   getEventStartLocal,
// } from "@/app/utils/eventTimeConverter";
// import { GlowCard } from "@/components/glow-card";
// import { ReviewForm } from "@/components/review-form";
// import { StripePayment } from "@/components/stripe-payment";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { Separator } from "@/components/ui/separator";
// import { useAuth } from "@/lib/auth-context";
// import { eventApi } from "@/lib/eventApi";
// import { paymentApi } from "@/lib/paymentApi";
// import { reviewApi } from "@/lib/reviewApi";
// import type { Event } from "@/lib/types";
// import {
//   AlertCircle,
//   ArrowLeft,
//   Calendar,
//   Check,
//   Clock,
//   Heart,
//   MapPin,
//   Share2,
//   Star,
//   Users,
// } from "lucide-react";
// import Image from "next/image";
// import Link from "next/link";
// import { useParams, useRouter } from "next/navigation";
// import { useEffect, useState } from "react";
// import { toast } from "sonner";

// export default function EventDetailPage() {
//   const params = useParams();
//   const router = useRouter();
//   const { user } = useAuth();
//   const [event, setEvent] = useState<Event | null>(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [isJoinDialogOpen, setIsJoinDialogOpen] = useState(false);
//   const [isJoining, setIsJoining] = useState(false);
//   const [hasJoined, setHasJoined] = useState(false);
//   const [isSaved, setIsSaved] = useState(false);
//   const [paymentData, setPaymentData] = useState<{
//     clientSecret: string;
//     amount: number;
//   } | null>(null);
//   const [hostReviews, setHostReviews] = useState<any[]>([]);

//   useEffect(() => {
//     fetchEvent();
//     fetchHostReviews();
//   }, [params.id]);

//   const fetchHostReviews = async () => {
//     try {
//       const response = await reviewApi.getAllReviews();
//       if (response.success && response.data) {
//         setHostReviews(response.data);
//       }
//     } catch (error) {
//       console.error("Failed to load reviews");
//     }
//   };

//   const fetchEvent = async () => {
//     try {
//       const response = await eventApi.getEventById(params.id as string);
//       if (response.success) {
//         setEvent(response.data);
//       } else {
//         toast.error("Event not found");
//       }
//     } catch (error) {
//       toast.error("Failed to load event");
//     }
//     setIsLoading(false);
//   };

//   if (isLoading) {
//     return (
//       <div className="flex min-h-[60vh] flex-col items-center justify-center">
//         <div className="text-center">Loading...</div>
//       </div>
//     );
//   }

//   if (!event) {
//     return (
//       <div className="flex min-h-[60vh] flex-col items-center justify-center">
//         <AlertCircle className="h-16 w-16 text-muted-foreground/50 mb-4" />
//         <h1 className="text-2xl font-bold">Event not found</h1>
//         <p className="text-muted-foreground mt-2">
//           This event may have been removed or doesn't exist.
//         </p>
//         <Button className="mt-4" onClick={() => router.push("/events")}>
//           Browse Events
//         </Button>
//       </div>
//     );
//   }

//   // const spotsLeft = event.maxParticipants - event.currentParticipants;
//   // const isFull = spotsLeft <= 0;
//   // const eventDate = new Date(event.date);
//   // const isPast = eventDate < new Date();
//   // const hasAttended = false; // Would need participant data from API

//   // --- Replace current date / isPast logic with this ---
//   const spotsLeft = event.maxParticipants - event.currentParticipants;
//   const isFull = spotsLeft <= 0;

//   // Build local eventStart from event.date + event.time (falls back to midnight if time can't be parsed)
//   const eventStartLocal =
//     getEventStartLocal(event.date, event.time) ?? new Date(event.date);
//   // Consider event active until end of that local day (or adapt to use duration)
//   const eventEndLocal = endOfDayLocal(eventStartLocal);

//   const now = new Date();
//   const isPast = eventEndLocal < now;

//   // Helpful display date/time variables
//   const displayDateString = eventStartLocal.toLocaleDateString("en-US", {
//     weekday: "long",
//     month: "long",
//     day: "numeric",
//     year: "numeric",
//   });
//   const displayTimeString =
//     event.time ||
//     eventStartLocal.toLocaleTimeString([], {
//       hour: "numeric",
//       minute: "2-digit",
//     });

//   // Use this if you want to control joinability by status *and* time
//   const canJoinByStatus = ["OPEN", "ONGOING"].includes(event.status);
//   const canJoinByTime = !isPast && !isFull && !hasJoined;

//   const canJoin = canJoinByStatus && canJoinByTime;
//   // --- end replacement ---

//   const handleJoin = async () => {
//     if (!user) {
//       toast.error("Please log in to join events");
//       router.push("/login");
//       return;
//     }

//     setIsJoining(true);
//     try {
//       if (event.joiningFee > 0) {
//         // Create payment for paid events
//         const paymentResponse = await paymentApi.createPayment({
//           eventId: event.id,
//         });
//         if (paymentResponse.success) {
//           setPaymentData({
//             clientSecret: paymentResponse.data.clientSecret,
//             amount: event.joiningFee,
//           });
//           setIsJoinDialogOpen(false);
//         } else {
//           toast.error(paymentResponse.message || "Failed to initiate payment");
//         }
//       } else {
//         // Free event - direct participation
//         const response = await eventApi.participateInEvent(event.id);
//         if (response.success) {
//           setHasJoined(true);
//           setIsJoinDialogOpen(false);
//           toast.success("Successfully joined the event!");
//           fetchEvent(); // Refresh event data
//         } else {
//           toast.error(response.message || "Failed to join event");
//         }
//       }
//     } catch (error) {
//       toast.error("Network error. Please try again.");
//     }
//     setIsJoining(false);
//   };

//   const handleShare = async () => {
//     if (navigator.share) {
//       await navigator.share({
//         title: event.title,
//         text: event.description,
//         url: window.location.href,
//       });
//     } else {
//       await navigator.clipboard.writeText(window.location.href);
//       toast.success("Link copied to clipboard!");
//     }
//   };

//   return (
//     <div className="py-8">
//       <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
//         <Button
//           variant="ghost"
//           className="mb-6 gap-2"
//           onClick={() => router.back()}
//         >
//           <ArrowLeft className="h-4 w-4" />
//           Back to Events
//         </Button>

//         <div className="grid gap-8 lg:grid-cols-3">
//           {/* Main Content */}
//           <div className="lg:col-span-2 space-y-6">
//             <div className="relative aspect-[16/9] overflow-hidden rounded-2xl">
//               <Image
//                 src={event.eventImage || "/placeholder.svg"}
//                 alt={event.title}
//                 fill
//                 className="object-cover"
//                 priority
//               />
//               <div className="absolute left-4 top-4">
//                 <Badge className="bg-primary/90 backdrop-blur-sm">
//                   {event.eventCategory}
//                 </Badge>
//               </div>
//               {event.status !== "OPEN" && (
//                 <div className="absolute right-4 top-4">
//                   <Badge variant="destructive">{event.status}</Badge>
//                 </div>
//               )}
//             </div>

//             <div>
//               <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
//                 {event.title}
//               </h1>
//               <div className="mt-4 flex flex-wrap gap-4 text-muted-foreground">
//                 <div className="flex items-center gap-2">
//                   <Calendar className="h-5 w-5" />
//                   {eventStartLocal.toLocaleDateString("en-US", {
//                     weekday: "long",
//                     month: "long",
//                     day: "numeric",
//                     year: "numeric",
//                   })}
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <Clock className="h-5 w-5" />
//                   {event.time}
//                 </div>
//               </div>
//             </div>

//             <Separator />

//             {/* Description */}
//             <div>
//               <h2 className="text-xl font-semibold mb-3">About this event</h2>
//               <p className="text-muted-foreground leading-relaxed">
//                 {event.description}
//               </p>
//             </div>

//             <Separator />

//             {/* Location */}
//             <div>
//               <h2 className="text-xl font-semibold mb-3">Location</h2>
//               <div className="flex items-start gap-3">
//                 <MapPin className="h-5 w-5 mt-0.5 text-primary" />
//                 <div>
//                   <p className="font-medium">{event.location}</p>
//                   <p className="text-sm text-muted-foreground">
//                     {event.location}
//                   </p>
//                 </div>
//               </div>
//               <div className="mt-4 aspect-[16/9] rounded-xl bg-muted overflow-hidden">
//                 <iframe
//                   width="100%"
//                   height="100%"
//                   style={{ border: 0 }}
//                   loading="lazy"
//                   src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodeURIComponent(
//                     event.location
//                   )}`}
//                 />
//               </div>
//             </div>

//             <Separator />

//             <div>
//               <h2 className="text-xl font-semibold mb-3">
//                 Participants ({event.currentParticipants}/
//                 {event.maxParticipants})
//               </h2>
//               <div className="flex items-center gap-2">
//                 <span className="text-sm text-muted-foreground">
//                   {spotsLeft > 0 ? `${spotsLeft} spots left` : "No spots left"}
//                 </span>
//               </div>
//             </div>

//             <Separator />

//             {/* Host Reviews */}
//             <div>
//               <div className="flex items-center justify-between mb-4">
//                 <h2 className="text-xl font-semibold">Host Reviews</h2>
//                 {hasJoined && (
//                   <ReviewForm
//                     eventId={event.id}
//                     hostId={event.user.id}
//                     hostName={event.user.fullName}
//                   />
//                 )}
//               </div>
//               {hostReviews.length > 0 ? (
//                 <div className="space-y-4">
//                   {hostReviews.map((review) => (
//                     <GlowCard key={review.id} className="p-4">
//                       <div className="flex items-start gap-3">
//                         <Avatar>
//                           <AvatarImage
//                             src={review.user.avatar || "/placeholder.svg"}
//                           />
//                           <AvatarFallback>
//                             {review.user.fullName.charAt(0)}
//                           </AvatarFallback>
//                         </Avatar>
//                         <div className="flex-1">
//                           <div className="flex items-center justify-between">
//                             <span className="font-medium">
//                               {review.user.fullName}
//                             </span>
//                             <div className="flex items-center gap-1">
//                               {Array.from({ length: review.rating }).map(
//                                 (_, i) => (
//                                   <Star
//                                     key={i}
//                                     className="h-4 w-4 fill-primary text-primary"
//                                   />
//                                 )
//                               )}
//                             </div>
//                           </div>
//                           <p className="mt-1 text-sm text-muted-foreground">
//                             {review.comment}
//                           </p>
//                           <p className="mt-2 text-xs text-muted-foreground">
//                             {new Date(review.createdAt).toLocaleDateString()}
//                           </p>
//                         </div>
//                       </div>
//                     </GlowCard>
//                   ))}
//                 </div>
//               ) : (
//                 <GlowCard className="text-center py-8">
//                   <Star className="h-10 w-10 text-muted-foreground/50 mx-auto mb-2" />
//                   <p className="text-muted-foreground">No reviews yet</p>
//                 </GlowCard>
//               )}
//             </div>
//           </div>

//           {/* Sidebar */}
//           <div className="lg:col-span-1">
//             <div className="sticky top-24 space-y-6">
//               {/* Booking Card */}
//               <GlowCard>
//                 <div className="space-y-4">
//                   <div className="flex items-center justify-between">
//                     <div>
//                       {event.joiningFee > 0 ? (
//                         <div className="flex items-baseline gap-1">
//                           <span className="text-3xl font-bold">
//                             ${event.joiningFee}
//                           </span>
//                           <span className="text-muted-foreground">
//                             / person
//                           </span>
//                         </div>
//                       ) : (
//                         <span className="text-3xl font-bold text-primary">
//                           Free
//                         </span>
//                       )}
//                     </div>
//                   </div>

//                   <div className="flex items-center gap-2 text-sm text-muted-foreground">
//                     <Users className="h-4 w-4" />
//                     <span>
//                       {event.currentParticipants} joined · {spotsLeft} spots
//                       left
//                     </span>
//                   </div>

//                   {/* {hasJoined ? (
//                     <Button className="w-full" variant="secondary" disabled>
//                       <Check className="mr-2 h-4 w-4" />
//                       You're In!
//                     </Button>
//                   ) : isPast ? (
//                     <Button className="w-full" disabled>
//                       Event has ended
//                     </Button>
//                   ) : isFull ? (
//                     <Button className="w-full" disabled>
//                       Event is full
//                     </Button>
//                   ) : (
//                     <Button
//                       className="w-full"
//                       onClick={() => setIsJoinDialogOpen(true)}
//                       disabled={event.status !== "ONGOING"}
//                     >
//                       {event.joiningFee > 0
//                         ? `Pay $${event.joiningFee} to Join`
//                         : "Join Event"}
//                     </Button>
//                   )} */}

//                   {hasJoined ? (
//                     <Button className="w-full" variant="secondary" disabled>
//                       <Check className="mr-2 h-4 w-4" />
//                       You're In!
//                     </Button>
//                   ) : isPast ? (
//                     <Button className="w-full" disabled>
//                       Event has ended
//                     </Button>
//                   ) : isFull ? (
//                     <Button className="w-full" disabled>
//                       Event is full
//                     </Button>
//                   ) : (
//                     <Button
//                       className="w-full"
//                       onClick={() => setIsJoinDialogOpen(true)}
//                       disabled={!canJoin} // now considers status + time + full/joined
//                     >
//                       {event.joiningFee > 0
//                         ? `Pay $${event.joiningFee} to Join`
//                         : "Join Event"}
//                     </Button>
//                   )}

//                   <div className="flex gap-2">
//                     <Button
//                       variant="outline"
//                       size="sm"
//                       className="flex-1"
//                       onClick={handleShare}
//                     >
//                       <Share2 className="mr-2 h-4 w-4" />
//                       Share
//                     </Button>
//                     <Button
//                       variant="outline"
//                       size="sm"
//                       onClick={() => setIsSaved(!isSaved)}
//                     >
//                       <Heart
//                         className={`h-4 w-4 ${
//                           isSaved ? "fill-current text-red-500" : ""
//                         }`}
//                       />
//                     </Button>
//                   </div>
//                 </div>
//               </GlowCard>

//               {/* Host Info */}
//               <GlowCard>
//                 <div className="space-y-4">
//                   <h3 className="font-semibold">Hosted by</h3>
//                   <div className="flex items-center gap-3">
//                     <Avatar>
//                       <AvatarImage src={event.user?.profilePhoto} />
//                       <AvatarFallback>
//                         {event.user?.fullName?.charAt(0) || "H"}
//                       </AvatarFallback>
//                     </Avatar>
//                     <div>
//                       <p className="font-medium">
//                         {event.user?.fullName || "Event Host"}
//                       </p>
//                       <p className="text-sm text-muted-foreground">
//                         {event.user?.email}
//                       </p>
//                     </div>
//                   </div>
//                   <Button variant="outline" className="w-full" asChild>
//                     <Link href={`/profile/${event.userId}`}>View Profile</Link>
//                   </Button>
//                 </div>
//               </GlowCard>
//             </div>
//           </div>
//         </div>

//         {/* Join Event Dialog */}
//         <Dialog open={isJoinDialogOpen} onOpenChange={setIsJoinDialogOpen}>
//           <DialogContent>
//             <DialogHeader>
//               <DialogTitle>Join Event</DialogTitle>
//               <DialogDescription>
//                 {event.joiningFee > 0
//                   ? `This event requires a payment of $${event.joiningFee}. You will be redirected to complete the payment.`
//                   : "Are you sure you want to join this event?"}
//               </DialogDescription>
//             </DialogHeader>
//             <DialogFooter>
//               <Button
//                 variant="outline"
//                 onClick={() => setIsJoinDialogOpen(false)}
//               >
//                 Cancel
//               </Button>
//               <Button onClick={handleJoin} disabled={isJoining}>
//                 {isJoining
//                   ? "Processing..."
//                   : event.joiningFee > 0
//                   ? "Proceed to Payment"
//                   : "Join Event"}
//               </Button>
//             </DialogFooter>
//           </DialogContent>
//         </Dialog>

//         {/* Stripe Payment Dialog */}
//         {paymentData && (
//           <Dialog
//             open={!!paymentData}
//             onOpenChange={() => setPaymentData(null)}
//           >
//             <DialogContent className="max-w-md">
//               <StripePayment
//                 clientSecret={paymentData.clientSecret}
//                 amount={paymentData.amount}
//                 eventTitle={event.title}
//                 onSuccess={() => {
//                   setPaymentData(null);
//                   setHasJoined(true);
//                   fetchEvent();
//                 }}
//                 onCancel={() => setPaymentData(null)}
//               />
//             </DialogContent>
//           </Dialog>
//         )}
//       </div>
//     </div>
//   );
// }

"use client";

import {
  endOfDayLocal,
  getEventStartLocal,
} from "@/app/utils/eventTimeConverter";
import { GlowCard } from "@/components/glow-card";
import { ReviewForm } from "@/components/review-form";
import { StripePayment } from "@/components/stripe-payment";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/lib/auth-context";
import { eventApi } from "@/lib/eventApi";
import { favouriteEventsApi } from "@/lib/favouriteEventsApi";
import { paymentApi } from "@/lib/paymentApi";
import { reviewApi } from "@/lib/reviewApi";
import type { Event } from "@/lib/types";
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  Check,
  Clock,
  Heart,
  MapPin,
  Share2,
  Star,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isJoinDialogOpen, setIsJoinDialogOpen] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [hasJoined, setHasJoined] = useState(false);
  const [hasReviewed, setHasReviewed] = useState(false);
  const [isFavourite, setIsFavourite] = useState(false);
  const [paymentData, setPaymentData] = useState<{
    clientSecret: string;
    amount: number;
  } | null>(null);
  const [hostReviews, setHostReviews] = useState<any[]>([]);

  useEffect(() => {
    fetchEvent();
    fetchHostReviews();
  }, [params.id]);

  useEffect(() => {
    if (user && event) {
      checkUserParticipation();
      checkUserReview();
      checkIfFavourite();
    }
  }, [user, event]);

  const fetchHostReviews = async () => {
    if (!params.id) return;
    try {
      const response = await reviewApi.getHostReviewsByEventId(
        params.id as string
      );
      console.log("Reviews API response:", response);
      if (response.success && response.data) {
        console.log("Setting reviews:", response.data);
        setHostReviews(response.data);
      }
    } catch (error) {
      console.error("Failed to load reviews:", error);
    }
  };

  const fetchEvent = async () => {
    try {
      const response = await eventApi.getEventById(params.id as string);
      if (response.success) {
        setEvent(response.data);
      } else {
        toast.error("Event not found");
      }
    } catch (error) {
      toast.error("Failed to load event");
    }
    setIsLoading(false);
  };

  const checkUserParticipation = async () => {
    if (!user || !event) return;

    try {
      const response = await eventApi.checkUserParticipation(event.id);

      // Check if the response indicates participation
      if (response.success) {
        // If API returns the participated event data, user has joined
        setHasJoined(true);
      } else if (response.message === "Not participated") {
        // If API returns 404 or "Not participated" message
        setHasJoined(false);
      }
    } catch (error: any) {
      // Handle 404 specifically - means user hasn't participated
      if (error.status === 404 || error.message?.includes("404")) {
        setHasJoined(false);
      } else {
        console.error("Failed to check user participation:", error);
      }
    }
  };

  const checkUserReview = async () => {
    if (!user || !event || !hasJoined) return;

    try {
      // Create params to filter reviews by event and user
      const params = new URLSearchParams({
        eventId: event.id,
        userId: user.id,
      });

      const response = await reviewApi.getAllReviews(params);
      if (response.success && response.data) {
        // Check if user has any review for this event
        const userReview = response.data.find(
          (review: any) =>
            review.userId === user.id && review.eventId === event.id
        );
        setHasReviewed(!!userReview);
      }
    } catch (error) {
      console.error("Failed to check user review:", error);
    }
  };

  // Helper function to get reviews for current host (no longer needed)
  const getReviewsForCurrentHost = () => {
    if (!event || !hostReviews.length) return [];

    return hostReviews.filter(
      (review) =>
        review.hostId === event.userId || review.host?.id === event.userId
    );
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
        <Button className="mt-4" onClick={() => router.push("/events")}>
          Browse Events
        </Button>
      </div>
    );
  }

  const spotsLeft = event.maxParticipants - event.currentParticipants;
  const isFull = spotsLeft <= 0;

  const eventStartLocal =
    getEventStartLocal(event.date, event.time) ?? new Date(event.date);
  const eventEndLocal = endOfDayLocal(eventStartLocal);

  const now = new Date();
  const isPast = eventEndLocal < now;

  const displayDateString = eventStartLocal.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const displayTimeString =
    event.time ||
    eventStartLocal.toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    });

  const canJoinByStatus = ["OPEN", "ONGOING"].includes(event.status);
  const canJoinByTime = !isPast && !isFull && !hasJoined;
  const canJoin = canJoinByStatus && canJoinByTime;

  const hostReviewsForEvent = hostReviews;

  const handleJoin = async () => {
    if (!user) {
      toast.error("Please log in to join events");
      router.push("/login");
      return;
    }

    setIsJoining(true);
    try {
      if (event.joiningFee > 0) {
        const paymentResponse = await paymentApi.createPayment({
          eventId: event.id,
        });
        if (paymentResponse.success) {
          setPaymentData({
            clientSecret: paymentResponse.data.clientSecret,
            amount: event.joiningFee,
          });
          setIsJoinDialogOpen(false);
        } else {
          toast.error(paymentResponse.message || "Failed to initiate payment");
        }
      } else {
        const response = await eventApi.participateInEvent(event.id);
        if (response.success) {
          setHasJoined(true);
          setIsJoinDialogOpen(false);
          toast.success("Successfully joined the event!");
          fetchEvent(); // Refresh event data
        } else {
          toast.error(response.message || "Failed to join event");
        }
      }
    } catch (error) {
      toast.error("Network error. Please try again.");
    }
    setIsJoining(false);
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: event.title,
        text: event.description,
        url: window.location.href,
      });
    } else {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  const handleReviewSubmitted = () => {
    setHasReviewed(true);
    fetchHostReviews(); // Refresh reviews
    toast.success("Review submitted successfully!");
  };

  const checkIfFavourite = async () => {
    if (!user || !event) return;
    try {
      const response = await favouriteEventsApi.getMyFavourites();
      if (response.success && response.data) {
        const isFav = response.data.some(
          (fav: any) => fav.eventId === event.id
        );
        setIsFavourite(isFav);
      }
    } catch (error) {
      console.error("Failed to check favourite status:", error);
    }
  };

  const handleToggleFavourite = async () => {
    if (!user) {
      toast.error("Please log in to save events");
      return;
    }

    try {
      if (isFavourite) {
        const response = await favouriteEventsApi.removeFromFavourites(
          event!.id
        );
        if (response.success) {
          setIsFavourite(false);
          toast.success("Removed from favourites");
        }
      } else {
        const response = await favouriteEventsApi.addToFavourites(event!.id);
        if (response.success) {
          setIsFavourite(true);
          toast.success("Added to favourites");
        }
      }
    } catch (error) {
      toast.error("Failed to update favourites");
    }
  };

  return (
    <div className="py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Button
          variant="ghost"
          className="mb-6 gap-2"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Events
        </Button>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <div className="relative aspect-[16/9] overflow-hidden rounded-2xl">
              <Image
                src={event.eventImage || "/placeholder.svg"}
                alt={event.title}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute left-4 top-4">
                <Badge className="bg-primary/90 backdrop-blur-sm">
                  {event.eventCategory}
                </Badge>
              </div>
              {event.status !== "OPEN" && (
                <div className="absolute right-4 top-4">
                  <Badge variant="destructive">{event.status}</Badge>
                </div>
              )}
            </div>

            <div>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                {event.title}
              </h1>
              <div className="mt-4 flex flex-wrap gap-4 text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  {displayDateString}
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  {displayTimeString}
                </div>
              </div>
            </div>

            <Separator />

            {/* Description */}
            <div>
              <h2 className="text-xl font-semibold mb-3">About this event</h2>
              <p className="text-muted-foreground leading-relaxed">
                {event.description}
              </p>
            </div>

            <Separator />

            {/* Location */}
            <div>
              <h2 className="text-xl font-semibold mb-3">Location</h2>
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 mt-0.5 text-primary" />
                <div>
                  <p className="font-medium">{event.location}</p>
                  <p className="text-sm text-muted-foreground">
                    {event.location}
                  </p>
                </div>
              </div>
              <div className="mt-4 aspect-[16/9] rounded-xl bg-muted overflow-hidden">
                <iframe
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodeURIComponent(
                    event.location
                  )}`}
                />
              </div>
            </div>

            <Separator />

            <div>
              <h2 className="text-xl font-semibold mb-3">
                Participants ({event.currentParticipants}/
                {event.maxParticipants})
              </h2>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {spotsLeft > 0 ? `${spotsLeft} spots left` : "No spots left"}
                </span>
              </div>
            </div>

            <Separator />

            {/* Host Reviews */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Host Reviews</h2>
                {hasJoined && !hasReviewed && (
                  <ReviewForm
                    eventId={event.id}
                    hostName={event.user.fullName}
                    onSubmit={handleReviewSubmitted}
                  />
                )}
                {hasReviewed && (
                  <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-md">
                    <Check className="h-4 w-4" />
                    <span className="text-sm font-medium">
                      You've reviewed this host
                    </span>
                  </div>
                )}
              </div>
              {hostReviewsForEvent.length > 0 ? (
                <div className="space-y-4">
                  {hostReviewsForEvent.map((review) => (
                    <GlowCard key={review.id} className="p-4">
                      <div className="flex items-start gap-3">
                        <Avatar>
                          <AvatarImage
                            src={
                              review.user?.avatar ||
                              review.user?.profilePhoto ||
                              "/placeholder.svg"
                            }
                          />
                          <AvatarFallback>
                            {review.user?.fullName?.charAt(0) || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">
                              {review.user?.fullName || "Anonymous"}
                            </span>
                            <div className="flex items-center gap-1">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < review.rating
                                      ? "fill-primary text-primary"
                                      : "fill-gray-200 text-gray-200"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          <p className="mt-1 text-sm text-muted-foreground">
                            {review.comment}
                          </p>
                          <p className="mt-2 text-xs text-muted-foreground">
                            {new Date(review.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              }
                            )}
                          </p>
                        </div>
                      </div>
                    </GlowCard>
                  ))}
                </div>
              ) : (
                <GlowCard className="text-center py-8">
                  <Star className="h-10 w-10 text-muted-foreground/50 mx-auto mb-2" />
                  <p className="text-muted-foreground">
                    No reviews for this host yet
                  </p>
                  {hasJoined && !hasReviewed && (
                    <p className="text-sm text-muted-foreground mt-2">
                      Be the first to review this host!
                    </p>
                  )}
                </GlowCard>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Booking Card */}
              <GlowCard>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      {event.joiningFee > 0 ? (
                        <div className="flex items-baseline gap-1">
                          <span className="text-3xl font-bold">
                            ${event.joiningFee}
                          </span>
                          <span className="text-muted-foreground">
                            / person
                          </span>
                        </div>
                      ) : (
                        <span className="text-3xl font-bold text-primary">
                          Free
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>
                      {event.currentParticipants} joined · {spotsLeft} spots
                      left
                    </span>
                  </div>

                  {hasJoined ? (
                    <Button className="w-full" variant="secondary" disabled>
                      <Check className="mr-2 h-4 w-4" />
                      You're In!
                    </Button>
                  ) : isPast ? (
                    <Button className="w-full" disabled>
                      Event has ended
                    </Button>
                  ) : isFull ? (
                    <Button className="w-full" disabled>
                      Event is full
                    </Button>
                  ) : (
                    <Button
                      className="w-full"
                      onClick={() => setIsJoinDialogOpen(true)}
                      disabled={!canJoin}
                    >
                      {event.joiningFee > 0
                        ? `Pay $${event.joiningFee} to Join`
                        : "Join Event"}
                    </Button>
                  )}

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={handleShare}
                    >
                      <Share2 className="mr-2 h-4 w-4" />
                      Share
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleToggleFavourite}
                      disabled={!user}
                    >
                      <Heart
                        className={`h-4 w-4 ${
                          isFavourite ? "fill-current text-red-500" : ""
                        }`}
                      />
                    </Button>
                  </div>
                </div>
              </GlowCard>

              {/* Host Info */}
              <GlowCard>
                <div className="space-y-4">
                  <h3 className="font-semibold">Hosted by</h3>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={event.user?.profilePhoto} />
                      <AvatarFallback>
                        {event.user?.fullName?.charAt(0) || "H"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">
                        {event.user?.fullName || "Event Host"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {event.user?.email}
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href={`/profile/${event.userId}`}>View Profile</Link>
                  </Button>
                </div>
              </GlowCard>
            </div>
          </div>
        </div>

        {/* Join Event Dialog */}
        <Dialog open={isJoinDialogOpen} onOpenChange={setIsJoinDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Join Event</DialogTitle>
              <DialogDescription>
                {event.joiningFee > 0
                  ? `This event requires a payment of $${event.joiningFee}. You will be redirected to complete the payment.`
                  : "Are you sure you want to join this event?"}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsJoinDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleJoin} disabled={isJoining}>
                {isJoining
                  ? "Processing..."
                  : event.joiningFee > 0
                  ? "Proceed to Payment"
                  : "Join Event"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Stripe Payment Dialog */}
        {paymentData && (
          <Dialog
            open={!!paymentData}
            onOpenChange={() => setPaymentData(null)}
          >
            <DialogContent className="max-w-md">
              <StripePayment
                clientSecret={paymentData.clientSecret}
                amount={paymentData.amount}
                eventTitle={event.title}
                onSuccess={() => {
                  setPaymentData(null);
                  setHasJoined(true);
                  fetchEvent();
                  toast.success("Payment successful! You've joined the event.");
                }}
                onCancel={() => setPaymentData(null)}
              />
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
}
