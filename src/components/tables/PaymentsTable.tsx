import type { ColumnDef } from "@tanstack/react-table"
import { DataTable, createActionColumn } from "@/components/DataTable"
import type { Payment } from "@/types"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import {
  Download,
  RefreshCcw,
  Eye,
  Mail
} from "lucide-react"

interface PaymentsTableProps {
  data: Payment[]
  isLoading?: boolean
  onViewReceipt?: (payment: Payment) => void
  onRefund?: (payment: Payment) => void
  onResend?: (payment: Payment) => void
}

const getPaymentStatusBadge = (status: string) => {
  const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
    completed: "default",
    pending: "secondary",
    failed: "destructive",
    refunded: "outline",
  }

  return (
    <Badge variant={variants[status] || "outline"} className="capitalize">
      {status}
    </Badge>
  )
}

const getPaymentTypeBadge = (type: string) => {
  const colors: Record<string, string> = {
    subscription: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    session: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  }

  return (
    <Badge className={colors[type] || ""}>
      {type === "subscription" ? "Subscription" : "Single Session"}
    </Badge>
  )
}

const formatCurrency = (amount: number, currency: string = "GBP") => {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency,
  }).format(amount / 100) // Convert from pence to pounds
}

export default function PaymentsTable({
  data,
  isLoading,
  onViewReceipt,
  onRefund,
  onResend,
}: PaymentsTableProps) {
  const columns: ColumnDef<Payment>[] = [
    {
      accessorKey: "_id",
      header: "Transaction ID",
      cell: ({ row }) => (
        <div className="font-mono text-xs text-muted-foreground">
          {row.getValue<string>("_id").slice(0, 8)}...
        </div>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Date",
      cell: ({ row }) => {
        const date = new Date(row.getValue("createdAt"))
        return (
          <div className="flex flex-col">
            <span className="font-medium">{format(date, "MMM d, yyyy")}</span>
            <span className="text-xs text-muted-foreground">{format(date, "h:mm a")}</span>
          </div>
        )
      },
    },
    {
      accessorKey: "amount",
      header: "Amount",
      cell: ({ row }) => {
        const amount = row.getValue<number>("amount")
        const currency = row.original.currency
        return (
          <div className="font-semibold">
            {formatCurrency(amount, currency)}
          </div>
        )
      },
    },
    {
      accessorKey: "paymentType",
      header: "Type",
      cell: ({ row }) => getPaymentTypeBadge(row.getValue("paymentType")),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => getPaymentStatusBadge(row.getValue("status")),
    },
    {
      accessorKey: "subscriptionPeriodStart",
      header: "Period",
      cell: ({ row }) => {
        const start = row.getValue<number>("subscriptionPeriodStart")
        const end = row.original.subscriptionPeriodEnd

        if (!start || !end) {
          return <span className="text-muted-foreground text-xs">Single payment</span>
        }

        return (
          <div className="text-xs text-muted-foreground">
            {format(new Date(start), "MMM d")} - {format(new Date(end), "MMM d, yyyy")}
          </div>
        )
      },
    },
    {
      accessorKey: "receipt",
      header: "Receipt",
      cell: ({ row }) => {
        const receipt = row.getValue<string>("receipt")
        return receipt ? (
          <Badge variant="outline" className="text-xs">
            Available
          </Badge>
        ) : (
          <span className="text-muted-foreground text-xs">N/A</span>
        )
      },
    },
    createActionColumn<Payment>([
      {
        label: "View Receipt",
        icon: <Eye className="h-4 w-4" />,
        onClick: (payment) => onViewReceipt?.(payment),
      },
      {
        label: "Download Receipt",
        icon: <Download className="h-4 w-4" />,
        onClick: (payment) => {
          console.log("Download receipt:", payment._id)
        },
      },
      {
        label: "Resend Receipt",
        icon: <Mail className="h-4 w-4" />,
        onClick: (payment) => onResend?.(payment),
      },
      {
        label: "Issue Refund",
        icon: <RefreshCcw className="h-4 w-4" />,
        onClick: (payment) => onRefund?.(payment),
        variant: "destructive",
      },
    ]),
  ]

  const bulkActions = [
    {
      label: "Export Selected",
      icon: <Download className="mr-2 h-4 w-4" />,
      onClick: (rows: any[]) => {
        console.log("Export payments:", rows.map(row => row.original))
      },
    },
  ]

  return (
    <DataTable
      columns={columns}
      data={data}
      isLoading={isLoading}
      searchPlaceholder="Search transactions..."
      bulkActions={bulkActions}
      emptyStateTitle="No payments yet"
      emptyStateDescription="Payment history will appear here once members start making payments"
      defaultPageSize={50}
    />
  )
}
