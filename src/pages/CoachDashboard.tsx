import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import Navigation from "@/components/Navigation";
import MobileNavigation from "@/components/MobileNavigation";
import QRCodeGenerator from "@/components/QRCodeGenerator";
import PageTransition from "@/components/PageTransition";
import {
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  Filter,
  UserCheck,
  UserX,
  QrCode,
  TrendingUp,
  Calendar,
  ChevronDown,
  Sparkles,
  Download
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
    location: "Central YMCA, Studio A",
  },
  {
    _id: "class-2",
    name: "Wednesday Intermediate",
    dayOfWeek: "Wednesday",
    startTime: "19:00",
    endTime: "20:30",
    level: "intermediate",
    maxCapacity: 20,
    location: "Central YMCA, Studio A",
  },
  {
    _id: "class-3",
    name: "Friday Advanced",
    dayOfWeek: "Friday",
    startTime: "20:00",
    endTime: "21:30",
    level: "advanced",
    maxCapacity: 15,
    location: "Central YMCA, Studio B",
  },
];

const mockAttendance = [
  { memberId: "1", name: "Alice Chen", beltRank: "blue", status: "attended", checkInTime: Date.now() - 3600000 },
  { memberId: "2", name: "Raj Patel", beltRank: "white", status: "attended", checkInTime: Date.now() - 3500000 },
  { memberId: "3", name: "Emma Williams", beltRank: "yellow", status: "absent", checkInTime: null },
  { memberId: "4", name: "James O'Brien", beltRank: "orange", status: "attended", checkInTime: Date.now() - 3400000 },
  { memberId: "5", name: "Sofia Rodriguez", beltRank: "green", status: "absent", checkInTime: null },
  { memberId: "6", name: "Mohammed Hassan", beltRank: "brown", status: "attended", checkInTime: Date.now() - 3300000 },
  { memberId: "7", name: "Lucy Taylor", beltRank: "white", status: "absent", checkInTime: null },
  { memberId: "8", name: "Yuki Tanaka", beltRank: "black", status: "attended", checkInTime: Date.now() - 3200000 },
];

const BELT_COLORS: Record<string, string> = {
  white: "bg-gray-100 text-gray-800 border-gray-200",
  yellow: "bg-yellow-100 text-yellow-800 border-yellow-200",
  orange: "bg-orange-100 text-orange-800 border-orange-200",
  green: "bg-green-100 text-green-800 border-green-200",
  blue: "bg-blue-600 text-white border-blue-700",
  brown: "bg-amber-800 text-white border-amber-900",
  black: "bg-gray-900 text-white border-gray-950",
};

const LEVEL_COLORS: Record<string, string> = {
  beginner: "bg-green-100 text-green-800 border-green-200",
  intermediate: "bg-blue-100 text-blue-800 border-blue-200",
  advanced: "bg-purple-100 text-purple-800 border-purple-200",
};

// Animation variants
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

// Animated counter component
function AnimatedCounter({ value, duration = 0.8 }: { value: number; duration?: number }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      setDisplayValue(Math.floor(progress * value));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [value, duration]);

  return <span>{displayValue}</span>;
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

// Quick stat card with animations
function QuickStatCard({
  icon: Icon,
  iconColor,
  gradient,
  title,
  value,
  subtitle,
  trend,
  children,
}: {
  icon: typeof Users;
  iconColor: string;
  gradient: string;
  title: string;
  value: number | string;
  subtitle: string;
  trend?: { value: number; isPositive: boolean };
  children?: React.ReactNode;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      variants={cardVariants}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
    >
      <Card className={`${gradient} border-opacity-50 hover:shadow-xl transition-all duration-300 overflow-hidden relative`}>
        <motion.div
          className="absolute inset-0 bg-white/5"
          initial={{ x: "-100%" }}
          animate={{ x: isHovered ? "100%" : "-100%" }}
          transition={{ duration: 0.6 }}
        />
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <motion.div
              animate={{ rotate: isHovered ? 360 : 0 }}
              transition={{ duration: 0.5 }}
            >
              <Icon className={`h-4 w-4 ${iconColor}`} />
            </motion.div>
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold">
                {typeof value === "number" ? <AnimatedCounter value={value} /> : value}
              </p>
              <div className="flex items-center gap-2">
                <p className="text-sm text-muted-foreground">{subtitle}</p>
                {trend && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className={`text-xs font-medium ${trend.isPositive ? "text-green-600" : "text-red-600"}`}
                  >
                    {trend.isPositive ? "+" : ""}{trend.value}%
                  </motion.span>
                )}
              </div>
            </div>
            {children}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Member row with animations
function MemberRow({
  member,
  onToggle,
  index,
}: {
  member: typeof mockAttendance[0];
  onToggle: () => void;
  index: number;
}) {
  const [isToggling, setIsToggling] = useState(false);

  const handleToggle = async () => {
    setIsToggling(true);
    await new Promise(resolve => setTimeout(resolve, 200));
    onToggle();
    setIsToggling(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ scale: 1.01, x: 4 }}
      whileTap={{ scale: 0.99 }}
      className={`flex items-center justify-between p-3 sm:p-4 rounded-lg border cursor-pointer transition-all duration-300 min-h-[60px] touch-manipulation ${
        member.status === "attended"
          ? "bg-green-50/70 dark:bg-green-950/30 border-green-200 dark:border-green-800/50 hover:border-green-400"
          : "bg-red-50/70 dark:bg-red-950/30 border-red-200 dark:border-red-800/50 hover:border-red-400"
      } ${isToggling ? "scale-95 opacity-70" : ""}`}
      onClick={handleToggle}
    >
      <div className="flex items-center gap-4">
        <motion.div
          animate={isToggling ? { rotate: 360 } : {}}
          transition={{ duration: 0.3 }}
          className={`w-10 h-10 rounded-full flex items-center justify-center ${
            member.status === "attended"
              ? "bg-green-100 dark:bg-green-900"
              : "bg-red-100 dark:bg-red-900"
          }`}
        >
          {member.status === "attended" ? (
            <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
          ) : (
            <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
          )}
        </motion.div>
        <div>
          <p className="font-medium">{member.name}</p>
          <Badge className={`${BELT_COLORS[member.beltRank]} text-xs capitalize`}>
            {member.beltRank} belt
          </Badge>
        </div>
      </div>
      <div className="text-right flex flex-col items-end gap-1">
        <motion.div
          key={member.status}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Badge variant={member.status === "attended" ? "default" : "destructive"}>
            {member.status === "attended" ? "Present" : "Absent"}
          </Badge>
        </motion.div>
        {member.checkInTime && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xs text-muted-foreground flex items-center gap-1"
          >
            <Clock className="h-3 w-3" />
            {new Date(member.checkInTime).toLocaleTimeString("en-GB", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </motion.p>
        )}
      </div>
    </motion.div>
  );
}

// Class selection card
function ClassSelectionCard({
  cls,
  isSelected,
  onSelect,
  index,
}: {
  cls: typeof mockClasses[0];
  isSelected: boolean;
  onSelect: () => void;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
        isSelected
          ? "border-primary bg-primary/10 shadow-md ring-2 ring-primary/20"
          : "border-muted hover:border-primary/50 hover:bg-muted/50"
      }`}
      onClick={onSelect}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {isSelected && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <CheckCircle2 className="h-5 w-5 text-primary" />
            </motion.div>
          )}
          <p className="font-semibold">{cls.name}</p>
        </div>
        <Badge className={LEVEL_COLORS[cls.level]} variant="secondary">
          {cls.level}
        </Badge>
      </div>
      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        <span className="flex items-center gap-1">
          <Calendar className="h-4 w-4" />
          {cls.dayOfWeek}
        </span>
        <span className="flex items-center gap-1">
          <Clock className="h-4 w-4" />
          {cls.startTime} - {cls.endTime}
        </span>
      </div>
      <p className="text-xs text-muted-foreground mt-2">{cls.location}</p>
    </motion.div>
  );
}

// Real-time attendance pulse indicator
function LiveIndicator() {
  return (
    <div className="flex items-center gap-2">
      <span className="relative flex h-3 w-3">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500" />
      </span>
      <span className="text-sm font-medium text-green-600 dark:text-green-400">Live</span>
    </div>
  );
}

// Dojo background pattern component for coach
function DojoBackgroundPattern() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Tatami mat pattern */}
      <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.04]">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="tatami-coach" x="0" y="0" width="60" height="30" patternUnits="userSpaceOnUse">
              <rect width="60" height="30" fill="none" stroke="currentColor" strokeWidth="1"/>
              <line x1="30" y1="0" x2="30" y2="30" stroke="currentColor" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#tatami-coach)" className="text-primary"/>
        </svg>
      </div>
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background" />
    </div>
  );
}

export default function CoachDashboard() {
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [showQR, setShowQR] = useState(false);
  const [attendance, setAttendance] = useState(mockAttendance);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "attended" | "absent">("all");
  const [showFilters, setShowFilters] = useState(false);

  const todayClass = mockClasses[0];
  const currentClass = mockClasses.find(c => c._id === selectedClass);

  const toggleAttendance = (memberId: string) => {
    setAttendance(prev => prev.map(a => {
      if (a.memberId === memberId) {
        const newStatus = a.status === "attended" ? "absent" : "attended";
        toast.success(
          newStatus === "attended"
            ? `${a.name} marked as present`
            : `${a.name} marked as absent`,
          { duration: 2000 }
        );
        return {
          ...a,
          status: newStatus,
          checkInTime: newStatus === "attended" ? Date.now() : null,
        };
      }
      return a;
    }));
  };

  const markAllPresent = () => {
    setAttendance(prev => prev.map(a => ({
      ...a,
      status: "attended",
      checkInTime: a.checkInTime || Date.now(),
    })));
    toast.success("All members marked as present");
  };

  const markAllAbsent = () => {
    setAttendance(prev => prev.map(a => ({
      ...a,
      status: "absent",
      checkInTime: null,
    })));
    toast.success("All members marked as absent");
  };

  const filteredAttendance = useMemo(() => {
    return attendance.filter(member => {
      const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.beltRank.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = filterStatus === "all" || member.status === filterStatus;
      return matchesSearch && matchesFilter;
    });
  }, [attendance, searchQuery, filterStatus]);

  const attendedCount = attendance.filter(a => a.status === "attended").length;
  const attendanceRate = Math.round((attendedCount / attendance.length) * 100);

  return (
    <PageTransition>
      <div className="min-h-screen bg-background relative">
        {/* Dojo background pattern */}
        <DojoBackgroundPattern />

        <Navigation />
        <main className="container mx-auto p-4 space-y-6 relative z-10">
          {/* Header with Background Image */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded-2xl"
          >
            {/* Background Image */}
            <div className="absolute inset-0">
              <img
                src="https://images.unsplash.com/photo-1564415315949-7a0c4c73aab4?w=1200&q=70"
                alt="Martial arts training"
                loading="lazy"
                className="w-full h-full object-cover"
              />
              {/* Enhanced overlay for better text contrast */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30 dark:from-black/80 dark:via-black/60 dark:to-black/40" />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
            </div>

            <div className="relative p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}>
                  Sensei Dashboard
                </h1>
                <p className="text-sm sm:text-base text-white/90 mt-1 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]" style={{ textShadow: '0 1px 4px rgba(0,0,0,0.7)' }}>Manage attendance and track your keiko sessions</p>
              </div>
              <div className="flex items-center gap-3">
                <LiveIndicator />
                <Badge variant="outline" className="text-sm sm:text-lg px-3 sm:px-4 py-1.5 sm:py-2 bg-background/80 backdrop-blur-sm">
                  {new Date().toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" })}
                </Badge>
              </div>
            </div>
          </motion.div>

          {/* Quick Stats - stack on mobile, 2 cols on sm, 4 cols on lg */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
          >
            <QuickStatCard
              icon={Calendar}
              iconColor="text-blue-500"
              gradient="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-200 dark:border-blue-800"
              title="Today's Keiko"
              value={1}
              subtitle="Monday Evening"
            />

            <QuickStatCard
              icon={UserCheck}
              iconColor="text-green-500"
              gradient="bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-200 dark:border-green-800"
              title="Checked In"
              value={`${attendedCount}/${attendance.length}`}
              subtitle="judoka present"
            >
              <motion.div
                className="text-3xl"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                <Sparkles className="h-8 w-8 text-green-500 opacity-70" />
              </motion.div>
            </QuickStatCard>

            <QuickStatCard
              icon={TrendingUp}
              iconColor="text-purple-500"
              gradient="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-200 dark:border-purple-800"
              title="Attendance Rate"
              value={`${attendanceRate}%`}
              subtitle="of registered"
              trend={{ value: 5, isPositive: true }}
            />

            <QuickStatCard
              icon={Users}
              iconColor="text-orange-500"
              gradient="bg-gradient-to-br from-orange-500/10 to-orange-600/5 border-orange-200 dark:border-orange-800"
              title="Class Capacity"
              value={`${attendedCount}/${todayClass.maxCapacity}`}
              subtitle="spots filled"
            >
              <div className="w-16">
                <ProgressBar value={attendedCount} max={todayClass.maxCapacity} />
              </div>
            </QuickStatCard>
          </motion.div>

          {/* Class Selection & QR Code - stack on mobile */}
          <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    Select Keiko Session
                  </CardTitle>
                  <CardDescription>Choose a keiko session to manage attendance</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {mockClasses.map((cls, index) => (
                    <ClassSelectionCard
                      key={cls._id}
                      cls={cls}
                      isSelected={selectedClass === cls._id}
                      onSelect={() => setSelectedClass(cls._id)}
                      index={index}
                    />
                  ))}
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <AnimatePresence mode="wait">
                {selectedClass && currentClass ? (
                  <motion.div
                    key="qr-section"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="space-y-4"
                  >
                    <QRCodeGenerator
                      classId={selectedClass}
                      className={currentClass.name}
                    />
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        onClick={() => setShowQR(!showQR)}
                        className="w-full bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-600/90 hover:to-blue-600/90"
                        size="lg"
                      >
                        <QrCode className="h-5 w-5 mr-2" />
                        {showQR ? "Hide QR Code" : "Display QR for Class"}
                      </Button>
                    </motion.div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="empty-state"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <Card className="h-full flex items-center justify-center min-h-[300px] border-dashed">
                      <div className="text-center p-8">
                        <motion.div
                          animate={{ y: [0, -10, 0] }}
                          transition={{ repeat: Infinity, duration: 2 }}
                          className="text-6xl mb-4"
                        >
                          <QrCode className="h-16 w-16 mx-auto text-muted-foreground/50" />
                        </motion.div>
                        <p className="text-muted-foreground font-medium">Select a keiko session to display QR code</p>
                        <p className="text-sm text-muted-foreground mt-2">Judoka can scan to check in</p>
                      </div>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Attendance List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                      <Users className="h-5 w-5 text-primary" />
                      Your Judoka
                      <Badge variant="secondary" className="ml-2">
                        {attendedCount} present
                      </Badge>
                    </CardTitle>
                    <CardDescription className="text-sm">
                      Tap a judoka to toggle their attendance status
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={markAllPresent}
                        className="text-green-600 hover:text-green-700 hover:bg-green-50 min-h-[44px] px-3 touch-manipulation"
                      >
                        <UserCheck className="h-4 w-4 sm:mr-1" />
                        <span className="hidden sm:inline">Mark All Present</span>
                      </Button>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={markAllAbsent}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 min-h-[44px] px-3 touch-manipulation"
                      >
                        <UserX className="h-4 w-4 sm:mr-1" />
                        <span className="hidden sm:inline">Mark All Absent</span>
                      </Button>
                    </motion.div>
                  </div>
                </div>

                {/* Search and Filter */}
                <div className="flex items-center gap-3 mt-4">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search judoka..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowFilters(!showFilters)}
                    className={showFilters ? "bg-muted" : ""}
                  >
                    <Filter className="h-4 w-4 mr-1" />
                    Filter
                    <ChevronDown className={`h-4 w-4 ml-1 transition-transform ${showFilters ? "rotate-180" : ""}`} />
                  </Button>
                </div>

                {/* Filter Options */}
                <AnimatePresence>
                  {showFilters && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="flex gap-2 mt-3 overflow-hidden"
                    >
                      {(["all", "attended", "absent"] as const).map((status) => (
                        <Button
                          key={status}
                          variant={filterStatus === status ? "default" : "outline"}
                          size="sm"
                          onClick={() => setFilterStatus(status)}
                          className="capitalize"
                        >
                          {status === "all" ? "All" : status === "attended" ? "Present" : "Absent"}
                          {status !== "all" && (
                            <Badge variant="secondary" className="ml-2 text-xs">
                              {attendance.filter(a => a.status === status).length}
                            </Badge>
                          )}
                        </Button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-[500px] overflow-y-auto overscroll-contain">
                  <AnimatePresence mode="popLayout">
                    {filteredAttendance.length > 0 ? (
                      filteredAttendance.map((member, index) => (
                        <MemberRow
                          key={member.memberId}
                          member={member}
                          onToggle={() => toggleAttendance(member.memberId)}
                          index={index}
                        />
                      ))
                    ) : (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-12"
                      >
                        <Users className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                        <p className="text-muted-foreground">No judoka match your search</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Actions - stack on very small screens */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4"
          >
            <motion.div className="flex-1" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button variant="outline" className="w-full min-h-[48px] touch-manipulation">
                <Download className="h-4 w-4 mr-2" />
                Export Attendance
              </Button>
            </motion.div>
            <motion.div className="flex-1" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button className="w-full min-h-[48px] bg-gradient-to-r from-violet-600 to-blue-600 touch-manipulation">
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Save & Close Class
              </Button>
            </motion.div>
          </motion.div>
        </main>

        {/* Mobile Bottom Navigation */}
        <MobileNavigation />
      </div>
    </PageTransition>
  );
}
