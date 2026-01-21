import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Megaphone,
  Pin,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  AlertTriangle,
  Info,
  Star,
  Trophy,
  Users,
  Calendar,
  Shield,
} from "lucide-react";
import { mockAnnouncements, type Announcement, type AnnouncementCategory, type AnnouncementPriority } from "@/lib/mockActivityData";
import { staggerContainer } from "@/lib/animation-variants";

// Category configuration
const CATEGORY_CONFIG: Record<
  AnnouncementCategory,
  { icon: React.FC<{ className?: string }>; color: string; bgColor: string; label: string }
> = {
  competition: {
    icon: Trophy,
    color: "text-yellow-700 dark:text-yellow-400",
    bgColor: "bg-yellow-100 dark:bg-yellow-900/30",
    label: "Competition",
  },
  training: {
    icon: Users,
    color: "text-blue-700 dark:text-blue-400",
    bgColor: "bg-blue-100 dark:bg-blue-900/30",
    label: "Training",
  },
  social: {
    icon: Calendar,
    color: "text-purple-700 dark:text-purple-400",
    bgColor: "bg-purple-100 dark:bg-purple-900/30",
    label: "Social",
  },
  admin: {
    icon: Shield,
    color: "text-gray-700 dark:text-gray-400",
    bgColor: "bg-gray-100 dark:bg-gray-800/30",
    label: "Admin",
  },
};

// Priority configuration
const PRIORITY_CONFIG: Record<
  AnnouncementPriority,
  { icon: React.FC<{ className?: string }>; color: string; bgColor: string; borderColor: string; label: string }
> = {
  urgent: {
    icon: AlertTriangle,
    color: "text-red-700 dark:text-red-400",
    bgColor: "bg-red-50 dark:bg-red-950/20",
    borderColor: "border-red-200 dark:border-red-800",
    label: "Urgent",
  },
  important: {
    icon: Star,
    color: "text-orange-700 dark:text-orange-400",
    bgColor: "bg-orange-50 dark:bg-orange-950/20",
    borderColor: "border-orange-200 dark:border-orange-800",
    label: "Important",
  },
  info: {
    icon: Info,
    color: "text-blue-700 dark:text-blue-400",
    bgColor: "bg-blue-50 dark:bg-blue-950/20",
    borderColor: "border-blue-200 dark:border-blue-800",
    label: "Info",
  },
};

// Single Announcement Item Component
function AnnouncementItem({
  announcement,
  isExpanded,
  onToggle,
  index,
}: {
  announcement: Announcement;
  isExpanded: boolean;
  onToggle: () => void;
  index: number;
}) {
  const categoryConfig = CATEGORY_CONFIG[announcement.category];
  const priorityConfig = PRIORITY_CONFIG[announcement.priority];
  const CategoryIcon = categoryConfig.icon;
  const PriorityIcon = priorityConfig.icon;

  const timeAgo = (() => {
    const diff = Date.now() - announcement.createdAt;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (hours < 1) return "Just now";
    if (hours < 24) return `${hours}h ago`;
    if (days === 1) return "Yesterday";
    return `${days}d ago`;
  })();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="relative"
    >
      <Card
        className={`cursor-pointer transition-all duration-300 hover:shadow-md ${
          priorityConfig.borderColor
        } ${priorityConfig.bgColor} ${!announcement.isRead ? "ring-2 ring-primary/20" : ""}`}
        onClick={onToggle}
      >
        <CardContent className="p-4">
          {/* Header */}
          <div className="flex items-start gap-3 mb-2">
            {/* Priority Icon */}
            <div className={`flex-shrink-0 h-10 w-10 rounded-full ${categoryConfig.bgColor} flex items-center justify-center`}>
              <CategoryIcon className={`h-5 w-5 ${categoryConfig.color}`} />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-1">
                <h3 className="font-semibold text-sm leading-tight flex items-center gap-2">
                  {announcement.title}
                  {announcement.isPinned && (
                    <Pin className="h-3 w-3 text-primary flex-shrink-0" />
                  )}
                  {!announcement.isRead && (
                    <span className="h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                  )}
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 flex-shrink-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggle();
                  }}
                >
                  {isExpanded ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-1.5 mb-2">
                <Badge
                  variant="secondary"
                  className={`${categoryConfig.bgColor} ${categoryConfig.color} text-xs px-2 py-0`}
                >
                  {categoryConfig.label}
                </Badge>
                <Badge
                  variant="outline"
                  className={`${priorityConfig.color} text-xs px-2 py-0 flex items-center gap-1`}
                >
                  <PriorityIcon className="h-3 w-3" />
                  {priorityConfig.label}
                </Badge>
              </div>

              {/* Preview or Full Content */}
              <AnimatePresence mode="wait">
                {isExpanded ? (
                  <motion.div
                    key="expanded"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                      {announcement.content}
                    </p>
                    <div className="flex items-center justify-between pt-2 border-t">
                      <div className="text-xs text-muted-foreground">
                        <span className="font-medium">{announcement.author.name}</span>
                        {" · "}
                        <span>{announcement.author.role}</span>
                        {" · "}
                        <span>{timeAgo}</span>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.p
                    key="collapsed"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-sm text-muted-foreground line-clamp-2 leading-relaxed"
                  >
                    {announcement.content}
                  </motion.p>
                )}
              </AnimatePresence>

              {/* Footer when collapsed */}
              {!isExpanded && (
                <p className="text-xs text-muted-foreground mt-2">
                  {announcement.author.name} · {timeAgo}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Empty State Component
function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-12 px-4"
    >
      <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
        <Megaphone className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold mb-1">No announcements</h3>
      <p className="text-sm text-muted-foreground text-center max-w-sm">
        When the club posts important updates, you'll see them here.
      </p>
    </motion.div>
  );
}

// Main Announcements Card Component
export default function AnnouncementsCard() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);

  // Sort: pinned first, then by unread, then by date
  const sortedAnnouncements = [...mockAnnouncements].sort((a, b) => {
    if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
    if (a.isRead !== b.isRead) return a.isRead ? 1 : -1;
    return b.createdAt - a.createdAt;
  });

  const displayedAnnouncements = showAll ? sortedAnnouncements : sortedAnnouncements.slice(0, 5);
  const unreadCount = mockAnnouncements.filter(a => !a.isRead).length;
  const hasMore = sortedAnnouncements.length > 5;

  const handleToggle = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <CardTitle className="flex items-center gap-2">
              <Megaphone className="h-5 w-5 text-primary" />
              Announcements
              {unreadCount > 0 && (
                <Badge variant="default" className="ml-2">
                  {unreadCount} new
                </Badge>
              )}
            </CardTitle>
            <CardDescription>Important club updates</CardDescription>
          </div>
          {hasMore && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAll(!showAll)}
              className="flex items-center gap-1"
            >
              {showAll ? "Show Less" : "View All"}
              <ExternalLink className="h-3 w-3" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {mockAnnouncements.length === 0 ? (
          <EmptyState />
        ) : (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="space-y-3"
          >
            <ScrollArea className={showAll ? "h-[600px]" : ""}>
              <div className="space-y-3 pr-4">
                {displayedAnnouncements.map((announcement, index) => (
                  <AnnouncementItem
                    key={announcement._id}
                    announcement={announcement}
                    isExpanded={expandedId === announcement._id}
                    onToggle={() => handleToggle(announcement._id)}
                    index={index}
                  />
                ))}
              </div>
            </ScrollArea>

            {/* Summary Stats */}
            {mockAnnouncements.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-4 pt-4 border-t grid grid-cols-4 gap-2"
              >
                <div className="text-center">
                  <p className="text-xl font-bold text-red-600">
                    {mockAnnouncements.filter(a => a.priority === "urgent").length}
                  </p>
                  <p className="text-xs text-muted-foreground">Urgent</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold text-orange-600">
                    {mockAnnouncements.filter(a => a.priority === "important").length}
                  </p>
                  <p className="text-xs text-muted-foreground">Important</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold text-primary">
                    {mockAnnouncements.filter(a => a.isPinned).length}
                  </p>
                  <p className="text-xs text-muted-foreground">Pinned</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold text-muted-foreground">
                    {mockAnnouncements.length}
                  </p>
                  <p className="text-xs text-muted-foreground">Total</p>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}
