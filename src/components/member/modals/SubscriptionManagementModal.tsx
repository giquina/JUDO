import { useState } from "react";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
  CheckCircle2,
  Crown,
  Sparkles,
  CreditCard,
  Calendar,
  AlertCircle,
  TrendingUp,
} from "lucide-react";

interface SubscriptionManagementModalProps {
  open: boolean;
  onClose: () => void;
  currentTier: string;
  status: string;
}

const TIERS = [
  {
    id: "student",
    name: "Student",
    price: "£25",
    priceValue: 25,
    description: "Perfect for students",
    features: [
      "2 sessions per week",
      "Belt progression tracking",
      "Basic support",
      "Access to student events",
    ],
    icon: "🎓",
    color: "from-blue-500 to-cyan-500",
    popular: false,
  },
  {
    id: "standard",
    name: "Standard",
    price: "£40",
    priceValue: 40,
    description: "Most popular choice",
    features: [
      "Unlimited sessions",
      "Priority booking",
      "Email support",
      "Competition entry",
      "Progress analytics",
    ],
    icon: "⭐",
    color: "from-purple-500 to-pink-500",
    popular: true,
  },
  {
    id: "premium",
    name: "Premium",
    price: "£60",
    priceValue: 60,
    description: "Ultimate training experience",
    features: [
      "Everything in Standard",
      "1 private coaching session/month",
      "Competition prep",
      "Priority equipment access",
      "Nutrition consultation",
      "Free club merchandise",
    ],
    icon: "👑",
    color: "from-yellow-500 to-orange-500",
    popular: false,
  },
];

export default function SubscriptionManagementModal({
  open,
  onClose,
  currentTier,
  status,
}: SubscriptionManagementModalProps) {
  const [selectedTier, setSelectedTier] = useState(currentTier);
  const [isLoading, setIsLoading] = useState(false);

  const handleUpgrade = async () => {
    setIsLoading(true);
    toast.loading("Processing upgrade...");

    await new Promise(resolve => setTimeout(resolve, 2000));

    toast.dismiss();
    toast.success("Subscription upgraded successfully!", {
      description: `You're now on the ${selectedTier} plan`,
    });

    setIsLoading(false);
    onClose();
  };

  const handleCancel = async () => {
    setIsLoading(true);
    toast.loading("Cancelling subscription...");

    await new Promise(resolve => setTimeout(resolve, 1500));

    toast.dismiss();
    toast.success("Subscription cancelled", {
      description: "You'll have access until the end of your billing period",
    });

    setIsLoading(false);
    onClose();
  };

  const handlePause = async () => {
    setIsLoading(true);
    toast.loading("Pausing subscription...");

    await new Promise(resolve => setTimeout(resolve, 1500));

    toast.dismiss();
    toast.success("Subscription paused", {
      description: "Resume anytime from your dashboard",
    });

    setIsLoading(false);
    onClose();
  };

  const currentTierData = TIERS.find(t => t.id === currentTier);
  const selectedTierData = TIERS.find(t => t.id === selectedTier);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <CreditCard className="h-6 w-6 text-primary" />
            Manage Subscription
          </DialogTitle>
          <DialogDescription>
            View and manage your membership plan
          </DialogDescription>
        </DialogHeader>

        {/* Current Subscription Status */}
        <Card className="bg-gradient-to-br from-primary/10 to-blue-500/5">
          <CardHeader>
            <CardTitle className="text-lg">Current Plan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="text-4xl">{currentTierData?.icon}</div>
                <div>
                  <p className="text-2xl font-bold">{currentTierData?.name}</p>
                  <p className="text-muted-foreground">{currentTierData?.price}/month</p>
                </div>
              </div>
              <Badge
                variant={status === "active" ? "default" : "secondary"}
                className="text-sm px-4 py-1"
              >
                {status === "active" ? "Active" : status}
              </Badge>
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>Next billing date: February 21, 2026</span>
            </div>

            <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
              <AlertCircle className="h-5 w-5 text-blue-500" />
              <p className="text-sm text-blue-700 dark:text-blue-300">
                You've attended 8 sessions this month. Keep it up!
              </p>
            </div>
          </CardContent>
        </Card>

        <Separator />

        {/* Available Plans */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Available Plans</h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <TrendingUp className="h-4 w-4" />
              <span>Save up to 20% with annual billing</span>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {TIERS.map((tier) => {
              const isCurrent = tier.id === currentTier;
              const isSelected = tier.id === selectedTier;

              return (
                <motion.div
                  key={tier.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card
                    className={`relative cursor-pointer transition-all ${
                      isSelected
                        ? "ring-2 ring-primary shadow-lg"
                        : "hover:shadow-md"
                    } ${isCurrent ? "border-primary" : ""}`}
                    onClick={() => setSelectedTier(tier.id)}
                  >
                    {tier.popular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                          <Sparkles className="h-3 w-3 mr-1" />
                          Most Popular
                        </Badge>
                      </div>
                    )}

                    <CardHeader>
                      <div className="text-3xl mb-2">{tier.icon}</div>
                      <CardTitle className="flex items-center justify-between">
                        {tier.name}
                        {isCurrent && (
                          <Badge variant="outline" className="text-xs">
                            Current
                          </Badge>
                        )}
                      </CardTitle>
                      <CardDescription>{tier.description}</CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      <div>
                        <span className="text-3xl font-bold">{tier.price}</span>
                        <span className="text-muted-foreground">/month</span>
                      </div>

                      <ul className="space-y-2">
                        {tier.features.map((feature, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm">
                            <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>

                      {isSelected && !isCurrent && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="pt-2"
                        >
                          <Badge className="w-full justify-center py-1">
                            Selected
                          </Badge>
                        </motion.div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>

        <Separator />

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          {selectedTier !== currentTier && (
            <Button
              onClick={handleUpgrade}
              disabled={isLoading}
              className="flex-1 bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90"
            >
              <Crown className="h-4 w-4 mr-2" />
              {selectedTierData && selectedTierData.priceValue > (currentTierData?.priceValue || 0)
                ? "Upgrade Plan"
                : "Switch Plan"}
            </Button>
          )}

          {status === "active" && (
            <>
              <Button
                variant="outline"
                onClick={handlePause}
                disabled={isLoading}
                className="flex-1"
              >
                Pause Subscription
              </Button>
              <Button
                variant="destructive"
                onClick={handleCancel}
                disabled={isLoading}
                className="flex-1"
              >
                Cancel Subscription
              </Button>
            </>
          )}

          <Button variant="ghost" onClick={onClose} disabled={isLoading}>
            Close
          </Button>
        </div>

        {/* Billing Info */}
        <Card className="bg-muted/50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <CreditCard className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm font-medium">Payment Method</p>
                <p className="text-sm text-muted-foreground">
                  Visa ending in 4242 • Expires 12/27
                </p>
                <Button variant="link" className="h-auto p-0 text-xs">
                  Update payment method
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
