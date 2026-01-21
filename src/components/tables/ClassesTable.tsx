import type { ColumnDef } from "@tanstack/react-table"
import { DataTable, createActionColumn } from "@/components/DataTable"
import type { JudoClass } from "@/types"
import { Badge } from "@/components/ui/badge"
import {
  Pencil,
  Trash2,
  MapPin,
  QrCode,
  Eye,
  ToggleLeft,
  ToggleRight
} from "lucide-react"

interface ClassesTableProps {
  data: JudoClass[]
  isLoading?: boolean
  onEdit?: (judoClass: JudoClass) => void
  onDelete?: (judoClass: JudoClass) => void
  onViewDetails?: (judoClass: JudoClass) => void
  onToggleActive?: (judoClass: JudoClass) => void
  onGenerateQR?: (judoClass: JudoClass) => void
  coachNames?: Record<string, string> // Map of coachId to coach name
}

const getLevelBadge = (level: string) => {
  const colors: Record<string, string> = {
    beginner: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    intermediate: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    advanced: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
    mixed: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
  }

  return (
    <Badge className={colors[level] || colors.mixed}>
      {level.charAt(0).toUpperCase() + level.slice(1)}
    </Badge>
  )
}

const getCapacityBadge = (current: number, max: number) => {
  const percentage = (current / max) * 100
  let variant: "default" | "secondary" | "destructive" = "default"

  if (percentage >= 90) {
    variant = "destructive"
  } else if (percentage >= 70) {
    variant = "secondary"
  }

  return (
    <Badge variant={variant}>
      {current}/{max}
    </Badge>
  )
}

const getDayBadge = (day: string) => {
  const today = new Date().toLocaleDateString("en-US", { weekday: "long" })
  const isToday = day === today

  return (
    <Badge variant={isToday ? "default" : "outline"} className="font-medium">
      {day}
    </Badge>
  )
}

export default function ClassesTable({
  data,
  isLoading,
  onEdit,
  onDelete,
  onViewDetails,
  onToggleActive,
  onGenerateQR,
  coachNames = {},
}: ClassesTableProps) {
  const columns: ColumnDef<JudoClass>[] = [
    {
      accessorKey: "name",
      header: "Class Name",
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("name")}</div>
      ),
    },
    {
      accessorKey: "dayOfWeek",
      header: "Day",
      cell: ({ row }) => getDayBadge(row.getValue("dayOfWeek")),
    },
    {
      id: "time",
      header: "Time",
      cell: ({ row }) => {
        const startTime = row.original.startTime
        const endTime = row.original.endTime
        return (
          <div className="text-sm text-muted-foreground">
            {startTime} - {endTime}
          </div>
        )
      },
    },
    {
      accessorKey: "coachId",
      header: "Coach",
      cell: ({ row }) => {
        const coachId = row.getValue<string>("coachId")
        const coachName = coachNames[coachId] || "Unassigned"
        return (
          <div className="text-muted-foreground">{coachName}</div>
        )
      },
    },
    {
      accessorKey: "level",
      header: "Level",
      cell: ({ row }) => getLevelBadge(row.getValue("level")),
    },
    {
      id: "capacity",
      header: "Capacity",
      cell: ({ row }) => {
        const current = row.original.currentAttendance
        const max = row.original.maxCapacity
        return getCapacityBadge(current, max)
      },
    },
    {
      accessorKey: "location",
      header: "Location",
      cell: ({ row }) => (
        <div className="flex items-center text-sm text-muted-foreground">
          <MapPin className="h-3 w-3 mr-1" />
          {row.getValue("location")}
        </div>
      ),
    },
    {
      accessorKey: "active",
      header: "Status",
      cell: ({ row }) => {
        const isActive = row.getValue<boolean>("active")
        return (
          <Badge variant={isActive ? "default" : "secondary"}>
            {isActive ? "Active" : "Inactive"}
          </Badge>
        )
      },
    },
    createActionColumn<JudoClass>([
      {
        label: "View Details",
        icon: <Eye className="h-4 w-4" />,
        onClick: (judoClass) => onViewDetails?.(judoClass),
      },
      {
        label: "Generate QR Code",
        icon: <QrCode className="h-4 w-4" />,
        onClick: (judoClass) => onGenerateQR?.(judoClass),
      },
      {
        label: "Edit Class",
        icon: <Pencil className="h-4 w-4" />,
        onClick: (judoClass) => onEdit?.(judoClass),
      },
      {
        label: "Toggle Active/Inactive",
        icon: <ToggleRight className="h-4 w-4" />,
        onClick: (judoClass) => onToggleActive?.(judoClass),
      },
      {
        label: "Delete Class",
        icon: <Trash2 className="h-4 w-4" />,
        onClick: (judoClass) => onDelete?.(judoClass),
        variant: "destructive",
      },
    ]),
  ]

  const bulkActions = [
    {
      label: "Activate Selected",
      icon: <ToggleRight className="mr-2 h-4 w-4" />,
      onClick: (rows: any[]) => {
        console.log("Activate classes:", rows.map(row => row.original))
      },
    },
    {
      label: "Deactivate Selected",
      icon: <ToggleLeft className="mr-2 h-4 w-4" />,
      onClick: (rows: any[]) => {
        console.log("Deactivate classes:", rows.map(row => row.original))
      },
      variant: "destructive" as const,
    },
    {
      label: "Export Selected",
      onClick: (rows: any[]) => {
        console.log("Export classes:", rows.map(row => row.original))
      },
    },
  ]

  return (
    <DataTable
      columns={columns}
      data={data}
      isLoading={isLoading}
      searchPlaceholder="Search classes..."
      bulkActions={bulkActions}
      emptyStateTitle="No classes scheduled"
      emptyStateDescription="Create your first class to get started with scheduling"
      onRowClick={onViewDetails}
    />
  )
}
