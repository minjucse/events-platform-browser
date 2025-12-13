"use client";

import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { authApi } from "@/lib/api/authApi";
import { ArrowLeft, Mail, Sparkles } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function VerifyEmail() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [canResend, setCanResend] = useState(false);
  const [countdown, setCountdown] = useState(120);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const handleVerify = async () => {
    if (otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    setIsLoading(true);
    try {
      const response = await authApi.verifyEmail({ email, otp });
      if (response.success) {
        toast.success("Email verified successfully!");
        router.push("/login");
      } else {
        toast.error(response.message || "Invalid OTP. Please try again.");
      }
    } catch (error) {
      toast.error("Network error. Please try again.");
    }
    setIsLoading(false);
  };

  const handleResend = async () => {
    if (!canResend) return;

    try {
      const response = await authApi.resendOTP({ email });
      if (response.success) {
        toast.success("OTP sent successfully!");
        setCanResend(false);
        setCountdown(120);
      } else {
        toast.error(response.message || "Failed to resend OTP");
      }
    } catch (error) {
      toast.error("Network error. Please try again.");
    }
  };

  return (
    <div className="space-y-8">
      <Link href="/" className="flex items-center gap-2 lg:hidden">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
          <Sparkles className="h-5 w-5 text-primary-foreground" />
        </div>
        <span className="text-xl font-bold gradient-text">EventHub</span>
      </Link>

      <div className="space-y-2">
        <Link
          href="/register"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to register
        </Link>
        <h1 className="text-3xl font-bold">Verify your email</h1>
        <p className="text-muted-foreground">
          We've sent a 6-digit verification code to{" "}
          <span className="font-medium text-foreground">{email}</span>
        </p>
      </div>

      <div className="flex justify-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
          <Mail className="h-10 w-10 text-primary" />
        </div>
      </div>

      <div className="space-y-6">
        <div className="space-y-4">
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
        </div>

        <Button
          onClick={handleVerify}
          className="w-full h-11"
          disabled={isLoading || otp.length !== 6}
        >
          {isLoading ? "Verifying..." : "Verify Email"}
        </Button>

        <div className="text-center space-y-2">
          <p className="text-sm text-muted-foreground">
            Didn't receive the code?{" "}
            {canResend ? (
              <button
                onClick={handleResend}
                className="text-primary font-medium hover:underline"
              >
                Resend OTP
              </button>
            ) : (
              <span className="text-muted-foreground">
                Resend in {Math.floor(countdown / 60)}:
                {(countdown % 60).toString().padStart(2, "0")}
              </span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
