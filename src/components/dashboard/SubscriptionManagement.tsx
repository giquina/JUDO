import { useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import {
  CreditCard,
  Check,
  AlertTriangle,
  Plus,
  Trash2,
  Star,
  Shield,
  Crown,
  Pause,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { SUBSCRIPTION_TIERS } from "@/types"
import {
  currentSubscription,
  mockPaymentMethods,
  type PaymentMethod,
} from "@/lib/mockPaymentData"
import { toast } from "sonner"

interface SubscriptionManagementProps {
  className?: string
}

export function SubscriptionManagement({
  className,
}: SubscriptionManagementProps) {
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const [showPauseDialog, setShowPauseDialog] = useState(false)
  const [showAddPaymentDialog, setShowAddPaymentDialog] = useState(false)

  return (
    <div className={cn("space-y-6", className)}>
      {/* Current Subscription Card */}
      <Card>
        <CardHeader>
          <CardTitle>Current Subscription</CardTitle>
          <CardDescription>Manage your membership plan</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="text-2xl font-bold">Premium Membership</h3>
                <Badge className="gap-1">
                  <Crown className="h-3 w-3" />
                  Active
                </Badge>
              </div>
              <p className="text-muted-foreground">
                £{(currentSubscription.amount / 100).toFixed(2)}/month
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Next billing date</p>
              <p className="font-semibold">
                {new Date(currentSubscription.nextBillingDate).toLocaleDateString(
                  "en-GB",
                  {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  }
                )}
              </p>
            </div>
          </div>

          <Separator />

          <div className="grid gap-2">
            <p className="text-sm font-medium">Membership benefits:</p>
            <ul className="grid gap-2">
              {SUBSCRIPTION_TIERS.find((t) => t.tier === "premium")?.features.map(
                (feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-green-600" />
                    {feature}
                  </li>
                )
              )}
            </ul>
          </div>

          <Separator />

          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => setShowPauseDialog(true)}>
              <Pause className="mr-2 h-4 w-4" />
              Pause Subscription
            </Button>
            <Button
              variant="outline"
              className="text-destructive hover:bg-destructive/10 hover:text-destructive"
              onClick={() => setShowCancelDialog(true)}
            >
              <X className="mr-2 h-4 w-4" />
              Cancel Subscription
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Subscription Tiers */}
      <Card>
        <CardHeader>
          <CardTitle>Available Plans</CardTitle>
          <CardDescription>
            Upgrade or downgrade your membership
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {SUBSCRIPTION_TIERS.map((tier) => (
              <TierCard
                key={tier.tier}
                tier={tier}
                isCurrentTier={tier.tier === currentSubscription.tier}
                onSelect={() => toast.info("Subscription upgrade coming soon")}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Payment Methods */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Payment Methods</CardTitle>
              <CardDescription>Manage your payment options</CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAddPaymentDialog(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Method
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockPaymentMethods.map((method) => (
              <PaymentMethodCard key={method.id} method={method} />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Dialogs */}
      <CancelSubscriptionDialog
        open={showCancelDialog}
        onOpenChange={setShowCancelDialog}
      />
      <PauseSubscriptionDialog
        open={showPauseDialog}
        onOpenChange={setShowPauseDialog}
      />
      <AddPaymentMethodDialog
        open={showAddPaymentDialog}
        onOpenChange={setShowAddPaymentDialog}
      />
    </div>
  )
}

function TierCard({
  tier,
  isCurrentTier,
  onSelect,
}: {
  tier: (typeof SUBSCRIPTION_TIERS)[number]
  isCurrentTier: boolean
  onSelect: () => void
}) {
  const icons = {
    student: Star,
    standard: Shield,
    premium: Crown,
  }

  const Icon = icons[tier.tier as keyof typeof icons]

  return (
    <div
      className={cn(
        "relative rounded-lg border-2 p-6 transition-all",
        isCurrentTier
          ? "border-primary bg-primary/5"
          : "border-border hover:border-primary/50"
      )}
    >
      {isCurrentTier && (
        <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
          Current Plan
        </Badge>
      )}

      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
            <Icon className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold">{tier.name}</h3>
            <p className="text-2xl font-bold">
              £{(tier.priceMonthly / 100).toFixed(0)}
              <span className="text-sm font-normal text-muted-foreground">
                /mo
              </span>
            </p>
          </div>
        </div>

        <ul className="space-y-2">
          {tier.features.map((feature, i) => (
            <li key={i} className="flex items-start gap-2 text-sm">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>

        <Button
          className="w-full"
          variant={isCurrentTier ? "outline" : "default"}
          disabled={isCurrentTier}
          onClick={onSelect}
        >
          {isCurrentTier ? "Current Plan" : "Select Plan"}
        </Button>
      </div>
    </div>
  )
}

function PaymentMethodCard({ method }: { method: PaymentMethod }) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleSetDefault = () => {
    toast.success("Default payment method updated")
  }

  const handleDelete = () => {
    setIsDeleting(true)
    setTimeout(() => {
      setIsDeleting(false)
      toast.success("Payment method removed")
    }, 1000)
  }

  return (
    <div className="flex items-center justify-between rounded-lg border p-4">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
          <CreditCard className="h-5 w-5 text-primary" />
        </div>
        <div>
          {method.type === "card" && method.brand && (
            <>
              <p className="font-medium">
                {method.brand.charAt(0).toUpperCase() + method.brand.slice(1)}{" "}
                •••• {method.last4}
              </p>
              <p className="text-sm text-muted-foreground">
                {method.isDefault && (
                  <Badge variant="outline" className="mr-2 text-xs">
                    Default
                  </Badge>
                )}
                Expires 12/26
              </p>
            </>
          )}
          {method.type === "paypal" && (
            <>
              <p className="font-medium">PayPal</p>
              <p className="text-sm text-muted-foreground">{method.email}</p>
            </>
          )}
        </div>
      </div>

      <div className="flex gap-2">
        {!method.isDefault && (
          <Button variant="ghost" size="sm" onClick={handleSetDefault}>
            Set as default
          </Button>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={handleDelete}
          isLoading={isDeleting}
          disabled={method.isDefault}
        >
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      </div>
    </div>
  )
}

function CancelSubscriptionDialog({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const [isCancelling, setIsCancelling] = useState(false)

  const handleCancel = () => {
    setIsCancelling(true)
    setTimeout(() => {
      setIsCancelling(false)
      onOpenChange(false)
      toast.success("Subscription cancelled successfully")
    }, 1500)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
              <AlertTriangle className="h-6 w-6 text-destructive" />
            </div>
            <div>
              <DialogTitle>Cancel Subscription</DialogTitle>
              <DialogDescription>
                Are you sure you want to cancel your subscription?
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-3 rounded-lg border border-destructive/20 bg-destructive/5 p-4">
          <p className="text-sm font-medium">You will lose access to:</p>
          <ul className="space-y-1 text-sm text-muted-foreground">
            <li>• Unlimited training sessions</li>
            <li>• Private coaching sessions</li>
            <li>• Competition preparation</li>
            <li>• Priority booking</li>
          </ul>
          <p className="text-sm text-muted-foreground">
            Your subscription will remain active until{" "}
            {new Date(currentSubscription.nextBillingDate).toLocaleDateString(
              "en-GB"
            )}
          </p>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Keep Subscription
          </Button>
          <Button
            variant="destructive"
            onClick={handleCancel}
            isLoading={isCancelling}
          >
            Cancel Subscription
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function PauseSubscriptionDialog({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const [isPausing, setIsPausing] = useState(false)

  const handlePause = () => {
    setIsPausing(true)
    setTimeout(() => {
      setIsPausing(false)
      onOpenChange(false)
      toast.success("Subscription paused for 30 days")
    }, 1500)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Pause Subscription</DialogTitle>
          <DialogDescription>
            Take a break without losing your membership benefits
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <p className="text-sm">
            Pausing your subscription will temporarily stop billing while
            maintaining your account and progress.
          </p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <Check className="mt-0.5 h-4 w-4 text-green-600" />
              Your belt rank and progress will be saved
            </li>
            <li className="flex items-start gap-2">
              <Check className="mt-0.5 h-4 w-4 text-green-600" />
              You can resume anytime
            </li>
            <li className="flex items-start gap-2">
              <Check className="mt-0.5 h-4 w-4 text-green-600" />
              Maximum pause period: 90 days
            </li>
          </ul>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handlePause} isLoading={isPausing}>
            Pause for 30 Days
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function AddPaymentMethodDialog({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Payment Method</DialogTitle>
          <DialogDescription>
            Add a new card or payment method to your account
          </DialogDescription>
        </DialogHeader>

        <div className="flex h-[200px] items-center justify-center rounded-lg border border-dashed">
          <div className="text-center">
            <CreditCard className="mx-auto mb-3 h-12 w-12 text-muted-foreground" />
            <p className="text-sm font-medium">Stripe Payment Form</p>
            <p className="text-sm text-muted-foreground">
              Integration coming soon
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button disabled>Add Payment Method</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
