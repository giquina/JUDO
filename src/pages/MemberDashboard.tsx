import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navigation from "@/components/Navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import CheckInQR from "@/components/CheckInQR";
import PageTransition from "@/components/PageTransition";
import BeltBadge from "@/components/BeltBadge";
import {
  Calendar,
  Clock,
  Trophy,
  CheckCircle2,
  XCircle,
  Dumbbell,
  Flame,
  Users,
  Target,
  CreditCard,
  User,
  QrCode,
  BookOpen,
  Award,
  Zap,
} from "lucide-react";

// Import custom components
import {
  InsightBanner,
  MetricsCard,
  ActivityFeed,
  TrainingPartnersList,
  GoalsTracker,
  UpcomingEvents,
  BeltProgressCard,
} from "@/components/member";

import {
  SubscriptionManagementModal,
  ProfileQuickEditModal,
  ClassBookingModal,
  AchievementsGalleryModal,
} from "@/components/member/modals";

import { ModalProvider, useModal } from "@/components/member/ModalManager";
import type { BeltRank } from "@/types";

// Mock data - will be replaced with Convex queries
const mockMember = {
  name: "Alice Chen",
  email: "a.chen@bbk.ac.uk",
  avatar: undefined,
  beltRank: "blue" as BeltRank,
  totalSessions: 47,
  subscriptionStatus: "active",
  subscriptionTier: "standard",
  joinDate: Date.now() - 365 * 24 * 60 * 60 * 1000,
  streak: 12,
  level: 8,
  xp: 2340,
  xpToNext: 3000,
  rank: 12,
};

const mockUpcomingClasses = [
  { _id: "1", name: "Monday Evening Fundamentals", day: "Monday", time: "19:00", level: "beginner" },
  { _id: "2", name: "Wednesday Intermediate", day: "Wednesday", time: "19:00", level: "intermediate" },
  { _id: "3", name: "Friday Advanced", day: "Friday", time: "20:00", level: "advanced" },
];

const mockRecentAttendance = [
  { date: "2026-01-17", className: "Friday Advanced", status: "attended" },
  { date: "2026-01-15", className: "Wednesday Intermediate", status: "attended" },
  { date: "2026-01-13", className: "Monday Fundamentals", status: "attended" },
  { date: "2026-01-10", className: "Friday Advanced", status: "absent" },
  { date: "2026-01-08", className: "Wednesday Intermediate", status: "attended" },
];

const mockActivities = [
  {
    id: "1",
    type: "check-in" as const,
    title: "You checked in to Friday Advanced",
    description: "Great session today! Keep up the momentum.",
    timestamp: Date.now() - 2 * 60 * 60 * 1000,
  },
  {
    id: "2",
    type: "achievement" as const,
    title: "Achievement Unlocked!",
    description: 'You earned the "Fire Streak" achievement for 10 consecutive days',
    timestamp: Date.now() - 24 * 60 * 60 * 1000,
    metadata: { badge: "🔥 Fire Streak" },
  },
  {
    id: "3",
    type: "friend" as const,
    title: "Training Partner Check-in",
    description: "John Smith checked in to the same class",
    timestamp: Date.now() - 2 * 24 * 60 * 60 * 1000,
    user: { name: "John Smith", avatar: undefined },
  },
  {
    id: "4",
    type: "announcement" as const,
    title: "New Workshop Announced",
    description: "Competition preparation workshop next month",
    timestamp: Date.now() - 3 * 24 * 60 * 60 * 1000,
  },
];

const mockTrainingPartners = [
  {
    id: "1",
    name: "John Smith",
    avatar: undefined,
    beltRank: "blue" as BeltRank,
    status: "online" as const,
    mutualSessions: 23,
  },
  {
    id: "2",
    name: "Sarah Johnson",
    avatar: undefined,
    beltRank: "green" as BeltRank,
    status: "training" as const,
    mutualSessions: 15,
  },
  {
    id: "3",
    name: "Mike Brown",
    avatar: undefined,
    beltRank: "brown" as BeltRank,
    status: "offline" as const,
    mutualSessions: 8,
  },
];

const mockGoals = [
  {
    id: "1",
    title: "Perfect Attendance",
    description: "Attend every class this month",
    progress: 8,
    target: 12,
    unit: "classes",
    deadline: Date.now() + 10 * 24 * 60 * 60 * 1000,
    priority: "high" as const,
    category: "attendance" as const,
  },
  {
    id: "2",
    title: "Master Uchi Mata",
    description: "Perfect the inner thigh throw technique",
    progress: 65,
    target: 100,
    unit: "reps",
    priority: "medium" as const,
    category: "technique" as const,
  },
  {
    id: "3",
    title: "Competition Ready",
    description: "Enter and compete in first tournament",
    progress: 0,
    target: 1,
    unit: "competition",
    deadline: Date.now() + 60 * 24 * 60 * 60 * 1000,
    priority: "high" as const,
    category: "competition" as const,
  },
];

const mockEvents = [
  {
    id: "1",
    title: "Inter-Club Tournament",
    description: "Friendly competition with partner dojos",
    date: Date.now() + 14 * 24 * 60 * 60 * 1000,
    time: "10:00 - 16:00",
    location: "Main Dojo",
    type: "competition" as const,
    attendees: 24,
    maxAttendees: 32,
    isRegistered: true,
  },
  {
    id: "2",
    title: "Guest Sensei Seminar",
    description: "Learn from 5th dan black belt sensei",
    date: Date.now() + 21 * 24 * 60 * 60 * 1000,
    time: "14:00 - 17:00",
    location: "University Sports Hall",
    type: "seminar" as const,
    attendees: 18,
    maxAttendees: 25,
    isRegistered: false,
  },
  {
    id: "3",
    title: "Club Social Evening",
    description: "Pizza and games night for all members",
    date: Date.now() + 7 * 24 * 60 * 60 * 1000,
    time: "19:00 - 22:00",
    location: "Student Union Bar",
    type: "social" as const,
    attendees: 31,
    isRegistered: true,
  },
];

const mockBeltRequirements = [
  {
    id: "1",
    title: "Uchi-mata (Inner thigh throw)",
    description: "Demonstrate proper technique on both sides",
    completed: true,
  },
  {
    id: "2",
    title: "O-uchi-gari (Major inner reap)",
    description: "Execute with correct timing and balance",
    completed: true,
  },
  {
    id: "3",
    title: "Groundwork transitions",
    description: "Show 3 different transition sequences",
    completed: true,
  },
  {
    id: "4",
    title: "Kata demonstration",
    description: "Perform Nage-no-kata (first set)",
    completed: false,
  },
  {
    id: "5",
    title: "Competition experience",
    description: "Participate in at least one tournament",
    completed: false,
  },
  {
    id: "6",
    title: "Training hours",
    description: "Complete 200 hours of training (180/200)",
    completed: false,
  },
];

// Progress Ring Component
function ProgressRing({ progress, size = 80, strokeWidth = 8 }: { progress: number; size?: number; strokeWidth?: number }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle
          className="text-muted stroke-current"
          strokeWidth={strokeWidth}
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <motion.circle
          className="text-green-500 stroke-current"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: "easeOut" }}
          style={{
            strokeDasharray: circumference,
          }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-lg font-bold">{Math.round(progress)}%</span>
      </div>
    </div>
  );
}

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 12,
    },
  },
};

function DashboardContent() {
  const [showScanner, setShowScanner] = useState(false);
  const [checkInStatus, setCheckInStatus] = useState<"idle" | "success" | "error">("idle");
  const [isCheckingIn, setIsCheckingIn] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  const { openModal, closeModal, activeModal } = useModal();

  const handleCheckIn = async (classId: string) => {
    setIsCheckingIn(true);
    toast.loading("Checking you in...");
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log("Checking in to class:", classId);
    toast.dismiss();
    toast.success("Successfully checked in!", {
      description: "Enjoy your training session!",
    });
    setCheckInStatus("success");
    setIsCheckingIn(false);
    setShowScanner(false);

    setTimeout(() => setCheckInStatus("idle"), 3000);
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Only trigger if not typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (e.key.toLowerCase()) {
        case "c":
          if (!showScanner) setShowScanner(true);
          break;
        case "b":
          openModal("booking");
          break;
        case "p":
          openModal("profile");
          break;
        case "s":
          openModal("subscription");
          break;
        case "a":
          openModal("achievements");
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [showScanner, openModal]);

  const sessionsThisMonth = 8;
  const maxSessions = mockMember.subscriptionTier === "student" ? 8 : 12;
  const sessionProgress = (sessionsThisMonth / maxSessions) * 100;
  const xpProgress = (mockMember.xp / mockMember.xpToNext) * 100;
  const beltProgress = (3 / 6) * 100; // 3 of 6 requirements completed

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase();
  };

  const insights = [
    {
      type: "streak" as const,
      title: `${mockMember.streak} Day Streak! 🔥`,
      message: "You're on fire! Keep the momentum going.",
      action: {
        label: "Check In Now",
        onClick: () => setShowScanner(true),
      },
    },
    {
      type: "upcoming" as const,
      title: "Next Class: Monday 7pm",
      message: "Monday Evening Fundamentals starts in 2 days",
      action: {
        label: "Book Now",
        onClick: () => openModal("booking"),
      },
    },
    {
      type: "goal" as const,
      title: "Goal Progress Update",
      message: "You're 67% towards your Perfect Attendance goal!",
      action: {
        label: "View Goals",
        onClick: () => setActiveTab("goals"),
      },
    },
  ];

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto p-4 space-y-6 pb-20">
          <Breadcrumbs />

          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative overflow-hidden"
          >
            <Card className="bg-gradient-to-br from-primary/10 via-blue-500/5 to-purple-500/10 border-2 border-primary/20">
              <CardContent className="py-6">
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                  {/* Profile Section */}
                  <div className="flex items-center gap-4">
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                      <Avatar className="h-20 w-20 border-4 border-primary/30 shadow-lg cursor-pointer" onClick={() => openModal("profile")}>
                        <AvatarImage src={mockMember.avatar} />
                        <AvatarFallback className="text-2xl bg-gradient-to-br from-primary to-blue-600 text-white">
                          {getInitials(mockMember.name)}
                        </AvatarFallback>
                      </Avatar>
                    </motion.div>

                    <div>
                      <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                        Welcome back, {mockMember.name.split(" ")[0]}!
                      </h1>
                      <div className="flex flex-wrap items-center gap-3 mt-2">
                        <BeltBadge rank={mockMember.beltRank} />
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Flame className="h-3 w-3 text-orange-500" />
                          {mockMember.streak} day streak
                        </Badge>
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Trophy className="h-3 w-3 text-yellow-500" />
                          Rank #{mockMember.rank}
                        </Badge>
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Zap className="h-3 w-3 text-purple-500" />
                          Level {mockMember.level}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      onClick={() => setShowScanner(true)}
                      className="bg-gradient-to-r from-primary to-blue-600"
                    >
                      <QrCode className="h-4 w-4 mr-2" />
                      Check In
                      <kbd className="ml-2 hidden sm:inline-flex h-5 px-1.5 items-center gap-1 rounded bg-white/20 font-mono text-xs">
                        C
                      </kbd>
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openModal("booking")}
                    >
                      <BookOpen className="h-4 w-4 mr-2" />
                      Book Class
                      <kbd className="ml-2 hidden sm:inline-flex h-5 px-1.5 items-center gap-1 rounded bg-muted font-mono text-xs">
                        B
                      </kbd>
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openModal("profile")}
                    >
                      <User className="h-4 w-4 mr-2" />
                      Profile
                      <kbd className="ml-2 hidden sm:inline-flex h-5 px-1.5 items-center gap-1 rounded bg-muted font-mono text-xs">
                        P
                      </kbd>
                    </Button>
                  </div>
                </div>

                {/* XP Progress Bar */}
                <div className="mt-6 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">Level {mockMember.level} Progress</span>
                    <span className="text-muted-foreground">
                      {mockMember.xp.toLocaleString()} / {mockMember.xpToNext.toLocaleString()} XP
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-primary to-blue-600"
                      initial={{ width: 0 }}
                      animate={{ width: `${xpProgress}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Smart Insights Banner */}
          <InsightBanner insights={insights} />

          {/* Check-in Success Message */}
          <AnimatePresence>
            {checkInStatus === "success" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                <Card className="bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
                  <CardContent className="py-4">
                    <p className="text-green-800 dark:text-green-200 font-medium text-center text-lg flex items-center justify-center gap-2">
                      <CheckCircle2 className="h-5 w-5" />
                      Successfully checked in! Enjoy your training!
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* QR Scanner */}
          <AnimatePresence>
            {showScanner && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
              >
                <CheckInQR onCheckIn={handleCheckIn} isLoading={isCheckingIn} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Key Metrics Row */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
          >
            <motion.div variants={itemVariants}>
              <MetricsCard
                title="Current Streak"
                value={mockMember.streak}
                subtitle="days"
                icon={Flame}
                iconColor="text-orange-500"
                gradient="from-orange-500/10 to-red-500/5"
                trend={{ value: 20, label: "from last month" }}
                onClick={() => setActiveTab("activity")}
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <MetricsCard
                title="Sessions This Month"
                value={sessionsThisMonth}
                subtitle={`of ${maxSessions}`}
                icon={Dumbbell}
                iconColor="text-green-500"
                gradient="from-green-500/10 to-emerald-500/5"
                extra={<ProgressRing progress={sessionProgress} size={60} strokeWidth={6} />}
                onClick={() => setActiveTab("attendance")}
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <MetricsCard
                title="Belt Progress"
                value={`${Math.round(beltProgress)}%`}
                subtitle="to Brown Belt"
                icon={Award}
                iconColor="text-purple-500"
                gradient="from-purple-500/10 to-pink-500/5"
                trend={{ value: 15, label: "this quarter" }}
                onClick={() => setActiveTab("progression")}
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <MetricsCard
                title="Leaderboard Rank"
                value={`#${mockMember.rank}`}
                subtitle="of 84 members"
                icon={Trophy}
                iconColor="text-yellow-500"
                gradient="from-yellow-500/10 to-orange-500/5"
                trend={{ value: 2, label: "positions up" }}
                onClick={() => setActiveTab("achievements")}
              />
            </motion.div>
          </motion.div>

          {/* Main Content - Tabbed Interface */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="w-full justify-start overflow-x-auto bg-muted/50 p-1">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <Zap className="h-4 w-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="activity" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Activity
              </TabsTrigger>
              <TabsTrigger value="attendance" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Attendance
              </TabsTrigger>
              <TabsTrigger value="progression" className="flex items-center gap-2">
                <Award className="h-4 w-4" />
                Progression
              </TabsTrigger>
              <TabsTrigger value="goals" className="flex items-center gap-2">
                <Target className="h-4 w-4" />
                Goals
              </TabsTrigger>
              <TabsTrigger value="achievements" className="flex items-center gap-2">
                <Trophy className="h-4 w-4" />
                Achievements
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid lg:grid-cols-3 gap-6">
                {/* Left Column - 2/3 width */}
                <div className="lg:col-span-2 space-y-6">
                  <ActivityFeed activities={mockActivities} maxHeight="600px" />

                  {/* Upcoming Classes */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <Card className="hover:shadow-lg transition-shadow duration-300">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="flex items-center gap-2">
                              <Clock className="h-5 w-5 text-primary" />
                              Upcoming Classes
                            </CardTitle>
                            <CardDescription>Your weekly schedule</CardDescription>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openModal("booking")}
                          >
                            View All
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {mockUpcomingClasses.map((cls, index) => (
                            <motion.div
                              key={cls._id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.3 + index * 0.1 }}
                              className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-muted/50 hover:border-primary/30 transition-all duration-200 cursor-pointer"
                              whileHover={{ x: 4 }}
                              onClick={() => openModal("booking")}
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                  <Calendar className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                  <p className="font-medium">{cls.name}</p>
                                  <p className="text-sm text-muted-foreground">
                                    {cls.day} at {cls.time}
                                  </p>
                                </div>
                              </div>
                              <Badge variant="secondary" className="capitalize">
                                {cls.level}
                              </Badge>
                            </motion.div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>

                {/* Right Column - 1/3 width */}
                <div className="space-y-6">
                  <UpcomingEvents
                    events={mockEvents}
                    onRegister={() => toast.success("Registered for event!")}
                    onViewDetails={() => toast.info("Event details coming soon")}
                  />

                  <TrainingPartnersList
                    partners={mockTrainingPartners}
                    onViewProfile={() => toast.info("Profile view coming soon")}
                    onMessage={() => toast.info("Messaging coming soon")}
                  />

                  <GoalsTracker
                    goals={mockGoals}
                    compact={true}
                    onAddGoal={() => toast.info("Add goal feature coming soon")}
                    onViewGoal={() => setActiveTab("goals")}
                  />
                </div>
              </div>
            </TabsContent>

            {/* Activity Tab */}
            <TabsContent value="activity" className="space-y-6">
              <ActivityFeed activities={mockActivities} maxHeight="800px" />
            </TabsContent>

            {/* Attendance Tab */}
            <TabsContent value="attendance" className="space-y-6">
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                    Recent Attendance
                  </CardTitle>
                  <CardDescription>Your last sessions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {mockRecentAttendance.map((record, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className={`flex items-center justify-between p-4 rounded-lg border transition-all duration-200 ${
                          record.status === "attended"
                            ? "bg-green-50/50 dark:bg-green-950/20 border-green-200 dark:border-green-800/50"
                            : "bg-red-50/50 dark:bg-red-950/20 border-red-200 dark:border-red-800/50"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              record.status === "attended"
                                ? "bg-green-100 dark:bg-green-900"
                                : "bg-red-100 dark:bg-red-900"
                            }`}
                          >
                            {record.status === "attended" ? (
                              <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                            ) : (
                              <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium">{record.className}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(record.date).toLocaleDateString("en-GB", {
                                weekday: "short",
                                day: "numeric",
                                month: "short",
                              })}
                            </p>
                          </div>
                        </div>
                        <Badge
                          variant={record.status === "attended" ? "default" : "destructive"}
                        >
                          {record.status === "attended" ? "Attended" : "Missed"}
                        </Badge>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Progression Tab */}
            <TabsContent value="progression" className="space-y-6">
              <BeltProgressCard
                currentBelt={mockMember.beltRank}
                nextBelt="brown"
                progress={beltProgress}
                requirements={mockBeltRequirements}
                estimatedDate={Date.now() + 120 * 24 * 60 * 60 * 1000}
                onViewDetails={() => toast.info("Full details coming soon")}
              />
            </TabsContent>

            {/* Goals Tab */}
            <TabsContent value="goals" className="space-y-6">
              <GoalsTracker
                goals={mockGoals}
                compact={false}
                onAddGoal={() => toast.info("Add goal feature coming soon")}
                onViewGoal={(_id) => toast.info("Goal details coming soon")}
              />
            </TabsContent>

            {/* Achievements Tab */}
            <TabsContent value="achievements" className="space-y-6">
              <Card
                className="hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                onClick={() => openModal("achievements")}
              >
                <CardContent className="py-12 text-center">
                  <Trophy className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold mb-2">View All Achievements</h3>
                  <p className="text-muted-foreground mb-6">
                    See your trophies, badges, and milestones
                  </p>
                  <Button size="lg" className="bg-gradient-to-r from-yellow-500 to-orange-500">
                    <Trophy className="h-5 w-5 mr-2" />
                    Open Gallery
                    <kbd className="ml-2 hidden sm:inline-flex h-5 px-1.5 items-center gap-1 rounded bg-white/20 font-mono text-xs">
                      A
                    </kbd>
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Subscription Status */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-primary" />
                  Subscription
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <Badge className="mb-2 bg-gradient-to-r from-primary to-blue-600">
                      {mockMember.subscriptionTier.toUpperCase()}
                    </Badge>
                    <p className="text-sm text-muted-foreground">
                      Status:{" "}
                      <span className="text-green-600 font-medium">Active</span>
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Next billing: February 21, 2026
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    className="hover:bg-primary/10"
                    onClick={() => openModal("subscription")}
                  >
                    Manage
                    <kbd className="ml-2 hidden sm:inline-flex h-5 px-1.5 items-center gap-1 rounded bg-muted font-mono text-xs">
                      S
                    </kbd>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Keyboard Shortcuts Helper */}
          <Card className="bg-muted/30">
            <CardContent className="py-4">
              <p className="text-sm text-muted-foreground text-center">
                <strong>Keyboard shortcuts:</strong> Press{" "}
                <kbd className="px-2 py-1 text-xs font-semibold bg-background border rounded">
                  C
                </kbd>{" "}
                to check in,{" "}
                <kbd className="px-2 py-1 text-xs font-semibold bg-background border rounded">
                  B
                </kbd>{" "}
                to book,{" "}
                <kbd className="px-2 py-1 text-xs font-semibold bg-background border rounded">
                  P
                </kbd>{" "}
                for profile,{" "}
                <kbd className="px-2 py-1 text-xs font-semibold bg-background border rounded">
                  S
                </kbd>{" "}
                for subscription,{" "}
                <kbd className="px-2 py-1 text-xs font-semibold bg-background border rounded">
                  A
                </kbd>{" "}
                for achievements
              </p>
            </CardContent>
          </Card>
        </main>

        {/* Modals */}
        <SubscriptionManagementModal
          open={activeModal === "subscription"}
          onClose={closeModal}
          currentTier={mockMember.subscriptionTier}
          status={mockMember.subscriptionStatus}
        />

        <ProfileQuickEditModal
          open={activeModal === "profile"}
          onClose={closeModal}
          member={{
            name: mockMember.name,
            email: mockMember.email,
            avatar: mockMember.avatar,
          }}
        />

        <ClassBookingModal
          open={activeModal === "booking"}
          onClose={closeModal}
        />

        <AchievementsGalleryModal
          open={activeModal === "achievements"}
          onClose={closeModal}
        />
      </div>
    </PageTransition>
  );
}

export default function MemberDashboard() {
  return (
    <ModalProvider>
      <DashboardContent />
    </ModalProvider>
  );
}
