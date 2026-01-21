import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Check, ChevronDown, ChevronUp, ArrowLeft, CreditCard,
  Shield, Zap, Clock, RefreshCcw, HelpCircle
} from "lucide-react";
import { PaymentButton } from "@/components/PaymentButton";
import { PLAN_DETAILS, formatPrice, type PlanType } from "@/lib/stripe";
import { useTheme } from "@/components/ThemeProvider";
import { Sun, Moon } from "lucide-react";

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } }
};

// Feature comparison data
const featureComparison = [
  { feature: "Sessions per month", student: "8", standard: "12", premium: "Unlimited" },
  { feature: "QR check-in access", student: true, standard: true, premium: true },
  { feature: "Progress tracking", student: true, standard: true, premium: true },
  { feature: "Class schedule access", student: true, standard: true, premium: true },
  { feature: "Email support", student: true, standard: true, premium: true },
  { feature: "Priority class booking", student: false, standard: true, premium: true },
  { feature: "Belt grading access", student: false, standard: true, premium: true },
  { feature: "Coach feedback", student: false, standard: true, premium: true },
  { feature: "Competition entry", student: false, standard: true, premium: true },
  { feature: "1-on-1 coaching sessions", student: false, standard: false, premium: true },
  { feature: "Video analysis", student: false, standard: false, premium: true },
  { feature: "Exclusive workshops", student: false, standard: false, premium: true },
  { feature: "Competition coaching", student: false, standard: false, premium: true },
];

// Payment FAQ data
const paymentFaqs = [
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit and debit cards through our secure Stripe integration. This includes Visa, Mastercard, American Express, and Apple Pay. All payments are processed with bank-level encryption."
  },
  {
    question: "Can I cancel my subscription anytime?",
    answer: "Yes, you can cancel your subscription at any time from your member dashboard. Your access will continue until the end of your current billing period. No questions asked, no hidden fees."
  },
  {
    question: "Is there a free trial?",
    answer: "Absolutely! All new members get a 7-day free trial with full access to all features. No credit card required to start. Experience everything before committing to a membership."
  },
  {
    question: "Can I change my plan later?",
    answer: "Yes, you can upgrade or downgrade your plan at any time. When upgrading, you'll be charged the prorated difference. When downgrading, your new plan starts at the next billing cycle."
  },
  {
    question: "What happens if I miss a payment?",
    answer: "We'll send you a friendly reminder and retry the payment a few times. If the payment continues to fail, your account will be paused until payment is resolved. Your data and progress are always safe."
  },
  {
    question: "Do you offer family or group discounts?",
    answer: "Yes! Families with 2 or more members get 10% off each membership. Contact us directly for group rates for schools or organizations."
  },
  {
    question: "Is my payment information secure?",
    answer: "Absolutely. We use Stripe, one of the world's most trusted payment processors. Your card details are never stored on our servers - they're encrypted and handled entirely by Stripe's PCI-compliant infrastructure."
  },
  {
    question: "Can I freeze my membership?",
    answer: "Yes! Life happens, and we understand. You can freeze your membership for up to 30 days per year through your member dashboard. Your sessions will be preserved for when you return."
  }
];

export default function PricingPage() {
  const { theme, setTheme } = useTheme();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  // Get plan keys in display order
  const planKeys: PlanType[] = ["student", "standard", "premium"];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 backdrop-blur-lg bg-background/80 border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Back button and Logo */}
            <div className="flex items-center gap-4">
              <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                <ArrowLeft className="w-5 h-5" />
                <span className="hidden sm:inline">Back</span>
              </Link>
              <div className="h-6 w-px bg-border" />
              <Link to="/" className="flex items-center gap-2">
                <span className="text-2xl">🥋</span>
                <span className="font-bold text-xl bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                  Judo Club
                </span>
              </Link>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="rounded-full"
              >
                {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
              <Link to="/login">
                <Button variant="ghost">Sign In</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 md:py-24">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-blue-600/5" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />

        <div className="container mx-auto px-4 relative">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="text-center max-w-3xl mx-auto"
          >
            <Badge variant="outline" className="mb-4">
              <CreditCard className="w-3 h-3 mr-1" />
              Pricing
            </Badge>
            <h1 className="text-3xl md:text-5xl font-bold mb-4">
              Simple,{" "}
              <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                transparent
              </span>{" "}
              pricing
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Choose the plan that fits your training goals. All plans include a 7-day free trial.
              No credit card required to start.
            </p>

            {/* Billing toggle */}
            <div className="flex items-center justify-center gap-4 mb-8">
              <span className={`text-sm ${billingCycle === "monthly" ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                Monthly
              </span>
              <button
                onClick={() => setBillingCycle(billingCycle === "monthly" ? "yearly" : "monthly")}
                className="relative inline-flex h-6 w-11 items-center rounded-full bg-muted transition-colors"
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-primary transition-transform ${
                    billingCycle === "yearly" ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
              <span className={`text-sm ${billingCycle === "yearly" ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                Yearly
                <Badge variant="secondary" className="ml-2 text-xs">Save 20%</Badge>
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-8 md:py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto"
          >
            {planKeys.map((key) => {
              const plan = PLAN_DETAILS[key];
              const isPopular = "popular" in plan && plan.popular;
              const displayPrice = billingCycle === "yearly"
                ? Math.round(plan.price * 0.8)
                : plan.price;

              return (
                <motion.div key={key} variants={scaleIn}>
                  <Card
                    className={`h-full relative ${
                      isPopular
                        ? "border-primary shadow-lg shadow-primary/10 md:scale-105"
                        : "hover:border-primary/50"
                    } transition-all duration-300 hover:shadow-lg`}
                  >
                    {isPopular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <Badge className="bg-gradient-to-r from-primary to-blue-600 text-white px-4">
                          Most Popular
                        </Badge>
                      </div>
                    )}
                    <CardHeader className="text-center pt-8">
                      <CardTitle className="text-2xl">{plan.name}</CardTitle>
                      <CardDescription>{plan.description}</CardDescription>
                      <div className="mt-4">
                        <span className="text-4xl font-bold">{formatPrice(displayPrice)}</span>
                        <span className="text-muted-foreground">
                          /{billingCycle === "yearly" ? "month" : "month"}
                        </span>
                        {billingCycle === "yearly" && (
                          <p className="text-sm text-muted-foreground mt-1">
                            Billed {formatPrice(displayPrice * 12)} annually
                          </p>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <ul className="space-y-3 mb-8">
                        {plan.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-start gap-2">
                            <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                            <span className="text-sm">{feature}</span>
                          </li>
                        ))}
                      </ul>
                      <PaymentButton
                        priceId={plan.priceId}
                        planName={plan.name}
                        mode="subscription"
                        variant={isPopular ? "default" : "outline"}
                        size="lg"
                        className={`w-full ${
                          isPopular
                            ? "bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90"
                            : ""
                        }`}
                      >
                        Start Free Trial
                      </PaymentButton>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Trust badges */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="flex flex-wrap justify-center gap-8 mt-12"
          >
            <div className="flex items-center gap-2 text-muted-foreground">
              <Shield className="w-5 h-5" />
              <span className="text-sm">Secure payments</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="w-5 h-5" />
              <span className="text-sm">7-day free trial</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <RefreshCcw className="w-5 h-5" />
              <span className="text-sm">Cancel anytime</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Zap className="w-5 h-5" />
              <span className="text-sm">Instant access</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Feature Comparison Table */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="text-center mb-12"
          >
            <Badge variant="outline" className="mb-4">Compare Plans</Badge>
            <h2 className="text-2xl md:text-4xl font-bold mb-4">
              Feature{" "}
              <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                comparison
              </span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              See exactly what's included in each plan to make the best choice for your training journey.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="max-w-5xl mx-auto overflow-x-auto"
          >
            <div className="min-w-[600px]">
              {/* Table Header */}
              <div className="grid grid-cols-4 gap-4 p-4 bg-card rounded-t-lg border border-b-0">
                <div className="font-semibold">Feature</div>
                <div className="text-center font-semibold">Student</div>
                <div className="text-center font-semibold">
                  Standard
                  <Badge className="ml-2 text-xs bg-primary/20 text-primary">Popular</Badge>
                </div>
                <div className="text-center font-semibold">Premium</div>
              </div>

              {/* Table Body */}
              {featureComparison.map((row, index) => (
                <div
                  key={index}
                  className={`grid grid-cols-4 gap-4 p-4 border-x ${
                    index === featureComparison.length - 1 ? "border-b rounded-b-lg" : "border-b"
                  } ${index % 2 === 0 ? "bg-card" : "bg-muted/50"}`}
                >
                  <div className="text-sm">{row.feature}</div>
                  <div className="text-center">
                    {typeof row.student === "boolean" ? (
                      row.student ? (
                        <Check className="w-5 h-5 text-green-500 mx-auto" />
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )
                    ) : (
                      <span className="text-sm font-medium">{row.student}</span>
                    )}
                  </div>
                  <div className="text-center">
                    {typeof row.standard === "boolean" ? (
                      row.standard ? (
                        <Check className="w-5 h-5 text-green-500 mx-auto" />
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )
                    ) : (
                      <span className="text-sm font-medium">{row.standard}</span>
                    )}
                  </div>
                  <div className="text-center">
                    {typeof row.premium === "boolean" ? (
                      row.premium ? (
                        <Check className="w-5 h-5 text-green-500 mx-auto" />
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )
                    ) : (
                      <span className="text-sm font-medium">{row.premium}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Payment FAQ Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="text-center mb-12"
          >
            <Badge variant="outline" className="mb-4">
              <HelpCircle className="w-3 h-3 mr-1" />
              FAQ
            </Badge>
            <h2 className="text-2xl md:text-4xl font-bold mb-4">
              Payment{" "}
              <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                questions
              </span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Everything you need to know about billing, payments, and subscriptions.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="max-w-3xl mx-auto space-y-4"
          >
            {paymentFaqs.map((faq, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <Card
                  className={`overflow-hidden transition-all duration-300 ${
                    openFaq === index ? "border-primary" : ""
                  }`}
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full p-6 flex items-center justify-between text-left hover:bg-muted/50 transition-colors"
                  >
                    <span className="font-semibold pr-4">{faq.question}</span>
                    <motion.div
                      animate={{ rotate: openFaq === index ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      {openFaq === index ? (
                        <ChevronUp className="w-5 h-5 text-primary flex-shrink-0" />
                      ) : (
                        <ChevronDown className="w-5 h-5 flex-shrink-0" />
                      )}
                    </motion.div>
                  </button>
                  <AnimatePresence>
                    {openFaq === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="px-6 pb-6 text-muted-foreground">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-blue-600/10" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent" />

        <div className="container mx-auto px-4 relative">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="max-w-2xl mx-auto text-center"
          >
            <h2 className="text-2xl md:text-4xl font-bold mb-4">
              Ready to start your{" "}
              <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                judo journey?
              </span>
            </h2>
            <p className="text-muted-foreground mb-8">
              Join hundreds of members already training with us. Start your 7-day free trial today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <PaymentButton
                priceId={PLAN_DETAILS.standard.priceId}
                planName="Standard"
                mode="subscription"
                size="lg"
                className="bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 px-8"
              >
                Start Free Trial
              </PaymentButton>
              <Link to="/login">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Sign In
                </Button>
              </Link>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              No credit card required. Cancel anytime.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/30 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <Link to="/" className="flex items-center gap-2">
              <span className="text-2xl">🥋</span>
              <span className="font-bold text-xl bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                Judo Club
              </span>
            </Link>
            <p className="text-sm text-muted-foreground">
              © 2026 Judo Club Manager. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
