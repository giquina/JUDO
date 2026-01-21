import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Search,
  Filter,
  X,
  CheckCircle2,
  Users,
  Clock,
  MapPin,
  User,
  Star,
  Calendar as CalendarIcon,
  TrendingUp,
  Save,
  RotateCcw
} from "lucide-react";
import {
  mockCalendarData,
  type JudoClass,
  type ClassLevel,
  type ClassType,
} from "@/lib/mockCalendarData";
import ClassBookingModal from "./ClassBookingModal";

interface FilterState {
  searchQuery: string;
  daysOfWeek: number[];
  timeRange: {
    start: string;
    end: string;
  };
  levels: ClassLevel[];
  types: ClassType[];
  coaches: string[];
  availableOnly: boolean;
  recurringOnly: boolean;
}

interface SavedFilter {
  id: string;
  name: string;
  filter: FilterState;
}

const QUICK_FILTERS = [
  {
    id: "my-usual",
    name: "My Usual",
    icon: Star,
    filter: {
      daysOfWeek: [1, 3, 6], // Mon, Wed, Sat
      levels: ["beginner", "all-levels"] as ClassLevel[],
    },
  },
  {
    id: "beginner",
    name: "Beginner",
    icon: TrendingUp,
    filter: {
      levels: ["beginner", "all-levels"] as ClassLevel[],
    },
  },
  {
    id: "evening",
    name: "Evening",
    icon: Clock,
    filter: {
      timeRange: { start: "18:00", end: "22:00" },
    },
  },
  {
    id: "weekend",
    name: "Weekend",
    icon: CalendarIcon,
    filter: {
      daysOfWeek: [0, 6], // Sun, Sat
    },
  },
  {
    id: "available",
    name: "Available",
    icon: CheckCircle2,
    filter: {
      availableOnly: true,
    },
  },
];

const DEFAULT_FILTER: FilterState = {
  searchQuery: "",
  daysOfWeek: [],
  timeRange: { start: "", end: "" },
  levels: [],
  types: [],
  coaches: [],
  availableOnly: false,
  recurringOnly: false,
};

export default function ClassSearch() {
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTER);
  const [selectedClass, setSelectedClass] = useState<(JudoClass & { date?: Date }) | null>(null);
  const [savedFilters, setSavedFilters] = useState<SavedFilter[]>([]);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [filterName, setFilterName] = useState("");

  const { classes, coaches } = mockCalendarData;

  // Extract unique values for filters
  const uniqueLevels: ClassLevel[] = [...new Set(classes.map((c) => c.level))];
  const uniqueTypes: ClassType[] = [...new Set(classes.map((c) => c.type))];
  const uniqueCoaches = coaches.map((c) => c.name);

  // Apply filters
  const filteredClasses = useMemo(() => {
    return classes.filter((classInfo) => {
      // Search query
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        const matchesSearch =
          classInfo.name.toLowerCase().includes(query) ||
          classInfo.coach.toLowerCase().includes(query) ||
          classInfo.type.toLowerCase().includes(query) ||
          classInfo.description.toLowerCase().includes(query);

        if (!matchesSearch) return false;
      }

      // Days of week
      if (filters.daysOfWeek.length > 0) {
        if (!filters.daysOfWeek.includes(classInfo.dayOfWeek)) return false;
      }

      // Time range
      if (filters.timeRange.start || filters.timeRange.end) {
        const classTime = classInfo.startTime;
        if (filters.timeRange.start && classTime < filters.timeRange.start) return false;
        if (filters.timeRange.end && classTime > filters.timeRange.end) return false;
      }

      // Levels
      if (filters.levels.length > 0) {
        if (!filters.levels.includes(classInfo.level) && classInfo.level !== "all-levels")
          return false;
      }

      // Types
      if (filters.types.length > 0) {
        if (!filters.types.includes(classInfo.type)) return false;
      }

      // Coaches
      if (filters.coaches.length > 0) {
        if (!filters.coaches.includes(classInfo.coach)) return false;
      }

      // Available only
      if (filters.availableOnly) {
        if (classInfo.currentBookings >= classInfo.capacity) return false;
      }

      // Recurring only
      if (filters.recurringOnly) {
        if (!classInfo.recurring) return false;
      }

      return true;
    });
  }, [classes, filters]);

  // Update filter
  const updateFilter = (key: keyof FilterState, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  // Toggle array filter (for multi-select)
  const toggleArrayFilter = (key: keyof FilterState, value: any) => {
    setFilters((prev) => {
      const currentArray = prev[key] as any[];
      const newArray = currentArray.includes(value)
        ? currentArray.filter((v) => v !== value)
        : [...currentArray, value];
      return { ...prev, [key]: newArray };
    });
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters(DEFAULT_FILTER);
    toast.info("Filters cleared");
  };

  // Apply quick filter
  const applyQuickFilter = (quickFilter: typeof QUICK_FILTERS[0]) => {
    setFilters((prev) => ({
      ...prev,
      ...DEFAULT_FILTER,
      ...quickFilter.filter,
    }));
    toast.success(`Applied "${quickFilter.name}" filter`);
  };

  // Save current filter
  const saveCurrentFilter = () => {
    if (!filterName.trim()) {
      toast.error("Please enter a filter name");
      return;
    }

    const newSavedFilter: SavedFilter = {
      id: `filter-${Date.now()}`,
      name: filterName,
      filter: filters,
    };

    setSavedFilters((prev) => [...prev, newSavedFilter]);
    setFilterName("");
    toast.success("Filter saved!", {
      description: `You can now quickly apply "${filterName}" filter.`,
    });
  };

  // Load saved filter
  const loadSavedFilter = (savedFilter: SavedFilter) => {
    setFilters(savedFilter.filter);
    toast.success(`Applied "${savedFilter.name}" filter`);
  };

  // Delete saved filter
  const deleteSavedFilter = (id: string) => {
    setSavedFilters((prev) => prev.filter((f) => f.id !== id));
    toast.info("Filter deleted");
  };

  // Quick book
  const handleQuickBook = (classInfo: JudoClass, e: React.MouseEvent) => {
    e.stopPropagation();
    toast.success("Class booked!", {
      description: `${classInfo.name} has been added to your schedule.`,
    });
  };

  // Get active filter count
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.searchQuery) count++;
    if (filters.daysOfWeek.length > 0) count++;
    if (filters.timeRange.start || filters.timeRange.end) count++;
    if (filters.levels.length > 0) count++;
    if (filters.types.length > 0) count++;
    if (filters.coaches.length > 0) count++;
    if (filters.availableOnly) count++;
    if (filters.recurringOnly) count++;
    return count;
  }, [filters]);

  // Day names
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="space-y-4">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2 text-2xl mb-2">
                <Search className="w-6 h-6 text-primary" />
                Find Classes
              </CardTitle>
              <CardDescription className="text-base">
                Search and filter classes to find the perfect fit for your schedule
              </CardDescription>
            </div>
            {activeFilterCount > 0 && (
              <Badge variant="secondary" className="gap-1">
                <Filter className="w-3 h-3" />
                {activeFilterCount} active
              </Badge>
            )}
          </div>
        </CardHeader>
      </Card>

      {/* Search and Quick Filters */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by class name, coach, or type..."
              value={filters.searchQuery}
              onChange={(e) => updateFilter("searchQuery", e.target.value)}
              className="pl-10 pr-10"
            />
            {filters.searchQuery && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                onClick={() => updateFilter("searchQuery", "")}
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>

          {/* Quick filters */}
          <div>
            <Label className="text-xs text-muted-foreground mb-2 block">Quick Filters</Label>
            <div className="flex items-center gap-2 flex-wrap">
              {QUICK_FILTERS.map((quickFilter) => {
                const Icon = quickFilter.icon;
                return (
                  <Button
                    key={quickFilter.id}
                    variant="outline"
                    size="sm"
                    onClick={() => applyQuickFilter(quickFilter)}
                    className="gap-2"
                  >
                    <Icon className="w-3 h-3" />
                    {quickFilter.name}
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Advanced filters toggle */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className="gap-2"
            >
              <Filter className="w-4 h-4" />
              Advanced Filters
              {activeFilterCount > 0 && (
                <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 flex items-center justify-center rounded-full">
                  {activeFilterCount}
                </Badge>
              )}
            </Button>

            {activeFilterCount > 0 && (
              <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-2">
                <RotateCcw className="w-4 h-4" />
                Clear All
              </Button>
            )}
          </div>

          {/* Advanced filters */}
          <AnimatePresence>
            {showAdvancedFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
              >
                <Accordion type="single" collapsible className="w-full">
                  {/* Days of Week */}
                  <AccordionItem value="days">
                    <AccordionTrigger className="text-sm">
                      Day of Week
                      {filters.daysOfWeek.length > 0 && (
                        <Badge variant="secondary" className="ml-2">
                          {filters.daysOfWeek.length}
                        </Badge>
                      )}
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="grid grid-cols-7 gap-2">
                        {dayNames.map((day, index) => (
                          <Button
                            key={day}
                            variant={
                              filters.daysOfWeek.includes(index) ? "default" : "outline"
                            }
                            size="sm"
                            onClick={() => toggleArrayFilter("daysOfWeek", index)}
                            className="text-xs"
                          >
                            {day}
                          </Button>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Time Range */}
                  <AccordionItem value="time">
                    <AccordionTrigger className="text-sm">
                      Time Range
                      {(filters.timeRange.start || filters.timeRange.end) && (
                        <Badge variant="secondary" className="ml-2">
                          Active
                        </Badge>
                      )}
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label className="text-xs mb-1 block">Start Time</Label>
                          <Input
                            type="time"
                            value={filters.timeRange.start}
                            onChange={(e) =>
                              updateFilter("timeRange", {
                                ...filters.timeRange,
                                start: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div>
                          <Label className="text-xs mb-1 block">End Time</Label>
                          <Input
                            type="time"
                            value={filters.timeRange.end}
                            onChange={(e) =>
                              updateFilter("timeRange", {
                                ...filters.timeRange,
                                end: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Level */}
                  <AccordionItem value="level">
                    <AccordionTrigger className="text-sm">
                      Level
                      {filters.levels.length > 0 && (
                        <Badge variant="secondary" className="ml-2">
                          {filters.levels.length}
                        </Badge>
                      )}
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2">
                        {uniqueLevels.map((level) => (
                          <div key={level} className="flex items-center gap-2">
                            <Checkbox
                              id={`level-${level}`}
                              checked={filters.levels.includes(level)}
                              onCheckedChange={() => toggleArrayFilter("levels", level)}
                            />
                            <Label
                              htmlFor={`level-${level}`}
                              className="text-sm capitalize cursor-pointer"
                            >
                              {level}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Type */}
                  <AccordionItem value="type">
                    <AccordionTrigger className="text-sm">
                      Class Type
                      {filters.types.length > 0 && (
                        <Badge variant="secondary" className="ml-2">
                          {filters.types.length}
                        </Badge>
                      )}
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2">
                        {uniqueTypes.map((type) => (
                          <div key={type} className="flex items-center gap-2">
                            <Checkbox
                              id={`type-${type}`}
                              checked={filters.types.includes(type)}
                              onCheckedChange={() => toggleArrayFilter("types", type)}
                            />
                            <Label
                              htmlFor={`type-${type}`}
                              className="text-sm capitalize cursor-pointer"
                            >
                              {type.replace("-", " ")}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Coach */}
                  <AccordionItem value="coach">
                    <AccordionTrigger className="text-sm">
                      Coach
                      {filters.coaches.length > 0 && (
                        <Badge variant="secondary" className="ml-2">
                          {filters.coaches.length}
                        </Badge>
                      )}
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2">
                        {uniqueCoaches.map((coach) => (
                          <div key={coach} className="flex items-center gap-2">
                            <Checkbox
                              id={`coach-${coach}`}
                              checked={filters.coaches.includes(coach)}
                              onCheckedChange={() => toggleArrayFilter("coaches", coach)}
                            />
                            <Label
                              htmlFor={`coach-${coach}`}
                              className="text-sm cursor-pointer"
                            >
                              {coach}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Other filters */}
                  <AccordionItem value="other">
                    <AccordionTrigger className="text-sm">Other Options</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Checkbox
                            id="available-only"
                            checked={filters.availableOnly}
                            onCheckedChange={(checked) =>
                              updateFilter("availableOnly", checked)
                            }
                          />
                          <Label
                            htmlFor="available-only"
                            className="text-sm cursor-pointer"
                          >
                            Show only available classes (not full)
                          </Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <Checkbox
                            id="recurring-only"
                            checked={filters.recurringOnly}
                            onCheckedChange={(checked) =>
                              updateFilter("recurringOnly", checked)
                            }
                          />
                          <Label
                            htmlFor="recurring-only"
                            className="text-sm cursor-pointer"
                          >
                            Show only recurring classes
                          </Label>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

                {/* Save filter */}
                <div className="mt-4 p-3 rounded-lg bg-muted/30 border">
                  <Label className="text-xs font-semibold mb-2 block">
                    Save This Filter
                  </Label>
                  <div className="flex items-center gap-2">
                    <Input
                      placeholder="Filter name (e.g., My Monday classes)"
                      value={filterName}
                      onChange={(e) => setFilterName(e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      size="sm"
                      onClick={saveCurrentFilter}
                      disabled={!filterName.trim()}
                      className="gap-2"
                    >
                      <Save className="w-4 h-4" />
                      Save
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Saved filters */}
          {savedFilters.length > 0 && (
            <div>
              <Label className="text-xs text-muted-foreground mb-2 block">
                Saved Filters
              </Label>
              <div className="flex items-center gap-2 flex-wrap">
                {savedFilters.map((savedFilter) => (
                  <div
                    key={savedFilter.id}
                    className="flex items-center gap-1 bg-primary/10 rounded-full pl-3 pr-1 py-1"
                  >
                    <button
                      onClick={() => loadSavedFilter(savedFilter)}
                      className="text-xs font-medium hover:underline"
                    >
                      {savedFilter.name}
                    </button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-5 w-5 rounded-full"
                      onClick={() => deleteSavedFilter(savedFilter.id)}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            Results ({filteredClasses.length} {filteredClasses.length === 1 ? "class" : "classes"})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredClasses.length === 0 ? (
            <div className="text-center py-12">
              <div className="p-4 rounded-full bg-muted inline-block mb-3">
                <Search className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No classes found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your filters or search query
              </p>
              <Button variant="outline" onClick={clearFilters}>
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <AnimatePresence mode="popLayout">
                {filteredClasses.map((classInfo, index) => {
                  const isFull = classInfo.currentBookings >= classInfo.capacity;
                  const capacityPercentage =
                    (classInfo.currentBookings / classInfo.capacity) * 100;

                  return (
                    <motion.div
                      key={classInfo.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      transition={{ delay: index * 0.05 }}
                      layout
                    >
                      <Card
                        className="hover:shadow-md transition-all cursor-pointer border-l-4"
                        style={{ borderLeftColor: classInfo.color }}
                        onClick={() => setSelectedClass(classInfo)}
                      >
                        <CardContent className="pt-6">
                          <div className="flex items-start gap-4">
                            {/* Class info */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-3 mb-2">
                                <div className="flex-1">
                                  <h3 className="font-semibold text-lg mb-1">
                                    {classInfo.name}
                                  </h3>
                                  <div className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
                                    <span className="flex items-center gap-1">
                                      <Clock className="w-3 h-3" />
                                      {dayNames[classInfo.dayOfWeek]}{" "}
                                      {classInfo.startTime}
                                    </span>
                                    <span>•</span>
                                    <span className="flex items-center gap-1">
                                      <User className="w-3 h-3" />
                                      {classInfo.coach}
                                    </span>
                                    <span>•</span>
                                    <span className="flex items-center gap-1">
                                      <MapPin className="w-3 h-3" />
                                      {classInfo.location}
                                    </span>
                                  </div>
                                </div>
                                <Badge
                                  variant="outline"
                                  className="capitalize flex-shrink-0"
                                >
                                  {classInfo.level}
                                </Badge>
                              </div>

                              <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                                {classInfo.description}
                              </p>

                              <div className="flex items-center gap-3 flex-wrap">
                                <div className="flex items-center gap-2">
                                  <Users className="w-4 h-4 text-muted-foreground" />
                                  <span className="text-sm">
                                    {classInfo.currentBookings}/{classInfo.capacity}
                                  </span>
                                  {capacityPercentage >= 80 && (
                                    <Badge
                                      variant={isFull ? "destructive" : "outline"}
                                      className="text-xs"
                                    >
                                      {isFull ? "Full" : "Almost Full"}
                                    </Badge>
                                  )}
                                </div>

                                <Badge variant="secondary" className="text-xs">
                                  {classInfo.duration} min
                                </Badge>

                                <Badge variant="outline" className="text-xs capitalize">
                                  {classInfo.type.replace("-", " ")}
                                </Badge>
                              </div>
                            </div>

                            {/* Action button */}
                            <Button
                              onClick={(e) => handleQuickBook(classInfo, e)}
                              disabled={isFull}
                              variant={isFull ? "outline" : "default"}
                              className="flex-shrink-0"
                            >
                              {isFull ? "Full" : "Book"}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Class Booking Modal */}
      {selectedClass && (
        <ClassBookingModal
          classInfo={selectedClass}
          onClose={() => setSelectedClass(null)}
        />
      )}
    </div>
  );
}
