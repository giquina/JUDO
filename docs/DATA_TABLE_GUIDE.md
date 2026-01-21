# DataTable Component System - Complete Guide

> Production-ready, reusable data tables with advanced features for the JUDO Club App

---

## Table of Contents

1. [Overview](#overview)
2. [Installation](#installation)
3. [Core Features](#core-features)
4. [Quick Start](#quick-start)
5. [Component API](#component-api)
6. [Pre-built Tables](#pre-built-tables)
7. [Customization](#customization)
8. [Advanced Usage](#advanced-usage)
9. [Examples](#examples)

---

## Overview

The DataTable system provides a comprehensive, production-ready solution for displaying and managing tabular data. Built on TanStack Table v8, it offers a rich set of features while maintaining ease of use.

### Key Benefits

- **Fully Featured**: Sorting, filtering, pagination, selection, export, and more
- **Type-Safe**: Full TypeScript support with generic types
- **Responsive**: Adapts to different screen sizes
- **Accessible**: Built with accessibility in mind
- **Customizable**: Highly configurable with sensible defaults
- **Performance**: Optimized for large datasets

---

## Installation

The DataTable dependencies have already been installed:

```bash
npm install @tanstack/react-table
```

All required UI components are also in place.

---

## Core Features

### Sorting & Filtering
- **Multi-column sorting**: Click headers to sort, hold Shift for multi-sort
- **Global search**: Filter across all columns simultaneously
- **Column-specific filters**: Custom filters per column (can be extended)

### Selection & Actions
- **Bulk selection**: Select multiple rows with checkboxes
- **Bulk actions toolbar**: Appears when rows are selected
- **Row actions menu**: Dropdown with actions for individual rows
- **Row click handlers**: Make entire rows clickable

### Customization
- **Column visibility**: Show/hide columns dynamically
- **Density options**: Compact, Comfortable, or Spacious layouts
- **Export functionality**: CSV and Excel export (UI ready, logic placeholder)
- **Custom styling**: Dark mode support, alternating rows, hover effects

### Pagination
- **Flexible page sizes**: 25, 50, 100 rows per page (configurable)
- **Page navigation**: Previous/Next buttons with page indicators
- **Selection tracking**: Shows selected rows across pagination

### States
- **Loading state**: Skeleton loaders while data fetches
- **Empty state**: Customizable message when no data
- **Error handling**: Graceful error displays (can be extended)

### UX
- **Sticky header**: Header stays visible on scroll
- **Responsive design**: Mobile-friendly with card layouts (ready for implementation)
- **Smooth animations**: Transitions for actions and state changes
- **Keyboard accessible**: Full keyboard navigation support

---

## Quick Start

### Basic Usage

```tsx
import { DataTable } from "@/components/DataTable"
import type { ColumnDef } from "@tanstack/react-table"

interface User {
  id: string
  name: string
  email: string
}

const columns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
]

function UsersTable({ users }: { users: User[] }) {
  return (
    <DataTable
      columns={columns}
      data={users}
      searchPlaceholder="Search users..."
    />
  )
}
```

### Using Pre-built Tables

```tsx
import { MembersTable } from "@/components/tables"

function MembersPage() {
  const { data, isLoading } = useQuery({ ... })

  return (
    <MembersTable
      data={data}
      isLoading={isLoading}
      onEdit={handleEdit}
      onDelete={handleDelete}
    />
  )
}
```

---

## Component API

### DataTable Props

```typescript
interface DataTableProps<TData, TValue> {
  // Required
  columns: ColumnDef<TData, TValue>[]  // Column definitions
  data: TData[]                         // Array of data objects

  // Optional - Search
  searchPlaceholder?: string            // Placeholder text for search input

  // Optional - Interactions
  onRowClick?: (row: TData) => void    // Handler for row clicks
  bulkActions?: BulkAction<TData>[]    // Actions for selected rows

  // Optional - States
  isLoading?: boolean                   // Show loading skeletons
  emptyStateTitle?: string              // Title when no data
  emptyStateDescription?: string        // Description when no data
  emptyStateAction?: React.ReactNode    // Action button when no data

  // Optional - Features (all default to true)
  enableRowSelection?: boolean          // Enable row checkboxes
  enableMultiSort?: boolean             // Enable multi-column sorting
  enableColumnVisibility?: boolean      // Enable column visibility toggle
  enableDensity?: boolean               // Enable density picker
  enableExport?: boolean                // Enable export dropdown

  // Optional - Pagination
  defaultPageSize?: number              // Default: 25
  pageSizeOptions?: number[]            // Default: [25, 50, 100]

  // Optional - Styling
  stickyHeader?: boolean                // Default: true
  alternatingRows?: boolean             // Default: true
  className?: string                    // Additional CSS classes
}
```

### BulkAction Type

```typescript
interface BulkAction<TData> {
  label: string                         // Action button label
  icon?: React.ReactNode                // Optional icon
  onClick: (rows: Row<TData>[]) => void // Handler receiving selected rows
  variant?: "default" | "destructive"   // Button style
}
```

---

## Pre-built Tables

### MembersTable

```tsx
<MembersTable
  data={members}
  isLoading={isLoading}
  onEdit={(member) => console.log("Edit", member)}
  onDelete={(member) => console.log("Delete", member)}
  onViewDetails={(member) => console.log("View", member)}
  onManageSubscription={(member) => console.log("Manage", member)}
  onEmail={(member) => console.log("Email", member)}
/>
```

**Features:**
- Belt rank badges
- Subscription status and tier
- Session count
- Join date
- Email and bulk email actions

### PaymentsTable

```tsx
<PaymentsTable
  data={payments}
  isLoading={isLoading}
  onViewReceipt={(payment) => console.log("View", payment)}
  onRefund={(payment) => console.log("Refund", payment)}
  onResend={(payment) => console.log("Resend", payment)}
/>
```

**Features:**
- Transaction IDs
- Payment amounts with currency formatting
- Payment types and status badges
- Subscription periods
- Receipt availability

### AttendanceTable

```tsx
<AttendanceTable
  data={attendance}
  isLoading={isLoading}
  onEdit={(record) => console.log("Edit", record)}
  onDelete={(record) => console.log("Delete", record)}
  onViewDetails={(record) => console.log("View", record)}
  memberNames={memberNamesMap}
  classNames={classNamesMap}
/>
```

**Features:**
- Check-in/check-out times
- Duration calculations
- Member and class name resolution
- Status badges (attended/absent/cancelled)
- Manual vs QR check-in indicators

### ClassesTable

```tsx
<ClassesTable
  data={classes}
  isLoading={isLoading}
  onEdit={(judoClass) => console.log("Edit", judoClass)}
  onDelete={(judoClass) => console.log("Delete", judoClass)}
  onViewDetails={(judoClass) => console.log("View", judoClass)}
  onToggleActive={(judoClass) => console.log("Toggle", judoClass)}
  onGenerateQR={(judoClass) => console.log("Generate QR", judoClass)}
  coachNames={coachNamesMap}
/>
```

**Features:**
- Day of week badges
- Time slots
- Coach name resolution
- Level badges
- Capacity indicators
- Active/inactive status
- QR code generation

---

## Customization

### Custom Columns

```tsx
const columns: ColumnDef<Member>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("name")}</div>
    ),
  },
  {
    id: "fullName",
    header: "Full Name",
    cell: ({ row }) => {
      const firstName = row.original.firstName
      const lastName = row.original.lastName
      return <div>{firstName} {lastName}</div>
    },
  },
]
```

### Custom Actions

```tsx
import { createActionColumn } from "@/components/DataTable"

const columns = [
  // ... other columns
  createActionColumn<Member>([
    {
      label: "View Profile",
      icon: <User className="h-4 w-4" />,
      onClick: (member) => navigate(`/members/${member.id}`),
    },
    {
      label: "Delete",
      icon: <Trash className="h-4 w-4" />,
      onClick: (member) => confirmDelete(member),
      variant: "destructive",
    },
  ]),
]
```

### Custom Bulk Actions

```tsx
const bulkActions = [
  {
    label: "Export Selected",
    icon: <Download className="mr-2 h-4 w-4" />,
    onClick: (rows) => {
      const data = rows.map(row => row.original)
      exportToCSV(data)
    },
  },
  {
    label: "Delete All",
    icon: <Trash className="mr-2 h-4 w-4" />,
    onClick: (rows) => {
      const ids = rows.map(row => row.original.id)
      bulkDelete(ids)
    },
    variant: "destructive",
  },
]
```

### Sortable Columns

```tsx
import { createSortableColumn } from "@/components/DataTable"

const columns = [
  createSortableColumn("name", "Name"),
  createSortableColumn("email", "Email"),
]
```

---

## Advanced Usage

### With React Query

```tsx
import { useQuery } from "@tanstack/react-query"
import { MembersTable } from "@/components/tables"

function MembersPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["members"],
    queryFn: fetchMembers,
  })

  if (error) {
    return <div>Error loading members</div>
  }

  return (
    <MembersTable
      data={data ?? []}
      isLoading={isLoading}
      onEdit={handleEdit}
      onDelete={handleDelete}
    />
  )
}
```

### With Convex

```tsx
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { MembersTable } from "@/components/tables"

function MembersPage() {
  const members = useQuery(api.members.list)

  return (
    <MembersTable
      data={members ?? []}
      isLoading={members === undefined}
      onEdit={handleEdit}
      onDelete={handleDelete}
    />
  )
}
```

### Custom Empty State

```tsx
<DataTable
  columns={columns}
  data={data}
  emptyStateTitle="No members found"
  emptyStateDescription="Add your first member to get started"
  emptyStateAction={
    <Button onClick={() => setShowAddDialog(true)}>
      Add Member
    </Button>
  }
/>
```

### Controlled State

```tsx
function CustomTable() {
  const [sorting, setSorting] = useState([])
  const [columnFilters, setColumnFilters] = useState([])

  // You can access and control table state
  // For full control, use useReactTable directly

  return <DataTable {...props} />
}
```

---

## Examples

### Complete Example with All Features

```tsx
import { MembersTable } from "@/components/tables"
import { useQuery, useMutation } from "@tanstack/react-query"
import { toast } from "sonner"

function MembersPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["members"],
    queryFn: fetchMembers,
  })

  const deleteMutation = useMutation({
    mutationFn: deleteMember,
    onSuccess: () => {
      toast.success("Member deleted")
      queryClient.invalidateQueries(["members"])
    },
  })

  return (
    <div className="container py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Members</h1>
        <p className="text-muted-foreground">
          Manage your judo club members
        </p>
      </div>

      <MembersTable
        data={data ?? []}
        isLoading={isLoading}
        onEdit={(member) => navigate(`/members/${member.id}/edit`)}
        onDelete={(member) => {
          if (confirm("Are you sure?")) {
            deleteMutation.mutate(member.id)
          }
        }}
        onViewDetails={(member) => navigate(`/members/${member.id}`)}
        onManageSubscription={(member) => {
          navigate(`/members/${member.id}/subscription`)
        }}
        onEmail={(member) => {
          window.location.href = `mailto:${member.email}`
        }}
      />
    </div>
  )
}
```

---

## Testing

A comprehensive demo page is available at `/src/pages/DataTableDemo.tsx`. To view it:

1. Add a route to your router:
```tsx
<Route path="/demo/tables" element={<DataTableDemo />} />
```

2. Visit `/demo/tables` in your browser

The demo includes:
- All four pre-built tables with mock data
- Feature overview
- Usage examples
- Code snippets

---

## File Structure

```
src/
├── components/
│   ├── DataTable.tsx              # Core DataTable component
│   ├── tables/
│   │   ├── index.ts               # Barrel exports
│   │   ├── MembersTable.tsx       # Members table
│   │   ├── PaymentsTable.tsx      # Payments table
│   │   ├── AttendanceTable.tsx    # Attendance table
│   │   └── ClassesTable.tsx       # Classes table
│   └── ui/
│       ├── checkbox.tsx           # Checkbox primitive
│       ├── dropdown-menu.tsx      # Dropdown menu primitive
│       └── table.tsx              # Table primitives
├── lib/
│   └── mockTableData.ts           # Mock data for testing
└── pages/
    └── DataTableDemo.tsx          # Demo page

docs/
└── DATA_TABLE_GUIDE.md            # This file
```

---

## Best Practices

### Performance
- Use pagination for large datasets (>100 rows)
- Consider virtual scrolling for massive datasets (>1000 rows)
- Memoize column definitions if they depend on props

### Accessibility
- Always provide meaningful labels
- Use semantic HTML
- Ensure keyboard navigation works

### UX
- Provide loading states
- Show empty states with clear actions
- Give feedback for actions (toasts, modals)
- Handle errors gracefully

### Type Safety
- Define your data types
- Use generic types for reusability
- Leverage TypeScript inference

---

## Troubleshooting

### Table not rendering
- Check that `data` is an array
- Verify `columns` are properly defined
- Check for console errors

### Sorting not working
- Ensure `accessorKey` matches your data keys
- Check that data is not undefined

### Selection not working
- Verify `enableRowSelection` is not false
- Check that rows have unique IDs

### Styling issues
- Verify Tailwind is configured correctly
- Check that dark mode classes are working
- Use browser dev tools to inspect

---

## Future Enhancements

Potential improvements for future iterations:

- [ ] Server-side pagination
- [ ] Server-side sorting/filtering
- [ ] Virtual scrolling for large datasets
- [ ] Column resizing
- [ ] Column reordering (drag & drop)
- [ ] Advanced filters (date range, multi-select)
- [ ] Saved filter presets
- [ ] Excel-like cell editing
- [ ] Export implementation (actual CSV/Excel generation)
- [ ] Print view
- [ ] Mobile responsive cards view
- [ ] Keyboard shortcuts
- [ ] Context menu (right-click)

---

## Resources

- [TanStack Table Docs](https://tanstack.com/table/v8)
- [Shadcn Table Examples](https://ui.shadcn.com/docs/components/data-table)
- [React Table Patterns](https://tanstack.com/table/v8/docs/guide/introduction)

---

**Created:** January 2026
**Version:** 1.0
**Maintainer:** JUDO Club App Team
