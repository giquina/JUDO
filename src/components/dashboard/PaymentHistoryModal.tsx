import { useState, useMemo } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Download,
  Search,
  Calendar,
  FileText,
  CreditCard,
  ArrowUpDown,
  X,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  RefreshCw,
} from "lucide-react"
import { cn } from "@/lib/utils"
import {
  mockPaymentHistory,
  calculateTotalSpent,
  type PaymentHistoryItem,
} from "@/lib/mockPaymentData"
import { toast } from "sonner"

interface PaymentHistoryModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

type SortField = "date" | "amount"
type SortOrder = "asc" | "desc"

export function PaymentHistoryModal({
  open,
  onOpenChange,
}: PaymentHistoryModalProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [dateRange, setDateRange] = useState<string>("all")
  const [sortField, setSortField] = useState<SortField>("date")
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc")

  // Filter and sort payments
  const filteredPayments = useMemo(() => {
    let filtered = mockPaymentHistory

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (p) =>
          p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.receiptNumber.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((p) => p.status === statusFilter)
    }

    // Date range filter
    if (dateRange !== "all") {
      const now = Date.now()
      const ranges: Record<string, number> = {
        "30days": 30 * 24 * 60 * 60 * 1000,
        "90days": 90 * 24 * 60 * 60 * 1000,
        "6months": 180 * 24 * 60 * 60 * 1000,
        "1year": 365 * 24 * 60 * 60 * 1000,
      }

      if (ranges[dateRange]) {
        filtered = filtered.filter((p) => p.date >= now - ranges[dateRange])
      }
    }

    // Sort
    filtered.sort((a, b) => {
      const aValue = a[sortField]
      const bValue = b[sortField]
      const modifier = sortOrder === "asc" ? 1 : -1
      return aValue > bValue ? modifier : -modifier
    })

    return filtered
  }, [searchQuery, statusFilter, dateRange, sortField, sortOrder])

  const totalSpent = calculateTotalSpent(
    statusFilter === "all"
      ? mockPaymentHistory
      : mockPaymentHistory.filter((p) => p.status === statusFilter)
  )

  const handleExportCSV = () => {
    // Generate CSV data
    const headers = ["Date", "Description", "Amount", "Status", "Receipt Number"]
    const rows = filteredPayments.map((p) => [
      new Date(p.date).toLocaleDateString("en-GB"),
      p.description,
      `£${(p.amount / 100).toFixed(2)}`,
      p.status,
      p.receiptNumber,
    ])

    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n")

    // Create and download file
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `payment-history-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)

    toast.success("Payment history exported successfully")
  }

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortOrder("desc")
    }
  }

  const clearFilters = () => {
    setSearchQuery("")
    setStatusFilter("all")
    setDateRange("all")
    setSortField("date")
    setSortOrder("desc")
  }

  const hasActiveFilters =
    searchQuery !== "" || statusFilter !== "all" || dateRange !== "all"

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Payment History</DialogTitle>
          <DialogDescription>
            View and manage all your payment transactions
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="list" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="list">List View</TabsTrigger>
            <TabsTrigger value="calendar">Calendar View</TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="space-y-4">
            {/* Filters and Search */}
            <div className="space-y-3">
              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search by description or receipt number..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Button onClick={handleExportCSV} variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Export CSV
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="All statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All statuses</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                    <SelectItem value="refunded">Refunded</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={dateRange} onValueChange={setDateRange}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="All time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All time</SelectItem>
                    <SelectItem value="30days">Last 30 days</SelectItem>
                    <SelectItem value="90days">Last 90 days</SelectItem>
                    <SelectItem value="6months">Last 6 months</SelectItem>
                    <SelectItem value="1year">Last year</SelectItem>
                  </SelectContent>
                </Select>

                {hasActiveFilters && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="h-10"
                  >
                    <X className="mr-2 h-4 w-4" />
                    Clear filters
                  </Button>
                )}
              </div>

              <div className="flex items-center justify-between rounded-lg border bg-muted/50 p-3">
                <div className="flex items-center gap-4">
                  <div>
                    <p className="text-sm font-medium">Total Spent</p>
                    <p className="text-2xl font-bold">
                      £{(totalSpent / 100).toFixed(2)}
                    </p>
                  </div>
                  <div className="h-10 w-px bg-border" />
                  <div>
                    <p className="text-sm font-medium">Transactions</p>
                    <p className="text-2xl font-bold">{filteredPayments.length}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment List */}
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-2">
                {/* Table Header */}
                <div className="grid grid-cols-12 gap-4 border-b pb-2 text-sm font-medium text-muted-foreground">
                  <div
                    className="col-span-3 flex cursor-pointer items-center gap-1 hover:text-foreground"
                    onClick={() => toggleSort("date")}
                  >
                    Date
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                  <div className="col-span-4">Description</div>
                  <div
                    className="col-span-2 flex cursor-pointer items-center gap-1 hover:text-foreground"
                    onClick={() => toggleSort("amount")}
                  >
                    Amount
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                  <div className="col-span-2">Status</div>
                  <div className="col-span-1">Actions</div>
                </div>

                {/* Payments */}
                {filteredPayments.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <FileText className="mb-3 h-12 w-12 text-muted-foreground" />
                    <p className="text-sm font-medium">No payments found</p>
                    <p className="text-sm text-muted-foreground">
                      Try adjusting your filters
                    </p>
                  </div>
                ) : (
                  filteredPayments.map((payment) => (
                    <PaymentRow key={payment.id} payment={payment} />
                  ))
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="calendar" className="space-y-4">
            <div className="flex h-[500px] items-center justify-center rounded-lg border border-dashed">
              <div className="text-center">
                <Calendar className="mx-auto mb-3 h-12 w-12 text-muted-foreground" />
                <p className="text-sm font-medium">Calendar View</p>
                <p className="text-sm text-muted-foreground">
                  Visual payment calendar coming soon
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

function PaymentRow({ payment }: { payment: PaymentHistoryItem }) {
  const [isDownloading, setIsDownloading] = useState(false)

  const handleDownload = () => {
    setIsDownloading(true)
    setTimeout(() => {
      setIsDownloading(false)
      toast.success("Receipt downloaded")
    }, 1000)
  }

  const handleRetry = () => {
    toast.info("Redirecting to payment...")
  }

  return (
    <div className="grid grid-cols-12 items-center gap-4 rounded-lg border p-3 text-sm hover:bg-accent">
      <div className="col-span-3">
        <p className="font-medium">
          {new Date(payment.date).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </p>
        <p className="text-xs text-muted-foreground">{payment.receiptNumber}</p>
      </div>
      <div className="col-span-4">
        <p className="font-medium">{payment.description}</p>
        <PaymentMethodDisplay payment={payment} />
      </div>
      <div className="col-span-2">
        <p className="font-semibold">£{(payment.amount / 100).toFixed(2)}</p>
      </div>
      <div className="col-span-2">
        <PaymentStatusBadge status={payment.status} />
        {payment.status === "refunded" && payment.refundDate && (
          <p className="mt-1 text-xs text-muted-foreground">
            Refunded {new Date(payment.refundDate).toLocaleDateString("en-GB")}
          </p>
        )}
      </div>
      <div className="col-span-1 flex justify-end">
        {payment.status === "completed" && (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDownload}
            isLoading={isDownloading}
            className="h-8 w-8"
          >
            <Download className="h-4 w-4" />
          </Button>
        )}
        {payment.status === "failed" && (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleRetry}
            className="h-8 w-8"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  )
}

function PaymentMethodDisplay({ payment }: { payment: PaymentHistoryItem }) {
  const { paymentMethod } = payment

  if (paymentMethod.type === "card" && paymentMethod.brand) {
    const brandName =
      paymentMethod.brand.charAt(0).toUpperCase() + paymentMethod.brand.slice(1)
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

function PaymentStatusBadge({
  status,
}: {
  status: PaymentHistoryItem["status"]
}) {
  const config = {
    completed: {
      label: "Paid",
      icon: CheckCircle2,
      className:
        "border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950/30 dark:text-green-400",
    },
    pending: {
      label: "Pending",
      icon: Clock,
      className:
        "border-yellow-200 bg-yellow-50 text-yellow-700 dark:border-yellow-800 dark:bg-yellow-950/30 dark:text-yellow-400",
    },
    failed: {
      label: "Failed",
      icon: XCircle,
      className:
        "border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950/30 dark:text-red-400",
    },
    refunded: {
      label: "Refunded",
      icon: AlertCircle,
      className:
        "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950/30 dark:text-blue-400",
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
