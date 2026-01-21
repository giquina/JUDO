import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Activity as ActivityIcon,
  UserPlus,
  Trophy,
  Calendar,
  Award,
  Megaphone,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { mockActivities, getTimeAgo, type Activity, type ActivityType } from "@/lib/mockActivityData";
import { staggerContainer } from "@/lib/animation-variants";

// Belt color mapping
const BELT_COLORS: Record<string, string> = {
  white: "bg-gray-100 text-gray-800 border-gray-300",
  yellow: "bg-yellow-100 text-yellow-800 border-yellow-300",
  orange: "bg-orange-100 text-orange-800 border-orange-300",
  green: "bg-green-100 text-green-800 border-green-300",
  blue: "bg-blue-500 text-white border-blue-600",
  brown: "bg-amber-800 text-white border-amber-900",
  black: "bg-gray-900 text-white border-gray-950",
};

// Icon mapping for activity types
const ACTIVITY_ICONS: Record<ActivityType, { icon: React.FC<{ className?: string }>; color: string; bgColor: string }> = {
  "check-in": {
    icon: CheckCircle2,
    color: "text-green-600 dark:text-green-400",
    bgColor: "bg-green-100 dark:bg-green-900/30",
  },
  "belt-promotion": {
    icon: Trophy,
    color: "text-yellow-600 dark:text-yellow-400",
    bgColor: "bg-yellow-100 dark:bg-yellow-900/30",
  },
  "new-member": {
    icon: UserPlus,
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-100 dark:bg-blue-900/30",
  },
  "event-signup": {
    icon: Calendar,
    color: "text-purple-600 dark:text-purple-400",
    bgColor: "bg-purple-100 dark:bg-purple-900/30",
  },
  achievement: {
    icon: Award,
    color: "text-orange-600 dark:text-orange-400",
    bgColor: "bg-orange-100 dark:bg-orange-900/30",
  },
  announcement: {
    icon: Megaphone,
    color: "text-pink-600 dark:text-pink-400",
    bgColor: "bg-pink-100 dark:bg-pink-900/30",
  },
};

// Single Activity Item Component
function ActivityItem({ activity, index }: { activity: Activity; index: number }) {
  const activityConfig = ACTIVITY_ICONS[activity.type];
  const Icon = activityConfig.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ x: 4, transition: { duration: 0.2 } }}
      className="group relative"
    >
      <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors duration-200 cursor-pointer">
        {/* Icon or Avatar */}
        <div className="relative flex-shrink-0">
          {activity.type === "check-in" || activity.type === "new-member" ? (
            <Avatar className="h-10 w-10 ring-2 ring-background">
              <AvatarFallback className={`${activityConfig.bgColor} ${activityConfig.color} font-semibold text-sm`}>
                {activity.user.initials}
              </AvatarFallback>
            </Avatar>
          ) : (
            <div className={`h-10 w-10 rounded-full ${activityConfig.bgColor} flex items-center justify-center ring-2 ring-background`}>
              <Icon className={`h-5 w-5 ${activityConfig.color}`} />
            </div>
          )}

          {/* Connection line */}
          <div className="absolute left-1/2 top-12 w-px h-6 bg-border -translate-x-1/2 group-last:hidden" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 pt-1">
          <p className="text-sm leading-relaxed">
            <span className="font-semibold text-foreground">{activity.user.name}</span>{" "}
            <span className="text-muted-foreground">{activity.content}</span>
          </p>

          {/* Metadata badges */}
          {activity.metadata && (
            <div className="flex flex-wrap gap-2 mt-2">
              {activity.metadata.beltRank && (
                <Badge className={`${BELT_COLORS[activity.metadata.beltRank]} text-xs`}>
                  {activity.metadata.beltRank.charAt(0).toUpperCase() + activity.metadata.beltRank.slice(1)} Belt
                </Badge>
              )}
              {activity.metadata.achievementName && (
                <Badge variant="secondary" className="text-xs">
                  <Award className="h-3 w-3 mr-1" />
                  {activity.metadata.achievementName}
                </Badge>
              )}
              {activity.metadata.eventName && (
                <Badge variant="outline" className="text-xs">
                  {activity.metadata.eventName}
                </Badge>
              )}
            </div>
          )}

          {/* Timestamp */}
          <p className="text-xs text-muted-foreground mt-1">{getTimeAgo(activity.timestamp)}</p>
        </div>
      </div>
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
        <ActivityIcon className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold mb-1">No activity yet</h3>
      <p className="text-sm text-muted-foreground text-center max-w-sm">
        When members check in, earn belts, or join events, you'll see their activity here.
      </p>
    </motion.div>
  );
}

// Loading Skeleton Component
// Main Activity Feed Component
export default function ActivityFeed() {
  const [displayCount, setDisplayCount] = useState(15);
  const [isLoading, setIsLoading] = useState(false);

  const displayedActivities = mockActivities.slice(0, displayCount);
  const hasMore = displayCount < mockActivities.length;

  const handleLoadMore = () => {
    setIsLoading(true);
    // Simulate loading
    setTimeout(() => {
      setDisplayCount(prev => Math.min(prev + 10, mockActivities.length));
      setIsLoading(false);
    }, 800);
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <ActivityIcon className="h-5 w-5 text-primary" />
              Activity Feed
            </CardTitle>
            <CardDescription>Real-time club activity</CardDescription>
          </div>
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <div className="h-2 w-2 rounded-full bg-green-500" />
          </motion.div>
        </div>
      </CardHeader>
      <CardContent>
        {mockActivities.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            <ScrollArea className="h-[600px] pr-4">
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="space-y-1"
              >
                <AnimatePresence mode="popLayout">
                  {displayedActivities.map((activity, index) => (
                    <ActivityItem key={activity._id} activity={activity} index={index} />
                  ))}
                </AnimatePresence>
              </motion.div>

              {/* Load More Button */}
              {hasMore && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-6 flex justify-center"
                >
                  <Button
                    variant="outline"
                    onClick={handleLoadMore}
                    disabled={isLoading}
                    className="w-full sm:w-auto"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Loading...
                      </>
                    ) : (
                      <>
                        Load More
                        <span className="ml-2 text-xs text-muted-foreground">
                          ({mockActivities.length - displayCount} remaining)
                        </span>
                      </>
                    )}
                  </Button>
                </motion.div>
              )}

              {/* End of feed message */}
              {!hasMore && displayedActivities.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-6 text-center"
                >
                  <p className="text-sm text-muted-foreground">
                    You've reached the end of the activity feed
                  </p>
                </motion.div>
              )}
            </ScrollArea>

            {/* Activity Stats */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-4 pt-4 border-t grid grid-cols-3 gap-4"
            >
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">
                  {mockActivities.filter(a => a.type === "check-in").length}
                </p>
                <p className="text-xs text-muted-foreground">Check-ins</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-yellow-600">
                  {mockActivities.filter(a => a.type === "belt-promotion").length}
                </p>
                <p className="text-xs text-muted-foreground">Promotions</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">
                  {mockActivities.filter(a => a.type === "new-member").length}
                </p>
                <p className="text-xs text-muted-foreground">New Members</p>
              </div>
            </motion.div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
