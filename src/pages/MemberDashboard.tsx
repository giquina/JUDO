import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/Navigation";
import CheckInQR from "@/components/CheckInQR";
import PageTransition from "@/components/PageTransition";
import { DemoBanner } from "@/components/DemoBanner";
import { Calendar, Clock, Trophy, CheckCircle2, XCircle, Dumbbell } from "lucide-react";

// Mock data - will be replaced with Convex queries
const mockMember = {
  name: "Alice Chen",
  email: "a.chen@bbk.ac.uk",
  beltRank: "blue",
  totalSessions: 47,
  subscriptionStatus: "active",
  subscriptionTier: "standard",
  joinDate: Date.now() - 365 * 24 * 60 * 60 * 1000,
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

export default function MemberDashboard() {
  const [showScanner, setShowScanner] = useState(false);
  const [checkInStatus, setCheckInStatus] = useState<"idle" | "success" | "error">("idle");
  const [isCheckingIn, setIsCheckingIn] = useState(false);

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

    // Reset status after 3 seconds
    setTimeout(() => setCheckInStatus("idle"), 3000);
  };

  const sessionsThisMonth = 8;
  const maxSessions = mockMember.subscriptionTier === "student" ? 8 : 12;
  const sessionProgress = (sessionsThisMonth / maxSessions) * 100;

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <Navigation />
        <DemoBanner />
        <main className="container mx-auto p-4 space-y-6">
          {/* Welcome Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-between"
          >
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                Welcome back, {mockMember.name.split(" ")[0]}!
              </h1>
              <p className="text-muted-foreground text-lg mt-1">Ready for training?</p>
            </div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Badge className={`${BELT_COLORS[mockMember.beltRank]} text-lg px-4 py-2 shadow-md`}>
                {mockMember.beltRank.charAt(0).toUpperCase() + mockMember.beltRank.slice(1)} Belt
              </Badge>
            </motion.div>
          </motion.div>

          {/* Check-in Success Message */}
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

          {/* Quick Stats with Staggered Animation */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid gap-4 md:grid-cols-3"
          >
            {/* Next Class Card */}
            <motion.div variants={itemVariants}>
              <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-200 dark:border-blue-800 hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-blue-500" />
                    Next Class
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-blue-700 dark:text-blue-400">Monday 7pm</p>
                  <p className="text-sm text-muted-foreground">Fundamentals</p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Sessions This Month Card */}
            <motion.div variants={itemVariants}>
              <Card className="bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-200 dark:border-green-800 hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Dumbbell className="h-4 w-4 text-green-500" />
                    Sessions This Month
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-green-700 dark:text-green-400">{sessionsThisMonth}</p>
                      <p className="text-sm text-muted-foreground">of {maxSessions} included</p>
                    </div>
                    <ProgressRing progress={sessionProgress} size={60} strokeWidth={6} />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Total Sessions Card */}
            <motion.div variants={itemVariants}>
              <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-200 dark:border-purple-800 hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Trophy className="h-4 w-4 text-purple-500" />
                    Total Sessions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-purple-700 dark:text-purple-400">{mockMember.totalSessions}</p>
                  <p className="text-sm text-muted-foreground">lifetime</p>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>

          {/* Check-in Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            {showScanner ? (
              <CheckInQR onCheckIn={handleCheckIn} isLoading={isCheckingIn} />
            ) : (
              <Card className="bg-gradient-to-r from-primary/10 via-blue-500/10 to-primary/5 border-primary/20">
                <CardContent className="py-6">
                  <motion.div
                    animate={{ scale: [1, 1.02, 1] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                  >
                    <Button
                      onClick={() => setShowScanner(true)}
                      size="lg"
                      className="w-full text-lg py-8 bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <span className="mr-2 text-2xl">📱</span>
                      Scan QR to Check In
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
                  Upcoming Classes
                </CardTitle>
                <CardDescription>Your weekly schedule</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockUpcomingClasses.map((cls, index) => (
                    <motion.div
                      key={cls._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                      className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-muted/50 hover:border-primary/30 transition-all duration-200 cursor-pointer"
                      whileHover={{ x: 4 }}
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
                <div className="space-y-2">
                  {mockRecentAttendance.map((record, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.8 + i * 0.1 }}
                      className={`flex items-center justify-between p-4 rounded-lg border transition-all duration-200 ${
                        record.status === "attended"
                          ? "bg-green-50/50 dark:bg-green-950/20 border-green-200 dark:border-green-800/50"
                          : "bg-red-50/50 dark:bg-red-950/20 border-red-200 dark:border-red-800/50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          record.status === "attended"
                            ? "bg-green-100 dark:bg-green-900"
                            : "bg-red-100 dark:bg-red-900"
                        }`}>
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
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <CardTitle>Subscription</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <Badge className="mb-2 bg-gradient-to-r from-primary to-blue-600">
                      {mockMember.subscriptionTier.toUpperCase()}
                    </Badge>
                    <p className="text-sm text-muted-foreground">
                      Status: <span className="text-green-600 font-medium">Active</span>
                    </p>
                  </div>
                  <Button variant="outline" className="hover:bg-primary/10">Manage</Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </main>
      </div>
    </PageTransition>
  );
}
