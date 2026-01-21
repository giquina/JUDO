# Integration Examples

Quick copy-paste examples for integrating new UI components into your JUDO app.

---

## 1. Add Bottom Navigation to Mobile

**File:** `src/App.tsx` or your main layout component

```tsx
import { BottomNavigation } from "@/components/BottomNavigation"

function App() {
  return (
    <div className="min-h-screen">
      {/* Your existing routes and content */}
      <Routes>
        {/* ... routes */}
      </Routes>

      {/* Add bottom navigation - auto-hides on desktop */}
      <BottomNavigation />
    </div>
  )
}
```

---

## 2. Add Filters to Member Dashboard

**File:** `src/pages/AdminDashboard.tsx` or `MemberDashboard.tsx`

```tsx
import { useState, useEffect } from "react"
import {
  FilterBar,
  FilterDropdown,
  FilterDateRange,
  SavedFilters,
  type ActiveFilter,
  type FilterOption,
} from "@/components/filters"
import { buildActiveFilters, removeFilterById, clearAllFilters } from "@/lib/filterUtils"

function MemberDashboard() {
  // Filter states
  const [beltFilters, setBeltFilters] = useState<string[]>([])
  const [statusFilters, setStatusFilters] = useState<string[]>([])
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()
  const [activeFilters, setActiveFilters] = useState<ActiveFilter[]>([])
  const [savedFilters, setSavedFilters] = useState<SavedFilter[]>([])

  // Filter options
  const beltOptions: FilterOption[] = [
    { label: "White Belt", value: "white", count: 45 },
    { label: "Yellow Belt", value: "yellow", count: 32 },
    { label: "Black Belt", value: "black", count: 8 },
  ]

  const statusOptions: FilterOption[] = [
    { label: "Active", value: "active", count: 142 },
    { label: "Inactive", value: "inactive", count: 16 },
  ]

  // Build active filters when values change
  useEffect(() => {
    const filters = buildActiveFilters([
      {
        id: "belt",
        label: "Belt",
        getValue: () => beltFilters,
        getDisplayValue: (v) => beltOptions.find((o) => o.value === v)?.label || v,
      },
      {
        id: "status",
        label: "Status",
        getValue: () => statusFilters,
        getDisplayValue: (v) => statusOptions.find((o) => o.value === v)?.label || v,
      },
      {
        id: "start-date",
        label: "From",
        getValue: () => startDate?.toISOString(),
        getDisplayValue: (v) => new Date(v).toLocaleDateString(),
      },
      {
        id: "end-date",
        label: "To",
        getValue: () => endDate?.toISOString(),
        getDisplayValue: (v) => new Date(v).toLocaleDateString(),
      },
    ])
    setActiveFilters(filters)
  }, [beltFilters, statusFilters, startDate, endDate])

  // Filter members based on active filters
  const filteredMembers = members.filter((member) => {
    if (beltFilters.length > 0 && !beltFilters.includes(member.belt)) return false
    if (statusFilters.length > 0 && !statusFilters.includes(member.status)) return false
    if (startDate && new Date(member.joinDate) < startDate) return false
    if (endDate && new Date(member.joinDate) > endDate) return false
    return true
  })

  return (
    <div className="space-y-6">
      <FilterBar
        activeFilters={activeFilters}
        onRemoveFilter={(id) => {
          removeFilterById(id, {
            belt: setBeltFilters,
            status: setStatusFilters,
            "start-date": () => setStartDate(undefined),
            "end-date": () => setEndDate(undefined),
          })
        }}
        onClearAll={() => {
          clearAllFilters({
            belt: setBeltFilters,
            status: setStatusFilters,
            "start-date": () => setStartDate(undefined),
            "end-date": () => setEndDate(undefined),
          })
        }}
        resultCount={filteredMembers.length}
      >
        <FilterDropdown
          label="Belt Level"
          options={beltOptions}
          selectedValues={beltFilters}
          onChange={setBeltFilters}
        />

        <FilterDropdown
          label="Status"
          options={statusOptions}
          selectedValues={statusFilters}
          onChange={setStatusFilters}
        />

        <FilterDateRange
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
        />
      </FilterBar>

      <SavedFilters
        currentFilters={{ beltFilters, statusFilters, startDate, endDate }}
        savedFilters={savedFilters}
        onSave={(name, filters) => {
          setSavedFilters([...savedFilters, { id: Date.now().toString(), name, filters }])
        }}
        onLoad={(filters) => {
          setBeltFilters(filters.beltFilters || [])
          setStatusFilters(filters.statusFilters || [])
          setStartDate(filters.startDate)
          setEndDate(filters.endDate)
        }}
        onDelete={(id) => setSavedFilters(savedFilters.filter((f) => f.id !== id))}
        onToggleFavorite={(id) => {
          setSavedFilters(
            savedFilters.map((f) => (f.id === id ? { ...f, isFavorite: !f.isFavorite } : f))
          )
        }}
      />

      {/* Your member list/table */}
      <div className="grid gap-4">
        {filteredMembers.map((member) => (
          <div key={member.id}>{/* Member card */}</div>
        ))}
      </div>
    </div>
  )
}
```

---

## 3. Add Export to Member Table

**File:** Any page with data table

```tsx
import { ExportDialog } from "@/components/ExportDialog"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

function MemberTable() {
  const handleExport = (format, columns, dateRange) => {
    // In production, send to backend API
    console.log("Exporting:", { format, columns, dateRange })

    // Mock: Generate file
    if (format === "csv") {
      const csv = generateCSV(filteredMembers, columns)
      downloadFile(csv, "members.csv", "text/csv")
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2>Members</h2>
        <ExportDialog
          title="Export Members"
          defaultColumns={[
            "Name",
            "Belt Level",
            "Status",
            "Email",
            "Phone",
            "Join Date",
            "Last Payment",
          ]}
          onExport={handleExport}
        >
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </ExportDialog>
      </div>

      {/* Table */}
    </div>
  )
}

// Helper functions
function generateCSV(data: any[], columns: string[]) {
  const header = columns.join(",")
  const rows = data.map((item) => columns.map((col) => item[col] || "").join(","))
  return [header, ...rows].join("\n")
}

function downloadFile(content: string, filename: string, type: string) {
  const blob = new Blob([content], { type })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}
```

---

## 4. Add Bulk Actions with Action Bar

**File:** Any list/table page

```tsx
import { useState } from "react"
import { ActionBar } from "@/components/ActionBar"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Edit, Trash2, Mail } from "lucide-react"
import { toast } from "sonner"

function MemberTable() {
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  const toggleSelection = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }

  const selectAll = () => {
    setSelectedIds(members.map((m) => m.id))
  }

  const clearSelection = () => {
    setSelectedIds([])
  }

  const handleBulkDelete = () => {
    toast.error(`Delete ${selectedIds.length} members?`, {
      action: {
        label: "Confirm",
        onClick: () => {
          // Delete logic here
          toast.success(`Deleted ${selectedIds.length} members`)
          clearSelection()
        },
      },
    })
  }

  const handleBulkEmail = () => {
    toast.success(`Sending email to ${selectedIds.length} members`)
    // Email logic here
  }

  return (
    <>
      {/* Action bar appears when items selected */}
      <ActionBar
        selectedCount={selectedIds.length}
        totalCount={members.length}
        onClear={clearSelection}
        onSelectAll={selectAll}
        actions={
          <>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBulkEmail}
              className="text-primary-foreground hover:bg-primary-foreground/20"
            >
              <Mail className="h-4 w-4 mr-2" />
              Send Email
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBulkDelete}
              className="text-primary-foreground hover:bg-primary-foreground/20"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </>
        }
      />

      {/* Table */}
      <div className="space-y-2">
        {members.map((member) => (
          <div
            key={member.id}
            className="flex items-center gap-3 p-4 border rounded-lg"
          >
            <Checkbox
              checked={selectedIds.includes(member.id)}
              onCheckedChange={() => toggleSelection(member.id)}
            />
            <div className="flex-1">
              <p className="font-medium">{member.name}</p>
              <p className="text-sm text-muted-foreground">{member.belt}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
```

---

## 5. Add Timeline to Member Profile

**File:** `src/pages/MemberProfile.tsx` or similar

```tsx
import { Timeline, type TimelineEvent } from "@/components/Timeline"
import { Award, CreditCard, User, Calendar } from "lucide-react"

function MemberProfile({ member }) {
  const events: TimelineEvent[] = [
    {
      id: "1",
      title: `Promoted to ${member.currentBelt}`,
      description: "Belt promotion ceremony",
      timestamp: new Date(member.lastPromotionDate),
      icon: <Award className="h-4 w-4" />,
      type: "success",
    },
    {
      id: "2",
      title: "Payment Received",
      description: `£${member.lastPayment.amount} - Monthly subscription`,
      timestamp: new Date(member.lastPayment.date),
      icon: <CreditCard className="h-4 w-4" />,
      type: "default",
    },
    {
      id: "3",
      title: "Attended Class",
      description: "Monday Evening - Advanced",
      timestamp: new Date(member.lastAttendance),
      icon: <Calendar className="h-4 w-4" />,
      type: "info",
    },
    {
      id: "4",
      title: "Member Joined",
      description: "Registered as new member",
      timestamp: new Date(member.joinDate),
      icon: <User className="h-4 w-4" />,
      type: "info",
    },
  ]

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Member History</h2>
      <Timeline events={events} />
    </div>
  )
}
```

---

## 6. Add File Upload for Documents

**File:** Any form/upload page

```tsx
import { FileUpload } from "@/components/FileUpload"
import { toast } from "sonner"

function DocumentUpload() {
  const handleUploadComplete = async (files: File[]) => {
    // In production, upload to server
    const formData = new FormData()
    files.forEach((file) => formData.append("files", file))

    try {
      // await uploadToServer(formData)
      toast.success(`${files.length} files uploaded successfully`)
    } catch (error) {
      toast.error("Upload failed")
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Upload Documents</h2>

      <FileUpload
        accept=".pdf,.doc,.docx,image/*"
        maxSize={5 * 1024 * 1024} // 5MB
        multiple={true}
        onUploadComplete={handleUploadComplete}
      />
    </div>
  )
}
```

---

## 7. Add Swipeable Cards to Mobile List

**File:** Any mobile list view

```tsx
import { SwipeableCard } from "@/components/SwipeableCard"
import { Card } from "@/components/ui/card"
import { Trash2, Check } from "lucide-react"
import { toast } from "sonner"

function MobileClassList() {
  const handleComplete = (classId: string) => {
    toast.success("Class marked as complete")
    // Update class status
  }

  const handleDelete = (classId: string) => {
    toast.error("Class cancelled")
    // Delete class
  }

  return (
    <div className="space-y-3">
      {classes.map((cls) => (
        <SwipeableCard
          key={cls.id}
          onSwipeLeft={() => handleDelete(cls.id)}
          onSwipeRight={() => handleComplete(cls.id)}
          leftAction={{
            icon: <Trash2 className="h-6 w-6" />,
            color: "bg-red-500",
            label: "Cancel",
          }}
          rightAction={{
            icon: <Check className="h-6 w-6" />,
            color: "bg-green-500",
            label: "Complete",
          }}
        >
          <Card className="p-4">
            <h3 className="font-bold">{cls.name}</h3>
            <p className="text-sm text-muted-foreground">{cls.time}</p>
          </Card>
        </SwipeableCard>
      ))}
    </div>
  )
}
```

---

## 8. Add Pull to Refresh

**File:** Any scrollable list page

```tsx
import { PullToRefresh } from "@/components/PullToRefresh"
import { toast } from "sonner"

function MemberList() {
  const refreshData = async () => {
    // Fetch new data
    await fetchMembers()
    toast.success("Data refreshed")
  }

  return (
    <PullToRefresh onRefresh={refreshData} threshold={80}>
      <div className="space-y-4">
        {members.map((member) => (
          <div key={member.id}>{/* Member card */}</div>
        ))}
      </div>
    </PullToRefresh>
  )
}
```

---

## 9. Add Print Button

**File:** Any report/detail page

```tsx
import { Button } from "@/components/ui/button"
import { Printer } from "lucide-react"

function MemberReport() {
  const handlePrint = () => {
    window.print()
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4 no-print">
        <h1>Member Report</h1>
        <Button onClick={handlePrint}>
          <Printer className="h-4 w-4 mr-2" />
          Print Report
        </Button>
      </div>

      {/* Report content - will be optimized for print */}
      <div className="space-y-4">
        {/* ... */}
      </div>
    </div>
  )
}
```

---

## 10. Add Reorderable Class Schedule

**File:** Class schedule management page

```tsx
import { SortableList, type SortableItem } from "@/components/drag-drop"
import { toast } from "sonner"

function ClassScheduleManager() {
  const [classes, setClasses] = useState<SortableItem[]>([
    { id: "1", name: "Monday Morning", time: "09:00", level: "Beginner" },
    { id: "2", name: "Tuesday Evening", time: "18:00", level: "Advanced" },
  ])

  const handleReorder = (reorderedClasses: SortableItem[]) => {
    setClasses(reorderedClasses)
    // Save new order to backend
    toast.success("Class schedule updated")
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Reorder Classes</h2>
      <p className="text-muted-foreground mb-6">
        Drag classes to reorder them in the schedule
      </p>

      <SortableList
        items={classes}
        onReorder={handleReorder}
        renderItem={(cls) => (
          <div>
            <p className="font-medium">{cls.name}</p>
            <p className="text-sm text-muted-foreground">
              {cls.time} • {cls.level}
            </p>
          </div>
        )}
      />
    </div>
  )
}
```

---

## Quick Tips

1. **Import from index files** for cleaner imports:
   ```tsx
   import { FilterBar, FilterDropdown } from "@/components/filters"
   ```

2. **Use filterUtils** for common filter operations:
   ```tsx
   import { buildActiveFilters, clearAllFilters } from "@/lib/filterUtils"
   ```

3. **Add `no-print` class** to hide elements when printing:
   ```tsx
   <Button className="no-print">Hidden in print</Button>
   ```

4. **Mobile-first**: Components are responsive by default, but test on mobile!

5. **TypeScript**: All components have proper types, use them for better DX

---

Ready to use! Copy any example and customize for your needs.
