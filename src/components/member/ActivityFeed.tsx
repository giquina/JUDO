import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import {
  Activity,
  UserCheck,
  Trophy,
  MessageCircle,
  Megaphone,
  TrendingUp,
  Clock,
} from "lucide-react";

interface ActivityItem {
  id: string;
  type: "check-in" | "achievement" | "announcement" | "friend" | "progression";
  title: string;
  description: string;
  timestamp: number;
  user?: {
    name: string;
    avatar?: string;
  };
  metadata?: any;
}

interface ActivityFeedProps {
  activities: ActivityItem[];
  maxHeight?: string;
}

const ACTIVITY_ICONS = {
  "check-in": UserCheck,
  achievement: Trophy,
  announcement: Megaphone,
  friend: MessageCircle,
  progression: TrendingUp,
};

const ACTIVITY_COLORS = {
  "check-in": "text-blue-500",
  achievement: "text-yellow-500",
  announcement: "text-purple-500",
  friend: "text-green-500",
  progression: "text-orange-500",
};

export default function ActivityFeed({
  activities,
  maxHeight = "500px",
}: ActivityFeedProps) {
  const getTimeAgo = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);

    if (seconds < 60) return "just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    return new Date(timestamp).toLocaleDateString();
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          Activity Feed
        </CardTitle>
        <CardDescription>Recent club activity and updates</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea style={{ maxHeight }}>
          <div className="space-y-4">
            {activities.length === 0 ? (
              <div className="text-center py-8">
                <Activity className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">No recent activity</p>
              </div>
            ) : (
              activities.map((activity, index) => {
                const Icon = ACTIVITY_ICONS[activity.type];
                const iconColor = ACTIVITY_COLORS[activity.type];

                return (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer group"
                  >
                    {/* Icon or Avatar */}
                    <div className="flex-shrink-0">
                      {activity.user ? (
                        <Avatar className="h-10 w-10 border-2 border-muted">
                          <AvatarImage src={activity.user.avatar} />
                          <AvatarFallback>
                            {getInitials(activity.user.name)}
                          </AvatarFallback>
                        </Avatar>
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center group-hover:bg-muted/70 transition-colors">
                          <Icon className={`h-5 w-5 ${iconColor}`} />
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-medium leading-tight">
                          {activity.title}
                        </p>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground flex-shrink-0">
                          <Clock className="h-3 w-3" />
                          {getTimeAgo(activity.timestamp)}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {activity.description}
                      </p>

                      {/* Metadata */}
                      {activity.metadata && (
                        <div className="flex items-center gap-2 mt-2">
                          {activity.metadata.badge && (
                            <Badge variant="outline" className="text-xs">
                              {activity.metadata.badge}
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        </ScrollArea>

        {activities.length > 0 && (
          <div className="mt-4 pt-4 border-t">
            <Button variant="ghost" className="w-full" size="sm">
              View All Activity
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
