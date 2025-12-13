"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";
import { authApi } from "@/lib/api/authApi";
import { ArrowLeft, CalendarCheck, Lock, Mail} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<"email" | "otp" | "reset">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await authApi.forgotPassword({ email });
      if (response.success) {
        toast.success("OTP sent to your email!");
        setStep("otp");
      } else {
        toast.error(response.message || "Failed to send OTP");
      }
    } catch (error) {
      toast.error("Network error. Please try again.");
    }
    setIsLoading(false);
  };

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }
    setStep("reset");
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    setIsLoading(true);
    try {
      const response = await authApi.resetPassword({ email, otp, newPassword });
      if (response.success) {
        toast.success("Password reset successfully!");
        router.push("/login");
      } else {
        toast.error(response.message || "Failed to reset password");
      }
    } catch (error) {
      toast.error("Network error. Please try again.");
    }
    setIsLoading(false);
  };

  return (
    <div className="space-y-8">
      <Link href="/" className="flex items-center gap-2 mr-8 flex-shrink-0">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 text-white shadow-lg shadow-cyan-400/50">
          <CalendarCheck className="h-5 w-5" />
        </div>
        <span className="hidden font-bold sm:inline-block text-lg bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-300 bg-clip-text text-transparent">
          EventMate
        </span>
      </Link>

      <div className="space-y-2">
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to login
        </Link>
        <h1 className="text-3xl font-bold">Reset your password</h1>
        <p className="text-muted-foreground">
          {step === "email" &&
            "Enter your email address and we'll send you a verification code"}
          {step === "otp" && "Enter the 6-digit code sent to your email"}
          {step === "reset" && "Create a new password for your account"}
        </p>
      </div>

      {step === "email" && (
        <form onSubmit={handleSendOTP} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                className="pl-10"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <Button type="submit" className="w-full h-11" disabled={isLoading}>
            {isLoading ? "Sending..." : "Send verification code"}
          </Button>
        </form>
      )}

      {step === "otp" && (
        <div className="space-y-6">
          <div className="flex justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
              <Mail className="h-10 w-10 text-primary" />
            </div>
          </div>

          <div className="flex flex-col items-center gap-4">
            <InputOTP maxLength={6} value={otp} onChange={setOtp}>
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>

          <Button
            onClick={handleVerifyOTP}
            className="w-full h-11"
            disabled={otp.length !== 6}
          >
            Verify Code
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Didn't receive the code?{" "}
            <button
              onClick={() =>
                handleSendOTP({ preventDefault: () => { } } as React.FormEvent)
              }
              className="text-primary font-medium hover:underline"
            >
              Resend
            </button>
          </p>
        </div>
      )}

      {step === "reset" && (
        <form onSubmit={handleResetPassword} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="Enter new password"
                  className="pl-10"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={8}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm new password"
                  className="pl-10"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full h-11" disabled={isLoading}>
            {isLoading ? "Resetting..." : "Reset Password"}
          </Button>
        </form>
      )}

      <p className="text-center text-sm text-muted-foreground">
        Remember your password?{" "}
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
