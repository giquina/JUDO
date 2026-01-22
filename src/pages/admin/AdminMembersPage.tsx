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
  Users,
  Search,
  Download,
  UserPlus,
  Filter,
  ChevronUp,
  ChevronDown,
  Eye,
  Edit,
  Trash2,
  MoreHorizontal,
  Mail,
  X,
  Check,
} from "lucide-react";

// Types
interface Member {
  _id: string;
  name: string;
  email: string;
  phone: string;
  beltRank: string;
  subscriptionStatus: "active" | "inactive" | "pending";
  subscriptionTier: "student" | "standard" | "premium";
  totalSessions: number;
  lastAttended: number;
  joinDate: number;
  emergencyContact: string;
  notes: string;
}

type SortField = "name" | "beltRank" | "subscriptionTier" | "totalSessions" | "lastAttended" | "joinDate";
type SortDirection = "asc" | "desc";

// Mock data - will be replaced with Convex queries
const mockMembers: Member[] = [
  { _id: "1", name: "Alice Chen", email: "a.chen@bbk.ac.uk", phone: "07700 900001", beltRank: "blue", subscriptionStatus: "active", subscriptionTier: "standard", totalSessions: 47, lastAttended: Date.now() - 2 * 24 * 60 * 60 * 1000, joinDate: Date.now() - 180 * 24 * 60 * 60 * 1000, emergencyContact: "John Chen - 07700 900100", notes: "Competitive judoka, trains 3x/week" },
  { _id: "2", name: "Raj Patel", email: "r.patel@bbk.ac.uk", phone: "07700 900002", beltRank: "white", subscriptionStatus: "active", subscriptionTier: "student", totalSessions: 8, lastAttended: Date.now() - 5 * 24 * 60 * 60 * 1000, joinDate: Date.now() - 30 * 24 * 60 * 60 * 1000, emergencyContact: "Priya Patel - 07700 900200", notes: "New starter, very enthusiastic" },
  { _id: "3", name: "Emma Williams", email: "e.williams@bbk.ac.uk", phone: "07700 900003", beltRank: "yellow", subscriptionStatus: "active", subscriptionTier: "student", totalSessions: 15, lastAttended: Date.now() - 7 * 24 * 60 * 60 * 1000, joinDate: Date.now() - 60 * 24 * 60 * 60 * 1000, emergencyContact: "David Williams - 07700 900300", notes: "" },
  { _id: "4", name: "James O'Brien", email: "j.obrien@bbk.ac.uk", phone: "07700 900004", beltRank: "orange", subscriptionStatus: "active", subscriptionTier: "standard", totalSessions: 32, lastAttended: Date.now() - 1 * 24 * 60 * 60 * 1000, joinDate: Date.now() - 120 * 24 * 60 * 60 * 1000, emergencyContact: "Mary O'Brien - 07700 900400", notes: "Interested in coaching" },
  { _id: "5", name: "Sofia Rodriguez", email: "s.rodriguez@bbk.ac.uk", phone: "07700 900005", beltRank: "green", subscriptionStatus: "active", subscriptionTier: "premium", totalSessions: 89, lastAttended: Date.now() - 3 * 24 * 60 * 60 * 1000, joinDate: Date.now() - 240 * 24 * 60 * 60 * 1000, emergencyContact: "Carlos Rodriguez - 07700 900500", notes: "Former national competitor" },
  { _id: "6", name: "Mohammed Hassan", email: "m.hassan@bbk.ac.uk", phone: "07700 900006", beltRank: "brown", subscriptionStatus: "active", subscriptionTier: "premium", totalSessions: 156, lastAttended: Date.now() - 2 * 24 * 60 * 60 * 1000, joinDate: Date.now() - 365 * 24 * 60 * 60 * 1000, emergencyContact: "Fatima Hassan - 07700 900600", notes: "Assistant coach candidate" },
  { _id: "7", name: "Lucy Taylor", email: "l.taylor@bbk.ac.uk", phone: "07700 900007", beltRank: "white", subscriptionStatus: "inactive", subscriptionTier: "student", totalSessions: 3, lastAttended: Date.now() - 30 * 24 * 60 * 60 * 1000, joinDate: Date.now() - 45 * 24 * 60 * 60 * 1000, emergencyContact: "Mark Taylor - 07700 900700", notes: "On hiatus - exams" },
  { _id: "8", name: "Yuki Tanaka", email: "y.tanaka@bbk.ac.uk", phone: "07700 900008", beltRank: "black", subscriptionStatus: "active", subscriptionTier: "premium", totalSessions: 312, lastAttended: Date.now() - 1 * 24 * 60 * 60 * 1000, joinDate: Date.now() - 730 * 24 * 60 * 60 * 1000, emergencyContact: "Kenji Tanaka - 07700 900800", notes: "1st Dan, assistant sensei" },
  { _id: "9", name: "Oliver Smith", email: "o.smith@bbk.ac.uk", phone: "07700 900009", beltRank: "yellow", subscriptionStatus: "pending", subscriptionTier: "standard", totalSessions: 0, lastAttended: 0, joinDate: Date.now() - 2 * 24 * 60 * 60 * 1000, emergencyContact: "Sarah Smith - 07700 900900", notes: "Trial session completed" },
  { _id: "10", name: "Aisha Khan", email: "a.khan@bbk.ac.uk", phone: "07700 900010", beltRank: "orange", subscriptionStatus: "active", subscriptionTier: "student", totalSessions: 28, lastAttended: Date.now() - 4 * 24 * 60 * 60 * 1000, joinDate: Date.now() - 90 * 24 * 60 * 60 * 1000, emergencyContact: "Imran Khan - 07700 901000", notes: "" },
];

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

const BELT_ORDER = ["white", "yellow", "orange", "green", "blue", "brown", "black"];

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

// Dojo background pattern component
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
      className="pb-3 px-3 font-medium cursor-pointer hover:text-primary transition-colors whitespace-nowrap"
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

// Member row component
function MemberRow({ member, index, onEdit, onDelete, onView }: {
  member: Member;
  index: number;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onView: (id: string) => void;
}) {
  const [showActions, setShowActions] = useState(false);
  const daysSinceAttendance = member.lastAttended ? Math.floor((Date.now() - member.lastAttended) / (24 * 60 * 60 * 1000)) : null;
  const isAtRisk = daysSinceAttendance !== null && daysSinceAttendance > 14;

  return (
    <motion.tr
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.02 }}
      className={`border-b hover:bg-muted/50 transition-colors ${isAtRisk ? "bg-red-50/30 dark:bg-red-950/10" : ""}`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <td className="py-3 px-3">
        <div className="flex items-center gap-3">
          <motion.div
            className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold flex-shrink-0 ${
              member.subscriptionStatus === "active"
                ? "bg-primary/10 text-primary"
                : member.subscriptionStatus === "pending"
                ? "bg-yellow-100 text-yellow-700"
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
      <td className="py-3 px-3">
        <Badge className={BELT_COLORS[member.beltRank]}>
          {member.beltRank}
        </Badge>
      </td>
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
      <td className="py-3 px-3">
        <div className="flex items-center gap-2">
          <span className="font-medium">{member.totalSessions}</span>
          <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(member.totalSessions / 100, 1) * 100}%` }}
              transition={{ duration: 1, delay: index * 0.03 }}
            />
          </div>
        </div>
      </td>
      <td className="py-3 px-3">
        <div className={`text-sm whitespace-nowrap ${isAtRisk ? "text-red-600 font-medium" : "text-muted-foreground"}`}>
          {daysSinceAttendance === null
            ? "Never"
            : daysSinceAttendance === 0
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
      <td className="py-3 px-3 text-sm text-muted-foreground whitespace-nowrap">
        {new Date(member.joinDate).toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })}
      </td>
      <td className="py-3 px-3">
        <AnimatePresence>
          {showActions ? (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="flex items-center gap-1"
            >
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => onView(member._id)}>
                <Eye className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => onEdit(member._id)}>
                <Edit className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-destructive hover:text-destructive" onClick={() => onDelete(member._id)}>
                <Trash2 className="h-4 w-4" />
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

// Filter panel component
function FilterPanel({
  filters,
  onFilterChange,
  onClose,
}: {
  filters: {
    belt: string;
    status: string;
    subscription: string;
  };
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
          <label className="text-sm font-medium mb-1 block">Belt Rank</label>
          <select
            className="w-full h-10 px-3 rounded-md border bg-background text-sm"
            value={filters.belt}
            onChange={(e) => onFilterChange("belt", e.target.value)}
          >
            <option value="">All Belts</option>
            {BELT_ORDER.map((belt) => (
              <option key={belt} value={belt} className="capitalize">
                {belt.charAt(0).toUpperCase() + belt.slice(1)}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">Status</label>
          <select
            className="w-full h-10 px-3 rounded-md border bg-background text-sm"
            value={filters.status}
            onChange={(e) => onFilterChange("status", e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="pending">Pending</option>
          </select>
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">Subscription</label>
          <select
            className="w-full h-10 px-3 rounded-md border bg-background text-sm"
            value={filters.subscription}
            onChange={(e) => onFilterChange("subscription", e.target.value)}
          >
            <option value="">All Tiers</option>
            <option value="student">Student</option>
            <option value="standard">Standard</option>
            <option value="premium">Premium</option>
          </select>
        </div>
      </div>
      {(filters.belt || filters.status || filters.subscription) && (
        <div className="mt-3 flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          {filters.belt && (
            <Badge variant="secondary" className="gap-1">
              {filters.belt}
              <X className="h-3 w-3 cursor-pointer" onClick={() => onFilterChange("belt", "")} />
            </Badge>
          )}
          {filters.status && (
            <Badge variant="secondary" className="gap-1">
              {filters.status}
              <X className="h-3 w-3 cursor-pointer" onClick={() => onFilterChange("status", "")} />
            </Badge>
          )}
          {filters.subscription && (
            <Badge variant="secondary" className="gap-1">
              {filters.subscription}
              <X className="h-3 w-3 cursor-pointer" onClick={() => onFilterChange("subscription", "")} />
            </Badge>
          )}
        </div>
      )}
    </motion.div>
  );
}

// Add Member Modal
function AddMemberModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    beltRank: "white",
    subscriptionTier: "student",
    emergencyContact: "",
    notes: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(`Member ${formData.name} added successfully!`);
    onClose();
    setFormData({
      name: "",
      email: "",
      phone: "",
      beltRank: "white",
      subscriptionTier: "student",
      emergencyContact: "",
      notes: "",
    });
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-background rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <UserPlus className="h-5 w-5 text-primary" />
                Add New Member
              </h2>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="text-sm font-medium mb-1 block">Full Name *</label>
                <Input
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter full name"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Email *</label>
                <Input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="email@example.com"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Phone</label>
                <Input
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="07xxx xxxxxx"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Belt Rank</label>
                <select
                  className="w-full h-10 px-3 rounded-md border bg-background text-sm"
                  value={formData.beltRank}
                  onChange={(e) => setFormData({ ...formData, beltRank: e.target.value })}
                >
                  {BELT_ORDER.map((belt) => (
                    <option key={belt} value={belt}>
                      {belt.charAt(0).toUpperCase() + belt.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Subscription Tier</label>
                <select
                  className="w-full h-10 px-3 rounded-md border bg-background text-sm"
                  value={formData.subscriptionTier}
                  onChange={(e) => setFormData({ ...formData, subscriptionTier: e.target.value })}
                >
                  <option value="student">Student - 25/month</option>
                  <option value="standard">Standard - 40/month</option>
                  <option value="premium">Premium - 60/month</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="text-sm font-medium mb-1 block">Emergency Contact</label>
                <Input
                  value={formData.emergencyContact}
                  onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                  placeholder="Name - Phone number"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="text-sm font-medium mb-1 block">Notes</label>
                <textarea
                  className="w-full px-3 py-2 rounded-md border bg-background text-sm min-h-[80px] resize-none"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Any additional notes..."
                />
              </div>
            </div>
            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" className="flex-1 bg-gradient-to-r from-primary to-purple-600">
                <Check className="h-4 w-4 mr-2" />
                Add Member
              </Button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default function AdminMembersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [showFilters, setShowFilters] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [filters, setFilters] = useState({
    belt: "",
    status: "",
    subscription: "",
  });

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const filteredMembers = useMemo(() => {
    let members = mockMembers.filter((m) => {
      const matchesSearch =
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.phone.includes(searchQuery);
      const matchesBelt = !filters.belt || m.beltRank === filters.belt;
      const matchesStatus = !filters.status || m.subscriptionStatus === filters.status;
      const matchesSubscription = !filters.subscription || m.subscriptionTier === filters.subscription;

      return matchesSearch && matchesBelt && matchesStatus && matchesSubscription;
    });

    members.sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case "name":
          comparison = a.name.localeCompare(b.name);
          break;
        case "beltRank":
          comparison = BELT_ORDER.indexOf(a.beltRank) - BELT_ORDER.indexOf(b.beltRank);
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
        case "joinDate":
          comparison = b.joinDate - a.joinDate;
          break;
      }
      return sortDirection === "asc" ? comparison : -comparison;
    });

    return members;
  }, [searchQuery, sortField, sortDirection, filters]);

  const handleExportMembers = () => {
    toast.success("Exporting members to CSV...");
  };

  const handleEmailAll = () => {
    toast.success(`Opening email composer for ${filteredMembers.length} members...`);
  };

  const handleView = (id: string) => {
    const member = mockMembers.find((m) => m._id === id);
    toast.info(`Viewing ${member?.name}'s profile`);
  };

  const handleEdit = (id: string) => {
    const member = mockMembers.find((m) => m._id === id);
    toast.info(`Editing ${member?.name}'s details`);
  };

  const handleDelete = (id: string) => {
    const member = mockMembers.find((m) => m._id === id);
    toast.error(`Delete ${member?.name}? (This would show a confirmation dialog)`);
  };

  // Stats
  const activeCount = mockMembers.filter((m) => m.subscriptionStatus === "active").length;
  const pendingCount = mockMembers.filter((m) => m.subscriptionStatus === "pending").length;
  const atRiskCount = mockMembers.filter((m) => {
    const days = m.lastAttended ? Math.floor((Date.now() - m.lastAttended) / (24 * 60 * 60 * 1000)) : 0;
    return days > 14 && m.subscriptionStatus === "active";
  }).length;

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
                alt="Judo training"
                loading="lazy"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
            </div>

            <div className="relative p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent drop-shadow-lg">
                  Member Management
                </h1>
                <p className="text-white/90 mt-1">Manage all dojo members and their subscriptions</p>
              </div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  className="bg-gradient-to-r from-primary to-purple-600 min-h-[44px]"
                  onClick={() => setShowAddModal(true)}
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add Member
                </Button>
              </motion.div>
            </div>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 sm:grid-cols-4 gap-3"
          >
            <motion.div variants={itemVariants}>
              <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-200 dark:border-blue-800">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                      <Users className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{mockMembers.length}</p>
                      <p className="text-sm text-muted-foreground">Total Members</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div variants={itemVariants}>
              <Card className="bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-200 dark:border-green-800">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                      <Check className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{activeCount}</p>
                      <p className="text-sm text-muted-foreground">Active</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div variants={itemVariants}>
              <Card className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 border-yellow-200 dark:border-yellow-800">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                      <UserPlus className="h-5 w-5 text-yellow-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{pendingCount}</p>
                      <p className="text-sm text-muted-foreground">Pending</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div variants={itemVariants}>
              <Card className="bg-gradient-to-br from-red-500/10 to-red-600/5 border-red-200 dark:border-red-800">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
                      <Users className="h-5 w-5 text-red-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{atRiskCount}</p>
                      <p className="text-sm text-muted-foreground">At Risk</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-3 overflow-x-auto pb-2"
          >
            <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">Quick Actions:</span>
            <Button variant="outline" size="sm" onClick={handleExportMembers}>
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
            <Button variant="outline" size="sm" onClick={handleEmailAll}>
              <Mail className="h-4 w-4 mr-2" />
              Email All
            </Button>
            <Button
              variant={showFilters ? "default" : "outline"}
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
              {(filters.belt || filters.status || filters.subscription) && (
                <Badge variant="secondary" className="ml-2 h-5 w-5 p-0 flex items-center justify-center">
                  {[filters.belt, filters.status, filters.subscription].filter(Boolean).length}
                </Badge>
              )}
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

          {/* Members Table */}
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                    <Users className="h-5 w-5 text-primary" />
                    Dojo Members
                    <Badge variant="secondary">{filteredMembers.length}</Badge>
                  </CardTitle>
                  <CardDescription>
                    Click column headers to sort
                  </CardDescription>
                </div>
                <div className="relative w-full sm:w-72">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search members..."
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
                      <SortableHeader field="name" currentSort={sortField} currentDirection={sortDirection} onSort={handleSort}>
                        Name
                      </SortableHeader>
                      <SortableHeader field="beltRank" currentSort={sortField} currentDirection={sortDirection} onSort={handleSort}>
                        Belt
                      </SortableHeader>
                      <SortableHeader field="subscriptionTier" currentSort={sortField} currentDirection={sortDirection} onSort={handleSort}>
                        Subscription
                      </SortableHeader>
                      <SortableHeader field="totalSessions" currentSort={sortField} currentDirection={sortDirection} onSort={handleSort}>
                        Sessions
                      </SortableHeader>
                      <SortableHeader field="lastAttended" currentSort={sortField} currentDirection={sortDirection} onSort={handleSort}>
                        Last Attended
                      </SortableHeader>
                      <SortableHeader field="joinDate" currentSort={sortField} currentDirection={sortDirection} onSort={handleSort}>
                        Joined
                      </SortableHeader>
                      <th className="pb-3 px-3 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredMembers.map((member, index) => (
                      <MemberRow
                        key={member._id}
                        member={member}
                        index={index}
                        onView={handleView}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                      />
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
                    <p className="text-muted-foreground">No members found</p>
                    <p className="text-sm text-muted-foreground mt-1">Try adjusting your search or filters</p>
                  </motion.div>
                )}
              </div>
            </CardContent>
          </Card>
        </main>

        <MobileNavigation />
        <AddMemberModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} />
      </div>
    </PageTransition>
  );
}
