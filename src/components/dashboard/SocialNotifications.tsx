import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Bell,
  UserPlus,
  TrendingUp,
  Trophy,
  Calendar,
  UserCheck,
  MessageCircle,
  Check,
  X,
} from "lucide-react";
import {
  mockSocialNotifications,
  getMemberById,
  type SocialNotification,
} from "@/lib/mockSocialData";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface SocialNotificationsProps {
  currentUserId?: string;
  className?: string;
}

export function SocialNotifications({
  className,
}: SocialNotificationsProps) {
  const [notifications, setNotifications] = useState<SocialNotification[]>(
    mockSocialNotifications
  );

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getNotificationIcon = (type: SocialNotification["type"]) => {
    switch (type) {
      case "partner_request":
        return <UserPlus className="h-4 w-4 text-blue-600" />;
      case "position_change":
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case "achievement":
        return <Trophy className="h-4 w-4 text-yellow-600" />;
      case "event_invite":
        return <Calendar className="h-4 w-4 text-purple-600" />;
      case "new_follower":
        return <UserCheck className="h-4 w-4 text-pink-600" />;
      case "mention":
        return <MessageCircle className="h-4 w-4 text-orange-600" />;
    }
  };

  const getRelativeTime = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days}d ago`;
    return new Date(timestamp).toLocaleDateString();
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const handleMarkAsRead = (notificationId: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n._id === notificationId ? { ...n, read: true } : n))
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    toast.success("All notifications marked as read");
  };

  const handleAcceptPartnerRequest = (
    notificationId: string,
    userName: string
  ) => {
    handleMarkAsRead(notificationId);
    toast.success(`You and ${userName} are now training partners!`);
  };

  const handleDeclinePartnerRequest = (
    notificationId: string,
    userName: string
  ) => {
    setNotifications((prev) => prev.filter((n) => n._id !== notificationId));
    toast.info(`Partner request from ${userName} declined`);
  };

  const handleNotificationClick = (notification: SocialNotification) => {
    handleMarkAsRead(notification._id);
    if (notification.actionUrl) {
      // Navigate to the action URL
      console.log("Navigate to:", notification.actionUrl);
    }
  };

  return (
    <Card className={cn("h-full flex flex-col", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <CardTitle className="text-xl flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Social Notifications
              {unreadCount > 0 && (
                <Badge variant="destructive" className="ml-1">
                  {unreadCount}
                </Badge>
              )}
            </CardTitle>
            <CardDescription>
              Stay updated with your judo community
            </CardDescription>
          </div>
          {unreadCount > 0 && (
            <Button
              size="sm"
              variant="ghost"
              onClick={handleMarkAllAsRead}
              className="gap-2"
            >
              <Check className="h-4 w-4" />
              Mark all read
            </Button>
          )}
        </div>
      </CardHeader>

      <Separator />

      <CardContent className="flex-1 pt-4 pb-4 px-0 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="px-6 space-y-2">
            <AnimatePresence mode="popLayout">
              {notifications.map((notification, index) => {
                const relatedMember = notification.relatedUserId
                  ? getMemberById(notification.relatedUserId)
                  : null;

                return (
                  <motion.div
                    key={notification._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.03 }}
                    className={cn(
                      "flex items-start gap-3 p-3 rounded-lg transition-colors cursor-pointer",
                      !notification.read
                        ? "bg-primary/10 border-2 border-primary/50"
                        : "bg-card border hover:bg-accent/50"
                    )}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    {relatedMember ? (
                      <Avatar className="h-10 w-10 border-2 border-background shrink-0">
                        <AvatarImage
                          src={relatedMember.avatar}
                          alt={relatedMember.name}
                        />
                        <AvatarFallback className="text-xs font-semibold">
                          {getInitials(relatedMember.name)}
                        </AvatarFallback>
                      </Avatar>
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        {getNotificationIcon(notification.type)}
                      </div>
                    )}

                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-sm">
                            {notification.title}
                          </h4>
                          <p className="text-sm text-muted-foreground mt-0.5">
                            {notification.message}
                          </p>
                        </div>
                        {!notification.read && (
                          <div className="h-2 w-2 rounded-full bg-primary shrink-0 mt-1" />
                        )}
                      </div>

                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs text-muted-foreground">
                          {getRelativeTime(notification.createdAt)}
                        </span>

                        {notification.type === "partner_request" && !notification.read && (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="default"
                              className="h-7 text-xs gap-1"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAcceptPartnerRequest(
                                  notification._id,
                                  notification.relatedUserName || "this member"
                                );
                              }}
                            >
                              <Check className="h-3 w-3" />
                              Accept
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-7 text-xs gap-1"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeclinePartnerRequest(
                                  notification._id,
                                  notification.relatedUserName || "this member"
                                );
                              }}
                            >
                              <X className="h-3 w-3" />
                              Decline
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {notifications.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <Bell className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm">No notifications yet</p>
                <p className="text-xs mt-1">
                  You'll see updates about your training partners and activity here
                </p>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>

      {notifications.length > 0 && (
        <>
          <Separator />
          <div className="px-6 py-3">
            <p className="text-xs text-muted-foreground text-center">
              {unreadCount > 0
                ? `${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}`
                : "You're all caught up!"}
            </p>
          </div>
        </>
      )}
    </Card>
  );
}
