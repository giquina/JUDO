import { useState, useMemo } from "react";
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
  CreditCard,
  Search,
  Download,
  Filter,
  DollarSign,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle,
  RefreshCw,
  X,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

// Types
interface Payment {
  _id: string;
  memberId: string;
  memberName: string;
  memberEmail: string;
  amount: number;
  currency: string;
  status: "completed" | "pending" | "failed" | "refunded";
  type: "subscription" | "session" | "grading" | "merchandise" | "event";
  description: string;
  date: number;
  paymentMethod: string;
  transactionId: string;
}

type SortField = "date" | "amount" | "memberName" | "status";
type SortDirection = "asc" | "desc";

// Mock data - will be replaced with Convex queries
const mockPayments: Payment[] = [
  { _id: "1", memberId: "1", memberName: "Alice Chen", memberEmail: "a.chen@bbk.ac.uk", amount: 4000, currency: "GBP", status: "completed", type: "subscription", description: "Monthly Standard Subscription", date: Date.now() - 2 * 24 * 60 * 60 * 1000, paymentMethod: "Visa **** 4242", transactionId: "pi_3abc123" },
  { _id: "2", memberId: "2", memberName: "Raj Patel", memberEmail: "r.patel@bbk.ac.uk", amount: 2500, currency: "GBP", status: "completed", type: "subscription", description: "Monthly Student Subscription", date: Date.now() - 5 * 24 * 60 * 60 * 1000, paymentMethod: "Mastercard **** 5555", transactionId: "pi_3def456" },
  { _id: "3", memberId: "5", memberName: "Sofia Rodriguez", memberEmail: "s.rodriguez@bbk.ac.uk", amount: 6000, currency: "GBP", status: "completed", type: "subscription", description: "Monthly Premium Subscription", date: Date.now() - 7 * 24 * 60 * 60 * 1000, paymentMethod: "Visa **** 1234", transactionId: "pi_3ghi789" },
  { _id: "4", memberId: "4", memberName: "James O'Brien", memberEmail: "j.obrien@bbk.ac.uk", amount: 1000, currency: "GBP", status: "completed", type: "session", description: "Drop-in Session", date: Date.now() - 8 * 24 * 60 * 60 * 1000, paymentMethod: "Apple Pay", transactionId: "pi_3jkl012" },
  { _id: "5", memberId: "6", memberName: "Mohammed Hassan", memberEmail: "m.hassan@bbk.ac.uk", amount: 6000, currency: "GBP", status: "completed", type: "subscription", description: "Monthly Premium Subscription", date: Date.now() - 10 * 24 * 60 * 60 * 1000, paymentMethod: "Visa **** 9876", transactionId: "pi_3mno345" },
  { _id: "6", memberId: "8", memberName: "Yuki Tanaka", memberEmail: "y.tanaka@bbk.ac.uk", amount: 3500, currency: "GBP", status: "completed", type: "grading", description: "1st Dan Grading Fee", date: Date.now() - 12 * 24 * 60 * 60 * 1000, paymentMethod: "Bank Transfer", transactionId: "bt_3pqr678" },
  { _id: "7", memberId: "3", memberName: "Emma Williams", memberEmail: "e.williams@bbk.ac.uk", amount: 2500, currency: "GBP", status: "pending", type: "subscription", description: "Monthly Student Subscription", date: Date.now() - 1 * 24 * 60 * 60 * 1000, paymentMethod: "Direct Debit", transactionId: "dd_3stu901" },
  { _id: "8", memberId: "7", memberName: "Lucy Taylor", memberEmail: "l.taylor@bbk.ac.uk", amount: 2500, currency: "GBP", status: "failed", type: "subscription", description: "Monthly Student Subscription - Retry", date: Date.now() - 3 * 24 * 60 * 60 * 1000, paymentMethod: "Visa **** 4444", transactionId: "pi_3vwx234" },
  { _id: "9", memberId: "10", memberName: "Aisha Khan", memberEmail: "a.khan@bbk.ac.uk", amount: 2500, currency: "GBP", status: "completed", type: "subscription", description: "Monthly Student Subscription", date: Date.now() - 15 * 24 * 60 * 60 * 1000, paymentMethod: "Google Pay", transactionId: "pi_3yza567" },
  { _id: "10", memberId: "1", memberName: "Alice Chen", memberEmail: "a.chen@bbk.ac.uk", amount: 2000, currency: "GBP", status: "refunded", type: "merchandise", description: "Judo Gi - Refund processed", date: Date.now() - 20 * 24 * 60 * 60 * 1000, paymentMethod: "Visa **** 4242", transactionId: "pi_3bcd890" },
  { _id: "11", memberId: "5", memberName: "Sofia Rodriguez", memberEmail: "s.rodriguez@bbk.ac.uk", amount: 5000, currency: "GBP", status: "completed", type: "event", description: "National Tournament Entry", date: Date.now() - 25 * 24 * 60 * 60 * 1000, paymentMethod: "Visa **** 1234", transactionId: "pi_3efg123" },
  { _id: "12", memberId: "6", memberName: "Mohammed Hassan", memberEmail: "m.hassan@bbk.ac.uk", amount: 6000, currency: "GBP", status: "completed", type: "subscription", description: "Monthly Premium Subscription", date: Date.now() - 40 * 24 * 60 * 60 * 1000, paymentMethod: "Visa **** 9876", transactionId: "pi_3hij456" },
];

const STATUS_CONFIG: Record<string, { color: string; icon: typeof CheckCircle; label: string }> = {
  completed: { color: "bg-green-100 text-green-800 border-green-200", icon: CheckCircle, label: "Completed" },
  pending: { color: "bg-yellow-100 text-yellow-800 border-yellow-200", icon: Clock, label: "Pending" },
  failed: { color: "bg-red-100 text-red-800 border-red-200", icon: XCircle, label: "Failed" },
  refunded: { color: "bg-gray-100 text-gray-800 border-gray-200", icon: RefreshCw, label: "Refunded" },
};

const TYPE_COLORS: Record<string, string> = {
  subscription: "bg-purple-100 text-purple-800",
  session: "bg-blue-100 text-blue-800",
  grading: "bg-amber-100 text-amber-800",
  merchandise: "bg-pink-100 text-pink-800",
  event: "bg-teal-100 text-teal-800",
};

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
            <pattern id="tatami-payments" x="0" y="0" width="60" height="30" patternUnits="userSpaceOnUse">
              <rect width="60" height="30" fill="none" stroke="currentColor" strokeWidth="1"/>
              <line x1="30" y1="0" x2="30" y2="30" stroke="currentColor" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#tatami-payments)" className="text-primary"/>
        </svg>
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background" />
    </div>
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
      {isPositive ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
      <span>{isPositive ? "+" : ""}{value}%</span>
    </motion.div>
  );
}

// Stat card component
function StatCard({
  icon: Icon,
  iconColor,
  gradient,
  title,
  value,
  subtitle,
  trend,
}: {
  icon: typeof DollarSign;
  iconColor: string;
  gradient: string;
  title: string;
  value: string;
  subtitle: string;
  trend?: { value: number; isPositive: boolean };
}) {
  return (
    <motion.div variants={itemVariants} whileHover={{ scale: 1.02, y: -2 }} title={title}>
      <Card className={`${gradient} border-opacity-50 hover:shadow-lg transition-all duration-300`}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <div className={`w-10 h-10 rounded-lg ${iconColor} bg-opacity-20 flex items-center justify-center`}>
              <Icon className={`h-5 w-5 ${iconColor.replace("bg-", "text-")}`} />
            </div>
            {trend && <TrendIndicator value={trend.value} isPositive={trend.isPositive} />}
          </div>
          <p className="text-2xl font-bold">{value}</p>
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Payment row component
function PaymentRow({ payment, index }: { payment: Payment; index: number }) {
  const StatusIcon = STATUS_CONFIG[payment.status].icon;

  return (
    <motion.tr
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.02 }}
      className="border-b hover:bg-muted/50 transition-colors"
    >
      <td className="py-3 px-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-semibold text-primary">
            {payment.memberName.split(" ").map(n => n[0]).join("")}
          </div>
          <div>
            <p className="font-medium">{payment.memberName}</p>
            <p className="text-sm text-muted-foreground">{payment.memberEmail}</p>
          </div>
        </div>
      </td>
      <td className="py-3 px-3">
        <Badge className={TYPE_COLORS[payment.type]} variant="secondary">
          {payment.type}
        </Badge>
      </td>
      <td className="py-3 px-3">
        <p className="font-medium text-sm">{payment.description}</p>
        <p className="text-xs text-muted-foreground">{payment.paymentMethod}</p>
      </td>
      <td className="py-3 px-3 text-right">
        <p className={`font-bold ${payment.status === "refunded" ? "text-muted-foreground line-through" : ""}`}>
          {(payment.amount / 100).toLocaleString("en-GB", { style: "currency", currency: payment.currency })}
        </p>
      </td>
      <td className="py-3 px-3">
        <Badge className={STATUS_CONFIG[payment.status].color}>
          <StatusIcon className="h-3 w-3 mr-1" />
          {STATUS_CONFIG[payment.status].label}
        </Badge>
      </td>
      <td className="py-3 px-3 text-sm text-muted-foreground whitespace-nowrap">
        {new Date(payment.date).toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })}
      </td>
      <td className="py-3 px-3">
        <Button variant="ghost" size="sm" onClick={() => toast.info(`Transaction ID: ${payment.transactionId}`)}>
          View
        </Button>
      </td>
    </motion.tr>
  );
}

// Filter panel
function FilterPanel({
  filters,
  onFilterChange,
  onClose,
}: {
  filters: { status: string; type: string; dateRange: string };
  onFilterChange: (key: string, value: string) => void;
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="p-4 bg-muted/50 rounded-lg border mb-4"
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-medium flex items-center gap-2">
          <Filter className="h-4 w-4" />
          Filters
        </h3>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="text-sm font-medium mb-1 block">Status</label>
          <select
            className="w-full h-10 px-3 rounded-md border bg-background text-sm"
            value={filters.status}
            onChange={(e) => onFilterChange("status", e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
            <option value="refunded">Refunded</option>
          </select>
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">Type</label>
          <select
            className="w-full h-10 px-3 rounded-md border bg-background text-sm"
            value={filters.type}
            onChange={(e) => onFilterChange("type", e.target.value)}
          >
            <option value="">All Types</option>
            <option value="subscription">Subscription</option>
            <option value="session">Session</option>
            <option value="grading">Grading</option>
            <option value="merchandise">Merchandise</option>
            <option value="event">Event</option>
          </select>
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">Date Range</label>
          <select
            className="w-full h-10 px-3 rounded-md border bg-background text-sm"
            value={filters.dateRange}
            onChange={(e) => onFilterChange("dateRange", e.target.value)}
          >
            <option value="">All Time</option>
            <option value="7">Last 7 Days</option>
            <option value="30">Last 30 Days</option>
            <option value="90">Last 90 Days</option>
          </select>
        </div>
      </div>
    </motion.div>
  );
}

// Alerts card component
function AlertsCard({ pendingCount, failedCount }: { pendingCount: number; failedCount: number }) {
  if (pendingCount === 0 && failedCount === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card className="border-orange-200 bg-orange-50/50 dark:bg-orange-950/20 dark:border-orange-800">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-orange-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-orange-800 dark:text-orange-200">Payment Alerts</h3>
              <div className="mt-2 space-y-1">
                {pendingCount > 0 && (
                  <p className="text-sm text-orange-700 dark:text-orange-300">
                    {pendingCount} payment{pendingCount > 1 ? "s" : ""} pending processing
                  </p>
                )}
                {failedCount > 0 && (
                  <p className="text-sm text-red-600 dark:text-red-400">
                    {failedCount} payment{failedCount > 1 ? "s" : ""} failed - action required
                  </p>
                )}
              </div>
            </div>
            <Button variant="outline" size="sm" className="border-orange-300 text-orange-700 hover:bg-orange-100">
              Review
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function AdminPaymentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField] = useState<SortField>("date");
  const [sortDirection] = useState<SortDirection>("desc");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    status: "",
    type: "",
    dateRange: "",
  });

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const filteredPayments = useMemo(() => {
    let payments = mockPayments.filter((p) => {
      const matchesSearch =
        p.memberName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.memberEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.transactionId.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = !filters.status || p.status === filters.status;
      const matchesType = !filters.type || p.type === filters.type;
      const matchesDate = !filters.dateRange || p.date > Date.now() - parseInt(filters.dateRange) * 24 * 60 * 60 * 1000;

      return matchesSearch && matchesStatus && matchesType && matchesDate;
    });

    payments.sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case "date":
          comparison = a.date - b.date;
          break;
        case "amount":
          comparison = a.amount - b.amount;
          break;
        case "memberName":
          comparison = a.memberName.localeCompare(b.memberName);
          break;
        case "status":
          comparison = a.status.localeCompare(b.status);
          break;
      }
      return sortDirection === "asc" ? comparison : -comparison;
    });

    return payments;
  }, [searchQuery, sortField, sortDirection, filters]);

  // Calculate stats
  const totalRevenue = mockPayments
    .filter((p) => p.status === "completed")
    .reduce((sum, p) => sum + p.amount, 0);
  const monthlyRevenue = mockPayments
    .filter((p) => p.status === "completed" && p.date > Date.now() - 30 * 24 * 60 * 60 * 1000)
    .reduce((sum, p) => sum + p.amount, 0);
  const pendingCount = mockPayments.filter((p) => p.status === "pending").length;
  const failedCount = mockPayments.filter((p) => p.status === "failed").length;
  const subscriptionRevenue = mockPayments
    .filter((p) => p.status === "completed" && p.type === "subscription" && p.date > Date.now() - 30 * 24 * 60 * 60 * 1000)
    .reduce((sum, p) => sum + p.amount, 0);

  const handleExportPayments = () => {
    toast.success("Exporting payments to CSV...");
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
                src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1200&q=70"
                alt="Financial dashboard"
                loading="lazy"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
            </div>

            <div className="relative p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent drop-shadow-lg">
                  Payment Management
                </h1>
                <p className="text-white/90 mt-1">Track revenue, subscriptions, and payment history</p>
              </div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  className="bg-gradient-to-r from-primary to-purple-600 min-h-[44px]"
                  onClick={handleExportPayments}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export Payments
                </Button>
              </motion.div>
            </div>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 lg:grid-cols-4 gap-3"
          >
            <StatCard
              icon={DollarSign}
              iconColor="bg-green-500"
              gradient="bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-200 dark:border-green-800"
              title="Total Revenue"
              value={(totalRevenue / 100).toLocaleString("en-GB", { style: "currency", currency: "GBP" })}
              subtitle="All time"
              trend={{ value: 15, isPositive: true }}
            />
            <StatCard
              icon={TrendingUp}
              iconColor="bg-purple-500"
              gradient="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-200 dark:border-purple-800"
              title="Monthly Revenue"
              value={(monthlyRevenue / 100).toLocaleString("en-GB", { style: "currency", currency: "GBP" })}
              subtitle="Last 30 days"
              trend={{ value: 8, isPositive: true }}
            />
            <StatCard
              icon={CreditCard}
              iconColor="bg-blue-500"
              gradient="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-200 dark:border-blue-800"
              title="Subscriptions"
              value={(subscriptionRevenue / 100).toLocaleString("en-GB", { style: "currency", currency: "GBP" })}
              subtitle="Monthly recurring"
            />
            <StatCard
              icon={Clock}
              iconColor="bg-orange-500"
              gradient="bg-gradient-to-br from-orange-500/10 to-orange-600/5 border-orange-200 dark:border-orange-800"
              title="Pending"
              value={pendingCount.toString()}
              subtitle="Awaiting processing"
            />
          </motion.div>

          {/* Alerts */}
          <AlertsCard pendingCount={pendingCount} failedCount={failedCount} />

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-3 overflow-x-auto pb-2"
          >
            <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">Quick Actions:</span>
            <Button variant="outline" size="sm" onClick={handleExportPayments}>
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
            <Button variant="outline" size="sm" onClick={() => toast.info("Opening Stripe Dashboard...")}>
              <CreditCard className="h-4 w-4 mr-2" />
              Stripe Dashboard
            </Button>
            <Button
              variant={showFilters ? "default" : "outline"}
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </motion.div>

          {/* Filter Panel */}
          <AnimatePresence>
            {showFilters && (
              <FilterPanel
                filters={filters}
                onFilterChange={handleFilterChange}
                onClose={() => setShowFilters(false)}
              />
            )}
          </AnimatePresence>

          {/* Payments Table */}
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                    <CreditCard className="h-5 w-5 text-primary" />
                    Payment History
                    <Badge variant="secondary">{filteredPayments.length}</Badge>
                  </CardTitle>
                  <CardDescription>
                    All transactions and payments
                  </CardDescription>
                </div>
                <div className="relative w-full sm:w-72">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search payments..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 min-h-[44px] text-base"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="px-0 sm:px-6">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[900px]">
                  <thead>
                    <tr className="border-b text-left">
                      <th className="pb-3 px-3 font-medium">Member</th>
                      <th className="pb-3 px-3 font-medium">Type</th>
                      <th className="pb-3 px-3 font-medium">Description</th>
                      <th className="pb-3 px-3 font-medium text-right">Amount</th>
                      <th className="pb-3 px-3 font-medium">Status</th>
                      <th className="pb-3 px-3 font-medium">Date</th>
                      <th className="pb-3 px-3 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPayments.map((payment, index) => (
                      <PaymentRow key={payment._id} payment={payment} index={index} />
                    ))}
                  </tbody>
                </table>
                {filteredPayments.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-12"
                  >
                    <CreditCard className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                    <p className="text-muted-foreground">No payments found</p>
                    <p className="text-sm text-muted-foreground mt-1">Try adjusting your search or filters</p>
                  </motion.div>
                )}
              </div>
            </CardContent>
          </Card>
        </main>

        <MobileNavigation />
      </div>
    </PageTransition>
  );
}
