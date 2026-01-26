import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/Navigation";
import MobileNavigation from "@/components/MobileNavigation";
import MemberSidebar from "@/components/MemberSidebar";
import PageTransition from "@/components/PageTransition";
import DashboardWrapper from "@/components/DashboardWrapper";
import {
  Calendar,
  Clock,
  User,
  Users,
  CheckCircle2,
  XCircle,
  Filter,
} from "lucide-react";

// Mock data for weekly class schedule
const mockWeeklyClasses = [
  {
    _id: "mon-1",
    day: "Monday",
    name: "Fundamentals Class",
    time: "18:00",
    duration: "1.5h",
    coach: "Sensei Tanaka",
    level: "Beginner" as const,
    spotsAvailable: 8,
    maxSpots: 20,
    isBooked: false,
    description: "Perfect for beginners. Focus on breakfalls, basic throws, and groundwork.",
  },
  {
    _id: "mon-2",
    day: "Monday",
    name: "Evening Randori",
    time: "19:30",
    duration: "1h",
    coach: "Sensei Yamamoto",
    level: "Intermediate" as const,
    spotsAvailable: 5,
    maxSpots: 16,
    isBooked: true,
    description: "Sparring practice for intermediate judoka. Good fitness required.",
  },
  {
    _id: "tue-1",
    day: "Tuesday",
    name: "Kata Practice",
    time: "18:30",
    duration: "1.5h",
    coach: "Sensei Tanaka",
    level: "All Levels" as const,
    spotsAvailable: 12,
    maxSpots: 20,
    isBooked: false,
    description: "Traditional kata forms. Nage-no-kata and Katame-no-kata.",
  },
  {
    _id: "wed-1",
    day: "Wednesday",
    name: "Intermediate Technique",
    time: "18:00",
    duration: "1.5h",
    coach: "Sensei Yamamoto",
    level: "Intermediate" as const,
    spotsAvailable: 6,
    maxSpots: 18,
    isBooked: false,
    description: "Advanced throws and combinations. Minimum yellow belt required.",
  },
  {
    _id: "wed-2",
    day: "Wednesday",
    name: "Competition Training",
    time: "19:30",
    duration: "2h",
    coach: "Sensei Tanaka",
    level: "Advanced" as const,
    spotsAvailable: 3,
    maxSpots: 12,
    isBooked: true,
    description: "High-intensity training for competition preparation.",
  },
  {
    _id: "thu-1",
    day: "Thursday",
    name: "Beginners Welcome",
    time: "18:30",
    duration: "1h",
    coach: "Coach Sarah",
    level: "Beginner" as const,
    spotsAvailable: 15,
    maxSpots: 20,
    isBooked: false,
    description: "Introduction to judo for complete beginners. No experience needed.",
  },
  {
    _id: "fri-1",
    day: "Friday",
    name: "Open Mat",
    time: "18:00",
    duration: "2h",
    coach: "Sensei Tanaka",
    level: "All Levels" as const,
    spotsAvailable: 10,
    maxSpots: 30,
    isBooked: false,
    description: "Free practice session. Work on your own techniques or spar with partners.",
  },
  {
    _id: "fri-2",
    day: "Friday",
    name: "Advanced Groundwork",
    time: "20:00",
    duration: "1.5h",
    coach: "Sensei Yamamoto",
    level: "Advanced" as const,
    spotsAvailable: 0,
    maxSpots: 14,
    isBooked: false,
    description: "Ne-waza specialization. Submissions, escapes, and transitions.",
  },
  {
    _id: "sat-1",
    day: "Saturday",
    name: "Weekend Warriors",
    time: "10:00",
    duration: "2h",
    coach: "Sensei Tanaka",
    level: "All Levels" as const,
    spotsAvailable: 12,
    maxSpots: 25,
    isBooked: true,
    description: "Extended weekend session. Full warm-up, technique, and randori.",
  },
  {
    _id: "sat-2",
    day: "Saturday",
    name: "Kids Judo (6-12)",
    time: "13:00",
    duration: "1h",
    coach: "Coach Sarah",
    level: "Beginner" as const,
    spotsAvailable: 8,
    maxSpots: 15,
    isBooked: false,
    description: "Fun and safe judo training for children aged 6-12.",
  },
  {
    _id: "sun-1",
    day: "Sunday",
    name: "Sunday Technique Lab",
    time: "11:00",
    duration: "1.5h",
    coach: "Sensei Yamamoto",
    level: "Intermediate" as const,
    spotsAvailable: 7,
    maxSpots: 16,
    isBooked: false,
    description: "Deep dive into specific techniques. Different focus each week.",
  },
];

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const levelFilters = ["All", "Beginner", "Intermediate", "Advanced", "All Levels"] as const;

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring" as const, stiffness: 100, damping: 12 },
  },
};

export default function MemberClassesPage() {
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [levelFilter, setLevelFilter] = useState<string>("All");
  const [classes, setClasses] = useState(mockWeeklyClasses);
  const [isBooking, setIsBooking] = useState<string | null>(null);

  // Get today's day name
  const today = new Date().toLocaleDateString("en-US", { weekday: "long" });

  // Filter classes by day and level
  const filteredClasses = classes.filter((cls) => {
    const dayMatch = selectedDay ? cls.day === selectedDay : true;
    const levelMatch = levelFilter === "All" || cls.level === levelFilter;
    return dayMatch && levelMatch;
  });

  // Group classes by day
  const classesByDay = daysOfWeek.reduce((acc, day) => {
    acc[day] = filteredClasses.filter((cls) => cls.day === day);
    return acc;
  }, {} as Record<string, typeof filteredClasses>);

  const handleBookClass = async (classId: string) => {
    setIsBooking(classId);
    const cls = classes.find((c) => c._id === classId);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800));

    setClasses((prev) =>
      prev.map((c) => {
        if (c._id === classId) {
          const newIsBooked = !c.isBooked;
          return {
            ...c,
            isBooked: newIsBooked,
            spotsAvailable: newIsBooked ? c.spotsAvailable - 1 : c.spotsAvailable + 1,
          };
        }
        return c;
      })
    );

    setIsBooking(null);

    if (cls?.isBooked) {
      toast.success("Booking cancelled", {
        description: `You've been removed from ${cls.name}`,
      });
    } else {
      toast.success("Class booked!", {
        description: `You're confirmed for ${cls?.name}`,
      });
    }
  };

  const bookedClassesCount = classes.filter((c) => c.isBooked).length;

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <Navigation />
        <MemberSidebar />

        <DashboardWrapper className="container mx-auto p-4 space-y-6 pb-24 md:ml-64">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 p-6"
          >
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-30" />
            <div className="relative">
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Keiko Schedule</h1>
              <p className="text-white/80">Book your training sessions for the week</p>
              <div className="flex items-center gap-4 mt-4">
                <Badge variant="secondary" className="bg-white/20 text-white border-0">
                  <Calendar className="w-3 h-3 mr-1" />
                  {bookedClassesCount} classes booked
                </Badge>
              </div>
            </div>
          </motion.div>

          {/* Day Filter Pills */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="overflow-x-auto pb-2 -mx-4 px-4"
          >
            <div className="flex gap-2 min-w-max">
              <Button
                variant={selectedDay === null ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedDay(null)}
                className="rounded-full"
              >
                All Days
              </Button>
              {daysOfWeek.map((day) => (
                <Button
                  key={day}
                  variant={selectedDay === day ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedDay(day)}
                  className={`rounded-full ${day === today ? "ring-2 ring-primary/50" : ""}`}
                >
                  {day.slice(0, 3)}
                  {day === today && <span className="ml-1 text-xs">(Today)</span>}
                </Button>
              ))}
            </div>
          </motion.div>

          {/* Level Filter */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="flex items-center gap-2 overflow-x-auto pb-2"
          >
            <Filter className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            {levelFilters.map((level) => (
              <Badge
                key={level}
                variant={levelFilter === level ? "default" : "outline"}
                className="cursor-pointer hover:bg-primary/10 transition-colors"
                onClick={() => setLevelFilter(level)}
              >
                {level}
              </Badge>
            ))}
          </motion.div>

          {/* Classes List */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            {selectedDay ? (
              // Single day view
              <div className="space-y-3">
                {classesByDay[selectedDay]?.length > 0 ? (
                  classesByDay[selectedDay].map((cls) => (
                    <ClassCardWithBooking
                      key={cls._id}
                      classData={cls}
                      isBooking={isBooking === cls._id}
                      onBook={() => handleBookClass(cls._id)}
                    />
                  ))
                ) : (
                  <Card className="p-8 text-center">
                    <p className="text-muted-foreground">No classes match your filters for {selectedDay}</p>
                  </Card>
                )}
              </div>
            ) : (
              // All days view
              daysOfWeek.map((day) => {
                const dayClasses = classesByDay[day];
                if (!dayClasses || dayClasses.length === 0) return null;

                return (
                  <motion.div key={day} variants={itemVariants}>
                    <div className="flex items-center gap-2 mb-3">
                      <h2 className={`text-lg font-semibold ${day === today ? "text-primary" : ""}`}>
                        {day}
                        {day === today && (
                          <Badge variant="secondary" className="ml-2 text-xs">
                            Today
                          </Badge>
                        )}
                      </h2>
                      <div className="flex-1 h-px bg-border" />
                      <span className="text-sm text-muted-foreground">{dayClasses.length} classes</span>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {dayClasses.map((cls) => (
                        <ClassCardWithBooking
                          key={cls._id}
                          classData={cls}
                          isBooking={isBooking === cls._id}
                          onBook={() => handleBookClass(cls._id)}
                        />
                      ))}
                    </div>
                  </motion.div>
                );
              })
            )}
          </motion.div>

          {filteredClasses.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <Calendar className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
              <h3 className="text-lg font-medium mb-2">No classes found</h3>
              <p className="text-muted-foreground mb-4">Try adjusting your filters</p>
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedDay(null);
                  setLevelFilter("All");
                }}
              >
                Clear Filters
              </Button>
            </motion.div>
          )}
        </DashboardWrapper>

        <MobileNavigation />
      </div>
    </PageTransition>
  );
}

// Extended Class Card with booking functionality
interface ClassCardWithBookingProps {
  classData: (typeof mockWeeklyClasses)[0];
  isBooking: boolean;
  onBook: () => void;
}

function ClassCardWithBooking({ classData, isBooking, onBook }: ClassCardWithBookingProps) {
  const isFull = classData.spotsAvailable <= 0 && !classData.isBooked;

  return (
    <motion.div variants={itemVariants}>
      <Card
        className={`relative overflow-hidden transition-all hover:shadow-lg ${
          classData.isBooked ? "ring-2 ring-primary border-primary" : ""
        }`}
      >
        {classData.isBooked && (
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-purple-500" />
        )}

        <CardContent className="p-4">
          {/* Level Badge */}
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <h3 className="font-semibold text-lg leading-tight">{classData.name}</h3>
              <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                <User className="w-3 h-3" />
                {classData.coach}
              </p>
            </div>
            <Badge
              variant="secondary"
              className={
                classData.level === "Beginner"
                  ? "bg-green-500/10 text-green-600 border-green-500/20"
                  : classData.level === "Intermediate"
                  ? "bg-yellow-500/10 text-yellow-600 border-yellow-500/20"
                  : classData.level === "Advanced"
                  ? "bg-red-500/10 text-red-600 border-red-500/20"
                  : "bg-blue-500/10 text-blue-600 border-blue-500/20"
              }
            >
              {classData.level}
            </Badge>
          </div>

          {/* Time and Details */}
          <div className="grid grid-cols-2 gap-2 text-sm mb-3">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>
                {classData.time} ({classData.duration})
              </span>
            </div>
            <div
              className={`flex items-center gap-2 ${
                isFull
                  ? "text-destructive"
                  : classData.spotsAvailable <= 3
                  ? "text-yellow-600"
                  : "text-muted-foreground"
              }`}
            >
              <Users className="w-4 h-4" />
              <span>
                {isFull ? "Full" : `${classData.spotsAvailable}/${classData.maxSpots} spots`}
              </span>
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{classData.description}</p>

          {/* Book Button */}
          <Button
            onClick={onBook}
            disabled={isFull || isBooking}
            variant={classData.isBooked ? "outline" : "default"}
            className="w-full"
          >
            {isBooking ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
              />
            ) : classData.isBooked ? (
              <>
                <XCircle className="w-4 h-4 mr-2" />
                Cancel Booking
              </>
            ) : isFull ? (
              "Class Full"
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Book Class
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}
