"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useAuth } from "@/lib/auth-context";
import type { UserRole } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Building,
  CalendarCheck,
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

// Define Zod schema matching your backend validation
const registrationSchema = z
  .object({
    email: z.string().email("Invalid email format"),
    fullName: z
      .string()
      .min(1, "Full name is required")
      .max(32, "Full name must be at most 32 characters"),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .max(24, "Password must be at most 24 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number"
      ),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    role: z.enum(["USER", "HOST", "ADMIN"]),
    agreeTerms: z.boolean().refine((val) => val === true, {
      message: "You must agree to the terms and conditions",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegistrationFormData = z.infer<typeof registrationSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { register } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Initialize React Hook Form with Zod resolver
  const form = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: (searchParams.get("role") as UserRole) || "USER",
      agreeTerms: false,
    },
    mode: "onChange", // Validate on change for real-time feedback
  });

  const roleValue = form.watch("role");

  const onSubmit = async (data: RegistrationFormData) => {
    setIsLoading(true);

    try {
      const result = await register({
        email: data.email,
        password: data.password,
        fullName: data.fullName,
        role: data.role,
      });

      if (result.success) {
        toast.success("Registration successful! Please verify your email.");
        form.reset(); // Clear form after successful submission
        router.push(`/verify-email?email=${encodeURIComponent(data.email)}`);
      } else {
        toast.error(result.error || "Failed to create account");
      }
    } catch (error: any) {
      // Handle backend validation errors
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        Object.keys(errors).forEach((field) => {
          const fieldName = field as keyof RegistrationFormData;
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
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Mobile logo */}
      <Link href="/" className="flex items-center gap-2 mr-8 flex-shrink-0">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 text-white shadow-lg shadow-cyan-400/50">
          <CalendarCheck className="h-5 w-5" />
        </div>
        <span className="hidden font-bold sm:inline-block text-lg bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-300 bg-clip-text text-transparent">
          EventMate
        </span>
      </Link>

      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Create an account</h1>
        <p className="text-muted-foreground">
          Join our community and start discovering events
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          {/* Role Selection */}
          <div className="space-y-3">
            <Label>I want to</Label>
            <RadioGroup
              value={roleValue}
              onValueChange={(value) =>
                form.setValue("role", value as UserRole, {
                  shouldValidate: true,
                })
              }
              className="grid grid-cols-2 gap-3"
            >
              <Label
                htmlFor="role-user"
                className={`flex items-center gap-3 rounded-lg border-2 p-4 cursor-pointer transition-colors ${roleValue === "USER"
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                  }`}
              >
                <RadioGroupItem
                  value="USER"
                  id="role-user"
                  className="sr-only"
                />
                <User className="h-5 w-5 text-primary" />
                <div>
                  <div className="font-medium">Join Events</div>
                  <div className="text-xs text-muted-foreground">
                    Find & attend activities
                  </div>
                </div>
              </Label>
              <Label
                htmlFor="role-host"
                className={`flex items-center gap-3 rounded-lg border-2 p-4 cursor-pointer transition-colors ${roleValue === "HOST"
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                  }`}
              >
                <RadioGroupItem
                  value="HOST"
                  id="role-host"
                  className="sr-only"
                />
                <Building className="h-5 w-5 text-primary" />
                <div>
                  <div className="font-medium">Host Events</div>
                  <div className="text-xs text-muted-foreground">
                    Create & manage activities
                  </div>
                </div>
              </Label>
            </RadioGroup>
          </div>

          <div className="space-y-4">
            {/* Full Name Field */}
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="John Doe"
                        className="pl-10"
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                  {field.value && (
                    <FormDescription className="text-xs text-right">
                      {field.value.length}/32 characters
                    </FormDescription>
                  )}
                </FormItem>
              )}
            />

            {/* Email Field */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="name@example.com"
                        className="pl-10"
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password Field */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <FormControl>
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a strong password"
                        className="pl-10 pr-10"
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isLoading}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  <FormMessage />
                  {field.value && (
                    <FormDescription className="text-xs">
                      Must be 6-24 characters with uppercase, lowercase, and
                      number
                    </FormDescription>
                  )}
                </FormItem>
              )}
            />

            {/* Confirm Password Field */}
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <FormControl>
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        className="pl-10 pr-10"
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      disabled={isLoading}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Terms Agreement Field */}
            <FormField
              control={form.control}
              name="agreeTerms"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isLoading}
                      className="mt-1"
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="text-sm font-normal cursor-pointer">
                      I agree to the{" "}
                      <Link
                        href="/terms"
                        className="text-primary hover:underline"
                      >
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link
                        href="/privacy"
                        className="text-primary hover:underline"
                      >
                        Privacy Policy
                      </Link>
                    </FormLabel>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
          </div>

          <Button
            type="submit"
            className="w-full h-11"
            disabled={isLoading || !form.formState.isValid}
          >
            {isLoading ? "Creating account..." : "Create account"}
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

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href="/login"
          className="text-primary font-medium hover:underline"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
