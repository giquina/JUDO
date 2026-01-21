import { useState } from "react"
import PageTransition from "@/components/PageTransition"
import {
  FilterBar,
  FilterDropdown,
  FilterDateRange,
  SavedFilters,
  type ActiveFilter,
  type FilterOption,
  type SavedFilter,
} from "@/components/filters"
import { SortableList, type SortableItem } from "@/components/drag-drop"
import { FileUpload } from "@/components/FileUpload"
import { ExportDialog } from "@/components/ExportDialog"
import { Timeline, type TimelineEvent } from "@/components/Timeline"
import { ActionBar } from "@/components/ActionBar"
import { SwipeableCard } from "@/components/SwipeableCard"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "sonner"
import {
  Award,
  Calendar,
  User,
  Trash2,
  Edit,
  Star,
  TrendingUp,
  CreditCard,
} from "lucide-react"

export default function UIShowcasePage() {
  // Filter state
  const [activeFilters, setActiveFilters] = useState<ActiveFilter[]>([])
  const [beltFilters, setBeltFilters] = useState<string[]>([])
  const [statusFilters, setStatusFilters] = useState<string[]>([])
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()
  const [savedFilters, setSavedFilters] = useState<SavedFilter[]>([])

  // Sortable list state
  const [sortableItems, setSortableItems] = useState<SortableItem[]>([
    { id: "1", name: "Monday Morning - Beginners", time: "09:00 AM" },
    { id: "2", name: "Tuesday Evening - Advanced", time: "06:00 PM" },
    { id: "3", name: "Wednesday Kids - All Levels", time: "04:00 PM" },
    { id: "4", name: "Friday Competition - Black Belts", time: "07:00 PM" },
  ])

  // Selection state for action bar
  const [selectedItems, setSelectedItems] = useState<string[]>([])

  // Filter options
  const beltOptions: FilterOption[] = [
    { label: "White Belt", value: "white", count: 45 },
    { label: "Yellow Belt", value: "yellow", count: 32 },
    { label: "Orange Belt", value: "orange", count: 28 },
    { label: "Green Belt", value: "green", count: 20 },
    { label: "Blue Belt", value: "blue", count: 15 },
    { label: "Brown Belt", value: "brown", count: 10 },
    { label: "Black Belt", value: "black", count: 8 },
  ]

  const statusOptions: FilterOption[] = [
    { label: "Active", value: "active", count: 142 },
    { label: "Inactive", value: "inactive", count: 16 },
    { label: "On Hold", value: "on_hold", count: 8 },
  ]

  // Update active filters
  const updateActiveFilters = () => {
    const filters: ActiveFilter[] = []

    beltFilters.forEach((belt) => {
      const option = beltOptions.find((opt) => opt.value === belt)
      if (option) {
        filters.push({ id: `belt-${belt}`, label: "Belt", value: option.label })
      }
    })

    statusFilters.forEach((status) => {
      const option = statusOptions.find((opt) => opt.value === status)
      if (option) {
        filters.push({ id: `status-${status}`, label: "Status", value: option.label })
      }
    })

    if (startDate) {
      filters.push({
        id: "start-date",
        label: "From",
        value: startDate.toLocaleDateString(),
      })
    }

    if (endDate) {
      filters.push({
        id: "end-date",
        label: "To",
        value: endDate.toLocaleDateString(),
      })
    }

    setActiveFilters(filters)
  }

  const handleRemoveFilter = (id: string) => {
    if (id.startsWith("belt-")) {
      const belt = id.replace("belt-", "")
      setBeltFilters((prev) => prev.filter((b) => b !== belt))
    } else if (id.startsWith("status-")) {
      const status = id.replace("status-", "")
      setStatusFilters((prev) => prev.filter((s) => s !== status))
    } else if (id === "start-date") {
      setStartDate(undefined)
    } else if (id === "end-date") {
      setEndDate(undefined)
    }
  }

  const handleClearAllFilters = () => {
    setBeltFilters([])
    setStatusFilters([])
    setStartDate(undefined)
    setEndDate(undefined)
    setActiveFilters([])
  }

  const handleSaveFilter = (name: string, filters: Record<string, any>) => {
    const newFilter: SavedFilter = {
      id: Date.now().toString(),
      name,
      filters,
      isFavorite: false,
    }
    setSavedFilters((prev) => [...prev, newFilter])
  }

  const handleLoadFilter = (filters: Record<string, any>) => {
    setBeltFilters(filters.belts || [])
    setStatusFilters(filters.statuses || [])
    setStartDate(filters.startDate)
    setEndDate(filters.endDate)
    toast.success("Filter preset loaded")
  }

  const handleDeleteFilter = (id: string) => {
    setSavedFilters((prev) => prev.filter((f) => f.id !== id))
    toast.success("Filter preset deleted")
  }

  const handleToggleFavorite = (id: string) => {
    setSavedFilters((prev) =>
      prev.map((f) => (f.id === id ? { ...f, isFavorite: !f.isFavorite } : f))
    )
  }

  // Timeline events
  const timelineEvents: TimelineEvent[] = [
    {
      id: "1",
      title: "Promoted to Black Belt",
      description: "Successfully passed black belt examination",
      timestamp: new Date(2024, 0, 15),
      icon: <Award className="h-4 w-4" />,
      type: "success",
    },
    {
      id: "2",
      title: "Competition Win",
      description: "1st place at Regional Championship",
      timestamp: new Date(2023, 11, 10),
      icon: <Star className="h-4 w-4" />,
      type: "success",
    },
    {
      id: "3",
      title: "Membership Renewal",
      description: "Annual membership payment received",
      timestamp: new Date(2023, 10, 1),
      icon: <CreditCard className="h-4 w-4" />,
      type: "default",
    },
    {
      id: "4",
      title: "Joined Dojo",
      description: "Registered as new member",
      timestamp: new Date(2023, 0, 5),
      icon: <User className="h-4 w-4" />,
      type: "info",
    },
  ]

  // Toggle item selection
  const toggleItem = (id: string) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  // Update filters when filter values change
  useState(() => {
    updateActiveFilters()
  })

  return (
    <PageTransition>
      <div className="container mx-auto p-6 space-y-8 pb-20 md:pb-6">
        <div>
          <h1 className="text-4xl font-bold mb-2">UI Components Showcase</h1>
          <p className="text-muted-foreground">
            Explore all the new advanced UI components and features
          </p>
        </div>

        <Tabs defaultValue="filters" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="filters" badge={activeFilters.length || undefined}>
              Filters
            </TabsTrigger>
            <TabsTrigger value="drag-drop">Drag & Drop</TabsTrigger>
            <TabsTrigger value="export">Export</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="mobile">Mobile</TabsTrigger>
          </TabsList>

          {/* Filters Tab */}
          <TabsContent value="filters" className="space-y-6">
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-4">Advanced Filter System</h2>
              <p className="text-muted-foreground mb-6">
                Filter data with multiple criteria, save presets, and manage active filters
              </p>

              <FilterBar
                activeFilters={activeFilters}
                onRemoveFilter={handleRemoveFilter}
                onClearAll={handleClearAllFilters}
                resultCount={158}
              >
                <FilterDropdown
                  label="Belt Level"
                  options={beltOptions}
                  selectedValues={beltFilters}
                  onChange={(values) => {
                    setBeltFilters(values)
                    setTimeout(updateActiveFilters, 0)
                  }}
                />

                <FilterDropdown
                  label="Status"
                  options={statusOptions}
                  selectedValues={statusFilters}
                  onChange={(values) => {
                    setStatusFilters(values)
                    setTimeout(updateActiveFilters, 0)
                  }}
                />

                <FilterDateRange
                  startDate={startDate}
                  endDate={endDate}
                  onStartDateChange={(date) => {
                    setStartDate(date)
                    setTimeout(updateActiveFilters, 0)
                  }}
                  onEndDateChange={(date) => {
                    setEndDate(date)
                    setTimeout(updateActiveFilters, 0)
                  }}
                />
              </FilterBar>

              <div className="mt-4">
                <SavedFilters
                  currentFilters={{
                    belts: beltFilters,
                    statuses: statusFilters,
                    startDate,
                    endDate,
                  }}
                  savedFilters={savedFilters}
                  onSave={handleSaveFilter}
                  onLoad={handleLoadFilter}
                  onDelete={handleDeleteFilter}
                  onToggleFavorite={handleToggleFavorite}
                />
              </div>
            </Card>
          </TabsContent>

          {/* Drag & Drop Tab */}
          <TabsContent value="drag-drop" className="space-y-6">
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-4">Drag & Drop File Upload</h2>
              <p className="text-muted-foreground mb-6">
                Upload files by dragging and dropping or clicking to browse
              </p>

              <FileUpload
                accept="image/*,.pdf,.doc,.docx"
                maxSize={10 * 1024 * 1024}
                onUploadComplete={(files) => {
                  toast.success(`Uploaded ${files.length} files`)
                }}
              />
            </Card>

            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-4">Sortable List</h2>
              <p className="text-muted-foreground mb-6">
                Drag items to reorder them in the list
              </p>

              <SortableList
                items={sortableItems}
                onReorder={(items) => {
                  setSortableItems(items)
                  toast.success("Class schedule reordered")
                }}
                renderItem={(item) => (
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">{item.time}</p>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              />
            </Card>
          </TabsContent>

          {/* Export Tab */}
          <TabsContent value="export" className="space-y-6">
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-4">Export Functionality</h2>
              <p className="text-muted-foreground mb-6">
                Export data in multiple formats with custom column selection
              </p>

              <div className="flex gap-4">
                <ExportDialog
                  title="Export Members"
                  defaultColumns={["Name", "Belt", "Status", "Email", "Phone", "Join Date"]}
                  onExport={(format, columns, dateRange) => {
                    console.log("Export:", { format, columns, dateRange })
                  }}
                />

                <ExportDialog
                  title="Export Payments"
                  defaultColumns={[
                    "Date",
                    "Member",
                    "Amount",
                    "Status",
                    "Method",
                    "Reference",
                  ]}
                  onExport={(format, columns, dateRange) => {
                    console.log("Export:", { format, columns, dateRange })
                  }}
                >
                  <Button variant="outline">Export Payments</Button>
                </ExportDialog>
              </div>

              <div className="mt-6 p-4 bg-muted rounded-lg">
                <h3 className="font-semibold mb-2">Print Styles</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  The application includes print-optimized styles. Try printing this page
                  (Ctrl/Cmd + P) to see the print layout.
                </p>
                <Button onClick={() => window.print()}>Print Preview</Button>
              </div>
            </Card>
          </TabsContent>

          {/* Timeline Tab */}
          <TabsContent value="timeline" className="space-y-6">
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-4">Member Timeline</h2>
              <p className="text-muted-foreground mb-6">
                Track important events and milestones in a visual timeline
              </p>

              <Timeline events={timelineEvents} />
            </Card>
          </TabsContent>

          {/* Mobile Tab */}
          <TabsContent value="mobile" className="space-y-6">
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-4">Swipeable Cards</h2>
              <p className="text-muted-foreground mb-6">
                Swipe left or right to reveal actions (best on mobile)
              </p>

              <div className="space-y-4">
                <SwipeableCard
                  onSwipeLeft={() => toast.error("Deleted!")}
                  onSwipeRight={() => toast.success("Completed!")}
                >
                  <Card className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">John Doe</p>
                        <p className="text-sm text-muted-foreground">Black Belt</p>
                      </div>
                    </div>
                  </Card>
                </SwipeableCard>

                <SwipeableCard
                  onSwipeLeft={() => toast.error("Deleted!")}
                  onSwipeRight={() => toast.success("Completed!")}
                >
                  <Card className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Calendar className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Monday Class - 6:00 PM</p>
                        <p className="text-sm text-muted-foreground">Advanced Level</p>
                      </div>
                    </div>
                  </Card>
                </SwipeableCard>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-4">Action Bar</h2>
              <p className="text-muted-foreground mb-6">
                Select items to see the bulk action bar
              </p>

              <div className="space-y-3">
                {["Member 1", "Member 2", "Member 3", "Member 4"].map((member, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-accent"
                    onClick={() => toggleItem(index.toString())}
                  >
                    <Checkbox
                      checked={selectedItems.includes(index.toString())}
                      onCheckedChange={() => toggleItem(index.toString())}
                    />
                    <div className="flex-1">
                      <p className="font-medium">{member}</p>
                      <p className="text-sm text-muted-foreground">
                        member{index + 1}@example.com
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <ActionBar
                selectedCount={selectedItems.length}
                totalCount={4}
                onClear={() => setSelectedItems([])}
                onSelectAll={() => setSelectedItems(["0", "1", "2", "3"])}
                actions={
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-primary-foreground hover:bg-primary-foreground/20"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-primary-foreground hover:bg-primary-foreground/20"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </>
                }
              />
            </Card>

            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-4">Mobile Bottom Navigation</h2>
              <p className="text-muted-foreground mb-6">
                On mobile devices (screen width &lt; 768px), a bottom navigation bar
                appears for easy navigation. Resize your browser to see it in action.
              </p>
              <p className="text-sm text-muted-foreground">
                The bottom navigation is already integrated and will appear automatically
                on mobile screens.
              </p>
            </Card>

            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-4">Accordion (Collapsible Sections)</h2>
              <p className="text-muted-foreground mb-6">
                Perfect for mobile-friendly content organization
              </p>

              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>Member Information</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Name:</span>
                        <span className="font-medium">John Doe</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Belt:</span>
                        <span className="font-medium">Black Belt</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Status:</span>
                        <span className="font-medium">Active</span>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>Payment History</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Jan 2024</span>
                        <span className="font-medium">£50.00</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Dec 2023</span>
                        <span className="font-medium">£50.00</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Nov 2023</span>
                        <span className="font-medium">£50.00</span>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger>Attendance Record</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-green-500" />
                        <span className="text-sm">95% attendance rate</span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Attended 38 out of 40 classes this month
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageTransition>
  )
}
