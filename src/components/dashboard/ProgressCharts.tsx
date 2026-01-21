import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Download, Calendar, TrendingUp, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { attendanceData, classTypeData, weeklyHeatmapData } from "@/lib/mockProgressData";
import { cn } from "@/lib/utils";

type DateRange = "7d" | "30d" | "90d" | "180d" | "all";

export function ProgressCharts() {
  const [dateRange, setDateRange] = useState<DateRange>("90d");

  const filteredAttendanceData = useMemo(() => {
    const today = new Date();
    let daysBack = 180;

    switch (dateRange) {
      case "7d":
        daysBack = 7;
        break;
      case "30d":
        daysBack = 30;
        break;
      case "90d":
        daysBack = 90;
        break;
      case "180d":
        daysBack = 180;
        break;
      case "all":
        return attendanceData;
    }

    const cutoffDate = new Date(today);
    cutoffDate.setDate(cutoffDate.getDate() - daysBack);

    return attendanceData.filter((d) => new Date(d.date) >= cutoffDate);
  }, [dateRange]);

  // Monthly aggregated data
  const monthlyData = useMemo(() => {
    const months: Record<string, { month: string; classes: number; hours: number }> = {};

    attendanceData.forEach((d) => {
      const date = new Date(d.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      const monthName = date.toLocaleDateString("en-GB", { month: "short", year: "numeric" });

      if (!months[monthKey]) {
        months[monthKey] = { month: monthName, classes: 0, hours: 0 };
      }

      months[monthKey].classes += d.classes;
      months[monthKey].hours += d.hours;
    });

    return Object.values(months).slice(-6); // Last 6 months
  }, []);

  // Weekly aggregated data
  const weeklyData = useMemo(() => {
    const weeks: Record<string, { week: string; classes: number; hours: number }> = {};

    filteredAttendanceData.forEach((d) => {
      const date = new Date(d.date);
      const weekStart = new Date(date);
      weekStart.setDate(date.getDate() - date.getDay());
      const weekKey = weekStart.toISOString().split("T")[0];
      const weekLabel = `Week ${weekStart.toLocaleDateString("en-GB", { month: "short", day: "numeric" })}`;

      if (!weeks[weekKey]) {
        weeks[weekKey] = { week: weekLabel, classes: 0, hours: 0 };
      }

      weeks[weekKey].classes += d.classes;
      weeks[weekKey].hours += d.hours;
    });

    return Object.values(weeks);
  }, [filteredAttendanceData]);

  // Year-over-year comparison
  const yearOverYearData = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const lastYear = currentYear - 1;

    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    return months.map((month, index) => {
      const currentYearHours = attendanceData
        .filter((d) => {
          const date = new Date(d.date);
          return date.getFullYear() === currentYear && date.getMonth() === index;
        })
        .reduce((sum, d) => sum + d.hours, 0);

      const lastYearHours = attendanceData
        .filter((d) => {
          const date = new Date(d.date);
          return date.getFullYear() === lastYear && date.getMonth() === index;
        })
        .reduce((sum, d) => sum + d.hours, 0);

      return {
        month,
        [currentYear.toString()]: currentYearHours,
        [lastYear.toString()]: lastYearHours,
      };
    });
  }, []);

  const handleExportChart = (chartName: string) => {
    // In a real app, this would export the chart as an image
    console.log(`Exporting ${chartName}...`);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
          <p className="font-semibold mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Header with Date Range Selector */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Progress Analytics</h2>
          <p className="text-muted-foreground mt-1">Track your training journey with detailed insights</p>
        </div>
        <Select value={dateRange} onValueChange={(value) => setDateRange(value as DateRange)}>
          <SelectTrigger className="w-[180px]">
            <Calendar className="w-4 h-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
            <SelectItem value="180d">Last 6 months</SelectItem>
            <SelectItem value="all">All time</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Attendance Over Time - Line Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary" />
                Attendance Over Time
              </h3>
              <p className="text-sm text-muted-foreground mt-1">Daily training activity</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExportChart("attendance-timeline")}
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={filteredAttendanceData}>
              <defs>
                <linearGradient id="colorClasses" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="date"
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString("en-GB", { month: "short", day: "numeric" });
                }}
                className="text-xs"
              />
              <YAxis className="text-xs" />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Area
                type="monotone"
                dataKey="classes"
                stroke="hsl(var(--primary))"
                fillOpacity={1}
                fill="url(#colorClasses)"
                name="Classes"
              />
              <Area
                type="monotone"
                dataKey="hours"
                stroke="#8b5cf6"
                fillOpacity={1}
                fill="url(#colorHours)"
                name="Hours"
              />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Classes by Type - Pie Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold">Classes by Type</h3>
                <p className="text-sm text-muted-foreground mt-1">Distribution of training sessions</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExportChart("class-types")}
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>

            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={classTypeData as any}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry: any) => `${entry.type}: ${entry.count}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {classTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>

            <div className="grid grid-cols-2 gap-2 mt-4">
              {classTypeData.map((item) => (
                <div key={item.type} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm">
                    {item.type} ({item.count})
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Weekly Comparison - Bar Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold">Weekly Activity</h3>
                <p className="text-sm text-muted-foreground mt-1">Classes and hours per week</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExportChart("weekly-activity")}
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>

            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="week" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar
                  dataKey="classes"
                  fill="hsl(var(--primary))"
                  radius={[8, 8, 0, 0]}
                  name="Classes"
                />
                <Bar dataKey="hours" fill="#8b5cf6" radius={[8, 8, 0, 0]} name="Hours" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>
      </div>

      {/* Monthly Comparison - Line Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-500" />
                Monthly Trends
              </h3>
              <p className="text-sm text-muted-foreground mt-1">Last 6 months overview</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExportChart("monthly-trends")}
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="month" className="text-xs" />
              <YAxis className="text-xs" />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line
                type="monotone"
                dataKey="classes"
                stroke="hsl(var(--primary))"
                strokeWidth={3}
                dot={{ r: 6 }}
                activeDot={{ r: 8 }}
                name="Classes"
              />
              <Line
                type="monotone"
                dataKey="hours"
                stroke="#8b5cf6"
                strokeWidth={3}
                dot={{ r: 6 }}
                activeDot={{ r: 8 }}
                name="Hours"
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </motion.div>

      {/* Year-over-Year Growth */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold">Year-over-Year Comparison</h3>
              <p className="text-sm text-muted-foreground mt-1">Training hours by month</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExportChart("year-over-year")}
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={yearOverYearData}>
              <defs>
                <linearGradient id="currentYear" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.9} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.6} />
                </linearGradient>
                <linearGradient id="lastYear" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.9} />
                  <stop offset="95%" stopColor="#94a3b8" stopOpacity={0.6} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="month" className="text-xs" />
              <YAxis className="text-xs" />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar
                dataKey={new Date().getFullYear().toString()}
                fill="url(#currentYear)"
                radius={[8, 8, 0, 0]}
                name={new Date().getFullYear().toString()}
              />
              <Bar
                dataKey={(new Date().getFullYear() - 1).toString()}
                fill="url(#lastYear)"
                radius={[8, 8, 0, 0]}
                name={(new Date().getFullYear() - 1).toString()}
              />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </motion.div>

      {/* Weekly Heatmap */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold">Weekly Activity Heatmap</h3>
              <p className="text-sm text-muted-foreground mt-1">Training patterns over the last 12 weeks</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <div className="inline-block min-w-full">
              <div className="flex gap-1">
                <div className="flex flex-col gap-1 justify-end pb-6">
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                    <div
                      key={day}
                      className="h-8 flex items-center text-xs text-muted-foreground w-12"
                    >
                      {day}
                    </div>
                  ))}
                </div>

                {Array.from({ length: 12 }, (_, weekIndex) => (
                  <div key={weekIndex} className="flex flex-col gap-1">
                    <div className="text-xs text-muted-foreground mb-1 h-5 flex items-center justify-center">
                      W{12 - weekIndex}
                    </div>
                    {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => {
                      const dataPoint = weeklyHeatmapData.find(
                        (d) => d.week === `W${12 - weekIndex}` && d.day === day
                      );
                      const value = dataPoint?.value || 0;

                      return (
                        <motion.div
                          key={`${weekIndex}-${day}`}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: weekIndex * 0.05 }}
                          className={cn(
                            "w-8 h-8 rounded-sm transition-all cursor-pointer hover:ring-2 hover:ring-primary",
                            value === 0 && "bg-muted",
                            value === 1 && "bg-primary/30",
                            value === 2 && "bg-primary/60",
                            value >= 3 && "bg-primary"
                          )}
                          title={`${day} W${12 - weekIndex}: ${value} classes`}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2 mt-4 text-xs text-muted-foreground">
                <span>Less</span>
                <div className="flex gap-1">
                  <div className="w-4 h-4 rounded-sm bg-muted" />
                  <div className="w-4 h-4 rounded-sm bg-primary/30" />
                  <div className="w-4 h-4 rounded-sm bg-primary/60" />
                  <div className="w-4 h-4 rounded-sm bg-primary" />
                </div>
                <span>More</span>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
