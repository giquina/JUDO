import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrainingPartners } from "./TrainingPartners";
import { Leaderboard } from "./Leaderboard";
import { CommunityFeed } from "./CommunityFeed";
import { SocialNotifications } from "./SocialNotifications";
import { Users, Trophy, MessageCircle, Bell } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * SocialFeaturesDemo
 *
 * A demo page showcasing all social features in the JUDO app.
 * This can be used as a reference for integrating social components
 * into your dashboard or as a standalone social hub page.
 *
 * Usage:
 * ```tsx
 * import { SocialFeaturesDemo } from "@/components/dashboard/SocialFeaturesDemo";
 *
 * function SocialPage() {
 *   return <SocialFeaturesDemo currentUserId="mem-001" />;
 * }
 * ```
 */

interface SocialFeaturesDemoProps {
  currentUserId?: string;
  className?: string;
  layout?: "tabbed" | "grid";
}

export function SocialFeaturesDemo({
  currentUserId = "mem-001",
  className,
  layout = "tabbed",
}: SocialFeaturesDemoProps) {
  const [activeView, setActiveView] = useState("partners");

  if (layout === "grid") {
    return (
      <div className={cn("container mx-auto p-6 space-y-6", className)}>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Social Hub</h1>
          <p className="text-muted-foreground mt-2">
            Connect with fellow judokas, track progress, and stay engaged
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Training Partners */}
          <div className="lg:row-span-2">
            <TrainingPartners currentUserId={currentUserId} />
          </div>

          {/* Leaderboard */}
          <div className="lg:row-span-2">
            <Leaderboard currentUserId={currentUserId} />
          </div>

          {/* Community Feed */}
          <div className="lg:col-span-2 min-h-[600px]">
            <CommunityFeed currentUserId={currentUserId} />
          </div>

          {/* Social Notifications */}
          <div className="lg:col-span-2 min-h-[400px]">
            <SocialNotifications currentUserId={currentUserId} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("container mx-auto p-6", className)}>
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Social Hub</h1>
        <p className="text-muted-foreground mt-2">
          Connect with fellow judokas, track progress, and stay engaged
        </p>
      </div>

      <Tabs value={activeView} onValueChange={setActiveView} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-flex">
          <TabsTrigger value="partners" className="gap-2">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Training Partners</span>
            <span className="sm:hidden">Partners</span>
          </TabsTrigger>
          <TabsTrigger value="leaderboard" className="gap-2">
            <Trophy className="h-4 w-4" />
            <span className="hidden sm:inline">Leaderboard</span>
            <span className="sm:hidden">Ranks</span>
          </TabsTrigger>
          <TabsTrigger value="feed" className="gap-2">
            <MessageCircle className="h-4 w-4" />
            <span className="hidden sm:inline">Community</span>
            <span className="sm:hidden">Feed</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Notifications</span>
            <span className="sm:hidden">Alerts</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="partners" className="min-h-[600px]">
          <TrainingPartners currentUserId={currentUserId} />
        </TabsContent>

        <TabsContent value="leaderboard" className="min-h-[600px]">
          <Leaderboard currentUserId={currentUserId} />
        </TabsContent>

        <TabsContent value="feed" className="min-h-[600px]">
          <CommunityFeed currentUserId={currentUserId} />
        </TabsContent>

        <TabsContent value="notifications" className="min-h-[600px]">
          <SocialNotifications currentUserId={currentUserId} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

/**
 * Compact Social Dashboard Widget
 *
 * A compact version suitable for embedding in a main dashboard.
 * Shows a quick overview of social features with links to full views.
 */
interface SocialDashboardWidgetProps {
  currentUserId?: string;
  className?: string;
  onNavigate?: (section: string) => void;
}

export function SocialDashboardWidget({
  currentUserId = "mem-001",
  className,
}: SocialDashboardWidgetProps) {
  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4", className)}>
      <div className="h-[400px]">
        <TrainingPartners currentUserId={currentUserId} />
      </div>
      <div className="h-[400px]">
        <Leaderboard currentUserId={currentUserId} />
      </div>
      <div className="md:col-span-2 h-[400px]">
        <CommunityFeed currentUserId={currentUserId} />
      </div>
    </div>
  );
}
