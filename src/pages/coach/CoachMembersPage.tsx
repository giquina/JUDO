import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import Navigation from "@/components/Navigation";
import MobileNavigation from "@/components/MobileNavigation";
import CoachSidebar from "@/components/CoachSidebar";
import PageTransition from "@/components/PageTransition";
import DashboardWrapper from "@/components/DashboardWrapper";
import {
  Users,
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  Eye,
  TrendingUp,
  TrendingDown,
  Calendar,
  Award,
  Clock,
  BarChart3,
  UserCheck,
} from "lucide-react";

// Mock data - will be replaced with Convex queries
const mockMembers = [
  {
    _id: "m1",
    name: "Alice Chen",
    email: "a.chen@bbk.ac.uk",
    beltRank: "blue",
    joinDate: Date.now() - 365 * 24 * 60 * 60 * 1000,
    totalSessions: 87,
    attendanceRate: 92,
    lastAttended: Date.now() - 2 * 24 * 60 * 60 * 1000,
    streak: 12,
  },
  {
    _id: "m2",
    name: "Raj Patel",
    email: "r.patel@bbk.ac.uk",
    beltRank: "white",
    joinDate: Date.now() - 60 * 24 * 60 * 60 * 1000,
    totalSessions: 15,
    attendanceRate: 78,
    lastAttended: Date.now() - 5 * 24 * 60 * 60 * 1000,
    streak: 3,
  },
  {
    _id: "m3",
    name: "Emma Williams",
    email: "e.williams@bbk.ac.uk",
    beltRank: "yellow",
    joinDate: Date.now() - 180 * 24 * 60 * 60 * 1000,
    totalSessions: 42,
    attendanceRate: 85,
    lastAttended: Date.now() - 1 * 24 * 60 * 60 * 1000,
    streak: 8,
  },
  {
    _id: "m4",
    name: "James O'Brien",
    email: "j.obrien@bbk.ac.uk",
    beltRank: "orange",
    joinDate: Date.now() - 240 * 24 * 60 * 60 * 1000,
    totalSessions: 56,
    attendanceRate: 75,
    lastAttended: Date.now() - 7 * 24 * 60 * 60 * 1000,
    streak: 0,
  },
  {
    _id: "m5",
    name: "Sofia Rodriguez",
    email: "s.rodriguez@bbk.ac.uk",
    beltRank: "green",
    joinDate: Date.now() - 300 * 24 * 60 * 60 * 1000,
    totalSessions: 68,
    attendanceRate: 88,
    lastAttended: Date.now() - 3 * 24 * 60 * 60 * 1000,
    streak: 5,
  },
  {
    _id: "m6",
    name: "Mohammed Hassan",
    email: "m.hassan@bbk.ac.uk",
    beltRank: "brown",
    joinDate: Date.now() - 730 * 24 * 60 * 60 * 1000,
    totalSessions: 156,
    attendanceRate: 95,
    lastAttended: Date.now() - 1 * 24 * 60 * 60 * 1000,
    streak: 24,
  },
  {
    _id: "m7",
    name: "Lucy Taylor",
    email: "l.taylor@bbk.ac.uk",
    beltRank: "white",
    joinDate: Date.now() - 30 * 24 * 60 * 60 * 1000,
    totalSessions: 8,
    attendanceRate: 67,
    lastAttended: Date.now() - 14 * 24 * 60 * 60 * 1000,
    streak: 0,
  },
  {
    _id: "m8",
    name: "Yuki Tanaka",
    email: "y.tanaka@bbk.ac.uk",
    beltRank: "black",
    joinDate: Date.now() - 1095 * 24 * 60 * 60 * 1000,
    totalSessions: 245,
    attendanceRate: 98,
    lastAttended: Date.now(),
    streak: 52,
  },
  {
    _id: "m9",
    name: "David Kim",
    email: "d.kim@bbk.ac.uk",
    beltRank: "blue",
    joinDate: Date.now() - 400 * 24 * 60 * 60 * 1000,
    totalSessions: 92,
    attendanceRate: 82,
    lastAttended: Date.now() - 4 * 24 * 60 * 60 * 1000,
    streak: 6,
  },
  {
    _id: "m10",
    name: "Sarah Johnson",
    email: "s.johnson@bbk.ac.uk",
    beltRank: "green",
    joinDate: Date.now() - 280 * 24 * 60 * 60 * 1000,
    totalSessions: 61,
    attendanceRate: 79,
    lastAttended: Date.now() - 6 * 24 * 60 * 60 * 1000,
    streak: 2,
  },
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

const BELT_ORDER = ["white", "yellow", "orange", "green", "blue", "brown", "black"];

type SortField = "name" | "beltRank" | "totalSessions" | "attendanceRate" | "lastAttended";
type SortDirection = "asc" | "desc";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

// Dojo background pattern
function DojoBackgroundPattern() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.04]">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="tatami-members" x="0" y="0" width="60" height="30" patternUnits="userSpaceOnUse">
              <rect width="60" height="30" fill="none" stroke="currentColor" strokeWidth="1"/>
              <line x1="30" y1="0" x2="30" y2="30" stroke="currentColor" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#tatami-members)" className="text-primary"/>
        </svg>
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background" />
    </div>
  );
}

// Sortable header component
function SortableHeader({
  field,
  currentSort,
  currentDirection,
  onSort,
  children,
  className = "",
}: {
  field: SortField;
  currentSort: SortField;
  currentDirection: SortDirection;
  onSort: (field: SortField) => void;
  children: React.ReactNode;
  className?: string;
}) {
  const isActive = currentSort === field;

  return (
    <button
      onClick={() => onSort(field)}
      className={`flex items-center gap-1 font-medium text-sm hover:text-primary transition-colors ${className}`}
    >
      {children}
      <span className={`transition-opacity ${isActive ? "opacity-100" : "opacity-30"}`}>
        {isActive && currentDirection === "asc" ? (
          <ChevronUp className="h-4 w-4" />
        ) : (
          <ChevronDown className="h-4 w-4" />
        )}
      </span>
    </button>
  );
}

// Member card component
function MemberCard({
  member,
  onViewDetails,
  now,
}: {
  member: typeof mockMembers[0];
  onViewDetails: () => void;
  now: number;
}) {
  const daysSinceAttendance = Math.floor(
    (now - member.lastAttended) / (24 * 60 * 60 * 1000)
  );
  const isAtRisk = daysSinceAttendance > 14;
  const isActive = daysSinceAttendance <= 7;

  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ scale: 1.01, y: -2 }}
      whileTap={{ scale: 0.99 }}
    >
      <Card
        className={`overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer ${
          isAtRisk ? "border-red-200 dark:border-red-800/50" : ""
        }`}
        onClick={onViewDetails}
      >
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-4">
            {/* Avatar and Name */}
            <div className="flex items-center gap-3">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                  isActive
                    ? "bg-primary/10 text-primary"
                    : isAtRisk
                    ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {member.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
              <div>
                <p className="font-semibold">{member.name}</p>
                <p className="text-sm text-muted-foreground">{member.email}</p>
              </div>
            </div>

            {/* Belt Badge */}
            <Badge className={`${BELT_COLORS[member.beltRank]} capitalize`}>
              {member.beltRank}
            </Badge>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-4 gap-2 mt-4">
            <div className="text-center p-2 bg-muted/50 rounded-lg">
              <div className="flex items-center justify-center gap-1">
                <Calendar className="h-3 w-3 text-blue-500" />
                <span className="font-bold text-sm">{member.totalSessions}</span>
              </div>
              <p className="text-xs text-muted-foreground">Sessions</p>
            </div>
            <div className="text-center p-2 bg-muted/50 rounded-lg">
              <div className="flex items-center justify-center gap-1">
                {member.attendanceRate >= 80 ? (
                  <TrendingUp className="h-3 w-3 text-green-500" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-red-500" />
                )}
                <span className="font-bold text-sm">{member.attendanceRate}%</span>
              </div>
              <p className="text-xs text-muted-foreground">Attendance</p>
            </div>
            <div className="text-center p-2 bg-muted/50 rounded-lg">
              <div className="flex items-center justify-center gap-1">
                <Award className="h-3 w-3 text-orange-500" />
                <span className="font-bold text-sm">{member.streak}</span>
              </div>
              <p className="text-xs text-muted-foreground">Streak</p>
            </div>
            <div className="text-center p-2 bg-muted/50 rounded-lg">
              <div
                className={`flex items-center justify-center gap-1 ${
                  isAtRisk ? "text-red-600" : ""
                }`}
              >
                <Clock className="h-3 w-3" />
                <span className="font-bold text-sm">
                  {daysSinceAttendance === 0 ? "Today" : `${daysSinceAttendance}d`}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">Last seen</p>
            </div>
          </div>

          {/* Risk Warning */}
          {isAtRisk && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mt-3 p-2 bg-red-50 dark:bg-red-950/30 rounded-lg flex items-center gap-2"
            >
              <TrendingDown className="h-4 w-4 text-red-500" />
              <span className="text-sm text-red-600 dark:text-red-400">
                At risk - hasn't attended in {daysSinceAttendance} days
              </span>
            </motion.div>
          )}

          {/* View Details Button */}
          <Button
            variant="ghost"
            size="sm"
            className="w-full mt-3"
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails();
            }}
          >
            <Eye className="h-4 w-4 mr-1" />
            View Details
          </Button>
        </CardContent>
      </Card>
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
        <div className="p-2 rounded-lg bg-white/50 dark:bg-black/20">
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

export default function CoachMembersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBelt, setSelectedBelt] = useState<string | null>(null);
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [showFilters, setShowFilters] = useState(false);

  // Use useState with lazy initializer for stable timestamp (React Compiler safe)
  const [now] = useState(() => Date.now());

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const filteredMembers = useMemo(() => {
    const filtered = mockMembers.filter((member) => {
      const matchesSearch =
        member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesBelt = !selectedBelt || member.beltRank === selectedBelt;
      return matchesSearch && matchesBelt;
    });

    // Sort
    filtered.sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case "name":
          comparison = a.name.localeCompare(b.name);
          break;
        case "beltRank":
          comparison = BELT_ORDER.indexOf(a.beltRank) - BELT_ORDER.indexOf(b.beltRank);
          break;
        case "totalSessions":
          comparison = a.totalSessions - b.totalSessions;
          break;
        case "attendanceRate":
          comparison = a.attendanceRate - b.attendanceRate;
          break;
        case "lastAttended":
          comparison = b.lastAttended - a.lastAttended;
          break;
      }
      return sortDirection === "asc" ? comparison : -comparison;
    });

    return filtered;
  }, [searchQuery, selectedBelt, sortField, sortDirection]);

  const avgAttendance = Math.round(
    mockMembers.reduce((sum, m) => sum + m.attendanceRate, 0) / mockMembers.length
  );
  const atRiskCount = mockMembers.filter(
    (m) => (now - m.lastAttended) / (24 * 60 * 60 * 1000) > 14
  ).length;
  const activeCount = mockMembers.filter(
    (m) => (now - m.lastAttended) / (24 * 60 * 60 * 1000) <= 7
  ).length;

  const handleViewDetails = (memberId: string) => {
    console.log("View details for member:", memberId);
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-background relative">
        <DojoBackgroundPattern />
        <CoachSidebar />
        <Navigation />

        <DashboardWrapper className="container mx-auto p-4 space-y-6 relative z-10 md:ml-64">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded-2xl"
          >
            <div className="absolute inset-0">
              <img
                src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&q=70"
                alt="Judo training"
                loading="lazy"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
            </div>

            <div className="relative p-6 sm:p-8">
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                My Judoka
              </h1>
              <p className="text-sm sm:text-base text-white/90 mt-1 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                View and manage your students' progress
              </p>
            </div>
          </motion.div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <QuickStatCard
              icon={Users}
              iconColor="text-blue-600"
              value={mockMembers.length}
              label="Total Judoka"
              gradient="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-200 dark:border-blue-800"
            />
            <QuickStatCard
              icon={UserCheck}
              iconColor="text-green-600"
              value={activeCount}
              label="Active This Week"
              gradient="bg-gradient-to-br from-green-500/10 to-green-600/5 border border-green-200 dark:border-green-800"
            />
            <QuickStatCard
              icon={BarChart3}
              iconColor="text-purple-600"
              value={`${avgAttendance}%`}
              label="Avg. Attendance"
              gradient="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-200 dark:border-purple-800"
            />
            <QuickStatCard
              icon={TrendingDown}
              iconColor="text-red-600"
              value={atRiskCount}
              label="At Risk"
              gradient="bg-gradient-to-br from-red-500/10 to-red-600/5 border border-red-200 dark:border-red-800"
            />
          </div>

          {/* Search and Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardContent className="p-4 space-y-4">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by name or email..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 min-h-[44px]"
                    />
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setShowFilters(!showFilters)}
                    className="min-h-[44px]"
                  >
                    <Filter className="h-4 w-4 mr-1" />
                    Filters
                    <ChevronDown
                      className={`h-4 w-4 ml-1 transition-transform ${
                        showFilters ? "rotate-180" : ""
                      }`}
                    />
                  </Button>
                </div>

                {/* Filter Options */}
                <AnimatePresence>
                  {showFilters && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="space-y-3 overflow-hidden"
                    >
                      <div>
                        <p className="text-sm font-medium mb-2">Filter by Belt</p>
                        <div className="flex flex-wrap gap-2">
                          <Button
                            variant={selectedBelt === null ? "default" : "outline"}
                            size="sm"
                            onClick={() => setSelectedBelt(null)}
                          >
                            All
                          </Button>
                          {BELT_ORDER.map((belt) => (
                            <Button
                              key={belt}
                              variant={selectedBelt === belt ? "default" : "outline"}
                              size="sm"
                              onClick={() => setSelectedBelt(belt)}
                              className="capitalize"
                            >
                              <span
                                className={`w-3 h-3 rounded-full mr-1 ${
                                  BELT_COLORS[belt].split(" ")[0]
                                }`}
                              />
                              {belt}
                            </Button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <p className="text-sm font-medium mb-2">Sort By</p>
                        <div className="flex flex-wrap gap-2">
                          <SortableHeader
                            field="name"
                            currentSort={sortField}
                            currentDirection={sortDirection}
                            onSort={handleSort}
                            className="px-3 py-1.5 bg-muted rounded-md"
                          >
                            Name
                          </SortableHeader>
                          <SortableHeader
                            field="beltRank"
                            currentSort={sortField}
                            currentDirection={sortDirection}
                            onSort={handleSort}
                            className="px-3 py-1.5 bg-muted rounded-md"
                          >
                            Belt
                          </SortableHeader>
                          <SortableHeader
                            field="totalSessions"
                            currentSort={sortField}
                            currentDirection={sortDirection}
                            onSort={handleSort}
                            className="px-3 py-1.5 bg-muted rounded-md"
                          >
                            Sessions
                          </SortableHeader>
                          <SortableHeader
                            field="attendanceRate"
                            currentSort={sortField}
                            currentDirection={sortDirection}
                            onSort={handleSort}
                            className="px-3 py-1.5 bg-muted rounded-md"
                          >
                            Attendance
                          </SortableHeader>
                          <SortableHeader
                            field="lastAttended"
                            currentSort={sortField}
                            currentDirection={sortDirection}
                            onSort={handleSort}
                            className="px-3 py-1.5 bg-muted rounded-md"
                          >
                            Last Seen
                          </SortableHeader>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>

          {/* Results Count */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {filteredMembers.length} of {mockMembers.length} judoka
            </p>
          </div>

          {/* Members Grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            {filteredMembers.map((member) => (
              <MemberCard
                key={member._id}
                member={member}
                onViewDetails={() => handleViewDetails(member._id)}
                now={now}
              />
            ))}
          </motion.div>

          {/* Empty State */}
          {filteredMembers.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <Users className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground">No judoka match your search</p>
            </motion.div>
          )}
        </DashboardWrapper>

        <MobileNavigation />
      </div>
    </PageTransition>
  );
}
