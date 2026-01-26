import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Users,
  Search,
  ChevronUp,
  ChevronDown,
  Eye,
  Edit,
  MoreHorizontal,
} from "lucide-react";

// Types
interface Member {
  _id: string;
  name: string;
  email: string;
  beltRank: string;
  subscriptionStatus: string;
  subscriptionTier: string;
  totalSessions: number;
  lastAttended: number;
  joinDate: number;
}

type SortField = "name" | "beltRank" | "subscriptionTier" | "totalSessions" | "lastAttended";
type SortDirection = "asc" | "desc";

// Belt and status color mappings
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

// Sortable table header component
function SortableHeader({
  field,
  currentSort,
  currentDirection,
  onSort,
  children,
  isSticky = false,
}: {
  field: SortField;
  currentSort: SortField;
  currentDirection: SortDirection;
  onSort: (field: SortField) => void;
  children: React.ReactNode;
  isSticky?: boolean;
}) {
  const isActive = currentSort === field;

  return (
    <th
      className={`pb-3 font-medium cursor-pointer hover:text-primary transition-colors whitespace-nowrap ${
        isSticky
          ? "sticky left-0 z-20 bg-card after:absolute after:right-0 after:top-0 after:bottom-0 after:w-px after:bg-border pl-4 sm:pl-6 pr-4"
          : "px-3"
      }`}
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

// Member row component with sticky first column
function MemberRow({ member, index, now }: { member: Member; index: number; now: number }) {
  const [showActions, setShowActions] = useState(false);
  const daysSinceAttendance = Math.floor((now - member.lastAttended) / (24 * 60 * 60 * 1000));
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
      {/* Sticky Name Column */}
      <td className="py-3 sticky left-0 z-10 bg-card after:absolute after:right-0 after:top-0 after:bottom-0 after:w-px after:bg-border min-w-[200px] pl-4 sm:pl-6">
        <div className="flex items-center gap-3 pr-4">
          <motion.div
            className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold flex-shrink-0 ${
              member.subscriptionStatus === "active"
                ? "bg-primary/10 text-primary"
                : "bg-muted text-muted-foreground"
            }`}
            whileHover={{ scale: 1.1 }}
          >
            {member.name.split(" ").map(n => n[0]).join("")}
          </motion.div>
          <div className="min-w-0">
            <p className="font-medium truncate">{member.name}</p>
            <p className="text-sm text-muted-foreground truncate">{member.email}</p>
          </div>
        </div>
      </td>

      {/* Belt Column */}
      <td className="py-3 px-3">
        <Badge className={BELT_COLORS[member.beltRank]}>
          {member.beltRank}
        </Badge>
      </td>

      {/* Subscription Column */}
      <td className="py-3 px-3">
        <div className="flex items-center gap-2">
          <Badge className={STATUS_COLORS[member.subscriptionStatus]}>
            {member.subscriptionStatus}
          </Badge>
          <span className="text-sm text-muted-foreground capitalize whitespace-nowrap">
            ({member.subscriptionTier})
          </span>
        </div>
      </td>

      {/* Sessions Column */}
      <td className="py-3 px-3">
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

      {/* Last Attended Column */}
      <td className="py-3 px-3">
        <div className={`text-sm whitespace-nowrap ${isAtRisk ? "text-red-600 font-medium" : "text-muted-foreground"}`}>
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

      {/* Actions Column */}
      <td className="py-3 px-3">
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

interface MemberTableProps {
  members: Member[];
  title?: string;
  description?: string;
}

export default function MemberTable({
  members,
  title = "Dojo Members",
  description = "Tap column headers to sort"
}: MemberTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

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
    const filtered = members.filter(
      (m) =>
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.beltRank.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Sort members
    filtered.sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case "name":
          comparison = a.name.localeCompare(b.name);
          break;
        case "beltRank": {
          const beltOrder = ["white", "yellow", "orange", "green", "blue", "brown", "black"];
          comparison = beltOrder.indexOf(a.beltRank) - beltOrder.indexOf(b.beltRank);
          break;
        }
        case "subscriptionTier": {
          const tierOrder = ["student", "standard", "premium"];
          comparison = tierOrder.indexOf(a.subscriptionTier) - tierOrder.indexOf(b.subscriptionTier);
          break;
        }
        case "totalSessions":
          comparison = a.totalSessions - b.totalSessions;
          break;
        case "lastAttended":
          comparison = b.lastAttended - a.lastAttended;
          break;
      }
      return sortDirection === "asc" ? comparison : -comparison;
    });

    return filtered;
  }, [members, searchQuery, sortField, sortDirection]);

  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <Users className="h-5 w-5 text-primary" />
              {title}
              <Badge variant="secondary">{filteredMembers.length}</Badge>
            </CardTitle>
            <CardDescription className="text-sm">
              {description}
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
        {/* Scrollable table container */}
        <div className="overflow-x-auto -mx-0 sm:mx-0">
          <table className="w-full min-w-[700px] border-collapse">
            <thead>
              <tr className="border-b text-left">
                <SortableHeader
                  field="name"
                  currentSort={sortField}
                  currentDirection={sortDirection}
                  onSort={handleSort}
                  isSticky={true}
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
                <th className="pb-3 px-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMembers.map((member, index) => (
                <MemberRow key={member._id} member={member} index={index} now={now} />
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
  );
}
