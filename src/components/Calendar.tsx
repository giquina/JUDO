import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Plus, Clock, Users, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

interface ClassEvent {
  _id: string;
  name: string;
  startTime: string;
  endTime: string;
  instructor: string; // Will be changed to sensei
  location: string;
  maxCapacity: number;
  enrolled: number;
  level: "beginner" | "intermediate" | "advanced" | "all";
  type: "kata" | "randori" | "newaza" | "general";
}

interface CalendarProps {
  events?: ClassEvent[];
  onAddClass?: (date: Date) => void;
  onEditClass?: (classId: string) => void;
  canManage?: boolean; // If true, shows management controls (for senseis/admins)
}

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

// Mock events for demo - will be replaced with Convex queries
const mockEvents: ClassEvent[] = [
  {
    _id: "1",
    name: "Fundamentals - Beginners",
    startTime: "19:00",
    endTime: "20:30",
    instructor: "Sensei Yamamoto",
    location: "Main Dojo",
    maxCapacity: 25,
    enrolled: 18,
    level: "beginner",
    type: "general",
  },
  {
    _id: "2",
    name: "Kata Practice",
    startTime: "18:00",
    endTime: "19:00",
    instructor: "Sensei Chen",
    location: "Studio A",
    maxCapacity: 15,
    enrolled: 12,
    level: "intermediate",
    type: "kata",
  },
  {
    _id: "3",
    name: "Randori (Free Practice)",
    startTime: "20:00",
    endTime: "21:30",
    instructor: "Sensei Rodriguez",
    location: "Main Dojo",
    maxCapacity: 20,
    enrolled: 16,
    level: "advanced",
    type: "randori",
  },
];

export default function Calendar({
  events = mockEvents,
  onAddClass,
  onEditClass,
  canManage = false
}: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Get first day of month (0 = Sunday, 1 = Monday, etc.)
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  // Adjust so Monday = 0
  const adjustedFirstDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  // Build calendar grid
  const calendarDays: (Date | null)[] = [];

  // Previous month days
  for (let i = adjustedFirstDay - 1; i >= 0; i--) {
    calendarDays.push(new Date(year, month - 1, daysInPrevMonth - i));
  }

  // Current month days
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(new Date(year, month, i));
  }

  // Next month days to complete the grid
  const remainingDays = 42 - calendarDays.length; // 6 weeks * 7 days
  for (let i = 1; i <= remainingDays; i++) {
    calendarDays.push(new Date(year, month + 1, i));
  }

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(year, month - 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const isToday = (date: Date | null) => {
    if (!date) return false;
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const isCurrentMonth = (date: Date | null) => {
    if (!date) return false;
    return date.getMonth() === month;
  };

  const getEventsForDay = (date: Date | null) => {
    if (!date) return [];
    const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday, etc.

    // For demo, show events on specific days
    // Monday (1), Wednesday (3), Friday (5)
    if (dayOfWeek === 1) return [events[0]]; // Monday - Fundamentals
    if (dayOfWeek === 3) return [events[1]]; // Wednesday - Kata
    if (dayOfWeek === 5) return [events[2]]; // Friday - Randori

    return [];
  };

  const handleDateClick = (date: Date | null) => {
    if (date) {
      setSelectedDate(date);
    }
  };

  const handleAddClass = () => {
    if (selectedDate && onAddClass) {
      onAddClass(selectedDate);
    }
  };

  const selectedDayEvents = selectedDate ? getEventsForDay(selectedDate) : [];

  const levelColors = {
    beginner: "bg-green-500/10 text-green-700 border-green-500/20",
    intermediate: "bg-blue-500/10 text-blue-700 border-blue-500/20",
    advanced: "bg-purple-500/10 text-purple-700 border-purple-500/20",
    all: "bg-gray-500/10 text-gray-700 border-gray-500/20",
  };

  return (
    <div className="space-y-6">
      <Card className="elevation-2">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="heading-4">Training Schedule</CardTitle>
              <CardDescription>View and manage dojo classes</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={goToToday}>
                Today
              </Button>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={goToPreviousMonth}
                  className="h-8 w-8"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="min-w-[180px] text-center">
                  <h2 className="heading-5">
                    {MONTHS[month]} {year}
                  </h2>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={goToNextMonth}
                  className="h-8 w-8"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2">
            {/* Day headers */}
            {DAYS.map((day) => (
              <div
                key={day}
                className="text-center font-semibold text-sm text-muted-foreground pb-2"
              >
                {day}
              </div>
            ))}

            {/* Calendar days */}
            {calendarDays.map((date, index) => {
              const dayEvents = getEventsForDay(date);
              const isTodayDate = isToday(date);
              const isSelected = selectedDate && date &&
                selectedDate.getDate() === date.getDate() &&
                selectedDate.getMonth() === date.getMonth() &&
                selectedDate.getFullYear() === date.getFullYear();

              return (
                <div
                  key={index}
                  onClick={() => handleDateClick(date)}
                  className={cn(
                    "min-h-[80px] p-2 rounded-lg border cursor-pointer transition-all",
                    "hover:border-primary hover:elevation-2",
                    isCurrentMonth(date) ? "bg-card" : "bg-muted/30 text-muted-foreground",
                    isTodayDate && "border-primary border-2 bg-primary/5",
                    isSelected && "ring-2 ring-primary ring-offset-2",
                    dayEvents.length > 0 && "border-primary/40"
                  )}
                >
                  <div className={cn(
                    "text-sm font-medium mb-1",
                    isTodayDate && "text-primary font-bold"
                  )}>
                    {date?.getDate()}
                  </div>

                  {/* Event indicators */}
                  <div className="space-y-1">
                    {dayEvents.slice(0, 2).map((event) => (
                      <div
                        key={event._id}
                        className={cn(
                          "text-xs px-1.5 py-0.5 rounded border truncate",
                          levelColors[event.level]
                        )}
                      >
                        {event.startTime} {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                      </div>
                    ))}
                    {dayEvents.length > 2 && (
                      <div className="text-xs text-muted-foreground px-1.5">
                        +{dayEvents.length - 2} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Selected Day Details */}
      {selectedDate && (
        <Card className="elevation-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="heading-5">
                  {selectedDate.toLocaleDateString("en-GB", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric"
                  })}
                </CardTitle>
                <CardDescription>
                  {selectedDayEvents.length === 0
                    ? "No classes scheduled"
                    : `${selectedDayEvents.length} class${selectedDayEvents.length > 1 ? "es" : ""} scheduled`}
                </CardDescription>
              </div>
              {canManage && (
                <Button onClick={handleAddClass} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Class
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {selectedDayEvents.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Clock className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p className="body-small">No classes scheduled for this day</p>
                {canManage && (
                  <Button variant="outline" className="mt-4" onClick={handleAddClass}>
                    Schedule a Class
                  </Button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {selectedDayEvents.map((event) => (
                  <div
                    key={event._id}
                    className="p-4 rounded-lg border bg-card hover:elevation-2 transition-all cursor-pointer"
                    onClick={() => onEditClass && onEditClass(event._id)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-lg">{event.name}</h3>
                        <p className="text-sm text-muted-foreground">{event.instructor}</p>
                      </div>
                      <Badge className={cn("capitalize", levelColors[event.level])}>
                        {event.level}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>{event.startTime} - {event.endTime}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>{event.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Users className="h-4 w-4" />
                        <span>{event.enrolled}/{event.maxCapacity} enrolled</span>
                      </div>
                      <Badge variant="outline" className="w-fit">
                        {event.type}
                      </Badge>
                    </div>

                    {/* Capacity bar */}
                    <div className="mt-3">
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className={cn(
                            "h-full transition-all",
                            event.enrolled / event.maxCapacity >= 0.9
                              ? "bg-red-500"
                              : event.enrolled / event.maxCapacity >= 0.7
                              ? "bg-amber-500"
                              : "bg-green-500"
                          )}
                          style={{ width: `${(event.enrolled / event.maxCapacity) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Legend */}
      <Card className="elevation-1">
        <CardHeader>
          <CardTitle className="text-sm font-medium">Training Types</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-sm">Beginner</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <span className="text-sm">Intermediate</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-purple-500" />
              <span className="text-sm">Advanced</span>
            </div>
            <div className="border-l pl-3 ml-1 flex items-center gap-4">
              <Badge variant="outline" className="text-xs">Kata</Badge>
              <Badge variant="outline" className="text-xs">Randori</Badge>
              <Badge variant="outline" className="text-xs">Newaza</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
