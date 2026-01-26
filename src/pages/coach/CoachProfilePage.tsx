import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import Navigation from "@/components/Navigation";
import MobileNavigation from "@/components/MobileNavigation";
import CoachSidebar from "@/components/CoachSidebar";
import PageTransition from "@/components/PageTransition";
import DashboardWrapper from "@/components/DashboardWrapper";
import {
  User,
  Mail,
  Award,
  Calendar,
  Bell,
  LogOut,
  Shield,
  Clock,
  Users,
  ChevronRight,
  Edit,
  Check,
  X,
  Settings,
  Moon,
  Sun,
  Smartphone,
  MessageSquare,
} from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";

// Mock data - will be replaced with Convex queries
const mockCoach = {
  _id: "coach-1",
  name: "Sensei Takeshi Yamamoto",
  email: "t.yamamoto@bbk.ac.uk",
  beltRank: "black",
  danGrade: "4th Dan",
  phone: "+44 7700 900123",
  joinDate: Date.now() - 1825 * 24 * 60 * 60 * 1000, // 5 years
  totalClassesTaught: 520,
  totalStudentsTaught: 156,
  certifications: [
    "BJA Level 3 Coach",
    "First Aid Certified",
    "Safeguarding Level 2",
  ],
  specializations: ["Nage-waza", "Ne-waza", "Competition Coaching"],
  classesThisWeek: [
    { _id: "1", name: "Monday Evening Fundamentals", day: "Monday", time: "19:00" },
    { _id: "2", name: "Wednesday Intermediate", day: "Wednesday", time: "19:00" },
    { _id: "3", name: "Friday Advanced", day: "Friday", time: "20:00" },
  ],
};

const mockNotificationSettings = {
  classReminders: true,
  attendanceAlerts: true,
  memberUpdates: false,
  weeklyReports: true,
  pushNotifications: true,
  emailNotifications: true,
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

// Validation helpers
function validateEmail(email: string): { isValid: boolean; message?: string } {
  if (!email) {
    return { isValid: false, message: "Email is required" };
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, message: "Please enter a valid email format" };
  }
  return { isValid: true };
}

function validatePhone(phone: string): { isValid: boolean; message?: string } {
  if (!phone) {
    return { isValid: false, message: "Phone is required" };
  }
  // UK phone validation - allows various formats
  const phoneRegex = /^(\+44|0)\s?\d{2,4}\s?\d{3,4}\s?\d{3,4}$/;
  if (!phoneRegex.test(phone.replace(/\s/g, '').replace(/^(\+44|0)/, '+44'))) {
    return { isValid: false, message: "Please enter a valid UK phone number" };
  }
  return { isValid: true };
}

type ValidationFieldType = "email" | "phone" | "text";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

// Dojo background pattern
function DojoBackgroundPattern() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.04]">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="tatami-profile" x="0" y="0" width="60" height="30" patternUnits="userSpaceOnUse">
              <rect width="60" height="30" fill="none" stroke="currentColor" strokeWidth="1"/>
              <line x1="30" y1="0" x2="30" y2="30" stroke="currentColor" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#tatami-profile)" className="text-primary"/>
        </svg>
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background" />
    </div>
  );
}

// Notification toggle component
function NotificationToggle({
  label,
  description,
  enabled,
  onToggle,
  icon: Icon,
}: {
  label: string;
  description: string;
  enabled: boolean;
  onToggle: () => void;
  icon: typeof Bell;
}) {
  return (
    <motion.div
      whileHover={{ x: 4 }}
      className="flex items-center justify-between p-3 rounded-lg border hover:border-primary/50 transition-all cursor-pointer"
      onClick={onToggle}
    >
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${enabled ? "bg-primary/10" : "bg-muted"}`}>
          <Icon className={`h-5 w-5 ${enabled ? "text-primary" : "text-muted-foreground"}`} />
        </div>
        <div>
          <p className="font-medium">{label}</p>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      <motion.div
        className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${
          enabled ? "bg-primary" : "bg-muted"
        }`}
        onClick={(e) => {
          e.stopPropagation();
          onToggle();
        }}
      >
        <motion.div
          className="w-4 h-4 bg-white rounded-full shadow"
          animate={{ x: enabled ? 24 : 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      </motion.div>
    </motion.div>
  );
}

// Editable field component with validation
function EditableField({
  label,
  value,
  icon: Icon,
  onSave,
  fieldType = "text",
}: {
  label: string;
  value: string;
  icon: typeof User;
  onSave: (newValue: string) => void;
  fieldType?: ValidationFieldType;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const [error, setError] = useState<string>("");
  const [touched, setTouched] = useState(false);

  const validate = (val: string): boolean => {
    let validation: { isValid: boolean; message?: string } = { isValid: true };

    switch (fieldType) {
      case "email":
        validation = validateEmail(val);
        break;
      case "phone":
        validation = validatePhone(val);
        break;
      default:
        if (!val.trim()) {
          validation = { isValid: false, message: `${label} is required` };
        }
    }

    setError(validation.message || "");
    return validation.isValid;
  };

  const handleChange = (val: string) => {
    setEditValue(val);
    if (touched) {
      validate(val);
    }
  };

  const handleBlur = () => {
    setTouched(true);
    validate(editValue);
  };

  const handleSave = () => {
    setTouched(true);
    if (!validate(editValue)) {
      toast.error(error || `Please enter a valid ${label.toLowerCase()}`);
      return;
    }
    onSave(editValue);
    setIsEditing(false);
    setTouched(false);
    setError("");
    toast.success(`${label} updated successfully`);
  };

  const handleCancel = () => {
    setEditValue(value);
    setIsEditing(false);
    setTouched(false);
    setError("");
  };

  const hasError = touched && error;

  return (
    <div className="flex items-center justify-between p-3 rounded-lg border">
      <div className="flex items-center gap-3 flex-1">
        <div className="p-2 rounded-lg bg-muted">
          <Icon className="h-5 w-5 text-muted-foreground" />
        </div>
        <div className="flex-1">
          <p className="text-sm text-muted-foreground">{label}</p>
          <AnimatePresence mode="wait">
            {isEditing ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-1 mt-1"
              >
                <div className="flex items-center gap-2">
                  <Input
                    value={editValue}
                    onChange={(e) => handleChange(e.target.value)}
                    onBlur={handleBlur}
                    className={`h-8 text-sm ${hasError ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                    aria-invalid={hasError ? "true" : "false"}
                    autoFocus
                  />
                  <Button size="sm" variant="ghost" onClick={handleSave} className="h-8 w-8 p-0">
                    <Check className="h-4 w-4 text-green-600" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={handleCancel} className="h-8 w-8 p-0">
                    <X className="h-4 w-4 text-red-600" />
                  </Button>
                </div>
                {hasError && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xs text-red-500"
                  >
                    {error}
                  </motion.p>
                )}
              </motion.div>
            ) : (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="font-medium"
              >
                {value}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>
      {!isEditing && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsEditing(true)}
          className="h-8 w-8 p-0"
        >
          <Edit className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}

// Stat card component
function StatCard({
  icon: Icon,
  label,
  value,
  gradient,
}: {
  icon: typeof Users;
  label: string;
  value: string | number;
  gradient: string;
}) {
  return (
    <motion.div variants={itemVariants} whileHover={{ scale: 1.02 }}>
      <Card className={`${gradient} border-opacity-50`}>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-white/50 dark:bg-black/20">
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold">{value}</p>
              <p className="text-sm text-muted-foreground">{label}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function CoachProfilePage() {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const [notifications, setNotifications] = useState(mockNotificationSettings);
  const [coach, setCoach] = useState(mockCoach);

  // Use useState with lazy initializer for stable timestamp (React Compiler safe)
  const [now] = useState(() => Date.now());

  const toggleNotification = (key: keyof typeof notifications) => {
    setNotifications((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
    toast.success(
      notifications[key]
        ? `${key.replace(/([A-Z])/g, " $1").trim()} disabled`
        : `${key.replace(/([A-Z])/g, " $1").trim()} enabled`
    );
  };

  const handleLogout = () => {
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const memberSince = new Date(coach.joinDate).toLocaleDateString("en-GB", {
    month: "long",
    year: "numeric",
  });

  return (
    <PageTransition>
      <div className="min-h-screen bg-background relative">
        <DojoBackgroundPattern />
        <CoachSidebar />
        <Navigation />

        <DashboardWrapper className="container mx-auto p-4 space-y-6 relative z-10 md:ml-64">
          {/* Profile Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded-2xl"
          >
            <div className="absolute inset-0">
              <img
                src="https://images.unsplash.com/photo-1555597673-b21d5c935865?w=1200&q=70"
                alt="Judo dojo"
                loading="lazy"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40" />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
            </div>

            <div className="relative p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                {/* Avatar */}
                <motion.div
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-violet-500 to-blue-600 flex items-center justify-center text-white text-2xl sm:text-3xl font-bold shadow-xl ring-4 ring-white/20"
                  whileHover={{ scale: 1.05 }}
                >
                  {coach.name
                    .split(" ")
                    .slice(-2)
                    .map((n) => n[0])
                    .join("")}
                </motion.div>

                <div className="flex-1">
                  <h1 className="text-2xl sm:text-3xl font-bold text-white drop-shadow-lg">
                    {coach.name}
                  </h1>
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <Badge className={`${BELT_COLORS[coach.beltRank]} text-sm`}>
                      {coach.beltRank.charAt(0).toUpperCase() + coach.beltRank.slice(1)} Belt
                    </Badge>
                    <Badge variant="outline" className="bg-white/10 text-white border-white/30">
                      {coach.danGrade}
                    </Badge>
                    <Badge variant="outline" className="bg-white/10 text-white border-white/30">
                      <Shield className="h-3 w-3 mr-1" />
                      Sensei
                    </Badge>
                  </div>
                  <p className="text-white/80 text-sm mt-2">
                    Teaching since {memberSince}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 lg:grid-cols-4 gap-3"
          >
            <StatCard
              icon={Calendar}
              label="Classes Taught"
              value={coach.totalClassesTaught}
              gradient="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-200 dark:border-blue-800"
            />
            <StatCard
              icon={Users}
              label="Students Taught"
              value={coach.totalStudentsTaught}
              gradient="bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-200 dark:border-green-800"
            />
            <StatCard
              icon={Award}
              label="Certifications"
              value={coach.certifications.length}
              gradient="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-200 dark:border-purple-800"
            />
            <StatCard
              icon={Clock}
              label="Years Teaching"
              value={Math.floor((now - coach.joinDate) / (365 * 24 * 60 * 60 * 1000))}
              gradient="bg-gradient-to-br from-orange-500/10 to-orange-600/5 border-orange-200 dark:border-orange-800"
            />
          </motion.div>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Personal Information */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5 text-primary" />
                    Personal Information
                  </CardTitle>
                  <CardDescription>
                    Manage your profile details
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <EditableField
                    label="Full Name"
                    value={coach.name}
                    icon={User}
                    onSave={(value) => setCoach((prev) => ({ ...prev, name: value }))}
                    fieldType="text"
                  />
                  <EditableField
                    label="Email"
                    value={coach.email}
                    icon={Mail}
                    onSave={(value) => setCoach((prev) => ({ ...prev, email: value }))}
                    fieldType="email"
                  />
                  <EditableField
                    label="Phone"
                    value={coach.phone}
                    icon={Smartphone}
                    onSave={(value) => setCoach((prev) => ({ ...prev, phone: value }))}
                    fieldType="phone"
                  />
                </CardContent>
              </Card>
            </motion.div>

            {/* Classes This Week */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    My Keiko This Week
                  </CardTitle>
                  <CardDescription>
                    Your scheduled classes
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  {coach.classesThisWeek.map((cls) => (
                    <motion.div
                      key={cls._id}
                      whileHover={{ x: 4 }}
                      className="flex items-center justify-between p-3 rounded-lg border hover:border-primary/50 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <Clock className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{cls.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {cls.day} at {cls.time}
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </motion.div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Certifications */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-primary" />
                  Certifications & Specializations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">
                      Certifications
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {coach.certifications.map((cert) => (
                        <Badge key={cert} variant="secondary" className="py-1">
                          <Shield className="h-3 w-3 mr-1" />
                          {cert}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">
                      Specializations
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {coach.specializations.map((spec) => (
                        <Badge key={spec} variant="outline" className="py-1">
                          {spec}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Notification Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-primary" />
                  Notification Settings
                </CardTitle>
                <CardDescription>
                  Control how you receive updates
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <NotificationToggle
                  label="Class Reminders"
                  description="Get reminders before your classes start"
                  enabled={notifications.classReminders}
                  onToggle={() => toggleNotification("classReminders")}
                  icon={Calendar}
                />
                <NotificationToggle
                  label="Attendance Alerts"
                  description="Notifications about attendance issues"
                  enabled={notifications.attendanceAlerts}
                  onToggle={() => toggleNotification("attendanceAlerts")}
                  icon={Users}
                />
                <NotificationToggle
                  label="Member Updates"
                  description="Updates when members join or progress"
                  enabled={notifications.memberUpdates}
                  onToggle={() => toggleNotification("memberUpdates")}
                  icon={MessageSquare}
                />
                <NotificationToggle
                  label="Weekly Reports"
                  description="Summary of your weekly teaching stats"
                  enabled={notifications.weeklyReports}
                  onToggle={() => toggleNotification("weeklyReports")}
                  icon={Settings}
                />
              </CardContent>
            </Card>
          </motion.div>

          {/* App Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-primary" />
                  App Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <motion.div
                  whileHover={{ x: 4 }}
                  className="flex items-center justify-between p-3 rounded-lg border hover:border-primary/50 transition-all cursor-pointer"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${theme === "dark" ? "bg-primary/10" : "bg-muted"}`}>
                      {theme === "dark" ? (
                        <Moon className="h-5 w-5 text-primary" />
                      ) : (
                        <Sun className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">Dark Mode</p>
                      <p className="text-sm text-muted-foreground">
                        {theme === "dark" ? "Currently enabled" : "Currently disabled"}
                      </p>
                    </div>
                  </div>
                  <motion.div
                    className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${
                      theme === "dark" ? "bg-primary" : "bg-muted"
                    }`}
                  >
                    <motion.div
                      className="w-4 h-4 bg-white rounded-full shadow"
                      animate={{ x: theme === "dark" ? 24 : 0 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  </motion.div>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Logout Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Button
              variant="destructive"
              className="w-full min-h-[48px]"
              size="lg"
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5 mr-2" />
              Logout
            </Button>
          </motion.div>
        </DashboardWrapper>

        <MobileNavigation />
      </div>
    </PageTransition>
  );
}
