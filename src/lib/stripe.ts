import { loadStripe } from "@stripe/stripe-js";
import type { Stripe } from "@stripe/stripe-js";

// Stripe publishable key from environment variable
const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

// Singleton promise for Stripe instance
let stripePromise: Promise<Stripe | null> | null = null;

/**
 * Get or initialize the Stripe instance
 * Uses singleton pattern to avoid multiple initializations
 */
export const getStripe = (): Promise<Stripe | null> => {
  if (!stripePromise) {
    if (!stripePublishableKey) {
      console.warn("Stripe publishable key not found. Payment features will be disabled.");
      return Promise.resolve(null);
    }
    stripePromise = loadStripe(stripePublishableKey);
  }
  return stripePromise;
};

/**
 * Price IDs for subscription plans
 * These should be replaced with actual Stripe Price IDs from your dashboard
 */
export const STRIPE_PRICE_IDS = {
  student: "price_student_monthly",
  standard: "price_standard_monthly",
  premium: "price_premium_monthly",
} as const;

export type PlanType = keyof typeof STRIPE_PRICE_IDS;

/**
 * Plan details with pricing information
 */
export const PLAN_DETAILS = {
  student: {
    name: "Student",
    price: 15,
    priceId: STRIPE_PRICE_IDS.student,
    description: "Perfect for beginners",
    features: [
      "8 sessions per month",
      "QR check-in access",
      "Progress tracking",
      "Class schedule access",
      "Email support",
    ],
  },
  standard: {
    name: "Standard",
    price: 25,
    priceId: STRIPE_PRICE_IDS.standard,
    description: "Most popular choice",
    features: [
      "12 sessions per month",
      "All Student features",
      "Priority class booking",
      "Belt grading access",
      "Coach feedback",
      "Competition entry",
    ],
    popular: true,
  },
  premium: {
    name: "Premium",
    price: 40,
    priceId: STRIPE_PRICE_IDS.premium,
    description: "For dedicated judoka",
    features: [
      "Unlimited sessions",
      "All Standard features",
      "Priority booking",
      "1-on-1 coaching sessions",
      "Video analysis",
      "Exclusive workshops",
      "Competition coaching",
    ],
  },
} as const;

/**
 * Redirect to Stripe Checkout for subscription
 *
 * NOTE: The old client-side redirectToCheckout method has been removed from Stripe.js.
 * This function now requires a backend endpoint to create a Checkout Session.
 * The backend should return the session URL for redirection.
 */
export async function redirectToCheckout(priceId: string, mode: "subscription" | "payment" = "subscription"): Promise<{ error?: string }> {
  try {
    const stripe = await getStripe();

    if (!stripe) {
      return { error: "Stripe is not configured. Please contact support." };
    }

    // Create a Checkout Session via your backend API
    // Your backend should use the Stripe server-side SDK to create the session
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        priceId,
        mode,
        successUrl: `${window.location.origin}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: `${window.location.origin}/pricing`,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return { error: errorData.error || "Failed to create checkout session." };
    }

    const { url, error: sessionError } = await response.json();

    if (sessionError) {
      console.error("Stripe checkout session error:", sessionError);
      return { error: sessionError };
    }

    if (!url) {
      return { error: "No checkout URL returned from server." };
    }

    // Redirect to Stripe Checkout using the session URL
    window.location.href = url;

    return {};
  } catch (err) {
    console.error("Checkout error:", err);
    return { error: "An unexpected error occurred. Please try again." };
  }
}

/**
 * Format price for display
 */
export function formatPrice(amount: number, currency: string = "GBP"): string {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Check if Stripe is configured
 */
export function isStripeConfigured(): boolean {
  return !!stripePublishableKey && stripePublishableKey !== "pk_test_xxx";
}
