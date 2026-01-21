// Barrel export for all table components
export { default as MembersTable } from "./MembersTable"
export { default as PaymentsTable } from "./PaymentsTable"
export { default as AttendanceTable } from "./AttendanceTable"
export { default as ClassesTable } from "./ClassesTable"

// Re-export DataTable for convenience
export { DataTable, createActionColumn, createSortableColumn } from "../DataTable"
export type { DataTableProps, DataTableDensity, BulkAction } from "../DataTable"
