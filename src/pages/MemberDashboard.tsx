import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/Navigation";
import MobileNavigation from "@/components/MobileNavigation";
import CheckInQR from "@/components/CheckInQR";
import PageTransition from "@/components/PageTransition";
import { Calendar, Clock, Trophy, CheckCircle2, XCircle, Dumbbell, Flame, Star, Zap, Target } from "lucide-react";

// Mock data - will be replaced with Convex queries
const mockMember = {
  name: "Alice Chen",
  email: "a.chen@bbk.ac.uk",
  beltRank: "blue",
  totalSessions: 47,
  subscriptionStatus: "active",
  subscriptionTier: "standard",
  joinDate: Date.now() - 365 * 24 * 60 * 60 * 1000,
  currentStreak: 4,
  longestStreak: 8,
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

const BELT_COLORS: Record<string, string> = {
  white: "bg-gray-100 text-gray-800 border-gray-300",
  yellow: "bg-yellow-100 text-yellow-800 border-yellow-300",
  orange: "bg-orange-100 text-orange-800 border-orange-300",
  green: "bg-green-100 text-green-800 border-green-300",
  blue: "bg-blue-600 text-white border-blue-700",
  brown: "bg-amber-800 text-white border-amber-900",
  black: "bg-gray-900 text-white border-gray-950",
};

// Motivational messages based on streak and attendance
const getMotivationalMessage = (streak: number, totalSessions: number): { message: string; emoji: string } => {
  if (streak >= 8) return { message: "Unstoppable! You're on fire!", emoji: "fire" };
  if (streak >= 5) return { message: "Amazing consistency! Keep pushing!", emoji: "star" };
  if (streak >= 3) return { message: "Great streak! You're building momentum!", emoji: "zap" };
  if (streak >= 1) return { message: "Good start! Let's keep it going!", emoji: "target" };
  if (totalSessions >= 50) return { message: "Seasoned practitioner! Proud of you!", emoji: "trophy" };
  if (totalSessions >= 20) return { message: "You're making great progress!", emoji: "star" };
  return { message: "Every session counts! Let's train!", emoji: "target" };
};

// Animation variants for staggered card animations
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

// Confetti particle component
function ConfettiParticle({ delay, color }: { delay: number; color: string }) {
  const randomX = Math.random() * 100;
  const randomRotation = Math.random() * 360;
  const randomDuration = 2 + Math.random() * 2;

  return (
    <motion.div
      className="absolute w-3 h-3 rounded-sm"
      style={{
        left: `${randomX}%`,
        top: -20,
        backgroundColor: color,
      }}
      initial={{ y: -20, rotate: 0, opacity: 1 }}
      animate={{
        y: "100vh",
        rotate: randomRotation + 720,
        opacity: [1, 1, 0],
      }}
      transition={{
        duration: randomDuration,
        delay,
        ease: "easeIn",
      }}
    />
  );
}

// Confetti celebration component
function Confetti({ show }: { show: boolean }) {
  const colors = ["#FFD700", "#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7", "#DDA0DD", "#98D8C8"];
  const particles = useMemo(() =>
    Array.from({ length: 50 }, (_, i) => ({
      id: i,
      delay: Math.random() * 0.5,
      color: colors[Math.floor(Math.random() * colors.length)],
    })), []);

  if (!show) return null;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {particles.map((particle) => (
        <ConfettiParticle key={particle.id} delay={particle.delay} color={particle.color} />
      ))}
    </div>
  );
}

// Animated counter component
function AnimatedCounter({ value, duration = 1 }: { value: number; duration?: number }) {
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

// Progress Ring Component with enhanced animation
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
          transition={{ duration: 1.2, ease: "easeOut" }}
          style={{
            strokeDasharray: circumference,
          }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.span
          className="text-lg font-bold"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.8, type: "spring", stiffness: 200 }}
        >
          {Math.round(progress)}%
        </motion.span>
      </div>
    </div>
  );
}

// Streak flames component
function StreakFlames({ streak }: { streak: number }) {
  const flames = Math.min(streak, 5);
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: flames }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ scale: 0, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: i * 0.1, type: "spring", stiffness: 300 }}
        >
          <Flame className={`h-5 w-5 ${i < streak ? "text-orange-500" : "text-gray-300"}`} />
        </motion.div>
      ))}
    </div>
  );
}

// Interactive stat card with micro-interactions
function StatCard({
  icon: Icon,
  iconColor,
  gradient,
  title,
  value,
  subtitle,
  children,
}: {
  icon: typeof Calendar;
  iconColor: string;
  gradient: string;
  title: string;
  value: string | number;
  subtitle: string;
  children?: React.ReactNode;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      variants={itemVariants}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
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
              <p className={`text-2xl font-bold ${iconColor.replace('text-', 'text-').replace('-500', '-700')} dark:${iconColor.replace('text-', 'text-').replace('-500', '-400')}`}>
                {typeof value === 'number' ? <AnimatedCounter value={value} /> : value}
              </p>
              <p className="text-sm text-muted-foreground">{subtitle}</p>
            </div>
            {children}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// QR Scan success celebration
function CheckInSuccess({ className }: { className: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: [0, 1.2, 1] }}
        transition={{ duration: 0.5 }}
        className="bg-green-500 text-white rounded-full p-8"
      >
        <CheckCircle2 className="h-24 w-24" />
      </motion.div>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="absolute bottom-1/3 text-white text-2xl font-bold"
      >
        Checked in to {className}!
      </motion.p>
    </motion.div>
  );
}

export default function MemberDashboard() {
  const [showScanner, setShowScanner] = useState(false);
  const [checkInStatus, setCheckInStatus] = useState<"idle" | "success" | "error">("idle");
  const [isCheckingIn, setIsCheckingIn] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isFirstVisit, setIsFirstVisit] = useState(false);
  const [checkedInClass, setCheckedInClass] = useState("");
  const [showFullSuccess, setShowFullSuccess] = useState(false);

  // Check for first visit to trigger confetti
  useEffect(() => {
    const hasVisited = localStorage.getItem("judo-member-visited");
    if (!hasVisited) {
      setIsFirstVisit(true);
      setShowConfetti(true);
      localStorage.setItem("judo-member-visited", "true");
      setTimeout(() => setShowConfetti(false), 4000);
    }
  }, []);

  const handleCheckIn = async (classId: string) => {
    setIsCheckingIn(true);
    toast.loading("Checking you in...");
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log("Checking in to class:", classId);
    toast.dismiss();

    // Find the class name
    const cls = mockUpcomingClasses.find(c => c._id === classId);
    setCheckedInClass(cls?.name || "class");

    // Show full-screen success animation
    setShowFullSuccess(true);
    setShowConfetti(true);

    toast.success("Successfully checked in!", {
      description: "Enjoy your training session!",
    });

    setCheckInStatus("success");
    setIsCheckingIn(false);
    setShowScanner(false);

    // Reset after animations
    setTimeout(() => {
      setShowFullSuccess(false);
      setShowConfetti(false);
    }, 3000);
    setTimeout(() => setCheckInStatus("idle"), 5000);
  };

  const sessionsThisMonth = 8;
  const maxSessions = mockMember.subscriptionTier === "student" ? 8 : 12;
  const sessionProgress = (sessionsThisMonth / maxSessions) * 100;

  const motivational = getMotivationalMessage(mockMember.currentStreak, mockMember.totalSessions);

  const MotivationalIcon = ({ type }: { type: string }) => {
    switch (type) {
      case "fire": return <Flame className="h-5 w-5 text-orange-500" />;
      case "star": return <Star className="h-5 w-5 text-yellow-500" />;
      case "zap": return <Zap className="h-5 w-5 text-blue-500" />;
      case "trophy": return <Trophy className="h-5 w-5 text-amber-500" />;
      default: return <Target className="h-5 w-5 text-green-500" />;
    }
  };

  return (
    <PageTransition>
      <Confetti show={showConfetti} />
      <AnimatePresence>
        {showFullSuccess && <CheckInSuccess className={checkedInClass} />}
      </AnimatePresence>

      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto p-4 space-y-6">
          {/* Welcome Header with Confetti for First Visit */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div>
              <motion.h1
                className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-violet-600 to-blue-600 bg-clip-text text-transparent"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                Welcome back, Judoka {mockMember.name.split(" ")[0]}!
              </motion.h1>
              <motion.div
                className="flex items-center gap-2 mt-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <MotivationalIcon type={motivational.emoji} />
                <p className="text-muted-foreground text-lg">{motivational.message}</p>
              </motion.div>
            </div>
            <motion.div
              whileHover={{ scale: 1.05, rotate: [0, -5, 5, 0] }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Badge className={`${BELT_COLORS[mockMember.beltRank]} text-lg px-4 py-2 shadow-md`}>
                {mockMember.beltRank.charAt(0).toUpperCase() + mockMember.beltRank.slice(1)} Belt
              </Badge>
            </motion.div>
          </motion.div>

          {/* First Visit Welcome Message */}
          <AnimatePresence>
            {isFirstVisit && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="bg-gradient-to-r from-primary/20 via-blue-500/20 to-purple-500/20 border-primary/30">
                  <CardContent className="py-4">
                    <div className="flex items-center gap-3">
                      <motion.div
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ repeat: 3, duration: 0.5 }}
                        className="text-3xl"
                      >
                        🎉
                      </motion.div>
                      <div>
                        <p className="font-semibold">Welcome to your new dashboard!</p>
                        <p className="text-sm text-muted-foreground">
                          We've made some improvements to help you track your judo journey.
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsFirstVisit(false)}
                        className="ml-auto"
                      >
                        Dismiss
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Check-in Success Message */}
          <AnimatePresence>
            {checkInStatus === "success" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -10 }}
              >
                <Card className="bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800 overflow-hidden">
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-emerald-400/20"
                    animate={{ x: ["-100%", "100%"] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                  />
                  <CardContent className="py-4 relative">
                    <p className="text-green-800 dark:text-green-200 font-medium text-center text-lg flex items-center justify-center gap-2">
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ repeat: Infinity, duration: 1 }}
                      >
                        <CheckCircle2 className="h-5 w-5" />
                      </motion.div>
                      Successfully checked in! Enjoy your training!
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Quick Stats with Staggered Animation - stack vertically on mobile, 2 cols on sm, 4 on md+ */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
          >
            {/* Streak Card - NEW */}
            <StatCard
              icon={Flame}
              iconColor="text-orange-500"
              gradient="bg-gradient-to-br from-orange-500/10 to-red-600/5 border-orange-200 dark:border-orange-800"
              title="Current Streak"
              value={mockMember.currentStreak}
              subtitle={`Best: ${mockMember.longestStreak} weeks`}
            >
              <StreakFlames streak={mockMember.currentStreak} />
            </StatCard>

            {/* Next Keiko Card */}
            <StatCard
              icon={Calendar}
              iconColor="text-blue-500"
              gradient="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-200 dark:border-blue-800"
              title="Next Keiko"
              value="Monday 7pm"
              subtitle="Fundamentals"
            />

            {/* Keiko This Month Card */}
            <StatCard
              icon={Dumbbell}
              iconColor="text-green-500"
              gradient="bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-200 dark:border-green-800"
              title="Keiko This Month"
              value={sessionsThisMonth}
              subtitle={`of ${maxSessions} included`}
            >
              <ProgressRing progress={sessionProgress} size={60} strokeWidth={6} />
            </StatCard>

            {/* Total Keiko Card */}
            <StatCard
              icon={Trophy}
              iconColor="text-purple-500"
              gradient="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-200 dark:border-purple-800"
              title="Total Keiko"
              value={mockMember.totalSessions}
              subtitle="lifetime"
            />
          </motion.div>

          {/* Check-in Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            {showScanner ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <CheckInQR onCheckIn={handleCheckIn} isLoading={isCheckingIn} />
                <Button
                  variant="ghost"
                  onClick={() => setShowScanner(false)}
                  className="w-full mt-2"
                >
                  Cancel
                </Button>
              </motion.div>
            ) : (
              <Card className="bg-gradient-to-r from-primary/10 via-blue-500/10 to-primary/5 border-primary/20 overflow-hidden">
                <CardContent className="py-6 relative">
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                    animate={{ x: ["-200%", "200%"] }}
                    transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                  />
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      onClick={() => setShowScanner(true)}
                      size="lg"
                      className="w-full text-base sm:text-lg py-6 sm:py-8 min-h-[56px] bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden group touch-manipulation"
                    >
                      <motion.span
                        className="absolute inset-0 bg-white/20"
                        initial={{ x: "-100%", skewX: -15 }}
                        whileHover={{ x: "100%" }}
                        transition={{ duration: 0.5 }}
                      />
                      <span className="relative flex items-center justify-center gap-3">
                        <motion.span
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ repeat: Infinity, duration: 2 }}
                          className="text-2xl"
                        >
                          📱
                        </motion.span>
                        Scan QR to Check In
                      </span>
                    </Button>
                  </motion.div>
                </CardContent>
              </Card>
            )}
          </motion.div>

          {/* Upcoming Classes */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  Upcoming Keiko Sessions
                </CardTitle>
                <CardDescription>Your weekly keiko schedule</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-[400px] overflow-y-auto overscroll-contain">
                  {mockUpcomingClasses.map((cls, index) => (
                    <motion.div
                      key={cls._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                      className="flex items-center justify-between p-3 sm:p-4 rounded-lg border bg-card hover:bg-muted/50 hover:border-primary/30 transition-all duration-200 cursor-pointer group min-h-[60px] touch-manipulation"
                      whileHover={{ x: 4, scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      <div className="flex items-center gap-3">
                        <motion.div
                          className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center"
                          whileHover={{ rotate: 360 }}
                          transition={{ duration: 0.5 }}
                        >
                          <Calendar className="h-5 w-5 text-primary" />
                        </motion.div>
                        <div>
                          <p className="font-medium group-hover:text-primary transition-colors">{cls.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {cls.day} at {cls.time}
                          </p>
                        </div>
                      </div>
                      <Badge variant="secondary" className="capitalize">{cls.level}</Badge>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Attendance */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  Recent Attendance
                </CardTitle>
                <CardDescription>Your last 5 sessions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-[400px] overflow-y-auto overscroll-contain">
                  {mockRecentAttendance.map((record, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.8 + i * 0.1 }}
                      whileHover={{ scale: 1.01, x: 4 }}
                      className={`flex items-center justify-between p-3 sm:p-4 rounded-lg border transition-all duration-200 min-h-[60px] touch-manipulation ${
                        record.status === "attended"
                          ? "bg-green-50/50 dark:bg-green-950/20 border-green-200 dark:border-green-800/50"
                          : "bg-red-50/50 dark:bg-red-950/20 border-red-200 dark:border-red-800/50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <motion.div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            record.status === "attended"
                              ? "bg-green-100 dark:bg-green-900"
                              : "bg-red-100 dark:bg-red-900"
                          }`}
                          whileHover={{ scale: 1.1 }}
                        >
                          {record.status === "attended" ? (
                            <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                          ) : (
                            <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                          )}
                        </motion.div>
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
                      <Badge variant={record.status === "attended" ? "default" : "destructive"}>
                        {record.status === "attended" ? "Attended" : "Missed"}
                      </Badge>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Subscription Status */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            <Card className="hover:shadow-lg transition-shadow duration-300 overflow-hidden">
              <CardHeader>
                <CardTitle>Subscription</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <motion.div whileHover={{ scale: 1.05 }}>
                      <Badge className="mb-2 bg-gradient-to-r from-primary to-blue-600">
                        {mockMember.subscriptionTier.toUpperCase()}
                      </Badge>
                    </motion.div>
                    <p className="text-sm text-muted-foreground">
                      Status: <span className="text-green-600 font-medium">Active</span>
                    </p>
                  </div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button variant="outline" className="hover:bg-primary/10">Manage</Button>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </main>

        {/* Mobile Bottom Navigation */}
        <MobileNavigation />
      </div>
    </PageTransition>
  );
}
