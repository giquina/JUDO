import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import Navigation from "@/components/Navigation";
import MobileNavigation from "@/components/MobileNavigation";
import PageTransition from "@/components/PageTransition";
import {
  Calendar,
  Clock,
  Users,
  MapPin,
  Search,
  ChevronRight,
  TrendingUp,
  BarChart3,
  Eye,
} from "lucide-react";

// Mock data - will be replaced with Convex queries
const mockClasses = [
  {
    _id: "class-1",
    name: "Monday Evening Fundamentals",
    dayOfWeek: "Monday",
    startTime: "19:00",
    endTime: "20:30",
    level: "beginner",
    maxCapacity: 25,
    currentEnrollment: 18,
    location: "Central YMCA, Studio A",
    averageAttendance: 85,
    enrolledMembers: [
      { _id: "m1", name: "Alice Chen", beltRank: "blue" },
      { _id: "m2", name: "Raj Patel", beltRank: "white" },
      { _id: "m3", name: "Emma Williams", beltRank: "yellow" },
      { _id: "m4", name: "James O'Brien", beltRank: "orange" },
      { _id: "m5", name: "Sofia Rodriguez", beltRank: "green" },
    ],
  },
  {
    _id: "class-2",
    name: "Wednesday Intermediate",
    dayOfWeek: "Wednesday",
    startTime: "19:00",
    endTime: "20:30",
    level: "intermediate",
    maxCapacity: 20,
    currentEnrollment: 16,
    location: "Central YMCA, Studio A",
    averageAttendance: 78,
    enrolledMembers: [
      { _id: "m1", name: "Alice Chen", beltRank: "blue" },
      { _id: "m6", name: "Mohammed Hassan", beltRank: "brown" },
      { _id: "m7", name: "Lucy Taylor", beltRank: "green" },
      { _id: "m8", name: "Yuki Tanaka", beltRank: "blue" },
    ],
  },
  {
    _id: "class-3",
    name: "Friday Advanced",
    dayOfWeek: "Friday",
    startTime: "20:00",
    endTime: "21:30",
    level: "advanced",
    maxCapacity: 15,
    currentEnrollment: 12,
    location: "Central YMCA, Studio B",
    averageAttendance: 92,
    enrolledMembers: [
      { _id: "m6", name: "Mohammed Hassan", beltRank: "brown" },
      { _id: "m9", name: "David Kim", beltRank: "black" },
      { _id: "m10", name: "Sarah Johnson", beltRank: "brown" },
    ],
  },
  {
    _id: "class-4",
    name: "Saturday Morning Randori",
    dayOfWeek: "Saturday",
    startTime: "10:00",
    endTime: "12:00",
    level: "all",
    maxCapacity: 30,
    currentEnrollment: 24,
    location: "Central YMCA, Main Hall",
    averageAttendance: 70,
    enrolledMembers: [
      { _id: "m1", name: "Alice Chen", beltRank: "blue" },
      { _id: "m2", name: "Raj Patel", beltRank: "white" },
      { _id: "m9", name: "David Kim", beltRank: "black" },
    ],
  },
];

const LEVEL_COLORS: Record<string, string> = {
  beginner: "bg-green-100 text-green-800 border-green-200",
  intermediate: "bg-blue-100 text-blue-800 border-blue-200",
  advanced: "bg-purple-100 text-purple-800 border-purple-200",
  all: "bg-orange-100 text-orange-800 border-orange-200",
};

const BELT_COLORS: Record<string, string> = {
  white: "bg-gray-100 text-gray-800",
  yellow: "bg-yellow-100 text-yellow-800",
  orange: "bg-orange-100 text-orange-800",
  green: "bg-green-100 text-green-800",
  blue: "bg-blue-600 text-white",
  brown: "bg-amber-800 text-white",
  black: "bg-gray-900 text-white",
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const cardVariants = {
  hidden: { scale: 0.95, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 15,
    },
  },
};

// Dojo background pattern
function DojoBackgroundPattern() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.04]">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="tatami-classes" x="0" y="0" width="60" height="30" patternUnits="userSpaceOnUse">
              <rect width="60" height="30" fill="none" stroke="currentColor" strokeWidth="1"/>
              <line x1="30" y1="0" x2="30" y2="30" stroke="currentColor" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#tatami-classes)" className="text-primary"/>
        </svg>
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background" />
    </div>
  );
}

// Progress bar component
function ProgressBar({ value, max, className = "" }: { value: number; max: number; className?: string }) {
  const percentage = Math.round((value / max) * 100);

  return (
    <div className={`w-full h-2 bg-muted rounded-full overflow-hidden ${className}`}>
      <motion.div
        className="h-full bg-gradient-to-r from-primary to-blue-500 rounded-full"
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ duration: 1, ease: "easeOut" }}
      />
    </div>
  );
}

// Class card component
function ClassCard({
  cls,
  onViewDetails,
}: {
  cls: typeof mockClasses[0];
  onViewDetails: () => void;
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ scale: 1.01, y: -2 }}
      whileTap={{ scale: 0.99 }}
    >
      <Card className="overflow-hidden hover:shadow-lg transition-all duration-300">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <CardTitle className="text-lg flex items-center gap-2">
                {cls.name}
              </CardTitle>
              <CardDescription className="flex items-center gap-4 mt-1">
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {cls.dayOfWeek}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {cls.startTime} - {cls.endTime}
                </span>
              </CardDescription>
            </div>
            <Badge className={LEVEL_COLORS[cls.level]} variant="secondary">
              {cls.level}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Location */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            {cls.location}
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center justify-center gap-1 text-2xl font-bold text-primary">
                <Users className="h-5 w-5" />
                {cls.currentEnrollment}
              </div>
              <p className="text-xs text-muted-foreground">Enrolled</p>
            </div>
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">
                {cls.maxCapacity}
              </div>
              <p className="text-xs text-muted-foreground">Capacity</p>
            </div>
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center justify-center gap-1 text-2xl font-bold text-green-600">
                <TrendingUp className="h-5 w-5" />
                {cls.averageAttendance}%
              </div>
              <p className="text-xs text-muted-foreground">Avg. Attendance</p>
            </div>
          </div>

          {/* Capacity Progress */}
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Capacity</span>
              <span className="font-medium">{cls.currentEnrollment}/{cls.maxCapacity}</span>
            </div>
            <ProgressBar value={cls.currentEnrollment} max={cls.maxCapacity} />
          </div>

          {/* Enrolled Members Preview */}
          <motion.div
            initial={false}
            animate={{ height: isExpanded ? "auto" : 0 }}
            className="overflow-hidden"
          >
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="pt-4 border-t space-y-2"
                >
                  <p className="text-sm font-medium text-muted-foreground">Enrolled Judoka:</p>
                  <div className="flex flex-wrap gap-2">
                    {cls.enrolledMembers.map((member) => (
                      <Badge
                        key={member._id}
                        variant="outline"
                        className="flex items-center gap-1.5"
                      >
                        <span className={`w-2 h-2 rounded-full ${BELT_COLORS[member.beltRank].split(" ")[0]}`} />
                        {member.name}
                      </Badge>
                    ))}
                    {cls.currentEnrollment > cls.enrolledMembers.length && (
                      <Badge variant="secondary">
                        +{cls.currentEnrollment - cls.enrolledMembers.length} more
                      </Badge>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              <Users className="h-4 w-4 mr-1" />
              {isExpanded ? "Hide Members" : "View Members"}
            </Button>
            <Button
              size="sm"
              className="flex-1 bg-gradient-to-r from-violet-600 to-blue-600"
              onClick={onViewDetails}
            >
              <Eye className="h-4 w-4 mr-1" />
              Class Details
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Quick stat card
function QuickStatCard({
  icon: Icon,
  iconColor,
  gradient,
  title,
  value,
  subtitle,
}: {
  icon: typeof Calendar;
  iconColor: string;
  gradient: string;
  title: string;
  value: number | string;
  subtitle: string;
}) {
  return (
    <motion.div variants={cardVariants} whileHover={{ scale: 1.02, y: -4 }}>
      <Card className={`${gradient} border-opacity-50 hover:shadow-xl transition-all duration-300`}>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Icon className={`h-4 w-4 ${iconColor}`} />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{value}</p>
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function CoachClassesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);

  const filteredClasses = useMemo(() => {
    return mockClasses.filter((cls) => {
      const matchesSearch =
        cls.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cls.dayOfWeek.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cls.location.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesLevel = !selectedLevel || cls.level === selectedLevel;
      return matchesSearch && matchesLevel;
    });
  }, [searchQuery, selectedLevel]);

  const totalEnrolled = mockClasses.reduce((sum, cls) => sum + cls.currentEnrollment, 0);
  const avgAttendance = Math.round(
    mockClasses.reduce((sum, cls) => sum + cls.averageAttendance, 0) / mockClasses.length
  );

  const handleViewDetails = (classId: string) => {
    // Will navigate to class details page when implemented
    console.log("View details for class:", classId);
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-background relative">
        <DojoBackgroundPattern />
        <Navigation />

        <main className="container mx-auto p-4 space-y-6 relative z-10">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded-2xl"
          >
            <div className="absolute inset-0">
              <img
                src="https://images.unsplash.com/photo-1555597673-b21d5c935865?w=1200&q=70"
                alt="Judo training"
                loading="lazy"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
            </div>

            <div className="relative p-6 sm:p-8">
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                My Keiko Sessions
              </h1>
              <p className="text-sm sm:text-base text-white/90 mt-1 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                Manage your classes and view enrolled judoka
              </p>
            </div>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4"
          >
            <QuickStatCard
              icon={Calendar}
              iconColor="text-blue-500"
              gradient="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-200 dark:border-blue-800"
              title="Total Classes"
              value={mockClasses.length}
              subtitle="keiko sessions"
            />
            <QuickStatCard
              icon={Users}
              iconColor="text-green-500"
              gradient="bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-200 dark:border-green-800"
              title="Total Enrolled"
              value={totalEnrolled}
              subtitle="judoka across all"
            />
            <QuickStatCard
              icon={TrendingUp}
              iconColor="text-purple-500"
              gradient="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-200 dark:border-purple-800"
              title="Avg. Attendance"
              value={`${avgAttendance}%`}
              subtitle="across all classes"
            />
            <QuickStatCard
              icon={BarChart3}
              iconColor="text-orange-500"
              gradient="bg-gradient-to-br from-orange-500/10 to-orange-600/5 border-orange-200 dark:border-orange-800"
              title="This Week"
              value={4}
              subtitle="sessions scheduled"
            />
          </motion.div>

          {/* Search and Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-3"
          >
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search classes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 min-h-[44px]"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {["beginner", "intermediate", "advanced", "all"].map((level) => (
                <Button
                  key={level}
                  variant={selectedLevel === level ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedLevel(selectedLevel === level ? null : level)}
                  className="capitalize min-h-[44px]"
                >
                  {level}
                </Button>
              ))}
            </div>
          </motion.div>

          {/* Classes Grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid gap-4 md:grid-cols-2"
          >
            {filteredClasses.map((cls) => (
              <ClassCard
                key={cls._id}
                cls={cls}
                onViewDetails={() => handleViewDetails(cls._id)}
              />
            ))}
          </motion.div>

          {/* Empty State */}
          {filteredClasses.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <Calendar className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground">No classes match your search</p>
            </motion.div>
          )}
        </main>

        <MobileNavigation />
      </div>
    </PageTransition>
  );
}
