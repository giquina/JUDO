# DataTable Components

Production-ready data tables for the JUDO Club App.

## Quick Start

```tsx
import { MembersTable, PaymentsTable, AttendanceTable, ClassesTable } from "@/components/tables"
```

## Available Tables

### MembersTable
Display and manage club members with subscription details.

```tsx
<MembersTable
  data={members}
  isLoading={isLoading}
  onEdit={handleEdit}
  onDelete={handleDelete}
  onViewDetails={handleViewDetails}
  onManageSubscription={handleManageSubscription}
  onEmail={handleEmail}
/>
```

### PaymentsTable
Track all transactions, subscriptions, and refunds.

```tsx
<PaymentsTable
  data={payments}
  isLoading={isLoading}
  onViewReceipt={handleViewReceipt}
  onRefund={handleRefund}
  onResend={handleResendReceipt}
/>
```

### AttendanceTable
Monitor class attendance and check-in records.

```tsx
<AttendanceTable
  data={attendance}
  isLoading={isLoading}
  onEdit={handleEdit}
  onDelete={handleDelete}
  onViewDetails={handleViewDetails}
  memberNames={memberNamesMap}
  classNames={classNamesMap}
/>
```

### ClassesTable
Schedule and manage judo classes.

```tsx
<ClassesTable
  data={classes}
  isLoading={isLoading}
  onEdit={handleEdit}
  onDelete={handleDelete}
  onViewDetails={handleViewDetails}
  onToggleActive={handleToggleActive}
  onGenerateQR={handleGenerateQR}
  coachNames={coachNamesMap}
/>
```

## Core DataTable

Create custom tables with the base DataTable component:

```tsx
import { DataTable, createActionColumn } from "@/components/tables"

const columns = [
  { accessorKey: "name", header: "Name" },
  { accessorKey: "email", header: "Email" },
  createActionColumn([
    {
      label: "Edit",
      onClick: (row) => handleEdit(row),
    },
  ]),
]

<DataTable
  columns={columns}
  data={data}
  searchPlaceholder="Search..."
  bulkActions={[
    {
      label: "Delete Selected",
      onClick: (rows) => handleBulkDelete(rows),
      variant: "destructive",
    },
  ]}
/>
```

## Features

- ✅ Sorting (multi-column)
- ✅ Global search
- ✅ Pagination
- ✅ Bulk selection
- ✅ Bulk actions
- ✅ Row actions
- ✅ Column visibility
- ✅ Density options
- ✅ Export (UI ready)
- ✅ Loading states
- ✅ Empty states
- ✅ Dark mode
- ✅ Responsive
- ✅ Accessible

## Documentation

See `/docs/DATA_TABLE_GUIDE.md` for comprehensive documentation.

## Demo

View the demo at `/demo/tables` (add route to your router):

```tsx
import DataTableDemo from "@/pages/DataTableDemo"

<Route path="/demo/tables" element={<DataTableDemo />} />
```
