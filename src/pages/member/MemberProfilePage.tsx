import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import Navigation from "@/components/Navigation";
import MobileNavigation from "@/components/MobileNavigation";
import PageTransition from "@/components/PageTransition";
import { useAuth } from "@/lib/auth";
import {
  User,
  Mail,
  Phone,
  CreditCard,
  Bell,
  Shield,
  LogOut,
  Award,
  Clock,
  AlertTriangle,
  Check,
  Edit,
  Settings,
  Moon,
  Sun,
  Smartphone,
} from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";

// Mock member profile data
const mockMember = {
  _id: "member-001",
  name: "Alice Chen",
  email: "a.chen@bbk.ac.uk",
  phone: "+44 7700 900123",
  beltRank: "blue",
  beltGrade: "2nd Kyu",
  joinDate: "2024-06-15",
  memberId: "BBK-2024-0042",
  emergencyContact: {
    name: "James Chen",
    phone: "+44 7700 900456",
    relationship: "Brother",
  },
  subscription: {
    tier: "standard",
    status: "active",
    nextBilling: "2026-02-15",
    price: 45,
    sessionsIncluded: 12,
    sessionsUsed: 8,
  },
};

// Mock notification preferences
const initialNotificationPrefs = {
  classReminders: true,
  promotionUpdates: true,
  clubNews: true,
  paymentReminders: true,
  marketingEmails: false,
  pushNotifications: true,
};

// Belt rank styles
const beltStyles: Record<string, { bg: string; text: string; border: string }> = {
  white: { bg: "bg-gray-50", text: "text-gray-800", border: "border-gray-300" },
  yellow: { bg: "bg-yellow-100", text: "text-yellow-800", border: "border-yellow-400" },
  orange: { bg: "bg-orange-100", text: "text-orange-800", border: "border-orange-400" },
  green: { bg: "bg-green-100", text: "text-green-800", border: "border-green-400" },
  blue: { bg: "bg-blue-100", text: "text-blue-800", border: "border-blue-400" },
  brown: { bg: "bg-amber-100", text: "text-amber-900", border: "border-amber-600" },
  black: { bg: "bg-gray-800", text: "text-white", border: "border-gray-600" },
};

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

// Profile section component
function ProfileSection({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: typeof User;
  children: React.ReactNode;
}) {
  return (
    <motion.div variants={itemVariants}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Icon className="w-5 h-5 text-primary" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>
    </motion.div>
  );
}

// Info row component
function InfoRow({
  label,
  value,
  icon: Icon,
  action,
}: {
  label: string;
  value: string;
  icon?: typeof User;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between py-3 border-b last:border-0">
      <div className="flex items-center gap-3">
        {Icon && <Icon className="w-4 h-4 text-muted-foreground" />}
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="font-medium">{value}</p>
        </div>
      </div>
      {action}
    </div>
  );
}

// Notification toggle row
function NotificationRow({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between py-3 border-b last:border-0">
      <div className="flex-1 mr-4">
        <p className="font-medium">{label}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}

export default function MemberProfilePage() {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const { theme, setTheme } = useTheme();
  const [notificationPrefs, setNotificationPrefs] = useState(initialNotificationPrefs);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    toast.loading("Signing out...");

    await new Promise((resolve) => setTimeout(resolve, 1000));
    await signOut();

    toast.dismiss();
    toast.success("Signed out successfully");
    navigate("/login");
  };

  const handleNotificationChange = (key: keyof typeof notificationPrefs, value: boolean) => {
    setNotificationPrefs((prev) => ({ ...prev, [key]: value }));
    toast.success("Preferences updated");
  };

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    toast.success(`Switched to ${newTheme} mode`);
  };

  const memberSince = new Date(mockMember.joinDate).toLocaleDateString("en-GB", {
    month: "long",
    year: "numeric",
  });

  const nextBilling = new Date(mockMember.subscription.nextBilling).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const beltStyle = beltStyles[mockMember.beltRank] || beltStyles.white;
  const subscriptionProgress =
    (mockMember.subscription.sessionsUsed / mockMember.subscription.sessionsIncluded) * 100;

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <Navigation />

        <main className="container mx-auto p-4 space-y-6 pb-24">
          {/* Header with Profile Card */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 p-6"
          >
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-30" />

            <div className="relative flex flex-col sm:flex-row items-center gap-4">
              {/* Avatar */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white/20 flex items-center justify-center border-4 border-white/30"
              >
                <span className="text-3xl sm:text-4xl font-bold text-white">
                  {mockMember.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </span>
              </motion.div>

              {/* Info */}
              <div className="flex-1 text-center sm:text-left">
                <h1 className="text-2xl sm:text-3xl font-bold text-white">{mockMember.name}</h1>
                <p className="text-white/80 mt-1">{mockMember.email}</p>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-3">
                  <Badge className={`${beltStyle.bg} ${beltStyle.text} ${beltStyle.border} border`}>
                    <Award className="w-3 h-3 mr-1" />
                    {mockMember.beltGrade} - {mockMember.beltRank.charAt(0).toUpperCase() + mockMember.beltRank.slice(1)} Belt
                  </Badge>
                  <Badge variant="secondary" className="bg-white/20 text-white border-0">
                    <Clock className="w-3 h-3 mr-1" />
                    Member since {memberSince}
                  </Badge>
                </div>
              </div>

              {/* Edit Button */}
              <Button
                variant="secondary"
                size="sm"
                className="bg-white/20 text-white hover:bg-white/30 border-0"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            </div>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid gap-6 md:grid-cols-2"
          >
            {/* Personal Information */}
            <ProfileSection title="Personal Information" icon={User}>
              <div className="space-y-0">
                <InfoRow label="Full Name" value={mockMember.name} icon={User} />
                <InfoRow label="Email" value={mockMember.email} icon={Mail} />
                <InfoRow label="Phone" value={mockMember.phone} icon={Phone} />
                <InfoRow label="Member ID" value={mockMember.memberId} icon={Shield} />
              </div>
            </ProfileSection>

            {/* Emergency Contact */}
            <ProfileSection title="Emergency Contact" icon={AlertTriangle}>
              <div className="space-y-0">
                <InfoRow
                  label="Contact Name"
                  value={mockMember.emergencyContact.name}
                  icon={User}
                />
                <InfoRow
                  label="Phone Number"
                  value={mockMember.emergencyContact.phone}
                  icon={Phone}
                />
                <InfoRow
                  label="Relationship"
                  value={mockMember.emergencyContact.relationship}
                />
              </div>
              <Button variant="outline" size="sm" className="w-full mt-4">
                <Edit className="w-4 h-4 mr-2" />
                Update Emergency Contact
              </Button>
            </ProfileSection>

            {/* Subscription */}
            <ProfileSection title="Subscription" icon={CreditCard}>
              <div className="space-y-4">
                {/* Status Badge */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge
                      className={
                        mockMember.subscription.status === "active"
                          ? "bg-green-100 text-green-700 border-green-300"
                          : "bg-red-100 text-red-700 border-red-300"
                      }
                    >
                      <Check className="w-3 h-3 mr-1" />
                      {mockMember.subscription.status.charAt(0).toUpperCase() +
                        mockMember.subscription.status.slice(1)}
                    </Badge>
                    <Badge variant="secondary">
                      {mockMember.subscription.tier.charAt(0).toUpperCase() +
                        mockMember.subscription.tier.slice(1)}{" "}
                      Plan
                    </Badge>
                  </div>
                  <span className="text-2xl font-bold">£{mockMember.subscription.price}/mo</span>
                </div>

                {/* Sessions Progress */}
                <div className="p-4 rounded-xl bg-muted/30">
                  <div className="flex justify-between text-sm mb-2">
                    <span>Sessions this month</span>
                    <span className="font-semibold">
                      {mockMember.subscription.sessionsUsed}/{mockMember.subscription.sessionsIncluded}
                    </span>
                  </div>
                  <div className="h-3 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-primary to-purple-500 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${subscriptionProgress}%` }}
                      transition={{ duration: 1 }}
                    />
                  </div>
                </div>

                {/* Next Billing */}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Next billing date</span>
                  <span className="font-medium">{nextBilling}</span>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1">
                    Change Plan
                  </Button>
                  <Button variant="outline" className="flex-1">
                    Billing History
                  </Button>
                </div>
              </div>
            </ProfileSection>

            {/* Notification Preferences */}
            <ProfileSection title="Notifications" icon={Bell}>
              <div className="space-y-0">
                <NotificationRow
                  label="Class Reminders"
                  description="Get notified before your booked classes"
                  checked={notificationPrefs.classReminders}
                  onChange={(v) => handleNotificationChange("classReminders", v)}
                />
                <NotificationRow
                  label="Promotion Updates"
                  description="News about belt gradings and promotions"
                  checked={notificationPrefs.promotionUpdates}
                  onChange={(v) => handleNotificationChange("promotionUpdates", v)}
                />
                <NotificationRow
                  label="Club News"
                  description="Announcements and club updates"
                  checked={notificationPrefs.clubNews}
                  onChange={(v) => handleNotificationChange("clubNews", v)}
                />
                <NotificationRow
                  label="Payment Reminders"
                  description="Billing and payment notifications"
                  checked={notificationPrefs.paymentReminders}
                  onChange={(v) => handleNotificationChange("paymentReminders", v)}
                />
                <NotificationRow
                  label="Marketing Emails"
                  description="Promotions and special offers"
                  checked={notificationPrefs.marketingEmails}
                  onChange={(v) => handleNotificationChange("marketingEmails", v)}
                />
              </div>
            </ProfileSection>
          </motion.div>

          {/* App Settings */}
          <motion.div variants={itemVariants} initial="hidden" animate="visible" transition={{ delay: 0.4 }}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5 text-primary" />
                  App Settings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Theme Toggle */}
                  <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        {theme === "dark" ? (
                          <Moon className="w-5 h-5 text-primary" />
                        ) : (
                          <Sun className="w-5 h-5 text-primary" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">Appearance</p>
                        <p className="text-sm text-muted-foreground">
                          {theme === "dark" ? "Dark" : "Light"} mode
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" onClick={toggleTheme}>
                      Switch to {theme === "dark" ? "Light" : "Dark"}
                    </Button>
                  </div>

                  {/* Push Notifications */}
                  <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Smartphone className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Push Notifications</p>
                        <p className="text-sm text-muted-foreground">
                          {notificationPrefs.pushNotifications ? "Enabled" : "Disabled"}
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={notificationPrefs.pushNotifications}
                      onCheckedChange={(v) => handleNotificationChange("pushNotifications", v)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Logout Section */}
          <motion.div variants={itemVariants} initial="hidden" animate="visible" transition={{ delay: 0.5 }}>
            <Card className="border-destructive/20">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
                      <LogOut className="w-6 h-6 text-destructive" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Sign Out</h3>
                      <p className="text-sm text-muted-foreground">
                        Sign out of your account on this device
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="destructive"
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="w-full sm:w-auto"
                  >
                    {isLoggingOut ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                      />
                    ) : (
                      <>
                        <LogOut className="w-4 h-4 mr-2" />
                        Sign Out
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* App Version */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-center text-sm text-muted-foreground"
          >
            Judo Dojo App v1.0.0 | Birkbeck University of London
          </motion.p>
        </main>

        <MobileNavigation />
      </div>
    </PageTransition>
  );
}
