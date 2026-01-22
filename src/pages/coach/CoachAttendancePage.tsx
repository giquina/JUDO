import { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Html5QrcodeScanner } from "html5-qrcode";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import Navigation from "@/components/Navigation";
import MobileNavigation from "@/components/MobileNavigation";
import PageTransition from "@/components/PageTransition";
import {
  QrCode,
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  UserPlus,
  Calendar,
  Camera,
  CameraOff,
  Keyboard,
  UserCheck,
  UserX,
  Sparkles,
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
  },
  {
    _id: "class-2",
    name: "Wednesday Intermediate",
    dayOfWeek: "Wednesday",
    startTime: "19:00",
    endTime: "20:30",
    level: "intermediate",
  },
  {
    _id: "class-3",
    name: "Friday Advanced",
    dayOfWeek: "Friday",
    startTime: "20:00",
    endTime: "21:30",
    level: "advanced",
  },
];

const mockAttendanceList = [
  { memberId: "1", name: "Alice Chen", beltRank: "blue", status: "present", checkInTime: Date.now() - 3600000 },
  { memberId: "2", name: "Raj Patel", beltRank: "white", status: "present", checkInTime: Date.now() - 3500000 },
  { memberId: "3", name: "Emma Williams", beltRank: "yellow", status: "absent", checkInTime: null },
  { memberId: "4", name: "James O'Brien", beltRank: "orange", status: "present", checkInTime: Date.now() - 3400000 },
  { memberId: "5", name: "Sofia Rodriguez", beltRank: "green", status: "absent", checkInTime: null },
  { memberId: "6", name: "Mohammed Hassan", beltRank: "brown", status: "present", checkInTime: Date.now() - 3300000 },
  { memberId: "7", name: "Lucy Taylor", beltRank: "white", status: "absent", checkInTime: null },
  { memberId: "8", name: "Yuki Tanaka", beltRank: "black", status: "present", checkInTime: Date.now() - 3200000 },
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
  beginner: "bg-green-100 text-green-800",
  intermediate: "bg-blue-100 text-blue-800",
  advanced: "bg-purple-100 text-purple-800",
};

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
};

// Dojo background pattern
function DojoBackgroundPattern() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.04]">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="tatami-attendance" x="0" y="0" width="60" height="30" patternUnits="userSpaceOnUse">
              <rect width="60" height="30" fill="none" stroke="currentColor" strokeWidth="1"/>
              <line x1="30" y1="0" x2="30" y2="30" stroke="currentColor" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#tatami-attendance)" className="text-primary"/>
        </svg>
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background" />
    </div>
  );
}

// Live indicator
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

// QR Scanner component
function QRScanner({
  isScanning,
  onScan,
  onStop,
}: {
  isScanning: boolean;
  onScan: (memberId: string) => void;
  onStop: () => void;
}) {
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  useEffect(() => {
    if (isScanning && !scannerRef.current) {
      scannerRef.current = new Html5QrcodeScanner(
        "qr-reader-coach",
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0,
        },
        false
      );

      scannerRef.current.render(
        (decodedText) => {
          try {
            const data = JSON.parse(decodedText);
            if (data.memberId) {
              onScan(data.memberId);
            }
          } catch {
            onScan(decodedText);
          }
        },
        (errorMessage) => {
          console.log(errorMessage);
        }
      );
    }

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(console.error);
        scannerRef.current = null;
      }
    };
  }, [isScanning, onScan]);

  if (!isScanning) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="space-y-4"
    >
      <div id="qr-reader-coach" className="rounded-lg overflow-hidden" />
      <Button onClick={onStop} variant="outline" className="w-full">
        <CameraOff className="h-4 w-4 mr-2" />
        Stop Scanner
      </Button>
    </motion.div>
  );
}

// Manual entry component
function ManualEntry({
  onSubmit,
}: {
  onSubmit: (name: string) => void;
}) {
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit(name.trim());
      setName("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        placeholder="Enter judoka name..."
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="flex-1 min-h-[44px]"
      />
      <Button type="submit" disabled={!name.trim()} className="min-h-[44px]">
        <UserPlus className="h-4 w-4 mr-1" />
        Add
      </Button>
    </form>
  );
}

// Attendance row component
function AttendanceRow({
  member,
  onToggle,
}: {
  member: typeof mockAttendanceList[0];
  onToggle: () => void;
}) {
  const [isToggling, setIsToggling] = useState(false);

  const handleToggle = async () => {
    setIsToggling(true);
    await new Promise((resolve) => setTimeout(resolve, 200));
    onToggle();
    setIsToggling(false);
  };

  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ scale: 1.01, x: 4 }}
      whileTap={{ scale: 0.99 }}
      className={`flex items-center justify-between p-3 sm:p-4 rounded-lg border cursor-pointer transition-all duration-300 min-h-[60px] touch-manipulation ${
        member.status === "present"
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
            member.status === "present"
              ? "bg-green-100 dark:bg-green-900"
              : "bg-red-100 dark:bg-red-900"
          }`}
        >
          {member.status === "present" ? (
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
          <Badge variant={member.status === "present" ? "default" : "destructive"}>
            {member.status === "present" ? "Present" : "Absent"}
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

// Quick stat card
function QuickStatCard({
  icon: Icon,
  iconColor,
  value,
  label,
  gradient,
}: {
  icon: typeof Users;
  iconColor: string;
  value: string | number;
  label: string;
  gradient: string;
}) {
  return (
    <motion.div whileHover={{ scale: 1.02 }} className={`p-4 rounded-xl ${gradient}`}>
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg bg-white/50 dark:bg-black/20`}>
          <Icon className={`h-5 w-5 ${iconColor}`} />
        </div>
        <div>
          <p className="text-2xl font-bold">{value}</p>
          <p className="text-xs text-muted-foreground">{label}</p>
        </div>
      </div>
    </motion.div>
  );
}

export default function CoachAttendancePage() {
  const [selectedClass, setSelectedClass] = useState<string>(mockClasses[0]._id);
  const [isScanning, setIsScanning] = useState(false);
  const [attendance, setAttendance] = useState(mockAttendanceList);
  const [searchQuery, setSearchQuery] = useState("");
  const presentCount = attendance.filter((a) => a.status === "present").length;
  const absentCount = attendance.filter((a) => a.status === "absent").length;
  const attendanceRate = Math.round((presentCount / attendance.length) * 100);

  const filteredAttendance = useMemo(() => {
    return attendance.filter((member) =>
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.beltRank.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [attendance, searchQuery]);

  const toggleAttendance = (memberId: string) => {
    setAttendance((prev) =>
      prev.map((a) => {
        if (a.memberId === memberId) {
          const newStatus = a.status === "present" ? "absent" : "present";
          toast.success(
            newStatus === "present"
              ? `${a.name} marked as present`
              : `${a.name} marked as absent`,
            { duration: 2000 }
          );
          return {
            ...a,
            status: newStatus,
            checkInTime: newStatus === "present" ? Date.now() : null,
          };
        }
        return a;
      })
    );
  };

  const handleQRScan = (memberId: string) => {
    const member = attendance.find((a) => a.memberId === memberId);
    if (member) {
      if (member.status === "present") {
        toast.info(`${member.name} is already checked in`);
      } else {
        toggleAttendance(memberId);
        toast.success(`${member.name} checked in via QR!`, {
          icon: <Sparkles className="h-4 w-4 text-green-500" />,
        });
      }
    } else {
      toast.error("Unknown member scanned");
    }
    setIsScanning(false);
  };

  const handleManualEntry = (name: string) => {
    const member = attendance.find(
      (a) => a.name.toLowerCase() === name.toLowerCase()
    );
    if (member) {
      if (member.status === "absent") {
        toggleAttendance(member.memberId);
      } else {
        toast.info(`${member.name} is already marked present`);
      }
    } else {
      toast.error(`No member found with name: ${name}`);
    }
  };

  const markAllPresent = () => {
    setAttendance((prev) =>
      prev.map((a) => ({
        ...a,
        status: "present",
        checkInTime: a.checkInTime || Date.now(),
      }))
    );
    toast.success("All judoka marked as present");
  };

  const markAllAbsent = () => {
    setAttendance((prev) =>
      prev.map((a) => ({
        ...a,
        status: "absent",
        checkInTime: null,
      }))
    );
    toast.success("All judoka marked as absent");
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
                src="https://images.unsplash.com/photo-1564415315949-7a0c4c73aab4?w=1200&q=70"
                alt="Martial arts training"
                loading="lazy"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
            </div>

            <div className="relative p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                  Attendance Scanner
                </h1>
                <p className="text-sm sm:text-base text-white/90 mt-1 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                  Check in judoka using QR or manual entry
                </p>
              </div>
              <LiveIndicator />
            </div>
          </motion.div>

          {/* Class Selector */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Select Keiko Session
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {mockClasses.map((cls) => (
                    <Button
                      key={cls._id}
                      variant={selectedClass === cls._id ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedClass(cls._id)}
                      className="min-h-[44px]"
                    >
                      <Badge className={`${LEVEL_COLORS[cls.level]} mr-2`} variant="secondary">
                        {cls.level.charAt(0).toUpperCase()}
                      </Badge>
                      {cls.name}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <QuickStatCard
              icon={UserCheck}
              iconColor="text-green-600"
              value={presentCount}
              label="Present"
              gradient="bg-gradient-to-br from-green-500/10 to-green-600/5 border border-green-200 dark:border-green-800"
            />
            <QuickStatCard
              icon={UserX}
              iconColor="text-red-600"
              value={absentCount}
              label="Absent"
              gradient="bg-gradient-to-br from-red-500/10 to-red-600/5 border border-red-200 dark:border-red-800"
            />
            <QuickStatCard
              icon={Users}
              iconColor="text-blue-600"
              value={attendance.length}
              label="Total Enrolled"
              gradient="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-200 dark:border-blue-800"
            />
            <QuickStatCard
              icon={Sparkles}
              iconColor="text-purple-600"
              value={`${attendanceRate}%`}
              label="Attendance Rate"
              gradient="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-200 dark:border-purple-800"
            />
          </div>

          {/* Scanner & Manual Entry */}
          <div className="grid gap-4 md:grid-cols-2">
            {/* QR Scanner */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <QrCode className="h-5 w-5 text-primary" />
                    QR Scanner
                  </CardTitle>
                  <CardDescription>
                    Scan member QR codes for quick check-in
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <AnimatePresence mode="wait">
                    {isScanning ? (
                      <QRScanner
                        isScanning={isScanning}
                        onScan={handleQRScan}
                        onStop={() => setIsScanning(false)}
                      />
                    ) : (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center space-y-4"
                      >
                        <div className="p-8 bg-muted/50 rounded-xl">
                          <Camera className="h-12 w-12 mx-auto text-muted-foreground/50 mb-2" />
                          <p className="text-muted-foreground">
                            Click to start scanning
                          </p>
                        </div>
                        <Button
                          onClick={() => setIsScanning(true)}
                          className="w-full bg-gradient-to-r from-violet-600 to-blue-600 min-h-[48px]"
                          size="lg"
                        >
                          <Camera className="h-5 w-5 mr-2" />
                          Start Scanner
                        </Button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>
            </motion.div>

            {/* Manual Entry */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Keyboard className="h-5 w-5 text-primary" />
                    Manual Entry
                  </CardTitle>
                  <CardDescription>
                    Type member name to check them in
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ManualEntry onSubmit={handleManualEntry} />

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={markAllPresent}
                      className="flex-1 text-green-600 hover:text-green-700 hover:bg-green-50 min-h-[44px]"
                    >
                      <UserCheck className="h-4 w-4 mr-1" />
                      All Present
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={markAllAbsent}
                      className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50 min-h-[44px]"
                    >
                      <UserX className="h-4 w-4 mr-1" />
                      All Absent
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Attendance List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-primary" />
                      Today's Attendance
                      <Badge variant="secondary">{presentCount} present</Badge>
                    </CardTitle>
                    <CardDescription>
                      Tap a judoka to toggle their attendance
                    </CardDescription>
                  </div>
                  <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search judoka..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 min-h-[44px]"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="space-y-2 max-h-[500px] overflow-y-auto"
                >
                  {filteredAttendance.map((member) => (
                    <AttendanceRow
                      key={member.memberId}
                      member={member}
                      onToggle={() => toggleAttendance(member.memberId)}
                    />
                  ))}
                  {filteredAttendance.length === 0 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center py-12"
                    >
                      <Users className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                      <p className="text-muted-foreground">No judoka match your search</p>
                    </motion.div>
                  )}
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Save Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Button
              className="w-full min-h-[48px] bg-gradient-to-r from-violet-600 to-blue-600"
              size="lg"
              onClick={() => toast.success("Attendance saved successfully!")}
            >
              <CheckCircle2 className="h-5 w-5 mr-2" />
              Save Attendance
            </Button>
          </motion.div>
        </main>

        <MobileNavigation />
      </div>
    </PageTransition>
  );
}
