"use client";

import { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { GlowCard } from "@/components/glow-card";
import { paymentApi } from "@/lib/paymentApi";
import { toast } from "sonner";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface PaymentFormProps {
  clientSecret: string;
  amount: number;
  eventTitle: string;
  onSuccess: () => void;
  onCancel: () => void;
}

function PaymentForm({ clientSecret, amount, eventTitle, onSuccess, onCancel }: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) return;

    setIsProcessing(true);

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) return;

    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
      },
    });

    if (error) {
      toast.error(error.message || "Payment failed");
    } else if (paymentIntent.status === "succeeded") {
      // Verify payment with backend
      try {
        const verifyResponse = await paymentApi.verifyPayment({
          paymentIntentId: paymentIntent.id,
        });
        
        if (verifyResponse.success) {
          toast.success("Payment successful! You've joined the event.");
          onSuccess();
          // Redirect to success page
          window.location.href = `/payment/success?eventId=${verifyResponse.data?.eventId || ''}`;
        } else {
          toast.error("Payment verification failed");
        }
      } catch (error) {
        toast.error("Payment verification failed");
      }
    }

    setIsProcessing(false);
  };

  return (
    <GlowCard className="p-6">
      <div className="space-y-4">
        <div className="text-center">
          <h3 className="text-lg font-semibold">Complete Payment</h3>
          <p className="text-muted-foreground">{eventTitle}</p>
          <p className="text-2xl font-bold">${amount}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="p-4 border rounded-lg">
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: "16px",
                    color: "#424770",
                    "::placeholder": {
                      color: "#aab7c4",
                    },
                  },
                },
              }}
            />
          </div>

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!stripe || isProcessing}
              className="flex-1"
            >
              {isProcessing ? "Processing..." : `Pay $${amount}`}
            </Button>
          </div>
        </form>
      </div>
    </GlowCard>
  );
}

interface StripePaymentProps {
  clientSecret: string;
  amount: number;
  eventTitle: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export function StripePayment({ clientSecret, amount, eventTitle, onSuccess, onCancel }: StripePaymentProps) {
  return (
    <Elements stripe={stripePromise}>
      <PaymentForm
        clientSecret={clientSecret}
        amount={amount}
        eventTitle={eventTitle}
        onSuccess={onSuccess}
        onCancel={onCancel}
      />
    </Elements>
  );
}