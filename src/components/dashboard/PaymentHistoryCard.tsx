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
  CreditCard,
  Download,
  ChevronRight,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Clock,
  XCircle,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { mockPaymentHistory, getUpcomingPayment } from "@/lib/mockPaymentData"
import type { PaymentHistoryItem } from "@/lib/mockPaymentData"

interface PaymentHistoryCardProps {
  onViewAll?: () => void
  className?: string
}

export function PaymentHistoryCard({
  onViewAll,
  className,
}: PaymentHistoryCardProps) {
  const recentPayments = mockPaymentHistory.slice(0, 5)
  const upcomingPayment = getUpcomingPayment()

  return (
    <Card className={cn("", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Payment History</CardTitle>
            <CardDescription>Recent transactions and receipts</CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={onViewAll}>
            View All
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Upcoming Payment Indicator */}
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-950/30">
          <div className="flex items-start gap-3">
            <Calendar className="mt-0.5 h-5 w-5 text-blue-600 dark:text-blue-400" />
            <div className="flex-1">
              <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                Next Payment Due
              </p>
              <p className="mt-1 text-sm text-blue-700 dark:text-blue-300">
                {upcomingPayment.description}
              </p>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-sm text-blue-600 dark:text-blue-400">
                  {new Date(upcomingPayment.date).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
                <span className="font-semibold text-blue-900 dark:text-blue-100">
                  £{(upcomingPayment.amount / 100).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Payments List */}
        <div className="space-y-3">
          {recentPayments.map((payment) => (
            <PaymentItem key={payment.id} payment={payment} />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function PaymentItem({ payment }: { payment: PaymentHistoryItem }) {
  const [isDownloading, setIsDownloading] = useState(false)

  const handleDownloadReceipt = () => {
    setIsDownloading(true)
    // Simulate download
    setTimeout(() => {
      setIsDownloading(false)
    }, 1000)
  }

  return (
    <div className="flex items-start gap-3 rounded-lg border p-3 transition-colors hover:bg-accent">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
        <PaymentMethodIcon payment={payment} />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{payment.description}</p>
            <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
              <span>
                {new Date(payment.date).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </span>
              <span>•</span>
              <span className="truncate">{payment.receiptNumber}</span>
            </div>
          </div>

          <div className="flex shrink-0 flex-col items-end gap-2">
            <span className="text-sm font-semibold">
              £{(payment.amount / 100).toFixed(2)}
            </span>
            <PaymentStatusBadge status={payment.status} />
          </div>
        </div>

        <div className="mt-2 flex items-center gap-2">
          <PaymentMethodBadge payment={payment} />
          {payment.status === "completed" && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs"
              onClick={handleDownloadReceipt}
              isLoading={isDownloading}
            >
              <Download className="mr-1 h-3 w-3" />
              Receipt
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

function PaymentMethodIcon({ payment }: { payment: PaymentHistoryItem }) {
  const { paymentMethod } = payment

  if (paymentMethod.type === "card") {
    return <CreditCard className="h-5 w-5 text-primary" />
  }

  return <CreditCard className="h-5 w-5 text-primary" />
}

function PaymentMethodBadge({ payment }: { payment: PaymentHistoryItem }) {
  const { paymentMethod } = payment

  if (paymentMethod.type === "card" && paymentMethod.brand) {
    const brandName = paymentMethod.brand.charAt(0).toUpperCase() + paymentMethod.brand.slice(1)
    return (
      <div className="flex items-center gap-1 text-xs text-muted-foreground">
        <CreditCard className="h-3 w-3" />
        <span>
          {brandName} •••• {paymentMethod.last4}
        </span>
      </div>
    )
  }

  if (paymentMethod.type === "paypal") {
    return (
      <div className="flex items-center gap-1 text-xs text-muted-foreground">
        <span>PayPal</span>
      </div>
    )
  }

  return null
}

function PaymentStatusBadge({ status }: { status: PaymentHistoryItem["status"] }) {
  const config = {
    completed: {
      label: "Paid",
      icon: CheckCircle2,
      className: "border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950/30 dark:text-green-400",
    },
    pending: {
      label: "Pending",
      icon: Clock,
      className: "border-yellow-200 bg-yellow-50 text-yellow-700 dark:border-yellow-800 dark:bg-yellow-950/30 dark:text-yellow-400",
    },
    failed: {
      label: "Failed",
      icon: XCircle,
      className: "border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950/30 dark:text-red-400",
    },
    refunded: {
      label: "Refunded",
      icon: AlertCircle,
      className: "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950/30 dark:text-blue-400",
    },
  }

  const { label, icon: Icon, className } = config[status]

  return (
    <Badge variant="outline" className={cn("gap-1 text-xs", className)}>
      <Icon className="h-3 w-3" />
      {label}
    </Badge>
  )
}
