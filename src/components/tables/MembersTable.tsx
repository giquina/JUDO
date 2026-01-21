import type { ColumnDef } from "@tanstack/react-table"
import { DataTable, createActionColumn } from "@/components/DataTable"
import type { Member } from "@/types"
import { Badge } from "@/components/ui/badge"
import BeltBadge from "@/components/BeltBadge"
import { format } from "date-fns"
import {
  Mail,
  Pencil,
  Trash2,
  CreditCard,
  FileText
} from "lucide-react"

interface MembersTableProps {
  data: Member[]
  isLoading?: boolean
  onEdit?: (member: Member) => void
  onDelete?: (member: Member) => void
  onViewDetails?: (member: Member) => void
  onManageSubscription?: (member: Member) => void
  onEmail?: (member: Member) => void
}

const getSubscriptionStatusBadge = (status: string) => {
  const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
    active: "default",
    inactive: "destructive",
    paused: "secondary",
  }
  return (
    <Badge variant={variants[status] || "outline"} className="capitalize">
      {status}
    </Badge>
  )
}

const getTierBadge = (tier: string) => {
  const colors: Record<string, string> = {
    premium: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
    standard: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    student: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    none: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
  }
  return (
    <Badge className={colors[tier] || colors.none}>
      {tier === "none" ? "No subscription" : tier}
    </Badge>
  )
}

export default function MembersTable({
  data,
  isLoading,
  onEdit,
  onDelete,
  onViewDetails,
  onManageSubscription,
  onEmail,
}: MembersTableProps) {
  const columns: ColumnDef<Member>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("name")}</div>
      ),
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => (
        <div className="text-muted-foreground">{row.getValue("email")}</div>
      ),
    },
    {
      accessorKey: "beltRank",
      header: "Belt",
      cell: ({ row }) => (
        <BeltBadge rank={row.getValue("beltRank")} />
      ),
    },
    {
      accessorKey: "subscriptionStatus",
      header: "Status",
      cell: ({ row }) => getSubscriptionStatusBadge(row.getValue("subscriptionStatus")),
    },
    {
      accessorKey: "subscriptionTier",
      header: "Tier",
      cell: ({ row }) => getTierBadge(row.getValue("subscriptionTier")),
    },
    {
      accessorKey: "totalSessions",
      header: "Sessions",
      cell: ({ row }) => (
        <div className="text-center font-medium">
          {row.getValue("totalSessions")}
        </div>
      ),
    },
    {
      accessorKey: "joinDate",
      header: "Joined",
      cell: ({ row }) => {
        const date = new Date(row.getValue("joinDate"))
        return <div className="text-muted-foreground">{format(date, "MMM d, yyyy")}</div>
      },
    },
    createActionColumn<Member>([
      {
        label: "View Details",
        icon: <FileText className="h-4 w-4" />,
        onClick: (member) => onViewDetails?.(member),
      },
      {
        label: "Edit Member",
        icon: <Pencil className="h-4 w-4" />,
        onClick: (member) => onEdit?.(member),
      },
      {
        label: "Manage Subscription",
        icon: <CreditCard className="h-4 w-4" />,
        onClick: (member) => onManageSubscription?.(member),
      },
      {
        label: "Send Email",
        icon: <Mail className="h-4 w-4" />,
        onClick: (member) => onEmail?.(member),
      },
      {
        label: "Delete Member",
        icon: <Trash2 className="h-4 w-4" />,
        onClick: (member) => onDelete?.(member),
        variant: "destructive",
      },
    ]),
  ]

  const bulkActions = [
    {
      label: "Email Selected",
      icon: <Mail className="mr-2 h-4 w-4" />,
      onClick: (rows: any[]) => {
        const emails = rows.map(row => row.original.email)
        console.log("Email to:", emails)
      },
    },
    {
      label: "Export Selected",
      onClick: (rows: any[]) => {
        console.log("Export:", rows.map(row => row.original))
      },
    },
  ]

  return (
    <DataTable
      columns={columns}
      data={data}
      isLoading={isLoading}
      searchPlaceholder="Search members..."
      bulkActions={bulkActions}
      emptyStateTitle="No members yet"
      emptyStateDescription="Get started by adding your first member to the club"
      onRowClick={onViewDetails}
    />
  )
}
