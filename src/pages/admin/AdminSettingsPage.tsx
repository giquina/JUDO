import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import Navigation from "@/components/Navigation";
import MobileNavigation from "@/components/MobileNavigation";
import PageTransition from "@/components/PageTransition";
import DashboardWrapper from "@/components/DashboardWrapper";
import AdminSidebar from "@/components/AdminSidebar";
import {
  Settings,
  Building2,
  Phone,
  Mail,
  Globe,
  Calendar,
  CreditCard,
  Users,
  Bell,
  AlertTriangle,
  Save,
  Trash2,
  Plus,
  Edit,
  X,
  Check,
  RefreshCw,
  Download,
  Clock,
} from "lucide-react";

// Types
interface ClubInfo {
  name: string;
  address: string;
  city: string;
  postcode: string;
  phone: string;
  email: string;
  website: string;
  foundedYear: string;
}

interface SubscriptionTier {
  id: string;
  name: string;
  price: number;
  features: string[];
  isActive: boolean;
}

interface ClassSchedule {
  id: string;
  name: string;
  day: string;
  startTime: string;
  endTime: string;
  instructor: string;
  capacity: number;
  level: string;
  isActive: boolean;
}

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "admin" | "coach";
  lastActive: number;
}

// Mock data - will be replaced with Convex queries
const mockClubInfo: ClubInfo = {
  name: "Birkbeck Judo Club",
  address: "Malet Street",
  city: "London",
  postcode: "WC1E 7HX",
  phone: "020 7631 6000",
  email: "judo@bbk.ac.uk",
  website: "https://judo.bbk.ac.uk",
  foundedYear: "1985",
};

const mockSubscriptionTiers: SubscriptionTier[] = [
  { id: "1", name: "Student", price: 2500, features: ["Unlimited training", "Free grading attempts", "Student ID required"], isActive: true },
  { id: "2", name: "Standard", price: 4000, features: ["Unlimited training", "Free grading attempts", "Guest passes (2/month)"], isActive: true },
  { id: "3", name: "Premium", price: 6000, features: ["Unlimited training", "Free grading attempts", "Guest passes (5/month)", "Private lessons (1/month)", "Competition entry support"], isActive: true },
];

const mockClassSchedule: ClassSchedule[] = [
  { id: "1", name: "Beginners Fundamentals", day: "Monday", startTime: "18:00", endTime: "19:30", instructor: "Sensei Tanaka", capacity: 25, level: "Beginner", isActive: true },
  { id: "2", name: "Advanced Techniques", day: "Tuesday", startTime: "20:00", endTime: "21:30", instructor: "Sensei Tanaka", capacity: 15, level: "Advanced", isActive: true },
  { id: "3", name: "Kids Judo", day: "Wednesday", startTime: "16:00", endTime: "17:00", instructor: "Coach Williams", capacity: 18, level: "Kids", isActive: true },
  { id: "4", name: "Competition Training", day: "Thursday", startTime: "19:00", endTime: "21:00", instructor: "Sensei Tanaka", capacity: 20, level: "Competition", isActive: true },
  { id: "5", name: "Randori Practice", day: "Saturday", startTime: "10:00", endTime: "12:00", instructor: "Sensei Tanaka", capacity: 30, level: "All Levels", isActive: true },
];

const mockAdminUsers: AdminUser[] = [
  { id: "1", name: "Yuki Tanaka", email: "y.tanaka@bbk.ac.uk", role: "admin", lastActive: Date.now() - 1 * 60 * 60 * 1000 },
  { id: "2", name: "John Williams", email: "j.williams@bbk.ac.uk", role: "coach", lastActive: Date.now() - 24 * 60 * 60 * 1000 },
  { id: "3", name: "Sarah Mitchell", email: "s.mitchell@bbk.ac.uk", role: "admin", lastActive: Date.now() - 3 * 24 * 60 * 60 * 1000 },
];

const mockNotificationSettings = {
  emailNewMember: true,
  emailPaymentFailed: true,
  emailLowAttendance: true,
  pushClassReminder: true,
  pushGradingReminder: true,
  weeklyReport: true,
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

function validateUrl(url: string): { isValid: boolean; message?: string } {
  if (!url) {
    return { isValid: true }; // URL is optional
  }
  try {
    new URL(url);
    return { isValid: true };
  } catch {
    return { isValid: false, message: "Please enter a valid URL" };
  }
}

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
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
            <pattern id="tatami-settings" x="0" y="0" width="60" height="30" patternUnits="userSpaceOnUse">
              <rect width="60" height="30" fill="none" stroke="currentColor" strokeWidth="1"/>
              <line x1="30" y1="0" x2="30" y2="30" stroke="currentColor" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#tatami-settings)" className="text-primary"/>
        </svg>
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background" />
    </div>
  );
}

// Section wrapper component
function SettingsSection({
  icon: Icon,
  title,
  description,
  children,
  action,
}: {
  icon: typeof Settings;
  title: string;
  description: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <motion.div variants={itemVariants}>
      <Card className="hover:shadow-lg transition-shadow duration-300">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Icon className="h-5 w-5 text-primary" />
                {title}
              </CardTitle>
              <CardDescription>{description}</CardDescription>
            </div>
            {action}
          </div>
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>
    </motion.div>
  );
}

// Toggle switch component
function ToggleSwitch({
  checked,
  onChange,
  label,
  description,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  description?: string;
}) {
  return (
    <div className="flex items-center justify-between py-3 border-b last:border-0">
      <div>
        <p className="font-medium">{label}</p>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>
      <motion.button
        className={`relative w-12 h-6 rounded-full transition-colors ${
          checked ? "bg-primary" : "bg-muted"
        }`}
        onClick={() => onChange(!checked)}
        whileTap={{ scale: 0.95 }}
      >
        <motion.div
          className="absolute top-1 w-4 h-4 bg-white rounded-full shadow"
          animate={{ left: checked ? 28 : 4 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      </motion.button>
    </div>
  );
}

// Club Information Section
function ClubInfoSection() {
  const [clubInfo, setClubInfo] = useState(mockClubInfo);
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validateField = (field: string, value: string) => {
    let validation: { isValid: boolean; message?: string } = { isValid: true };

    switch (field) {
      case "email":
        validation = validateEmail(value);
        break;
      case "phone":
        validation = validatePhone(value);
        break;
      case "website":
        validation = validateUrl(value);
        break;
    }

    setErrors(prev => ({
      ...prev,
      [field]: validation.message || ""
    }));

    return validation.isValid;
  };

  const handleFieldChange = (field: keyof ClubInfo, value: string) => {
    setClubInfo({ ...clubInfo, [field]: value });
    if (touched[field]) {
      validateField(field, value);
    }
  };

  const handleFieldBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    validateField(field, clubInfo[field as keyof ClubInfo]);
  };

  const handleSave = () => {
    // Validate all fields
    const emailValid = validateField("email", clubInfo.email);
    const phoneValid = validateField("phone", clubInfo.phone);
    const websiteValid = validateField("website", clubInfo.website);

    setTouched({ email: true, phone: true, website: true });

    if (!emailValid || !phoneValid || !websiteValid) {
      toast.error("Please fix the validation errors before saving");
      return;
    }

    toast.success("Club information updated successfully!");
    setIsEditing(false);
    setTouched({});
    setErrors({});
  };

  const handleCancel = () => {
    setIsEditing(false);
    setClubInfo(mockClubInfo);
    setTouched({});
    setErrors({});
  };

  return (
    <SettingsSection
      icon={Building2}
      title="Club Information"
      description="Basic information about your dojo"
      action={
        isEditing ? (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleCancel}>
              <X className="h-4 w-4 mr-1" />
              Cancel
            </Button>
            <Button size="sm" onClick={handleSave}>
              <Save className="h-4 w-4 mr-1" />
              Save
            </Button>
          </div>
        ) : (
          <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
            <Edit className="h-4 w-4 mr-1" />
            Edit
          </Button>
        )
      }
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium mb-1 block">Club Name</label>
          <Input
            value={clubInfo.name}
            onChange={(e) => handleFieldChange("name", e.target.value)}
            disabled={!isEditing}
          />
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">Founded Year</label>
          <Input
            value={clubInfo.foundedYear}
            onChange={(e) => handleFieldChange("foundedYear", e.target.value)}
            disabled={!isEditing}
          />
        </div>
        <div className="sm:col-span-2">
          <label className="text-sm font-medium mb-1 block">Address</label>
          <Input
            value={clubInfo.address}
            onChange={(e) => handleFieldChange("address", e.target.value)}
            disabled={!isEditing}
          />
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">City</label>
          <Input
            value={clubInfo.city}
            onChange={(e) => handleFieldChange("city", e.target.value)}
            disabled={!isEditing}
          />
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">Postcode</label>
          <Input
            value={clubInfo.postcode}
            onChange={(e) => handleFieldChange("postcode", e.target.value)}
            disabled={!isEditing}
          />
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">Phone</label>
          <div className="space-y-1">
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={clubInfo.phone}
                onChange={(e) => handleFieldChange("phone", e.target.value)}
                onBlur={() => handleFieldBlur("phone")}
                disabled={!isEditing}
                className={`pl-9 ${touched.phone && errors.phone ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                aria-invalid={touched.phone && !!errors.phone}
              />
            </div>
            {touched.phone && errors.phone && (
              <p className="text-xs text-red-500">{errors.phone}</p>
            )}
          </div>
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">Email</label>
          <div className="space-y-1">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="email"
                value={clubInfo.email}
                onChange={(e) => handleFieldChange("email", e.target.value)}
                onBlur={() => handleFieldBlur("email")}
                disabled={!isEditing}
                className={`pl-9 ${touched.email && errors.email ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                aria-invalid={touched.email && !!errors.email}
              />
            </div>
            {touched.email && errors.email && (
              <p className="text-xs text-red-500">{errors.email}</p>
            )}
          </div>
        </div>
        <div className="sm:col-span-2">
          <label className="text-sm font-medium mb-1 block">Website</label>
          <div className="space-y-1">
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={clubInfo.website}
                onChange={(e) => handleFieldChange("website", e.target.value)}
                onBlur={() => handleFieldBlur("website")}
                disabled={!isEditing}
                className={`pl-9 ${touched.website && errors.website ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                aria-invalid={touched.website && !!errors.website}
              />
            </div>
            {touched.website && errors.website && (
              <p className="text-xs text-red-500">{errors.website}</p>
            )}
          </div>
        </div>
      </div>
    </SettingsSection>
  );
}

// Class Schedule Section
function ClassScheduleSection() {
  const [schedule, setSchedule] = useState(mockClassSchedule);

  const toggleClassActive = (id: string) => {
    setSchedule(schedule.map((cls) =>
      cls.id === id ? { ...cls, isActive: !cls.isActive } : cls
    ));
    const cls = schedule.find((c) => c.id === id);
    toast.success(`${cls?.name} ${cls?.isActive ? "disabled" : "enabled"}`);
  };

  return (
    <SettingsSection
      icon={Calendar}
      title="Class Schedule"
      description="Manage your weekly class timetable"
      action={
        <Button size="sm" onClick={() => toast.info("Add class form would open here")}>
          <Plus className="h-4 w-4 mr-1" />
          Add Class
        </Button>
      }
    >
      <div className="space-y-3">
        {schedule.map((cls) => (
          <motion.div
            key={cls.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
              cls.isActive ? "hover:bg-muted/50" : "bg-muted/30 opacity-60"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-medium text-sm ${
                cls.isActive ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
              }`}>
                {cls.day.slice(0, 3)}
              </div>
              <div>
                <p className="font-medium">{cls.name}</p>
                <p className="text-sm text-muted-foreground">
                  {cls.startTime} - {cls.endTime} | {cls.instructor} | {cls.capacity} capacity
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={cls.isActive ? "default" : "secondary"}>{cls.level}</Badge>
              <Button variant="ghost" size="sm" onClick={() => toast.info(`Edit ${cls.name}`)}>
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleClassActive(cls.id)}
                className={cls.isActive ? "" : "text-green-600"}
              >
                {cls.isActive ? <X className="h-4 w-4" /> : <Check className="h-4 w-4" />}
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
    </SettingsSection>
  );
}

// Subscription Pricing Section
function SubscriptionPricingSection() {
  const [tiers] = useState(mockSubscriptionTiers);

  return (
    <SettingsSection
      icon={CreditCard}
      title="Subscription Pricing"
      description="Manage membership tiers and pricing"
      action={
        <Button size="sm" onClick={() => toast.info("Add tier form would open here")}>
          <Plus className="h-4 w-4 mr-1" />
          Add Tier
        </Button>
      }
    >
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {tiers.map((tier) => (
          <motion.div
            key={tier.id}
            className="p-4 rounded-lg border bg-gradient-to-br from-muted/50 to-transparent hover:shadow-md transition-shadow"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-bold text-lg">{tier.name}</h4>
              <Button variant="ghost" size="sm" onClick={() => toast.info(`Edit ${tier.name} tier`)}>
                <Edit className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-3xl font-bold text-primary mb-4">
              {(tier.price / 100).toLocaleString("en-GB", { style: "currency", currency: "GBP" })}
              <span className="text-sm font-normal text-muted-foreground">/month</span>
            </p>
            <ul className="space-y-2">
              {tier.features.map((feature, index) => (
                <li key={index} className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-green-600" />
                  {feature}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </SettingsSection>
  );
}

// Admin Users Section
function AdminUsersSection({ now }: { now: number }) {
  const [users] = useState(mockAdminUsers);

  const getTimeAgo = (timestamp: number) => {
    const hours = Math.floor((now - timestamp) / (60 * 60 * 1000));
    if (hours < 1) return "Just now";
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <SettingsSection
      icon={Users}
      title="Admin Users"
      description="Manage administrators and coaches with access"
      action={
        <Button size="sm" onClick={() => toast.info("Invite admin form would open here")}>
          <Plus className="h-4 w-4 mr-1" />
          Invite
        </Button>
      }
    >
      <div className="space-y-3">
        {users.map((user) => (
          <div
            key={user.id}
            className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-semibold text-primary">
                {user.name.split(" ").map((n) => n[0]).join("")}
              </div>
              <div>
                <p className="font-medium">{user.name}</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <Badge variant={user.role === "admin" ? "default" : "secondary"}>
                  {user.role}
                </Badge>
                <p className="text-xs text-muted-foreground mt-1">
                  <Clock className="h-3 w-3 inline mr-1" />
                  {getTimeAgo(user.lastActive)}
                </p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => toast.info(`Edit ${user.name}`)}>
                <Edit className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </SettingsSection>
  );
}

// Notification Settings Section
function NotificationSettingsSection() {
  const [settings, setSettings] = useState(mockNotificationSettings);

  const handleToggle = (key: keyof typeof mockNotificationSettings) => {
    setSettings({ ...settings, [key]: !settings[key] });
    toast.success("Notification preference updated");
  };

  return (
    <SettingsSection
      icon={Bell}
      title="Notification Settings"
      description="Configure email and push notification preferences"
    >
      <div className="space-y-1">
        <h4 className="font-medium text-sm text-muted-foreground mb-3">Email Notifications</h4>
        <ToggleSwitch
          checked={settings.emailNewMember}
          onChange={() => handleToggle("emailNewMember")}
          label="New Member Signup"
          description="Get notified when a new member joins"
        />
        <ToggleSwitch
          checked={settings.emailPaymentFailed}
          onChange={() => handleToggle("emailPaymentFailed")}
          label="Payment Failed"
          description="Alert when a payment fails"
        />
        <ToggleSwitch
          checked={settings.emailLowAttendance}
          onChange={() => handleToggle("emailLowAttendance")}
          label="Low Attendance Alert"
          description="When a member hasn't attended in 14+ days"
        />
        <ToggleSwitch
          checked={settings.weeklyReport}
          onChange={() => handleToggle("weeklyReport")}
          label="Weekly Summary Report"
          description="Receive weekly analytics digest"
        />
        <h4 className="font-medium text-sm text-muted-foreground mb-3 mt-6">Push Notifications</h4>
        <ToggleSwitch
          checked={settings.pushClassReminder}
          onChange={() => handleToggle("pushClassReminder")}
          label="Class Reminders"
          description="Remind members about upcoming classes"
        />
        <ToggleSwitch
          checked={settings.pushGradingReminder}
          onChange={() => handleToggle("pushGradingReminder")}
          label="Grading Reminders"
          description="Notify about upcoming gradings"
        />
      </div>
    </SettingsSection>
  );
}

// Danger Zone Section
function DangerZoneSection() {
  const [showConfirm, setShowConfirm] = useState<string | null>(null);

  const dangerActions = [
    {
      id: "export",
      title: "Export All Data",
      description: "Download all club data as a backup",
      icon: Download,
      buttonText: "Export",
      buttonVariant: "outline" as const,
      isDangerous: false,
    },
    {
      id: "reset-attendance",
      title: "Reset Attendance Data",
      description: "Clear all attendance records (irreversible)",
      icon: RefreshCw,
      buttonText: "Reset",
      buttonVariant: "destructive" as const,
      isDangerous: true,
    },
    {
      id: "delete-inactive",
      title: "Delete Inactive Members",
      description: "Remove members inactive for 1+ year",
      icon: Trash2,
      buttonText: "Delete",
      buttonVariant: "destructive" as const,
      isDangerous: true,
    },
  ];

  const handleAction = (id: string) => {
    if (showConfirm === id) {
      toast.success(`Action "${id}" confirmed (mock)`);
      setShowConfirm(null);
    } else {
      setShowConfirm(id);
    }
  };

  return (
    <motion.div variants={itemVariants}>
      <Card className="border-red-200 dark:border-red-800 hover:shadow-lg transition-shadow duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg text-red-600">
            <AlertTriangle className="h-5 w-5" />
            Danger Zone
          </CardTitle>
          <CardDescription>Irreversible actions that affect your data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {dangerActions.map((action) => (
              <div
                key={action.id}
                className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                  action.isDangerous ? "border-red-200 dark:border-red-800" : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    action.isDangerous ? "bg-red-100 dark:bg-red-900/30" : "bg-muted"
                  }`}>
                    <action.icon className={`h-5 w-5 ${action.isDangerous ? "text-red-600" : "text-muted-foreground"}`} />
                  </div>
                  <div>
                    <p className="font-medium">{action.title}</p>
                    <p className="text-sm text-muted-foreground">{action.description}</p>
                  </div>
                </div>
                <AnimatePresence mode="wait">
                  {showConfirm === action.id ? (
                    <motion.div
                      key="confirm"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="flex gap-2"
                    >
                      <Button variant="outline" size="sm" onClick={() => setShowConfirm(null)}>
                        Cancel
                      </Button>
                      <Button
                        variant={action.buttonVariant}
                        size="sm"
                        onClick={() => handleAction(action.id)}
                      >
                        Confirm
                      </Button>
                    </motion.div>
                  ) : (
                    <motion.div key="action" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      <Button
                        variant={action.buttonVariant}
                        size="sm"
                        onClick={() => handleAction(action.id)}
                      >
                        {action.buttonText}
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function AdminSettingsPage() {
  // Use useState with lazy initializer for stable timestamp (React Compiler safe)
  const [now] = useState(() => Date.now());

  return (
    <PageTransition>
      <div className="min-h-screen bg-background relative">
        <DojoBackgroundPattern />
        <Navigation />
        <div className="flex">
          <AdminSidebar />
          <DashboardWrapper className="flex-1 md:ml-64 container mx-auto p-4 space-y-6 relative z-10">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded-2xl"
          >
            <div className="absolute inset-0">
              <img
                src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=70"
                alt="Settings gear"
                loading="lazy"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
            </div>

            <div className="relative p-6 sm:p-8">
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent drop-shadow-lg">
                Settings
              </h1>
              <p className="text-white/90 mt-1">Configure your dojo management system</p>
            </div>
          </motion.div>

          {/* Settings Sections */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            <ClubInfoSection />
            <ClassScheduleSection />
            <SubscriptionPricingSection />
            <AdminUsersSection now={now} />
            <NotificationSettingsSection />
            <DangerZoneSection />
          </motion.div>
        </DashboardWrapper>
        </div>

        <MobileNavigation />
      </div>
    </PageTransition>
  );
}
