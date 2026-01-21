import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CheckCircle2,
  XCircle,
  Circle,
  Users,
  Star,
  AlertTriangle,
  Printer,
  Filter
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  mockCalendarData,
  type JudoClass,
  type ClassLevel,
} from "@/lib/mockCalendarData";
import ClassBookingModal from "./ClassBookingModal";

interface TimeSlotClass {
  classInfo: JudoClass;
  isBooked: boolean;
  isUsualClass: boolean;
  hasConflict: boolean;
}

export default function WeeklySchedule() {
  const [selectedClass, setSelectedClass] = useState<(JudoClass & { date?: Date }) | null>(null);
  const [levelFilter, setLevelFilter] = useState<ClassLevel | "all">("all");
  const [showUsualOnly, setShowUsualOnly] = useState(false);

  const { classes, bookings } = mockCalendarData;

  // User's usual classes (classes they attend regularly)
  const usualClassIds = ["class-mon-1", "class-wed-1", "class-sat-1"];

  // Time slots (in 15-minute increments)
  const timeSlots = useMemo(() => {
    const slots: string[] = [];
    for (let hour = 9; hour <= 21; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const timeString = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
        slots.push(timeString);
      }
    }
    return slots;
  }, []);

  // Filter classes
  const filteredClasses = useMemo(() => {
    let filtered = classes;

    if (levelFilter !== "all") {
      filtered = filtered.filter(
        (c) => c.level === levelFilter || c.level === "all-levels"
      );
    }

    if (showUsualOnly) {
      filtered = filtered.filter((c) => usualClassIds.includes(c.id));
    }

    return filtered;
  }, [classes, levelFilter, showUsualOnly]);

  // Organize classes by day and time
  const scheduleGrid = useMemo(() => {
    const grid: Record<number, Record<string, TimeSlotClass[]>> = {};

    // Initialize grid
    for (let day = 0; day < 7; day++) {
      grid[day] = {};
      timeSlots.forEach((slot) => {
        grid[day][slot] = [];
      });
    }

    // Fill grid with classes
    filteredClasses.forEach((classInfo) => {
      const isBooked = bookings.some(
        (booking) =>
          booking.classId === classInfo.id && booking.status === "confirmed"
      );
      const isUsualClass = usualClassIds.includes(classInfo.id);

      // Check for conflicts (classes at the same time)
      const conflictingClasses = filteredClasses.filter(
        (c) =>
          c.dayOfWeek === classInfo.dayOfWeek &&
          c.id !== classInfo.id &&
          c.startTime === classInfo.startTime
      );

      const hasConflict = conflictingClasses.length > 0 && isBooked;

      const timeSlotClass: TimeSlotClass = {
        classInfo,
        isBooked,
        isUsualClass,
        hasConflict,
      };

      grid[classInfo.dayOfWeek][classInfo.startTime]?.push(timeSlotClass);
    });

    return grid;
  }, [filteredClasses, bookings, timeSlots, usualClassIds]);

  // Quick book/cancel actions
  const handleQuickBook = (classInfo: JudoClass, e: React.MouseEvent) => {
    e.stopPropagation();
    toast.success("Class booked!", {
      description: `${classInfo.name} has been added to your schedule.`,
    });
  };

  const handleQuickCancel = (classInfo: JudoClass, e: React.MouseEvent) => {
    e.stopPropagation();
    toast.info("Booking cancelled", {
      description: `${classInfo.name} has been removed from your schedule.`,
    });
  };

  // Print schedule
  const handlePrint = () => {
    window.print();
  };

  // Day headers
  const dayHeaders = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Find earliest and latest class times for compact view
  const earliestTime = useMemo(() => {
    const times = filteredClasses.map((c) => c.startTime);
    return times.length > 0 ? times.sort()[0] : "09:00";
  }, [filteredClasses]);

  const latestTime = useMemo(() => {
    const times = filteredClasses.map((c) => {
      const [hours, minutes] = c.startTime.split(":").map(Number);
      const endMinutes = minutes + c.duration;
      const endHours = hours + Math.floor(endMinutes / 60);
      return `${endHours.toString().padStart(2, "0")}:${(endMinutes % 60).toString().padStart(2, "0")}`;
    });
    return times.length > 0 ? times.sort().reverse()[0] : "21:00";
  }, [filteredClasses]);

  // Filter time slots to show only relevant times
  const relevantTimeSlots = useMemo(() => {
    return timeSlots.filter((slot) => slot >= earliestTime && slot <= latestTime);
  }, [timeSlots, earliestTime, latestTime]);

  // Show only hour markers (not every 15 minutes)
  const displayTimeSlots = relevantTimeSlots.filter((slot) => slot.endsWith(":00"));

  return (
    <div className="space-y-4">
      {/* Header with filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <CardTitle className="flex items-center gap-2">
                <span>Weekly Schedule</span>
              </CardTitle>
              <CardDescription>All classes for the week at a glance</CardDescription>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {/* Level filter */}
              <Select
                value={levelFilter}
                onValueChange={(value) => setLevelFilter(value as ClassLevel | "all")}
              >
                <SelectTrigger className="w-40">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Filter by level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                  <SelectItem value="competition">Competition</SelectItem>
                </SelectContent>
              </Select>

              {/* Show usual classes only */}
              <Button
                variant={showUsualOnly ? "default" : "outline"}
                size="sm"
                onClick={() => setShowUsualOnly(!showUsualOnly)}
                className="gap-2"
              >
                <Star className={cn("w-4 h-4", showUsualOnly && "fill-current")} />
                Your Usual
              </Button>

              {/* Print button */}
              <Button variant="outline" size="sm" onClick={handlePrint} className="gap-2">
                <Printer className="w-4 h-4" />
                Print
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Schedule Grid */}
      <Card className="overflow-hidden">
        <ScrollArea className="w-full">
          <div className="min-w-[900px]">
            {/* Day headers */}
            <div className="grid grid-cols-8 border-b bg-muted/50 sticky top-0 z-10">
              <div className="p-3 border-r font-semibold text-sm">Time</div>
              {dayHeaders.map((day, index) => {
                const today = new Date().getDay();
                const isToday = index === today;

                return (
                  <div
                    key={day}
                    className={cn(
                      "p-3 border-r last:border-r-0 text-center font-semibold text-sm",
                      isToday && "bg-primary text-primary-foreground"
                    )}
                  >
                    {day}
                  </div>
                );
              })}
            </div>

            {/* Time slots and classes */}
            <div className="divide-y">
              {displayTimeSlots.map((timeSlot, slotIndex) => (
                <div key={timeSlot} className="grid grid-cols-8 min-h-24">
                  {/* Time label */}
                  <div className="p-3 border-r text-sm text-muted-foreground font-medium">
                    {timeSlot}
                  </div>

                  {/* Classes for each day */}
                  {[0, 1, 2, 3, 4, 5, 6].map((dayIndex) => {
                    const dayClasses = scheduleGrid[dayIndex][timeSlot] || [];
                    const today = new Date().getDay();
                    const isToday = dayIndex === today;

                    return (
                      <div
                        key={`${dayIndex}-${timeSlot}`}
                        className={cn(
                          "p-2 border-r last:border-r-0 relative",
                          isToday && "bg-primary/5"
                        )}
                      >
                        {dayClasses.map((slot, classIndex) => {
                          const { classInfo, isBooked, isUsualClass, hasConflict } = slot;
                          const isFull = classInfo.currentBookings >= classInfo.capacity;

                          return (
                            <motion.div
                              key={classInfo.id}
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: slotIndex * 0.02 + classIndex * 0.05 }}
                              whileHover={{ scale: 1.02, y: -2 }}
                              onClick={() => setSelectedClass(classInfo)}
                              className={cn(
                                "p-2 rounded-lg cursor-pointer border-l-4 hover:shadow-md transition-all mb-2 last:mb-0",
                                isBooked && "ring-2 ring-primary ring-offset-1",
                                hasConflict && "ring-2 ring-red-500 ring-offset-1"
                              )}
                              style={{ borderLeftColor: classInfo.color }}
                            >
                              {/* Class name and badges */}
                              <div className="flex items-start justify-between gap-1 mb-1">
                                <div className="text-xs font-semibold line-clamp-1 flex-1">
                                  {classInfo.name}
                                </div>
                                <div className="flex items-center gap-0.5 flex-shrink-0">
                                  {isUsualClass && (
                                    <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                                  )}
                                  {isBooked && (
                                    <Circle className="w-3 h-3 fill-blue-500 text-blue-500" />
                                  )}
                                  {hasConflict && (
                                    <AlertTriangle className="w-3 h-3 text-red-500" />
                                  )}
                                </div>
                              </div>

                              {/* Time and duration */}
                              <div className="text-xs text-muted-foreground mb-1">
                                {classInfo.startTime} ({classInfo.duration}m)
                              </div>

                              {/* Level and capacity */}
                              <div className="flex items-center gap-1 mb-2">
                                <Badge variant="outline" className="text-xs px-1 py-0">
                                  {classInfo.level}
                                </Badge>
                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                  <Users className="w-3 h-3" />
                                  <span>
                                    {classInfo.currentBookings}/{classInfo.capacity}
                                  </span>
                                </div>
                              </div>

                              {/* Quick action buttons */}
                              <div className="flex items-center gap-1">
                                {isBooked ? (
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    className="h-6 text-xs px-2 w-full"
                                    onClick={(e) => handleQuickCancel(classInfo, e)}
                                  >
                                    <XCircle className="w-3 h-3 mr-1" />
                                    Cancel
                                  </Button>
                                ) : (
                                  <Button
                                    size="sm"
                                    variant={isFull ? "outline" : "default"}
                                    className="h-6 text-xs px-2 w-full"
                                    onClick={(e) => handleQuickBook(classInfo, e)}
                                    disabled={isFull}
                                  >
                                    <CheckCircle2 className="w-3 h-3 mr-1" />
                                    {isFull ? "Full" : "Book"}
                                  </Button>
                                )}
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </ScrollArea>
      </Card>

      {/* Legend */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Circle className="w-3 h-3 fill-blue-500 text-blue-500" />
              <span>Booked by you</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
              <span>Your usual class</span>
            </div>
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-3 h-3 text-red-500" />
              <span>Scheduling conflict</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 border-2 border-primary rounded" />
              <span>Today</span>
            </div>
          </div>
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
