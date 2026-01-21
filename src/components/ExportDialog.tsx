import { useState } from "react"
import { Download, FileText, FileSpreadsheet, File as FileIcon, Loader2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { FilterDateRange } from "./filters/FilterDateRange"
import { motion } from "framer-motion"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

type ExportFormat = "csv" | "excel" | "pdf"

interface ExportColumn {
  id: string
  label: string
  enabled: boolean
}

interface ExportDialogProps {
  title?: string
  defaultColumns: string[]
  onExport?: (format: ExportFormat, columns: string[], dateRange?: { start?: Date; end?: Date }) => void
  children?: React.ReactNode
}

export function ExportDialog({
  title = "Export Data",
  defaultColumns,
  onExport,
  children,
}: ExportDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>("csv")
  const [isExporting, setIsExporting] = useState(false)
  const [startDate, setStartDate] = useState<Date | undefined>()
  const [endDate, setEndDate] = useState<Date | undefined>()

  const [columns, setColumns] = useState<ExportColumn[]>(
    defaultColumns.map((col) => ({
      id: col.toLowerCase().replace(/\s+/g, "_"),
      label: col,
      enabled: true,
    }))
  )

  const formats = [
    {
      id: "csv" as const,
      label: "CSV",
      description: "Comma-separated values",
      icon: FileText,
    },
    {
      id: "excel" as const,
      label: "Excel",
      description: "Microsoft Excel format",
      icon: FileSpreadsheet,
    },
    {
      id: "pdf" as const,
      label: "PDF",
      description: "Portable document format",
      icon: FileIcon,
    },
  ]

  const toggleColumn = (columnId: string) => {
    setColumns((prev) =>
      prev.map((col) =>
        col.id === columnId ? { ...col, enabled: !col.enabled } : col
      )
    )
  }

  const selectAllColumns = () => {
    setColumns((prev) => prev.map((col) => ({ ...col, enabled: true })))
  }

  const deselectAllColumns = () => {
    setColumns((prev) => prev.map((col) => ({ ...col, enabled: false })))
  }

  const handleExport = async () => {
    const enabledColumns = columns.filter((col) => col.enabled).map((col) => col.id)

    if (enabledColumns.length === 0) {
      toast.error("Please select at least one column to export")
      return
    }

    setIsExporting(true)

    // Simulate export process
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const dateRange = startDate || endDate ? { start: startDate, end: endDate } : undefined

    onExport?.(selectedFormat, enabledColumns, dateRange)

    toast.success(`Exported as ${selectedFormat.toUpperCase()}`, {
      description: `${enabledColumns.length} columns exported successfully`,
    })

    setIsExporting(false)
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Choose your export format, select columns, and set date range.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Format Selection */}
          <div className="space-y-3">
            <Label>Export Format</Label>
            <div className="grid grid-cols-3 gap-3">
              {formats.map((format) => {
                const Icon = format.icon
                return (
                  <button
                    key={format.id}
                    onClick={() => setSelectedFormat(format.id)}
                    className={cn(
                      "flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-all hover:border-primary/50",
                      selectedFormat === format.id
                        ? "border-primary bg-primary/5"
                        : "border-muted"
                    )}
                  >
                    <Icon
                      className={cn(
                        "h-6 w-6",
                        selectedFormat === format.id
                          ? "text-primary"
                          : "text-muted-foreground"
                      )}
                    />
                    <div className="text-center">
                      <p className="font-medium text-sm">{format.label}</p>
                      <p className="text-xs text-muted-foreground">
                        {format.description}
                      </p>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Date Range */}
          <div className="space-y-3">
            <Label>Date Range (Optional)</Label>
            <FilterDateRange
              startDate={startDate}
              endDate={endDate}
              onStartDateChange={setStartDate}
              onEndDateChange={setEndDate}
            />
          </div>

          {/* Column Selection */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Select Columns</Label>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs"
                  onClick={selectAllColumns}
                >
                  Select All
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs"
                  onClick={deselectAllColumns}
                >
                  Clear
                </Button>
              </div>
            </div>

            <div className="max-h-[200px] overflow-y-auto rounded-lg border p-3 space-y-2">
              {columns.map((column, index) => (
                <motion.div
                  key={column.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.02 }}
                  className="flex items-center gap-3 p-2 rounded-md hover:bg-accent cursor-pointer"
                  onClick={() => toggleColumn(column.id)}
                >
                  <Checkbox
                    id={column.id}
                    checked={column.enabled}
                    onCheckedChange={() => toggleColumn(column.id)}
                  />
                  <Label
                    htmlFor={column.id}
                    className="flex-1 cursor-pointer font-normal"
                  >
                    {column.label}
                  </Label>
                </motion.div>
              ))}
            </div>

            <p className="text-xs text-muted-foreground">
              {columns.filter((col) => col.enabled).length} of {columns.length}{" "}
              columns selected
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleExport} disabled={isExporting} className="gap-2">
            {isExporting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                Export
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
