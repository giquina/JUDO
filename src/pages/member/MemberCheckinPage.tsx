import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/Navigation";
import MobileNavigation from "@/components/MobileNavigation";
import MemberSidebar from "@/components/MemberSidebar";
import PageTransition from "@/components/PageTransition";
import DashboardWrapper from "@/components/DashboardWrapper";
import QRCode from "qrcode";
import {
  QrCode,
  Clock,
  Calendar,
  CheckCircle2,
  RefreshCw,
  Smartphone,
  History,
  MapPin,
} from "lucide-react";

// Mock member data
const mockMember = {
  _id: "member-001",
  name: "Alice Chen",
  email: "a.chen@bbk.ac.uk",
  beltRank: "blue",
  memberId: "BBK-2024-0042",
};

// Mock today's classes the member can check into
const mockTodayClasses = [
  {
    _id: "class-1",
    name: "Evening Fundamentals",
    time: "18:00",
    duration: "1.5h",
    coach: "Sensei Tanaka",
    isCheckedIn: false,
    canCheckIn: true, // within check-in window
  },
  {
    _id: "class-2",
    name: "Advanced Randori",
    time: "19:30",
    duration: "1h",
    coach: "Sensei Yamamoto",
    isCheckedIn: false,
    canCheckIn: false, // not yet
  },
];

// Mock recent check-in history
const mockCheckInHistory = [
  {
    _id: "h1",
    className: "Monday Fundamentals",
    date: "2026-01-20",
    time: "18:05",
    status: "success",
  },
  {
    _id: "h2",
    className: "Friday Open Mat",
    date: "2026-01-17",
    time: "18:02",
    status: "success",
  },
  {
    _id: "h3",
    className: "Wednesday Intermediate",
    date: "2026-01-15",
    time: "18:10",
    status: "success",
  },
  {
    _id: "h4",
    className: "Monday Fundamentals",
    date: "2026-01-13",
    time: "18:08",
    status: "success",
  },
  {
    _id: "h5",
    className: "Saturday Warriors",
    date: "2026-01-11",
    time: "10:03",
    status: "late",
  },
];

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

export default function MemberCheckinPage() {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [todayClasses, setTodayClasses] = useState(mockTodayClasses);
  const [qrExpiry, setQrExpiry] = useState(300); // 5 minutes in seconds

  // Generate QR code with member data
  const generateQRCode = async () => {
    const qrData = JSON.stringify({
      memberId: mockMember.memberId,
      name: mockMember.name,
      email: mockMember.email,
      timestamp: Date.now(),
      validUntil: Date.now() + 5 * 60 * 1000, // Valid for 5 minutes
    });

    try {
      const url = await QRCode.toDataURL(qrData, {
        width: 400,
        margin: 2,
        color: {
          dark: "#7c3aed", // Violet color
          light: "#ffffff",
        },
        errorCorrectionLevel: "H",
      });
      setQrCodeUrl(url);
      setQrExpiry(300);
    } catch (err) {
      console.error("Error generating QR code:", err);
      toast.error("Failed to generate QR code");
    }
  };

  // Generate QR code on mount
  useEffect(() => {
    generateQRCode();
  }, []);

  // QR code expiry countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setQrExpiry((prev) => {
        if (prev <= 1) {
          generateQRCode();
          return 300;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleRefreshQR = async () => {
    setIsRefreshing(true);
    await generateQRCode();
    setIsRefreshing(false);
    toast.success("QR code refreshed");
  };

  const handleManualCheckIn = async (classId: string) => {
    const cls = todayClasses.find((c) => c._id === classId);
    if (!cls) return;

    toast.loading("Checking in...");
    await new Promise((resolve) => setTimeout(resolve, 1000));
    toast.dismiss();

    setTodayClasses((prev) =>
      prev.map((c) => (c._id === classId ? { ...c, isCheckedIn: true } : c))
    );

    toast.success("Checked in successfully!", {
      description: `You're checked in for ${cls.name}`,
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-GB", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });
  };

  // Fullscreen QR view
  if (isFullscreen) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-gradient-to-b from-violet-900 to-purple-950 flex flex-col items-center justify-center p-8"
        onClick={() => setIsFullscreen(false)}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold text-white mb-2">{mockMember.name}</h2>
          <p className="text-xl text-violet-200 mb-6">{mockMember.memberId}</p>

          <div className="bg-white p-6 rounded-3xl shadow-2xl mb-6">
            {qrCodeUrl && (
              <img
                src={qrCodeUrl}
                alt="Member QR Code"
                className="w-72 h-72 sm:w-80 sm:h-80"
              />
            )}
          </div>

          <p className="text-violet-200 text-lg mb-2">Scan this at the dojo to check in</p>
          <p className="text-violet-300/70">
            Expires in <span className="font-mono font-bold">{formatTime(qrExpiry)}</span>
          </p>
          <p className="text-violet-400/50 text-sm mt-4">Tap anywhere to close</p>
        </motion.div>
      </motion.div>
    );
  }

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
            <div className="relative flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                <QrCode className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white">QR Check-in</h1>
                <p className="text-white/80">Scan your QR code at the dojo entrance</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid gap-6 md:grid-cols-2"
          >
            {/* QR Code Card */}
            <motion.div variants={itemVariants}>
              <Card className="overflow-hidden">
                <CardHeader className="text-center border-b bg-muted/30">
                  <CardTitle className="text-lg">Your Check-in QR Code</CardTitle>
                  <CardDescription>Show this to the scanner at the dojo</CardDescription>
                </CardHeader>
                <CardContent className="p-6 flex flex-col items-center">
                  {/* QR Code Display */}
                  <motion.div
                    className="relative bg-white p-4 rounded-2xl shadow-lg mb-4 cursor-pointer"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setIsFullscreen(true)}
                  >
                    {qrCodeUrl ? (
                      <img
                        src={qrCodeUrl}
                        alt="Member QR Code"
                        className="w-48 h-48 sm:w-56 sm:h-56"
                      />
                    ) : (
                      <div className="w-48 h-48 sm:w-56 sm:h-56 bg-muted animate-pulse rounded-lg" />
                    )}

                    {/* Expand hint */}
                    <motion.div
                      className="absolute inset-0 flex items-center justify-center bg-black/0 hover:bg-black/10 rounded-2xl transition-colors"
                      whileHover={{ opacity: 1 }}
                      initial={{ opacity: 0 }}
                    >
                      <Badge variant="secondary" className="bg-white/90">
                        <Smartphone className="w-3 h-3 mr-1" />
                        Tap to enlarge
                      </Badge>
                    </motion.div>
                  </motion.div>

                  {/* Member Info */}
                  <div className="text-center mb-4">
                    <p className="font-semibold text-lg">{mockMember.name}</p>
                    <p className="text-sm text-muted-foreground font-mono">{mockMember.memberId}</p>
                  </div>

                  {/* Expiry Timer */}
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                    <Clock className="w-4 h-4" />
                    <span>
                      Expires in <span className="font-mono font-bold">{formatTime(qrExpiry)}</span>
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 w-full">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={handleRefreshQR}
                      disabled={isRefreshing}
                    >
                      <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
                      Refresh
                    </Button>
                    <Button className="flex-1" onClick={() => setIsFullscreen(true)}>
                      <Smartphone className="w-4 h-4 mr-2" />
                      Fullscreen
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Today's Classes */}
            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-primary" />
                    Today's Classes
                  </CardTitle>
                  <CardDescription>Classes you can check into today</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {todayClasses.length > 0 ? (
                    todayClasses.map((cls) => (
                      <motion.div
                        key={cls._id}
                        className={`p-4 rounded-xl border transition-all ${
                          cls.isCheckedIn
                            ? "bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800"
                            : "bg-card hover:shadow-md"
                        }`}
                        whileHover={{ scale: 1.01 }}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold">{cls.name}</h3>
                              {cls.isCheckedIn && (
                                <Badge variant="default" className="bg-green-500">
                                  <CheckCircle2 className="w-3 h-3 mr-1" />
                                  Checked In
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              <Clock className="w-3 h-3 inline mr-1" />
                              {cls.time} ({cls.duration}) - {cls.coach}
                            </p>
                          </div>
                          {!cls.isCheckedIn && (
                            <Button
                              size="sm"
                              variant={cls.canCheckIn ? "default" : "outline"}
                              disabled={!cls.canCheckIn}
                              onClick={() => handleManualCheckIn(cls._id)}
                            >
                              {cls.canCheckIn ? "Check In" : "Not Yet"}
                            </Button>
                          )}
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <Calendar className="w-12 h-12 mx-auto text-muted-foreground/30 mb-3" />
                      <p className="text-muted-foreground">No classes scheduled today</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>

          {/* Check-in History */}
          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="w-5 h-5 text-primary" />
                  Recent Check-ins
                </CardTitle>
                <CardDescription>Your last 5 check-ins</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {mockCheckInHistory.map((record, index) => (
                    <motion.div
                      key={record._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`flex items-center justify-between p-3 rounded-lg border transition-all hover:bg-muted/50 ${
                        record.status === "late"
                          ? "border-yellow-200 dark:border-yellow-800"
                          : "border-border"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            record.status === "success"
                              ? "bg-green-100 dark:bg-green-900"
                              : "bg-yellow-100 dark:bg-yellow-900"
                          }`}
                        >
                          {record.status === "success" ? (
                            <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                          ) : (
                            <Clock className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{record.className}</p>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(record.date)} at {record.time}
                          </p>
                        </div>
                      </div>
                      <Badge
                        variant={record.status === "success" ? "default" : "secondary"}
                        className={
                          record.status === "success"
                            ? "bg-green-500/10 text-green-600 border-green-500/20"
                            : "bg-yellow-500/10 text-yellow-600 border-yellow-500/20"
                        }
                      >
                        {record.status === "success" ? "On Time" : "Late"}
                      </Badge>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Instructions */}
          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.4 }}
          >
            <Card className="bg-muted/30">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  How to Check In
                </h3>
                <ol className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                      1
                    </span>
                    <span>Arrive at the dojo within 15 minutes of your class start time</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                      2
                    </span>
                    <span>Open this page and tap on your QR code to enlarge it</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                      3
                    </span>
                    <span>Hold your phone up to the scanner at the entrance</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                      4
                    </span>
                    <span>Wait for the confirmation beep and enjoy your training!</span>
                  </li>
                </ol>
              </CardContent>
            </Card>
          </motion.div>
        </DashboardWrapper>

        <MobileNavigation />
      </div>
    </PageTransition>
  );
}
