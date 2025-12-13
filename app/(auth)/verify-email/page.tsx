import VerifyEmail from "@/components/auth/verify-email";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div>
          <Skeleton />
        </div>
      }
    >
      <VerifyEmail />
    </Suspense>
  );
}
