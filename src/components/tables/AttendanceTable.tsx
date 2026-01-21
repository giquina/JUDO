import type { ColumnDef } from "@tanstack/react-table"
import { DataTable, createActionColumn } from "@/components/DataTable"
import type { AttendanceRecord } from "@/types"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import {
  Pencil,
  Trash2,
  Clock,
  CheckCircle2,
  XCircle,
  FileText
} from "lucide-react"

interface AttendanceTableProps {
  data: AttendanceRecord[]
  isLoading?: boolean
  onEdit?: (record: AttendanceRecord) => void
  onDelete?: (record: AttendanceRecord) => void
  onViewDetails?: (record: AttendanceRecord) => void
  memberNames?: Record<string, string> // Map of memberId to member name
  classNames?: Record<string, string> // Map of classId to class name
}

const getStatusBadge = (status: string) => {
  const variants: Record<string, "default" | "secondary" | "destructive"> = {
    attended: "default",
    absent: "destructive",
    cancelled: "secondary",
  }

  const icons: Record<string, React.ReactNode> = {
    attended: <CheckCircle2 className="h-3 w-3 mr-1" />,
    absent: <XCircle className="h-3 w-3 mr-1" />,
    cancelled: <Clock className="h-3 w-3 mr-1" />,
  }

  return (
    <Badge variant={variants[status] || "outline"} className="capitalize flex items-center w-fit">
      {icons[status]}
      {status}
    </Badge>
  )
}

const formatDuration = (checkIn: number, checkOut?: number) => {
  if (!checkOut) return "In progress"

  const durationMs = checkOut - checkIn
  const minutes = Math.floor(durationMs / 1000 / 60)
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60

  if (hours > 0) {
    return `${hours}h ${remainingMinutes}m`
  }
  return `${minutes}m`
}

export default function AttendanceTable({
  data,
  isLoading,
  onEdit,
  onDelete,
  onViewDetails,
  memberNames = {},
  classNames = {},
}: AttendanceTableProps) {
  const columns: ColumnDef<AttendanceRecord>[] = [
    {
      accessorKey: "checkInTime",
      header: "Date & Time",
      cell: ({ row }) => {
        const date = new Date(row.getValue("checkInTime"))
        return (
          <div className="flex flex-col">
            <span className="font-medium">{format(date, "MMM d, yyyy")}</span>
            <span className="text-xs text-muted-foreground">{format(date, "h:mm a")}</span>
          </div>
        )
      },
    },
    {
      accessorKey: "memberId",
      header: "Member",
      cell: ({ row }) => {
        const memberId = row.getValue<string>("memberId")
        const memberName = memberNames[memberId] || "Unknown Member"
        return (
          <div className="font-medium">{memberName}</div>
        )
      },
    },
    {
      accessorKey: "classId",
      header: "Class",
      cell: ({ row }) => {
        const classId = row.getValue<string>("classId")
        const className = classNames[classId] || "Unknown Class"
        return (
          <div className="text-muted-foreground">{className}</div>
        )
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => getStatusBadge(row.getValue("status")),
    },
    {
      id: "duration",
      header: "Duration",
      cell: ({ row }) => {
        const checkIn = row.original.checkInTime
        const checkOut = row.original.checkOutTime
        return (
          <div className="text-sm text-muted-foreground">
            {formatDuration(checkIn, checkOut)}
          </div>
        )
      },
    },
    {
      accessorKey: "manualOverride",
      header: "Type",
      cell: ({ row }) => {
        const isManual = row.getValue<boolean>("manualOverride")
        return (
          <Badge variant={isManual ? "secondary" : "outline"} className="text-xs">
            {isManual ? "Manual" : "QR Check-in"}
          </Badge>
        )
      },
    },
    {
      accessorKey: "notes",
      header: "Notes",
      cell: ({ row }) => {
        const notes = row.getValue<string>("notes")
        return notes ? (
          <div className="text-xs text-muted-foreground max-w-[200px] truncate">
            {notes}
          </div>
        ) : (
          <span className="text-muted-foreground text-xs">—</span>
        )
      },
    },
    createActionColumn<AttendanceRecord>([
      {
        label: "View Details",
        icon: <FileText className="h-4 w-4" />,
        onClick: (record) => onViewDetails?.(record),
      },
      {
        label: "Edit Record",
        icon: <Pencil className="h-4 w-4" />,
        onClick: (record) => onEdit?.(record),
      },
      {
        label: "Delete Record",
        icon: <Trash2 className="h-4 w-4" />,
        onClick: (record) => onDelete?.(record),
        variant: "destructive",
      },
    ]),
  ]

  const bulkActions = [
    {
      label: "Export Selected",
      onClick: (rows: any[]) => {
        console.log("Export attendance:", rows.map(row => row.original))
      },
    },
    {
      label: "Mark as Absent",
      onClick: (rows: any[]) => {
        console.log("Mark absent:", rows.map(row => row.original))
      },
      variant: "destructive" as const,
    },
  ]

  return (
    <DataTable
      columns={columns}
      data={data}
      isLoading={isLoading}
      searchPlaceholder="Search attendance records..."
      bulkActions={bulkActions}
      emptyStateTitle="No attendance records"
      emptyStateDescription="Attendance records will appear here when members check in to classes"
      defaultPageSize={50}
    />
  )
}
