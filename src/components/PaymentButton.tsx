import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { redirectToCheckout, isStripeConfigured } from "@/lib/stripe";

interface PaymentButtonProps {
  priceId: string;
  planName: string;
  mode?: "subscription" | "payment";
  variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  children?: React.ReactNode;
}

/**
 * PaymentButton component that initiates Stripe Checkout
 * Shows loading state while redirecting and handles errors with toast notifications
 */
export function PaymentButton({
  priceId,
  planName,
  mode = "subscription",
  variant = "default",
  size = "default",
  className,
  children,
}: PaymentButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    // Check if Stripe is configured
    if (!isStripeConfigured()) {
      toast.error("Payment system not configured", {
        description: "Stripe is running in test mode. Please configure your Stripe keys to enable payments.",
      });
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await redirectToCheckout(priceId, mode);

      if (error) {
        toast.error("Payment failed", {
          description: error,
        });
      }
    } catch (err) {
      console.error("Payment error:", err);
      toast.error("Something went wrong", {
        description: "Please try again or contact support if the problem persists.",
      });
    } finally {
      // Only set loading to false if we're still on this page
      // (user might have been redirected to Stripe)
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleClick}
      isLoading={isLoading}
      disabled={isLoading}
      variant={variant}
      size={size}
      className={className}
    >
      {children || `Subscribe to ${planName}`}
    </Button>
  );
}

export default PaymentButton;
