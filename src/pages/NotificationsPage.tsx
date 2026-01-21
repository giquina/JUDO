import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/Navigation";
import PageTransition from "@/components/PageTransition";
import EmptyState from "@/components/EmptyState";
import {
  Bell,
  CheckCircle2,
  DollarSign,
  Megaphone,
  UserCheck,
  CheckCheck,
  Trash2,
  Filter,
} from "lucide-react";

interface Notification {
  id: string;
  type: "check-in" | "payment" | "announcement" | "system";
  title: string;
  description: string;
  timestamp: number;
  read: boolean;
}

// Mock data - will be replaced with Convex queries
const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "check-in",
    title: "Check-in Confirmed",
    description: "You've been checked in for tonight's training session at 7:00 PM",
    timestamp: Date.now() - 10 * 60 * 1000, // 10 minutes ago
    read: false,
  },
  {
    id: "2",
    type: "payment",
    title: "Payment Successful",
    description: "Your monthly subscription of £40.00 has been processed successfully",
    timestamp: Date.now() - 2 * 60 * 60 * 1000, // 2 hours ago
    read: false,
  },
  {
    id: "3",
    type: "announcement",
    title: "Tournament Next Month",
    description: "Regional Judo Championship registration is now open. Sign up before Feb 15th",
    timestamp: Date.now() - 5 * 60 * 60 * 1000, // 5 hours ago
    read: false,
  },
  {
    id: "4",
    type: "check-in",
    title: "Class Reminder",
    description: "Advanced class starts in 30 minutes. Don't forget your gi!",
    timestamp: Date.now() - 1 * 24 * 60 * 60 * 1000, // Yesterday
    read: true,
  },
  {
    id: "5",
    type: "system",
    title: "Profile Updated",
    description: "Your profile information has been successfully updated",
    timestamp: Date.now() - 2 * 24 * 60 * 60 * 1000, // 2 days ago
    read: true,
  },
  {
    id: "6",
    type: "payment",
    title: "Payment Due",
    description: "Your monthly subscription payment is due in 3 days",
    timestamp: Date.now() - 3 * 24 * 60 * 60 * 1000, // 3 days ago
    read: true,
  },
  {
    id: "7",
    type: "announcement",
    title: "New Belt Grading Schedule",
    description: "Belt grading will be held on March 20th. Check requirements",
    timestamp: Date.now() - 5 * 24 * 60 * 60 * 1000, // 5 days ago
    read: true,
  },
  {
    id: "8",
    type: "check-in",
    title: "Attendance Milestone",
    description: "Congratulations! You've attended 50 training sessions",
    timestamp: Date.now() - 8 * 24 * 60 * 60 * 1000, // 8 days ago
    read: true,
  },
  {
    id: "9",
    type: "system",
    title: "Welcome to Judo Club",
    description: "Your account has been activated. Start exploring!",
    timestamp: Date.now() - 15 * 24 * 60 * 60 * 1000, // 15 days ago
    read: true,
  },
];

const notificationIcons = {
  "check-in": UserCheck,
  payment: DollarSign,
  announcement: Megaphone,
  system: CheckCircle2,
};

const notificationColors = {
  "check-in": "text-blue-500 bg-blue-500/10",
  payment: "text-green-500 bg-green-500/10",
  announcement: "text-purple-500 bg-purple-500/10",
  system: "text-gray-500 bg-gray-500/10",
};

function formatTimestamp(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (hours < 1) {
    const minutes = Math.floor(diff / (1000 * 60));
    return minutes < 1 ? "Just now" : `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  }
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} day${days > 1 ? "s" : ""} ago`;

  return new Date(timestamp).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: timestamp < Date.now() - 365 * 24 * 60 * 60 * 1000 ? "numeric" : undefined,
  });
}

function getNotificationGroup(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return "This Week";
  return "Older";
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [filter, setFilter] = useState<"all" | "unread" | "check-in" | "payment" | "announcement">("all");

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filteredNotifications = notifications.filter((n) => {
    if (filter === "all") return true;
    if (filter === "unread") return !n.read;
    return n.type === filter;
  });

  // Group notifications by date
  const groupedNotifications = filteredNotifications.reduce((groups, notification) => {
    const group = getNotificationGroup(notification.timestamp);
    if (!groups[group]) {
      groups[group] = [];
    }
    groups[group].push(notification);
    return groups;
  }, {} as Record<string, Notification[]>);

  const groupOrder = ["Today", "Yesterday", "This Week", "Older"];

  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  const handleDelete = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto p-4 max-w-4xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <Bell className="w-8 h-8" />
                Notifications
              </h1>
              <p className="text-muted-foreground mt-1">
                {unreadCount > 0
                  ? `You have ${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}`
                  : "You're all caught up!"}
              </p>
            </div>
            {notifications.length > 0 && (
              <div className="flex gap-2">
                {unreadCount > 0 && (
                  <Button
                    variant="outline"
                    onClick={handleMarkAllAsRead}
                  >
                    <CheckCheck className="w-4 h-4 mr-2" />
                    Mark all read
                  </Button>
                )}
                <Button
                  variant="outline"
                  onClick={handleClearAll}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear all
                </Button>
              </div>
            )}
          </div>

          {/* Filter Tabs */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 flex-wrap">
                <Filter className="w-4 h-4 text-muted-foreground" />
                <div className="flex gap-2 flex-wrap">
                  {(["all", "unread", "check-in", "payment", "announcement"] as const).map((tab) => (
                    <Button
                      key={tab}
                      variant={filter === tab ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setFilter(tab)}
                      className="capitalize"
                    >
                      {tab === "check-in" ? "Check-ins" : tab}
                      {tab === "unread" && unreadCount > 0 && (
                        <Badge variant="secondary" className="ml-2 h-5 min-w-5 px-1.5">
                          {unreadCount}
                        </Badge>
                      )}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notifications List */}
          {filteredNotifications.length === 0 ? (
            <EmptyState
              icon={<Bell />}
              title="No notifications"
              description={
                filter === "all"
                  ? "You don't have any notifications yet"
                  : `No ${filter} notifications to show`
              }
            />
          ) : (
            <div className="space-y-6">
              {groupOrder.map((group) => {
                const groupNotifications = groupedNotifications[group];
                if (!groupNotifications || groupNotifications.length === 0) return null;

                return (
                  <div key={group}>
                    <h2 className="text-sm font-semibold text-muted-foreground mb-3 px-1">
                      {group}
                    </h2>
                    <div className="space-y-2">
                      <AnimatePresence mode="popLayout">
                        {groupNotifications.map((notification, index) => {
                          const Icon = notificationIcons[notification.type];
                          return (
                            <motion.div
                              key={notification.id}
                              layout
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, x: -100 }}
                              transition={{ delay: index * 0.02 }}
                            >
                              <Card
                                className={`group cursor-pointer transition-all hover:shadow-md ${
                                  !notification.read ? "border-primary/50 bg-primary/5" : ""
                                }`}
                                onClick={() => !notification.read && handleMarkAsRead(notification.id)}
                              >
                                <CardContent className="p-4">
                                  <div className="flex gap-4">
                                    {/* Icon */}
                                    <div
                                      className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
                                        notificationColors[notification.type]
                                      }`}
                                    >
                                      <Icon className="w-6 h-6" />
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-start justify-between gap-2">
                                        <div className="flex-1">
                                          <div className="flex items-center gap-2">
                                            <h3 className="text-sm font-semibold">
                                              {notification.title}
                                            </h3>
                                            {!notification.read && (
                                              <div className="w-2 h-2 rounded-full bg-primary" />
                                            )}
                                          </div>
                                          <p className="text-sm text-muted-foreground mt-1">
                                            {notification.description}
                                          </p>
                                          <div className="flex items-center gap-3 mt-2">
                                            <p className="text-xs text-muted-foreground">
                                              {formatTimestamp(notification.timestamp)}
                                            </p>
                                            <Badge variant="outline" className="text-xs capitalize">
                                              {notification.type === "check-in" ? "Check-in" : notification.type}
                                            </Badge>
                                          </div>
                                        </div>

                                        {/* Delete button */}
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleDelete(notification.id);
                                          }}
                                          className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 text-muted-foreground hover:text-destructive"
                                        >
                                          <Trash2 className="w-4 h-4" />
                                        </Button>
                                      </div>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            </motion.div>
                          );
                        })}
                      </AnimatePresence>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </PageTransition>
  );
}
