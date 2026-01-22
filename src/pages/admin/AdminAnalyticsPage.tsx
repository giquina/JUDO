import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/Navigation";
import MobileNavigation from "@/components/MobileNavigation";
import PageTransition from "@/components/PageTransition";
import {
  Users,
  TrendingUp,
  Calendar,
  DollarSign,
  Activity,
  Target,
  Award,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Download,
} from "lucide-react";

// Types
interface ChartDataPoint {
  label: string;
  value: number;
}

// Mock data - will be replaced with Convex queries
const mockAttendanceData: ChartDataPoint[] = [
  { label: "Mon", value: 18 },
  { label: "Tue", value: 22 },
  { label: "Wed", value: 15 },
  { label: "Thu", value: 25 },
  { label: "Fri", value: 20 },
  { label: "Sat", value: 28 },
  { label: "Sun", value: 12 },
];

const mockMonthlyGrowth: ChartDataPoint[] = [
  { label: "Aug", value: 42 },
  { label: "Sep", value: 48 },
  { label: "Oct", value: 52 },
  { label: "Nov", value: 58 },
  { label: "Dec", value: 55 },
  { label: "Jan", value: 62 },
];

const mockRevenueData: ChartDataPoint[] = [
  { label: "Aug", value: 2800 },
  { label: "Sep", value: 3200 },
  { label: "Oct", value: 3400 },
  { label: "Nov", value: 3800 },
  { label: "Dec", value: 3500 },
  { label: "Jan", value: 4200 },
];

const mockBeltDistribution = [
  { belt: "white", count: 15, color: "#f3f4f6" },
  { belt: "yellow", count: 12, color: "#fef08a" },
  { belt: "orange", count: 10, color: "#fb923c" },
  { belt: "green", count: 8, color: "#4ade80" },
  { belt: "blue", count: 6, color: "#3b82f6" },
  { belt: "brown", count: 4, color: "#92400e" },
  { belt: "black", count: 2, color: "#1f2937" },
];

const mockPopularClasses = [
  { name: "Beginners Fundamentals", day: "Monday", time: "18:00", avgAttendance: 22, capacity: 25 },
  { name: "Randori Practice", day: "Saturday", time: "10:00", avgAttendance: 28, capacity: 30 },
  { name: "Competition Training", day: "Thursday", time: "19:00", avgAttendance: 18, capacity: 20 },
  { name: "Kids Judo", day: "Wednesday", time: "16:00", avgAttendance: 15, capacity: 18 },
  { name: "Advanced Techniques", day: "Tuesday", time: "20:00", avgAttendance: 12, capacity: 15 },
];

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
            <pattern id="tatami-analytics" x="0" y="0" width="60" height="30" patternUnits="userSpaceOnUse">
              <rect width="60" height="30" fill="none" stroke="currentColor" strokeWidth="1"/>
              <line x1="30" y1="0" x2="30" y2="30" stroke="currentColor" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#tatami-analytics)" className="text-primary"/>
        </svg>
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background" />
    </div>
  );
}

// Animated counter
function AnimatedCounter({ value, prefix = "", suffix = "" }: { value: number; prefix?: string; suffix?: string }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / 800, 1);
      setDisplayValue(Math.floor(progress * value));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [value]);

  return <span>{prefix}{displayValue.toLocaleString()}{suffix}</span>;
}

// Trend indicator
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

// KPI Card component
function KPICard({
  icon: Icon,
  iconColor,
  gradient,
  title,
  value,
  subtitle,
  trend,
}: {
  icon: typeof Users;
  iconColor: string;
  gradient: string;
  title: string;
  value: number | string;
  subtitle: string;
  trend?: { value: number; isPositive: boolean };
}) {
  return (
    <motion.div variants={itemVariants} whileHover={{ scale: 1.02, y: -2 }} title={title}>
      <Card className={`${gradient} border-opacity-50 hover:shadow-lg transition-all duration-300`}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <div className={`w-10 h-10 rounded-lg bg-opacity-20 flex items-center justify-center`} style={{ backgroundColor: `${iconColor}20` }}>
              <Icon className="h-5 w-5" style={{ color: iconColor }} />
            </div>
            {trend && <TrendIndicator value={trend.value} isPositive={trend.isPositive} />}
          </div>
          <p className="text-2xl font-bold">
            {typeof value === "number" ? <AnimatedCounter value={value} /> : value}
          </p>
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Bar Chart component
function BarChart({ data, title, color = "#8b5cf6", height = 200 }: { data: ChartDataPoint[]; title: string; color?: string; height?: number }) {
  const maxValue = Math.max(...data.map((d) => d.value));

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-medium text-muted-foreground">{title}</h4>
      <div className="flex items-end justify-between gap-2" style={{ height }}>
        {data.map((item, index) => (
          <div key={item.label} className="flex-1 flex flex-col items-center gap-2">
            <motion.div
              className="w-full rounded-t-md"
              style={{ backgroundColor: color }}
              initial={{ height: 0 }}
              animate={{ height: `${(item.value / maxValue) * 100}%` }}
              transition={{ delay: index * 0.1, duration: 0.5, ease: "easeOut" }}
            />
            <span className="text-xs text-muted-foreground">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Line Chart component (using bars for simplicity)
function LineChart({ data, title, valuePrefix = "", color = "#10b981", height = 200 }: { data: ChartDataPoint[]; title: string; valuePrefix?: string; color?: string; height?: number }) {
  const maxValue = Math.max(...data.map((d) => d.value));
  const minValue = Math.min(...data.map((d) => d.value));

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-muted-foreground">{title}</h4>
        <span className="text-lg font-bold" style={{ color }}>
          {valuePrefix}{data[data.length - 1].value.toLocaleString()}
        </span>
      </div>
      <div className="relative" style={{ height }}>
        <svg className="w-full h-full" viewBox={`0 0 ${data.length * 50} ${height}`} preserveAspectRatio="none">
          {/* Line path */}
          <motion.path
            d={data.map((item, index) => {
              const x = index * 50 + 25;
              const y = height - ((item.value - minValue) / (maxValue - minValue)) * (height - 40) - 20;
              return `${index === 0 ? "M" : "L"} ${x} ${y}`;
            }).join(" ")}
            fill="none"
            stroke={color}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
          {/* Data points */}
          {data.map((item, index) => {
            const x = index * 50 + 25;
            const y = height - ((item.value - minValue) / (maxValue - minValue)) * (height - 40) - 20;
            return (
              <motion.circle
                key={index}
                cx={x}
                cy={y}
                r="5"
                fill={color}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5 + index * 0.1 }}
              />
            );
          })}
        </svg>
        {/* Labels */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-between px-2">
          {data.map((item) => (
            <span key={item.label} className="text-xs text-muted-foreground">{item.label}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

// Pie/Donut Chart for belt distribution
function BeltDistributionChart({ data }: { data: typeof mockBeltDistribution }) {
  const total = data.reduce((sum, item) => sum + item.count, 0);
  let cumulativeAngle = 0;

  return (
    <div className="flex items-center gap-6">
      <div className="relative w-40 h-40">
        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
          {data.map((item, index) => {
            const angle = (item.count / total) * 360;
            const startAngle = cumulativeAngle;
            cumulativeAngle += angle;

            const startRad = (startAngle * Math.PI) / 180;
            const endRad = ((startAngle + angle) * Math.PI) / 180;
            const largeArc = angle > 180 ? 1 : 0;

            const x1 = 50 + 40 * Math.cos(startRad);
            const y1 = 50 + 40 * Math.sin(startRad);
            const x2 = 50 + 40 * Math.cos(endRad);
            const y2 = 50 + 40 * Math.sin(endRad);

            return (
              <motion.path
                key={item.belt}
                d={`M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArc} 1 ${x2} ${y2} Z`}
                fill={item.color}
                stroke="white"
                strokeWidth="1"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              />
            );
          })}
          {/* Center hole for donut effect */}
          <circle cx="50" cy="50" r="25" className="fill-background" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <p className="text-2xl font-bold">{total}</p>
            <p className="text-xs text-muted-foreground">Total</p>
          </div>
        </div>
      </div>
      <div className="flex-1 grid grid-cols-2 gap-2">
        {data.map((item) => (
          <div key={item.belt} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color, border: item.belt === "white" ? "1px solid #d1d5db" : "none" }} />
            <span className="text-sm capitalize">{item.belt}</span>
            <span className="text-sm text-muted-foreground">({item.count})</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Popular Classes Table
function PopularClassesTable({ classes }: { classes: typeof mockPopularClasses }) {
  return (
    <div className="space-y-3">
      {classes.map((cls, index) => (
        <motion.div
          key={cls.name}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center font-bold text-primary">
              {index + 1}
            </div>
            <div>
              <p className="font-medium">{cls.name}</p>
              <p className="text-sm text-muted-foreground">{cls.day} at {cls.time}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-bold">{cls.avgAttendance}/{cls.capacity}</p>
            <div className="w-20 h-1.5 bg-muted rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-primary rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${(cls.avgAttendance / cls.capacity) * 100}%` }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
              />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

export default function AdminAnalyticsPage() {
  const [dateRange, setDateRange] = useState("30");

  // Calculate summary stats
  const totalMembers = 62;
  const avgAttendance = Math.round(mockAttendanceData.reduce((sum, d) => sum + d.value, 0) / mockAttendanceData.length);
  const monthlyRevenue = mockRevenueData[mockRevenueData.length - 1].value;
  const retentionRate = 94;

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
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=70"
                alt="Analytics dashboard"
                loading="lazy"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
            </div>

            <div className="relative p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent drop-shadow-lg">
                  Analytics Dashboard
                </h1>
                <p className="text-white/90 mt-1">Insights and performance metrics for your dojo</p>
              </div>
              <div className="flex gap-2">
                <select
                  className="h-10 px-3 rounded-md border bg-background/90 backdrop-blur text-sm"
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                >
                  <option value="7">Last 7 Days</option>
                  <option value="30">Last 30 Days</option>
                  <option value="90">Last 90 Days</option>
                  <option value="365">Last Year</option>
                </select>
                <Button variant="outline" className="bg-background/90 backdrop-blur">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </motion.div>

          {/* KPI Cards */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 lg:grid-cols-4 gap-3"
          >
            <KPICard
              icon={Users}
              iconColor="#3b82f6"
              gradient="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-200 dark:border-blue-800"
              title="Total Members"
              value={totalMembers}
              subtitle="Active judoka"
              trend={{ value: 12, isPositive: true }}
            />
            <KPICard
              icon={Activity}
              iconColor="#8b5cf6"
              gradient="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-200 dark:border-purple-800"
              title="Avg Attendance"
              value={avgAttendance}
              subtitle="Per session"
              trend={{ value: 8, isPositive: true }}
            />
            <KPICard
              icon={DollarSign}
              iconColor="#10b981"
              gradient="bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-200 dark:border-green-800"
              title="Monthly Revenue"
              value={`${(monthlyRevenue).toLocaleString("en-GB", { style: "currency", currency: "GBP" })}`}
              subtitle="This month"
              trend={{ value: 15, isPositive: true }}
            />
            <KPICard
              icon={Target}
              iconColor="#f59e0b"
              gradient="bg-gradient-to-br from-amber-500/10 to-amber-600/5 border-amber-200 dark:border-amber-800"
              title="Retention Rate"
              value={`${retentionRate}%`}
              subtitle="Member retention"
              trend={{ value: 2, isPositive: true }}
            />
          </motion.div>

          {/* Charts Row 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Weekly Attendance Chart */}
            <motion.div variants={itemVariants} initial="hidden" animate="visible">
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    Weekly Attendance
                  </CardTitle>
                  <CardDescription>Average attendance by day of week</CardDescription>
                </CardHeader>
                <CardContent>
                  <BarChart data={mockAttendanceData} title="" color="#8b5cf6" height={180} />
                </CardContent>
              </Card>
            </motion.div>

            {/* Member Growth Chart */}
            <motion.div variants={itemVariants} initial="hidden" animate="visible">
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    Member Growth
                  </CardTitle>
                  <CardDescription>Total members over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <LineChart data={mockMonthlyGrowth} title="" color="#3b82f6" height={180} />
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Charts Row 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Chart */}
            <motion.div variants={itemVariants} initial="hidden" animate="visible">
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-primary" />
                    Revenue Over Time
                  </CardTitle>
                  <CardDescription>Monthly revenue in GBP</CardDescription>
                </CardHeader>
                <CardContent>
                  <LineChart data={mockRevenueData} title="" valuePrefix="" color="#10b981" height={180} />
                </CardContent>
              </Card>
            </motion.div>

            {/* Belt Distribution */}
            <motion.div variants={itemVariants} initial="hidden" animate="visible">
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-primary" />
                    Belt Distribution
                  </CardTitle>
                  <CardDescription>Members by belt rank</CardDescription>
                </CardHeader>
                <CardContent>
                  <BeltDistributionChart data={mockBeltDistribution} />
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Popular Classes */}
          <motion.div variants={itemVariants} initial="hidden" animate="visible">
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  Popular Classes
                  <Badge variant="secondary">Top 5</Badge>
                </CardTitle>
                <CardDescription>Classes ranked by average attendance</CardDescription>
              </CardHeader>
              <CardContent>
                <PopularClassesTable classes={mockPopularClasses} />
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Stats Row */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 sm:grid-cols-4 gap-3"
          >
            <motion.div variants={itemVariants}>
              <Card className="text-center p-4">
                <p className="text-3xl font-bold text-primary">156</p>
                <p className="text-sm text-muted-foreground">Sessions This Month</p>
              </Card>
            </motion.div>
            <motion.div variants={itemVariants}>
              <Card className="text-center p-4">
                <p className="text-3xl font-bold text-green-600">8</p>
                <p className="text-sm text-muted-foreground">New Members</p>
              </Card>
            </motion.div>
            <motion.div variants={itemVariants}>
              <Card className="text-center p-4">
                <p className="text-3xl font-bold text-amber-600">4</p>
                <p className="text-sm text-muted-foreground">Gradings This Month</p>
              </Card>
            </motion.div>
            <motion.div variants={itemVariants}>
              <Card className="text-center p-4">
                <p className="text-3xl font-bold text-purple-600">72%</p>
                <p className="text-sm text-muted-foreground">Capacity Utilization</p>
              </Card>
            </motion.div>
          </motion.div>
        </main>

        <MobileNavigation />
      </div>
    </PageTransition>
  );
}
