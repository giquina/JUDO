import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Bell,
  CheckCircle2,
  DollarSign,
  Megaphone,
  UserCheck,
  X,
  Check,
  CheckCheck,
} from "lucide-react";

export interface Notification {
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
    description: "You've been checked in for tonight's training session",
    timestamp: Date.now() - 10 * 60 * 1000, // 10 minutes ago
    read: false,
  },
  {
    id: "2",
    type: "payment",
    title: "Payment Successful",
    description: "Your monthly subscription of £40.00 has been processed",
    timestamp: Date.now() - 2 * 60 * 60 * 1000, // 2 hours ago
    read: false,
  },
  {
    id: "3",
    type: "announcement",
    title: "Tournament Next Month",
    description: "Regional Judo Championship registration is now open",
    timestamp: Date.now() - 5 * 60 * 60 * 1000, // 5 hours ago
    read: false,
  },
  {
    id: "4",
    type: "check-in",
    title: "Class Reminder",
    description: "Advanced class starts in 30 minutes",
    timestamp: Date.now() - 24 * 60 * 60 * 1000, // Yesterday
    read: true,
  },
  {
    id: "5",
    type: "system",
    title: "Profile Updated",
    description: "Your profile information has been successfully updated",
    timestamp: Date.now() - 48 * 60 * 60 * 1000, // 2 days ago
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
  "check-in": "text-blue-500",
  payment: "text-green-500",
  announcement: "text-purple-500",
  system: "text-gray-500",
};

function formatTimestamp(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days}d ago`;
  return new Date(timestamp).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  });
}

export default function NotificationsCenter() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [filter, setFilter] = useState<"all" | "check-in" | "payment" | "announcement">("all");

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filteredNotifications =
    filter === "all"
      ? notifications
      : notifications.filter((n) => n.type === filter);

  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleRemoveNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant="ghost"
            size="icon"
            className="relative rounded-full w-10 h-10 bg-muted/50 hover:bg-muted"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1"
              >
                <Badge
                  variant="destructive"
                  className="h-5 min-w-5 px-1.5 text-xs flex items-center justify-center rounded-full"
                >
                  {unreadCount > 9 ? "9+" : unreadCount}
                </Badge>
              </motion.div>
            )}
          </Button>
        </motion.div>
      </PopoverTrigger>
      <PopoverContent
        className="w-[380px] p-0"
        align="end"
        sideOffset={8}
      >
        <div className="flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="font-semibold text-lg">Notifications</h3>
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleMarkAllAsRead}
                className="text-xs h-8"
              >
                <CheckCheck className="w-4 h-4 mr-1" />
                Mark all read
              </Button>
            )}
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 p-3 border-b bg-muted/30">
            {(["all", "check-in", "payment", "announcement"] as const).map((tab) => (
              <Button
                key={tab}
                variant={filter === tab ? "default" : "ghost"}
                size="sm"
                onClick={() => setFilter(tab)}
                className="flex-1 h-8 text-xs capitalize"
              >
                {tab === "check-in" ? "Check-ins" : tab}
              </Button>
            ))}
          </div>

          {/* Notifications List */}
          <ScrollArea className="h-[400px]">
            {filteredNotifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                <Bell className="w-12 h-12 text-muted-foreground/50 mb-3" />
                <p className="text-sm font-medium">No notifications</p>
                <p className="text-xs text-muted-foreground mt-1">
                  You're all caught up!
                </p>
              </div>
            ) : (
              <div className="divide-y">
                {filteredNotifications.map((notification, index) => {
                  const Icon = notificationIcons[notification.type];
                  return (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.03 }}
                      className={`group relative p-4 hover:bg-muted/50 transition-colors ${
                        !notification.read ? "bg-primary/5" : ""
                      }`}
                    >
                      <div className="flex gap-3">
                        {/* Icon */}
                        <div
                          className={`flex-shrink-0 w-10 h-10 rounded-full bg-muted flex items-center justify-center ${
                            notificationColors[notification.type]
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                              <p className="text-sm font-medium leading-tight">
                                {notification.title}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                {notification.description}
                              </p>
                              <p className="text-xs text-muted-foreground mt-2">
                                {formatTimestamp(notification.timestamp)}
                              </p>
                            </div>

                            {/* Unread indicator */}
                            {!notification.read && (
                              <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary mt-1" />
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Action buttons on hover */}
                      <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {!notification.read && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleMarkAsRead(notification.id)}
                            className="h-7 w-7 rounded-full"
                            title="Mark as read"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveNotification(notification.id)}
                          className="h-7 w-7 rounded-full text-muted-foreground hover:text-destructive"
                          title="Remove"
                        >
                          <X className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </ScrollArea>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="p-3 border-t bg-muted/30">
              <Link to="/notifications" onClick={() => setOpen(false)}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full text-xs h-8"
                >
                  View all notifications
                </Button>
              </Link>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
