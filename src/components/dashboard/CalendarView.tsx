import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  CheckCircle2,
  XCircle,
  Circle,
  Download,
  Smartphone,
  LayoutGrid,
  LayoutList,
  Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import {
  mockCalendarData,
  getClassInstancesForDateRange,
  hasBooking,
  getAttendanceStatus,
  type CalendarEvent,
  type AttendanceStatus
} from "@/lib/mockCalendarData";
import ClassBookingModal from "./ClassBookingModal";

type ViewMode = "month" | "week" | "day";

interface SelectedDay {
  date: Date;
  classes: Array<{
    classInfo: any;
    startDateTime: Date;
    endDateTime: Date;
    bookingStatus?: string;
    attendanceStatus: AttendanceStatus;
  }>;
  events: CalendarEvent[];
}

export default function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>("month");
  const [selectedDay, setSelectedDay] = useState<SelectedDay | null>(null);
  const [selectedClassForBooking, setSelectedClassForBooking] = useState<any>(null);
  const [showLegend, setShowLegend] = useState(false);

  // Get data
  const { bookings, attendance, events } = mockCalendarData;

  // Calendar calculation helpers
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  const firstDayOfWeek = firstDayOfMonth.getDay();
  const daysInMonth = lastDayOfMonth.getDate();

  // Get class instances for the current month
  const monthStart = new Date(firstDayOfMonth);
  monthStart.setDate(monthStart.getDate() - firstDayOfWeek);
  const monthEnd = new Date(lastDayOfMonth);
  monthEnd.setDate(monthEnd.getDate() + (6 - lastDayOfMonth.getDay()));

  const classInstances = useMemo(
    () => getClassInstancesForDateRange(monthStart, monthEnd),
    [monthStart, monthEnd]
  );

  // Navigation
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const goToPreviousWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() - 7);
    setCurrentDate(newDate);
  };

  const goToNextWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + 7);
    setCurrentDate(newDate);
  };

  const goToPreviousDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() - 1);
    setCurrentDate(newDate);
  };

  const goToNextDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + 1);
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Get day details
  const getDayDetails = (date: Date): SelectedDay => {
    const dayClasses = classInstances
      .filter(instance => instance.date.toDateString() === date.toDateString())
      .map(instance => ({
        classInfo: instance.classInfo,
        startDateTime: instance.startDateTime,
        endDateTime: instance.endDateTime,
        bookingStatus: hasBooking(instance.classInfo.id, date, bookings)?.status,
        attendanceStatus: getAttendanceStatus(instance.classInfo.id, date, attendance),
      }));

    const dayEvents = events.filter(event =>
      new Date(event.date).toDateString() === date.toDateString()
    );

    return {
      date,
      classes: dayClasses,
      events: dayEvents,
    };
  };

  // Handle day click
  const handleDayClick = (date: Date) => {
    const details = getDayDetails(date);
    setSelectedDay(details);
  };

  // Export functions
  const exportToICalendar = () => {
    // In real app, this would generate an .ics file
    alert("iCalendar export coming soon! This will download a .ics file with all your bookings.");
  };

  const syncWithDevice = () => {
    // In real app, this would integrate with device calendar
    alert("Calendar sync coming soon! This will sync your bookings with your device calendar.");
  };

  // Render calendar grid for month view
  const renderMonthView = () => {
    const days = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Add empty cells for days before month starts
    for (let i = 0; i < firstDayOfWeek; i++) {
      const emptyDate = new Date(monthStart);
      emptyDate.setDate(emptyDate.getDate() + i);
      days.push(
        <motion.div
          key={`empty-${i}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="min-h-24 p-1 border border-muted/30 bg-muted/5"
        >
          <div className="text-xs text-muted-foreground">{emptyDate.getDate()}</div>
        </motion.div>
      );
    }

    // Add cells for each day in month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const isToday = date.toDateString() === today.toDateString();
      const isPast = date < today;
      const isSelected = selectedDay?.date.toDateString() === date.toDateString();

      // Get classes and events for this day
      const dayClasses = classInstances.filter(
        instance => instance.date.toDateString() === date.toDateString()
      );

      const dayEvents = events.filter(
        event => new Date(event.date).toDateString() === date.toDateString()
      );

      // Count booking and attendance statuses
      const bookedCount = dayClasses.filter(instance =>
        hasBooking(instance.classInfo.id, date, bookings)
      ).length;

      const attendedCount = dayClasses.filter(instance =>
        getAttendanceStatus(instance.classInfo.id, date, attendance) === "attended"
      ).length;

      const missedCount = dayClasses.filter(instance =>
        getAttendanceStatus(instance.classInfo.id, date, attendance) === "missed"
      ).length;

      days.push(
        <motion.div
          key={day}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: day * 0.01 }}
          whileHover={{ scale: 1.02, y: -2 }}
          onClick={() => handleDayClick(date)}
          className={cn(
            "min-h-24 p-1.5 border cursor-pointer transition-all",
            isToday && "ring-2 ring-primary",
            isSelected && "bg-primary/10 border-primary",
            isPast && !isToday && "bg-muted/5",
            !isPast && "hover:bg-accent/50",
            "relative overflow-hidden"
          )}
        >
          {/* Date */}
          <div className={cn(
            "text-xs font-medium mb-1",
            isToday && "text-primary font-bold",
            isPast && !isToday && "text-muted-foreground"
          )}>
            {day}
          </div>

          {/* Status indicators */}
          <div className="space-y-0.5">
            {bookedCount > 0 && !isPast && (
              <div className="flex items-center gap-1 text-xs">
                <Circle className="w-2 h-2 fill-blue-500 text-blue-500" />
                <span className="text-muted-foreground">{bookedCount} booked</span>
              </div>
            )}
            {attendedCount > 0 && (
              <div className="flex items-center gap-1 text-xs">
                <CheckCircle2 className="w-2 h-2 text-green-500" />
                <span className="text-green-600 dark:text-green-400">{attendedCount}</span>
              </div>
            )}
            {missedCount > 0 && (
              <div className="flex items-center gap-1 text-xs">
                <XCircle className="w-2 h-2 text-red-500" />
                <span className="text-red-600 dark:text-red-400">{missedCount}</span>
              </div>
            )}
          </div>

          {/* Event indicators */}
          {dayEvents.length > 0 && (
            <div className="absolute bottom-1 left-1 right-1 flex gap-0.5 flex-wrap">
              {dayEvents.slice(0, 3).map(event => (
                <div
                  key={event.id}
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: event.color }}
                />
              ))}
            </div>
          )}

          {/* Class dots (limited to 4) */}
          {dayClasses.length > 0 && dayClasses.length <= 4 && (
            <div className="absolute top-1 right-1 flex gap-0.5">
              {dayClasses.map(instance => (
                <div
                  key={instance.classInfo.id}
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: instance.classInfo.color }}
                />
              ))}
            </div>
          )}
        </motion.div>
      );
    }

    // Add empty cells after month ends
    const remainingCells = 42 - (firstDayOfWeek + daysInMonth);
    for (let i = 1; i <= remainingCells; i++) {
      const emptyDate = new Date(monthEnd);
      emptyDate.setDate(emptyDate.getDate() + i);
      days.push(
        <motion.div
          key={`empty-end-${i}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="min-h-24 p-1 border border-muted/30 bg-muted/5"
        >
          <div className="text-xs text-muted-foreground">{emptyDate.getDate()}</div>
        </motion.div>
      );
    }

    return days;
  };

  // Render week view
  const renderWeekView = () => {
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());

    const weekDays = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      const isToday = date.toDateString() === today.toDateString();

      const dayClasses = classInstances.filter(
        instance => instance.date.toDateString() === date.toDateString()
      );

      weekDays.push(
        <div key={i} className={cn("border-r last:border-r-0", isToday && "bg-primary/5")}>
          <div className={cn(
            "p-3 border-b text-center sticky top-0 bg-background z-10",
            isToday && "bg-primary text-primary-foreground"
          )}>
            <div className="text-xs font-medium uppercase">
              {date.toLocaleDateString('en-US', { weekday: 'short' })}
            </div>
            <div className={cn("text-xl font-bold", isToday && "text-primary-foreground")}>
              {date.getDate()}
            </div>
          </div>

          <div className="p-2 space-y-2 min-h-96">
            {dayClasses.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground text-sm">
                No classes
              </div>
            ) : (
              dayClasses.map(instance => {
                const booking = hasBooking(instance.classInfo.id, date, bookings);
                const attendanceStatus = getAttendanceStatus(instance.classInfo.id, date, attendance);

                return (
                  <motion.div
                    key={instance.classInfo.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => setSelectedClassForBooking({ ...instance.classInfo, date })}
                    className="p-2 rounded-lg cursor-pointer border hover:shadow-md transition-all"
                    style={{ borderLeftColor: instance.classInfo.color, borderLeftWidth: 3 }}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div className="font-medium text-sm">{instance.classInfo.name}</div>
                      {booking && <Circle className="w-3 h-3 fill-blue-500 text-blue-500 flex-shrink-0" />}
                      {attendanceStatus === "attended" && <CheckCircle2 className="w-3 h-3 text-green-500 flex-shrink-0" />}
                      {attendanceStatus === "missed" && <XCircle className="w-3 h-3 text-red-500 flex-shrink-0" />}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {instance.classInfo.startTime}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {instance.classInfo.coach}
                    </div>
                    <Badge variant="outline" className="text-xs mt-1">
                      {instance.classInfo.level}
                    </Badge>
                  </motion.div>
                );
              })
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-7 border rounded-lg overflow-hidden">
        {weekDays}
      </div>
    );
  };

  // Render day view
  const renderDayView = () => {
    const dayClasses = classInstances.filter(
      instance => instance.date.toDateString() === currentDate.toDateString()
    );

    const dayEvents = events.filter(
      event => new Date(event.date).toDateString() === currentDate.toDateString()
    );

    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {currentDate.toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Events */}
            {dayEvents.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Events</h3>
                <div className="space-y-2">
                  {dayEvents.map(event => (
                    <div
                      key={event.id}
                      className="p-3 rounded-lg border-l-4"
                      style={{ borderLeftColor: event.color }}
                    >
                      <div className="font-medium">{event.title}</div>
                      {event.startTime && (
                        <div className="text-sm text-muted-foreground">
                          {event.startTime} - {event.endTime}
                        </div>
                      )}
                      {event.location && (
                        <div className="text-sm text-muted-foreground">{event.location}</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Classes */}
            {dayClasses.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Classes</h3>
                <div className="space-y-2">
                  {dayClasses.map(instance => {
                    const booking = hasBooking(instance.classInfo.id, currentDate, bookings);
                    const attendanceStatus = getAttendanceStatus(instance.classInfo.id, currentDate, attendance);

                    return (
                      <motion.div
                        key={instance.classInfo.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        whileHover={{ scale: 1.01 }}
                        onClick={() => setSelectedClassForBooking({ ...instance.classInfo, date: currentDate })}
                        className="p-4 rounded-lg cursor-pointer border-l-4 hover:shadow-md transition-all"
                        style={{ borderLeftColor: instance.classInfo.color }}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <div className="font-medium">{instance.classInfo.name}</div>
                              {booking && (
                                <Badge variant="outline" className="text-xs">
                                  Booked
                                </Badge>
                              )}
                              {attendanceStatus === "attended" && (
                                <Badge variant="outline" className="text-xs text-green-600">
                                  Attended
                                </Badge>
                              )}
                              {attendanceStatus === "missed" && (
                                <Badge variant="outline" className="text-xs text-red-600">
                                  Missed
                                </Badge>
                              )}
                            </div>
                            <div className="text-sm text-muted-foreground mb-2">
                              {instance.classInfo.startTime} ({instance.classInfo.duration} min) • {instance.classInfo.coach}
                            </div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <Badge variant="secondary" className="text-xs">
                                {instance.classInfo.level}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {instance.classInfo.currentBookings}/{instance.classInfo.capacity}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}

            {dayClasses.length === 0 && dayEvents.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <CalendarIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No classes or events scheduled for this day</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-4">
      {/* Header with controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                onClick={viewMode === "month" ? goToPreviousMonth : viewMode === "week" ? goToPreviousWeek : goToPreviousDay}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>

              <div className="text-lg font-semibold min-w-48 text-center">
                {viewMode === "month" && currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                {viewMode === "week" && `Week of ${currentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`}
                {viewMode === "day" && currentDate.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
              </div>

              <Button
                variant="outline"
                size="icon"
                onClick={viewMode === "month" ? goToNextMonth : viewMode === "week" ? goToNextWeek : goToNextDay}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>

              <Button variant="outline" size="sm" onClick={goToToday}>
                Today
              </Button>
            </div>

            <div className="flex items-center gap-2">
              {/* View mode tabs */}
              <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as ViewMode)}>
                <TabsList>
                  <TabsTrigger value="month" className="text-xs">
                    <LayoutGrid className="w-3 h-3 mr-1" />
                    Month
                  </TabsTrigger>
                  <TabsTrigger value="week" className="text-xs">
                    <LayoutList className="w-3 h-3 mr-1" />
                    Week
                  </TabsTrigger>
                  <TabsTrigger value="day" className="text-xs">
                    <CalendarIcon className="w-3 h-3 mr-1" />
                    Day
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              {/* Export options */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" onClick={exportToICalendar}>
                      <Download className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Export to iCalendar</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" onClick={syncWithDevice}>
                      <Smartphone className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Sync with device calendar</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={showLegend ? "default" : "outline"}
                      size="icon"
                      onClick={() => setShowLegend(!showLegend)}
                    >
                      <Info className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Toggle legend</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Legend */}
      <AnimatePresence>
        {showLegend && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Card>
              <CardContent className="pt-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center gap-2">
                    <Circle className="w-3 h-3 fill-blue-500 text-blue-500" />
                    <span className="text-sm">Booked</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3 h-3 text-green-500" />
                    <span className="text-sm">Attended</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <XCircle className="w-3 h-3 text-red-500" />
                    <span className="text-sm">Missed</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-primary" />
                    <span className="text-sm">Today</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main calendar view */}
      {viewMode === "month" && (
        <Card>
          <CardContent className="p-0">
            {/* Day headers */}
            <div className="grid grid-cols-7 border-b bg-muted/50">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
                <div key={day} className="p-2 text-center text-xs font-semibold border-r last:border-r-0">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7">
              {renderMonthView()}
            </div>
          </CardContent>
        </Card>
      )}

      {viewMode === "week" && renderWeekView()}

      {viewMode === "day" && renderDayView()}

      {/* Selected day details (for month view) */}
      <AnimatePresence>
        {selectedDay && viewMode === "month" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>
                    {selectedDay.date.toLocaleDateString('en-US', {
                      weekday: 'long',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                  <Button variant="ghost" size="sm" onClick={() => setSelectedDay(null)}>
                    Close
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-64">
                  <div className="space-y-4">
                    {/* Events */}
                    {selectedDay.events.length > 0 && (
                      <div>
                        <h3 className="font-semibold mb-2 text-sm">Events</h3>
                        <div className="space-y-2">
                          {selectedDay.events.map(event => (
                            <div
                              key={event.id}
                              className="p-2 rounded-lg border-l-4 text-sm"
                              style={{ borderLeftColor: event.color }}
                            >
                              <div className="font-medium">{event.title}</div>
                              {event.startTime && (
                                <div className="text-xs text-muted-foreground">
                                  {event.startTime} - {event.endTime}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Classes */}
                    {selectedDay.classes.length > 0 && (
                      <div>
                        <h3 className="font-semibold mb-2 text-sm">Classes</h3>
                        <div className="space-y-2">
                          {selectedDay.classes.map((classInfo, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.05 }}
                              onClick={() => setSelectedClassForBooking({ ...classInfo.classInfo, date: selectedDay.date })}
                              className="p-2 rounded-lg cursor-pointer border-l-4 hover:bg-accent transition-colors text-sm"
                              style={{ borderLeftColor: classInfo.classInfo.color }}
                            >
                              <div className="flex items-center justify-between gap-2 mb-1">
                                <div className="font-medium">{classInfo.classInfo.name}</div>
                                {classInfo.bookingStatus && (
                                  <Badge variant="outline" className="text-xs">Booked</Badge>
                                )}
                                {classInfo.attendanceStatus === "attended" && (
                                  <CheckCircle2 className="w-3 h-3 text-green-500" />
                                )}
                                {classInfo.attendanceStatus === "missed" && (
                                  <XCircle className="w-3 h-3 text-red-500" />
                                )}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {classInfo.classInfo.startTime} • {classInfo.classInfo.coach}
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    )}

                    {selectedDay.classes.length === 0 && selectedDay.events.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground text-sm">
                        No classes or events for this day
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Class Booking Modal */}
      {selectedClassForBooking && (
        <ClassBookingModal
          classInfo={selectedClassForBooking}
          onClose={() => setSelectedClassForBooking(null)}
        />
      )}
    </div>
  );
}
