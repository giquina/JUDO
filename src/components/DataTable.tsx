import * as React from "react"
import type {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  Row,
} from "@tanstack/react-table"
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import {
  ArrowUpDown,
  ChevronDown,
  Download,
  MoreHorizontal,
  Search,
  Settings2,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import EmptyState from "@/components/EmptyState"

// Types
export type DataTableDensity = "compact" | "comfortable" | "spacious"

export interface BulkAction<TData> {
  label: string
  icon?: React.ReactNode
  onClick: (rows: Row<TData>[]) => void
  variant?: "default" | "destructive"
}

export interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  searchKey?: string
  searchPlaceholder?: string
  onRowClick?: (row: TData) => void
  bulkActions?: BulkAction<TData>[]
  isLoading?: boolean
  emptyStateTitle?: string
  emptyStateDescription?: string
  emptyStateAction?: React.ReactNode
  enableRowSelection?: boolean
  enableMultiSort?: boolean
  enableColumnVisibility?: boolean
  enableDensity?: boolean
  enableExport?: boolean
  defaultPageSize?: number
  pageSizeOptions?: number[]
  stickyHeader?: boolean
  alternatingRows?: boolean
  className?: string
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchPlaceholder = "Search...",
  onRowClick,
  bulkActions = [],
  isLoading = false,
  emptyStateTitle = "No results found",
  emptyStateDescription = "Try adjusting your search or filter to find what you're looking for",
  emptyStateAction,
  enableRowSelection = true,
  enableMultiSort = true,
  enableColumnVisibility = true,
  enableDensity = true,
  enableExport = true,
  defaultPageSize = 25,
  pageSizeOptions = [25, 50, 100],
  stickyHeader = true,
  alternatingRows = true,
  className,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [density, setDensity] = React.useState<DataTableDensity>("comfortable")
  const [globalFilter, setGlobalFilter] = React.useState("")

  // Add selection column if enabled
  const tableColumns = React.useMemo(() => {
    if (!enableRowSelection) return columns

    const selectionColumn: ColumnDef<TData> = {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    }

    return [selectionColumn, ...columns]
  }, [columns, enableRowSelection])

  const table = useReactTable({
    data,
    columns: tableColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: "includesString",
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
    },
    enableMultiSort,
    initialState: {
      pagination: {
        pageSize: defaultPageSize,
      },
    },
  })

  const selectedRows = table.getFilteredSelectedRowModel().rows

  // Export functionality (placeholder)
  const handleExport = (format: "csv" | "excel") => {
    console.log(`Exporting as ${format}...`)
    // Placeholder for actual export logic
    const exportData = table.getFilteredRowModel().rows.map((row) => row.original)
    console.log("Export data:", exportData)
  }

  // Density classes
  const densityClasses = {
    compact: "text-xs",
    comfortable: "text-sm",
    spacious: "text-base",
  }

  const cellPaddingClasses = {
    compact: "p-2",
    comfortable: "p-4",
    spacious: "p-6",
  }

  const rowHeightClasses = {
    compact: "h-10",
    comfortable: "h-14",
    spacious: "h-16",
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-[300px]" />
          <div className="flex gap-2">
            <Skeleton className="h-10 w-[100px]" />
            <Skeleton className="h-10 w-[100px]" />
          </div>
        </div>
        <div className="rounded-md border">
          <div className="p-4 space-y-3">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        {/* Search */}
        <div className="relative w-full sm:max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={searchPlaceholder}
            value={globalFilter ?? ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="pl-9 pr-9"
          />
          {globalFilter && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
              onClick={() => setGlobalFilter("")}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* Export */}
          {enableExport && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Export as</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleExport("csv")}>
                  CSV
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport("excel")}>
                  Excel
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Density */}
          {enableDensity && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Settings2 className="mr-2 h-4 w-4" />
                  Density
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Row density</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup value={density} onValueChange={(value) => setDensity(value as DataTableDensity)}>
                  <DropdownMenuRadioItem value="compact">Compact</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="comfortable">Comfortable</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="spacious">Spacious</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Column Visibility */}
          {enableColumnVisibility && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  Columns <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px]">
                <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {table
                  .getAllColumns()
                  .filter(
                    (column) =>
                      typeof column.accessorFn !== "undefined" && column.getCanHide()
                  )
                  .map((column) => {
                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) =>
                          column.toggleVisibility(!!value)
                        }
                      >
                        {column.id}
                      </DropdownMenuCheckboxItem>
                    )
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      {/* Bulk Actions Toolbar */}
      {selectedRows.length > 0 && bulkActions.length > 0 && (
        <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border animate-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium">
              {selectedRows.length} row(s) selected
            </p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => table.toggleAllPageRowsSelected(false)}
            >
              Clear
            </Button>
          </div>
          <div className="flex items-center gap-2">
            {bulkActions.map((action, index) => (
              <Button
                key={index}
                variant={action.variant || "default"}
                size="sm"
                onClick={() => action.onClick(selectedRows)}
              >
                {action.icon}
                {action.label}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Table */}
      <div className={cn(
        "rounded-md border overflow-hidden",
        stickyHeader && "max-h-[600px] overflow-y-auto"
      )}>
        {data.length === 0 && !globalFilter ? (
          <div className="p-8">
            <EmptyState
              title={emptyStateTitle}
              description={emptyStateDescription}
            />
            {emptyStateAction && (
              <div className="flex justify-center mt-4">
                {emptyStateAction}
              </div>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table className={densityClasses[density]}>
              <TableHeader className={stickyHeader ? "sticky top-0 z-10 bg-background" : ""}>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead
                          key={header.id}
                          className={cn(
                            cellPaddingClasses[density],
                            header.column.getCanSort() && "cursor-pointer select-none"
                          )}
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {header.isPlaceholder ? null : (
                            <div className="flex items-center gap-2">
                              {flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                              {header.column.getCanSort() && (
                                <ArrowUpDown className="h-4 w-4" />
                              )}
                              {header.column.getIsSorted() === "asc" && (
                                <span className="text-xs">↑</span>
                              )}
                              {header.column.getIsSorted() === "desc" && (
                                <span className="text-xs">↓</span>
                              )}
                            </div>
                          )}
                        </TableHead>
                      )
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row, index) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                      onClick={() => onRowClick?.(row.original)}
                      className={cn(
                        rowHeightClasses[density],
                        onRowClick && "cursor-pointer",
                        alternatingRows && index % 2 === 1 && "bg-muted/30"
                      )}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell
                          key={cell.id}
                          className={cellPaddingClasses[density]}
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={tableColumns.length}
                      className="h-24 text-center"
                    >
                      <EmptyState
                        title="No results found"
                        description="Try adjusting your search"
                      />
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {data.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>
              {table.getFilteredSelectedRowModel().rows.length} of{" "}
              {table.getFilteredRowModel().rows.length} row(s) selected
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Rows per page</span>
              <select
                value={table.getState().pagination.pageSize}
                onChange={(e) => {
                  table.setPageSize(Number(e.target.value))
                }}
                className="h-8 w-[70px] rounded-md border border-input bg-background px-2 text-sm"
              >
                {pageSizeOptions.map((pageSize) => (
                  <option key={pageSize} value={pageSize}>
                    {pageSize}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Page {table.getState().pagination.pageIndex + 1} of{" "}
                {table.getPageCount()}
              </span>
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                >
                  Next
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Reusable column helpers
export function createSortableColumn<TData>(
  accessorKey: string,
  header: string
): ColumnDef<TData> {
  return {
    accessorKey,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="-ml-4"
        >
          {header}
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  }
}

export function createActionColumn<TData>(
  actions: Array<{
    label: string
    icon?: React.ReactNode
    onClick: (row: TData) => void
    variant?: "default" | "destructive"
  }>
): ColumnDef<TData> {
  return {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {actions.map((action, index) => (
              <DropdownMenuItem
                key={index}
                onClick={() => action.onClick(row.original)}
                className={action.variant === "destructive" ? "text-destructive" : ""}
              >
                {action.icon && <span className="mr-2">{action.icon}</span>}
                {action.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  }
}
