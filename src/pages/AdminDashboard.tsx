import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import Navigation from "@/components/Navigation";
import MobileNavigation from "@/components/MobileNavigation";
import PageTransition from "@/components/PageTransition";
import {
  Users,
  CreditCard,
  Search,
  Download,
  Mail,
  ChevronUp,
  ChevronDown,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  Activity,
  UserPlus,
  BarChart3,
  FileSpreadsheet,
  Eye,
  Edit,
  MoreHorizontal,
} from "lucide-react";

// Mock data - will be replaced with Convex queries
const mockMembers = [
  { _id: "1", name: "Alice Chen", email: "a.chen@bbk.ac.uk", beltRank: "blue", subscriptionStatus: "active", subscriptionTier: "standard", totalSessions: 47, lastAttended: Date.now() - 2 * 24 * 60 * 60 * 1000, joinDate: Date.now() - 180 * 24 * 60 * 60 * 1000 },
  { _id: "2", name: "Raj Patel", email: "r.patel@bbk.ac.uk", beltRank: "white", subscriptionStatus: "active", subscriptionTier: "student", totalSessions: 8, lastAttended: Date.now() - 5 * 24 * 60 * 60 * 1000, joinDate: Date.now() - 30 * 24 * 60 * 60 * 1000 },
  { _id: "3", name: "Emma Williams", email: "e.williams@bbk.ac.uk", beltRank: "yellow", subscriptionStatus: "active", subscriptionTier: "student", totalSessions: 15, lastAttended: Date.now() - 7 * 24 * 60 * 60 * 1000, joinDate: Date.now() - 60 * 24 * 60 * 60 * 1000 },
  { _id: "4", name: "James O'Brien", email: "j.obrien@bbk.ac.uk", beltRank: "orange", subscriptionStatus: "active", subscriptionTier: "standard", totalSessions: 32, lastAttended: Date.now() - 1 * 24 * 60 * 60 * 1000, joinDate: Date.now() - 120 * 24 * 60 * 60 * 1000 },
  { _id: "5", name: "Sofia Rodriguez", email: "s.rodriguez@bbk.ac.uk", beltRank: "green", subscriptionStatus: "active", subscriptionTier: "premium", totalSessions: 89, lastAttended: Date.now() - 3 * 24 * 60 * 60 * 1000, joinDate: Date.now() - 240 * 24 * 60 * 60 * 1000 },
  { _id: "6", name: "Mohammed Hassan", email: "m.hassan@bbk.ac.uk", beltRank: "brown", subscriptionStatus: "active", subscriptionTier: "premium", totalSessions: 156, lastAttended: Date.now() - 2 * 24 * 60 * 60 * 1000, joinDate: Date.now() - 365 * 24 * 60 * 60 * 1000 },
  { _id: "7", name: "Lucy Taylor", email: "l.taylor@bbk.ac.uk", beltRank: "white", subscriptionStatus: "inactive", subscriptionTier: "student", totalSessions: 3, lastAttended: Date.now() - 30 * 24 * 60 * 60 * 1000, joinDate: Date.now() - 45 * 24 * 60 * 60 * 1000 },
  { _id: "8", name: "Yuki Tanaka", email: "y.tanaka@bbk.ac.uk", beltRank: "black", subscriptionStatus: "active", subscriptionTier: "premium", totalSessions: 312, lastAttended: Date.now() - 1 * 24 * 60 * 60 * 1000, joinDate: Date.now() - 730 * 24 * 60 * 60 * 1000 },
];

const mockRecentPayments = [
  { _id: "1", memberName: "Alice Chen", amount: 4000, date: Date.now() - 2 * 24 * 60 * 60 * 1000, status: "completed", type: "subscription" },
  { _id: "2", memberName: "Raj Patel", amount: 2500, date: Date.now() - 5 * 24 * 60 * 60 * 1000, status: "completed", type: "subscription" },
  { _id: "3", memberName: "Sofia Rodriguez", amount: 6000, date: Date.now() - 7 * 24 * 60 * 60 * 1000, status: "completed", type: "subscription" },
  { _id: "4", memberName: "George Thompson", amount: 1000, date: Date.now() - 8 * 24 * 60 * 60 * 1000, status: "completed", type: "session" },
  { _id: "5", memberName: "Mohammed Hassan", amount: 6000, date: Date.now() - 10 * 24 * 60 * 60 * 1000, status: "completed", type: "subscription" },
];

// Mock trend data for sparklines (last 7 days)
const mockTrendData = {
  members: [5, 6, 6, 7, 7, 8, 8],
  revenue: [280, 320, 290, 340, 380, 365, 390],
  attendance: [15, 18, 14, 20, 17, 19, 18],
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

const STATUS_COLORS: Record<string, string> = {
  active: "bg-green-100 text-green-800 border-green-200",
  inactive: "bg-red-100 text-red-800 border-red-200",
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
};

type SortField = "name" | "beltRank" | "subscriptionTier" | "totalSessions" | "lastAttended";
type SortDirection = "asc" | "desc";

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
  hidden: { scale: 0.95, opacity: 0, y: 20 },
  visible: {
    scale: 1,
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 15,
    },
  },
};

// Animated counter component
function AnimatedCounter({ value, duration = 0.8, prefix = "", suffix = "" }: { value: number; duration?: number; prefix?: string; suffix?: string }) {
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

  return <span>{prefix}{displayValue}{suffix}</span>;
}

// Sparkline component
function Sparkline({ data, color = "text-primary", height = 40 }: { data: number[]; color?: string; height?: number }) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * 100;
    const y = ((max - value) / range) * height;
    return `${x},${y}`;
  }).join(" ");

  return (
    <svg viewBox={`0 0 100 ${height}`} className={`w-full h-${height / 4} ${color}`} preserveAspectRatio="none">
      <motion.polyline
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      />
    </svg>
  );
}

// Trend indicator component
function TrendIndicator({ value, isPositive }: { value: number; isPositive: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className={`flex items-center gap-1 text-sm font-medium ${
        isPositive ? "text-green-600" : "text-red-600"
      }`}
    >
      {isPositive ? (
        <ArrowUpRight className="h-4 w-4" />
      ) : (
        <ArrowDownRight className="h-4 w-4" />
      )}
      <span>{isPositive ? "+" : ""}{value}%</span>
    </motion.div>
  );
}

// KPI Card with trend and sparkline
function KPICard({
  icon: Icon,
  iconColor,
  gradient,
  title,
  value,
  subtitle,
  trend,
  sparklineData,
  sparklineColor,
}: {
  icon: typeof Users;
  iconColor: string;
  gradient: string;
  title: string;
  value: number | string;
  subtitle: string;
  trend?: { value: number; isPositive: boolean };
  sparklineData?: number[];
  sparklineColor?: string;
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
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
            <span className="flex items-center gap-2">
              <motion.div
                animate={{ rotate: isHovered ? 360 : 0 }}
                transition={{ duration: 0.5 }}
              >
                <Icon className={`h-4 w-4 ${iconColor}`} />
              </motion.div>
              {title}
            </span>
            {trend && <TrendIndicator value={trend.value} isPositive={trend.isPositive} />}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className="text-2xl font-bold">
              {typeof value === "number" ? <AnimatedCounter value={value} /> : value}
            </p>
            <p className="text-sm text-muted-foreground">{subtitle}</p>
            {sparklineData && (
              <div className="pt-2">
                <Sparkline data={sparklineData} color={sparklineColor} />
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Sortable table header
function SortableHeader({
  field,
  currentSort,
  currentDirection,
  onSort,
  children,
}: {
  field: SortField;
  currentSort: SortField;
  currentDirection: SortDirection;
  onSort: (field: SortField) => void;
  children: React.ReactNode;
}) {
  const isActive = currentSort === field;

  return (
    <th
      className="pb-3 font-medium cursor-pointer hover:text-primary transition-colors"
      onClick={() => onSort(field)}
    >
      <div className="flex items-center gap-1">
        {children}
        <span className={`transition-opacity ${isActive ? "opacity-100" : "opacity-30"}`}>
          {isActive && currentDirection === "asc" ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </span>
      </div>
    </th>
  );
}

// Quick action button
function QuickActionButton({
  icon: Icon,
  label,
  onClick,
  variant = "outline",
}: {
  icon: typeof Download;
  label: string;
  onClick: () => void;
  variant?: "outline" | "default";
}) {
  return (
    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
      <Button
        variant={variant}
        size="sm"
        onClick={onClick}
        className="flex items-center gap-2"
      >
        <Icon className="h-4 w-4" />
        {label}
      </Button>
    </motion.div>
  );
}

// Member row component
function MemberRow({ member, index }: { member: typeof mockMembers[0]; index: number }) {
  const [showActions, setShowActions] = useState(false);
  const daysSinceAttendance = Math.floor((Date.now() - member.lastAttended) / (24 * 60 * 60 * 1000));
  const isAtRisk = daysSinceAttendance > 14;

  return (
    <motion.tr
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.03 }}
      className={`border-b hover:bg-muted/50 transition-colors ${isAtRisk ? "bg-red-50/30 dark:bg-red-950/10" : ""}`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <td className="py-3">
        <div className="flex items-center gap-3">
          <motion.div
            className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
              member.subscriptionStatus === "active"
                ? "bg-primary/10 text-primary"
                : "bg-muted text-muted-foreground"
            }`}
            whileHover={{ scale: 1.1 }}
          >
            {member.name.split(" ").map(n => n[0]).join("")}
          </motion.div>
          <div>
            <p className="font-medium">{member.name}</p>
            <p className="text-sm text-muted-foreground">{member.email}</p>
          </div>
        </div>
      </td>
      <td className="py-3">
        <Badge className={BELT_COLORS[member.beltRank]}>
          {member.beltRank}
        </Badge>
      </td>
      <td className="py-3">
        <div className="flex items-center gap-2">
          <Badge className={STATUS_COLORS[member.subscriptionStatus]}>
            {member.subscriptionStatus}
          </Badge>
          <span className="text-sm text-muted-foreground capitalize">
            ({member.subscriptionTier})
          </span>
        </div>
      </td>
      <td className="py-3">
        <div className="flex items-center gap-2">
          <span className="font-medium">{member.totalSessions}</span>
          <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(member.totalSessions / 100, 1) * 100}%` }}
              transition={{ duration: 1, delay: index * 0.05 }}
            />
          </div>
        </div>
      </td>
      <td className="py-3">
        <div className={`text-sm ${isAtRisk ? "text-red-600 font-medium" : "text-muted-foreground"}`}>
          {daysSinceAttendance === 0
            ? "Today"
            : daysSinceAttendance === 1
            ? "Yesterday"
            : `${daysSinceAttendance} days ago`}
          {isAtRisk && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="ml-2 text-xs text-red-500"
            >
              At risk
            </motion.span>
          )}
        </div>
      </td>
      <td className="py-3">
        <AnimatePresence>
          {showActions ? (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="flex items-center gap-1"
            >
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Eye className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Edit className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </motion.div>
          ) : (
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          )}
        </AnimatePresence>
      </td>
    </motion.tr>
  );
}

// Payment item component
function PaymentItem({ payment, index }: { payment: typeof mockRecentPayments[0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      whileHover={{ scale: 1.01, x: 4 }}
      className="flex items-center justify-between p-4 rounded-lg border hover:border-primary/30 hover:bg-muted/50 transition-all cursor-pointer"
    >
      <div className="flex items-center gap-3">
        <motion.div
          className={`w-10 h-10 rounded-full flex items-center justify-center ${
            payment.type === "subscription"
              ? "bg-green-100 text-green-600"
              : "bg-blue-100 text-blue-600"
          }`}
          whileHover={{ rotate: 360 }}
          transition={{ duration: 0.5 }}
        >
          {payment.type === "subscription" ? (
            <CreditCard className="h-5 w-5" />
          ) : (
            <DollarSign className="h-5 w-5" />
          )}
        </motion.div>
        <div>
          <p className="font-medium">{payment.memberName}</p>
          <p className="text-sm text-muted-foreground">
            {new Date(payment.date).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </p>
        </div>
      </div>
      <div className="text-right">
        <p className="font-bold text-lg">{(payment.amount / 100).toLocaleString("en-GB", { style: "currency", currency: "GBP" })}</p>
        <Badge variant="secondary" className="capitalize">{payment.type}</Badge>
      </div>
    </motion.div>
  );
}

export default function AdminDashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState<"members" | "payments">("members");
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const filteredMembers = useMemo(() => {
    let members = mockMembers.filter(
      (m) =>
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.beltRank.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Sort members
    members.sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case "name":
          comparison = a.name.localeCompare(b.name);
          break;
        case "beltRank":
          const beltOrder = ["white", "yellow", "orange", "green", "blue", "brown", "black"];
          comparison = beltOrder.indexOf(a.beltRank) - beltOrder.indexOf(b.beltRank);
          break;
        case "subscriptionTier":
          const tierOrder = ["student", "standard", "premium"];
          comparison = tierOrder.indexOf(a.subscriptionTier) - tierOrder.indexOf(b.subscriptionTier);
          break;
        case "totalSessions":
          comparison = a.totalSessions - b.totalSessions;
          break;
        case "lastAttended":
          comparison = b.lastAttended - a.lastAttended;
          break;
      }
      return sortDirection === "asc" ? comparison : -comparison;
    });

    return members;
  }, [mockMembers, searchQuery, sortField, sortDirection]);

  const totalRevenue = mockMembers
    .filter((m) => m.subscriptionStatus === "active")
    .reduce((sum, m) => {
      const prices: Record<string, number> = { student: 2500, standard: 4000, premium: 6000 };
      return sum + (prices[m.subscriptionTier] || 0);
    }, 0);

  const activeMembers = mockMembers.filter((m) => m.subscriptionStatus === "active").length;
  const newMembersThisMonth = mockMembers.filter(m => m.joinDate > Date.now() - 30 * 24 * 60 * 60 * 1000).length;
  const avgAttendance = 18;

  const handleExportMembers = () => {
    toast.success("Exporting judoka to CSV...");
  };

  const handleExportPayments = () => {
    toast.success("Exporting payments to CSV...");
  };

  const handleEmailAll = () => {
    toast.success("Opening email composer...");
  };

  const handleGenerateReport = () => {
    toast.success("Generating monthly report...");
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto p-4 space-y-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                Dojo Admin Dashboard
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground mt-1">Manage dojo members, payments, and analytics</p>
            </div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button className="bg-gradient-to-r from-primary to-purple-600 min-h-[44px] w-full sm:w-auto touch-manipulation">
                <UserPlus className="h-4 w-4 mr-2" />
                Add Judoka
              </Button>
            </motion.div>
          </motion.div>

          {/* KPI Cards - 1 col mobile, 2 cols tablet, 4 cols desktop */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
          >
            <KPICard
              icon={Users}
              iconColor="text-blue-500"
              gradient="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-200 dark:border-blue-800"
              title="Dojo Members"
              value={mockMembers.length}
              subtitle={`${newMembersThisMonth} new this month`}
              trend={{ value: 12, isPositive: true }}
              sparklineData={mockTrendData.members}
              sparklineColor="text-blue-500"
            />

            <KPICard
              icon={CreditCard}
              iconColor="text-green-500"
              gradient="bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-200 dark:border-green-800"
              title="Active Subscriptions"
              value={activeMembers}
              subtitle={`${Math.round((activeMembers / mockMembers.length) * 100)}% of members`}
              trend={{ value: 5, isPositive: true }}
            />

            <KPICard
              icon={DollarSign}
              iconColor="text-purple-500"
              gradient="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-200 dark:border-purple-800"
              title="Monthly Revenue"
              value={`${(totalRevenue / 100).toLocaleString("en-GB", { style: "currency", currency: "GBP" })}`}
              subtitle="recurring monthly"
              trend={{ value: 8, isPositive: true }}
              sparklineData={mockTrendData.revenue}
              sparklineColor="text-purple-500"
            />

            <KPICard
              icon={Activity}
              iconColor="text-orange-500"
              gradient="bg-gradient-to-br from-orange-500/10 to-orange-600/5 border-orange-200 dark:border-orange-800"
              title="Avg Attendance"
              value={`${avgAttendance}/class`}
              subtitle="72% capacity"
              trend={{ value: 3, isPositive: true }}
              sparklineData={mockTrendData.attendance}
              sparklineColor="text-orange-500"
            />
          </motion.div>

          {/* Quick Actions - horizontal scroll on mobile */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-3 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:overflow-visible sm:flex-wrap"
          >
            <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">Quick Actions:</span>
            <QuickActionButton icon={Download} label="Export Judoka" onClick={handleExportMembers} />
            <QuickActionButton icon={FileSpreadsheet} label="Export Payments" onClick={handleExportPayments} />
            <QuickActionButton icon={Mail} label="Email All" onClick={handleEmailAll} />
            <QuickActionButton icon={BarChart3} label="Report" onClick={handleGenerateReport} />
          </motion.div>

          {/* Tab Navigation */}
          <div className="flex gap-2 border-b">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                variant={selectedTab === "members" ? "default" : "ghost"}
                onClick={() => setSelectedTab("members")}
                className="relative"
              >
                <Users className="h-4 w-4 mr-2" />
                Members
                {selectedTab === "members" && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                  />
                )}
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                variant={selectedTab === "payments" ? "default" : "ghost"}
                onClick={() => setSelectedTab("payments")}
                className="relative"
              >
                <CreditCard className="h-4 w-4 mr-2" />
                Payments
                {selectedTab === "payments" && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                  />
                )}
              </Button>
            </motion.div>
          </div>

          <AnimatePresence mode="wait">
            {selectedTab === "members" && (
              <motion.div
                key="members"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <Card className="hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                          <Users className="h-5 w-5 text-primary" />
                          Dojo Members
                          <Badge variant="secondary">{filteredMembers.length}</Badge>
                        </CardTitle>
                        <CardDescription className="text-sm">
                          Tap column headers to sort
                        </CardDescription>
                      </div>
                      <div className="relative w-full sm:w-72">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search judoka..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-9 min-h-[44px] text-base"
                        />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="px-0 sm:px-6">
                    <div className="overflow-x-auto -mx-0 sm:mx-0">
                      <table className="w-full min-w-[700px]">
                        <thead>
                          <tr className="border-b text-left">
                            <SortableHeader
                              field="name"
                              currentSort={sortField}
                              currentDirection={sortDirection}
                              onSort={handleSort}
                            >
                              Name
                            </SortableHeader>
                            <SortableHeader
                              field="beltRank"
                              currentSort={sortField}
                              currentDirection={sortDirection}
                              onSort={handleSort}
                            >
                              Belt
                            </SortableHeader>
                            <SortableHeader
                              field="subscriptionTier"
                              currentSort={sortField}
                              currentDirection={sortDirection}
                              onSort={handleSort}
                            >
                              Subscription
                            </SortableHeader>
                            <SortableHeader
                              field="totalSessions"
                              currentSort={sortField}
                              currentDirection={sortDirection}
                              onSort={handleSort}
                            >
                              Sessions
                            </SortableHeader>
                            <SortableHeader
                              field="lastAttended"
                              currentSort={sortField}
                              currentDirection={sortDirection}
                              onSort={handleSort}
                            >
                              Last Attended
                            </SortableHeader>
                            <th className="pb-3 font-medium">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredMembers.map((member, index) => (
                            <MemberRow key={member._id} member={member} index={index} />
                          ))}
                        </tbody>
                      </table>
                      {filteredMembers.length === 0 && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-center py-12"
                        >
                          <Users className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                          <p className="text-muted-foreground">No dojo members found</p>
                        </motion.div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {selectedTab === "payments" && (
              <motion.div
                key="payments"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <Card className="hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <CreditCard className="h-5 w-5 text-primary" />
                          Recent Payments
                        </CardTitle>
                        <CardDescription>Last 30 days</CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-lg px-3 py-1">
                          Total: {(mockRecentPayments.reduce((sum, p) => sum + p.amount, 0) / 100).toLocaleString("en-GB", { style: "currency", currency: "GBP" })}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {mockRecentPayments.map((payment, index) => (
                        <PaymentItem key={payment._id} payment={payment} index={index} />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* Mobile Bottom Navigation */}
        <MobileNavigation />
      </div>
    </PageTransition>
  );
}
