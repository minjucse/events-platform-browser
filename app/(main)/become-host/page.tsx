

"use client";

import { GlowCard } from "@/components/glow-card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/lib/auth-context";
import { becomeHostApi } from "@/lib/becomeHostApi";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Check,
  DollarSign,
  Shield,
  Sparkles,
  Star,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

// Define Zod schema matching your backend validation
const hostApplicationSchema = z.object({
  hostExperience: z
    .string()
    .min(1, "Host experience is required")
    .max(500, "Host experience must be at most 500 characters"),
  typeOfEvents: z
    .string()
    .min(1, "Type of events is required")
    .max(300, "Type of events must be at most 300 characters"),
  whyHost: z
    .string()
    .min(1, "Why host is required")
    .max(500, "Why host must be at most 500 characters"),
});

type HostApplicationFormData = z.infer<typeof hostApplicationSchema>;

export default function BecomeHostPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [agreed, setAgreed] = useState(false);

  // Initialize React Hook Form with Zod resolver
  const form = useForm<HostApplicationFormData>({
    resolver: zodResolver(hostApplicationSchema),
    defaultValues: {
      hostExperience: "",
      typeOfEvents: "",
      whyHost: "",
    },
    mode: "onChange", // or "onBlur", "onSubmit"
  });

  const benefits = [
    {
      icon: Calendar,
      title: "Create Unlimited Events",
      description:
        "Host as many events as you want, from small meetups to large gatherings",
    },
    {
      icon: DollarSign,
      title: "Earn Money",
      description:
        "Set your own prices and earn from ticket sales with secure payments",
    },
    {
      icon: Users,
      title: "Build Community",
      description: "Connect with like-minded people and grow your following",
    },
    {
      icon: Star,
      title: "Get Reviews",
      description:
        "Build your reputation with ratings and reviews from attendees",
    },
    {
      icon: Shield,
      title: "Host Dashboard",
      description:
        "Access powerful tools to manage events, participants, and revenue",
    },
    {
      icon: Sparkles,
      title: "Verified Badge",
      description: "Stand out with a verified host badge on your profile",
    },
  ];

  const onSubmit = async (data: HostApplicationFormData) => {
    if (!user) {
      toast.error("Please log in first");
      router.push("/login");
      return;
    }

    if (!agreed) {
      toast.error("Please agree to the host guidelines");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await becomeHostApi.createBecomeHostRequest({
        hostExperience: data.hostExperience,
        typeOfEvents: data.typeOfEvents,
        whyHost: data.whyHost,
      });

      if (response.success) {
        toast.success(
          "Host application submitted successfully! We'll review it soon."
        );
        form.reset(); // Clear form after successful submission
        router.push("/dashboard");
      } else {
        toast.error(response.message || "Failed to submit application");
      }
    } catch (error: any) {
      // Handle validation errors from backend
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        Object.keys(errors).forEach((field) => {
          const fieldName = field as keyof HostApplicationFormData;
          if (form.setError) {
            form.setError(fieldName, {
              type: "manual",
              message: errors[field].join(", "),
            });
          }
        });
      } else {
        toast.error("Network error. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (user?.role === "HOST" || user?.role === "ADMIN") {
    return (
      <div className="py-16">
        <div className="mx-auto max-w-2xl px-4 text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
            <Check className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-3xl font-bold">You're Already a Host!</h1>
          <p className="mt-4 text-muted-foreground">
            You already have host privileges. Start creating amazing events and
            connecting with participants.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/events/create">
              <Button className="gap-2">
                <Calendar className="h-4 w-4" />
                Create Event
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="outline" className="gap-2 bg-transparent">
                Go to Dashboard
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <Button
          variant="ghost"
          className="mb-6 gap-2"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>

        {/* Hero */}
        <div className="text-center mb-12">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
            <Shield className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight">
            Become a <span className="gradient-text">Host</span>
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Create memorable experiences, build your community, and earn money
            by hosting events on EventMate
          </p>
        </div>

        {/* Benefits */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-center mb-8">
            Why Become a Host?
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {benefits.map((benefit) => (
              <GlowCard key={benefit.title} className="text-center p-6">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <benefit.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold">{benefit.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {benefit.description}
                </p>
              </GlowCard>
            ))}
          </div>
        </div>

        {/* Application Form */}
        <GlowCard className="max-w-2xl mx-auto">
          <h2 className="text-xl font-semibold mb-6">Host Application</h2>

          {!user ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">
                Please log in or create an account to apply
              </p>
              <div className="flex gap-4 justify-center">
                <Link href="/login">
                  <Button variant="outline" className="bg-transparent">
                    Log In
                  </Button>
                </Link>
                <Link href="/register">
                  <Button>Sign Up</Button>
                </Link>
              </div>
            </div>
          ) : (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="hostExperience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Event Hosting Experience</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Tell us about any previous experience organizing events, meetups, or gatherings..."
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="typeOfEvents"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Types of Events You'd Like to Host</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="What kinds of events are you interested in hosting? (e.g., hiking trips, tech meetups, cooking classes...)"
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="whyHost"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Why Do You Want to Be a Host?</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Share your motivation for becoming a host on EventMate..."
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex items-start space-x-3 p-4 rounded-lg bg-muted/50">
                  <Checkbox
                    id="agree"
                    checked={agreed}
                    onCheckedChange={(checked) => setAgreed(checked as boolean)}
                  />
                  <div className="space-y-1">
                    <Label
                      htmlFor="agree"
                      className="font-normal cursor-pointer"
                    >
                      I agree to the Host Guidelines and Terms of Service
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      By becoming a host, you agree to maintain a safe and
                      welcoming environment for all participants
                    </p>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting || !agreed || !form.formState.isValid}
                >
                  {isSubmitting ? "Processing..." : "Submit Application"}
                </Button>

                {/* Optional: Show form validation status */}
                {form.formState.errors &&
                  Object.keys(form.formState.errors).length > 0 && (
                    <p className="text-sm text-amber-600 text-center">
                      Please fix all errors before submitting
                    </p>
                  )}
              </form>
            </Form>
          )}
        </GlowCard>
      </div>
    </div>
  );
}
