"use client";

import { GlowCard } from "@/components/glow-card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, CheckCircle } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function PaymentSuccess() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [eventId, setEventId] = useState<string | null>(null);

  useEffect(() => {
    const eventIdParam = searchParams.get("eventId");
    setEventId(eventIdParam);
  }, [searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <GlowCard className="text-center p-8">
          <div className="space-y-6">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-green-600 mb-2">
                Payment Successful!
              </h1>
              <p className="text-muted-foreground">
                You've successfully joined the event. Check your email for
                confirmation details.
              </p>
            </div>

            <div className="space-y-3">
              {eventId && (
                <Button asChild className="w-full">
                  <Link href={`/events/${eventId}`}>
                    <Calendar className="mr-2 h-4 w-4" />
                    View Event Details
                  </Link>
                </Button>
              )}

              <Button variant="outline" asChild className="w-full">
                <Link href="/dashboard/my-events">
                  My Events
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </GlowCard>
      </div>
    </div>
  );
}
