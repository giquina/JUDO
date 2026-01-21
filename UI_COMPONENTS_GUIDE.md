# UI Components Guide

Comprehensive guide for all advanced UI components in the JUDO Club Manager app.

---

## Table of Contents

1. [Filter System](#filter-system)
2. [Drag and Drop](#drag-and-drop)
3. [File Upload](#file-upload)
4. [Export Dialog](#export-dialog)
5. [Timeline](#timeline)
6. [Action Bar](#action-bar)
7. [Mobile Components](#mobile-components)
8. [Enhanced UI Components](#enhanced-ui-components)
9. [Print Styles](#print-styles)
10. [Usage Examples](#usage-examples)

---

## Filter System

### Components

#### FilterBar
Main container for filters with active filter chips and clear all functionality.

```tsx
import { FilterBar } from "@/components/filters"

<FilterBar
  activeFilters={activeFilters}
  onRemoveFilter={(id) => handleRemove(id)}
  onClearAll={() => handleClearAll()}
  resultCount={158}
  isOpen={isFilterPanelOpen}
  onToggle={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
/>
```

#### FilterDropdown
Multi-select dropdown with checkboxes.

```tsx
import { FilterDropdown } from "@/components/filters"

<FilterDropdown
  label="Belt Level"
  options={[
    { label: "White Belt", value: "white", count: 45 },
    { label: "Black Belt", value: "black", count: 8 }
  ]}
  selectedValues={selectedBelts}
  onChange={(values) => setSelectedBelts(values)}
/>
```

#### FilterDateRange
Date range picker for filtering by date.

```tsx
import { FilterDateRange } from "@/components/filters"

<FilterDateRange
  startDate={startDate}
  endDate={endDate}
  onStartDateChange={setStartDate}
  onEndDateChange={setEndDate}
/>
```

#### SavedFilters
Save, load, and manage filter presets.

```tsx
import { SavedFilters } from "@/components/filters"

<SavedFilters
  currentFilters={{ belt: ["black"], status: ["active"] }}
  savedFilters={savedFilters}
  onSave={(name, filters) => handleSave(name, filters)}
  onLoad={(filters) => handleLoad(filters)}
  onDelete={(id) => handleDelete(id)}
  onToggleFavorite={(id) => handleToggleFavorite(id)}
/>
```

### Apply Filters To

- **Members**: Belt level, subscription status, attendance rate
- **Classes**: Level, day, coach, time slot
- **Payments**: Status, amount range, date range, method
- **Attendance**: Member, class, date range
- **Events**: Type, status, date

---

## Drag and Drop

### DragDropZone
File upload zone with drag and drop support.

```tsx
import { DragDropZone } from "@/components/drag-drop"

<DragDropZone
  onFilesAdded={(files) => handleFiles(files)}
  accept="image/*,.pdf,.doc"
  maxSize={10 * 1024 * 1024} // 10MB
  multiple={true}
/>
```

### SortableList
Reorderable list with drag handles.

```tsx
import { SortableList } from "@/components/drag-drop"

<SortableList
  items={items}
  onReorder={(reorderedItems) => setItems(reorderedItems)}
  renderItem={(item) => (
    <div>
      <h4>{item.name}</h4>
      <p>{item.description}</p>
    </div>
  )}
/>
```

**Use Cases:**
- Class schedule reordering
- Media gallery organization
- Priority task lists
- Custom menu ordering

---

## File Upload

Enhanced file upload with drag-drop, progress tracking, and previews.

```tsx
import { FileUpload } from "@/components/FileUpload"

<FileUpload
  accept="image/*,.pdf"
  maxSize={10 * 1024 * 1024}
  multiple={true}
  onUploadComplete={(files) => {
    console.log("Uploaded:", files)
  }}
/>
```

**Features:**
- Drag and drop area
- Click to browse
- File type restrictions
- Size validation
- Progress bars
- Preview thumbnails
- Remove file option

---

## Export Dialog

Modal for exporting data in multiple formats.

```tsx
import { ExportDialog } from "@/components/ExportDialog"

<ExportDialog
  title="Export Members"
  defaultColumns={["Name", "Belt", "Status", "Email", "Phone"]}
  onExport={(format, columns, dateRange) => {
    // Handle export: format = "csv" | "excel" | "pdf"
    console.log({ format, columns, dateRange })
  }}
/>
```

**Features:**
- Format selection (CSV, Excel, PDF)
- Column selection with checkboxes
- Date range filter
- Select all / Clear all columns
- Loading state during generation

---

## Timeline

Visual timeline component for events and milestones.

```tsx
import { Timeline } from "@/components/Timeline"

<Timeline
  events={[
    {
      id: "1",
      title: "Promoted to Black Belt",
      description: "Passed examination with excellence",
      timestamp: new Date(2024, 0, 15),
      icon: <Award className="h-4 w-4" />,
      type: "success"
    },
    {
      id: "2",
      title: "Membership Renewal",
      timestamp: new Date(2023, 11, 1),
      type: "default"
    }
  ]}
/>
```

**Event Types:**
- `default` - Gray
- `success` - Green
- `warning` - Yellow
- `error` - Red
- `info` - Blue

**Use Cases:**
- Member journey tracking
- Payment history
- Attendance timeline
- Event history

---

## Action Bar

Sticky toolbar that appears when items are selected.

```tsx
import { ActionBar } from "@/components/ActionBar"

<ActionBar
  selectedCount={selectedItems.length}
  totalCount={totalItems}
  onClear={() => clearSelection()}
  onSelectAll={() => selectAll()}
  actions={
    <>
      <Button variant="ghost" size="sm">
        <Edit className="h-4 w-4 mr-2" />
        Edit
      </Button>
      <Button variant="ghost" size="sm">
        <Trash2 className="h-4 w-4 mr-2" />
        Delete
      </Button>
    </>
  }
/>
```

**Features:**
- Animated slide-in from top
- Selected count display
- Select all / Clear all
- Custom action buttons
- Fixed positioning

---

## Mobile Components

### BottomNavigation
Mobile-friendly bottom navigation bar.

```tsx
import { BottomNavigation } from "@/components/BottomNavigation"

// Add to your main layout
<BottomNavigation />
```

**Features:**
- Auto-hides on desktop (md breakpoint)
- Active tab indicator
- Smooth animations
- Touch-optimized

### SwipeableCard
Cards with swipe gestures for actions.

```tsx
import { SwipeableCard } from "@/components/SwipeableCard"

<SwipeableCard
  onSwipeLeft={() => handleDelete()}
  onSwipeRight={() => handleComplete()}
  leftAction={{
    icon: <Trash2 />,
    color: "bg-red-500",
    label: "Delete"
  }}
  rightAction={{
    icon: <Check />,
    color: "bg-green-500",
    label: "Complete"
  }}
>
  <Card>Your content here</Card>
</SwipeableCard>
```

### PullToRefresh
Pull-down gesture to refresh content.

```tsx
import { PullToRefresh } from "@/components/PullToRefresh"

<PullToRefresh
  onRefresh={async () => {
    await fetchNewData()
  }}
  threshold={80}
>
  {/* Your scrollable content */}
</PullToRefresh>
```

---

## Enhanced UI Components

### Tabs with Badges
Tabs component enhanced with badge counts.

```tsx
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

<Tabs defaultValue="all">
  <TabsList>
    <TabsTrigger value="all" badge={42}>All</TabsTrigger>
    <TabsTrigger value="active" badge={38}>Active</TabsTrigger>
    <TabsTrigger value="pending" badge={4}>Pending</TabsTrigger>
  </TabsList>
  <TabsContent value="all">Content</TabsContent>
</Tabs>
```

### Accordion
Collapsible sections for mobile-friendly layouts.

```tsx
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"

<Accordion type="single" collapsible>
  <AccordionItem value="item-1">
    <AccordionTrigger>Member Information</AccordionTrigger>
    <AccordionContent>
      {/* Content */}
    </AccordionContent>
  </AccordionItem>
</Accordion>
```

### Calendar
Date picker component.

```tsx
import { Calendar } from "@/components/ui/calendar"

<Calendar
  selected={selectedDate}
  onSelect={(date) => setSelectedDate(date)}
  disabled={(date) => date < new Date()}
/>
```

### Checkbox
Checkbox input component.

```tsx
import { Checkbox } from "@/components/ui/checkbox"

<Checkbox
  checked={isChecked}
  onCheckedChange={setIsChecked}
/>
```

---

## Print Styles

Print-optimized CSS is automatically loaded. All styles are in `/src/styles/print.css`.

**Features:**
- Hide navigation and interactive elements
- Optimize table layouts
- Page break controls
- Print-friendly colors
- A4 page format

**Usage:**

```tsx
// Add classes to control print behavior
<div className="no-print">This won't print</div>
<div className="print-only">This only shows when printing</div>
<div className="page-break-after">Page break after this</div>
<div className="page-break-avoid">Keep this together</div>

// Print button
<Button onClick={() => window.print()}>
  Print Report
</Button>
```

---

## Usage Examples

### Complete Member Filter Example

```tsx
import { useState } from "react"
import {
  FilterBar,
  FilterDropdown,
  FilterDateRange,
  SavedFilters,
  type ActiveFilter,
} from "@/components/filters"

export function MemberList() {
  const [activeFilters, setActiveFilters] = useState<ActiveFilter[]>([])
  const [beltFilters, setBeltFilters] = useState<string[]>([])
  const [statusFilters, setStatusFilters] = useState<string[]>([])
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()

  // Update active filters when filter values change
  useEffect(() => {
    const filters: ActiveFilter[] = []

    beltFilters.forEach((belt) => {
      filters.push({ id: `belt-${belt}`, label: "Belt", value: belt })
    })

    statusFilters.forEach((status) => {
      filters.push({ id: `status-${status}`, label: "Status", value: status })
    })

    setActiveFilters(filters)
  }, [beltFilters, statusFilters])

  return (
    <div>
      <FilterBar
        activeFilters={activeFilters}
        onRemoveFilter={(id) => {
          // Remove specific filter
        }}
        onClearAll={() => {
          setBeltFilters([])
          setStatusFilters([])
          setActiveFilters([])
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

      {/* Your member list */}
    </div>
  )
}
```

### Bulk Actions with Selection

```tsx
import { useState } from "react"
import { ActionBar } from "@/components/ActionBar"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"

export function MemberTable() {
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  return (
    <>
      <ActionBar
        selectedCount={selectedIds.length}
        totalCount={members.length}
        onClear={() => setSelectedIds([])}
        onSelectAll={() => setSelectedIds(members.map(m => m.id))}
        actions={
          <>
            <Button variant="ghost" size="sm" onClick={handleBulkEdit}>
              Edit Selected
            </Button>
            <Button variant="ghost" size="sm" onClick={handleBulkDelete}>
              Delete Selected
            </Button>
          </>
        }
      />

      <div className="space-y-2">
        {members.map((member) => (
          <div key={member.id} className="flex items-center gap-3 p-4 border rounded">
            <Checkbox
              checked={selectedIds.includes(member.id)}
              onCheckedChange={() => toggleSelection(member.id)}
            />
            <div>{member.name}</div>
          </div>
        ))}
      </div>
    </>
  )
}
```

---

## Integration Checklist

- [ ] Add `BottomNavigation` to mobile layout
- [ ] Integrate filter system in member/payment/class pages
- [ ] Add export functionality to data tables
- [ ] Use timeline for member profiles
- [ ] Implement file upload for media/documents
- [ ] Add swipeable cards to mobile lists
- [ ] Use action bar for bulk operations
- [ ] Test print styles on reports

---

## Best Practices

1. **Filters**: Keep active filters visible, allow clearing individual filters
2. **Drag & Drop**: Show visual feedback, validate files before upload
3. **Mobile**: Use swipe gestures, bottom nav, and accordions for better UX
4. **Export**: Allow column selection, show progress, validate before export
5. **Performance**: Lazy load components, debounce filter changes
6. **Accessibility**: Use ARIA labels, keyboard navigation, focus management

---

## Dependencies

All necessary dependencies are already installed:

```json
{
  "@dnd-kit/core": "^latest",
  "@dnd-kit/sortable": "^latest",
  "@dnd-kit/utilities": "^latest",
  "@radix-ui/react-checkbox": "^latest",
  "@radix-ui/react-accordion": "^latest",
  "@radix-ui/react-progress": "^latest",
  "date-fns": "^latest",
  "framer-motion": "^latest"
}
```

---

## Component Locations

```
src/
├── components/
│   ├── filters/
│   │   ├── FilterBar.tsx
│   │   ├── FilterChip.tsx
│   │   ├── FilterDropdown.tsx
│   │   ├── FilterDateRange.tsx
│   │   ├── SavedFilters.tsx
│   │   └── index.ts
│   ├── drag-drop/
│   │   ├── DragDropZone.tsx
│   │   ├── SortableList.tsx
│   │   └── index.ts
│   ├── FileUpload.tsx
│   ├── ExportDialog.tsx
│   ├── Timeline.tsx
│   ├── ActionBar.tsx
│   ├── BottomNavigation.tsx
│   ├── PullToRefresh.tsx
│   ├── SwipeableCard.tsx
│   └── ui/
│       ├── tabs.tsx
│       ├── checkbox.tsx
│       ├── accordion.tsx
│       ├── calendar.tsx
│       └── progress.tsx
├── styles/
│   └── print.css
└── pages/
    └── UIShowcasePage.tsx
```

---

## Demo Page

Visit the UI Showcase page to see all components in action:

```tsx
import UIShowcasePage from "@/pages/UIShowcasePage"

// Add to your routes
<Route path="/ui-showcase" element={<UIShowcasePage />} />
```

---

## Support

For questions or issues with these components, check:
- Component source code for detailed prop types
- UI Showcase page for live examples
- Tailwind CSS and Framer Motion docs for styling/animation questions

---

**Version:** 1.0
**Last Updated:** January 2026
