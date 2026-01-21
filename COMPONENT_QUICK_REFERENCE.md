# Component Quick Reference

One-liner imports and basic usage for all new UI components.

---

## Filters

```tsx
// Import
import { FilterBar, FilterDropdown, FilterDateRange, SavedFilters } from "@/components/filters"

// Usage
<FilterBar activeFilters={[]} onRemoveFilter={fn} onClearAll={fn} resultCount={100} />
<FilterDropdown label="Status" options={opts} selectedValues={[]} onChange={fn} />
<FilterDateRange startDate={date} endDate={date} onStartDateChange={fn} onEndDateChange={fn} />
<SavedFilters currentFilters={{}} savedFilters={[]} onSave={fn} onLoad={fn} onDelete={fn} onToggleFavorite={fn} />
```

---

## Drag & Drop

```tsx
// Import
import { DragDropZone, SortableList } from "@/components/drag-drop"

// Usage
<DragDropZone onFilesAdded={fn} accept="image/*" maxSize={10485760} multiple />
<SortableList items={[]} onReorder={fn} renderItem={(item) => <div>{item.name}</div>} />
```

---

## File Upload

```tsx
// Import
import { FileUpload } from "@/components/FileUpload"

// Usage
<FileUpload accept="image/*" maxSize={10485760} multiple onUploadComplete={fn} />
```

---

## Export

```tsx
// Import
import { ExportDialog } from "@/components/ExportDialog"

// Usage
<ExportDialog title="Export Data" defaultColumns={["Col1", "Col2"]} onExport={fn} />
```

---

## Timeline

```tsx
// Import
import { Timeline } from "@/components/Timeline"

// Usage
<Timeline events={[{ id: "1", title: "Event", timestamp: new Date(), type: "success" }]} />
```

---

## Action Bar

```tsx
// Import
import { ActionBar } from "@/components/ActionBar"

// Usage
<ActionBar selectedCount={5} totalCount={100} onClear={fn} onSelectAll={fn} actions={<Button>Action</Button>} />
```

---

## Mobile

```tsx
// Imports
import { BottomNavigation } from "@/components/BottomNavigation"
import { SwipeableCard } from "@/components/SwipeableCard"
import { PullToRefresh } from "@/components/PullToRefresh"

// Usage
<BottomNavigation />
<SwipeableCard onSwipeLeft={fn} onSwipeRight={fn}><Card /></SwipeableCard>
<PullToRefresh onRefresh={asyncFn}><div>Content</div></PullToRefresh>
```

---

## UI Components

```tsx
// Imports
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import { Calendar } from "@/components/ui/calendar"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"

// Usage
<Tabs defaultValue="tab1">
  <TabsList>
    <TabsTrigger value="tab1" badge={5}>Tab 1</TabsTrigger>
  </TabsList>
  <TabsContent value="tab1">Content</TabsContent>
</Tabs>

<Accordion type="single" collapsible>
  <AccordionItem value="1">
    <AccordionTrigger>Title</AccordionTrigger>
    <AccordionContent>Content</AccordionContent>
  </AccordionItem>
</Accordion>

<Calendar selected={date} onSelect={setDate} disabled={(date) => date < new Date()} />
<Checkbox checked={bool} onCheckedChange={setBool} />
<Progress value={75} />
```

---

## Utils

```tsx
// Import
import { buildActiveFilters, removeFilterById, clearAllFilters, createFilterOptions } from "@/lib/filterUtils"

// Usage
const filters = buildActiveFilters([{ id: "status", label: "Status", getValue: () => ["active"], getDisplayValue: (v) => v }])
removeFilterById("status-active", { status: setStatus })
clearAllFilters({ status: setStatus, date: setDate })
const options = createFilterOptions(data, (item) => item.id, (item) => item.name)
```

---

## Print

```tsx
// Add to JSX
<div className="no-print">Hidden when printing</div>
<div className="print-only">Only visible when printing</div>
<div className="page-break-after">Page break after this</div>

// Print button
<Button onClick={() => window.print()}>Print</Button>
```

---

## PropTypes Reference

### FilterDropdown
```tsx
label: string
options: FilterOption[] // { label, value, count? }
selectedValues: string[]
onChange: (values: string[]) => void
```

### Timeline
```tsx
events: TimelineEvent[] // { id, title, description?, timestamp, icon?, type? }
```

### ActionBar
```tsx
selectedCount: number
totalCount?: number
onClear: () => void
onSelectAll?: () => void
actions?: ReactNode
```

### SortableList
```tsx
items: SortableItem[] // { id: string, [key: string]: any }
onReorder: (items: SortableItem[]) => void
renderItem: (item: SortableItem) => ReactNode
```

---

## Event Types

- `type?: "default" | "success" | "warning" | "error" | "info"`
- Colors: gray, green, yellow, red, blue

---

## File Patterns

```tsx
accept="image/*"           // All images
accept=".pdf,.doc,.docx"   // Specific files
accept="image/*,.pdf"      // Mixed
```

---

## Common Patterns

### Filter with State
```tsx
const [filters, setFilters] = useState<string[]>([])
const [activeFilters, setActiveFilters] = useState<ActiveFilter[]>([])

useEffect(() => {
  setActiveFilters(buildActiveFilters([...]))
}, [filters])
```

### Selection with Action Bar
```tsx
const [selected, setSelected] = useState<string[]>([])
<ActionBar selectedCount={selected.length} onClear={() => setSelected([])} />
{items.map(item => (
  <Checkbox checked={selected.includes(item.id)} onChange={() => toggle(item.id)} />
))}
```

### Export with Columns
```tsx
<ExportDialog
  defaultColumns={["Name", "Email", "Status"]}
  onExport={(format, columns, dateRange) => {
    const data = generateExport(format, columns, dateRange)
    downloadFile(data)
  }}
/>
```

---

## Demo Page

See all components: `/src/pages/UIShowcasePage.tsx`

Add to routes:
```tsx
<Route path="/ui-showcase" element={<UIShowcasePage />} />
```

---

**Docs:** See `UI_COMPONENTS_GUIDE.md` for full documentation
**Examples:** See `INTEGRATION_EXAMPLES.md` for copy-paste code
