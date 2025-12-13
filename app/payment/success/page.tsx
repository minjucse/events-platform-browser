import PaymentSuccess from "@/components/stripe/PaymentSuccess";
import { Suspense } from "react";

export default function PaymentSuccessPage() {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <PaymentSuccess />
      </Suspense>
    </div>
  );
}
